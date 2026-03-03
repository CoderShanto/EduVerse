import React, { useContext, useEffect, useMemo, useState } from 'react'
import Layout from '../../common/Layout'
import { Link, useParams } from 'react-router-dom'
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
    --orange: #ff7140;
    --orange-light: #fff2ee;
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
    --shadow-hover: 0 16px 48px rgba(79,110,247,0.16);
    --font: 'Plus Jakarta Sans', sans-serif;
    --font-serif: 'Fraunces', serif;
  }

  .pd-root {
    background: var(--bg);
    min-height: 100vh;
    font-family: var(--font);
    padding-bottom: 4rem;
    color: var(--text);
    position: relative;
  }

  .pd-blob-wrap { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
  .pd-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.28; }
  .pd-blob-1 { width: 500px; height: 500px; background: radial-gradient(circle,#c7d0ff,#a5b4fc); top: -150px; right: -100px; animation: blob-float 10s ease-in-out infinite alternate; }
  .pd-blob-2 { width: 360px; height: 360px; background: radial-gradient(circle,#ffd5c5,#ffb3a0); bottom: 0; left: -80px; animation: blob-float 14s ease-in-out infinite alternate-reverse; }
  .pd-blob-3 { width: 220px; height: 220px; background: radial-gradient(circle,#b5f0d8,#86efca); top: 40%; left: 40%; animation: blob-float 9s ease-in-out infinite alternate; }
  @keyframes blob-float { from{transform:translate(0,0) scale(1);} to{transform:translate(28px,18px) scale(1.1);} }

  .pd-inner { position: relative; z-index: 1; padding: 1.5rem 0 0; }

  /* Hero header */
  .pd-hero {
    background: linear-gradient(135deg,#4f6ef7 0%,#7c5cbf 55%,#a855f7 100%);
    border-radius: 28px;
    padding: 2rem 2.4rem;
    margin-bottom: 1.8rem;
    position: relative; overflow: hidden;
    box-shadow: 0 20px 60px rgba(79,110,247,0.32);
    animation: pd-up 0.6s cubic-bezier(0.22,1,0.36,1) both;
    display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
  }
  .pd-hero::before {
    content: '';
    position: absolute; top: -60%; left: -20%;
    width: 60%; height: 200%;
    background: linear-gradient(105deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.1) 50%,rgba(255,255,255,0) 100%);
    transform: rotate(25deg); pointer-events: none;
  }
  .pd-hero-deco { position: absolute; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.12); pointer-events: none; }
  .pd-hero-deco.d1 { width: 200px; height: 200px; right: -60px; bottom: -60px; }
  .pd-hero-deco.d2 { width: 110px; height: 110px; right: 80px; top: -40px; }
  .pd-hero-left { position: relative; z-index: 1; }
  .pd-hero-title { font-size: 1.5rem; font-weight: 800; color: #fff; margin: 0; letter-spacing: -0.02em; }
  .pd-hero-sub { font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-top: 0.3rem; }
  .pd-back-btn {
    position: relative; z-index: 1;
    font-size: 0.78rem; font-weight: 700; color: #fff;
    border: 1.5px solid rgba(255,255,255,0.35);
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(8px);
    border-radius: 12px; padding: 8px 18px;
    text-decoration: none; transition: background 0.2s;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .pd-back-btn:hover { background: rgba(255,255,255,0.22); color: #fff; }

  /* Problem card */
  .pd-problem-card {
    background: var(--white); border-radius: var(--radius);
    border: 1.5px solid var(--border); box-shadow: var(--shadow);
    padding: 1.8rem; margin-bottom: 1.6rem;
    animation: pd-up 0.5s 0.1s both; position: relative; overflow: hidden;
  }
  .pd-problem-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
    border-radius: 99px 99px 0 0;
    background: linear-gradient(90deg,var(--blue),var(--purple));
  }
  .pd-problem-top { display: flex; align-items: center; justify-content: space-between; gap: 0.6rem; margin-bottom: 1rem; flex-wrap: wrap; }
  .pd-cat-pill {
    font-size: 0.65rem; font-weight: 700; padding: 4px 12px; border-radius: 99px;
    background: var(--blue-light); border: 1.5px solid var(--blue-mid); color: var(--blue);
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .pd-status-pill {
    font-size: 0.65rem; font-weight: 700; padding: 4px 12px; border-radius: 99px;
    text-transform: uppercase; letter-spacing: 0.06em; border: 1.5px solid;
  }
  .pd-status-pill.open    { background: var(--green-light);  border-color: #a7f3d0; color: #065f46; }
  .pd-status-pill.building{ background: var(--yellow-light); border-color: #fde68a; color: #92400e; }
  .pd-status-pill.closed  { background: #f4f4f5; border-color: #d4d4d8; color: #71717a; }
  .pd-problem-title { font-family: var(--font-serif); font-size: 1.6rem; font-weight: 700; color: var(--text); margin: 0 0 0.6rem; line-height: 1.25; }
  .pd-problem-desc { font-size: 0.88rem; color: var(--text2); line-height: 1.75; white-space: pre-line; margin: 0; }
  .pd-problem-author { font-size: 0.72rem; color: var(--text3); font-weight: 600; margin-top: 1rem; }
  .pd-problem-author b { color: var(--text2); }

  /* Section card */
  .pd-card {
    background: var(--white); border-radius: var(--radius);
    border: 1.5px solid var(--border); box-shadow: var(--shadow);
    padding: 1.6rem; height: 100%;
    animation: pd-up 0.5s 0.2s both;
  }
  .pd-card-title {
    font-size: 0.72rem; font-weight: 800; color: var(--text2);
    text-transform: uppercase; letter-spacing: 0.12em;
    display: flex; align-items: center; gap: 0.5rem; margin: 0 0 1.2rem;
  }
  .pd-card-title::after { content: ''; flex: 1; height: 1.5px; background: var(--border); }
  .pd-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .pd-count-chip {
    font-family: var(--font-serif); font-size: 0.9rem; font-weight: 700;
    background: var(--blue-light); border: 1.5px solid var(--blue-mid); color: var(--blue);
    border-radius: 99px; padding: 2px 10px; margin-left: auto;
  }

  /* Idea item */
  .pd-idea {
    background: var(--bg); border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    padding: 1.1rem 1.2rem; margin-bottom: 0.8rem;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
    animation: pd-up 0.35s both;
    position: relative;
  }
  .pd-idea:last-child { margin-bottom: 0; }
  .pd-idea:hover { border-color: #c7d0ff; box-shadow: 0 4px 20px rgba(79,110,247,0.1); transform: translateX(4px); }
  .pd-idea.selected { border-color: #a7f3d0; background: #f0fdf8; }
  .pd-idea.selected::before {
    content: '✓ Selected for building';
    position: absolute; top: -1px; right: 12px;
    font-size: 0.6rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em;
    background: var(--green); color: #fff; padding: 3px 10px; border-radius: 0 0 8px 8px;
  }
  .pd-idea-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.8rem; }
  .pd-idea-title { font-size: 0.92rem; font-weight: 800; color: var(--text); margin: 0; }
  .pd-idea-author { font-size: 0.7rem; color: var(--text3); margin-top: 0.2rem; font-weight: 600; }
  .pd-idea-desc { font-size: 0.8rem; color: var(--text2); line-height: 1.6; white-space: pre-line; margin-top: 0.6rem; }
  .pd-idea-actions { display: flex; gap: 0.5rem; align-items: center; flex-shrink: 0; flex-wrap: wrap; }

  .pd-vote-btn {
    font-size: 0.72rem; font-weight: 700; border-radius: 10px; padding: 6px 12px;
    cursor: pointer; border: 1.5px solid; font-family: var(--font);
    display: inline-flex; align-items: center; gap: 5px; transition: all 0.2s;
  }
  .pd-vote-btn.voted { background: var(--green); border-color: var(--green); color: #fff; }
  .pd-vote-btn.unvoted { background: var(--white); border-color: #a7f3d0; color: var(--green); }
  .pd-vote-btn:hover { transform: scale(1.05); }

  .pd-select-btn {
    font-size: 0.72rem; font-weight: 700; border-radius: 10px; padding: 6px 12px;
    cursor: pointer; border: 1.5px solid var(--blue-mid); font-family: var(--font);
    background: var(--blue-light); color: var(--blue);
    display: inline-flex; align-items: center; gap: 5px; transition: all 0.2s;
  }
  .pd-select-btn:hover { background: var(--blue); color: #fff; border-color: var(--blue); }

  .pd-join-btn {
    font-size: 0.72rem; font-weight: 700; border-radius: 10px; padding: 6px 14px;
    cursor: pointer; border: none; font-family: var(--font);
    background: linear-gradient(135deg,var(--blue),var(--purple)); color: #fff;
    display: inline-flex; align-items: center; gap: 5px; transition: opacity 0.2s, transform 0.2s;
  }
  .pd-join-btn:hover:not(:disabled) { opacity: 0.85; transform: scale(1.04); }
  .pd-join-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Empty */
  .pd-empty { text-align: center; padding: 2.5rem 1rem; color: var(--text2); font-size: 0.85rem; }

  /* Form */
  .pd-field { margin-bottom: 0.9rem; }
  .pd-field label { font-size: 0.7rem; font-weight: 800; color: var(--text2); text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 0.4rem; }
  .pd-field input, .pd-field textarea {
    width: 100%; background: var(--bg); border: 1.5px solid var(--border);
    border-radius: 12px; padding: 10px 14px; font-family: var(--font);
    font-size: 0.85rem; color: var(--text); outline: none; resize: vertical;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .pd-field input:focus, .pd-field textarea:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(79,110,247,0.1); }
  .pd-field input::placeholder, .pd-field textarea::placeholder { color: var(--text3); }
  .pd-submit-btn {
    width: 100%; background: linear-gradient(135deg,var(--blue),var(--purple));
    color: #fff; border: none; border-radius: 14px; padding: 11px;
    font-family: var(--font); font-size: 0.88rem; font-weight: 800;
    cursor: pointer; transition: opacity 0.2s, transform 0.2s; margin-top: 0.3rem;
  }
  .pd-submit-btn:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
  .pd-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .pd-tip {
    background: var(--bg); border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    padding: 0.9rem 1rem; margin-top: 0.8rem;
    font-size: 0.75rem; color: var(--text2); line-height: 1.55;
  }
  .pd-tip b { color: var(--text); }

  .pd-mentor-banner {
    background: linear-gradient(135deg,var(--blue-light),var(--purple-light));
    border: 1.5px solid var(--blue-mid); border-radius: var(--radius-sm);
    padding: 0.9rem 1rem; margin-top: 0.8rem;
    font-size: 0.78rem; color: var(--text2); line-height: 1.5;
  }
  .pd-mentor-banner b { color: var(--blue); }

  /* Skeleton */
  .pd-skeleton { border-radius: var(--radius); height: 160px; background: linear-gradient(90deg,#e8ecff 0%,#f0f4ff 50%,#e8ecff 100%); background-size:700px 100%; animation: shimmer 1.6s infinite; border: 1.5px solid var(--border); margin-bottom: 1rem; }
  @keyframes shimmer { 0%{background-position:-700px 0;} 100%{background-position:700px 0;} }
  @keyframes pd-up { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }

  @media (max-width: 600px) { .pd-hero { flex-direction: column; } }
`

const ProblemDetails = () => {
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const [joining, setJoining] = useState(false)

  const role = user?.user?.role ? String(user.user.role).toLowerCase().trim() : ''
  const isMentorRole = ['admin', 'instructor', 'mentor'].includes(role)
  const authToken = user?.token || user?.user?.token || configToken

  const [loading, setLoading] = useState(true)
  const [problem, setProblem] = useState(null)
  const [ideas, setIdeas] = useState([])
  const [myVotes, setMyVotes] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)
  const [ideaForm, setIdeaForm] = useState({ title: '', description: '' })
  const [submittingIdea, setSubmittingIdea] = useState(false)

  const votedSet = useMemo(() => new Set(myVotes || []), [myVotes])

  const joinTeam = async (ideaId) => {
    try {
      setJoining(true)
      const res = await fetch(`${apiUrl}/ideas/${ideaId}/join`, {
        method: 'POST',
        headers: { Accept: 'application/json', Authorization: `Bearer ${authToken}` },
      })
      const result = await res.json()
      if (result.status === 200) { toast.success(result.message || 'Joined team!'); setRefreshKey(k => k + 1) }
      else toast.error(result.message || 'Join failed')
    } catch (e) { console.log(e); toast.error('Server error joining team') }
    finally { setJoining(false) }
  }

  const fetchDetails = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${apiUrl}/problems/${id}`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${authToken}` },
      })
      const result = await res.json()
      if (result.status === 200) {
        setProblem(result.data.problem)
        setIdeas(result.data.problem?.ideas || [])
        setMyVotes(result.data.my_voted_idea_ids || [])
      } else toast.error(result.message || 'Failed to load problem')
    } catch (e) { console.log(e); toast.error('Server error loading problem') }
    finally { setLoading(false) }
  }

  useEffect(() => { if (authToken && id) fetchDetails() }, [id, authToken, refreshKey])

  const addIdea = async (e) => {
    e.preventDefault()
    if (!ideaForm.title.trim() || !ideaForm.description.trim()) { toast.error('Title and description are required'); return }
    try {
      setSubmittingIdea(true)
      const res = await fetch(`${apiUrl}/problems/${id}/ideas`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ title: ideaForm.title, description: ideaForm.description }),
      })
      const result = await res.json()
      if (result.status === 200) { toast.success('Idea added'); setIdeaForm({ title: '', description: '' }); setRefreshKey(k => k + 1) }
      else if (result.status === 422) toast.error('Validation failed')
      else toast.error(result.message || 'Failed to add idea')
    } catch (e) { console.log(e); toast.error('Server error adding idea') }
    finally { setSubmittingIdea(false) }
  }

  const toggleVote = async (ideaId) => {
    try {
      const res = await fetch(`${apiUrl}/ideas/${ideaId}/vote`, {
        method: 'POST',
        headers: { Accept: 'application/json', Authorization: `Bearer ${authToken}` },
      })
      const result = await res.json()
      if (result.status === 200) {
        const voted = !!result.data?.voted
        const votes_count = Number(result.data?.votes_count || 0)
        setIdeas(prev => prev.map(it => it.id === ideaId ? { ...it, votes_count } : it))
        setMyVotes(prev => { const s = new Set(prev || []); voted ? s.add(ideaId) : s.delete(ideaId); return Array.from(s) })
        toast.success(result.message || (voted ? 'Voted' : 'Vote removed'))
      } else toast.error(result.message || 'Vote failed')
    } catch (e) { console.log(e); toast.error('Server error voting') }
  }

  const selectIdea = async (ideaId) => {
    if (!isMentorRole) return
    try {
      const res = await fetch(`${apiUrl}/ideas/${ideaId}/select`, {
        method: 'POST',
        headers: { Accept: 'application/json', Authorization: `Bearer ${authToken}` },
      })
      const result = await res.json()
      if (result.status === 200) { toast.success('Idea selected for building'); setRefreshKey(k => k + 1) }
      else toast.error(result.message || 'Select failed')
    } catch (e) { console.log(e); toast.error('Server error selecting idea') }
  }

  const statusClass = (s) => s === 'open' ? 'open' : s === 'building' ? 'building' : 'closed'

  return (
    <Layout>
      <style>{css}</style>
      <div className='pd-blob-wrap'>
        <div className='pd-blob pd-blob-1' /><div className='pd-blob pd-blob-2' /><div className='pd-blob pd-blob-3' />
      </div>

      <div className='pd-root'>
        <div className='container pd-inner'>

          {/* Hero */}
          <div className='pd-hero'>
            <div className='pd-hero-deco d1' /><div className='pd-hero-deco d2' />
            <div className='pd-hero-left'>
              <div className='pd-hero-title'>💡 Problem Details</div>
              <div className='pd-hero-sub'>Review the problem, vote on ideas, and propose your own.</div>
            </div>
            <Link to='/account/innovation' className='pd-back-btn'>← Back to Hub</Link>
          </div>

          {loading ? (
            <>
              <div className='pd-skeleton' />
              <div className='pd-skeleton' style={{ height: 300 }} />
            </>
          ) : !problem ? (
            <div className='alert alert-danger' style={{ borderRadius: 16 }}>Problem not found.</div>
          ) : (
            <>
              {/* Problem card */}
              <div className='pd-problem-card'>
                <div className='pd-problem-top'>
                  <span className='pd-cat-pill'>{problem.category || 'General'}</span>
                  <span className={`pd-status-pill ${statusClass(problem.status)}`}>{problem.status}</span>
                </div>
                <h2 className='pd-problem-title'>{problem.title}</h2>
                <p className='pd-problem-desc'>{problem.description}</p>
                <div className='pd-problem-author'>Posted by <b>{problem.user?.name || 'Unknown'}</b></div>
              </div>

              <div className='row g-3'>

                {/* Ideas list */}
                <div className='col-lg-7'>
                  <div className='pd-card'>
                    <div className='pd-card-title'>
                      <span className='pd-dot' style={{ background: 'var(--blue)' }} />
                      Ideas
                      <span className='pd-count-chip'>{ideas.length}</span>
                    </div>

                    {ideas.length === 0 ? (
                      <div className='pd-empty'>💬 No ideas yet. Be the first to propose one →</div>
                    ) : (
                      ideas.map((idea, idx) => {
                        const voted = votedSet.has(idea.id)
                        return (
                          <div
                            key={idea.id}
                            className={`pd-idea${idea.is_selected ? ' selected' : ''}`}
                            style={{ animationDelay: `${idx * 0.05}s` }}
                          >
                            <div className='pd-idea-top'>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div className='pd-idea-title'>{idea.title}</div>
                                <div className='pd-idea-author'>By {idea.user?.name || 'Unknown'}</div>
                              </div>
                              <div className='pd-idea-actions'>
                                <button
                                  className={`pd-vote-btn ${voted ? 'voted' : 'unvoted'}`}
                                  onClick={() => toggleVote(idea.id)}
                                >
                                  {voted ? '✓' : '↑'} {idea.votes_count}
                                </button>
                                {idea.is_selected == 1 && (
                                  <button className='pd-join-btn' onClick={() => joinTeam(idea.id)} disabled={joining}>
                                    {joining ? 'Joining…' : '+ Join Team'}
                                  </button>
                                )}
                                {isMentorRole && !idea.is_selected && (
                                  <button className='pd-select-btn' onClick={() => selectIdea(idea.id)}>Select</button>
                                )}
                              </div>
                            </div>
                            <div className='pd-idea-desc'>{idea.description}</div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>

                {/* Propose idea form */}
                <div className='col-lg-5'>
                  <div className='pd-card'>
                    <div className='pd-card-title'>
                      <span className='pd-dot' style={{ background: 'var(--purple)' }} />
                      Propose an Idea
                    </div>

                    <div className='pd-field'>
                      <label>Idea Title</label>
                      <input
                        value={ideaForm.title}
                        onChange={e => setIdeaForm(p => ({ ...p, title: e.target.value }))}
                        placeholder='Example: QR code attendance app'
                      />
                    </div>
                    <div className='pd-field'>
                      <label>Description</label>
                      <textarea
                        rows={5}
                        value={ideaForm.description}
                        onChange={e => setIdeaForm(p => ({ ...p, description: e.target.value }))}
                        placeholder="Explain how it works, who benefits, and why it's good."
                      />
                    </div>
                    <button className='pd-submit-btn' disabled={submittingIdea} onClick={addIdea}>
                      {submittingIdea ? 'Submitting…' : '→ Submit Idea'}
                    </button>

                    <div className='pd-tip'>
                      <b>Tip:</b> The best ideas are simple + measurable.<br />
                      Example: "Reduce attendance time from 10 minutes to 30 seconds."
                    </div>

                    {isMentorRole && (
                      <div className='pd-mentor-banner'>
                        <b>Mentor Mode:</b> You can select one idea to move this problem into <b>Building</b> phase.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default ProblemDetails