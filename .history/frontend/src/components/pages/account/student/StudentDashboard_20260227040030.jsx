import React, { useContext, useEffect, useState, useRef } from 'react'
import Layout from '../../../common/Layout'
import UserSidebar from '../../../common/UserSidebar'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../../context/Auth'
import { apiUrl } from '../../../common/Config'

/* ═══════════════════════════════════════
   STYLES
═══════════════════════════════════════ */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .sd-root {
    background: #f6f4ef;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    padding-bottom: 3rem;
  }

  /* ── breadcrumb ── */
  .sd-bc { font-size: 0.75rem; color: #9a8f7e; letter-spacing: 0.04em; padding: 1.4rem 0 1rem; }
  .sd-bc a { color: #c17d3c; text-decoration: none; }
  .sd-bc a:hover { text-decoration: underline; }

  /* ══════════════════════
     GREETING BANNER
  ══════════════════════ */
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

  /* ── real-time clock ── */
  .sd-clock {
    z-index: 1;
    text-align: right;
    flex-shrink: 0;
  }
  .sd-clock-time {
    font-family: 'DM Sans', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.02em;
    line-height: 1;
  }
  .sd-clock-date {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.6);
    margin-top: 0.2rem;
    letter-spacing: 0.04em;
  }
  .sd-clock-day {
    font-size: 0.7rem;
    color: rgba(255,255,255,0.45);
    margin-top: 0.1rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  /* ── live indicator ── */
  .sd-live-dot {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.68rem;
    font-weight: 700;
    color: rgba(255,255,255,0.55);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-top: 0.5rem;
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

  /* ══════════════════════
     STAT CARDS
  ══════════════════════ */
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
  .sd-stat-card::after {
    content: '';
    position: absolute;
    bottom: -20px; right: -20px;
    width: 80px; height: 80px;
    border-radius: 50%;
    opacity: 0.07;
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

  /* ══════════════════════
     SECTION TITLE
  ══════════════════════ */
  .sd-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem;
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

  /* ══════════════════════
     ACTIVITY CARD
  ══════════════════════ */
  .sd-card {
    background: #fff;
    border-radius: 18px;
    padding: 1.4rem 1.5rem;
    box-shadow: 0 2px 12px rgba(26,22,16,0.06);
    border: 1.5px solid #ede9e1;
  }

  /* ══════════════════════
     CALENDAR WEEK
  ══════════════════════ */
  .sd-calendar-day {
    text-align: center;
    padding: 0.55rem 0.2rem;
    border-radius: 12px;
    font-size: 0.75rem;
    color: #7a6f60;
    cursor: pointer;
    transition: background 0.15s;
    position: relative;
  }
  .sd-calendar-day.today {
    background: #1a2744;
    color: #fff;
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(26,39,68,0.25);
  }
  .sd-calendar-day.has-event::after {
    content: '';
    display: block;
    width: 4px; height: 4px;
    border-radius: 50%;
    background: #c17d3c;
    margin: 3px auto 0;
  }
  .sd-calendar-day.today.has-event::after { background: rgba(255,255,255,0.6); }
  .sd-calendar-day:hover:not(.today) { background: #f0ece5; }
  .sd-cal-label { font-size: 0.62rem; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.04em; }
  .sd-cal-num   { font-weight: 700; font-size: 0.9rem; margin-top: 1px; }

  /* ══════════════════════
     STUDY TIMER
  ══════════════════════ */
  .sd-timer-card {
    background: linear-gradient(135deg, #1a2744 0%, #2b3f6e 100%);
    border-radius: 18px;
    padding: 1.4rem 1.5rem;
    color: #fff;
    position: relative;
    overflow: hidden;
  }
  .sd-timer-card::before {
    content: '';
    position: absolute;
    right: -30px; bottom: -30px;
    width: 120px; height: 120px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
  }
  .sd-timer-title { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.55); margin-bottom: 0.6rem; }
  .sd-timer-display {
    font-family: 'DM Sans', sans-serif;
    font-size: 2.4rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    line-height: 1;
    margin-bottom: 1rem;
  }
  .sd-timer-display.running { color: #4ade80; }
  .sd-timer-display.paused  { color: #fbbf24; }
  .sd-timer-display.idle    { color: rgba(255,255,255,0.8); }
  .sd-timer-btns { display: flex; gap: 0.5rem; }
  .sd-timer-btn {
    padding: 0.45rem 1rem;
    border-radius: 10px;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s;
  }
  .sd-timer-btn.primary { background: #4ade80; color: #1a2744; }
  .sd-timer-btn.primary:hover { background: #22c55e; }
  .sd-timer-btn.secondary { background: rgba(255,255,255,0.1); color: #fff; }
  .sd-timer-btn.secondary:hover { background: rgba(255,255,255,0.2); }
  .sd-timer-session { font-size: 0.72rem; color: rgba(255,255,255,0.45); margin-top: 0.8rem; }

  /* ══════════════════════
     PROGRESS BARS
  ══════════════════════ */
  .sd-course-row { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1rem; }
  .sd-course-row:last-child { margin-bottom: 0; }
  .sd-course-thumb {
    width: 40px; height: 40px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
    overflow: hidden;
  }
  .sd-course-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .sd-course-info { flex: 1; min-width: 0; }
  .sd-course-name { font-size: 0.83rem; font-weight: 600; color: #1a1610; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sd-course-pct  { font-size: 0.72rem; color: #9a8f7e; margin-top: 0.1rem; }
  .sd-prog-track {
    background: #ede9e1;
    border-radius: 99px;
    height: 6px;
    overflow: hidden;
    margin-top: 0.3rem;
  }
  .sd-prog-fill {
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg, #c17d3c, #e8a75a);
    transition: width 0.6s ease;
  }

  /* ══════════════════════
     QUICK LINKS
  ══════════════════════ */
  .sd-quick-link {
    background: #fff;
    border: 1.5px solid #ede9e1;
    border-radius: 13px;
    padding: 0.85rem 1rem;
    display: flex; align-items: center; gap: 0.75rem;
    text-decoration: none;
    color: #1a1610;
    font-size: 0.84rem;
    font-weight: 600;
    transition: all 0.18s;
  }
  .sd-quick-link:hover { background: #1a2744; color: #fff; border-color: #1a2744; transform: translateX(4px); }
  .sd-quick-link .ql-icon { font-size: 1.15rem; }
  .sd-quick-link .ql-arrow { margin-left: auto; opacity: 0.35; font-size: 0.8rem; transition: opacity 0.15s; }
  .sd-quick-link:hover .ql-arrow { opacity: 1; }

  /* ══════════════════════
     ACHIEVEMENTS
  ══════════════════════ */
  .sd-badge {
    display: inline-flex; align-items: center; gap: 0.4rem;
    background: #fff8ee;
    border: 1.5px solid #f5d899;
    border-radius: 99px;
    padding: 0.32rem 0.85rem;
    font-size: 0.76rem;
    font-weight: 600;
    color: #a06010;
    margin: 0.25rem;
    transition: transform 0.15s;
  }
  .sd-badge:hover { transform: scale(1.04); }

  /* ══════════════════════
     MOTIVATIONAL QUOTE
  ══════════════════════ */
  .sd-quote {
    background: linear-gradient(135deg, #fff8ee 0%, #fff2d8 100%);
    border: 1.5px solid #f5d899;
    border-radius: 16px;
    padding: 1.3rem 1.5rem;
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }
  .sd-quote-mark {
    font-family: 'Playfair Display', serif;
    font-size: 3.5rem;
    color: #e8a75a;
    line-height: 0.8;
    flex-shrink: 0;
    margin-top: 0.3rem;
  }
  .sd-quote-text { font-size: 0.88rem; color: #5a4a30; line-height: 1.6; font-style: italic; }
  .sd-quote-author { font-size: 0.75rem; color: #9a8f7e; margin-top: 0.4rem; font-style: normal; font-weight: 600; }

  /* ══════════════════════
     TIP CARD
  ══════════════════════ */
  .sd-tip {
    background: linear-gradient(135deg, #f0f7ff 0%, #e8f2ff 100%);
    border: 1.5px solid #c5daff;
    border-radius: 16px;
    padding: 1.1rem 1.3rem;
    font-size: 0.83rem;
    color: #1a3a6e;
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
  }

  /* ══════════════════════
     UPCOMING / GOALS
  ══════════════════════ */
  .sd-goal-item {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.7rem 0;
    border-bottom: 1px solid #f0ece5;
  }
  .sd-goal-item:last-child { border-bottom: none; padding-bottom: 0; }
  .sd-goal-check {
    width: 20px; height: 20px;
    border-radius: 50%;
    border: 2px solid #ddd9d0;
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
    cursor: pointer;
  }
  .sd-goal-check.done { background: #1a8c52; border-color: #1a8c52; color: #fff; font-size: 0.7rem; }
  .sd-goal-text { font-size: 0.83rem; color: #1a1610; font-weight: 500; flex: 1; }
  .sd-goal-text.done { text-decoration: line-through; color: #9a8f7e; }
  .sd-goal-tag {
    font-size: 0.68rem;
    font-weight: 700;
    padding: 0.18rem 0.55rem;
    border-radius: 99px;
    background: #f0ece5;
    color: #7a6f60;
  }

  /* ══════════════════════
     SKELETON
  ══════════════════════ */
  @keyframes shimmer {
    0%   { background-position: -700px 0; }
    100% { background-position:  700px 0; }
  }
  .sd-skeleton {
    background: linear-gradient(90deg, #ede9e1 25%, #f6f4ef 50%, #ede9e1 75%);
    background-size: 700px 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 14px;
    height: 120px;
  }

  @media (max-width: 768px) {
    .sd-greeting { flex-direction: column; text-align: center; }
    .sd-clock { text-align: center; }
    .sd-greeting-left { flex-direction: column; text-align: center; }
  }
`

/* ═══════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════ */
const QUICK_LINKS = [
  { to: '/account/my-learning',  icon: '📚', label: 'My Courses'   },
  { to: '/account/certificates', icon: '🏆', label: 'Certificates' },
  { to: '/account/wishlist',     icon: '❤️',  label: 'Wishlist'     },
  { to: '/account/profile',      icon: '👤', label: 'My Profile'   },
  { to: '/account/settings',     icon: '⚙️',  label: 'Settings'    },
]

const ACHIEVEMENTS = [
  'First Login 🎉', '5-Day Streak 🔥', 'Quiz Master 🧠',
  'Fast Learner ⚡', 'Top Student 🌟',
]

const QUOTES = [
  { text: 'The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.', author: '— Brian Herbert' },
  { text: 'Education is not the filling of a pail, but the lighting of a fire.', author: '— W.B. Yeats' },
  { text: 'An investment in knowledge pays the best interest.', author: '— Benjamin Franklin' },
  { text: 'The more that you read, the more things you will know.', author: '— Dr. Seuss' },
]

const DAILY_GOALS = [
  { id: 1, text: 'Complete 1 lesson',       tag: 'Learning' },
  { id: 2, text: 'Watch 20 min of video',   tag: 'Video'    },
  { id: 3, text: 'Take a quiz',             tag: 'Quiz'     },
  { id: 4, text: 'Review yesterday\'s notes', tag: 'Review'  },
]

/* ═══════════════════════════════════════
   HELPERS
═══════════════════════════════════════ */
const getTimeGreeting = () => {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 12) {
    return "Morning"
  } else if (hour >= 12 && hour < 17) {
    return "Afternoon"
  } else if (hour >= 17 && hour < 21) {
    return "Evening"
  } else {
    return "Night"
  }
}

function getDayLabels() {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const today = new Date().getDay()
  return Array.from({ length: 7 }, (_, i) => ({
    label: days[i].slice(0,1),
    full:  days[i],
    num:   new Date(Date.now() - (today - i) * 864e5).getDate(),
    isToday:  i === today,
    hasEvent: [1, 3, 5].includes(i),
  }))
}

function formatTime(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2, '0')
  const s = String(secs % 60).padStart(2, '0')
  return `${m}:${s}`
}

/* ═══════════════════════════════════════
   REAL-TIME CLOCK COMPONENT
═══════════════════════════════════════ */
const LiveClock = () => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hh  = String(now.getHours()).padStart(2,'0')
  const mm  = String(now.getMinutes()).padStart(2,'0')
  const ss  = String(now.getSeconds()).padStart(2,'0')
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const dayStr  = now.toLocaleDateString('en-US', { weekday: 'long' })

  return (
    <div className='sd-clock'>
      <div className='sd-clock-time'>{hh}:{mm}<span style={{ opacity: 0.5, fontSize: '1.4rem' }}>:{ss}</span></div>
      <div className='sd-clock-date'>{dateStr}</div>
      <div className='sd-clock-day'>{dayStr}</div>
      <div className='sd-live-dot'>Live</div>
    </div>
  )
}

/* ═══════════════════════════════════════
   STUDY TIMER COMPONENT
═══════════════════════════════════════ */
const StudyTimer = () => {
  const [secs, setSecs]     = useState(0)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const intervalRef = useRef(null)

  const start = () => {
    if (running) return
    setRunning(true)
    intervalRef.current = setInterval(() => setSecs(s => s + 1), 1000)
  }

  const pause = () => {
    setRunning(false)
    clearInterval(intervalRef.current)
  }

  const reset = () => {
    setRunning(false)
    clearInterval(intervalRef.current)
    if (secs > 10) setSessions(s => s + 1)
    setSecs(0)
  }

  useEffect(() => () => clearInterval(intervalRef.current), [])

  const displayClass = running ? 'running' : secs > 0 ? 'paused' : 'idle'

  return (
    <div className='sd-timer-card'>
      <div className='sd-timer-title'>⏱ Study Timer</div>
      <div className={`sd-timer-display ${displayClass}`}>{formatTime(secs)}</div>
      <div className='sd-timer-btns'>
        {!running
          ? <button className='sd-timer-btn primary' onClick={start}>{secs > 0 ? '▶ Resume' : '▶ Start'}</button>
          : <button className='sd-timer-btn primary' onClick={pause}>⏸ Pause</button>
        }
        <button className='sd-timer-btn secondary' onClick={reset}>↺ Reset</button>
      </div>
      <div className='sd-timer-session'>Sessions today: {sessions}</div>
    </div>
  )
}

/* ═══════════════════════════════════════
   DAILY GOALS COMPONENT
═══════════════════════════════════════ */
const DailyGoals = () => {
  const [checked, setChecked] = useState({})
  const toggle = (id) => setChecked(p => ({ ...p, [id]: !p[id] }))
  const done = Object.values(checked).filter(Boolean).length

  return (
    <div className='sd-card'>
      <p className='sd-section-title'>
        Today's Goals
        <span style={{ fontSize: '0.75rem', fontFamily: 'DM Sans', fontWeight: 600, color: '#c17d3c', marginLeft: 'auto', marginRight: '0.5rem' }}>
          {done}/{DAILY_GOALS.length}
        </span>
      </p>

      {/* mini progress */}
      <div className='sd-prog-track' style={{ marginBottom: '1rem' }}>
        <div
          className='sd-prog-fill'
          style={{
            width: `${(done / DAILY_GOALS.length) * 100}%`,
            background: done === DAILY_GOALS.length ? 'linear-gradient(90deg,#1a8c52,#34c17d)' : undefined
          }}
        />
      </div>

      {DAILY_GOALS.map(g => (
        <div key={g.id} className='sd-goal-item'>
          <div className={`sd-goal-check ${checked[g.id] ? 'done' : ''}`} onClick={() => toggle(g.id)}>
            {checked[g.id] && '✓'}
          </div>
          <div className={`sd-goal-text ${checked[g.id] ? 'done' : ''}`}>{g.text}</div>
          <div className='sd-goal-tag'>{g.tag}</div>
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════ */
const StudentDashboard = () => {
  const { user } = useContext(AuthContext)
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [quote]               = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)])

  // Your AuthContext seems like: user = { token, user: { name } }
  const token = user?.token
  const userName = user?.user?.name || user?.name || 'Student'

  const enrolled  = stats?.enrolled_courses  ?? 0
  const completed = stats?.completed_courses ?? 0
  const streak    = stats?.streak_days       ?? 0

  // ✅ real API data (already returned by your DashboardController)
  const progressCourses = Array.isArray(stats?.progress_courses) ? stats.progress_courses : []

  // If your WatchCourse route is different, change this one line:
  const WATCH_ROUTE_BASE = '/watch-course' // e.g. '/account/watch-course' if that is your route

  const fullName = userName || ''
  const displayName = fullName.trim() !== '' ? fullName : 'Student'
  const initials = displayName
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const weekDays  = getDayLabels()

  /* fetch stats */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res    = await fetch(`${apiUrl}/dashboard/stats`, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
        })
        const result = await res.json()
        setStats(result.status === 200 ? result.stats : null)
      } catch {
        setStats(null)
      } finally {
        setLoading(false)
      }
    }
    if (token) load()
  }, [token])

  return (
    <Layout>
      <style>{css}</style>
      <div className='sd-root'>
        <div className='container'>

          {/* Breadcrumb */}
          <nav className='sd-bc'>
            <Link to='/account/dashboard'>Account</Link>
            <span className='mx-2'>›</span>
            <span style={{ color: '#1a1610' }}>Student Dashboard</span>
          </nav>

          <div className='row'>

            {/* ── Sidebar ── */}
            <div className='col-lg-3 account-sidebar mb-4'>
              <UserSidebar />
            </div>

            {/* ── Main ── */}
            <div className='col-lg-9'>

              {/* ── Greeting + Real-time Clock ── */}
              <div className='sd-greeting mb-4'>
                <div className='sd-greeting-left'>
                  <div className='sd-avatar'>{initials}</div>
                  <div className='sd-greeting-text'>
                    <h2>Good {getTimeGreeting()}, {userName}! 👋</h2>
                    <p>You're making great progress — keep it up!</p>
                  </div>
                </div>
                <LiveClock />
              </div>

              {/* ── Skeletons or content ── */}
              {loading ? (
                <div className='row g-3 mb-4'>
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
                          <div className='sd-num'>{streak}</div>
                          <div className='sd-label'>Day Streak</div>
                        </div>
                        <span className='sd-stat-link' style={{ cursor:'default', color:'#9a8f7e' }}>Keep it going!</span>
                      </div>
                    </div>
                  </div>

                  {/* ── Study Timer + Week Calendar ── */}
                  <div className='row g-3 mb-4'>
                    <div className='col-md-5'>
                      <StudyTimer />
                    </div>
                    <div className='col-md-7'>
                      <div className='sd-card h-100'>
                        <p className='sd-section-title'>This Week</p>
                        <div className='d-flex justify-content-between gap-1'>
                          {weekDays.map((d, i) => (
                            <div key={i} className={`sd-calendar-day flex-fill ${d.isToday ? 'today' : ''} ${d.hasEvent ? 'has-event' : ''}`}>
                              <div className='sd-cal-label'>{d.label}</div>
                              <div className='sd-cal-num'>{d.num}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                          <div style={{ fontSize: '0.75rem', color: '#9a8f7e', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#c17d3c', display: 'inline-block' }} />
                            Event day
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#9a8f7e', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1a2744', display: 'inline-block' }} />
                            Today
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── Course Progress + Quick Links ── */}
                  <div className='row g-3 mb-4'>
                    <div className='col-md-7'>
                      <div className='sd-card h-100'>
                        <p className='sd-section-title'>Course Progress</p>

                        {/* ✅ Real courses from API */}
                        {progressCourses.length > 0 ? (
                          <>
                            {progressCourses.map((c, i) => {
                              const pct = Number.isFinite(Number(c.progress)) ? Number(c.progress) : 0
                              const courseTitle = c.title || 'Untitled course'
                              const courseId = c.course_id
                              const image = c.course_small_image || ''

                              // if no image, fallback to emoji tile (still looks good)
                              const fallbackEmoji = '📘'

                              return (
                                <div key={`${courseId}-${i}`} className='sd-course-row'>
                                  <div className='sd-course-thumb' style={{ background: image ? '#fff' : '#e8f4ff' }}>
                                    {image ? <img src={image} alt={courseTitle} /> : <span>{fallbackEmoji}</span>}
                                  </div>

                                  <div className='sd-course-info'>
                                    <div className='sd-course-name'>{courseTitle}</div>
                                    <div className='sd-prog-track'>
                                      <div className='sd-prog-fill' style={{ width: `${pct}%` }} />
                                    </div>
                                    <div className='sd-course-pct'>{pct}% complete</div>
                                  </div>

                                  {/* Continue link */}
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

                            <Link
                              to='/account/my-learning'
                              className='sd-stat-link'
                              style={{ marginTop: '0.8rem', display: 'inline-flex' }}
                            >
                              All courses →
                            </Link>
                          </>
                        ) : (
                          <div style={{ color: '#9a8f7e', fontSize: '0.85rem' }}>
                            No course progress yet. Start learning from <Link to='/account/my-learning'>My Courses</Link>.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className='col-md-5'>
                      <div className='sd-card h-100'>
                        <p className='sd-section-title'>Quick Links</p>
                        <div className='d-flex flex-column gap-2'>
                          {QUICK_LINKS.map((ql, i) => (
                            <Link key={i} to={ql.to} className='sd-quick-link'>
                              <span className='ql-icon'>{ql.icon}</span>
                              {ql.label}
                              <span className='ql-arrow'>›</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── Daily Goals ── */}
                  <div className='mb-4'>
                    <DailyGoals />
                  </div>

                  {/* ── Achievements ── */}
                  <div className='sd-card mb-4'>
                    <p className='sd-section-title'>Achievements</p>
                    <div>
                      {ACHIEVEMENTS.map((a, i) => (
                        <span key={i} className='sd-badge'>{a}</span>
                      ))}
                    </div>
                  </div>

                  {/* ── Motivational Quote ── */}
                  <div className='sd-quote mb-4'>
                    <div className='sd-quote-mark'>"</div>
                    <div>
                      <div className='sd-quote-text'>{quote.text}</div>
                      <div className='sd-quote-author'>{quote.author}</div>
                    </div>
                  </div>

                  {/* ── Daily Tip ── */}
                  <div className='sd-tip'>
                    <span style={{ fontSize: '1.3rem' }}>💡</span>
                    <div>
                      <strong style={{ fontSize: '0.85rem' }}>Learning tip of the day</strong>
                      <p style={{ margin: '0.25rem 0 0', lineHeight: 1.6 }}>
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
      </div>
    </Layout>
  )
}

export default StudentDashboard