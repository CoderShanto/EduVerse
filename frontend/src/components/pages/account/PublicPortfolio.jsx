import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../../common/Layout'
import toast from 'react-hot-toast'
import { apiUrl } from '../../common/Config'

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

  .pp-root {
    background: var(--bg);
    min-height: 100vh;
    font-family: var(--font);
    padding-bottom: 5rem;
    color: var(--text);
    position: relative;
  }

  /* Blobs */
  .pp-blob-wrap { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
  .pp-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.3; }
  .pp-blob-1 { width: 520px; height: 520px; background: radial-gradient(circle,#c7d0ff,#a5b4fc); top: -160px; right: -120px; animation: blob-float 10s ease-in-out infinite alternate; }
  .pp-blob-2 { width: 360px; height: 360px; background: radial-gradient(circle,#ffd5c5,#ffb3a0); bottom: 0; left: -80px; animation: blob-float 14s ease-in-out infinite alternate-reverse; }
  .pp-blob-3 { width: 240px; height: 240px; background: radial-gradient(circle,#b5f0d8,#86efca); top: 45%; left: 35%; animation: blob-float 9s ease-in-out infinite alternate; }
  @keyframes blob-float { from{transform:translate(0,0) scale(1);} to{transform:translate(28px,18px) scale(1.1);} }

  .pp-inner { position: relative; z-index: 1; padding: 3rem 0; }

  /* Hero */
  .pp-hero {
    background: linear-gradient(135deg, #4f6ef7 0%, #7c5cbf 55%, #a855f7 100%);
    border-radius: 28px;
    padding: 3rem 2.5rem 2.5rem;
    margin-bottom: 2rem;
    text-align: center;
    position: relative;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(79,110,247,0.35);
    animation: pp-up 0.6s cubic-bezier(0.22,1,0.36,1) both;
  }
  .pp-hero::before {
    content: '';
    position: absolute; top: -60%; left: -20%;
    width: 60%; height: 200%;
    background: linear-gradient(105deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.1) 50%,rgba(255,255,255,0) 100%);
    transform: rotate(25deg); pointer-events: none;
  }
  .pp-hero-deco {
    position: absolute; border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.12); pointer-events: none;
  }
  .pp-hero-deco.d1 { width: 260px; height: 260px; right: -80px; bottom: -80px; }
  .pp-hero-deco.d2 { width: 150px; height: 150px; left: -50px; top: -50px; }
  .pp-hero-deco.d3 { width: 70px; height: 70px; right: 200px; top: 20px; }

  .pp-avatar {
    width: 88px; height: 88px; border-radius: 26px;
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(12px);
    border: 2.5px solid rgba(255,255,255,0.4);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-serif); font-size: 2rem; font-style: italic; color: #fff;
    margin: 0 auto 1.2rem;
    box-shadow: 0 12px 32px rgba(0,0,0,0.2);
    animation: pop-in 0.5s 0.1s cubic-bezier(0.34,1.56,0.64,1) both;
    position: relative; z-index: 1;
  }
  @keyframes pop-in { from{opacity:0;transform:scale(0.5) rotate(-15deg);} to{opacity:1;transform:scale(1) rotate(0);} }

  .pp-hero-name {
    font-size: 2rem; font-weight: 800; color: #fff;
    letter-spacing: -0.03em; margin: 0;
    position: relative; z-index: 1;
  }
  .pp-hero-role {
    display: inline-flex; align-items: center;
    background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3);
    border-radius: 99px; padding: 5px 16px;
    font-size: 0.75rem; font-weight: 700; color: #fff;
    text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.7rem;
    position: relative; z-index: 1;
  }
  .pp-hero-tagline {
    font-size: 0.85rem; color: rgba(255,255,255,0.6); margin-top: 0.6rem;
    position: relative; z-index: 1;
  }

  /* Stats */
  .pp-stats-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.2rem; margin-bottom: 1.8rem; }
  .pp-stat {
    background: var(--white); border-radius: var(--radius);
    padding: 1.6rem; border: 1.5px solid var(--border);
    box-shadow: var(--shadow); position: relative; overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
    animation: pp-up 0.5s both; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 0.3rem;
  }
  .pp-stat:nth-child(1){animation-delay:0.1s;}
  .pp-stat:nth-child(2){animation-delay:0.2s;}
  .pp-stat:nth-child(3){animation-delay:0.3s;}
  .pp-stat:hover { transform: translateY(-7px) scale(1.02); box-shadow: var(--shadow-hover); }
  .pp-stat::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 4px; border-radius: 99px 99px 0 0;
  }
  .pp-stat.c-blue::before { background: linear-gradient(90deg,#4f6ef7,#818cf8); }
  .pp-stat.c-green::before { background: linear-gradient(90deg,#22c98e,#34d399); }
  .pp-stat.c-orange::before { background: linear-gradient(90deg,#ff7140,#fb923c); }
  .pp-stat::after {
    content: attr(data-num); position: absolute; right: -8px; bottom: -18px;
    font-family: var(--font-serif); font-size: 6rem; font-weight: 700;
    opacity: 0.04; color: #000; pointer-events: none;
  }
  .pp-stat-icon {
    width: 50px; height: 50px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin-bottom: 0.4rem;
  }
  .c-blue .pp-stat-icon { background: var(--blue-light); }
  .c-green .pp-stat-icon { background: var(--green-light); }
  .c-orange .pp-stat-icon { background: var(--orange-light); }
  .pp-stat-num { font-family: var(--font-serif); font-size: 3rem; font-weight: 700; line-height: 1; color: var(--text); }
  .pp-stat-label { font-size: 0.75rem; color: var(--text2); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }

  /* Section card */
  .pp-card {
    background: var(--white); border-radius: var(--radius);
    padding: 1.8rem; border: 1.5px solid var(--border);
    box-shadow: var(--shadow); margin-bottom: 1.4rem;
    animation: pp-up 0.5s 0.25s both;
  }
  .pp-card-header {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.4rem;
  }
  .pp-card-title {
    font-size: 0.72rem; font-weight: 800; color: var(--text2);
    text-transform: uppercase; letter-spacing: 0.12em;
    display: flex; align-items: center; gap: 0.5rem; margin: 0;
  }
  .pp-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .pp-badge {
    font-size: 0.68rem; font-weight: 700; padding: 4px 10px; border-radius: 99px;
  }
  .pp-badge.purple { background: var(--purple-light); color: var(--purple); }

  /* Showcase cards */
  .pp-showcase {
    background: var(--bg); border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    overflow: hidden; height: 100%;
    transition: border-color 0.2s, transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
    animation: pp-up 0.4s both;
  }
  .pp-showcase:hover { border-color: #c7d0ff; transform: translateY(-6px); box-shadow: var(--shadow-hover); }

  .pp-showcase-top {
    background: linear-gradient(135deg, var(--blue-light), var(--purple-light));
    padding: 1.1rem 1.2rem 0.9rem;
    border-bottom: 1.5px solid var(--border);
    display: flex; align-items: flex-start; justify-content: space-between; gap: 0.7rem;
  }
  .pp-showcase-title { font-size: 0.95rem; font-weight: 800; color: var(--text); line-height: 1.3; }
  .pp-score-chip {
    font-family: var(--font-serif); font-size: 1.1rem; font-weight: 700;
    color: var(--blue); background: var(--white);
    border: 1.5px solid var(--blue-mid); border-radius: 10px;
    padding: 4px 11px; white-space: nowrap; flex-shrink: 0;
  }

  .pp-showcase-body { padding: 1.1rem 1.2rem; }
  .pp-showcase-problem { font-size: 0.75rem; color: var(--text2); font-weight: 600; margin-bottom: 0.6rem; }
  .pp-showcase-problem b { color: var(--text); }
  .pp-showcase-summary { font-size: 0.82rem; color: var(--text2); line-height: 1.6; }
  .pp-showcase-links { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 0.9rem; }

  .pp-link-btn {
    font-size: 0.73rem; font-weight: 700; text-decoration: none;
    padding: 6px 13px; border-radius: 10px;
    display: inline-flex; align-items: center; gap: 5px;
    transition: all 0.2s;
  }
  .pp-link-btn.gh { color: var(--text); background: var(--white); border: 1.5px solid var(--border); }
  .pp-link-btn.gh:hover { background: var(--text); color: #fff; border-color: var(--text); }
  .pp-link-btn.demo { color: var(--blue); background: var(--blue-light); border: 1.5px solid var(--blue-mid); }
  .pp-link-btn.demo:hover { background: var(--blue); color: #fff; border-color: var(--blue); }
  .pp-link-btn.rpt { color: var(--green); background: var(--green-light); border: 1.5px solid #a7f3d0; }
  .pp-link-btn.rpt:hover { background: var(--green); color: #fff; border-color: var(--green); }

  .pp-empty { font-size: 0.82rem; color: var(--text2); padding: 0.4rem 0; }

  /* Loading skeletons */
  .pp-skel-hero { border-radius: 28px; height: 220px; background: linear-gradient(90deg,#e8ecff 0%,#f0f4ff 50%,#e8ecff 100%); background-size:700px 100%; animation: shimmer 1.6s infinite; }
  .pp-skel-stat { border-radius: var(--radius); height: 130px; background: linear-gradient(90deg,#e8ecff 0%,#f0f4ff 50%,#e8ecff 100%); background-size:700px 100%; animation: shimmer 1.6s infinite; }
  @keyframes shimmer { 0%{background-position:-700px 0;} 100%{background-position:700px 0;} }
  @keyframes pp-up { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }

  @media (max-width: 900px) { .pp-stats-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 600px) { .pp-stats-grid { grid-template-columns: 1fr; } .pp-hero { padding: 2rem 1.4rem; } .pp-hero-name { font-size: 1.5rem; } }
`

const PublicPortfolio = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  const fetchPortfolio = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${apiUrl}/portfolio/${id}`, {
        headers: { Accept: 'application/json' },
      })
      const result = await res.json()
      if (result.status === 200) setData(result.data)
      else toast.error(result.message || 'Portfolio not found')
    } catch (e) {
      console.log(e)
      toast.error('Server error loading portfolio')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchPortfolio()
    // eslint-disable-next-line
  }, [id])

  const initials = data?.user?.name
    ? data.user.name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <Layout>
      <style>{css}</style>
      <div className='pp-blob-wrap'>
        <div className='pp-blob pp-blob-1' /><div className='pp-blob pp-blob-2' /><div className='pp-blob pp-blob-3' />
      </div>

      <div className='pp-root'>
        <div className='container pp-inner'>

          {loading ? (
            <>
              <div className='pp-skel-hero mb-4' />
              <div className='pp-stats-grid mb-4'>
                {[1,2,3].map(i => <div key={i} className='pp-skel-stat' />)}
              </div>
            </>
          ) : !data ? (
            <div className='alert alert-danger' style={{ borderRadius: 16, marginTop: '2rem' }}>
              Portfolio not found.
            </div>
          ) : (
            <>
              {/* ── Hero ── */}
              <div className='pp-hero'>
                <div className='pp-hero-deco d1' /><div className='pp-hero-deco d2' /><div className='pp-hero-deco d3' />
                <div className='pp-avatar'>{initials}</div>
                <h1 className='pp-hero-name'>{data.user?.name}</h1>
                {data.user?.role && <div className='pp-hero-role'>{data.user.role}</div>}
                <div className='pp-hero-tagline'>Learning + Innovation · Public Portfolio</div>
              </div>

              {/* ── Stats ── */}
              <div className='pp-stats-grid'>
                <div className='pp-stat c-blue' data-num={data.stats?.completed_courses || 0}>
                  <div className='pp-stat-icon'>🎓</div>
                  <div className='pp-stat-num'>{data.stats?.completed_courses || 0}</div>
                  <div className='pp-stat-label'>Completed Courses</div>
                </div>
                <div className='pp-stat c-green' data-num={data.stats?.innovation_showcases || 0}>
                  <div className='pp-stat-icon'>🚀</div>
                  <div className='pp-stat-num'>{data.stats?.innovation_showcases || 0}</div>
                  <div className='pp-stat-label'>Innovation Projects</div>
                </div>
                <div className='pp-stat c-orange' data-num={data.stats?.in_progress_courses || 0}>
                  <div className='pp-stat-icon'>📌</div>
                  <div className='pp-stat-num'>{data.stats?.in_progress_courses || 0}</div>
                  <div className='pp-stat-label'>In Progress</div>
                </div>
              </div>

              {/* ── Innovation Showcases ── */}
              <div className='pp-card'>
                <div className='pp-card-header'>
                  <p className='pp-card-title'>
                    <span className='pp-dot' style={{ background: 'var(--purple)' }} />
                    Innovation Projects
                  </p>
                  <span className='pp-badge purple'>{(data.innovation?.showcases || []).length} published</span>
                </div>

                {(data.innovation?.showcases || []).length === 0 ? (
                  <div className='pp-empty'>No projects published yet.</div>
                ) : (
                  <div className='row g-3'>
                    {data.innovation.showcases.map((s, idx) => (
                      <div className='col-md-6' key={s.idea_id}>
                        <div className='pp-showcase' style={{ animationDelay: `${idx * 0.07}s` }}>
                          <div className='pp-showcase-top'>
                            <div className='pp-showcase-title'>{s.idea_title}</div>
                            <div className='pp-score-chip'>{s.score}/10</div>
                          </div>
                          <div className='pp-showcase-body'>
                            <div className='pp-showcase-problem'>Problem: <b>{s.problem_title}</b></div>
                            {s.summary && (
                              <div className='pp-showcase-summary'>{s.summary}</div>
                            )}
                            <div className='pp-showcase-links'>
                              {s.repo_url && <a className='pp-link-btn gh' href={s.repo_url} target='_blank' rel='noreferrer'>⚡ GitHub</a>}
                              {s.demo_url && <a className='pp-link-btn demo' href={s.demo_url} target='_blank' rel='noreferrer'>▶ Demo</a>}
                              {s.report_url && <a className='pp-link-btn rpt' href={s.report_url} target='_blank' rel='noreferrer'>📄 Report</a>}
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
    </Layout>
  )
}

export default PublicPortfolio