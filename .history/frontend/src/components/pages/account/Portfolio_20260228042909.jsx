import React, { useContext, useEffect, useMemo, useState } from 'react'
import Layout from '../../common/Layout'
import UserSidebar from '../../common/UserSidebar'
import toast from 'react-hot-toast'
import { apiUrl } from '../../common/Config'
import { AuthContext } from '../../context/Auth'

const Portfolio = () => {
  const { user } = useContext(AuthContext)
  const authToken = user?.token || user?.user?.token
  const myId = user?.user?.id || user?.id

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  const initials = useMemo(() => {
    const name = (user?.user?.name || user?.name || 'Student').trim()
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  }, [user])

  const fetchPortfolio = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${apiUrl}/portfolio/me`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${authToken}` },
      })
      const result = await res.json()
      if (result.status === 200) setData(result.data)
      else toast.error(result.message || 'Failed to load portfolio')
    } catch (e) {
      console.log(e)
      toast.error('Server error loading portfolio')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authToken) fetchPortfolio()
    // eslint-disable-next-line
  }, [authToken])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(data?.public_url || '')
      toast.success('Portfolio link copied!')
    } catch {
      toast.error('Copy failed (browser blocked).')
    }
  }

  const Stat = ({ icon, label, value }) => (
    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
      <div className="card-body">
        <div className="d-flex align-items-center gap-2">
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: '#f3f4f6', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 18
          }}>
            {icon}
          </div>
          <div>
            <div className="fw-bold" style={{ fontSize: 22 }}>{value}</div>
            <div className="text-muted" style={{ fontSize: 13 }}>{label}</div>
          </div>
        </div>
      </div>
    </div>
  )

  const ProgressBar = ({ pct }) => (
    <div style={{ background: '#eee', borderRadius: 999, height: 8, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#06b6d4,#3b82f6)' }} />
    </div>
  )

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
                <h3 className="mb-0">Portfolio</h3>
                <small className="text-muted">Your learning + innovation achievements in one public profile.</small>
              </div>

              {!loading && data?.public_url && (
                <div className="d-flex gap-2">
                  <a className="btn btn-outline-dark btn-sm" href={data.public_url} target="_blank" rel="noreferrer">
                    View Public
                  </a>
                  <button className="btn btn-dark btn-sm" onClick={copyLink}>
                    Copy Link
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="text-center py-5">Loading...</div>
            ) : !data ? (
              <div className="alert alert-danger">Portfolio data not found.</div>
            ) : (
              <>
                {/* Header card */}
                <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 18 }}>
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                      <div className="d-flex align-items-center gap-3">
                        <div style={{
                          width: 64, height: 64, borderRadius: 18,
                          background: 'linear-gradient(135deg,#111827,#2563eb)',
                          color: '#fff', fontWeight: 900,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 22
                        }}>
                          {initials}
                        </div>
                        <div>
                          <div className="fw-bold" style={{ fontSize: 20 }}>{data.user?.name}</div>
                          <div className="text-muted" style={{ fontSize: 13 }}>
                            Role: <span className="badge bg-light text-dark" style={{ border: '1px solid #eee' }}>{data.user?.role}</span>
                          </div>
                          <div className="text-muted" style={{ fontSize: 13, marginTop: 4 }}>
                            Shareable profile that highlights both course completion and real project building.
                          </div>
                        </div>
                      </div>

                      <div className="text-muted" style={{ fontSize: 12 }}>
                        Public URL:
                        <div className="fw-semibold" style={{ wordBreak: 'break-all' }}>
                          {data.public_url}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="row g-3 mb-3">
                  <div className="col-md-4">
                    <Stat icon="🎓" label="Completed Courses" value={data.stats?.completed_courses || 0} />
                  </div>
                  <div className="col-md-4">
                    <Stat icon="🚀" label="Innovation Showcases" value={data.stats?.innovation_showcases || 0} />
                  </div>
                  <div className="col-md-4">
                    <Stat icon="📌" label="Courses In Progress" value={data.stats?.in_progress_courses || 0} />
                  </div>
                </div>

                {/* Completed Courses */}
                <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 18 }}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="mb-0">Completed Courses</h5>
                      <span className="badge bg-success">{(data.courses?.completed || []).length}</span>
                    </div>

                    {(data.courses?.completed || []).length === 0 ? (
                      <div className="text-muted">No completed courses yet.</div>
                    ) : (
                      <div className="row g-3">
                        {data.courses.completed.map((c) => (
                          <div className="col-md-6" key={c.course_id}>
                            <div className="border rounded p-3 h-100" style={{ borderColor: '#eee' }}>
                              <div className="d-flex gap-3">
                                <div style={{
                                  width: 52, height: 52, borderRadius: 12,
                                  background: '#f3f4f6', overflow: 'hidden',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                  {c.course_small_image
                                    ? <img src={c.course_small_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : <span style={{ fontSize: 20 }}>📘</span>
                                  }
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div className="fw-semibold" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {c.title}
                                  </div>
                                  <div className="text-muted" style={{ fontSize: 13 }}>
                                    {c.completed_lessons}/{c.total_lessons} lessons • {c.progress}% complete
                                  </div>
                                  <div className="mt-2">
                                    <ProgressBar pct={100} />
                                  </div>
                                  <div className="mt-2">
                                    <span className="badge bg-success">Completed</span>
                                    <span className="badge bg-light text-dark ms-2" style={{ border: '1px solid #eee' }}>
                                      Certificate Eligible
                                    </span>
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

                {/* In Progress */}
                <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 18 }}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="mb-0">Learning In Progress</h5>
                      <span className="badge bg-primary">{(data.courses?.in_progress || []).length}</span>
                    </div>

                    {(data.courses?.in_progress || []).length === 0 ? (
                      <div className="text-muted">No ongoing courses right now.</div>
                    ) : (
                      <div className="row g-3">
                        {data.courses.in_progress.map((c) => (
                          <div className="col-md-6" key={c.course_id}>
                            <div className="border rounded p-3 h-100" style={{ borderColor: '#eee' }}>
                              <div className="d-flex justify-content-between align-items-start">
                                <div className="fw-semibold">{c.title}</div>
                                <span className="badge bg-light text-dark" style={{ border: '1px solid #eee' }}>
                                  {c.progress}%
                                </span>
                              </div>
                              <div className="text-muted" style={{ fontSize: 13 }}>
                                {c.completed_lessons}/{c.total_lessons} lessons
                              </div>
                              <div className="mt-2">
                                <ProgressBar pct={c.progress} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Certificates */}
                <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 18 }}>
                  <div className="card-body">
                    <h5 className="mb-2">Certificates</h5>
                    <div className="text-muted" style={{ fontSize: 14 }}>
                      Certificates are available for completed courses.
                      <div className="mt-2">
                        <span className="badge bg-dark">Total Eligible: {data.certificates?.count || 0}</span>
                      </div>
                      <div className="mt-2" style={{ fontSize: 13 }}>
                        {data.certificates?.note}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Innovation Showcases */}
                <div className="card border-0 shadow-sm" style={{ borderRadius: 18 }}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="mb-0">Innovation Showcases</h5>
                      <span className="badge bg-success">{(data.innovation?.showcases || []).length}</span>
                    </div>

                    {(data.innovation?.showcases || []).length === 0 ? (
                      <div className="text-muted">No innovation showcases published yet.</div>
                    ) : (
                      <div className="row g-3">
                        {data.innovation.showcases.map((s) => (
                          <div className="col-md-6" key={s.idea_id}>
                            <div className="border rounded h-100 overflow-hidden" style={{ borderColor: '#eee' }}>
                              <div style={{ height: 160, background: '#f3f4f6' }}>
                                {s.cover_image ? (
                                  <img src={s.cover_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                                    No cover image
                                  </div>
                                )}
                              </div>

                              <div className="p-3">
                                <div className="d-flex justify-content-between align-items-start gap-2">
                                  <div className="fw-semibold" style={{ fontSize: 15 }}>
                                    {s.idea_title}
                                  </div>
                                  <span className="badge bg-success">{s.score}/10</span>
                                </div>

                                <div className="text-muted" style={{ fontSize: 13 }}>
                                  Problem: <b>{s.problem_title}</b>
                                </div>

                                <div className="mt-2 text-muted" style={{ fontSize: 13 }}>
                                  {String(s.summary || '').slice(0, 120)}{String(s.summary || '').length > 120 ? '...' : ''}
                                </div>

                                <div className="d-flex flex-wrap gap-2 mt-2">
                                  {s.repo_url && <a className="btn btn-sm btn-outline-dark" href={s.repo_url} target="_blank" rel="noreferrer">GitHub</a>}
                                  {s.demo_url && <a className="btn btn-sm btn-outline-primary" href={s.demo_url} target="_blank" rel="noreferrer">Demo</a>}
                                  {s.report_url && <a className="btn btn-sm btn-outline-success" href={s.report_url} target="_blank" rel="noreferrer">Report</a>}
                                </div>

                                <div className="mt-2 text-muted" style={{ fontSize: 12 }}>
                                  Tech Stack: {s.tech_stack || '—'}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Portfolio