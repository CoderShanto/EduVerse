import React, { useContext, useEffect, useMemo, useState } from 'react'
import Layout from '../../common/Layout'
import UserSidebar from '../../common/UserSidebar'
import toast from 'react-hot-toast'
import { apiUrl } from '../../common/Config'
import { AuthContext } from '../../context/Auth'

/* ─── Inline styles ─────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  .pf-root {
    --ink: #0d0d12;
    --surface: #13131a;
    --card: #1a1a24;
    --border: rgba(255,255,255,0.07);
    --accent1: #4ade80;
    --accent2: #38bdf8;
    --accent3: #f472b6;
    --text: #e8e8f0;
    --muted: #7878a0;
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    background: var(--ink);
    min-height: 100vh;
    padding: 0 0 80px;
  }

  .pf-root * { box-sizing: border-box; }

  /* hero banner */
  .pf-hero {
    position: relative;
    border-radius: 22px;
    overflow: hidden;
    padding: 40px 36px;
    margin-bottom: 28px;
    background: var(--card);
    border: 1px solid var(--border);
  }
  .pf-hero::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 70% 100% at 90% -10%, rgba(56,189,248,0.18), transparent 60%),
                radial-gradient(ellipse 60% 80% at 10% 110%, rgba(74,222,128,0.12), transparent 60%);
    pointer-events: none;
  }
  .pf-hero-grid {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 24px;
    position: relative;
  }
  .pf-avatar {
    width: 72px; height: 72px; border-radius: 20px;
    background: linear-gradient(135deg, #1e3a5f, #0ea5e9);
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Serif Display', serif;
    font-size: 26px; color: #fff;
    border: 2px solid rgba(255,255,255,0.12);
    flex-shrink: 0;
  }
  .pf-name {
    font-family: 'DM Serif Display', serif;
    font-size: 28px; line-height: 1.1;
    margin: 0 0 4px;
    color: #fff;
  }
  .pf-role-badge {
    display: inline-block;
    padding: 3px 12px;
    background: rgba(56,189,248,0.12);
    border: 1px solid rgba(56,189,248,0.3);
    border-radius: 999px;
    font-size: 12px; font-weight: 500;
    color: var(--accent2);
    text-transform: capitalize;
  }
  .pf-url-box {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 12px 18px;
    font-size: 12px;
    color: var(--muted);
    max-width: 300px;
    word-break: break-all;
  }
  .pf-url-box span {
    display: block;
    color: var(--accent2);
    font-weight: 500;
    margin-top: 2px;
  }

  /* top action bar */
  .pf-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 24px;
  }
  .pf-page-title {
    font-family: 'DM Serif Display', serif;
    font-size: 34px; margin: 0;
    color: #fff;
  }
  .pf-page-sub { color: var(--muted); font-size: 14px; margin-top: 4px; }
  .pf-btn {
    padding: 8px 18px; border-radius: 10px;
    font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.18s;
    border: none;
    text-decoration: none;
    display: inline-block;
  }
  .pf-btn-outline {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text);
  }
  .pf-btn-outline:hover { background: rgba(255,255,255,0.06); color: #fff; }
  .pf-btn-solid {
    background: linear-gradient(135deg, #0ea5e9, #2563eb);
    color: #fff;
    box-shadow: 0 4px 16px rgba(14,165,233,0.25);
  }
  .pf-btn-solid:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(14,165,233,0.35); }

  /* stats row */
  .pf-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }
  @media(max-width:640px) { .pf-stats { grid-template-columns: 1fr; } }
  .pf-stat-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 22px 20px;
    position: relative;
    overflow: hidden;
    transition: transform 0.18s;
  }
  .pf-stat-card:hover { transform: translateY(-3px); }
  .pf-stat-card::after {
    content: attr(data-glyph);
    position: absolute; right: 16px; top: 12px;
    font-size: 36px; opacity: 0.08;
    line-height: 1;
  }
  .pf-stat-num {
    font-family: 'DM Serif Display', serif;
    font-size: 42px; color: #fff; line-height: 1;
  }
  .pf-stat-label { font-size: 13px; color: var(--muted); margin-top: 4px; }
  .pf-stat-accent { height: 3px; border-radius: 99px; width: 40px; margin-top: 12px; }

  /* section cards */
  .pf-section {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 22px;
    margin-bottom: 20px;
    overflow: hidden;
  }
  .pf-section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 26px 18px;
    border-bottom: 1px solid var(--border);
  }
  .pf-section-title {
    font-family: 'DM Serif Display', serif;
    font-size: 20px; margin: 0; color: #fff;
  }
  .pf-count-badge {
    font-size: 12px; font-weight: 600;
    padding: 3px 12px; border-radius: 999px;
  }
  .pf-section-body { padding: 22px 26px; }

  /* course card */
  .pf-courses-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
  @media(max-width:640px) { .pf-courses-grid { grid-template-columns: 1fr; } }
  .pf-course-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 16px;
    display: flex; gap: 14px;
    transition: border-color 0.18s, background 0.18s;
  }
  .pf-course-card:hover { border-color: rgba(56,189,248,0.25); background: rgba(56,189,248,0.04); }
  .pf-course-thumb {
    width: 50px; height: 50px; border-radius: 10px;
    background: rgba(255,255,255,0.06);
    overflow: hidden; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
  }
  .pf-course-thumb img { width:100%; height:100%; object-fit:cover; }
  .pf-course-title {
    font-weight: 500; font-size: 14px; color: #fff;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .pf-course-meta { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .pf-progress-track {
    height: 5px; border-radius: 99px;
    background: rgba(255,255,255,0.07);
    margin-top: 10px; overflow: hidden;
  }
  .pf-progress-fill {
    height: 100%; border-radius: 99px;
    background: linear-gradient(90deg, #06b6d4, #3b82f6);
    transition: width 0.6s ease;
  }
  .pf-tag {
    display: inline-block;
    font-size: 11px; font-weight: 500;
    padding: 2px 9px; border-radius: 6px;
    margin-top: 8px;
  }

  /* showcase card */
  .pf-showcase-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    transition: transform 0.2s, border-color 0.2s;
  }
  .pf-showcase-card:hover { transform: translateY(-4px); border-color: rgba(74,222,128,0.25); }
  .pf-showcase-cover {
    height: 160px; background: rgba(255,255,255,0.04);
    position: relative; overflow: hidden;
  }
  .pf-showcase-cover img { width:100%; height:100%; object-fit:cover; }
  .pf-showcase-cover-empty {
    height: 100%;
    display: flex; align-items: center; justify-content: center;
    color: var(--muted); font-size: 13px;
    background: linear-gradient(135deg, rgba(74,222,128,0.06), rgba(56,189,248,0.06));
  }
  .pf-score-pill {
    position: absolute; top: 12px; right: 12px;
    background: rgba(0,0,0,0.7);
    border: 1px solid rgba(74,222,128,0.4);
    color: var(--accent1);
    font-size: 12px; font-weight: 600;
    padding: 3px 10px; border-radius: 999px;
    backdrop-filter: blur(8px);
  }
  .pf-showcase-body { padding: 16px; }
  .pf-showcase-title { font-weight: 600; font-size: 14px; color: #fff; margin-bottom: 4px; }
  .pf-showcase-problem { font-size: 12px; color: var(--muted); }
  .pf-showcase-summary { font-size: 13px; color: #9898b8; margin-top: 8px; line-height: 1.5; }
  .pf-link-btn {
    display: inline-block;
    font-size: 12px; font-weight: 500;
    padding: 4px 12px; border-radius: 7px;
    text-decoration: none;
    transition: all 0.15s;
    border: 1px solid transparent;
  }
  .pf-link-gh { border-color: rgba(255,255,255,0.15); color: #c8c8e0; }
  .pf-link-gh:hover { background: rgba(255,255,255,0.07); color: #fff; }
  .pf-link-demo { border-color: rgba(56,189,248,0.3); color: var(--accent2); }
  .pf-link-demo:hover { background: rgba(56,189,248,0.1); }
  .pf-link-report { border-color: rgba(74,222,128,0.3); color: var(--accent1); }
  .pf-link-report:hover { background: rgba(74,222,128,0.1); }
  .pf-tech { font-size: 11px; color: var(--muted); margin-top: 10px; }

  /* certs */
  .pf-cert-row {
    display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
  }
  .pf-cert-icon {
    width: 56px; height: 56px; border-radius: 14px;
    background: linear-gradient(135deg, rgba(244,114,182,0.15), rgba(244,114,182,0.05));
    border: 1px solid rgba(244,114,182,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
  }
  .pf-cert-count {
    font-family: 'DM Serif Display', serif;
    font-size: 32px; color: #fff;
  }
  .pf-cert-sub { font-size: 13px; color: var(--muted); }
  .pf-cert-note { font-size: 13px; color: #7878a0; line-height: 1.6; }

  /* empty state */
  .pf-empty { color: var(--muted); font-size: 14px; padding: 6px 0; }

  /* divider glow */
  .pf-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(56,189,248,0.3), transparent);
    margin: 4px 0 0;
  }
`

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

  const ProgressBar = ({ pct }) => (
    <div className="pf-progress-track">
      <div className="pf-progress-fill" style={{ width: `${pct}%` }} />
    </div>
  )

  return (
    <Layout>
      <style>{css}</style>
      <div className="pf-root">
        <div className="container my-4">
          <div className="row">
            <div className="col-lg-3 account-sidebar mb-4">
              <UserSidebar />
            </div>

            <div className="col-lg-9">
              {/* Top bar */}
              <div className="pf-topbar">
                <div>
                  <h3 className="pf-page-title">Portfolio</h3>
                  <div className="pf-page-sub">Your learning & innovation achievements — in one public profile.</div>
                </div>
                {!loading && data?.public_url && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a className="pf-btn pf-btn-outline" href={data.public_url} target="_blank" rel="noreferrer">
                      View Public ↗
                    </a>
                    <button className="pf-btn pf-btn-solid" onClick={copyLink}>
                      Copy Link
                    </button>
                  </div>
                )}
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: '#7878a0' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>⟳</div>
                  Loading portfolio…
                </div>
              ) : !data ? (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 14, padding: '16px 22px', color: '#f87171' }}>
                  Portfolio data not found.
                </div>
              ) : (
                <>
                  {/* Hero */}
                  <div className="pf-hero">
                    <div className="pf-hero-grid">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                        <div className="pf-avatar">{initials}</div>
                        <div>
                          <div className="pf-name">{data.user?.name}</div>
                          <div style={{ marginTop: 6 }}>
                            <span className="pf-role-badge">{data.user?.role}</span>
                          </div>
                          <div style={{ fontSize: 13, color: '#7878a0', marginTop: 8, maxWidth: 320 }}>
                            Shareable profile highlighting course completion and real project building.
                          </div>
                        </div>
                      </div>
                      <div className="pf-url-box">
                        Public URL
                        <span>{data.public_url}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="pf-stats">
                    <div className="pf-stat-card" data-glyph="🎓">
                      <div className="pf-stat-num">{data.stats?.completed_courses || 0}</div>
                      <div className="pf-stat-label">Completed Courses</div>
                      <div className="pf-stat-accent" style={{ background: 'linear-gradient(90deg,#4ade80,#22d3ee)' }} />
                    </div>
                    <div className="pf-stat-card" data-glyph="🚀">
                      <div className="pf-stat-num">{data.stats?.innovation_showcases || 0}</div>
                      <div className="pf-stat-label">Innovation Showcases</div>
                      <div className="pf-stat-accent" style={{ background: 'linear-gradient(90deg,#38bdf8,#818cf8)' }} />
                    </div>
                    <div className="pf-stat-card" data-glyph="📌">
                      <div className="pf-stat-num">{data.stats?.in_progress_courses || 0}</div>
                      <div className="pf-stat-label">Courses In Progress</div>
                      <div className="pf-stat-accent" style={{ background: 'linear-gradient(90deg,#f472b6,#fb923c)' }} />
                    </div>
                  </div>

                  {/* Completed Courses */}
                  <div className="pf-section">
                    <div className="pf-section-head">
                      <h5 className="pf-section-title">Completed Courses</h5>
                      <span className="pf-count-badge" style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>
                        {(data.courses?.completed || []).length}
                      </span>
                    </div>
                    <div className="pf-section-body">
                      {(data.courses?.completed || []).length === 0 ? (
                        <div className="pf-empty">No completed courses yet.</div>
                      ) : (
                        <div className="pf-courses-grid">
                          {data.courses.completed.map((c) => (
                            <div className="pf-course-card" key={c.course_id}>
                              <div className="pf-course-thumb">
                                {c.course_small_image
                                  ? <img src={c.course_small_image} alt="" />
                                  : '📘'}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div className="pf-course-title">{c.title}</div>
                                <div className="pf-course-meta">{c.completed_lessons}/{c.total_lessons} lessons • {c.progress}%</div>
                                <ProgressBar pct={100} />
                                <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                                  <span className="pf-tag" style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>✓ Completed</span>
                                  <span className="pf-tag" style={{ background: 'rgba(255,255,255,0.05)', color: '#9898b8', border: '1px solid rgba(255,255,255,0.08)' }}>Certificate Eligible</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* In Progress */}
                  <div className="pf-section">
                    <div className="pf-section-head">
                      <h5 className="pf-section-title">Learning In Progress</h5>
                      <span className="pf-count-badge" style={{ background: 'rgba(56,189,248,0.12)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.2)' }}>
                        {(data.courses?.in_progress || []).length}
                      </span>
                    </div>
                    <div className="pf-section-body">
                      {(data.courses?.in_progress || []).length === 0 ? (
                        <div className="pf-empty">No ongoing courses right now.</div>
                      ) : (
                        <div className="pf-courses-grid">
                          {data.courses.in_progress.map((c) => (
                            <div className="pf-course-card" key={c.course_id}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                                  <div className="pf-course-title">{c.title}</div>
                                  <span style={{ fontSize: 13, fontWeight: 600, color: '#38bdf8', flexShrink: 0 }}>{c.progress}%</span>
                                </div>
                                <div className="pf-course-meta">{c.completed_lessons}/{c.total_lessons} lessons</div>
                                <ProgressBar pct={c.progress} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Certificates */}
                  <div className="pf-section">
                    <div className="pf-section-head">
                      <h5 className="pf-section-title">Certificates</h5>
                    </div>
                    <div className="pf-section-body">
                      <div className="pf-cert-row">
                        <div className="pf-cert-icon">🏅</div>
                        <div>
                          <div className="pf-cert-count">{data.certificates?.count || 0}</div>
                          <div className="pf-cert-sub">Total Eligible Certificates</div>
                        </div>
                        <div style={{ flex: 1, paddingLeft: 16, borderLeft: '1px solid rgba(255,255,255,0.07)' }}>
                          <div className="pf-cert-note">{data.certificates?.note || 'Certificates are awarded upon full course completion.'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Innovation Showcases */}
                  <div className="pf-section">
                    <div className="pf-section-head">
                      <h5 className="pf-section-title">Innovation Showcases</h5>
                      <span className="pf-count-badge" style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>
                        {(data.innovation?.showcases || []).length}
                      </span>
                    </div>
                    <div className="pf-section-body">
                      {(data.innovation?.showcases || []).length === 0 ? (
                        <div className="pf-empty">No innovation showcases published yet.</div>
                      ) : (
                        <div className="pf-courses-grid">
                          {data.innovation.showcases.map((s) => (
                            <div className="pf-showcase-card" key={s.idea_id}>
                              <div className="pf-showcase-cover">
                                {s.cover_image
                                  ? <img src={s.cover_image} alt="" />
                                  : <div className="pf-showcase-cover-empty">No cover image</div>
                                }
                                <div className="pf-score-pill">{s.score}/10</div>
                              </div>
                              <div className="pf-showcase-body">
                                <div className="pf-showcase-title">{s.idea_title}</div>
                                <div className="pf-showcase-problem">Problem: <b style={{ color: '#b0b0d0' }}>{s.problem_title}</b></div>
                                <div className="pf-showcase-summary">
                                  {String(s.summary || '').slice(0, 120)}{String(s.summary || '').length > 120 ? '…' : ''}
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                                  {s.repo_url && <a className="pf-link-btn pf-link-gh" href={s.repo_url} target="_blank" rel="noreferrer">GitHub ↗</a>}
                                  {s.demo_url && <a className="pf-link-btn pf-link-demo" href={s.demo_url} target="_blank" rel="noreferrer">Demo ↗</a>}
                                  {s.report_url && <a className="pf-link-btn pf-link-report" href={s.report_url} target="_blank" rel="noreferrer">Report ↗</a>}
                                </div>
                                {s.tech_stack && (
                                  <div className="pf-tech">⚙ {s.tech_stack}</div>
                                )}
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
      </div>
    </Layout>
  )
}

export default Portfolio