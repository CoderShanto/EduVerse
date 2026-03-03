import React, { useContext, useEffect, useMemo, useState } from 'react'
import Layout from '../../../common/Layout'
import UserSidebar from '../../../common/UserSidebar'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../../context/Auth'
import { apiUrl, token as configToken } from '../../../common/Config'

/* ═══════════════════════════════════════
   STYLES (kept your theme, removed unused)
═══════════════════════════════════════ */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .sd-root {
    background: #f6f4ef;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    padding-bottom: 3rem;
  }

  .sd-bc { font-size: 0.75rem; color: #9a8f7e; letter-spacing: 0.04em; padding: 1.4rem 0 1rem; }
  .sd-bc a { color: #c17d3c; text-decoration: none; }
  .sd-bc a:hover { text-decoration: underline; }

  .sd-greeting {
    background: linear-gradient(118deg, #1a2744 0%, #2b3f6e 55%, #3a5298 100%);
    border-radius: 22px;
    padding: 1.8rem 2rem;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.2rem;
    margin-bottom: 1.8rem;
    position: relative;
    overflow: hidden;
  }
  .sd-greeting::before {
    content: '';
    position: absolute;
    right: -60px; bottom: -60px;
    width: 220px; height: 220px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
  }
  .sd-greeting::after {
    content: '';
    position: absolute;
    right: 60px; top: -80px;
    width: 160px; height: 160px;
    border-radius: 50%;
    background: rgba(255,255,255,0.03);
  }
  .sd-greeting-left { display: flex; align-items: center; gap: 1.2rem; z-index: 1; }
  .sd-avatar {
    width: 58px; height: 58px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f5a623, #e8541a);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; font-weight: 700; color: #fff;
    flex-shrink: 0;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    border: 2.5px solid rgba(255,255,255,0.2);
  }
  .sd-greeting-text h2 { font-size: 1.2rem; font-weight: 700; margin: 0; }
  .sd-greeting-text p  { font-size: 0.82rem; color: rgba(255,255,255,0.65); margin: 0.2rem 0 0; }

  .sd-clock { z-index: 1; text-align: right; flex-shrink: 0; }
  .sd-clock-time { font-size: 2rem; font-weight: 700; color: #fff; line-height: 1; }
  .sd-clock-date { font-size: 0.75rem; color: rgba(255,255,255,0.6); margin-top: 0.2rem; }
  .sd-clock-day { font-size: 0.7rem; color: rgba(255,255,255,0.45); margin-top: 0.1rem; text-transform: uppercase; letter-spacing: 0.08em; }
  .sd-live-dot {
    display: inline-flex; align-items: center; gap: 0.35rem;
    font-size: 0.68rem; font-weight: 700; color: rgba(255,255,255,0.55);
    letter-spacing: 0.06em; text-transform: uppercase; margin-top: 0.5rem;
  }
  .sd-live-dot::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #4ade80;
    animation: sd-pulse 1.8s ease-in-out infinite;
    display: block;
  }
  @keyframes sd-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.7); }
  }

  .sd-stat-card {
    background: #fff;
    border-radius: 18px;
    padding: 1.4rem 1.5rem;
    box-shadow: 0 2px 12px rgba(26,22,16,0.06);
    border: 1.5px solid #ede9e1;
    transition: transform 0.22s, box-shadow 0.22s;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }
  .sd-stat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(26,22,16,0.1); }
  .sd-stat-icon {
    width: 46px; height: 46px;
    border-radius: 13px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }
  .sd-num {
    font-family: 'Playfair Display', serif;
    font-size: 2.6rem;
    font-weight: 700;
    color: #1a1610;
    line-height: 1;
  }
  .sd-label { color: #7a6f60; font-size: 0.82rem; font-weight: 500; margin-top: 0.3rem; }
  .sd-stat-link {
    font-size: 0.78rem; color: #c17d3c; text-decoration: none;
    font-weight: 700; margin-top: 1rem;
    display: inline-flex; align-items: center; gap: 4px;
    transition: gap 0.15s;
  }
  .sd-stat-link:hover { color: #a05f20; gap: 8px; }

  .sd-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem;
    color: #1a1610;
    margin: 0 0 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .sd-section-title::after { content: ''; flex: 1; height: 1px; background: #ede9e1; }

  .sd-card {
    background: #fff;
    border-radius: 18px;
    padding: 1.4rem 1.5rem;
    box-shadow: 0 2px 12px rgba(26,22,16,0.06);
    border: 1.5px solid #ede9e1;
  }

  .sd-course-row { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1rem; }
  .sd-course-thumb {
    width: 40px; height: 40px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
    overflow: hidden;
  }
  .sd-course-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .sd-course-info { flex: 1; min-width: 0; }
  .sd-course-name { font-size: 0.83rem; font-weight: 600; color: #1a1610; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sd-course-pct  { font-size: 0.72rem; color: #9a8f7e; margin-top: 0.1rem; }
  .sd-prog-track { background: #ede9e1; border-radius: 99px; height: 6px; overflow: hidden; margin-top: 0.3rem; }
  .sd-prog-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, #c17d3c, #e8a75a); transition: width 0.6s ease; }

  .sd-skeleton {
    background: linear-gradient(90deg, #ede9e1 25%, #f6f4ef 50%, #ede9e1 75%);
    background-size: 700px 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 14px;
    height: 120px;
  }
  @keyframes shimmer {
    0%   { background-position: -700px 0; }
    100% { background-position:  700px 0; }
  }

  .sd-list-row {
    border: 1px solid #eee;
    border-radius: 14px;
    padding: 12px 14px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    background: #fff;
  }
  .sd-pill { font-size: 12px; padding: 4px 10px; border-radius: 999px; border: 1px solid #eee; background: #f7f7f7; }
  .sd-muted { color: #7a6f60; font-size: 13px; }

  @media (max-width: 768px) {
    .sd-greeting { flex-direction: column; text-align: center; }
    .sd-clock { text-align: center; }
    .sd-greeting-left { flex-direction: column; text-align: center; }
  }
`

const getTimeGreeting = () => {
  const hour = new Date().getHours()
  if (hour >= 4 && hour < 12) return "Morning"
  if (hour >= 12 && hour < 17) return "Afternoon"
  if (hour >= 17 && hour < 21) return "Evening"
  return "Night"
}

const LiveClock = () => {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const dayStr = now.toLocaleDateString('en-US', { weekday: 'long' })

  return (
    <div className='sd-clock'>
      <div className='sd-clock-time'>
        {hh}:{mm}<span style={{ opacity: 0.5, fontSize: '1.4rem' }}>:{ss}</span>
      </div>
      <div className='sd-clock-date'>{dateStr}</div>
      <div className='sd-clock-day'>{dayStr}</div>
      <div className='sd-live-dot'>Live</div>
    </div>
  )
}

const StudentDashboard = () => {
  const { user } = useContext(AuthContext)

  const authToken = user?.token || user?.user?.token || configToken
  const userName = user?.user?.name || user?.name || 'Student'

  const initials = useMemo(() => {
    return (userName || 'Student').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  }, [userName])

  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  // NEW: innovation content
  const [latestProblems, setLatestProblems] = useState([])
  const [latestShowcases, setLatestShowcases] = useState([])

  const enrolled = stats?.enrolled_courses ?? 0
  const completed = stats?.completed_courses ?? 0
  const streak = stats?.streak_days ?? 0

  const progressCourses = Array.isArray(stats?.progress_courses) ? stats.progress_courses : []
  const WATCH_ROUTE_BASE = '/watch-course'

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true)

        // 1) dashboard stats
        const statsRes = await fetch(`${apiUrl}/dashboard/stats`, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${authToken}` },
        })
        const statsJson = await statsRes.json()
        setStats(statsJson?.status === 200 ? statsJson.stats : null)

        // 2) latest problems (Problem Hub)
        const probRes = await fetch(`${apiUrl}/problems?page=1`, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${authToken}` },
        })
        const probJson = await probRes.json()
        const problems = probJson?.status === 200 ? (probJson.data?.data || []) : []
        setLatestProblems(problems.slice(0, 4))

        // 3) latest showcases
        const showRes = await fetch(`${apiUrl}/showcases?page=1`, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${authToken}` },
        })
        const showJson = await showRes.json()
        const showcases = showJson?.status === 200 ? (showJson.data?.data || showJson.data || []) : []
        setLatestShowcases((Array.isArray(showcases) ? showcases : []).slice(0, 4))

      } catch (e) {
        console.log('Dashboard error:', e)
      } finally {
        setLoading(false)
      }
    }

    if (authToken) loadAll()
    else setLoading(false)
  }, [authToken])

  return (
    <Layout>
      <style>{css}</style>
      <div className='sd-root'>
        <div className='container'>

          <nav className='sd-bc'>
            <Link to='/account/dashboard'>Account</Link>
            <span className='mx-2'>›</span>
            <span style={{ color: '#1a1610' }}>Student Dashboard</span>
          </nav>

          <div className='row'>
            <div className='col-lg-3 account-sidebar mb-4'>
              <UserSidebar />
            </div>

            <div className='col-lg-9'>
              {/* Greeting */}
              <div className='sd-greeting mb-4'>
                <div className='sd-greeting-left'>
                  <div className='sd-avatar'>{initials}</div>
                  <div className='sd-greeting-text'>
                    <h2>Good {getTimeGreeting()}, {userName}! 👋</h2>
                    <p>Learn courses + build real projects in Innovation.</p>
                  </div>
                </div>
                <LiveClock />
              </div>

              {/* Stats */}
              {loading ? (
                <div className='row g-3 mb-4'>
                  {[1, 2, 3].map(i => (
                    <div key={i} className='col-md-4'><div className='sd-skeleton' /></div>
                  ))}
                </div>
              ) : (
                <>
                  <div className='row g-3 mb-4'>
                    <div className='col-md-4'>
                      <div className='sd-stat-card'>
                        <div>
                          <div className='sd-stat-icon' style={{ background: '#e8f4ff' }}>📚</div>
                          <div className='sd-num'>{enrolled}</div>
                          <div className='sd-label'>Enrolled Courses</div>
                        </div>
                        <Link to='/account/student/my-learning' className='sd-stat-link'>View All →</Link>
                      </div>
                    </div>

                    <div className='col-md-4'>
                      <div className='sd-stat-card'>
                        <div>
                          <div className='sd-stat-icon' style={{ background: '#e8fff0' }}>✅</div>
                          <div className='sd-num'>{completed}</div>
                          <div className='sd-label'>Completed Courses</div>
                        </div>
                        <Link to='/account/certificates' className='sd-stat-link'>Certificates →</Link>
                      </div>
                    </div>

                    <div className='col-md-4'>
  <div className='sd-stat-card'>
    <div>
      <div className='sd-stat-icon' style={{ background: '#fff8ee' }}>🔥</div>
      <div className='sd-num'>{streak}</div>
      <div className='sd-label'>Day Streak</div>
    </div>

    {streak > 0 ? (
      <span className='sd-stat-link' style={{ cursor:'default', color:'#9a8f7e' }}>Keep it going!</span>
    ) : (
      <Link to="/account/student/my-learning" className='sd-stat-link'>Start today →</Link>
    )}
  </div>
</div>
                  </div>

                  {/* Course Progress */}
                  <div className='row g-3 mb-4'>
                    <div className='col-md-12'>
                      <div className='sd-card'>
                        <p className='sd-section-title'>Course Progress</p>

                        {progressCourses.length > 0 ? (
                          <>
                            {progressCourses.map((c, i) => {
                              const pct = Number.isFinite(Number(c.progress)) ? Number(c.progress) : 0
                              const courseTitle = c.title || 'Untitled course'
                              const courseId = c.course_id
                              const image = c.course_small_image || ''

                              return (
                                <div key={`${courseId}-${i}`} className='sd-course-row'>
                                  <div className='sd-course-thumb' style={{ background: image ? '#fff' : '#e8f4ff' }}>
                                    {image ? <img src={image} alt={courseTitle} /> : <span>📘</span>}
                                  </div>

                                  <div className='sd-course-info'>
                                    <div className='sd-course-name'>{courseTitle}</div>
                                    <div className='sd-prog-track'>
                                      <div className='sd-prog-fill' style={{ width: `${pct}%` }} />
                                    </div>
                                    <div className='sd-course-pct'>{pct}% complete</div>
                                  </div>

                                  {courseId ? (
                                    <Link
                                      to={`${WATCH_ROUTE_BASE}/${courseId}`}
                                      className='sd-stat-link'
                                      style={{ marginTop: 0, whiteSpace: 'nowrap' }}
                                    >
                                      Continue →
                                    </Link>
                                  ) : null}
                                </div>
                              )
                            })}
                            <Link to='/account/student/my-learning' className='sd-stat-link' style={{ marginTop: '0.8rem', display: 'inline-flex' }}>
                              All courses →
                            </Link>
                          </>
                        ) : (
                          <div className='sd-muted'>
                            No course progress yet. Start learning from <Link to='/account/student/my-learning'>My Courses</Link>.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* NEW: Innovation Spotlight + Showcase Spotlight */}
                  <div className='row g-3 mb-4'>
                    <div className='col-md-6'>
                      <div className='sd-card h-100'>
                        <p className='sd-section-title'>Innovation Spotlight</p>

                        {latestProblems.length === 0 ? (
                          <div className='sd-muted'>
                            No problems yet. Be the first to post one in <Link to='/account/innovation'>Problem Hub</Link>.
                          </div>
                        ) : (
                          <div className='d-flex flex-column gap-2'>
                            {latestProblems.map((p) => (
                              <div key={p.id} className='sd-list-row'>
                                <div style={{ minWidth: 0 }}>
                                  <div style={{ fontWeight: 700, color: '#1a1610', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {p.title}
                                  </div>
                                  <div className='sd-muted' style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {String(p.description || '').slice(0, 70)}
                                  </div>
                                  <div style={{ marginTop: 6, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    <span className='sd-pill'>{p.category || 'General'}</span>
                                    <span className='sd-pill'>{p.status || 'open'}</span>
                                  </div>
                                </div>
                                <Link to={`/account/innovation/problem/${p.id}`} className='sd-stat-link' style={{ marginTop: 0 }}>
                                  View →
                                </Link>
                              </div>
                            ))}

                            <Link to='/account/innovation' className='sd-stat-link' style={{ marginTop: 8 }}>
                              Go to Problem Hub →
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className='col-md-6'>
                      <div className='sd-card h-100'>
                        <p className='sd-section-title'>Showcase Spotlight</p>

                        {latestShowcases.length === 0 ? (
                          <div className='sd-muted'>
                            No showcases published yet. Build inside <Link to='/account/innovation/my-teams'>My Teams</Link> and publish.
                          </div>
                        ) : (
                          <div className='d-flex flex-column gap-2'>
                            {latestShowcases.map((s) => (
                              <div key={s.id || s.idea_id} className='sd-list-row'>
                                <div style={{ minWidth: 0 }}>
                                  <div style={{ fontWeight: 700, color: '#1a1610', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {s.idea_title || s.title || 'Showcase'}
                                  </div>
                                  <div className='sd-muted' style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    Problem: {s.problem_title || '—'}
                                  </div>
                                  <div style={{ marginTop: 6, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    <span className='sd-pill'>Score: {s.score ?? 0}/10</span>
                                    <span className='sd-pill'>Completed</span>
                                  </div>
                                </div>

                                <Link to={`/account/innovation/showcases/${s.id || s.idea_id}`} className='sd-stat-link' style={{ marginTop: 0 }}>
                                  Open →
                                </Link>
                              </div>
                            ))}

                            <Link to='/account/innovation/showcase' className='sd-stat-link' style={{ marginTop: 8 }}>
                              Explore all showcases →
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default StudentDashboard