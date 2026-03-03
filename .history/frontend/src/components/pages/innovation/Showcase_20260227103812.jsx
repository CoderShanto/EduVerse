import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { apiUrl } from '../../common/Config'
import { AuthContext } from '../../context/Auth'

const Showcase = () => {
  const { user } = useContext(AuthContext)
  const authToken = user?.token || user?.user?.token

  const [items, setItems] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchShowcases = async (page = 1) => {
    try {
      setLoading(true)
      const res = await fetch(`${apiUrl}/showcases?page=${page}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      })
      const result = await res.json()

      if (result.status === 200) {
        setItems(result.data.data || [])
        setMeta({
          current_page: result.data.current_page,
          last_page: result.data.last_page,
        })
      } else {
        toast.error('Failed to load showcase')
      }
    } catch (e) {
      console.log(e)
      toast.error('Server error loading showcase')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authToken) fetchShowcases(1)
  }, [authToken])

  return (
    <Layout>
      <div className="container my-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 className="mb-0">Innovation • Showcase</h3>
            <small className="text-muted">Completed solutions validated by admin/instructor.</small>
          </div>
          <Link to="/account/innovation" className="btn btn-outline-secondary btn-sm">
            Back to Hub
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-5 text-muted">No showcase items yet.</div>
        ) : (
          <div className="row g-3">
            {items.map((s) => (
              <div className="col-md-6 col-lg-4" key={s.id}>
                <div className="card h-100">
                  {s.cover_image ? (
                    <img
                      src={s.cover_image}
                      alt="cover"
                      style={{ height: 170, objectFit: 'cover' }}
                      className="card-img-top"
                    />
                  ) : null}

                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-dark">Completed</span>
                      {s.score ? <span className="badge bg-warning text-dark">{s.score}/10</span> : null}
                    </div>

                    <h6 className="mt-2 mb-1">{s.idea?.title}</h6>
                    <div className="text-muted" style={{ fontSize: 13 }}>
                      Problem: {s.idea?.problem?.title}
                    </div>

                    <p className="mt-2 text-muted" style={{ minHeight: 48 }}>
                      {String(s.summary || '').slice(0, 90)}
                      {String(s.summary || '').length > 90 ? '...' : ''}
                    </p>

                    <Link to={`/account/innovation/showcase/${s.id}`} className="btn btn-outline-primary btn-sm">
                      View →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {meta && meta.last_page > 1 && (
          <div className="d-flex justify-content-center gap-2 mt-4">
            <button
              className="btn btn-outline-secondary"
              disabled={meta.current_page <= 1}
              onClick={() => fetchShowcases(meta.current_page - 1)}
            >
              Prev
            </button>
            <div className="align-self-center">
              Page {meta.current_page} of {meta.last_page}
            </div>
            <button
              className="btn btn-outline-secondary"
              disabled={meta.current_page >= meta.last_page}
              onClick={() => fetchShowcases(meta.current_page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Showcase