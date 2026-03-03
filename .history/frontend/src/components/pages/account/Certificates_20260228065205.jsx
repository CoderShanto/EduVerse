import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import UserSidebar from '../../common/UserSidebar'
import toast from 'react-hot-toast'
import { apiUrl } from '../../common/Config'
import { AuthContext } from '../../context/Auth'

const Certificates = () => {
  const { user } = useContext(AuthContext)
  const authToken = user?.token || user?.user?.token

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${apiUrl}/certificates`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${authToken}` },
      })
      const result = await res.json()
      if (result.status === 200) setItems(result.data || [])
      else toast.error(result.message || 'Failed to load certificates')
    } catch (e) {
      console.log(e)
      toast.error('Server error loading certificates')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authToken) load()
    // eslint-disable-next-line
  }, [authToken])

  return (
    <Layout>
      <div className="container my-4">
        <div className="row">
          <div className="col-lg-3 account-sidebar mb-4">
            <UserSidebar />
          </div>

          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h3 className="mb-0">Certificates</h3>
                <small className="text-muted">Certificates are issued automatically when you complete a course.</small>
              </div>
              <span className="badge bg-dark">{items.length}</span>
            </div>

            {loading ? (
              <div className="text-center py-5">Loading...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-5 text-muted">No certificates yet. Complete a course to unlock one.</div>
            ) : (
              <div className="row g-3">
                {items.map((c) => (
                  <div className="col-md-6" key={c.id}>
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
                      <div className="card-body">
                        <div className="d-flex align-items-start justify-content-between gap-2">
                          <div>
                            <div className="fw-bold">{c.course?.title || 'Course'}</div>
                            <div className="text-muted" style={{ fontSize: 13 }}>
                              Certificate No: <b>{c.certificate_no}</b>
                            </div>
                            <div className="text-muted" style={{ fontSize: 13 }}>
                              Issued: {c.issued_at || '—'}
                            </div>
                          </div>
                          <span className={`badge ${c.status === 'issued' ? 'bg-success' : 'bg-danger'}`}>
                            {c.status}
                          </span>
                        </div>

                        <div className="mt-3 d-flex gap-2 flex-wrap">
                          {c.pdf_url ? (
                            <a className="btn btn-sm btn-primary" href={c.pdf_url} target="_blank" rel="noreferrer">
                              Download PDF
                            </a>
                          ) : (
                            <button className="btn btn-sm btn-outline-secondary" disabled>
                              PDF not generated yet
                            </button>
                          )}
                        </div>

                        <div className="mt-2 text-muted" style={{ fontSize: 12 }}>
                          Tip: You can add this certificate link to your CV/portfolio later.
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Certificates