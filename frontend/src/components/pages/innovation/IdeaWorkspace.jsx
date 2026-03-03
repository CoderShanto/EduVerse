import React, { useContext, useEffect, useMemo, useState } from 'react'
import Layout from '../../common/Layout'
import { useParams, Link } from 'react-router-dom'
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
    --orange-light: #fff2ee;
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

  .iw-root {
    background: var(--bg);
    min-height: 100vh;
    font-family: var(--font);
    padding-bottom: 4rem;
    color: var(--text);
    position: relative;
  }

  .iw-blob-wrap { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
  .iw-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.26; }
  .iw-blob-1 { width: 500px; height: 500px; background: radial-gradient(circle,#c7d0ff,#a5b4fc); top: -150px; right: -100px; animation: blob-float 10s ease-in-out infinite alternate; }
  .iw-blob-2 { width: 360px; height: 360px; background: radial-gradient(circle,#ffd5c5,#ffb3a0); bottom: 0; left: -80px; animation: blob-float 14s ease-in-out infinite alternate-reverse; }
  .iw-blob-3 { width: 220px; height: 220px; background: radial-gradient(circle,#b5f0d8,#86efca); top: 40%; left: 40%; animation: blob-float 9s ease-in-out infinite alternate; }
  @keyframes blob-float { from{transform:translate(0,0) scale(1);} to{transform:translate(28px,18px) scale(1.1);} }

  .iw-inner { position: relative; z-index: 1; padding: 1.5rem 0 0; }

  /* Hero */
  .iw-hero {
    background: linear-gradient(135deg,#4f6ef7 0%,#7c5cbf 55%,#a855f7 100%);
    border-radius: 28px;
    padding: 2rem 2.4rem;
    margin-bottom: 1.8rem;
    position: relative; overflow: hidden;
    box-shadow: 0 20px 60px rgba(79,110,247,0.32);
    animation: iw-up 0.6s cubic-bezier(0.22,1,0.36,1) both;
    display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
  }
  .iw-hero::before {
    content: '';
    position: absolute; top: -60%; left: -20%;
    width: 60%; height: 200%;
    background: linear-gradient(105deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.1) 50%,rgba(255,255,255,0) 100%);
    transform: rotate(25deg); pointer-events: none;
  }
  .iw-hero-deco { position: absolute; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.12); pointer-events: none; }
  .iw-hero-deco.d1 { width: 200px; height: 200px; right: -60px; bottom: -60px; }
  .iw-hero-deco.d2 { width: 110px; height: 110px; right: 80px; top: -40px; }
  .iw-hero-left { position: relative; z-index: 1; }
  .iw-hero-title { font-size: 1.5rem; font-weight: 800; color: #fff; margin: 0; letter-spacing: -0.02em; }
  .iw-hero-sub { font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-top: 0.3rem; }
  .iw-back-btn {
    position: relative; z-index: 1;
    font-size: 0.78rem; font-weight: 700; color: #fff;
    border: 1.5px solid rgba(255,255,255,0.35);
    background: rgba(255,255,255,0.12); backdrop-filter: blur(8px);
    border-radius: 12px; padding: 8px 18px;
    text-decoration: none; transition: background 0.2s;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .iw-back-btn:hover { background: rgba(255,255,255,0.22); color: #fff; }

  /* Idea Info */
  .iw-idea-card {
    background: var(--white); border-radius: var(--radius);
    border: 1.5px solid var(--border); box-shadow: var(--shadow);
    overflow: hidden; margin-bottom: 1.4rem;
    animation: iw-up 0.5s 0.05s both;
  }
  .iw-idea-band {
    background: linear-gradient(135deg,var(--blue-light),var(--purple-light));
    padding: 1.2rem 1.6rem; border-bottom: 1.5px solid var(--border);
    position: relative;
  }
  .iw-idea-band::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg,var(--blue),var(--purple));
  }
  .iw-idea-title { font-family: var(--font-serif); font-size: 1.4rem; font-weight: 700; color: var(--text); margin: 0 0 0.3rem; }
  .iw-idea-problem { font-size: 0.78rem; color: var(--text2); font-weight: 600; }
  .iw-idea-problem b { color: var(--text); }
  .iw-building-chip {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.65rem; font-weight: 800; padding: 4px 12px; border-radius: 99px;
    background: var(--green-light); border: 1.5px solid #a7f3d0; color: #065f46;
    text-transform: uppercase; letter-spacing: 0.07em;
  }
  .iw-building-chip::before {
    content: ''; width: 6px; height: 6px; border-radius: 50%;
    background: var(--green); animation: live-pulse 1.6s ease-in-out infinite;
  }
  @keyframes live-pulse { 0%,100%{opacity:1;} 50%{opacity:0.2;} }

  /* Section cards */
  .iw-card {
    background: var(--white); border-radius: var(--radius);
    border: 1.5px solid var(--border); box-shadow: var(--shadow);
    padding: 1.5rem 1.6rem; margin-bottom: 1.4rem;
    animation: iw-up 0.5s both;
  }
  .iw-card:nth-child(3){animation-delay:0.1s;}
  .iw-card:nth-child(4){animation-delay:0.15s;}
  .iw-card:nth-child(5){animation-delay:0.2s;}

  .iw-section-title {
    font-size: 0.7rem; font-weight: 800; color: var(--text2);
    text-transform: uppercase; letter-spacing: 0.12em;
    display: flex; align-items: center; gap: 0.5rem; margin: 0 0 1.1rem;
  }
  .iw-section-title::after { content: ''; flex: 1; height: 1.5px; background: var(--border); }
  .iw-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  /* Members */
  .iw-members { display: flex; flex-wrap: wrap; gap: 6px; }
  .iw-member-chip {
    font-size: 0.72rem; font-weight: 700; padding: 5px 12px; border-radius: 99px;
    background: var(--bg); border: 1.5px solid var(--border); color: var(--text2);
    display: inline-flex; align-items: center; gap: 5px;
  }
  .iw-member-chip::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: var(--blue); flex-shrink: 0; }

  /* Non-member banner */
  .iw-warn-banner {
    background: var(--yellow-light); border: 1.5px solid #fde68a; border-radius: var(--radius-sm);
    padding: 1rem 1.2rem; font-size: 0.82rem; color: #92400e; font-weight: 600;
    display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.4rem;
  }

  /* Post Update form */
  .iw-field { margin-bottom: 0.9rem; }
  .iw-field label { font-size: 0.68rem; font-weight: 800; color: var(--text2); text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 0.4rem; }
  .iw-field textarea, .iw-field input, .iw-field select {
    width: 100%; background: var(--bg); border: 1.5px solid var(--border);
    border-radius: 12px; padding: 10px 14px; font-family: var(--font);
    font-size: 0.85rem; color: var(--text); outline: none; resize: vertical;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .iw-field textarea:focus, .iw-field input:focus, .iw-field select:focus {
    border-color: var(--blue); box-shadow: 0 0 0 3px rgba(79,110,247,0.1);
  }
  .iw-field textarea::placeholder, .iw-field input::placeholder { color: var(--text3); }
  .iw-field small { font-size: 0.7rem; color: var(--text3); margin-top: 0.3rem; display: block; }
  .iw-submit-btn {
    background: linear-gradient(135deg,var(--blue),var(--purple));
    color: #fff; border: none; border-radius: 12px; padding: 10px 24px;
    font-family: var(--font); font-size: 0.85rem; font-weight: 800;
    cursor: pointer; transition: opacity 0.2s, transform 0.2s;
  }
  .iw-submit-btn:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
  .iw-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Updates feed */
  .iw-update {
    background: var(--bg); border: 1.5px solid var(--border);
    border-radius: var(--radius-sm); padding: 1.1rem 1.2rem; margin-bottom: 0.9rem;
    transition: border-color 0.2s, box-shadow 0.2s;
    animation: iw-up 0.35s both;
  }
  .iw-update:last-child { margin-bottom: 0; }
  .iw-update:hover { border-color: #c7d0ff; box-shadow: 0 4px 16px rgba(79,110,247,0.08); }

  .iw-update-header { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.6rem; }
  .iw-update-author { font-size: 0.83rem; font-weight: 800; color: var(--text); display: flex; align-items: center; gap: 6px; }
  .iw-update-author::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--blue); flex-shrink: 0; }
  .iw-update-time { font-size: 0.68rem; color: var(--text3); font-weight: 600; }
  .iw-update-content { font-size: 0.83rem; color: var(--text2); white-space: pre-line; line-height: 1.65; }

  .iw-proof-link {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.72rem; font-weight: 700; color: var(--blue);
    text-decoration: none; padding: 4px 12px; border-radius: 9px;
    background: var(--blue-light); border: 1.5px solid var(--blue-mid);
    margin-top: 0.6rem; transition: background 0.2s, color 0.2s;
  }
  .iw-proof-link:hover { background: var(--blue); color: #fff; border-color: var(--blue); }

  /* Feedback items */
  .iw-feedback {
    background: var(--white); border: 1.5px solid var(--border); border-radius: 10px;
    padding: 0.8rem 1rem; margin-top: 0.6rem;
  }
  .iw-feedback-header { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.3rem; }
  .iw-feedback-name { font-size: 0.78rem; font-weight: 800; color: var(--text); }
  .iw-score-chip {
    font-size: 0.65rem; font-weight: 800; padding: 3px 9px; border-radius: 99px;
    background: var(--yellow-light); border: 1.5px solid #fde68a; color: #92400e;
  }
  .iw-feedback-comment { font-size: 0.78rem; color: var(--text2); line-height: 1.5; }

  /* Mentor feedback form */
  .iw-mentor-form {
    background: linear-gradient(135deg,var(--blue-light),var(--purple-light));
    border: 1.5px solid var(--blue-mid); border-radius: 12px;
    padding: 1rem 1.1rem; margin-top: 0.8rem;
  }
  .iw-mentor-form-title { font-size: 0.68rem; font-weight: 800; color: var(--blue); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.6rem; }
  .iw-mentor-form textarea, .iw-mentor-form input {
    width: 100%; background: var(--white); border: 1.5px solid var(--border);
    border-radius: 10px; padding: 8px 12px; font-family: var(--font);
    font-size: 0.82rem; color: var(--text); outline: none; resize: vertical; margin-bottom: 0.5rem;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .iw-mentor-form textarea:focus, .iw-mentor-form input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(79,110,247,0.1); }
  .iw-feedback-btn {
    font-size: 0.75rem; font-weight: 800; color: var(--blue);
    border: 1.5px solid var(--blue-mid); background: var(--white); border-radius: 10px;
    padding: 6px 16px; cursor: pointer; font-family: var(--font); transition: all 0.2s;
  }
  .iw-feedback-btn:hover { background: var(--blue); color: #fff; border-color: var(--blue); }

  .iw-empty { font-size: 0.82rem; color: var(--text2); padding: 1rem 0; text-align: center; }

  /* Skeleton */
  .iw-skeleton { border-radius: var(--radius); height: 120px; background: linear-gradient(90deg,#e8ecff 0%,#f0f4ff 50%,#e8ecff 100%); background-size:700px 100%; animation: shimmer 1.6s infinite; border: 1.5px solid var(--border); margin-bottom: 1rem; }
  @keyframes shimmer { 0%{background-position:-700px 0;} 100%{background-position:700px 0;} }
  @keyframes iw-up { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }

  @media (max-width: 600px) { .iw-hero { flex-direction: column; } }
`

const IdeaWorkspace = () => {
  const { id } = useParams()
  const { user } = useContext(AuthContext)

  const role = (user?.user?.role || '').toLowerCase().trim()
  const isAdminOrInstructor = ['admin', 'instructor'].includes(role)
  const authToken = user?.token || user?.user?.token

  const [loading, setLoading] = useState(true)
  const [workspace, setWorkspace] = useState(null)
  const [isMember, setIsMember] = useState(false)
  const [updateForm, setUpdateForm] = useState({ content: '', proof_type: '', proof_url: '' })
  const [proofFile, setProofFile] = useState(null)
  const [posting, setPosting] = useState(false)
  const [feedbackForms, setFeedbackForms] = useState({})

  const members = useMemo(() => workspace?.membersUsers || workspace?.members_users || [], [workspace])
  const updates = useMemo(() => workspace?.updates || [], [workspace])

  const fetchWorkspace = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${apiUrl}/ideas/${id}`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${authToken}` },
      })
      const result = await res.json()
      if (result.status === 200) { setWorkspace(result.data.idea); setIsMember(!!result.data.is_member) }
      else toast.error(result.message || 'Failed to load workspace')
    } catch (err) { console.log(err); toast.error('Server error loading workspace') }
    finally { setLoading(false) }
  }

  useEffect(() => { if (authToken) fetchWorkspace() }, [id])

  const resetProofInputs = () => { setUpdateForm(p => ({ ...p, proof_url: '' })); setProofFile(null) }
  const onChangeProofType = (val) => { setUpdateForm(p => ({ ...p, proof_type: val })); resetProofInputs() }

  const submitUpdate = async (e) => {
    e.preventDefault()
    if (!updateForm.content.trim()) { toast.error('Content required'); return }
    const type = (updateForm.proof_type || '').trim()
    if ((type === 'pdf' || type === 'image') && !proofFile) { toast.error('Please upload a file'); return }
    if ((type === 'github' || type === 'demo' || type === 'link') && !updateForm.proof_url.trim()) { toast.error('Please provide proof URL'); return }
    const fd = new FormData()
    fd.append('content', updateForm.content)
    if (type) fd.append('proof_type', type)
    if (proofFile) fd.append('proof_file', proofFile)
    else if (updateForm.proof_url.trim()) fd.append('proof_url', updateForm.proof_url.trim())
    const res = await fetch(`${apiUrl}/ideas/${id}/updates`, {
      method: 'POST',
      headers: { Accept: 'application/json', Authorization: `Bearer ${authToken}` },
      body: fd,
    })
    const result = await res.json()
    if (result.status === 200) {
      toast.success('Update posted')
      setUpdateForm({ content: '', proof_type: '', proof_url: '' })
      setProofFile(null)
      fetchWorkspace()
    } else toast.error(result.message || 'Failed')
  }

  const submitFeedback = async (updateId) => {
    const form = feedbackForms[updateId] || {}
    if (!String(form.comment || '').trim()) { toast.error('Feedback comment required'); return }
    const payload = { comment: String(form.comment).trim() }
    if (form.score !== undefined && String(form.score).trim() !== '') payload.score = Number(form.score)
    try {
      const res = await fetch(`${apiUrl}/updates/${updateId}/feedback`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify(payload),
      })
      const result = await res.json()
      if (result.status === 200) {
        toast.success(result.message || 'Feedback added')
        setFeedbackForms(p => ({ ...p, [updateId]: { comment: '', score: '' } }))
        fetchWorkspace()
      } else toast.error(result.message || 'Failed to add feedback')
    } catch (err) { console.log(err); toast.error('Server error adding feedback') }
  }

  return (
    <Layout>
      <style>{css}</style>
      <div className='iw-blob-wrap'>
        <div className='iw-blob iw-blob-1' /><div className='iw-blob iw-blob-2' /><div className='iw-blob iw-blob-3' />
      </div>

      <div className='iw-root'>
        <div className='container iw-inner'>

          {/* Hero */}
          <div className='iw-hero'>
            <div className='iw-hero-deco d1' /><div className='iw-hero-deco d2' />
            <div className='iw-hero-left'>
              <div className='iw-hero-title'>🛠 Team Workspace</div>
              <div className='iw-hero-sub'>Post updates, track progress, get mentor feedback.</div>
            </div>
            <Link to='/account/innovation/my-teams' className='iw-back-btn'>← My Teams</Link>
          </div>

          {loading ? (
            <> <div className='iw-skeleton' /> <div className='iw-skeleton' style={{ height: 200 }} /> </>
          ) : !workspace ? (
            <div className='alert alert-danger' style={{ borderRadius: 16 }}>Workspace not available.</div>
          ) : (
            <>
              {/* Idea info */}
              <div className='iw-idea-card'>
                <div className='iw-idea-band'>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.8rem', flexWrap: 'wrap' }}>
                    <div>
                      <div className='iw-idea-title'>{workspace.title}</div>
                      <div className='iw-idea-problem'>Problem: <b>{workspace.problem?.title || '—'}</b></div>
                    </div>
                    <span className='iw-building-chip'>Building</span>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className='iw-card'>
                <div className='iw-section-title'><span className='iw-dot' style={{ background: 'var(--blue)' }} />Team Members</div>
                {members.length === 0 ? (
                  <div className='iw-empty'>No members yet.</div>
                ) : (
                  <div className='iw-members'>
                    {members.map(m => <span key={m.id} className='iw-member-chip'>{m.name}</span>)}
                  </div>
                )}
              </div>

              {/* Post Update */}
              {!isMember ? (
                <div className='iw-warn-banner'>
                  ⚠️ Only team members can post updates. Join the team from Problem Details.
                </div>
              ) : (
                <div className='iw-card'>
                  <div className='iw-section-title'><span className='iw-dot' style={{ background: 'var(--purple)' }} />Post Update</div>
                  <form onSubmit={submitUpdate}>
                    <div className='iw-field'>
                      <label>Progress Description</label>
                      <textarea rows={3} placeholder='Describe what you built or progressed on...'
                        value={updateForm.content}
                        onChange={e => setUpdateForm(p => ({ ...p, content: e.target.value }))}
                      />
                    </div>
                    <div className='iw-field'>
                      <label>Proof Type (optional)</label>
                      <select value={updateForm.proof_type} onChange={e => onChangeProofType(e.target.value)}>
                        <option value=''>No proof</option>
                        <option value='github'>GitHub</option>
                        <option value='demo'>Demo</option>
                        <option value='pdf'>PDF Upload</option>
                        <option value='image'>Image Upload</option>
                        <option value='link'>Link</option>
                      </select>
                    </div>
                    {(updateForm.proof_type === 'pdf' || updateForm.proof_type === 'image') && (
                      <div className='iw-field'>
                        <label>Upload File</label>
                        <input type='file'
                          accept={updateForm.proof_type === 'pdf' ? 'application/pdf' : 'image/*'}
                          onChange={e => setProofFile(e.target.files?.[0] || null)}
                        />
                        <small>Max 10MB · PDF / JPG / PNG / WEBP</small>
                      </div>
                    )}
                    {(updateForm.proof_type === 'github' || updateForm.proof_type === 'demo' || updateForm.proof_type === 'link') && (
                      <div className='iw-field'>
                        <label>Proof URL</label>
                        <input placeholder='https://...'
                          value={updateForm.proof_url}
                          onChange={e => setUpdateForm(p => ({ ...p, proof_url: e.target.value }))}
                        />
                      </div>
                    )}
                    {!updateForm.proof_type && (
                      <div className='iw-field'>
                        <label>Optional URL</label>
                        <input placeholder='Optional proof link'
                          value={updateForm.proof_url}
                          onChange={e => setUpdateForm(p => ({ ...p, proof_url: e.target.value }))}
                        />
                      </div>
                    )}
                    <button className='iw-submit-btn' disabled={posting}>
                      {posting ? 'Posting…' : '→ Submit Update'}
                    </button>
                  </form>
                </div>
              )}

              {/* Build Log */}
              <div className='iw-card'>
                <div className='iw-section-title'><span className='iw-dot' style={{ background: 'var(--green)' }} />Build Log <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-serif)', fontSize: '0.9rem', color: 'var(--blue)', fontWeight: 700, fontStyle: 'normal' }}>{updates.length}</span></div>

                {updates.length === 0 ? (
                  <div className='iw-empty'>📋 No updates yet. Post the first one above!</div>
                ) : (
                  updates.map((u, idx) => (
                    <div key={u.id} className='iw-update' style={{ animationDelay: `${idx * 0.04}s` }}>
                      <div className='iw-update-header'>
                        <span className='iw-update-author'>{u.user?.name || 'Member'}</span>
                        <span className='iw-update-time'>{u.created_at ? new Date(u.created_at).toLocaleString() : ''}</span>
                      </div>
                      <div className='iw-update-content'>{u.content}</div>

                      {u.proof_url && (
                        <a href={u.proof_url} target='_blank' rel='noreferrer' className='iw-proof-link'>
                          🔗 View Proof{u.proof_type ? ` (${u.proof_type})` : ''}
                        </a>
                      )}

                      {/* Feedback list */}
                      {(u.feedback || []).map(fb => (
                        <div key={fb.id} className='iw-feedback'>
                          <div className='iw-feedback-header'>
                            <span className='iw-feedback-name'>{fb.mentor?.name || 'Reviewer'}</span>
                            {fb.score ? <span className='iw-score-chip'>{fb.score}/10</span> : null}
                          </div>
                          <div className='iw-feedback-comment'>{fb.comment}</div>
                        </div>
                      ))}

                      {/* Mentor feedback form */}
                      {isAdminOrInstructor && (
                        <div className='iw-mentor-form'>
                          <div className='iw-mentor-form-title'>🎓 Add Mentor Feedback</div>
                          <textarea rows={2} placeholder='Your feedback...'
                            value={feedbackForms[u.id]?.comment || ''}
                            onChange={e => setFeedbackForms(p => ({ ...p, [u.id]: { ...(p[u.id] || {}), comment: e.target.value } }))}
                          />
                          <input type='number' min='1' max='10' placeholder='Score 1–10 (optional)'
                            value={feedbackForms[u.id]?.score || ''}
                            onChange={e => setFeedbackForms(p => ({ ...p, [u.id]: { ...(p[u.id] || {}), score: e.target.value } }))}
                          />
                          <button className='iw-feedback-btn' onClick={() => submitFeedback(u.id)}>Submit Feedback</button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default IdeaWorkspace