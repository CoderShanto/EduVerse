import React, { useContext, useEffect, useMemo, useState } from 'react'
import Layout from '../../common/Layout'
import UserSidebar from '../../common/UserSidebar'
import toast from 'react-hot-toast'
import { apiUrl } from '../../common/Config'
import { AuthContext } from '../../context/Auth'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,400&display=swap');

  :root {
    --bg: #f0f4ff;
    --white: #ffffff;
    --blue: #4f6ef7;
    --blue-light: #eef0ff;
    --blue-mid: #dde2ff;
    --purple: #7c5cbf;
    --purple-light: #f5f0ff;
    --orange: #ff7140;
    --orange-light: #fff2ee;
    --green: #22c98e;
    --green-light: #e6faf3;
    --yellow: #ffb020;
    --yellow-light: #fff8e6;
    --red: #ef4444;
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

  .pf-root {
    background: var(--bg);
    min-height: 100vh;
    font-family: var(--font);
    padding-bottom: 4rem;
    color: var(--text);
    position: relative;
  }

  .pf-blob-wrap { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
  .pf-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.3; }
  .pf-blob-1 { width: 520px; height: 520px; background: radial-gradient(circle,#c7d0ff,#a5b4fc); top: -160px; right: -120px; animation: blob-float 10s ease-in-out infinite alternate; }
  .pf-blob-2 { width: 360px; height: 360px; background: radial-gradient(circle,#ffd5c5,#ffb3a0); bottom: 0; left: -80px; animation: blob-float 14s ease-in-out infinite alternate-reverse; }
  .pf-blob-3 { width: 240px; height: 240px; background: radial-gradient(circle,#b5f0d8,#86efca); top: 45%; left: 38%; animation: blob-float 9s ease-in-out infinite alternate; }
  @keyframes blob-float { from{transform:translate(0,0) scale(1);} to{transform:translate(28px,18px) scale(1.1);} }

  .pf-inner { position: relative; z-index: 1; }

  .pf-hero {
    background: linear-gradient(135deg,#4f6ef7 0%,#7c5cbf 55%,#a855f7 100%);
    border-radius: 28px;
    padding: 2.2rem 2.4rem;
    margin-bottom: 1.8rem;
    position: relative;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(79,110,247,0.35);
    animation: pf-up 0.6s cubic-bezier(0.22,1,0.36,1) both;
  }
  .pf-hero::before {
    content: '';
    position: absolute; top: -60%; left: -20%;
    width: 60%; height: 200%;
    background: linear-gradient(105deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.1) 50%,rgba(255,255,255,0) 100%);
    transform: rotate(25deg); pointer-events: none;
  }
  .pf-hero-deco { position: absolute; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.15); pointer-events: none; }
  .pf-hero-deco.d1 { width: 220px; height: 220px; right: -70px; bottom: -70px; }
  .pf-hero-deco.d2 { width: 130px; height: 130px; right: 90px; top: -50px; }
  .pf-hero-deco.d3 { width: 60px; height: 60px; right: 200px; bottom: 20px; }

  .pf-hero-body { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; position: relative; z-index: 1; }
  .pf-hero-left { display: flex; align-items: center; gap: 1.4rem; }

  .pf-avatar {
    width: 68px; height: 68px; border-radius: 20px;
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(12px);
    border: 2px solid rgba(255,255,255,0.35);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-serif); font-size: 1.6rem; font-style: italic; color: #fff;
    flex-shrink: 0; box-shadow: 0 8px 24px rgba(0,0,0,0.18);
    animation: pop-in 0.5s 0.15s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes pop-in { from{opacity:0;transform:scale(0.5) rotate(-15deg);} to{opacity:1;transform:scale(1) rotate(0);} }

  .pf-hero-name { font-size: 1.5rem; font-weight: 800; color: #fff; margin: 0; letter-spacing: -0.02em; }
  .pf-hero-role {
    display: inline-flex; align-items: center; gap: 5px;
    background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3);
    border-radius: 99px; padding: 3px 12px;
    font-size: 0.72rem; font-weight: 700; color: #fff;
    text-transform: uppercase; letter-spacing: 0.08em; margin-top: 0.4rem;
  }
  .pf-hero-sub { font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-top: 0.3rem; }

  .pf-hero-actions { display: flex; gap: 0.7rem; flex-wrap: wrap; }
  .pf-btn-ghost {
    font-size: 0.8rem; font-weight: 700; color: #fff;
    border: 1.5px solid rgba(255,255,255,0.35);
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(8px);
    border-radius: 12px; padding: 8px 18px;
    text-decoration: none; cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .pf-btn-ghost:hover { background: rgba(255,255,255,0.22); border-color: rgba(255,255,255,0.55); color: #fff; }
  .pf-btn-solid {
    font-size: 0.8rem; font-weight: 700; color: var(--blue);
    border: none; background: #fff;
    border-radius: 12px; padding: 8px 18px;
    cursor: pointer; transition: opacity 0.2s, transform 0.2s;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .pf-btn-solid:hover { opacity: 0.88; transform: translateY(-1px); }

  .pf-url-chip {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 10px; padding: 6px 14px;
    font-size: 0.72rem; color: rgba(255,255,255,0.7);
    word-break: break-all; max-width: 280px;
    margin-top: 0.8rem;
  }
  .pf-url-chip span { color: rgba(255,255,255,0.4); font-size: 0.65rem; display: block; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.08em; }

  .pf-stats-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.2rem; margin-bottom: 1.6rem; }

  .pf-stat {
    background: var(--white); border-radius: var(--radius);
    padding: 1.5rem; border: 1.5px solid var(--border);
    box-shadow: var(--shadow); position: relative; overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
    animation: pf-up 0.5s both;
    display: flex; flex-direction: column; gap: 0.3rem;
  }
  .pf-stat:nth-child(1){animation-delay:0.1s;}
  .pf-stat:nth-child(2){animation-delay:0.2s;}
  .pf-stat:nth-child(3){animation-delay:0.3s;}
  .pf-stat:hover { transform: translateY(-7px) scale(1.02); box-shadow: var(--shadow-hover); }
  .pf-stat::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; border-radius: 99px 99px 0 0; }
  .pf-stat.c-blue::before { background: linear-gradient(90deg,#4f6ef7,#818cf8); }
  .pf-stat.c-green::before { background: linear-gradient(90deg,#22c98e,#34d399); }
  .pf-stat.c-orange::before { background: linear-gradient(90deg,#ff7140,#fb923c); }
  .pf-stat::after { content: attr(data-num); position: absolute; right: -8px; bottom: -18px; font-family: var(--font-serif); font-size: 6rem; font-weight: 700; opacity: 0.04; color: #000; pointer-events: none; }
  .pf-stat-icon { width: 46px; height: 46px; border-radius: 13px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; margin-bottom: 0.5rem; }
  .c-blue .pf-stat-icon { background: var(--blue-light); }
  .c-green .pf-stat-icon { background: var(--green-light); }
  .c-orange .pf-stat-icon { background: var(--orange-light); }
  .pf-stat-num { font-family: var(--font-serif); font-size: 3rem; font-weight: 700; line-height: 1; color: var(--text); }
  .pf-stat-label { font-size: 0.78rem; color: var(--text2); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }

  .pf-card {
    background: var(--white); border-radius: var(--radius);
    padding: 1.6rem; border: 1.5px solid var(--border);
    box-shadow: var(--shadow); margin-bottom: 1.4rem;
    animation: pf-up 0.5s both;
    position: relative; overflow: hidden;
  }
  .pf-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.2rem; }
  .pf-card-title { font-size: 0.72rem; font-weight: 800; color: var(--text2); text-transform: uppercase; letter-spacing: 0.12em; display: flex; align-items: center; gap: 0.5rem; margin: 0; }
  .pf-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .pf-badge { font-size: 0.68rem; font-weight: 700; padding: 4px 10px; border-radius: 99px; display: inline-flex; align-items: center; gap: 4px; }
  .pf-badge.blue { background: var(--blue-light); color: var(--blue); }
  .pf-badge.green { background: var(--green-light); color: #0f7a56; }
  .pf-badge.orange { background: var(--orange-light); color: var(--orange); }
  .pf-badge.purple { background: var(--purple-light); color: var(--purple); }

  .pf-course-item {
    background: var(--bg); border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    padding: 1rem 1.1rem;
    transition: border-color 0.2s, transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
    height: 100%;
  }
  .pf-course-item:hover { border-color: #c7d0ff; transform: translateY(-4px); box-shadow: var(--shadow-hover); }
  .pf-course-thumb {
    width: 48px; height: 48px; border-radius: 12px;
    background: var(--blue-light); overflow: hidden;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem; flex-shrink: 0; border: 1.5px solid var(--border);
  }
  .pf-course-thumb img { width:100%; height:100%; object-fit:cover; }
  .pf-course-name { font-size: 0.87rem; font-weight: 700; color: var(--text); }
  .pf-course-meta { font-size: 0.72rem; color: var(--text2); margin-top: 0.15rem; }
  .pf-prog-track { background: var(--bg); border-radius: 99px; height: 5px; overflow: hidden; margin-top: 0.5rem; border: 1px solid var(--border); }
  .pf-prog-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg,var(--blue),#818cf8); transition: width 0.8s cubic-bezier(0.25,1,0.5,1); }
  .pf-prog-fill.done { background: linear-gradient(90deg,var(--green),#34d399); }
  .pf-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 0.6rem; }
  .pf-tag { font-size: 0.65rem; font-weight: 600; padding: 3px 9px; border-radius: 99px; border: 1.5px solid var(--border); background: var(--white); color: var(--text2); text-transform: uppercase; letter-spacing: 0.04em; }
  .pf-tag.success { background: var(--green-light); border-color: #a7f3d0; color: #065f46; }
  .pf-tag.info { background: var(--blue-light); border-color: var(--blue-mid); color: var(--blue); }

  .pf-cert-band {
    background: linear-gradient(135deg,#fff8e6,#fef3c7);
    border: 1.5px solid #fde68a;
    border-radius: var(--radius-sm);
    padding: 1.2rem 1.4rem;
    display: flex; align-items: center; gap: 1.2rem;
  }
  .pf-cert-icon { width: 52px; height: 52px; border-radius: 16px; background: var(--yellow); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; box-shadow: 0 6px 20px rgba(255,176,32,0.35); }
  .pf-cert-title { font-size: 1rem; font-weight: 800; color: var(--text); }
  .pf-cert-sub { font-size: 0.78rem; color: var(--text2); margin-top: 0.2rem; }

  .pf-showcase-item {
    background: var(--bg); border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    overflow: hidden; height: 100%;
    transition: border-color 0.2s, transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
  }
  .pf-showcase-item:hover { border-color: #c7d0ff; transform: translateY(-5px); box-shadow: var(--shadow-hover); }
  .pf-showcase-top { background: linear-gradient(135deg,var(--blue-light),var(--purple-light)); padding: 1rem 1.1rem 0.8rem; border-bottom: 1.5px solid var(--border); display: flex; align-items: flex-start; justify-content: space-between; gap: 0.6rem; }
  .pf-showcase-title { font-size: 0.9rem; font-weight: 800; color: var(--text); }
  .pf-score-chip { font-family: var(--font-serif); font-size: 1.1rem; font-weight: 700; color: var(--blue); background: var(--white); border: 1.5px solid var(--blue-mid); border-radius: 10px; padding: 4px 10px; white-space: nowrap; flex-shrink: 0; }
  .pf-showcase-body { padding: 1rem 1.1rem; }
  .pf-showcase-problem { font-size: 0.75rem; color: var(--text2); font-weight: 600; margin-bottom: 0.5rem; }
  .pf-showcase-problem b { color: var(--text); }
  .pf-showcase-summary { font-size: 0.8rem; color: var(--text2); line-height: 1.55; }
  .pf-showcase-stack { font-size: 0.7rem; color: var(--text3); margin-top: 0.5rem; }
  .pf-showcase-links { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 0.8rem; }
  .pf-link-btn { font-size: 0.72rem; font-weight: 700; text-decoration: none; padding: 5px 12px; border-radius: 9px; display: inline-flex; align-items: center; gap: 5px; transition: all 0.2s; }
  .pf-link-btn.gh { color: var(--text); background: var(--white); border: 1.5px solid var(--border); }
  .pf-link-btn.gh:hover { background: var(--text); color: #fff; border-color: var(--text); }
  .pf-link-btn.demo { color: var(--blue); background: var(--blue-light); border: 1.5px solid var(--blue-mid); }
  .pf-link-btn.demo:hover { background: var(--blue); color: #fff; border-color: var(--blue); }
  .pf-link-btn.rpt { color: var(--green); background: var(--green-light); border: 1.5px solid #a7f3d0; }
  .pf-link-btn.rpt:hover { background: var(--green); color: #fff; border-color: var(--green); }

  .pf-empty { font-size: 0.82rem; color: var(--text2); line-height: 1.6; padding: 0.5rem 0; }

  .pf-skeleton { border-radius: var(--radius); height: 130px; background: linear-gradient(90deg,#e8ecff 0%,#f0f4ff 50%,#e8ecff 100%); background-size: 700px 100%; animation: shimmer 1.6s infinite; border: 1.5px solid var(--border); }
  @keyframes shimmer { 0%{background-position:-700px 0;} 100%{background-position:700px 0;} }
  @keyframes pf-up { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }

  @media (max-width: 900px) { .pf-stats-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 600px) { .pf-stats-grid { grid-template-columns: 1fr; } .pf-hero-body { flex-direction: column; } }
`

// ✅ Same cleanImageUrl helper as dashboard — handles corrupted backend URLs
const cleanImageUrl = (raw) => {
  if (!raw) return ''
  const s = String(raw).trim()
  const secondHttpIdx = s.indexOf('http', 5)
  if (secondHttpIdx !== -1) return s.slice(secondHttpIdx)
  return s
}

const Portfolio = () => {
  const { user } = useContext(AuthContext)
  const authToken = user?.token || user?.user?.token

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
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      })
      const result = await res.json()
      if (result.status === 200) {
        setData(result.data)
      } else {
        toast.error(result.message || 'Failed to load portfolio')
      }
    } catch (e) {
      console.error(e)
      toast.error('Server error loading portfolio')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authToken) fetchPortfolio()
  }, [authToken])

  const copyLink = async () => {
    // ✅ Build the public URL using the correct /portfolio/public/{id} path
    const userId = data?.user?.id
    const publicUrl = userId
      ? `${window.location.origin}/account/portfolio/${userId}`
      : data?.public_url || ''
    try {
      await navigator.clipboard.writeText(publicUrl)
      toast.success('Portfolio link copied!')
    } catch {
      toast.error('Copy failed (browser blocked).')
    }
  }

  const ProgressBar = ({ pct, done }) => (
    <div className='pf-prog-track'>
      <div className={`pf-prog-fill${done ? ' done' : ''}`} style={{ width: `${pct}%` }} />
    </div>
  )

  // ✅ Clean course image URL (handles corrupted backend double-URL)
  const getCourseImg = (c) => cleanImageUrl(c?.course_small_image || c?.image || '')

  return (
    <Layout>
      <style>{css}</style>
      <div className='pf-blob-wrap'>
        <div className='pf-blob pf-blob-1' />
        <div className='pf-blob pf-blob-2' />
        <div className='pf-blob pf-blob-3' />
      </div>

      <div className='pf-root'>
        <div className='container pf-inner'>
          <div className='row'>
            <div className='col-lg-3 account-sidebar mb-4'>
              <UserSidebar />
            </div>

            <div className='col-lg-9 py-4'>

              {/* ── Hero ── */}
              <div className='pf-hero'>
                <div className='pf-hero-deco d1' />
                <div className='pf-hero-deco d2' />
                <div className='pf-hero-deco d3' />
                <div className='pf-hero-body'>
                  <div className='pf-hero-left'>
                    <div className='pf-avatar'>{initials}</div>
                    <div>
                      <div className='pf-hero-name'>
                        {loading ? 'Your Portfolio' : (data?.user?.name || 'Student')}
                      </div>
                      {!loading && data?.user?.role && (
                        <div className='pf-hero-role'>{data.user.role}</div>
                      )}
                      <div className='pf-hero-sub'>
                        Learning + Innovation achievements in one public profile.
                      </div>
                      {!loading && data?.user?.id && (
                        <div className='pf-url-chip'>
                          <span>Public URL</span>
                          {`${window.location.origin}/account/portfolio/${data.user.id}`}
                        </div>
                      )}
                    </div>
                  </div>

                  {!loading && data?.user?.id && (
                    <div className='pf-hero-actions'>
                      <a
                        className='pf-btn-ghost'
                        href={`/account/portfolio/${data.user.id}`}
                        target='_blank'
                        rel='noreferrer'
                      >
                        🔗 View Public
                      </a>
                      <button className='pf-btn-solid' onClick={copyLink}>
                        📋 Copy Link
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Loading ── */}
              {loading ? (
                <div className='pf-stats-grid mb-4'>
                  {[1, 2, 3].map(i => <div key={i} className='pf-skeleton' />)}
                </div>
              ) : !data ? (
                <div className='alert alert-danger' style={{ borderRadius: 16 }}>
                  Portfolio data not found.
                </div>
              ) : (
                <>
                  {/* ── Stats ── */}
                  <div className='pf-stats-grid mb-4'>
                    <div className='pf-stat c-blue' data-num={data.stats?.completed_courses || 0}>
                      <div className='pf-stat-icon'>🎓</div>
                      <div className='pf-stat-num'>{data.stats?.completed_courses || 0}</div>
                      <div className='pf-stat-label'>Completed Courses</div>
                    </div>
                    <div className='pf-stat c-green' data-num={data.stats?.innovation_showcases || 0}>
                      <div className='pf-stat-icon'>🚀</div>
                      <div className='pf-stat-num'>{data.stats?.innovation_showcases || 0}</div>
                      <div className='pf-stat-label'>Innovation Showcases</div>
                    </div>
                    <div className='pf-stat c-orange' data-num={data.stats?.in_progress_courses || 0}>
                      <div className='pf-stat-icon'>📌</div>
                      <div className='pf-stat-num'>{data.stats?.in_progress_courses || 0}</div>
                      <div className='pf-stat-label'>In Progress</div>
                    </div>
                  </div>

                  {/* ── Completed Courses ── */}
                  <div className='pf-card'>
                    <div className='pf-card-header'>
                      <p className='pf-card-title'>
                        <span className='pf-dot' style={{ background: 'var(--green)' }} />
                        Completed Courses
                      </p>
                      <span className='pf-badge green'>
                        {(data.courses?.completed || []).length} courses
                      </span>
                    </div>
                    {(data.courses?.completed || []).length === 0 ? (
                      <div className='pf-empty'>No completed courses yet.</div>
                    ) : (
                      <div className='row g-3'>
                        {data.courses.completed.map(c => (
                          <div className='col-md-6' key={c.course_id}>
                            <div className='pf-course-item'>
                              <div className='d-flex gap-3'>
                                <div className='pf-course-thumb'>
                                  {getCourseImg(c)
                                    ? <img src={getCourseImg(c)} alt={c.title}
                                        onError={e => { e.currentTarget.style.display = 'none' }} />
                                    : <span>📘</span>
                                  }
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div className='pf-course-name'>{c.title}</div>
                                  <div className='pf-course-meta'>
                                    {c.completed_lessons}/{c.total_lessons} lessons • {c.progress}%
                                  </div>
                                  <ProgressBar pct={100} done />
                                  <div className='pf-tags'>
                                    <span className='pf-tag success'>✓ Completed</span>
                                    <span className='pf-tag info'>Certificate Eligible</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ── In Progress ── */}
                  <div className='pf-card'>
                    <div className='pf-card-header'>
                      <p className='pf-card-title'>
                        <span className='pf-dot' style={{ background: 'var(--blue)' }} />
                        Learning In Progress
                      </p>
                      <span className='pf-badge blue'>
                        {(data.courses?.in_progress || []).length} active
                      </span>
                    </div>
                    {(data.courses?.in_progress || []).length === 0 ? (
                      <div className='pf-empty'>No ongoing courses right now.</div>
                    ) : (
                      <div className='row g-3'>
                        {data.courses.in_progress.map(c => (
                          <div className='col-md-6' key={c.course_id}>
                            <div className='pf-course-item'>
                              <div className='d-flex justify-content-between align-items-start gap-2 mb-1'>
                                <div className='pf-course-name'>{c.title}</div>
                                <span className='pf-badge blue'>{c.progress}%</span>
                              </div>
                              <div className='pf-course-meta'>
                                {c.completed_lessons}/{c.total_lessons} lessons
                              </div>
                              <ProgressBar pct={c.progress} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ── Certificates ── */}
                  <div className='pf-card'>
                    <div className='pf-card-header'>
                      <p className='pf-card-title'>
                        <span className='pf-dot' style={{ background: 'var(--yellow)' }} />
                        Certificates
                      </p>
                    </div>
                    <div className='pf-cert-band'>
                      <div className='pf-cert-icon'>🏆</div>
                      <div>
                        <div className='pf-cert-title'>
                          {data.certificates?.count || 0} Certificate
                          {(data.certificates?.count || 0) !== 1 ? 's' : ''} Earned
                        </div>
                        <div className='pf-cert-sub'>
                          Certificates available for all completed courses.
                        </div>
                        {data.certificates?.note && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginTop: 4 }}>
                            {data.certificates.note}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── Innovation Showcases ── */}
                  <div className='pf-card'>
                    <div className='pf-card-header'>
                      <p className='pf-card-title'>
                        <span className='pf-dot' style={{ background: 'var(--purple)' }} />
                        Innovation Showcases
                      </p>
                      <span className='pf-badge purple'>
                        {(data.innovation?.showcases || []).length} published
                      </span>
                    </div>
                    {(data.innovation?.showcases || []).length === 0 ? (
                      <div className='pf-empty'>No innovation showcases published yet.</div>
                    ) : (
                      <div className='row g-3'>
                        {data.innovation.showcases.map(s => (
                          <div className='col-md-6' key={s.idea_id}>
                            <div className='pf-showcase-item'>
                              <div className='pf-showcase-top'>
                                <div className='pf-showcase-title'>{s.idea_title}</div>
                                <div className='pf-score-chip'>{s.score}/10</div>
                              </div>
                              <div className='pf-showcase-body'>
                                <div className='pf-showcase-problem'>
                                  Problem: <b>{s.problem_title}</b>
                                </div>
                                {s.summary && (
                                  <div className='pf-showcase-summary'>
                                    {String(s.summary).slice(0, 120)}
                                    {String(s.summary).length > 120 ? '…' : ''}
                                  </div>
                                )}
                                {s.tech_stack && (
                                  <div className='pf-showcase-stack'>🛠 {s.tech_stack}</div>
                                )}
                                <div className='pf-showcase-links'>
                                  {s.repo_url && (
                                    <a className='pf-link-btn gh' href={s.repo_url} target='_blank' rel='noreferrer'>
                                      ⚡ GitHub
                                    </a>
                                  )}
                                  {s.demo_url && (
                                    <a className='pf-link-btn demo' href={s.demo_url} target='_blank' rel='noreferrer'>
                                      ▶ Demo
                                    </a>
                                  )}
                                  {s.report_url && (
                                    <a className='pf-link-btn rpt' href={s.report_url} target='_blank' rel='noreferrer'>
                                      📄 Report
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
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

export default Portfolio