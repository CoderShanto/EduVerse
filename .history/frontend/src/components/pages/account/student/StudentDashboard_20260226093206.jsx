import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../../common/Layout'
import UserSidebar from '../../../common/UserSidebar'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../../context/Auth'
import { apiUrl } from '../../../common/Config'

/* ─── Inline styles / design tokens ─── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .sd-root {
    background: #f6f4ef;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── breadcrumb ── */
  .sd-breadcrumb { font-size: 0.78rem; color: #9a8f7e; letter-spacing: 0.04em; margin-bottom: 1.5rem; }
  .sd-breadcrumb a { color: #c17d3c; text-decoration: none; }
  .sd-breadcrumb a:hover { text-decoration: underline; }

  /* ── page header ── */
  .sd-header { margin-bottom: 2rem; }
  .sd-header h1 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    color: #1a1610;
    margin: 0;
    line-height: 1.2;
  }
  .sd-header p { color: #6b5f50; font-size: 0.9rem; margin: 0.3rem 0 0; }

  /* ── greeting banner ── */
  .sd-greeting {
    background: linear-gradient(120deg, #1a2744 0%, #2b3f6e 60%, #3a5298 100%);
    border-radius: 18px;
    padding: 1.8rem 2rem;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 1.2rem;
    margin-bottom: 1.8rem;
    position: relative;
    overflow: hidden;
  }
  .sd-greeting::after {
    content: '';
    position: absolute;
    right: -40px; top: -40px;
    width: 200px; height: 200px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
  }
  .sd-greeting-avatar {
    width: 54px; height: 54px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f5a623, #e8541a);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; font-weight: 700; color: #fff;
    flex-shrink: 0;
    box-shadow: 0 4px 16px rgba(0,0,0,0.25);
  }
  .sd-greeting-text h2 { font-size: 1.15rem; font-weight: 600; margin: 0; }
  .sd-greeting-text p { font-size: 0.82rem; color: rgba(255,255,255,0.7); margin: 0.15rem 0 0; }

  /* ── stat cards ── */
  .sd-stat-card {
    background: #fff;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 2px 12px rgba(26,22,16,0.06);
    border: 1.5px solid #ede9e1;
    transition: transform 0.2s, box-shadow 0.2s;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .sd-stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(26,22,16,0.1); }
  .sd-stat-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }
  .sd-stat-card .sd-num {
    font-family: 'Playfair Display', serif;
    font-size: 2.4rem;
    font-weight: 700;
    color: #1a1610;
    line-height: 1;
  }
  .sd-stat-card .sd-label { color: #7a6f60; font-size: 0.82rem; font-weight: 500; margin-top: 0.25rem; }
  .sd-stat-link { font-size: 0.8rem; color: #c17d3c; text-decoration: none; font-weight: 600; margin-top: 1rem; display: inline-flex; align-items: center; gap: 4px; }
  .sd-stat-link:hover { color: #a05f20; }

  /* ── section heading ── */
  .sd-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    color: #1a1610;
    margin: 0 0 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .sd-section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #ede9e1;
  }

  /* ── activity card ── */
  .sd-activity-card {
    background: #fff;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 2px 12px rgba(26,22,16,0.06);
    border: 1.5px solid #ede9e1;
    margin-bottom: 1.5rem;
  }

  /* ── progress bars ── */
  .sd-progress-bar-track {
    background: #ede9e1;
    border-radius: 99px;
    height: 7px;
    overflow: hidden;
    margin-top: 0.4rem;
  }
  .sd-progress-bar-fill {
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg, #c17d3c, #e8a75a);
    transition: width 0.6s ease;
  }
  .sd-course-row { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1.1rem; }
  .sd-course-row:last-child { margin-bottom: 0; }
  .sd-course-thumb {
    width: 42px; height: 42px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
  }
  .sd-course-info { flex: 1; min-width: 0; }
  .sd-course-name { font-size: 0.85rem; font-weight: 600; color: #1a1610; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sd-course-pct { font-size: 0.75rem; color: #9a8f7e; margin-top: 0.1rem; }

  /* ── quick links ── */
  .sd-quick-link {
    background: #fff;
    border: 1.5px solid #ede9e1;
    border-radius: 14px;
    padding: 1rem 1.1rem;
    display: flex; align-items: center; gap: 0.8rem;
    text-decoration: none;
    color: #1a1610;
    font-size: 0.85rem;
    font-weight: 600;
    transition: background 0.15s, border-color 0.15s, transform 0.15s;
  }
  .sd-quick-link:hover { background: #1a2744; color: #fff; border-color: #1a2744; transform: translateY(-2px); }
  .sd-quick-link .ql-icon { font-size: 1.2rem; }

  /* ── achievement badge ── */
  .sd-badge {
    display: inline-flex; align-items: center; gap: 0.4rem;
    background: #fff8ee;
    border: 1.5px solid #f5d899;
    border-radius: 99px;
    padding: 0.3rem 0.8rem;
    font-size: 0.78rem;
    font-weight: 600;
    color: #a06010;
    margin: 0.25rem;
  }

  /* ── tip card ── */
  .sd-tip {
    background: linear-gradient(135deg, #f0f7ff 0%, #e8f2ff 100%);
    border: 1.5px solid #c5daff;
    border-radius: 14px;
    padding: 1.1rem 1.3rem;
    font-size: 0.83rem;
    color: #1a3a6e;
    display: flex;
    gap: 0.7rem;
    align-items: flex-start;
  }

  /* ── calendar spot ── */
  .sd-calendar-day {
    text-align: center;
    padding: 0.5rem 0.3rem;
    border-radius: 10px;
    font-size: 0.75rem;
    color: #7a6f60;
    cursor: pointer;
    transition: background 0.15s;
  }
  .sd-calendar-day.today {
    background: #1a2744;
    color: #fff;
    font-weight: 700;
  }
  .sd-calendar-day.has-event::after {
    content: '';
    display: block;
    width: 4px; height: 4px;
    border-radius: 50%;
    background: #c17d3c;
    margin: 2px auto 0;
  }
  .sd-calendar-day:hover:not(.today) { background: #ede9e1; }

  /* ── loading skeleton ── */
  @keyframes shimmer {
    0% { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
  .sd-skeleton {
    background: linear-gradient(90deg, #ede9e1 25%, #f6f4ef 50%, #ede9e1 75%);
    background-size: 600px 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 12px;
    height: 120px;
  }

  /* ── responsive ── */
  @media (max-width: 768px) {
    .sd-greeting { flex-direction: column; text-align: center; }
    .sd-header h1 { font-size: 1.5rem; }
  }
`

/* ─── mock/demo progress data (replace w/ real API data) ─── */
const DEMO_COURSES = [
  { name: 'React for Beginners', pct: 72, emoji: '⚛️', bg: '#e8f4ff' },
  { name: 'UI/UX Fundamentals',  pct: 45, emoji: '🎨', bg: '#fff0f6' },
  { name: 'JavaScript Pro',      pct: 90, emoji: '🟨', bg: '#fffbe6' },
]

const QUICK_LINKS = [
  { to: '/account/my-learning',   icon: '📚', label: 'My Courses'    },
  { to: '/account/certificates',  icon: '🏆', label: 'Certificates'  },
  { to: '/account/wishlist',      icon: '❤️',  label: 'Wishlist'      },
  { to: '/account/settings',      icon: '⚙️',  label: 'Settings'     },
]

const ACHIEVEMENTS = ['First Login 🎉', '5-Day Streak 🔥', 'Quiz Master 🧠']

const getDayLabels = () => {
  const days = ['S','M','T','W','T','F','S']
  const today = new Date().getDay()
  return Array.from({ length: 7 }, (_, i) => ({
    label: days[i],
    num: new Date(Date.now() - (today - i) * 864e5).getDate(),
    isToday: i === today,
    hasEvent: [1, 4].includes(i),
  }))
}

const StudentDashboard = () => {
  const { user } = useContext(AuthContext)
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  const firstName = user?.name?.split(' ')[0] ?? 'Student'
  const initials  = (user?.name ?? 'S').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${apiUrl}/dashboard/stats`, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${user?.token}` },
        })
        const result = await res.json()
        setStats(result.status === 200 ? result.stats : null)
      } catch {
        setStats(null)
      } finally {
        setLoading(false)
      }
    }
    if (user?.token) loadStats()
  }, [user])

  const enrolled = stats?.enrolled_courses ?? 0
  const completed = stats?.completed_courses ?? 0
  const weekDays = getDayLabels()

  return (
    <Layout>
      <style>{css}</style>

      <section className='sd-root'>
        <div className='container py-4'>

          {/* Breadcrumb */}
          <nav className='sd-breadcrumb' aria-label='breadcrumb'>
            <Link to='/account/dashboard'>Account</Link>
            <span className='mx-2'>›</span>
            <span>Student Dashboard</span>
          </nav>

          <div className='row'>

            {/* ── Sidebar ── */}
            <div className='col-lg-3 account-sidebar mb-4'>
              <UserSidebar />
            </div>

            {/* ── Main content ── */}
            <div className='col-lg-9'>

              {/* Greeting banner */}
              <div className='sd-greeting mb-4'>
                <div className='sd-greeting-avatar'>{initials}</div>
                <div className='sd-greeting-text'>
                  <h2>Good {getTimeGreeting()}, {firstName}! 👋</h2>
                  <p>You're making great progress — keep it up!</p>
                </div>
              </div>

              {loading ? (
                <div className='row g-3'>
                  {[1,2,3].map(i => <div key={i} className='col-md-4'><div className='sd-skeleton' /></div>)}
                </div>
              ) : (
                <>
                  {/* ── Stat Cards ── */}
                  <div className='row g-3 mb-4'>

                    <div className='col-md-4'>
                      <div className='sd-stat-card'>
                        <div>
                          <div className='sd-stat-icon' style={{ background: '#e8f4ff' }}>📚</div>
                          <div className='sd-num'>{enrolled}</div>
                          <div className='sd-label'>Enrolled Courses</div>
                        </div>
                        <Link to='/account/my-learning' className='sd-stat-link'>View All →</Link>
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
                          <div className='sd-num'>{stats?.streak_days ?? 0}</div>
                          <div className='sd-label'>Day Streak</div>
                        </div>
                        <span className='sd-stat-link' style={{ cursor: 'default', color: '#9a8f7e' }}>Keep it going!</span>
                      </div>
                    </div>

                  </div>

                  {/* ── Week mini-calendar ── */}
                  <div className='sd-activity-card mb-4'>
                    <p className='sd-section-title'>This Week</p>
                    <div className='d-flex justify-content-between gap-1'>
                      {weekDays.map((d, i) => (
                        <div key={i} className={`sd-calendar-day flex-fill ${d.isToday ? 'today' : ''} ${d.hasEvent ? 'has-event' : ''}`}>
                          <div style={{ fontSize: '0.65rem', opacity: 0.7, textTransform: 'uppercase' }}>{d.label}</div>
                          <div style={{ fontWeight: 600 }}>{d.num}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── Progress & Quick Links ── */}
                  <div className='row g-3 mb-4'>

                    {/* Course progress */}
                    <div className='col-md-7'>
                      <div className='sd-activity-card h-100'>
                        <p className='sd-section-title'>Course Progress</p>
                        {DEMO_COURSES.map((c, i) => (
                          <div key={i} className='sd-course-row'>
                            <div className='sd-course-thumb' style={{ background: c.bg }}>{c.emoji}</div>
                            <div className='sd-course-info'>
                              <div className='sd-course-name'>{c.name}</div>
                              <div className='sd-progress-bar-track'>
                                <div className='sd-progress-bar-fill' style={{ width: `${c.pct}%` }} />
                              </div>
                              <div className='sd-course-pct'>{c.pct}% complete</div>
                            </div>
                          </div>
                        ))}
                        <Link to='/account/my-learning' className='sd-stat-link mt-2'>All courses →</Link>
                      </div>
                    </div>

                    {/* Quick links */}
                    <div className='col-md-5'>
                      <div className='sd-activity-card h-100'>
                        <p className='sd-section-title'>Quick Links</p>
                        <div className='d-flex flex-column gap-2'>
                          {QUICK_LINKS.map((ql, i) => (
                            <Link key={i} to={ql.to} className='sd-quick-link'>
                              <span className='ql-icon'>{ql.icon}</span>
                              {ql.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* ── Achievements ── */}
                  <div className='sd-activity-card mb-4'>
                    <p className='sd-section-title'>Achievements</p>
                    <div>
                      {ACHIEVEMENTS.map((a, i) => (
                        <span key={i} className='sd-badge'>{a}</span>
                      ))}
                    </div>
                  </div>

                  {/* ── Daily tip ── */}
                  <div className='sd-tip'>
                    <span style={{ fontSize: '1.3rem' }}>💡</span>
                    <div>
                      <strong style={{ fontSize: '0.85rem' }}>Learning tip of the day</strong>
                      <p style={{ margin: '0.2rem 0 0', lineHeight: 1.5 }}>
                        Spaced repetition is one of the most effective study techniques. 
                        Review yesterday's material for 5 minutes before starting today's lesson.
                      </p>
                    </div>
                  </div>

                </>
              )}
            </div>

          </div>
        </div>
      </section>
    </Layout>
  )
}

function getTimeGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

export default StudentDashboard