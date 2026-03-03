import React, { useContext, useEffect, useMemo, useState } from 'react'
import Layout from '../../common/Layout'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { apiUrl, token as configToken } from '../../common/Config'
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
    --shadow-hover: 0 20px 50px rgba(79,110,247,0.16);
    --font: 'Plus Jakarta Sans', sans-serif;
    --font-serif: 'Fraunces', serif;
  }

  .mi-root {
    background: var(--bg);
    min-height: 100vh;
    font-family: var(--font);
    padding-bottom: 4rem;
    color: var(--text);
    position: relative;
  }

  .mi-blob-wrap { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
  .mi-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.28; }
  .mi-blob-1 { width: 500px; height: 500px; background: radial-gradient(circle,#c7d0ff,#a5b4fc); top: -150px; right: -100px; animation: blob-float 10s ease-in-out infinite alternate; }
  .mi-blob-2 { width: 360px; height: 360px; background: radial-gradient(circle,#ffd5c5,#ffb3a0); bottom: 0; left: -80px; animation: blob-float 14s ease-in-out infinite alternate-reverse; }
  .mi-blob-3 { width: 220px; height: 220px; background: radial-gradient(circle,#b5f0d8,#86efca); top: 40%; left: 40%; animation: blob-float 9s ease-in-out infinite alternate; }
  @keyframes blob-float { from{transform:translate(0,0) scale(1);} to{transform:translate(28px,18px) scale(1.1);} }

  .mi-inner { position: relative; z-index: 1; padding: 1.5rem 0 0; }

  /* Hero */
  .mi-hero {
    background: linear-gradient(135deg,#4f6ef7 0%,#7c5cbf 55%,#a855f7 100%);
    border-radius: 28px;
    padding: 2rem 2.4rem;
    margin-bottom: 1.8rem;
    position: relative; overflow: hidden;
    box-shadow: 0 20px 60px rgba(79,110,247,0.32);
    animation: mi-up 0.6s cubic-bezier(0.22,1,0.36,1) both;
    display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
  }
  .mi-hero::before {
    content: '';
    position: absolute; top: -60%; left: -20%;
    width: 60%; height: 200%;
    background: linear-gradient(105deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.1) 50%,rgba(255,255,255,0) 100%);
    transform: rotate(25deg); pointer-events: none;
  }
  .mi-hero-deco { position: absolute; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.12); pointer-events: none; }
  .mi-hero-deco.d1 { width: 200px; height: 200px; right: -60px; bottom: -60px; }
  .mi-hero-deco.d2 { width: 110px; height: 110px; right: 80px; top: -40px; }
  .mi-hero-left { position: relative; z-index: 1; }
  .mi-hero-title { font-size: 1.5rem; font-weight: 800; color: #fff; margin: 0; letter-spacing: -0.02em; }
  .mi-hero-sub { font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-top: 0.3rem; }
  .mi-back-btn {
    position: relative; z-index: 1;
    font-size: 0.78rem; font-weight: 700; color: #fff;
    border: 1.5px solid rgba(255,255,255,0.35);
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(8px);
    border-radius: 12px; padding: 8px 18px;
    text-decoration: none; transition: background 0.2s;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .mi-back-btn:hover { background: rgba(255,255,255,0.22); color: #fff; }

  /* Grid */
  .mi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.2rem;
  }

  /* Idea Card */
  .mi-card {
    background: var(--white); border-radius: var(--radius);
    border: 1.5px solid var(--border); box-shadow: var(--shadow);
    padding: 1.4rem; display: flex; flex-direction: column; gap: 0.7rem;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s, border-color 0.2s;
    animation: mi-up 0.4s both;
    position: relative; overflow: hidden;
  }
  .mi-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    border-radius: 99px 99px 0 0;
    background: linear-gradient(90deg,var(--blue),var(--purple));
    opacity: 0; transition: opacity 0.2s;
  }
  .mi-card:hover { transform: translateY(-7px) scale(1.01); box-shadow: var(--shadow-hover); border-color: #c7d0ff; }
  .mi-card:hover::before { opacity: 1; }
  .mi-card.is-selected { border-color: #a7f3d0; }
  .mi-card.is-selected::before { background: linear-gradient(90deg,var(--green),#34d399); opacity: 1; }

  .mi-card-top { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
  .mi-cat-pill {
    font-size: 0.63rem; font-weight: 700; padding: 4px 10px; border-radius: 99px;
    background: var(--blue-light); border: 1.5px solid var(--blue-mid); color: var(--blue);
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .mi-status-pill {
    font-size: 0.63rem; font-weight: 700; padding: 4px 10px; border-radius: 99px;
    text-transform: uppercase; letter-spacing: 0.06em; border: 1.5px solid;
  }
  .mi-status-pill.selected { background: var(--green-light); border-color: #a7f3d0; color: #065f46; }
  .mi-status-pill.proposed { background: #f4f4f5; border-color: #d4d4d8; color: #71717a; }

  .mi-idea-title { font-size: 1rem; font-weight: 800; color: var(--text); margin: 0; line-height: 1.3; }
  .mi-problem-ref { font-size: 0.72rem; color: var(--text2); font-weight: 600; }
  .mi-problem-ref b { color: var(--text); }
  .mi-desc { font-size: 0.8rem; color: var(--text2); line-height: 1.6; margin: 0; flex: 1; }

  .mi-card-footer { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-top: auto; flex-wrap: wrap; }
  .mi-meta { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .mi-meta-chip {
    font-size: 0.65rem; font-weight: 700; padding: 4px 9px; border-radius: 99px;
    border: 1.5px solid var(--border); background: var(--bg); color: var(--text2);
    white-space: nowrap;
  }
  .mi-meta-chip.votes { background: var(--purple-light); border-color: #ddd6fe; color: var(--purple); }
  .mi-open-btn {
    font-size: 0.72rem; font-weight: 700; color: var(--blue);
    text-decoration: none; padding: 5px 13px; border-radius: 10px;
    background: var(--blue-light); border: 1.5px solid var(--blue-mid);
    display: inline-flex; align-items: center; gap: 4px;
    transition: background 0.2s, color 0.2s, border-color 0.2s; white-space: nowrap;
  }
  .mi-open-btn:hover { background: var(--blue); color: #fff; border-color: var(--blue); }

  /* Empty */
  .mi-empty {
    text-align: center; padding: 4rem 2rem;
    background: var(--white); border-radius: var(--radius);
    border: 1.5px dashed var(--border); box-shadow: var(--shadow);
    animation: mi-up 0.4s both;
  }
  .mi-empty p { color: var(--text2); margin: 0.5rem 0 0; font-size: 0.85rem; }

  /* Pagination */
  .mi-pagination {
    display: flex; justify-content: center; align-items: center; gap: 0.8rem; margin-top: 2rem;
    animation: mi-up 0.4s 0.2s both;
  }
  .mi-page-btn {
    font-size: 0.78rem; font-weight: 700; border-radius: 12px; padding: 8px 18px;
    cursor: pointer; border: 1.5px solid var(--border);
    background: var(--white); color: var(--text2); font-family: var(--font);
    transition: all 0.2s;
  }
  .mi-page-btn:hover:not(:disabled) { border-color: var(--blue); color: var(--blue); background: var(--blue-light); }
  .mi-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .mi-page-info { font-size: 0.78rem; color: var(--text2); font-weight: 600; }

  /* Skeleton */
  .mi-skeleton {
    border-radius: var(--radius); height: 200px;
    background: linear-gradient(90deg,#e8ecff 0%,#f0f4ff 50%,#e8ecff 100%);
    background-size: 700px 100%; animation: shimmer 1.6s infinite;
    border: 1.5px solid var(--border);
  }
  @keyframes shimmer { 0%{background-position:-700px 0;} 100%{background-position:700px 0;} }
  @keyframes mi-up { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }

  @media (max-width: 600px) { .mi-hero { flex-direction: column; } .mi-grid { grid-template-columns: 1fr; } }
`

const MyIdeas = () => {
  const { user } = useContext(AuthContext)
  const authToken = useMemo(() => user?.token || user?.user?.token || configToken, [user])

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [meta, setMeta] = useState(null)

  const fetchMyIdeas = async (page = 1) => {
    try {
      setLoading(true)
      const res = await fetch(`${apiUrl}/innovation/my-ideas?page=${page}`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${authToken}` },
      })
      const result = await res.json()
      if (result.status === 200) {
        setItems(result.data?.data || [])
        setMeta({ current_page: result.data?.current_page || 1, last_page: result.data?.last_page || 1, total: result.data?.total || 0 })
      } else toast.error(result.message || 'Failed to load my ideas')
    } catch (e) {
      console.log(e); toast.error('Server error loading my ideas')
    } finally { setLoading(false) }
  }

  useEffect(() => { if (authToken) fetchMyIdeas(1) }, [authToken])

  return (
    <Layout>
      <style>{css}</style>
      <div className='mi-blob-wrap'>
        <div className='mi-blob mi-blob-1' /><div className='mi-blob mi-blob-2' /><div className='mi-blob mi-blob-3' />
      </div>

      <div className='mi-root'>
        <div className='container mi-inner'>

          {/* Hero */}
          <div className='mi-hero'>
            <div className='mi-hero-deco d1' /><div className='mi-hero-deco d2' />
            <div className='mi-hero-left'>
              <div className='mi-hero-title'>🧠 My Ideas</div>
              <div className='mi-hero-sub'>Ideas you proposed across all problems.</div>
            </div>
            <Link to='/account/innovation' className='mi-back-btn'>← Back to Hub</Link>
          </div>

          {/* Content */}
          {loading ? (
            <div className='mi-grid'>
              {[1,2,3,4].map(i => <div key={i} className='mi-skeleton' />)}
            </div>
          ) : items.length === 0 ? (
            <div className='mi-empty'>
              <div style={{ fontSize: '2.5rem', opacity: 0.4 }}>🧠</div>
              <p>You have not posted any ideas yet. Head to the Problem Hub and propose one!</p>
            </div>
          ) : (
            <div className='mi-grid'>
              {items.map((idea, idx) => (
                <div
                  className={`mi-card${idea.is_selected ? ' is-selected' : ''}`}
                  key={idea.id}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className='mi-card-top'>
                    <span className='mi-cat-pill'>{idea.problem?.category || 'General'}</span>
                    <span className={`mi-status-pill ${idea.is_selected ? 'selected' : 'proposed'}`}>
                      {idea.is_selected ? '✓ Selected' : 'Proposed'}
                    </span>
                  </div>

                  <div className='mi-idea-title'>{idea.title}</div>
                  <div className='mi-problem-ref'>Problem: <b>{idea.problem?.title || '—'}</b></div>
                  <div className='mi-desc'>
                    {String(idea.description || '').slice(0, 120)}{String(idea.description || '').length > 120 ? '…' : ''}
                  </div>

                  <div className='mi-card-footer'>
                    <div className='mi-meta'>
                      <span className='mi-meta-chip votes'>↑ {idea.votes_count ?? 0} votes</span>
                      <span className='mi-meta-chip'>Problem: {idea.problem?.status || '—'}</span>
                    </div>
                    <Link to={`/account/innovation/problem/${idea.problem_id}`} className='mi-open-btn'>
                      Open →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className='mi-pagination'>
              <button className='mi-page-btn' disabled={meta.current_page <= 1} onClick={() => fetchMyIdeas(meta.current_page - 1)}>← Prev</button>
              <span className='mi-page-info'>Page {meta.current_page} of {meta.last_page}</span>
              <button className='mi-page-btn' disabled={meta.current_page >= meta.last_page} onClick={() => fetchMyIdeas(meta.current_page + 1)}>Next →</button>
            </div>
          )}

        </div>
      </div>
    </Layout>
  )
}

export default MyIdeas