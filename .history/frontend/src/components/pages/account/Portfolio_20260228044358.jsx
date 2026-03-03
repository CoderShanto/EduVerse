import React, { useContext, useEffect, useMemo, useState } from 'react'
import Layout from '../../common/Layout'
import UserSidebar from '../../common/UserSidebar'
import toast from 'react-hot-toast'
import { apiUrl } from '../../common/Config'
import { AuthContext } from '../../context/Auth'
import { Link } from 'react-router-dom'

const Portfolio = () => {
  const { user } = useContext(AuthContext)
  const authToken = user?.token || user?.user?.token
  const fullName = (user?.user?.name || user?.name || 'Student').trim()

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  // UI-only About (later you can store in DB)
  const [about, setAbout] = useState(
    'Full-stack developer focused on building real products. Interested in learning systems, automation, and problem-driven innovation.'
  )

  const initials = useMemo(() => {
    const n = fullName || 'Student'
    return n.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  }, [fullName])

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

  const ProgressBar = ({ pct }) => (
    <div style={{ background: '#f1f5f9', borderRadius: 999, height: 9, overflow: 'hidden' }}>
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          background: 'linear-gradient(90deg,#06b6d4,#3b82f6)',
          transition: 'width .5s ease',
        }}
      />
    </div>
  )

  const StatPill = ({ icon, label, value, tone = 'dark' }) => {
    const map = {
      dark: 'bg-dark',
      success: 'bg-success',
      primary: 'bg-primary',
      warning: 'bg-warning text-dark',
      info: 'bg-info text-dark',
    }
    return (
      <div className="d-flex align-items-center gap-2">
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span className="text-muted" style={{ fontSize: 13 }}>{label}</span>
        <span className={`badge ${map[tone] || 'bg-dark'}`} style={{ fontSize: 13, padding: '7px 10px', borderRadius: 999 }}>
          {value}
        </span>
      </div>
    )
  }

  const skillChips = useMemo(() => {
    const list = (data?.innovation?.showcases || [])
      .map(s => String(s.tech_stack || '').split(',').map(x => x.trim()).filter(Boolean))
      .flat()

    // unique
    const unique = Array.from(new Set(list.map(x => x.toLowerCase())))
      .map(x => list.find(y => y.toLowerCase() === x) || x)
      .slice(0, 14)

    // add your core stack (optional)
    const base = ['Laravel', 'React', 'MySQL', 'REST API', 'Sanctum']
    const baseUnique = base.filter(b => !unique.map(x => x.toLowerCase()).includes(b.toLowerCase()))

    return [...baseUnique, ...unique].slice(0, 14)
  }, [data])

  const topShowcase = useMemo(() => {
    const arr = data?.innovation?.showcases || []
    if (!arr.length) return null
    return [...arr].sort((a, b) => Number(b.score || 0) - Number(a.score || 0))[0]
  }, [data])

  const completedCourses = data?.courses?.completed || []
  const inProgressCourses = data?.courses?.in_progress || []
  const showcases = data?.innovation?.showcases || []

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
                <small className="text-muted">
                  A shareable profile of your learning achievements + real innovation projects.
                </small>
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
                {/* HERO PROFILE HEADER */}
                <div
                  className="card border-0 shadow-sm mb-3"
                  style={{
                    borderRadius: 20,
                    overflow: 'hidden',
                  }}
                >
                  {/* cover */}
                  <div
                    style={{
                      height: 140,
                      background:
                        'radial-gradient(circle at 30% 20%, rgba(59,130,246,0.45), rgba(17,24,39,1)), linear-gradient(135deg,#111827,#2563eb)',
                    }}
                  />
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                      <div className="d-flex align-items-center gap-3" style={{ marginTop: -44 }}>
                        {/* avatar */}
                        <div
                          style={{
                            width: 76,
                            height: 76,
                            borderRadius: 20,
                            background: 'linear-gradient(135deg,#0f172a,#2563eb)',
                            color: '#fff',
                            fontWeight: 900,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 26,
                            border: '4px solid #fff',
                            boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
                          }}
                        >
                          {initials}
                        </div>

                        <div>
                          <div className="fw-bold" style={{ fontSize: 22 }}>
                            {data.user?.name}
                          </div>
                          <div className="text-muted" style={{ fontSize: 13 }}>
                            Role:{' '}
                            <span className="badge bg-light text-dark" style={{ border: '1px solid #eee' }}>
                              {data.user?.role}
                            </span>
                            <span className="ms-2 badge bg-light text-dark" style={{ border: '1px solid #eee' }}>
                              Public Portfolio
                            </span>
                          </div>

                          <div className="mt-2 d-flex flex-wrap gap-3">
                            <StatPill icon="🎓" label="Completed Courses" value={data.stats?.completed_courses || 0} tone="success" />
                            <StatPill icon="🚀" label="Showcases" value={data.stats?.innovation_showcases || 0} tone="primary" />
                            <StatPill icon="📌" label="In Progress" value={data.stats?.in_progress_courses || 0} tone="warning" />
                          </div>
                        </div>
                      </div>

                      <div className="text-muted" style={{ fontSize: 12, maxWidth: 340 }}>
                        <div className="fw-semibold">Share Link</div>
                        <div style={{ wordBreak: 'break-all' }}>{data.public_url}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ABOUT + SKILLS + HIGHLIGHTS */}
                <div className="row g-3 mb-3">
                  {/* About */}
                  <div className="col-md-7">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 18 }}>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h5 className="mb-0">About</h5>
                          <span className="badge bg-light text-dark" style={{ border: '1px solid #eee' }}>Editable</span>
                        </div>
                        <textarea
                          className="form-control"
                          rows={4}
                          value={about}
                          onChange={(e) => setAbout(e.target.value)}
                          style={{ resize: 'vertical' }}
                        />
                        <div className="text-muted mt-2" style={{ fontSize: 12 }}>
                          Tip: Write 2–3 lines: what you build + what you want (e.g., full-stack, backend, product).
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="col-md-5">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 18 }}>
                      <div className="card-body">
                        <h5 className="mb-2">Skills / Tech Stack</h5>
                        {skillChips.length === 0 ? (
                          <div className="text-muted">No tech stack found yet.</div>
                        ) : (
                          <div className="d-flex flex-wrap gap-2">
                            {skillChips.map((s, idx) => (
                              <span
                                key={idx}
                                className="badge bg-light text-dark"
                                style={{
                                  borderRadius: 999,
                                  padding: '8px 10px',
                                  border: '1px solid #eee',
                                  fontWeight: 700,
                                }}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-3 text-muted" style={{ fontSize: 12 }}>
                          These are auto-generated from your Showcase projects.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* HIGHLIGHTS */}
                <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 18 }}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                      <h5 className="mb-0">Highlights</h5>
                      <div className="text-muted" style={{ fontSize: 13 }}>
                        Your strongest achievements at a glance
                      </div>
                    </div>

                    <div className="row g-3 mt-1">
                      <div className="col-md-6">
                        <div className="border rounded p-3 h-100" style={{ borderColor: '#eee' }}>
                          <div className="fw-semibold">Top Innovation Project</div>
                          {topShowcase ? (
                            <>
                              <div className="text-muted" style={{ fontSize: 13 }}>
                                {topShowcase.idea_title}
                              </div>
                              <div className="mt-2 d-flex align-items-center gap-2">
                                <span className="badge bg-success">{topShowcase.score}/10</span>
                                <span className="text-muted" style={{ fontSize: 13 }}>
                                  Problem: <b>{topShowcase.problem_title}</b>
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="text-muted" style={{ fontSize: 13 }}>No showcase published yet.</div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="border rounded p-3 h-100" style={{ borderColor: '#eee' }}>
                          <div className="fw-semibold">Next Goal</div>
                          <div className="text-muted" style={{ fontSize: 13 }}>
                            Publish 1 Showcase + Complete 1 course to boost your portfolio.
                          </div>
                          <div className="mt-2 d-flex flex-wrap gap-2">
                            <span className="badge bg-primary">Build</span>
                            <span className="badge bg-success">Showcase</span>
                            <span className="badge bg-dark">Leaderboard</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* INNOVATION PROJECTS (Portfolio Style) */}
                <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 18 }}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="mb-0">Innovation Projects</h5>
                      <span className="badge bg-success">{showcases.length}</span>
                    </div>

                    {showcases.length === 0 ? (
                      <div className="text-muted">No innovation showcases published yet.</div>
                    ) : (
                      <div className="row g-3">
                        {showcases.map((s) => (
                          <div className="col-md-6" key={s.idea_id}>
                            <div className="border rounded h-100 overflow-hidden" style={{ borderColor: '#eee' }}>
                              <div style={{ height: 170, background: '#f1f5f9' }}>
                                {s.cover_image ? (
                                  <img src={s.cover_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                                    Add a cover image for a stronger portfolio
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

                                <div className="mt-2 text-muted" style={{ fontSize: 13, whiteSpace: 'pre-line' }}>
                                  {String(s.summary || '').slice(0, 140)}{String(s.summary || '').length > 140 ? '...' : ''}
                                </div>

                                <div className="d-flex flex-wrap gap-2 mt-2">
                                  {s.repo_url && <a className="btn btn-sm btn-outline-dark" href={s.repo_url} target="_blank" rel="noreferrer">GitHub</a>}
                                  {s.demo_url && <a className="btn btn-sm btn-outline-primary" href={s.demo_url} target="_blank" rel="noreferrer">Demo</a>}
                                  {s.report_url && <a className="btn btn-sm btn-outline-success" href={s.report_url} target="_blank" rel="noreferrer">Report</a>}
                                </div>

                                <div className="mt-2 text-muted" style={{ fontSize: 12 }}>
                                  <b>Tech:</b> {s.tech_stack || '—'}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* COURSE ACHIEVEMENTS */}
                <div className="row g-3">
                  {/* Completed */}
                  <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 18 }}>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h5 className="mb-0">Course Achievements</h5>
                          <span className="badge bg-success">{completedCourses.length}</span>
                        </div>

                        {completedCourses.length === 0 ? (
                          <div className="text-muted">No completed courses yet.</div>
                        ) : (
                          <div className="d-flex flex-column gap-3">
                            {completedCourses.slice(0, 5).map((c) => (
                              <div key={c.course_id} className="border rounded p-3" style={{ borderColor: '#eee' }}>
                                <div className="d-flex justify-content-between align-items-start">
                                  <div className="fw-semibold">{c.title}</div>
                                  <span className="badge bg-success">Completed</span>
                                </div>
                                <div className="text-muted" style={{ fontSize: 13 }}>
                                  {c.completed_lessons}/{c.total_lessons} lessons
                                </div>
                                <div className="mt-2">
                                  <ProgressBar pct={100} />
                                </div>
                              </div>
                            ))}
                            {completedCourses.length > 5 && (
                              <div className="text-muted" style={{ fontSize: 12 }}>
                                +{completedCourses.length - 5} more completed courses
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* In progress */}
                  <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 18 }}>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h5 className="mb-0">Learning In Progress</h5>
                          <span className="badge bg-primary">{inProgressCourses.length}</span>
                        </div>

                        {inProgressCourses.length === 0 ? (
                          <div className="text-muted">No ongoing courses right now.</div>
                        ) : (
                          <div className="d-flex flex-column gap-3">
                            {inProgressCourses.slice(0, 6).map((c) => (
                              <div key={c.course_id} className="border rounded p-3" style={{ borderColor: '#eee' }}>
                                <div className="d-flex justify-content-between align-items-start">
                                  <div className="fw-semibold">{c.title}</div>
                                  <span className="badge bg-light text-dark" style={{ border: '1px solid #eee' }}>{c.progress}%</span>
                                </div>
                                <div className="text-muted" style={{ fontSize: 13 }}>
                                  {c.completed_lessons}/{c.total_lessons} lessons
                                </div>
                                <div className="mt-2">
                                  <ProgressBar pct={c.progress} />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certificates block */}
                <div className="card border-0 shadow-sm mt-3" style={{ borderRadius: 18 }}>
                  <div className="card-body">
                    <h5 className="mb-2">Certificates</h5>
                    <div className="text-muted" style={{ fontSize: 14 }}>
                      Certificates are available for completed courses.
                      <div className="mt-2">
                        <span className="badge bg-dark">Eligible: {data.certificates?.count || 0}</span>
                      </div>
                      <div className="mt-2" style={{ fontSize: 13 }}>
                        {data.certificates?.note}
                      </div>
                      <div className="mt-3">
                        <Link to="/account/certificates" className="btn btn-outline-primary btn-sm">
                          Go to Certificates →
                        </Link>
                      </div>
                    </div>
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