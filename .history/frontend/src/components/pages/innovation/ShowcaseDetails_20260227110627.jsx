import React, { useContext, useEffect, useMemo, useState } from 'react'
import Layout from '../../common/Layout'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { apiUrl } from '../../common/Config'
import { AuthContext } from '../../context/Auth'

const ShowcaseDetails = () => {
  const { id } = useParams()
  const { user } = useContext(AuthContext)

  const role = (user?.user?.role || '').toString().toLowerCase().trim()
  const isStaff = useMemo(() => ['admin', 'instructor'].includes(role), [role])

  const authToken = user?.token || user?.user?.token

  const [loading, setLoading] = useState(true)
  const [item, setItem] = useState(null)

  const fetchDetails = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${apiUrl}/showcases/${id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      })
      const result = await res.json()

      if (result.status === 200) {
        setItem(result.data)
      } else {
        toast.error(result.message || 'Failed to load showcase')
        setItem(null)
      }
    } catch (e) {
      console.log(e)
      toast.error('Server error loading showcase')
      setItem(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authToken && id) fetchDetails()
    // eslint-disable-next-line
  }, [authToken, id])

  const cover =
    item?.cover_image_resolved ||
    item?.cover_image ||
    item?.idea?.updates?.find((u) => u.proof_type === 'image' && u.proof_url)?.proof_url ||
    ''

  const idea = item?.idea
  const problem = idea?.problem
  const owner = idea?.user

  // gather useful proof links from updates (optional)
  const proofLinks = useMemo(() => {
    const updates = idea?.updates || []
    const links = []

    for (const u of updates) {
      if (!u?.proof_url) continue
      links.push({
        id: u.id,
        type: u.proof_type,
        url: u.proof_url,
      })
    }
    return links
  }, [idea])

  return (
    <Layout>
      <div className="container my-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 className="mb-0">Showcase • Details</h3>
            <small className="text-muted">
              <Link to="/account/innovation/showcase" style={{ textDecoration: 'none' }}>
                ← Back to Showcase
              </Link>
            </small>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-dark">Completed</span>
            {item?.score ? <span className="badge bg-warning text-dark">{item.score}/10</span> : null}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">Loading...</div>
        ) : !item ? (
          <div className="alert alert-danger">Showcase not found.</div>
        ) : (
          <div className="row g-3">
            {/* LEFT */}
            <div className="col-lg-8">
              <div className="card mb-3">
                {cover ? (
                  <img
                    src={cover}
                    alt="cover"
                    style={{ width: '100%', height: 300, objectFit: 'cover' }}
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                ) : null}

                <div className="card-body">
                  <div className="d-flex justify-content-between flex-wrap gap-2">
                    <span className="badge bg-secondary">{problem?.category || 'General'}</span>
                    <small className="text-muted">
                      Created by: <strong>{owner?.name || 'Unknown'}</strong>
                    </small>
                  </div>

                  <h4 className="mt-2 mb-1">{idea?.title}</h4>
                  <div className="text-muted">
                    <strong>Problem:</strong> {problem?.title}
                  </div>

                  {item?.tech_stack ? (
                    <div className="mt-2">
                      <span className="badge bg-light text-dark" style={{ border: '1px solid #eee' }}>
                        🧩 Tech Stack: {item.tech_stack}
                      </span>
                    </div>
                  ) : null}

                  <hr />

                  <h6 className="mb-2">Summary</h6>
                  <div className="text-muted" style={{ whiteSpace: 'pre-line' }}>
                    {item?.summary || 'No summary provided.'}
                  </div>

                  <hr />

                  <h6 className="mb-2">Project Links</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {item?.repo_url ? (
                      <a className="btn btn-outline-dark btn-sm" href={item.repo_url} target="_blank" rel="noreferrer">
                        💻 Repo
                      </a>
                    ) : null}
                    {item?.demo_url ? (
                      <a className="btn btn-outline-primary btn-sm" href={item.demo_url} target="_blank" rel="noreferrer">
                        ▶ Demo
                      </a>
                    ) : null}
                    {item?.report_url ? (
                      <a className="btn btn-outline-success btn-sm" href={item.report_url} target="_blank" rel="noreferrer">
                        📄 Report
                      </a>
                    ) : null}
                    {!item?.repo_url && !item?.demo_url && !item?.report_url ? (
                      <span className="text-muted" style={{ fontSize: 13 }}>
                        No main links provided.
                      </span>
                    ) : null}
                  </div>

                  {proofLinks.length > 0 ? (
                    <>
                      <hr />
                      <h6 className="mb-2">Build Log Proofs</h6>
                      <div className="d-flex flex-column gap-2">
                        {proofLinks.slice(0, 8).map((p) => (
                          <a
                            key={p.id}
                            href={p.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-decoration-none"
                          >
                            <div className="border rounded p-2 d-flex justify-content-between align-items-center">
                              <span>
                                {p.type === 'github'
                                  ? '💻 GitHub'
                                  : p.type === 'demo'
                                  ? '▶ Demo'
                                  : p.type === 'pdf'
                                  ? '📄 PDF'
                                  : p.type === 'image'
                                  ? '🖼 Image'
                                  : '🔗 Link'}{' '}
                                <span className="text-muted">• proof #{p.id}</span>
                              </span>
                              <span className="text-muted">Open →</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              {/* updates preview */}
              {idea?.updates?.length ? (
                <div className="card">
                  <div className="card-body">
                    <h5 className="mb-2">Build Log (Latest)</h5>
                    <div className="d-flex flex-column gap-3">
                      {[...idea.updates].slice(-5).reverse().map((u) => (
                        <div key={u.id} className="border rounded p-3">
                          <div className="d-flex justify-content-between flex-wrap gap-2">
                            <small className="text-muted">
                              <strong>{u.user?.name || 'Member'}</strong>
                            </small>
                            <small className="text-muted">
                              {u.created_at ? new Date(u.created_at).toLocaleString() : ''}
                            </small>
                          </div>

                          <div className="mt-2" style={{ whiteSpace: 'pre-line' }}>
                            {u.content}
                          </div>

                          {u.proof_url ? (
                            <div className="mt-2">
                              <a href={u.proof_url} target="_blank" rel="noreferrer">
                                {u.proof_type === 'pdf'
                                  ? '📄 Open PDF'
                                  : u.proof_type === 'image'
                                  ? '🖼 View Image'
                                  : '🔗 View Proof'}
                              </a>

                              {u.proof_type === 'image' ? (
                                <div className="mt-2">
                                  <img
                                    src={u.proof_url}
                                    alt="proof"
                                    style={{ maxWidth: '100%', borderRadius: 8, border: '1px solid #eee' }}
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                  />
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* RIGHT */}
            <div className="col-lg-4">
              {/* Team */}
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="mb-2">Team</h5>

                  {idea?.members?.length ? (
                    <div className="d-flex flex-wrap gap-2">
                      {idea.members.map((m) => (
                        <span key={m.id} className="badge bg-light text-dark" style={{ border: '1px solid #eee' }}>
                          {m.user?.name || 'Member'}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted" style={{ fontSize: 13 }}>
                      Team members not loaded. (If you want, I can adjust your API to include them.)
                    </div>
                  )}

                  <hr />
                  <div className="text-muted" style={{ fontSize: 13 }}>
                    <div><strong>Status:</strong> {idea?.status || (idea?.is_selected ? 'building' : 'proposed')}</div>
                    <div><strong>Votes:</strong> {idea?.votes_count ?? 0}</div>
                  </div>

                  <div className="mt-3">
                    <Link to={`/account/innovation/idea/${idea?.id}`} className="btn btn-outline-primary btn-sm">
                      Open Workspace →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Admin note */}
              {isStaff ? (
                <div className="alert alert-info">
                  <strong>Staff:</strong> You can republish/update this showcase by calling the publish endpoint again.
                </div>
              ) : null}

              {/* problem quick */}
              <div className="card">
                <div className="card-body">
                  <h6 className="mb-2">Problem</h6>
                  <div className="text-muted" style={{ fontSize: 13 }}>
                    <div><strong>{problem?.title}</strong></div>
                    <div className="mt-1" style={{ whiteSpace: 'pre-line' }}>
                      {String(problem?.description || '').slice(0, 220)}
                      {String(problem?.description || '').length > 220 ? '...' : ''}
                    </div>
                  </div>

                  <div className="mt-3">
                    <Link to={`/account/innovation/problem/${problem?.id}`} className="btn btn-outline-secondary btn-sm">
                      View Problem →
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default ShowcaseDetails