import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../../common/Layout'
import UserSidebar from '../../../common/UserSidebar'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { apiUrl, token as configToken } from '../../../common/Config'
import { AuthContext } from '../../../context/Auth'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,400&display=swap');

  :root {
    --bg: #f0f4ff;
    --white: #ffffff;
    --blue: #4f6ef7;
    --blue-light: #eef0ff;
    --blue-mid: #dde2ff;
    --purple: #7c5cbf;
    --orange: #ff7140;
    --orange-light: #fff2ee;
    --green: #22c98e;
    --green-light: #e6faf3;
    --yellow: #ffb020;
    --yellow-light: #fff8ec;
    --text: #14142b;
    --text2: #6e7191;
    --text3: #a0abc0;
    --border: #e4e7f4;
    --radius: 22px;
    --radius-sm: 14px;
    --shadow: 0 4px 24px rgba(79,110,247,0.08);
    --shadow-hover: 0 16px 48px rgba(79,110,247,0.16);
    --font: 'Plus Jakarta Sans', sans-serif;
    --font-serif: 'Fraunces', serif;
  }

  .id-root {
    background: var(--bg);
    min-height: 100vh;
    font-family: var(--font);
    padding-bottom: 4rem;
    color: var(--text);
    position: relative;
  }

  /* blobs */
  .id-blob-wrap {
    position: fixed; inset: 0;
    pointer-events: none; overflow: hidden; z-index: 0;
  }
  .id-blob {
    position: absolute; border-radius: 50%;
    filter: blur(80px); opacity: 0.3;
  }
  .id-blob-1 {
    width: 480px; height: 480px;
    background: radial-gradient(circle, #c7d0ff, #a5b4fc);
    top: -120px; right: -80px;
    animation: id-blob 10s ease-in-out infinite alternate;
  }
  .id-blob-2 {
    width: 360px; height: 360px;
    background: radial-gradient(circle, #ffd5c5, #ffb3a0);
    bottom: 60px; left: -80px;
    animation: id-blob 13s ease-in-out infinite alternate-reverse;
  }
  @keyframes id-blob {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(28px,18px) scale(1.08); }
  }

  .id-inner { position: relative; z-index: 1; }

  .id-bc {
    font-size: 0.75rem; color: var(--text3);
    padding: 1.5rem 0 1rem;
    display: flex; align-items: center; gap: 0.4rem; font-weight: 500;
  }
  .id-bc a { color: var(--blue); text-decoration: none; }
  .id-bc a:hover { text-decoration: underline; }

  /* ── Hero banner ── */
  .id-banner {
    background: linear-gradient(135deg, #4f6ef7 0%, #7c5cbf 60%, #a855f7 100%);
    border-radius: 28px;
    padding: 2rem 2.4rem;
    display: flex; align-items: center;
    justify-content: space-between; gap: 1.5rem;
    margin-bottom: 1.8rem;
    position: relative; overflow: hidden;
    box-shadow: 0 20px 60px rgba(79,110,247,0.3);
    animation: id-up 0.6s cubic-bezier(0.22,1,0.36,1) both;
  }
  .id-banner::before {
    content: '';
    position: absolute; top: -60%; left: -20%;
    width: 60%; height: 200%;
    background: linear-gradient(105deg, transparent, rgba(255,255,255,0.1), transparent);
    transform: rotate(25deg); pointer-events: none;
  }
  .id-banner-deco {
    position: absolute; border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.12); pointer-events: none;
  }
  .id-banner-deco.d1 { width: 200px; height: 200px; right: -60px; bottom: -60px; }
  .id-banner-deco.d2 { width: 110px; height: 110px; right: 90px; top: -40px; }

  .id-banner-left { display: flex; align-items: center; gap: 1.2rem; position: relative; z-index: 1; }
  .id-banner-icon {
    width: 56px; height: 56px; border-radius: 18px;
    background: rgba(255,255,255,0.18);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255,255,255,0.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.6rem; flex-shrink: 0;
    animation: id-pop 0.5s 0.1s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes id-pop {
    from { opacity: 0; transform: scale(0.5) rotate(-15deg); }
    to   { opacity: 1; transform: scale(1) rotate(0); }
  }
  .id-banner-title {
    font-size: 1.35rem; font-weight: 800; color: #fff;
    letter-spacing: -0.02em; margin: 0;
  }
  .id-banner-sub {
    font-size: 0.8rem; color: rgba(255,255,255,0.65); margin: 0.25rem 0 0;
  }

  .id-banner-actions { display: flex; gap: 10px; position: relative; z-index: 1; flex-shrink: 0; }
  .id-btn-white {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: var(--font); font-size: 0.8rem; font-weight: 700;
    color: var(--blue); text-decoration: none;
    background: #fff; padding: 9px 18px; border-radius: 12px;
    border: none; transition: all 0.2s;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  }
  .id-btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); color: var(--blue); }
  .id-btn-ghost {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: var(--font); font-size: 0.8rem; font-weight: 700;
    color: #fff; text-decoration: none;
    background: rgba(255,255,255,0.15);
    border: 1.5px solid rgba(255,255,255,0.3);
    padding: 9px 18px; border-radius: 12px;
    transition: all 0.2s;
  }
  .id-btn-ghost:hover { background: rgba(255,255,255,0.25); color: #fff; }

  /* ── Stat cards ── */
  .id-stats-row {
    display: grid; grid-template-columns: repeat(5,1fr); gap: 1rem; margin-bottom: 1.4rem;
  }
  .id-stat {
    background: var(--white); border-radius: var(--radius);
    padding: 1.4rem 1.2rem; border: 1.5px solid var(--border);
    box-shadow: var(--shadow); position: relative; overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
    animation: id-up 0.5s both; display: flex; flex-direction: column;
    cursor: default;
  }
  .id-stat:nth-child(1){animation-delay:0.08s;}
  .id-stat:nth-child(2){animation-delay:0.14s;}
  .id-stat:nth-child(3){animation-delay:0.20s;}
  .id-stat:nth-child(4){animation-delay:0.26s;}
  .id-stat:nth-child(5){animation-delay:0.32s;}
  .id-stat:hover { transform: translateY(-6px) scale(1.02); box-shadow: var(--shadow-hover); }
  .id-stat::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 3px; border-radius: 3px 3px 0 0;
  }
  .id-stat.s-blue::before   { background: linear-gradient(90deg,#4f6ef7,#818cf8); }
  .id-stat.s-green::before  { background: linear-gradient(90deg,#22c98e,#34d399); }
  .id-stat.s-yellow::before { background: linear-gradient(90deg,#ffb020,#fbbf24); }
  .id-stat.s-purple::before { background: linear-gradient(90deg,#7c5cbf,#a78bfa); }
  .id-stat.s-orange::before { background: linear-gradient(90deg,#ff7140,#fb923c); }

  .id-stat-icon {
    width: 40px; height: 40px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; margin-bottom: 1rem; flex-shrink: 0;
  }
  .s-blue   .id-stat-icon { background: var(--blue-light); }
  .s-green  .id-stat-icon { background: var(--green-light); }
  .s-yellow .id-stat-icon { background: var(--yellow-light); }
  .s-purple .id-stat-icon { background: #f3eeff; }
  .s-orange .id-stat-icon { background: var(--orange-light); }

  .id-stat-num {
    font-family: var(--font-serif); font-size: 2.4rem; font-weight: 700;
    line-height: 1; color: var(--text); margin-bottom: 0.25rem;
  }
  .id-stat-label {
    font-size: 0.72rem; color: var(--text2); font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .id-stat-hint {
    font-size: 0.68rem; color: var(--text3); margin-top: 0.25rem;
  }
  .id-stat-link {
    margin-top: auto; padding-top: 0.8rem;
    font-size: 0.72rem; font-weight: 700; text-decoration: none;
    display: inline-flex; align-items: center; gap: 4px; transition: gap 0.2s;
  }
  .s-blue   .id-stat-link { color: var(--blue); }
  .s-green  .id-stat-link { color: var(--green); }
  .s-yellow .id-stat-link { color: var(--yellow); }
  .s-purple .id-stat-link { color: var(--purple); }
  .s-orange .id-stat-link { color: var(--orange); }
  .id-stat-link:hover { gap: 9px; }

  /* ── Recent enrollments card ── */
  .id-card {
    background: var(--white); border-radius: var(--radius);
    padding: 1.6rem; border: 1.5px solid var(--border);
    box-shadow: var(--shadow); animation: id-up 0.5s 0.35s both;
  }

  .id-card-title {
    font-size: 0.72rem; font-weight: 800; color: var(--text2);
    text-transform: uppercase; letter-spacing: 0.12em;
    margin: 0 0 1.2rem; display: flex; align-items: center; gap: 0.5rem;
  }
  .id-card-title::after { content: ''; flex: 1; height: 1.5px; background: var(--border); }
  .id-card-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  .id-badge-count {
    font-size: 0.65rem; font-weight: 700; padding: 3px 10px;
    border-radius: 99px; background: var(--blue-light);
    color: var(--blue); border: 1px solid var(--blue-mid);
    margin-left: auto; flex-shrink: 0;
  }

  /* enrollment rows */
  .id-enroll-row {
    display: flex; align-items: center; gap: 1rem;
    padding: 0.9rem 0.8rem; border-radius: var(--radius-sm);
    transition: background 0.15s, transform 0.2s;
    border-bottom: 1px solid var(--border);
  }
  .id-enroll-row:last-child { border-bottom: none; }
  .id-enroll-row:hover { background: var(--bg); transform: translateX(4px); }

  .id-enroll-avatar {
    width: 40px; height: 40px; border-radius: 12px;
    background: linear-gradient(135deg, var(--blue-light), var(--blue-mid));
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-serif); font-size: 1rem; font-weight: 700;
    color: var(--blue); flex-shrink: 0; border: 1.5px solid var(--border);
  }
  .id-enroll-info { flex: 1; min-width: 0; }
  .id-enroll-name {
    font-size: 0.85rem; font-weight: 700; color: var(--text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .id-enroll-email {
    font-size: 0.7rem; color: var(--text3);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px;
  }
  .id-enroll-course {
    font-size: 0.78rem; font-weight: 600; color: var(--text2);
    max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    flex-shrink: 0;
  }
  .id-enroll-date {
    font-size: 0.7rem; color: var(--text3); white-space: nowrap; flex-shrink: 0;
  }

  .id-empty {
    font-size: 0.85rem; color: var(--text2); padding: 2rem 0; text-align: center;
  }

  /* skeleton */
  .id-skeleton {
    border-radius: var(--radius); height: 110px;
    background: linear-gradient(90deg,#e8ecff 0%,#f0f4ff 50%,#e8ecff 100%);
    background-size: 700px 100%; animation: shimmer 1.6s infinite;
    border: 1.5px solid var(--border);
  }
  @keyframes shimmer {
    0%   { background-position: -700px 0; }
    100% { background-position: 700px 0; }
  }
  @keyframes id-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 1100px) { .id-stats-row { grid-template-columns: repeat(3,1fr); } }
  @media (max-width: 700px)  { .id-stats-row { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 480px)  {
    .id-stats-row { grid-template-columns: 1fr; }
    .id-banner { flex-direction: column; align-items: flex-start; }
    .id-banner-actions { flex-wrap: wrap; }
  }
`

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const authToken = user?.token || user?.user?.token || configToken
  const userName = user?.user?.name || user?.name || 'Instructor'

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${apiUrl}/instructor/dashboard/stats`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${authToken}` },
      })
      const result = await res.json()
      if (result.status === 200) {
        setStats(result.data)
      } else {
        toast.error(result.message || 'Failed to load instructor stats')
      }
    } catch (e) {
      console.log(e)
      toast.error('Server error loading instructor dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authToken) load()
    // eslint-disable-next-line
  }, [authToken])

  const initials = (name) =>
    (name || 'S').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <Layout>
      <style>{css}</style>

      {/* blobs */}
      <div className='id-blob-wrap'>
        <div className='id-blob id-blob-1' />
        <div className='id-blob id-blob-2' />
      </div>

      <div className='id-root'>
        <div className='container id-inner'>

          {/* breadcrumb */}
          <nav className='id-bc'>
            <Link to='/account'>Account</Link>
            <span>›</span>
            <span>Instructor Dashboard</span>
          </nav>

          <div className='row'>
            {/* sidebar */}
            <div className='col-lg-3 account-sidebar mb-4'>
              <UserSidebar />
            </div>

            <div className='col-lg-9'>

              {/* ── Banner ── */}
              <div className='id-banner mb-4'>
                <div className='id-banner-deco d1' />
                <div className='id-banner-deco d2' />
                <div className='id-banner-left'>
                  <div className='id-banner-icon'>🎓</div>
                  <div>
                    <h2 className='id-banner-title'>Instructor Dashboard</h2>
                    <p className='id-banner-sub'>Track your course performance and recent enrollments.</p>
                  </div>
                </div>
                <div className='id-banner-actions'>
                  <Link to='/account/courses/create' className='id-btn-white'>+ Create Course</Link>
                  <Link to='/account/my-courses' className='id-btn-ghost'>My Courses →</Link>
                </div>
              </div>

              {/* ── Content ── */}
              {loading ? (
                <div className='id-stats-row mb-4'>
                  {[1,2,3,4,5].map(i => <div key={i} className='id-skeleton' />)}
                </div>
              ) : !stats ? (
                <div className='alert alert-danger'>No stats found.</div>
              ) : (
                <>
                  {/* Stat cards */}
                  <div className='id-stats-row mb-4'>
                    <div className='id-stat s-blue'>
                      <div className='id-stat-icon'>📚</div>
                      <div className='id-stat-num'>{stats.total_courses ?? 0}</div>
                      <div className='id-stat-label'>Total Courses</div>
                      <div className='id-stat-hint'>All courses you created</div>
                      <Link to='/account/my-courses' className='id-stat-link'>Manage →</Link>
                    </div>

                    <div className='id-stat s-green'>
                      <div className='id-stat-icon'>✅</div>
                      <div className='id-stat-num'>{stats.active_courses ?? 0}</div>
                      <div className='id-stat-label'>Active Courses</div>
                      <div className='id-stat-hint'>Published &amp; visible</div>
                      <Link to='/account/my-courses' className='id-stat-link'>View →</Link>
                    </div>

                    <div className='id-stat s-yellow'>
                      <div className='id-stat-icon'>👥</div>
                      <div className='id-stat-num'>{stats.total_enrollments ?? 0}</div>
                      <div className='id-stat-label'>Enrollments</div>
                      <div className='id-stat-hint'>Students enrolled</div>
                    </div>

                    <div className='id-stat s-purple'>
                      <div className='id-stat-icon'>⭐</div>
                      <div className='id-stat-num'>{stats.avg_rating ?? '—'}</div>
                      <div className='id-stat-label'>Avg Rating</div>
                      <div className='id-stat-hint'>Across all courses</div>
                    </div>

                    <div className='id-stat s-orange'>
                      <div className='id-stat-icon'>💬</div>
                      <div className='id-stat-num'>{stats.total_reviews ?? 0}</div>
                      <div className='id-stat-label'>Reviews</div>
                      <div className='id-stat-hint'>All course reviews</div>
                    </div>
                  </div>

                  {/* Recent enrollments */}
                  <div className='id-card'>
                    <p className='id-card-title'>
                      <span className='id-card-dot' style={{ background: 'var(--blue)' }} />
                      Recent Enrollments
                      <span className='id-badge-count'>Last 5</span>
                    </p>

                    {stats.recent_enrollments?.length ? (
                      stats.recent_enrollments.map((r) => (
                        <div key={r.id} className='id-enroll-row'>
                          <div className='id-enroll-avatar'>
                            {initials(r.student_name)}
                          </div>
                          <div className='id-enroll-info'>
                            <div className='id-enroll-name'>{r.student_name}</div>
                            <div className='id-enroll-email'>{r.student_email}</div>
                          </div>
                          <div className='id-enroll-course'>{r.course_title}</div>
                          <div className='id-enroll-date'>
                            {r.created_at
                              ? new Date(r.created_at).toLocaleDateString('en-US', {
                                  month: 'short', day: 'numeric', year: 'numeric'
                                })
                              : '—'}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className='id-empty'>No enrollments yet.</div>
                    )}
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

export default Dashboard