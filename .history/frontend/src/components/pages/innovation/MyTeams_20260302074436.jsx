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
    --orange: #ff7140;
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

  .mt-root {
    background: var(--bg);
    min-height: 100vh;
    font-family: var(--font);
    padding-bottom: 4rem;
    color: var(--text);
    position: relative;
  }

  .mt-blob-wrap { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
  .mt-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.28; }
  .mt-blob-1 { width: 500px; height: 500px; background: radial-gradient(circle,#c7d0ff,#a5b4fc); top: -150px; right: -100px; animation: blob-float 10s ease-in-out infinite alternate; }
  .mt-blob-2 { width: 360px; height: 360px; background: radial-gradient(circle,#ffd5c5,#ffb3a0); bottom: 0; left: -80px; animation: blob-float 14s ease-in-out infinite alternate-reverse; }
  .mt-blob-3 { width: 220px; height: 220px; background: radial-gradient(circle,#b5f0d8,#86efca); top: 40%; left: 40%; animation: blob-float 9s ease-in-out infinite alternate; }
  @keyframes blob-float { from{transform:translate(0,0) scale(1);} to{transform:translate(28px,18px) scale(1.1);} }

  .mt-inner { position: relative; z-index: 1; padding: 1.5rem 0 0; }

  /* Hero */
  .mt-hero {
    background: linear-gradient(135deg,#4f6ef7 0%,#7c5cbf 55%,#a855f7 100%);
    border-radius: 28px;
    padding: 2rem 2.4rem;
    margin-bottom: 1.8rem;
    position: relative; overflow: hidden;
    box-shadow: 0 20px 60px rgba(79,110,247,0.32);
    animation: mt-up 0.6s cubic-bezier(0.22,1,0.36,1) both;
    display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
  }
  .mt-hero::before {
    content: '';
    position: absolute; top: -60%; left: -20%;
    width: 60%; height: 200%;
    background: linear-gradient(105deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.1) 50%,rgba(255,255,255,0) 100%);
    transform: rotate(25deg); pointer-events: none;
  }
  .mt-hero-deco { position: absolute; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.12); pointer-events: none; }
  .mt-hero-deco.d1 { width: 200px; height: 200px; right: -60px; bottom: -60px; }
  .mt-hero-deco.d2 { width: 110px; height: 110px; right: 80px; top: -40px; }
  .mt-hero-left { position: relative; z-index: 1; }
  .mt-hero-title { font-size: 1.5rem; font-weight: 800; color: #fff; margin: 0; letter-spacing: -0.02em; }
  .mt-hero-sub { font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-top: 0.3rem; }
  .mt-back-btn {
    position: relative; z-index: 1;
    font-size: 0.78rem; font-weight: 700; color: #fff;
    border: 1.5px solid rgba(255,255,255,0.35);
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(8px);
    border-radius: 12px; padding: 8px 18px;
    text-decoration: none; transition: background 0.2s;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .mt-back-btn:hover { background: rgba(255,255,255,0.22); color: #fff; }

  /* Grid */
  .mt-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.2rem;
  }

  /* Team Card */
  .mt-card {
    background: var(--white); border-radius: var(--radius);
    border: 1.5px solid var(--border); box-shadow: var(--shadow);
    padding: 0; display: flex; flex-direction: column;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s, border-color 0.2s;
    animation: mt-up 0.4s both;
    overflow: hidden; position: relative;
  }
  .mt-card:hover { transform: translateY(-7px) scale(1.01); box-shadow: var(--shadow-hover); border-color: #c7d0ff; }

  /* Coloured top band */
  .mt-card-band {
    background: linear-gradient(135deg, var(--blue-light), var(--purple-light));
    padding: 1.2rem 1.4rem 1rem;
    border-bottom: 1.5px solid var(--border);
    position: relative;
  }
  .mt-card-band::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg,var(--blue),var(--purple));
  }
  .mt-card-top { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.7rem; }
  .mt-cat-pill {
    font-size: 0.63rem; font-weight: 700; padding: 4px 10px; border-radius: 99px;
    background: var(--white); border: 1.5px solid var(--blue-mid); color: var(--blue);
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .mt-status-pill {
    font-size: 0.63rem; font-weight: 700; padding: 4px 10px; border-radius: 99px;
    text-transform: uppercase; letter-spacing: 0.06em; border: 1.5px solid;
  }
  .mt-status-pill.selected { background: var(--green-light); border-color: #a7f3d0; color: #065f46; }
  .mt-status-pill.building { background: var(--yellow-light); border-color: #fde68a; color: #92400e; }

  .mt-idea-title { font-size: 1rem; font-weight: 800; color: var(--text); margin: 0; line-height: 1.3; }
  .mt-problem-ref { font-size: 0.72rem; color: var(--text2); margin-top: 0.3rem; font-weight: 600; }
  .mt-problem-ref b { color: var(--text); }

  /* Body */
  .mt-card-body { padding: 1.1rem 1.4rem 1.3rem; display: flex; flex-direction: column; gap: 0.9rem; flex: 1; }

  /* Members */
  .mt-members-label { font-size: 0.67rem; font-weight: 800; color: var(--text3); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.4rem; }
  .mt-members { display: flex; flex-wrap: wrap; gap: 5px; }
  .mt-member-chip {
    font-size: 0.68rem; font-weight: 700; padding: 4px 10px; border-radius: 99px;
    background: var(--bg); border: 1.5px solid var(--border); color: var(--text2);
    display: inline-flex; align-items: center; gap: 4px;
  }
  .mt-member-chip::before {
    content: ''; width: 6px; height: 6px; border-radius: 50%;
    background: var(--blue); flex-shrink: 0;
  }
  .mt-more-chip {
    font-size: 0.68rem; font-weight: 700; padding: 4px 10px; border-radius: 99px;
    background: var(--blue-light); border: 1.5px solid var(--blue-mid); color: var(--blue);
  }

  /* Footer */
  .mt-card-footer { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap; margin-top: auto; }
  .mt-votes-chip {
    font-size: 0.68rem; font-weight: 700; padding: 4px 10px; border-radius: 99px;
    background: var(--purple-light); border: 1.5px solid #ddd6fe; color: var(--purple);
  }
  .mt-workspace-btn {
    font-size: 0.75rem; font-weight: 800; color: #fff;
    text-decoration: none; padding: 7px 16px; border-radius: 11px;
    background: linear-gradient(135deg,var(--blue),var(--purple));
    display: inline-flex; align-items: center; gap: 5px;
    transition: opacity 0.2s, transform 0.2s;
    box-shadow: 0 4px 16px rgba(79,110,247,0.25);
  }
  .mt-workspace-btn:hover { opacity: 0.85; transform: translateY(-1px); color: #fff; }

  /* Empty */
  .mt-empty {
    text-align: center; padding: 4rem 2rem;
    background: var(--white); border-radius: var(--radius);
    border: 1.5px dashed var(--border); box-shadow: var(--shadow);
    animation: mt-up 0.4s both;
  }
  .mt-empty p { color: var(--text2); margin: 0.5rem 0 0; font-size: 0.85rem; }

  /* Pagination */
  .mt-pagination {
    display: flex; justify-content: center; align-items: center; gap: 0.8rem; margin-top: 2rem;
    animation: mt-up 0.4s 0.2s both;
  }
  .mt-page-btn {
    font-size: 0.78rem; font-weight: 700; border-radius: 12px; padding: 8px 18px;
    cursor: pointer; border: 1.5px solid var(--border);
    background: var(--white); color: var(--text2); font-family: var(--font); transition: all 0.2s;
  }
  .mt-page-btn:hover:not(:disabled) { border-color: var(--blue); color: var(--blue); background: var(--blue-light); }
  .mt-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .mt-page-info { font-size: 0.78rem; color: var(--text2); font-weight: 600; }

  /* Skeleton */
  .mt-skeleton {
    border-radius: var(--radius); height: 220px;
    background: linear-gradient(90deg,#e8ecff 0%,#f0f4ff 50%,#e8ecff 100%);
    background-size: 700px 100%; animation: shimmer 1.6s infinite;
    border: 1.5px solid var(--border);
  }
  @keyframes shimmer { 0%{background-position:-700px 0;} 100%{background-position:700px 0;} }
  @keyframes mt-up { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }

  @media (max-width: 600px) { .mt-hero { flex-direction: column; } .mt-grid { grid-template-columns: 1fr; } }
`

const MyTeams = () => {
  const { user } = useContext(AuthContext)
  const authToken = useMemo(() => user?.token || user?.user?.token || configToken, [user])

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [meta, setMeta] = useState(null)

  const fetchMyTeams = async (page = 1) => {
    try {
      setLoading(true)
      const res = await fetch(`${apiUrl}/innovation/my-teams?page=${page}`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${authToken}` },
      })
      const result = await res.json()
      if (result.status === 200) {
        setItems(result.data?.data || [])
        setMeta({ current_page: result.data?.current_page || 1, last_page: result.data?.last_page || 1, total: result.data?.total || 0 })
      } else toast.error(result.message || 'Failed to load my teams')
    } catch (e) {
      console.log(e); toast.error('Server error loading my teams')
    } finally { setLoading(false) }
  }

  useEffect(() => { if (authToken) fetchMyTeams(1) }, [authToken])

  return (
    <Layout>
      <style>{css}</style>
      <div className='mt-blob-wrap'>
        <div className='mt-blob mt-blob-1' /><div className='mt-blob mt-blob-2' /><div className='mt-blob mt-blob-3' />
      </div>

      <div className='mt-root'>
        <div className='container mt-inner'>

          {/* Hero */}
          <div className='mt-hero'>
            <div className='mt-hero-deco d1' /><div className='mt-hero-deco d2' />
            <div className='mt-hero-left'>
              <div className='mt-hero-title'>👥 My Teams</div>
              <div className='mt-hero-sub'>Ideas you joined — team workspace stage.</div>
            </div>
            <Link to='/account/innovation' className='mt-back-btn'>← Back to Hub</Link>
          </div>

          {/* Content */}
          {loading ? (
            <div className='mt-grid'>
              {[1,2,3,4].map(i => <div key={i} className='mt-skeleton' />)}
            </div>
          ) : items.length === 0 ? (
            <div className='mt-empty'>
              <div style={{ fontSize: '2.5rem', opacity: 0.4 }}>👥</div>
              <p>You have not joined any teams yet. Join after an idea is selected in the Problem Hub.</p>
            </div>
          ) : (
            <div className='mt-grid'>
              {items.map((idea, idx) => {
                const members = idea.members_users || idea.membersUsers || []
                const visible = members.slice(0, 6)
                const extra = members.length - 6
                return (
                  <div className='mt-card' key={idea.id} style={{ animationDelay: `${idx * 0.05}s` }}>
                    {/* Top band */}
                    <div className='mt-card-band'>
                      <div className='mt-card-top'>
                        <span className='mt-cat-pill'>{idea.problem?.category || 'General'}</span>
                        <span className={`mt-status-pill ${idea.is_selected ? 'selected' : 'building'}`}>
                          {idea.is_selected ? '✓ Selected' : 'Building'}
                        </span>
                      </div>
                      <div className='mt-idea-title'>{idea.title}</div>
                      <div className='mt-problem-ref'>Problem: <b>{idea.problem?.title || '—'}</b> · <span style={{ color: 'var(--text3)' }}>{idea.problem?.status || '—'}</span></div>
                    </div>

                    {/* Body */}
                    <div className='mt-card-body'>
                      <div>
                        <div className='mt-members-label'>Team Members</div>
                        <div className='mt-members'>
                          {visible.map(m => (
                            <span key={m.id} className='mt-member-chip'>{m.name}</span>
                          ))}
                          {extra > 0 && <span className='mt-more-chip'>+{extra} more</span>}
                          {members.length === 0 && <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>No members yet</span>}
                        </div>
                      </div>

                      <div className='mt-card-footer'>
                        <span className='mt-votes-chip'>↑ {idea.votes_count ?? 0} votes</span>
                        <Link to={`/account/innovation/idea/${idea.id}`} className='mt-workspace-btn'>
                          Workspace →
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className='mt-pagination'>
              <button className='mt-page-btn' disabled={meta.current_page <= 1} onClick={() => fetchMyTeams(meta.current_page - 1)}>← Prev</button>
              <span className='mt-page-info'>Page {meta.current_page} of {meta.last_page}</span>
              <button className='mt-page-btn' disabled={meta.current_page >= meta.last_page} onClick={() => fetchMyTeams(meta.current_page + 1)}>Next →</button>
            </div>
          )}

        </div>
      </div>
    </Layout>
  )
}

export default MyTeams