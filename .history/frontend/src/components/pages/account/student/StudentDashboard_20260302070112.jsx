import React, { useContext, useEffect, useMemo, useState } from 'react'
import Layout from '../../../common/Layout'
import UserSidebar from '../../../common/UserSidebar'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../../context/Auth'
import { apiUrl, token as configToken } from '../../../common/Config'

/* ═══════════════════════════════════════
   ULTRA DESIGN SYSTEM — "Dark Luxe Academy"
   Aesthetic: Editorial dark luxury with neon accents,
   glassmorphism panels, kinetic typography & fluid motion
═══════════════════════════════════════ */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@300;400;500&display=swap');

  :root {
    --bg: #080b14;
    --surface: #0d1221;
    --surface2: #111829;
    --border: rgba(255,255,255,0.07);
    --border-glow: rgba(99,179,237,0.25);
    --accent: #63b3ed;
    --accent2: #f6ad55;
    --accent3: #68d391;
    --text: #e8eaf0;
    --text-muted: #5a6480;
    --text-dim: #8892b0;
    --gold: #f6ad55;
    --neon: #63b3ed;
    --font-display: 'Instrument Serif', serif;
    --font-ui: 'Syne', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --radius: 20px;
    --radius-sm: 12px;
  }

  .sd-root {
    background: var(--bg);
    min-height: 100vh;
    font-family: var(--font-ui);
    padding-bottom: 4rem;
    position: relative;
    overflow-x: hidden;
    color: var(--text);
  }

  /* Animated background nebula */
  .sd-root::before {
    content: '';
    position: fixed;
    top: -30%;
    right: -20%;
    width: 700px;
    height: 700px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,179,237,0.06) 0%, transparent 70%);
    pointer-events: none;
    animation: nebula-drift 12s ease-in-out infinite alternate;
    z-index: 0;
  }

  .sd-root::after {
    content: '';
    position: fixed;
    bottom: -20%;
    left: -10%;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(246,173,85,0.05) 0%, transparent 70%);
    pointer-events: none;
    animation: nebula-drift 16s ease-in-out infinite alternate-reverse;
    z-index: 0;
  }

  @keyframes nebula-drift {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(30px, 20px) scale(1.08); }
  }

  .sd-inner { position: relative; z-index: 1; }

  /* ─── Breadcrumb ─── */
  .sd-bc {
    font-size: 0.72rem;
    color: var(--text-muted);
    letter-spacing: 0.08em;
    padding: 1.6rem 0 1.2rem;
    font-family: var(--font-mono);
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .sd-bc a { color: var(--accent); text-decoration: none; transition: opacity 0.2s; }
  .sd-bc a:hover { opacity: 0.7; }
  .sd-bc-sep { color: var(--text-muted); opacity: 0.4; }

  /* ─── Greeting Hero ─── */
  .sd-greeting {
    background: linear-gradient(135deg, var(--surface) 0%, var(--surface2) 100%);
    border: 1px solid var(--border);
    border-radius: 28px;
    padding: 2.2rem 2.4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    margin-bottom: 2rem;
    position: relative;
    overflow: hidden;
    animation: sd-fadein 0.6s ease both;
  }

  /* Greeting scanline texture */
  .sd-greeting::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(255,255,255,0.01) 3px,
      rgba(255,255,255,0.01) 4px
    );
    pointer-events: none;
  }

  /* Greeting glowing edge */
  .sd-greeting::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: 0.6;
  }

  .sd-greeting-left { display: flex; align-items: center; gap: 1.4rem; position: relative; z-index: 1; }

  .sd-avatar {
    width: 62px; height: 62px;
    border-radius: 18px;
    background: linear-gradient(135deg, #1a3a5c, #0d2035);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-style: italic;
    color: var(--accent);
    flex-shrink: 0;
    box-shadow: 0 0 0 1px var(--border-glow), 0 8px 32px rgba(99,179,237,0.15);
    position: relative;
    animation: avatar-in 0.5s 0.2s both cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .sd-avatar::after {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 19px;
    padding: 1px;
    background: linear-gradient(135deg, var(--accent), transparent, var(--accent2));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.5;
  }

  @keyframes avatar-in {
    from { opacity: 0; transform: scale(0.7) rotate(-10deg); }
    to   { opacity: 1; transform: scale(1) rotate(0); }
  }

  .sd-greeting-text h2 {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 400;
    font-style: italic;
    color: var(--text);
    margin: 0;
    line-height: 1.2;
  }
  .sd-greeting-text h2 strong { font-style: normal; color: var(--accent); font-family: var(--font-ui); font-weight: 800; }
  .sd-greeting-text p {
    font-size: 0.78rem;
    color: var(--text-muted);
    margin: 0.35rem 0 0;
    font-family: var(--font-mono);
    letter-spacing: 0.04em;
  }

  /* ─── Live Clock ─── */
  .sd-clock { z-index: 1; text-align: right; flex-shrink: 0; }
  .sd-clock-time {
    font-family: var(--font-mono);
    font-size: 2.4rem;
    font-weight: 300;
    color: var(--text);
    line-height: 1;
    letter-spacing: -0.02em;
  }
  .sd-clock-time .sd-secs { opacity: 0.35; font-size: 1.6rem; }
  .sd-clock-date {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--text-muted);
    margin-top: 0.3rem;
    letter-spacing: 0.06em;
  }
  .sd-clock-day {
    font-family: var(--font-ui);
    font-size: 0.68rem;
    color: var(--accent);
    margin-top: 0.15rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-weight: 700;
  }
  .sd-live-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: 0.5rem;
    font-size: 0.65rem;
    font-family: var(--font-mono);
    color: var(--accent3);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    background: rgba(104, 211, 145, 0.08);
    border: 1px solid rgba(104,211,145,0.2);
    padding: 3px 8px;
    border-radius: 99px;
  }
  .sd-live-badge::before {
    content: '';
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--accent3);
    animation: blink 1.6s ease-in-out infinite;
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.2; }
  }

  /* ─── Stats Grid ─── */
  .sd-stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .sd-stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.6rem;
    position: relative;
    overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s, box-shadow 0.3s;
    cursor: default;
    animation: sd-fadein 0.5s both;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .sd-stat-card:nth-child(1) { animation-delay: 0.1s; }
  .sd-stat-card:nth-child(2) { animation-delay: 0.2s; }
  .sd-stat-card:nth-child(3) { animation-delay: 0.3s; }

  .sd-stat-card:hover {
    transform: translateY(-6px) scale(1.01);
    border-color: var(--border-glow);
    box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,179,237,0.1);
  }

  /* Card top glow strip */
  .sd-stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 20%; right: 20%;
    height: 1px;
    border-radius: 99px;
    transition: opacity 0.3s;
    opacity: 0;
  }
  .sd-stat-card:hover::before { opacity: 1; }
  .sd-stat-card.c-blue::before { background: var(--accent); box-shadow: 0 0 12px var(--accent); }
  .sd-stat-card.c-gold::before { background: var(--gold); box-shadow: 0 0 12px var(--gold); }
  .sd-stat-card.c-green::before { background: var(--accent3); box-shadow: 0 0 12px var(--accent3); }

  .sd-stat-icon {
    width: 44px; height: 44px;
    border-radius: var(--radius-sm);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem;
  }
  .c-blue .sd-stat-icon { background: rgba(99,179,237,0.1); border: 1px solid rgba(99,179,237,0.2); }
  .c-gold .sd-stat-icon { background: rgba(246,173,85,0.1); border: 1px solid rgba(246,173,85,0.2); }
  .c-green .sd-stat-icon { background: rgba(104,211,145,0.1); border: 1px solid rgba(104,211,145,0.2); }

  .sd-num {
    font-family: var(--font-display);
    font-size: 3rem;
    font-weight: 400;
    color: var(--text);
    line-height: 1;
    margin-top: auto;
  }
  .c-blue .sd-num { color: var(--accent); }
  .c-gold .sd-num { color: var(--gold); }
  .c-green .sd-num { color: var(--accent3); }

  .sd-label {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .sd-stat-link {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    text-decoration: none;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-top: 0.8rem;
    transition: gap 0.2s, opacity 0.2s;
    letter-spacing: 0.04em;
  }
  .c-blue .sd-stat-link { color: var(--accent); }
  .c-gold .sd-stat-link { color: var(--gold); }
  .c-green .sd-stat-link { color: var(--accent3); }
  .sd-stat-link:hover { gap: 10px; opacity: 0.7; }

  /* ─── Content Cards ─── */
  .sd-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.6rem;
    position: relative;
    overflow: hidden;
    height: 100%;
    animation: sd-fadein 0.5s 0.35s both;
  }

  .sd-card::after {
    content: '';
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
  }

  .sd-section-title {
    font-family: var(--font-ui);
    font-size: 0.72rem;
    font-weight: 800;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.14em;
    margin: 0 0 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  .sd-section-title span.dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent);
    display: inline-block;
    flex-shrink: 0;
  }
  .sd-section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* ─── Course Progress ─── */
  .sd-course-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.8rem 0;
    border-bottom: 1px solid var(--border);
    transition: background 0.2s;
    border-radius: var(--radius-sm);
  }
  .sd-course-row:last-of-type { border-bottom: none; }

  .sd-course-thumb {
    width: 44px; height: 44px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
    overflow: hidden;
    background: var(--surface2);
    border: 1px solid var(--border);
  }
  .sd-course-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .sd-course-info { flex: 1; min-width: 0; }
  .sd-course-name {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sd-course-pct {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    color: var(--text-muted);
    margin-top: 0.2rem;
  }

  .sd-prog-track {
    background: rgba(255,255,255,0.05);
    border-radius: 99px;
    height: 4px;
    overflow: hidden;
    margin-top: 0.5rem;
  }
  .sd-prog-fill {
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    box-shadow: 0 0 8px rgba(99,179,237,0.5);
    transition: width 0.8s cubic-bezier(0.25, 1, 0.5, 1);
  }

  .sd-continue-btn {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    color: var(--accent);
    text-decoration: none;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 5px 10px;
    border: 1px solid rgba(99,179,237,0.2);
    border-radius: 8px;
    background: rgba(99,179,237,0.06);
    transition: background 0.2s, border-color 0.2s, gap 0.2s;
  }
  .sd-continue-btn:hover { background: rgba(99,179,237,0.12); border-color: rgba(99,179,237,0.4); gap: 8px; }

  /* ─── Innovation List Rows ─── */
  .sd-list-row {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.9rem 1rem;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.8rem;
    transition: border-color 0.2s, transform 0.2s;
    animation: sd-fadein 0.4s both;
  }
  .sd-list-row:hover { border-color: var(--border-glow); transform: translateX(4px); }

  .sd-list-row-title {
    font-size: 0.83rem;
    font-weight: 700;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sd-list-row-sub {
    font-size: 0.72rem;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 0.2rem;
  }

  .sd-pill {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    padding: 3px 8px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.03);
    color: var(--text-dim);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .sd-view-btn {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    color: var(--accent2);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
    padding: 4px 8px;
    border: 1px solid rgba(246,173,85,0.15);
    border-radius: 8px;
    background: rgba(246,173,85,0.05);
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .sd-view-btn:hover { background: rgba(246,173,85,0.12); border-color: rgba(246,173,85,0.35); }

  .sd-hub-link {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--accent);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-top: 0.8rem;
    letter-spacing: 0.04em;
    opacity: 0.7;
    transition: opacity 0.2s, gap 0.2s;
  }
  .sd-hub-link:hover { opacity: 1; gap: 8px; }

  .sd-muted {
    font-size: 0.8rem;
    color: var(--text-muted);
    line-height: 1.6;
  }
  .sd-muted a { color: var(--accent); text-decoration: none; opacity: 0.8; }
  .sd-muted a:hover { opacity: 1; }

  /* ─── Skeleton ─── */
  .sd-skeleton {
    background: linear-gradient(90deg, var(--surface) 0%, var(--surface2) 50%, var(--surface) 100%);
    background-size: 700px 100%;
    animation: shimmer 1.8s infinite;
    border-radius: var(--radius);
    height: 120px;
    border: 1px solid var(--border);
  }
  @keyframes shimmer {
    0%   { background-position: -700px 0; }
    100% { background-position: 700px 0; }
  }

  /* ─── Animations ─── */
  @keyframes sd-fadein {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ─── Responsive ─── */
  @media (max-width: 900px) {
    .sd-stats-grid { grid-template-columns: 1fr; }
    .sd-greeting { flex-direction: column; text-align: center; align-items: center; }
    .sd-clock { text-align: center; }
    .sd-greeting-left { flex-direction: column; text-align: center; }
  }
  @media (max-width: 768px) {
    .sd-num { font-size: 2.2rem; }
    .sd-greeting { padding: 1.5rem 1.2rem; }
  }
`

const getTimeGreeting = () => {
  const hour = new Date().getHours()
  if (hour >= 4 && hour < 12) return 'Morning'
  if (hour >= 12 && hour < 17) return 'Afternoon'
  if (hour >= 17 && hour < 21) return 'Evening'
  return 'Night'
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
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const dayStr = now.toLocaleDateString('en-US', { weekday: 'long' })

  return (
    <div className='sd-clock'>
      <div className='sd-clock-time'>
        {hh}:{mm}<span className='sd-secs'>:{ss}</span>
      </div>
      <div className='sd-clock-date'>{dateStr}</div>
      <div className='sd-clock-day'>{dayStr}</div>
      <div className='sd-live-badge'>Live</div>
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

        const statsRes = await fetch(`${apiUrl}/dashboard/stats`, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${authToken}` },
        })
        const statsJson = await statsRes.json()
        setStats(statsJson?.status === 200 ? statsJson.stats : null)

        const probRes = await fetch(`${apiUrl}/problems?page=1`, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${authToken}` },
        })
        const probJson = await probRes.json()
        const problems = probJson?.status === 200 ? (probJson.data?.data || []) : []
        setLatestProblems(problems.slice(0, 4))

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
        <div className='container sd-inner'>

          {/* Breadcrumb */}
          <nav className='sd-bc'>
            <Link to='/account/dashboard'>Account</Link>
            <span className='sd-bc-sep'>›</span>
            <span style={{ color: 'var(--text-dim)' }}>Dashboard</span>
          </nav>

          <div className='row'>
            <div className='col-lg-3 account-sidebar mb-4'>
              <UserSidebar />
            </div>

            <div className='col-lg-9'>

              {/* ── Greeting ── */}
              <div className='sd-greeting mb-4'>
                <div className='sd-greeting-left'>
                  <div className='sd-avatar'>{initials}</div>
                  <div className='sd-greeting-text'>
                    <h2>Good {getTimeGreeting()}, <strong>{userName}</strong> 👋</h2>
                    <p>// learn · build · innovate</p>
                  </div>
                </div>
                <LiveClock />
              </div>

              {/* ── Stats ── */}
              {loading ? (
                <div className='sd-stats-grid mb-4'>
                  {[1, 2, 3].map(i => <div key={i} className='sd-skeleton' />)}
                </div>
              ) : (
                <>
                  <div className='sd-stats-grid mb-4'>
                    <div className='sd-stat-card c-blue'>
                      <div className='sd-stat-icon'>📚</div>
                      <div className='sd-num'>{enrolled}</div>
                      <div className='sd-label'>Enrolled Courses</div>
                      <Link to='/account/student/my-learning' className='sd-stat-link'>View All →</Link>
                    </div>

                    <div className='sd-stat-card c-gold'>
                      <div className='sd-stat-icon'>✅</div>
                      <div className='sd-num'>{completed}</div>
                      <div className='sd-label'>Completed</div>
                      <Link to='/account/certificates' className='sd-stat-link'>Certificates →</Link>
                    </div>

                    <div className='sd-stat-card c-green'>
                      <div className='sd-stat-icon'>🔥</div>
                      <div className='sd-num'>{streak}</div>
                      <div className='sd-label'>Day Streak</div>
                      {streak > 0 ? (
                        <span className='sd-stat-link' style={{ cursor: 'default', color: 'var(--text-muted)' }}>Keep it going!</span>
                      ) : (
                        <Link to='/account/student/my-learning' className='sd-stat-link'>Start today →</Link>
                      )}
                    </div>
                  </div>

                  {/* ── Course Progress ── */}
                  <div className='row g-3 mb-4'>
                    <div className='col-12'>
                      <div className='sd-card'>
                        <p className='sd-section-title'>
                          <span className='dot' />
                          Course Progress
                        </p>

                        {progressCourses.length > 0 ? (
                          <>
                            {progressCourses.map((c, i) => {
                              const pct = Number.isFinite(Number(c.progress)) ? Number(c.progress) : 0
                              const courseTitle = c.title || 'Untitled course'
                              const courseId = c.course_id
                              const image = c.course_small_image || ''
                              return (
                                <div key={`${courseId}-${i}`} className='sd-course-row'>
                                  <div className='sd-course-thumb'>
                                    {image ? <img src={image} alt={courseTitle} /> : <span>📘</span>}
                                  </div>
                                  <div className='sd-course-info'>
                                    <div className='sd-course-name'>{courseTitle}</div>
                                    <div className='sd-prog-track'>
                                      <div className='sd-prog-fill' style={{ width: `${pct}%` }} />
                                    </div>
                                    <div className='sd-course-pct'>{pct}% complete</div>
                                  </div>
                                  {courseId && (
                                    <Link to={`${WATCH_ROUTE_BASE}/${courseId}`} className='sd-continue-btn'>
                                      Continue →
                                    </Link>
                                  )}
                                </div>
                              )
                            })}
                            <Link to='/account/student/my-learning' className='sd-hub-link' style={{ marginTop: '0.8rem' }}>
                              All courses →
                            </Link>
                          </>
                        ) : (
                          <div className='sd-muted'>
                            No course progress yet. Start from <Link to='/account/student/my-learning'>My Courses</Link>.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── Innovation + Showcase ── */}
                  <div className='row g-3 mb-4'>
                    <div className='col-md-6'>
                      <div className='sd-card'>
                        <p className='sd-section-title'>
                          <span className='dot' style={{ background: 'var(--gold)' }} />
                          Innovation Spotlight
                        </p>
                        {latestProblems.length === 0 ? (
                          <div className='sd-muted'>
                            No problems yet. Be the first in <Link to='/account/innovation'>Problem Hub</Link>.
                          </div>
                        ) : (
                          <div className='d-flex flex-column gap-2'>
                            {latestProblems.map((p, idx) => (
                              <div key={p.id} className='sd-list-row' style={{ animationDelay: `${0.05 * idx}s` }}>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                  <div className='sd-list-row-title'>{p.title}</div>
                                  <div className='sd-list-row-sub'>{String(p.description || '').slice(0, 70)}</div>
                                  <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                    <span className='sd-pill'>{p.category || 'General'}</span>
                                    <span className='sd-pill'>{p.status || 'open'}</span>
                                  </div>
                                </div>
                                <Link to={`/account/innovation/problem/${p.id}`} className='sd-view-btn'>View →</Link>
                              </div>
                            ))}
                            <Link to='/account/innovation' className='sd-hub-link'>Go to Problem Hub →</Link>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className='col-md-6'>
                      <div className='sd-card'>
                        <p className='sd-section-title'>
                          <span className='dot' style={{ background: 'var(--accent3)' }} />
                          Showcase Spotlight
                        </p>
                        {latestShowcases.length === 0 ? (
                          <div className='sd-muted'>
                            No showcases yet. Build in <Link to='/account/innovation/my-teams'>My Teams</Link> and publish.
                          </div>
                        ) : (
                          <div className='d-flex flex-column gap-2'>
                            {latestShowcases.map((s, idx) => (
                              <div key={s.id || s.idea_id} className='sd-list-row' style={{ animationDelay: `${0.05 * idx}s` }}>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                  <div className='sd-list-row-title'>{s.idea_title || s.title || 'Showcase'}</div>
                                  <div className='sd-list-row-sub'>Problem: {s.problem_title || '—'}</div>
                                  <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                    <span className='sd-pill'>Score: {s.score ?? 0}/10</span>
                                    <span className='sd-pill'>Completed</span>
                                  </div>
                                </div>
                                <Link to={`/account/innovation/showcases/${s.id || s.idea_id}`} className='sd-view-btn'>Open →</Link>
                              </div>
                            ))}
                            <Link to='/account/innovation/showcase' className='sd-hub-link'>Explore all showcases →</Link>
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