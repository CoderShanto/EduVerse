import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import { Link } from 'react-router-dom'
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
    --green: #22c98e;
    --green-light: #e6faf3;
    --yellow: #ffb020;
    --yellow-light: #fff8e6;
    --text: #14142b;
    --text2: #6e7191;
    --text3: #a0abc0;
    --border: #e4e7f4;
    --radius: 22px;
    --radius-sm: 14px;
    --shadow: 0 4px 24px rgba(79,110,247,0.08);
    --shadow-hover: 0 20px 50px rgba(79,110,247,0.18);
    --font: 'Plus Jakarta Sans', sans-serif;
    --font-serif: 'Fraunces', serif;
  }

  .sc-root {
    background: var(--bg);
    min-height: 100vh;
    font-family: var(--font);
    padding-bottom: 4rem;
    color: var(--text);
    position: relative;
  }

  .sc-blob-wrap { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
  .sc-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.28; }
  .sc-blob-1 { width: 500px; height: 500px; background: radial-gradient(circle,#c7d0ff,#a5b4fc); top: -150px; right: -100px; animation: blob-float 10s ease-in-out infinite alternate; }
  .sc-blob-2 { width: 360px; height: 360px; background: radial-gradient(circle,#ffd5c5,#ffb3a0); bottom: 0; left: -80px; animation: blob-float 14s ease-in-out infinite alternate-reverse; }
  .sc-blob-3 { width: 220px; height: 220px; background: radial-gradient(circle,#b5f0d8,#86efca); top: 40%; left: 40%; animation: blob-float 9s ease-in-out infinite alternate; }
  @keyframes blob-float { from{transform:translate(0,0) scale(1);} to{transform:translate(28px,18px) scale(1.1);} }

  .sc-inner { position: relative; z-index: 1; padding: 1.5rem 0 0; }

  /* Hero */
  .sc-hero {
    background: linear-gradient(135deg,#4f6ef7 0%,#7c5cbf 55%,#a855f7 100%);
    border-radius: 28px;
    padding: 2rem 2.4rem;
    margin-bottom: 1.8rem;
    position: relative; overflow: hidden;
    box-shadow: 0 20px 60px rgba(79,110,247,0.32);
    animation: sc-up 0.6s cubic-bezier(0.22,1,0.36,1) both;
    display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
  }
  .sc-hero::before {
    content: '';
    position: absolute; top: -60%; left: -20%;
    width: 60%; height: 200%;
    background: linear-gradient(105deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.1) 50%,rgba(255,255,255,0) 100%);
    transform: rotate(25deg); pointer-events: none;
  }
  .sc-hero-deco { position: absolute; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.12); pointer-events: none; }
  .sc-hero-deco.d1 { width: 200px; height: 200px; right: -60px; bottom: -60px; }
  .sc-hero-deco.d2 { width: 110px; height: 110px; right: 80px; top: -40px; }
  .sc-hero-left { position: relative; z-index: 1; }
  .sc-hero-title { font-size: 1.5rem; font-weight: 800; color: #fff; margin: 0; letter-spacing: -0.02em; }
  .sc-hero-sub { font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-top: 0.3rem; }
  .sc-back-btn {
    position: relative; z-index: 1;
    font-size: 0.78rem; font-weight: 700; color: #fff;
    border: 1.5px solid rgba(255,255,255,0.35);
    background: rgba(255,255,255,0.12); backdrop-filter: blur(8px);
    border-radius: 12px; padding: 8px 18px;
    text-decoration: none; transition: background 0.2s;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .sc-back-btn:hover { background: rgba(255,255,255,0.22); color: #fff; }

  /* Grid */
  .sc-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.3rem;
  }

  /* Showcase Card */
  .sc-card {
    background: var(--white); border-radius: var(--radius);
    border: 1.5px solid var(--border); box-shadow: var(--shadow);
    overflow: hidden; display: flex; flex-direction: column;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s, border-color 0.2s;
    animation: sc-up 0.4s both;
    position: relative;
  }
  .sc-card:hover { transform: translateY(-8px) scale(1.01); box-shadow: var(--shadow-hover); border-color: #c7d0ff; }

  /* Cover image area */
  .sc-cover {
    height: 170px; position: relative; overflow: hidden;
    background: linear-gradient(135deg,var(--blue-light),var(--purple-light));
    flex-shrink: 0;
  }
  .sc-cover img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform 0.4s ease;
  }
  .sc-card:hover .sc-cover img { transform: scale(1.06); }
  .sc-cover-fallback {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    font-size: 2.5rem; opacity: 0.35;
    background: linear-gradient(135deg,var(--blue-light),var(--purple-light));
  }

  /* Score badge floating on cover */
  .sc-score-float {
    position: absolute; top: 10px; right: 10px;
    font-family: var(--font-serif); font-size: 1rem; font-weight: 700;
    background: var(--white); color: var(--blue);
    border: 1.5px solid var(--blue-mid); border-radius: 10px;
    padding: 4px 11px;
    box-shadow: 0 4px 14px rgba(0,0,0,0.12);
  }
  .sc-done-badge {
    position: absolute; top: 10px; left: 10px;
    font-size: 0.6rem; font-weight: 800; padding: 4px 10px; border-radius: 99px;
    background: var(--green); color: #fff;
    text-transform: uppercase; letter-spacing: 0.08em;
    box-shadow: 0 4px 12px rgba(34,201,142,0.35);
  }

  /* Card body */
  .sc-card-body { padding: 1.2rem 1.3rem 1.3rem; display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
  .sc-idea-title { font-size: 0.95rem; font-weight: 800; color: var(--text); margin: 0; line-height: 1.3; }
  .sc-problem-ref { font-size: 0.72rem; color: var(--text2); font-weight: 600; }
  .sc-problem-ref b { color: var(--text); }
  .sc-summary { font-size: 0.78rem; color: var(--text2); line-height: 1.6; margin: 0; flex: 1; }
  .sc-view-btn {
    align-self: flex-start;
    font-size: 0.75rem; font-weight: 800; color: var(--blue);
    text-decoration: none; padding: 7px 16px; border-radius: 11px;
    background: var(--blue-light); border: 1.5px solid var(--blue-mid);
    display: inline-flex; align-items: center; gap: 5px;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
    margin-top: auto;
  }
  .sc-view-btn:hover { background: var(--blue); color: #fff; border-color: var(--blue); }

  /* Empty */
  .sc-empty {
    text-align: center; padding: 4rem 2rem;
    background: var(--white); border-radius: var(--radius);
    border: 1.5px dashed var(--border); box-shadow: var(--shadow);
    animation: sc-up 0.4s both;
  }
  .sc-empty p { color: var(--text2); margin: 0.5rem 0 0; font-size: 0.85rem; }

  /* Pagination */
  .sc-pagination {
    display: flex; justify-content: center; align-items: center; gap: 0.8rem; margin-top: 2rem;
    animation: sc-up 0.4s 0.2s both;
  }
  .sc-page-btn {
    font-size: 0.78rem; font-weight: 700; border-radius: 12px; padding: 8px 18px;
    cursor: pointer; border: 1.5px solid var(--border);
    background: var(--white); color: var(--text2); font-family: var(--font); transition: all 0.2s;
  }
  .sc-page-btn:hover:not(:disabled) { border-color: var(--blue); color: var(--blue); background: var(--blue-light); }
  .sc-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .sc-page-info { font-size: 0.78rem; color: var(--text2); font-weight: 600; }

  /* Skeleton */
  .sc-skeleton {
    border-radius: var(--radius); height: 280px;
    background: linear-gradient(90deg,#e8ecff 0%,#f0f4ff 50%,#e8ecff 100%);
    background-size: 700px 100%; animation: shimmer 1.6s infinite;
    border: 1.5px solid var(--border);
  }
  @keyframes shimmer { 0%{background-position:-700px 0;} 100%{background-position:700px 0;} }
  @keyframes sc-up { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }

  @media (max-width: 600px) { .sc-hero { flex-direction: column; } .sc-grid { grid-template-columns: 1fr; } }
`

const Showcase = () => {
  const { user } = useContext(AuthContext)
  const authToken = user?.token || user?.user?.token

  const [items, setItems] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchShowcases = async (page = 1) => {
    try {
      setLoading(true)
      const res = await fetch(`${apiUrl}/showcases?page=${page}`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${authToken}` },
      })
      const result = await res.json()
      if (result.status === 200) {
        setItems(result.data.data || [])
        setMeta({ current_page: result.data.current_page, last_page: result.data.last_page })
      } else toast.error('Failed to load showcase')
    } catch (e) {
      console.log(e); toast.error('Server error loading showcase')
    } finally { setLoading(false) }
  }

  useEffect(() => { if (authToken) fetchShowcases(1) }, [authToken])

  return (
    <Layout>
      <style>{css}</style>
      <div className='sc-blob-wrap'>
        <div className='sc-blob sc-blob-1' /><div className='sc-blob sc-blob-2' /><div className='sc-blob sc-blob-3' />
      </div>

      <div className='sc-root'>
        <div className='container sc-inner'>

          {/* Hero */}
          <div className='sc-hero'>
            <div className='sc-hero-deco d1' /><div className='sc-hero-deco d2' />
            <div className='sc-hero-left'>
              <div className='sc-hero-title'>🏆 Showcase</div>
              <div className='sc-hero-sub'>Completed solutions validated by admin &amp; instructors.</div>
            </div>
            <Link to='/account/innovation' className='sc-back-btn'>← Back to Hub</Link>
          </div>

          {/* Content */}
          {loading ? (
            <div className='sc-grid'>
              {[1,2,3,4,5,6].map(i => <div key={i} className='sc-skeleton' />)}
            </div>
          ) : items.length === 0 ? (
            <div className='sc-empty'>
              <div style={{ fontSize: '2.5rem', opacity: 0.4 }}>🏆</div>
              <p>No showcase items yet. Complete a project to be featured here!</p>
            </div>
          ) : (
            <div className='sc-grid'>
              {items.map((s, idx) => {
                const cover = s.cover_image_resolved || s.cover_image || ''
                return (
                  <div className='sc-card' key={s.id} style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div className='sc-cover'>
                      {cover ? (
                        <img src={cover} alt='cover' onError={e => { e.currentTarget.style.display = 'none' }} />
                      ) : (
                        <div className='sc-cover-fallback'>🚀</div>
                      )}
                      <span className='sc-done-badge'>✓ Completed</span>
                      {s.score ? <span className='sc-score-float'>{s.score}/10</span> : null}
                    </div>

                    <div className='sc-card-body'>
                      <div className='sc-idea-title'>{s.idea?.title}</div>
                      <div className='sc-problem-ref'>Problem: <b>{s.idea?.problem?.title || '—'}</b></div>
                      {s.summary && (
                        <div className='sc-summary'>{String(s.summary).slice(0, 90)}{String(s.summary).length > 90 ? '…' : ''}</div>
                      )}
                      <Link to={`/account/innovation/showcase/${s.id}`} className='sc-view-btn'>View →</Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className='sc-pagination'>
              <button className='sc-page-btn' disabled={meta.current_page <= 1} onClick={() => fetchShowcases(meta.current_page - 1)}>← Prev</button>
              <span className='sc-page-info'>Page {meta.current_page} of {meta.last_page}</span>
              <button className='sc-page-btn' disabled={meta.current_page >= meta.last_page} onClick={() => fetchShowcases(meta.current_page + 1)}>Next →</button>
            </div>
          )}

        </div>
      </div>
    </Layout>
  )
}

export default Showcase