import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import UserSidebar from '../../common/UserSidebar'
import toast from 'react-hot-toast'
import { apiUrl } from '../../common/Config'
import { AuthContext } from '../../context/Auth'
import { Link } from 'react-router-dom'

const Certificates = () => {
  const { user } = useContext(AuthContext)
  const authToken = user?.token || user?.user?.token

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${apiUrl}/certificates`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      })
      const result = await res.json()

      if (result.status === 200) {
        setItems(result.data || [])
      } else {
        toast.error(result.message || 'Failed to load certificates')
      }
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
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <div>
                <h3 className="mb-0">Certificates</h3>
                <small className="text-muted">
                  Certificates are automatically issued when your course progress reaches 100%.
                </small>
              </div>
              <span className="badge bg-dark">{items.length}</span>
            </div>

            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div className="text-muted">
                  Tip: Add your certificates to your CV/Portfolio and share proof links.
                </div>
                <Link className="btn btn-sm btn-outline-primary" to="/account/student/my-learning">
                  Go to My Courses →
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">Loading...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-5 text-muted">
                No certificates yet. Complete a course to unlock your first one.
              </div>
            ) : (
              <div className="row g-3">
                {items.map((c) => (
                  <div className="col-md-6" key={c.id}>
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
                      <div className="card-body">
                        <div className="d-flex gap-3">
                          {/* course thumb */}
                          <div
                            style={{
                              width: 64,
                              height: 64,
                              borderRadius: 14,
                              background: '#f3f4f6',
                              overflow: 'hidden',
                              flexShrink: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 24,
                            }}
                          >
                            {c.course?.course_small_image ? (
                              <img
                                src={c.course.course_small_image}
                                alt=""
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              '🎓'
                            )}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="d-flex justify-content-between align-items-start gap-2">
                              <div className="fw-bold" style={{ fontSize: 16 }}>
                                {c.course?.title || 'Course'}
                              </div>

                              <span className={`badge ${c.status === 'issued' ? 'bg-success' : 'bg-danger'}`}>
                                {c.status}
                              </span>
                            </div>

                            <div className="text-muted mt-1" style={{ fontSize: 13 }}>
                              Certificate No: <b>{c.certificate_no}</b>
                            </div>

                            <div className="text-muted" style={{ fontSize: 13 }}>
                              Issued: {c.issued_at ? new Date(c.issued_at).toLocaleString() : '—'}
                            </div>

                            <div className="d-flex gap-2 flex-wrap mt-3">
                              {c.pdf_url ? (
                               <a
  className="btn btn-sm btn-primary"
  href={`${apiUrl}/certificates/${c.id}/download`}
  target="_blank"
  rel="noreferrer"
>
  Download PDF
</a>
                              ) : (
                                <button className="btn btn-sm btn-outline-secondary" disabled>
                                  PDF not generated yet
                                </button>
                              )}
                            </div>

                            <div className="text-muted mt-2" style={{ fontSize: 12 }}>
                              Your certificate is stored permanently even if the course updates later.
                            </div>
                          </div>
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