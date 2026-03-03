import React, { useContext, useEffect, useMemo, useState } from 'react'
import Layout from '../../common/Layout'
import { Link, useParams } from 'react-router-dom'
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
    --orange: #ff7140;
    --text: #14142b;
    --text2: #6e7191;
    --text3: #a0abc0;
    --border: #e4e7f4;
    --radius: 22px;
    --radius-sm: 14px;
    --shadow: 0 4px 24px rgba(79,110,247,0.08);
    --shadow-hover: 0 16px 48px rgba(79,110,247,0.14);
    --font: 'Plus Jakarta Sans', sans-serif;
    --font-serif: 'Fraunces', serif;
  }

  .sd-root {
    background: var(--bg);
    min-height: 100vh;
    font-family: var(--font);
    padding-bottom: 4rem;
    color: var(--text);
    position: relative;
  }

  .sd-blob-wrap { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
  .sd-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.26; }
  .sd-blob-1 { width: 500px; height: 500px; background: radial-gradient(circle,#c7d0ff,#a5b4fc); top: -150px; right: -100px; animation: blob-float 10s ease-in-out infinite alternate; }
  .sd-blob-2 { width: 360px; height: 360px; background: radial-gradient(circle,#ffd5c5,#ffb3a0); bottom: 0; left: -80px; animation: blob-float 14s ease-in-out infinite alternate-reverse; }
  .sd-blob-3 { width: 220px; height: 220px; background: radial-gradient(circle,#b5f0d8,#86efca); top: 40%; left: 40%; animation: blob-float 9s ease-in-out infinite alternate; }
  @keyframes blob-float { from{transform:translate(0,0) scale(1);} to{transform:translate(28px,18px) scale(1.1);} }

  .sd-inner { position: relative; z-index: 1; padding: 1.5rem 0 0; }

  /* Hero */
  .sd-hero {
    background: linear-gradient(135deg,#4f6ef7 0%,#7c5cbf 55%,#a855f7 100%);
    border-radius: 28px;
    padding: 2rem 2.4rem;
    margin-bottom: 1.8rem;
    position: relative; overflow: hidden;
    box-shadow: 0 20px 60px rgba(79,110,247,0.32);
    animation: sd-up 0.6s cubic-bezier(0.22,1,0.36,1) both;
    display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
  }
  .sd-hero::before {
    content: '';
    position: absolute; top: -60%; left: -20%;
    width: 60%; height: 200%;
    background: linear-gradient(105deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.1) 50%,rgba(255,255,255,0) 100%);
    transform: rotate(25deg); pointer-events: none;
  }
  .sd-hero-deco { position: absolute; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.12); pointer-events: none; }
  .sd-hero-deco.d1 { width: 200px; height: 200px; right: -60px; bottom: -60px; }
  .sd-hero-deco.d2 { width: 110px; height: 110px; right: 80px; top: -40px; }
  .sd-hero-left { position: relative; z-index: 1; }
  .sd-hero-title { font-size: 1.5rem; font-weight: 800; color: #fff; margin: 0; letter-spacing: -0.02em; }
  .sd-hero-sub { font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-top: 0.3rem; }
  .sd-hero-right { position: relative; z-index: 1; display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
  .sd-done-pill {
    font-size: 0.65rem; font-weight: 800; padding: 5px 13px; border-radius: 99px;
    background: var(--green); color: #fff; letter-spacing: 0.07em; text-transform: uppercase;
    box-shadow: 0 4px 12px rgba(34,201,142,0.4);
  }
  .sd-score-pill {
    font-family: var(--font-serif); font-size: 1rem; font-weight: 700; padding: 5px 14px;
    border-radius: 99px; background: var(--white); color: var(--blue);
    border: 1.5px solid var(--blue-mid);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  .sd-back-btn {
    font-size: 0.78rem; font-weight: 700; color: #fff;
    border: 1.5px solid rgba(255,255,255,0.35);
    background: rgba(255,255,255,0.12); backdrop-filter: blur(8px);
    border-radius: 12px; padding: 8px 18px;
    text-decoration: none; transition: background 0.2s;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .sd-back-btn:hover { background: rgba(255,255,255,0.22); color: #fff; }

  /* Cards */
  .sd-card {
    background: var(--white); border-radius: var(--radius);
    border: 1.5px solid var(--border); box-shadow: var(--shadow);
    overflow: hidden; margin-bottom: 1.3rem;
    animation: sd-up 0.5s both;
  }
  .sd-card:nth-child(1){animation-delay:0.05s;}
  .sd-card:nth-child(2){animation-delay:0.1s;}
  .sd-card:nth-child(3){animation-delay:0.15s;}

  /* Cover */
  .sd-cover {
    width: 100%; height: 300px; object-fit: cover; display: block;
    transition: transform 0.4s ease;
  }

  .sd-card-body { padding: 1.6rem; }

  .sd-section-title {
    font-size: 0.7rem; font-weight: 800; color: var(--text2);
    text-transform: uppercase; letter-spacing: 0.12em;
    display: flex; align-items: center; gap: 0.5rem; margin: 0 0 1rem;
  }
  .sd-section-title::after { content: ''; flex: 1; height: 1.5px; background: var(--border); }
  .sd-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  .sd-card-top { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.9rem; flex-wrap: wrap; }
  .sd-cat-pill {
    font-size: 0.63rem; font-weight: 700; padding: 4px 10px; border-radius: 99px;
    background: var(--blue-light); border: 1.5px solid var(--blue-mid); color: var(--blue);
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .sd-owner { font-size: 0.72rem; color: var(--text2); font-weight: 600; }
  .sd-owner b { color: var(--text); }

  .sd-idea-title { font-family: var(--font-serif); font-size: 1.6rem; font-weight: 700; color: var(--text); margin: 0 0 0.4rem; line-height: 1.25; }
  .sd-problem-ref { font-size: 0.78rem; color: var(--text2); font-weight: 600; margin-bottom: 0.8rem; }
  .sd-problem-ref b { color: var(--text); }

  .sd-tech-chip {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.72rem; font-weight: 700; padding: 5px 12px; border-radius: 10px;
    background: var(--purple-light); border: 1.5px solid #ddd6fe; color: var(--purple);
    margin-bottom: 1rem;
  }

  .sd-divider { border: none; border-top: 1.5px solid var(--border); margin: 1.2rem 0; }

  .sd-summary-text { font-size: 0.86rem; color: var(--text2); line-height: 1.75; white-space: pre-line; }

  /* Project links */
  .sd-links { display: flex; flex-wrap: wrap; gap: 0.6rem; }
  .sd-link-btn {
    font-size: 0.75rem; font-weight: 700; padding: 7px 16px; border-radius: 11px;
    text-decoration: none; border: 1.5px solid; display: inline-flex; align-items: center; gap: 5px;
    transition: all 0.2s;
  }
  .sd-link-btn.repo   { color: var(--text); border-color: var(--border); background: var(--bg); }
  .sd-link-btn.repo:hover   { background: var(--text); color: #fff; border-color: var(--text); }
  .sd-link-btn.demo   { color: var(--blue); border-color: var(--blue-mid); background: var(--blue-light); }
  .sd-link-btn.demo:hover   { background: var(--blue); color: #fff; border-color: var(--blue); }
  .sd-link-btn.report { color: var(--green); border-color: #a7f3d0; background: var(--green-light); }
  .sd-link-btn.report:hover { background: var(--green); color: #fff; border-color: var(--green); }
  .sd-no-links { font-size: 0.78rem; color: var(--text3); }

  /* Proof links */
  .sd-proof-link {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.7rem 1rem; border-radius: 12px;
    background: var(--bg); border: 1.5px solid var(--border);
    text-decoration: none; color: var(--text2); font-size: 0.78rem; font-weight: 600;
    transition: border-color 0.2s, background 0.2s; margin-bottom: 0.5rem;
  }
  .sd-proof-link:last-child { margin-bottom: 0; }
  .sd-proof-link:hover { border-color: var(--blue-mid); background: var(--blue-light); color: var(--blue); }
  .sd-proof-link span { font-size: 0.68rem; color: var(--text3); }

  /* Build log */
  .sd-update {
    background: var(--bg); border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    padding: 1.1rem 1.2rem; margin-bottom: 0.8rem;
    transition: border-color 0.2s;
  }
  .sd-update:last-child { margin-bottom: 0; }
  .sd-update:hover { border-color: #c7d0ff; }
  .sd-update-header { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.6rem; }
  .sd-update-author { font-size: 0.82rem; font-weight: 800; color: var(--text); display: flex; align-items: center; gap: 6px; }
  .sd-update-author::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: var(--blue); flex-shrink: 0; }
  .sd-update-time { font-size: 0.68rem; color: var(--text3); font-weight: 600; }
  .sd-update-content { font-size: 0.82rem; color: var(--text2); white-space: pre-line; line-height: 1.65; }
  .sd-update-proof {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.72rem; font-weight: 700; color: var(--blue);
    text-decoration: none; padding: 4px 12px; border-radius: 9px;
    background: var(--blue-light); border: 1.5px solid var(--blue-mid);
    margin-top: 0.5rem; transition: background 0.2s, color 0.2s;
  }
  .sd-update-proof:hover { background: var(--blue); color: #fff; border-color: var(--blue); }
  .sd-proof-img { max-width: 100%; border-radius: 10px; border: 1.5px solid var(--border); margin-top: 0.6rem; display: block; }

  /* Right sidebar cards */
  .sd-side-card {
    background: var(--white); border-radius: var(--radius);
    border: 1.5px solid var(--border); box-shadow: var(--shadow);
    padding: 1.4rem 1.5rem; margin-bottom: 1.2rem;
    animation: sd-up 0.5s 0.15s both;
  }

  /* Team members */
  .sd-members { display: flex; flex-wrap: wrap; gap: 5px; }
  .sd-member-chip {
    font-size: 0.7rem; font-weight: 700; padding: 4px 11px; border-radius: 99px;
    background: var(--bg); border: 1.5px solid var(--border); color: var(--text2);
    display: inline-flex; align-items: center; gap: 4px;
  }
  .sd-member-chip::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--blue); flex-shrink: 0; }

  .sd-meta-row { font-size: 0.75rem; color: var(--text2); margin-bottom: 0.3rem; }
  .sd-meta-row b { color: var(--text); }

  .sd-action-btn {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.75rem; font-weight: 800; color: var(--blue);
    text-decoration: none; padding: 7px 16px; border-radius: 11px;
    background: var(--blue-light); border: 1.5px solid var(--blue-mid);
    transition: all 0.2s; margin-top: 0.8rem;
  }
  .sd-action-btn:hover { background: var(--blue); color: #fff; border-color: var(--blue); }
  .sd-action-btn.sec { color: var(--text2); background: var(--bg); border-color: var(--border); }
  .sd-action-btn.sec:hover { background: var(--text); color: #fff; border-color: var(--text); }

  .sd-staff-banner {
    background: linear-gradient(135deg,var(--blue-light),var(--purple-light));
    border: 1.5px solid var(--blue-mid); border-radius: var(--radius-sm);
    padding: 0.9rem 1rem; margin-bottom: 1.2rem;
    font-size: 0.78rem; color: var(--text2); line-height: 1.5;
    animation: sd-up 0.5s 0.2s both;
  }
  .sd-staff-banner b { color: var(--blue); }

  .sd-problem-desc { font-size: 0.78rem; color: var(--text2); line-height: 1.65; white-space: pre-line; }

  /* Skeleton */
  .sd-skeleton { border-radius: var(--radius); background: linear-gradient(90deg,#e8ecff 0%,#f0f4ff 50%,#e8ecff 100%); background-size:700px 100%; animation: shimmer 1.6s infinite; border: 1.5px solid var(--border); margin-bottom: 1rem; }
  @keyframes shimmer { 0%{background-position:-700px 0;} 100%{background-position:700px 0;} }
  @keyframes sd-up { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }
  @media (max-width: 600px) { .sd-hero { flex-direction: column; } }
`

const proofIcon = (type) => {
  if (type === 'github') return '💻'
  if (type === 'demo') return '▶'
  if (type === 'pdf') return '📄'
  if (type === 'image') return '🖼'
  return '🔗'
}

const ShowcaseDetails = () => {
  const { id } = useParams()
  const { user } = useContext(AuthContext)

  const role = (user?.user?.role || '').toString().toLowerCase().trim()
  const isStaff = useMemo(() => ['admin', 'instructor'].includes(role), [role])
  const authToken = user?.token || user?.user?.token

  const [loading, setLoading] = useState(true)
  const [item, setItem] = useState(null)

  const fetchDetails = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${apiUrl}/showcases/${id}`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${authToken}` },
      })
      const result = await res.json()
      if (result.status === 200) setItem(result.data)
      else { toast.error(result.message || 'Failed to load showcase'); setItem(null) }
    } catch (e) {
      console.log(e); toast.error('Server error loading showcase'); setItem(null)
    } finally { setLoading(false) }
  }

  useEffect(() => { if (authToken && id) fetchDetails() }, [authToken, id])

  const cover = item?.cover_image_resolved || item?.cover_image ||
    item?.idea?.updates?.find(u => u.proof_type === 'image' && u.proof_url)?.proof_url || ''

  const idea = item?.idea
  const problem = idea?.problem
  const owner = idea?.user

  const proofLinks = useMemo(() => {
    return (idea?.updates || [])
      .filter(u => u?.proof_url)
      .map(u => ({ id: u.id, type: u.proof_type, url: u.proof_url }))
  }, [idea])

  return (
    <Layout>
      <style>{css}</style>
      <div className='sd-blob-wrap'>
        <div className='sd-blob sd-blob-1' /><div className='sd-blob sd-blob-2' /><div className='sd-blob sd-blob-3' />
      </div>

      <div className='sd-root'>
        <div className='container sd-inner'>

          {/* Hero */}
          <div className='sd-hero'>
            <div className='sd-hero-deco d1' /><div className='sd-hero-deco d2' />
            <div className='sd-hero-left'>
              <div className='sd-hero-title'>🏆 Showcase Details</div>
              <div className='sd-hero-sub'>A completed, validated innovation project.</div>
            </div>
            <div className='sd-hero-right'>
              {item?.score ? <span className='sd-score-pill'>{item.score}/10</span> : null}
              <span className='sd-done-pill'>✓ Completed</span>
              <Link to='/account/innovation/showcase' className='sd-back-btn'>← Showcase</Link>
            </div>
          </div>

          {loading ? (
            <>
              <div className='sd-skeleton' style={{ height: 300 }} />
              <div className='sd-skeleton' style={{ height: 200 }} />
            </>
          ) : !item ? (
            <div className='alert alert-danger' style={{ borderRadius: 16 }}>Showcase not found.</div>
          ) : (
            <div className='row g-3'>

              {/* LEFT */}
              <div className='col-lg-8'>

                {/* Main card */}
                <div className='sd-card'>
                  {cover && (
                    <img src={cover} alt='cover' className='sd-cover'
                      onError={e => e.currentTarget.style.display = 'none'} />
                  )}
                  <div className='sd-card-body'>
                    <div className='sd-card-top'>
                      <span className='sd-cat-pill'>{problem?.category || 'General'}</span>
                      <span className='sd-owner'>By <b>{owner?.name || 'Unknown'}</b></span>
                    </div>

                    <h2 className='sd-idea-title'>{idea?.title}</h2>
                    <div className='sd-problem-ref'>Problem: <b>{problem?.title}</b></div>

                    {item?.tech_stack && (
                      <div className='sd-tech-chip'>🧩 {item.tech_stack}</div>
                    )}

                    <hr className='sd-divider' />
                    <div className='sd-section-title'><span className='sd-dot' style={{ background: 'var(--blue)' }} />Summary</div>
                    <div className='sd-summary-text'>{item?.summary || 'No summary provided.'}</div>

                    <hr className='sd-divider' />
                    <div className='sd-section-title'><span className='sd-dot' style={{ background: 'var(--purple)' }} />Project Links</div>
                    <div className='sd-links'>
                      {item?.repo_url && <a className='sd-link-btn repo' href={item.repo_url} target='_blank' rel='noreferrer'>💻 Repo</a>}
                      {item?.demo_url && <a className='sd-link-btn demo' href={item.demo_url} target='_blank' rel='noreferrer'>▶ Demo</a>}
                      {item?.report_url && <a className='sd-link-btn report' href={item.report_url} target='_blank' rel='noreferrer'>📄 Report</a>}
                      {!item?.repo_url && !item?.demo_url && !item?.report_url && (
                        <span className='sd-no-links'>No main links provided.</span>
                      )}
                    </div>

                    {proofLinks.length > 0 && (
                      <>
                        <hr className='sd-divider' />
                        <div className='sd-section-title'><span className='sd-dot' style={{ background: 'var(--green)' }} />Build Log Proofs</div>
                        {proofLinks.slice(0, 8).map(p => (
                          <a key={p.id} href={p.url} target='_blank' rel='noreferrer' className='sd-proof-link'>
                            <span>{proofIcon(p.type)} {p.type || 'Link'} <span>· proof #{p.id}</span></span>
                            <span>Open →</span>
                          </a>
                        ))}
                      </>
                    )}
                  </div>
                </div>

                {/* Build log */}
                {idea?.updates?.length ? (
                  <div className='sd-card'>
                    <div className='sd-card-body'>
                      <div className='sd-section-title'><span className='sd-dot' style={{ background: 'var(--orange)' }} />Build Log (Latest)</div>
                      {[...idea.updates].slice(-5).reverse().map((u, idx) => (
                        <div key={u.id} className='sd-update' style={{ animationDelay: `${idx * 0.04}s` }}>
                          <div className='sd-update-header'>
                            <span className='sd-update-author'>{u.user?.name || 'Member'}</span>
                            <span className='sd-update-time'>{u.created_at ? new Date(u.created_at).toLocaleString() : ''}</span>
                          </div>
                          <div className='sd-update-content'>{u.content}</div>
                          {u.proof_url && (
                            <div>
                              <a href={u.proof_url} target='_blank' rel='noreferrer' className='sd-update-proof'>
                                {proofIcon(u.proof_type)}{u.proof_type === 'pdf' ? ' Open PDF' : u.proof_type === 'image' ? ' View Image' : ' View Proof'}
                              </a>
                              {u.proof_type === 'image' && (
                                <img src={u.proof_url} alt='proof' className='sd-proof-img'
                                  onError={e => e.currentTarget.style.display = 'none'} />
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* RIGHT */}
              <div className='col-lg-4'>

                {isStaff && (
                  <div className='sd-staff-banner'>
                    <b>Staff View:</b> You can republish or update this showcase by calling the publish endpoint again.
                  </div>
                )}

                {/* Team */}
                <div className='sd-side-card'>
                  <div className='sd-section-title'><span className='sd-dot' style={{ background: 'var(--blue)' }} />Team</div>
                  {idea?.members?.length ? (
                    <div className='sd-members'>
                      {idea.members.map(m => (
                        <span key={m.id} className='sd-member-chip'>{m.user?.name || 'Member'}</span>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>Team members not loaded.</div>
                  )}
                  <hr className='sd-divider' />
                  <div className='sd-meta-row'>Status: <b>{idea?.status || (idea?.is_selected ? 'building' : 'proposed')}</b></div>
                  <div className='sd-meta-row'>Votes: <b>{idea?.votes_count ?? 0}</b></div>
                  <Link to={`/account/innovation/idea/${idea?.id}`} className='sd-action-btn'>Open Workspace →</Link>
                </div>

                {/* Problem */}
                <div className='sd-side-card'>
                  <div className='sd-section-title'><span className='sd-dot' style={{ background: 'var(--purple)' }} />Problem</div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text)', marginBottom: '0.5rem' }}>{problem?.title}</div>
                  <div className='sd-problem-desc'>
                    {String(problem?.description || '').slice(0, 220)}{String(problem?.description || '').length > 220 ? '…' : ''}
                  </div>
                  <Link to={`/account/innovation/problem/${problem?.id}`} className='sd-action-btn sec' style={{ marginTop: '0.8rem' }}>View Problem →</Link>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default ShowcaseDetails