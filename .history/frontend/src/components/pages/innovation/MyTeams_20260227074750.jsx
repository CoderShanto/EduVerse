import React, { useContext, useEffect, useMemo, useState } from 'react'
import Layout from '../../../common/Layout'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { apiUrl, token as configToken } from '../../../common/Config'
import { AuthContext } from '../../../context/Auth'

const MyTeams = () => {
  const { user } = useContext(AuthContext)
  const authToken = useMemo(() => user?.token || user?.user?.token || configToken, [user])

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [meta, setMeta] = useState(null)

  const fetchMyTeams = async (page = 1) => {
    try {
      setLoading(true)
      const res = await fetch(`${apiUrl}/innovation/my-teams?page=${page}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      })
      const result = await res.json()
      if (result.status === 200) {
        setItems(result.data?.data || [])
        setMeta({
          current_page: result.data?.current_page || 1,
          last_page: result.data?.last_page || 1,
          total: result.data?.total || 0,
        })
      } else {
        toast.error(result.message || 'Failed to load my teams')
      }
    } catch (e) {
      console.log(e)
      toast.error('Server error loading my teams')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authToken) fetchMyTeams(1)
  }, [authToken])

  return (
    <Layout>
      <div className="container my-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 className="mb-0">Innovation • My Teams</h3>
            <small className="text-muted">Ideas you joined (team workspace stage).</small>
          </div>
          <Link to="/innovation" className="btn btn-outline-dark">Back to Hub</Link>
        </div>

        {loading ? (
          <div className="text-center py-5">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-5 text-muted">
            You haven’t joined any teams yet. Join after an idea is selected.
          </div>
        ) : (
          <div className="row g-3">
            {items.map((idea) => (
              <div className="col-md-6" key={idea.id}>
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-secondary">{idea.problem?.category || 'General'}</span>
                      <span className={`badge ${idea.is_selected ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {idea.is_selected ? 'Selected' : 'Building'}
                      </span>
                    </div>

                    <h5 className="mt-2 mb-1">{idea.title}</h5>

                    <div className="text-muted" style={{ fontSize: 13 }}>
                      Problem: <strong>{idea.problem?.title || '—'}</strong> • Status: <strong>{idea.problem?.status || '-'}</strong>
                    </div>

                    <div className="mt-3">
                      <small className="text-muted">Team members:</small>
                      <div className="mt-1 d-flex flex-wrap gap-2">
                        {(idea.members_users || idea.membersUsers || []).slice(0, 6).map((m) => (
                          <span key={m.id} className="badge bg-light text-dark">
                            {m.name}
                          </span>
                        ))}
                        {(idea.members_users || idea.membersUsers || []).length > 6 && (
                          <span className="badge bg-light text-dark">+ more</span>
                        )}
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <small className="text-muted">
                        Votes: <strong>{idea.votes_count ?? 0}</strong>
                      </small>

                      {/* Next module will be workspace */}
                      <button className="btn btn-outline-primary btn-sm" disabled>
                        Workspace →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {meta && meta.last_page > 1 && (
          <div className="d-flex justify-content-center gap-2 mt-4">
            <button className="btn btn-outline-secondary" disabled={meta.current_page <= 1} onClick={() => fetchMyTeams(meta.current_page - 1)}>
              Prev
            </button>
            <div className="align-self-center">
              Page {meta.current_page} of {meta.last_page}
            </div>
            <button className="btn btn-outline-secondary" disabled={meta.current_page >= meta.last_page} onClick={() => fetchMyTeams(meta.current_page + 1)}>
              Next
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default MyTeams