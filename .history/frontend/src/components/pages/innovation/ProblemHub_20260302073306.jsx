import React, { useContext, useEffect, useMemo, useState } from 'react'
import Layout from '../../common/Layout'
import toast from 'react-hot-toast'
import { apiUrl, token as configToken } from '../../common/Config'
import { Link } from 'react-router-dom'
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
    --shadow-hover: 0 20px 50px rgba(79,110,247,0.16);
    --font: 'Plus Jakarta Sans', sans-serif;
    --font-serif: 'Fraunces', serif;
  }

  .ph-root {
    background: var(--bg);
    min-height: 100vh;
    font-family: var(--font);
    padding-bottom: 4rem;
    color: var(--text);
    position: relative;
  }

  .ph-blob-wrap { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
  .ph-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.28; }
  .ph-blob-1 { width: 500px; height: 500px; background: radial-gradient(circle,#c7d0ff,#a5b4fc); top: -150px; right: -100px; animation: blob-float 10s ease-in-out infinite alternate; }
  .ph-blob-2 { width: 360px; height: 360px; background: radial-gradient(circle,#ffd5c5,#ffb3a0); bottom: 0; left: -80px; animation: blob-float 14s ease-in-out infinite alternate-reverse; }
  .ph-blob-3 { width: 220px; height: 220px; background: radial-gradient(circle,#b5f0d8,#86efca); top: 40%; left: 40%; animation: blob-float 9s ease-in-out infinite alternate; }
  @keyframes blob-float { from{transform:translate(0,0) scale(1);} to{transform:translate(28px,18px) scale(1.1);} }

  .ph-inner { position: relative; z-index: 1; padding: 1.5rem 0 0; }

  /* Hero */
  .ph-hero {
    background: linear-gradient(135deg,#4f6ef7 0%,#7c5cbf 55%,#a855f7 100%);
    border-radius: 28px;
    padding: 2rem 2.4rem;
    margin-bottom: 1.8rem;
    position: relative; overflow: hidden;
    box-shadow: 0 20px 60px rgba(79,110,247,0.32);
    animation: ph-up 0.6s cubic-bezier(0.22,1,0.36,1) both;
    display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
  }
  .ph-hero::before {
    content: '';
    position: absolute; top: -60%; left: -20%;
    width: 60%; height: 200%;
    background: linear-gradient(105deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.1) 50%,rgba(255,255,255,0) 100%);
    transform: rotate(25deg); pointer-events: none;
  }
  .ph-hero-deco { position: absolute; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.12); pointer-events: none; }
  .ph-hero-deco.d1 { width: 200px; height: 200px; right: -60px; bottom: -60px; }
  .ph-hero-deco.d2 { width: 110px; height: 110px; right: 80px; top: -40px; }
  .ph-hero-left { position: relative; z-index: 1; }
  .ph-hero-title { font-size: 1.5rem; font-weight: 800; color: #fff; margin: 0; letter-spacing: -0.02em; }
  .ph-hero-sub { font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-top: 0.3rem; }
  .ph-post-btn {
    position: relative; z-index: 1;
    font-size: 0.82rem; font-weight: 800; color: var(--blue);
    background: #fff; border: none; border-radius: 14px; padding: 10px 22px;
    cursor: pointer; font-family: var(--font);
    display: inline-flex; align-items: center; gap: 6px;
    transition: opacity 0.2s, transform 0.2s;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  }
  .ph-post-btn:hover { opacity: 0.88; transform: translateY(-2px); }

  /* Controls */
  .ph-controls {
    background: var(--white); border-radius: var(--radius);
    padding: 1.3rem 1.5rem; border: 1.5px solid var(--border);
    box-shadow: var(--shadow); margin-bottom: 1.6rem;
    animation: ph-up 0.5s 0.1s both;
    display: flex; gap: 0.8rem; flex-wrap: wrap; align-items: center;
  }
  .ph-search {
    flex: 1; min-width: 200px;
    background: var(--bg); border: 1.5px solid var(--border);
    border-radius: 12px; padding: 9px 14px;
    font-family: var(--font); font-size: 0.85rem; color: var(--text);
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .ph-search:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(79,110,247,0.1); }
  .ph-search::placeholder { color: var(--text3); }
  .ph-select {
    background: var(--bg); border: 1.5px solid var(--border);
    border-radius: 12px; padding: 9px 14px;
    font-family: var(--font); font-size: 0.85rem; color: var(--text);
    outline: none; cursor: pointer; min-width: 160px;
    transition: border-color 0.2s;
  }
  .ph-select:focus { border-color: var(--blue); }
  .ph-filter-btn {
    font-size: 0.8rem; font-weight: 700; border-radius: 12px; padding: 9px 20px;
    cursor: pointer; border: none; font-family: var(--font);
    background: var(--blue); color: #fff;
    transition: opacity 0.2s, transform 0.2s;
  }
  .ph-filter-btn:hover { opacity: 0.85; transform: translateY(-1px); }
  .ph-total { width: 100%; font-size: 0.73rem; color: var(--text3); border-top: 1px solid var(--border); padding-top: 0.6rem; margin-top: 0.2rem; }
  .ph-total b { color: var(--text2); }

  /* Grid */
  .ph-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(300px,1fr)); gap: 1.2rem; }

  /* Problem Card */
  .ph-card {
    background: var(--white); border-radius: var(--radius);
    border: 1.5px solid var(--border); box-shadow: var(--shadow);
    padding: 1.4rem; display: flex; flex-direction: column; gap: 0.8rem;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s, border-color 0.2s;
    animation: ph-up 0.4s both;
    position: relative; overflow: hidden;
  }
  .ph-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    border-radius: 99px 99px 0 0;
    background: linear-gradient(90deg,var(--blue),#818cf8);
    opacity: 0; transition: opacity 0.2s;
  }
  .ph-card:hover { transform: translateY(-7px) scale(1.01); box-shadow: var(--shadow-hover); border-color: #c7d0ff; }
  .ph-card:hover::before { opacity: 1; }

  .ph-card-top { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
  .ph-cat-pill {
    font-size: 0.65rem; font-weight: 700; padding: 4px 10px; border-radius: 99px;
    background: var(--blue-light); border: 1.5px solid var(--blue-mid); color: var(--blue);
    text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap;
  }
  .ph-status-pill {
    font-size: 0.65rem; font-weight: 700; padding: 4px 10px; border-radius: 99px;
    text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; border: 1.5px solid;
  }
  .ph-status-pill.open   { background: var(--green-light);  border-color: #a7f3d0; color: #065f46; }
  .ph-status-pill.building { background: var(--yellow-light); border-color: #fde68a; color: #92400e; }
  .ph-status-pill.closed { background: #f4f4f5; border-color: #d4d4d8; color: #71717a; }

  .ph-card-title { font-size: 1rem; font-weight: 800; color: var(--text); margin: 0; line-height: 1.3; }
  .ph-card-desc { font-size: 0.8rem; color: var(--text2); line-height: 1.6; margin: 0; flex: 1; }

  .ph-card-footer { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-top: auto; }
  .ph-author { font-size: 0.72rem; color: var(--text3); font-weight: 600; }
  .ph-view-btn {
    font-size: 0.72rem; font-weight: 700; color: var(--blue);
    text-decoration: none; padding: 5px 13px; border-radius: 10px;
    background: var(--blue-light); border: 1.5px solid var(--blue-mid);
    display: inline-flex; align-items: center; gap: 4px;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
  }
  .ph-view-btn:hover { background: var(--blue); color: #fff; border-color: var(--blue); }

  /* Pagination */
  .ph-pagination {
    display: flex; justify-content: center; align-items: center; gap: 0.8rem; margin-top: 2rem;
    animation: ph-up 0.4s 0.2s both;
  }
  .ph-page-btn {
    font-size: 0.78rem; font-weight: 700; border-radius: 12px; padding: 8px 18px;
    cursor: pointer; border: 1.5px solid var(--border);
    background: var(--white); color: var(--text2); font-family: var(--font);
    transition: all 0.2s;
  }
  .ph-page-btn:hover:not(:disabled) { border-color: var(--blue); color: var(--blue); background: var(--blue-light); }
  .ph-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .ph-page-info { font-size: 0.78rem; color: var(--text2); font-weight: 600; }

  /* Empty / Loading */
  .ph-empty {
    text-align: center; padding: 4rem 2rem;
    background: var(--white); border-radius: var(--radius);
    border: 1.5px dashed var(--border); box-shadow: var(--shadow);
  }
  .ph-empty p { color: var(--text2); margin: 0.5rem 0 0; font-size: 0.85rem; }

  .ph-skeleton {
    border-radius: var(--radius); height: 180px;
    background: linear-gradient(90deg,#e8ecff 0%,#f0f4ff 50%,#e8ecff 100%);
    background-size: 700px 100%; animation: shimmer 1.6s infinite;
    border: 1.5px solid var(--border);
  }
  @keyframes shimmer { 0%{background-position:-700px 0;} 100%{background-position:700px 0;} }

  /* Modal */
  .ph-modal-overlay {
    position: fixed; inset: 0; background: rgba(14,18,36,0.6);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999; padding: 16px;
    animation: modal-fade 0.2s ease both;
  }
  @keyframes modal-fade { from{opacity:0;} to{opacity:1;} }
  .ph-modal {
    background: var(--white); border-radius: 28px;
    width: 100%; max-width: 600px;
    border: 1.5px solid var(--border);
    box-shadow: 0 40px 80px rgba(14,18,36,0.3);
    overflow: hidden;
    animation: modal-up 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes modal-up { from{opacity:0;transform:translateY(40px) scale(0.95);} to{opacity:1;transform:translateY(0) scale(1);} }
  .ph-modal-header {
    background: linear-gradient(135deg,#4f6ef7 0%,#7c5cbf 100%);
    padding: 1.4rem 1.8rem;
    display: flex; align-items: center; justify-content: space-between;
    position: relative; overflow: hidden;
  }
  .ph-modal-header::before {
    content: '';
    position: absolute; top: -40%; left: -10%; width: 50%; height: 200%;
    background: linear-gradient(105deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0) 100%);
    transform: rotate(25deg); pointer-events: none;
  }
  .ph-modal-title { font-size: 1.1rem; font-weight: 800; color: #fff; margin: 0; position: relative; z-index: 1; }
  .ph-modal-close {
    width: 32px; height: 32px; border-radius: 10px;
    background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3);
    color: #fff; font-size: 1rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s; position: relative; z-index: 1;
  }
  .ph-modal-close:hover { background: rgba(255,255,255,0.35); }
  .ph-modal-body { padding: 1.6rem 1.8rem; display: flex; flex-direction: column; gap: 1rem; }
  .ph-field label { font-size: 0.72rem; font-weight: 800; color: var(--text2); text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 0.4rem; }
  .ph-field input, .ph-field textarea, .ph-field select {
    width: 100%;
    background: var(--bg); border: 1.5px solid var(--border);
    border-radius: 12px; padding: 10px 14px;
    font-family: var(--font); font-size: 0.88rem; color: var(--text);
    outline: none; resize: vertical;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .ph-field input:focus, .ph-field textarea:focus, .ph-field select:focus {
    border-color: var(--blue); box-shadow: 0 0 0 3px rgba(79,110,247,0.1);
  }
  .ph-field input::placeholder, .ph-field textarea::placeholder { color: var(--text3); }
  .ph-submit-btn {
    background: linear-gradient(135deg,var(--blue),var(--purple));
    color: #fff; border: none; border-radius: 14px; padding: 12px 28px;
    font-family: var(--font); font-size: 0.88rem; font-weight: 800;
    cursor: pointer; transition: opacity 0.2s, transform 0.2s;
    width: 100%; margin-top: 0.4rem;
  }
  .ph-submit-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .ph-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  @keyframes ph-up { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }
  @media (max-width: 600px) { .ph-hero { flex-direction: column; } .ph-controls { flex-direction: column; } }
`

const ProblemHub = () => {
  const { user } = useContext(AuthContext)
  const authToken = useMemo(() => user?.token || user?.user?.token || configToken, [user])

  const [items, setItems] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', category: '', description: '' })
  const [submitting, setSubmitting] = useState(false)

  const fetchProblems = async (page = 1) => {
    try {
      setLoading(true)
      const qs = new URLSearchParams()
      if (search.trim()) qs.set('search', search.trim())
      if (category && category !== 'all') qs.set('category', category)
      qs.set('page', String(page))
      const res = await fetch(`${apiUrl}/problems?${qs.toString()}`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${authToken}` },
      })
      const result = await res.json()
      if (result.status === 200) {
        setItems(result.data?.data || [])
        setMeta({ current_page: result.data?.current_page || 1, last_page: result.data?.last_page || 1, total: result.data?.total || 0 })
      } else toast.error(result.message || 'Failed to load problems')
    } catch (e) {
      console.log(e); toast.error('Server error while loading problems')
    } finally { setLoading(false) }
  }

  const submitProblem = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim()) { toast.error('Title and description are required'); return }
    try {
      setSubmitting(true)
      const res = await fetch(`${apiUrl}/problems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ title: form.title, category: form.category, description: form.description }),
      })
      const result = await res.json()
      if (result.status === 200) {
        toast.success(result.message || 'Problem posted!')
        setShowForm(false)
        setForm({ title: '', category: '', description: '' })
        fetchProblems(1)
      } else if (result.status === 422) toast.error('Validation failed')
      else toast.error(result.message || 'Something went wrong')
    } catch (e) { console.log(e); toast.error('Server error while posting problem') }
    finally { setSubmitting(false) }
  }

  useEffect(() => { if (authToken) fetchProblems(1) }, [authToken])

  const onSearchKeyDown = (e) => { if (e.key === 'Enter') fetchProblems(1) }

  const statusClass = (s) => s === 'open' ? 'open' : s === 'building' ? 'building' : 'closed'

  return (
    <Layout>
      <style>{css}</style>
      <div className='ph-blob-wrap'>
        <div className='ph-blob ph-blob-1' /><div className='ph-blob ph-blob-2' /><div className='ph-blob ph-blob-3' />
      </div>

      <div className='ph-root'>
        <div className='container ph-inner'>

          {/* Hero */}
          <div className='ph-hero'>
            <div className='ph-hero-deco d1' /><div className='ph-hero-deco d2' />
            <div className='ph-hero-left'>
              <div className='ph-hero-title'>💡 Problem Hub</div>
              <div className='ph-hero-sub'>Post real problems · Propose ideas · Build solutions.</div>
            </div>
            <button className='ph-post-btn' onClick={() => setShowForm(true)}>+ Post Problem</button>
          </div>

          {/* Controls */}
          <div className='ph-controls'>
            <input
              className='ph-search'
              placeholder='Search problems... (press Enter)'
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={onSearchKeyDown}
            />
            <select className='ph-select' value={category} onChange={e => setCategory(e.target.value)}>
              <option value='all'>All Categories</option>
              <option value='AI / Automation'>AI / Automation</option>
              <option value='Education'>Education</option>
              <option value='Health'>Health</option>
              <option value='Campus Life'>Campus Life</option>
              <option value='Environment'>Environment</option>
            </select>
            <button className='ph-filter-btn' onClick={() => fetchProblems(1)}>Filter</button>
            {meta && <div className='ph-total'>Showing <b>{items.length}</b> of <b>{meta.total}</b> problems</div>}
          </div>

          {/* Content */}
          {loading ? (
            <div className='ph-grid'>
              {[1,2,3,4,5,6].map(i => <div key={i} className='ph-skeleton' />)}
            </div>
          ) : items.length === 0 ? (
            <div className='ph-empty'>
              <div style={{ fontSize: '2.5rem', opacity: 0.4 }}>💡</div>
              <p>No problems found. Be the first to post one!</p>
            </div>
          ) : (
            <div className='ph-grid'>
              {items.map((p, idx) => (
                <div className='ph-card' key={p.id} style={{ animationDelay: `${idx * 0.04}s` }}>
                  <div className='ph-card-top'>
                    <span className='ph-cat-pill'>{p.category || 'General'}</span>
                    <span className={`ph-status-pill ${statusClass(p.status)}`}>{p.status}</span>
                  </div>
                  <h5 className='ph-card-title'>{p.title}</h5>
                  <p className='ph-card-desc'>
                    {String(p.description || '').slice(0, 120)}{String(p.description || '').length > 120 ? '…' : ''}
                  </p>
                  <div className='ph-card-footer'>
                    <span className='ph-author'>by {p.user?.name || 'Unknown'}</span>
                    <Link to={`/account/innovation/problem/${p.id}`} className='ph-view-btn'>View →</Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className='ph-pagination'>
              <button className='ph-page-btn' disabled={meta.current_page <= 1} onClick={() => fetchProblems(meta.current_page - 1)}>← Prev</button>
              <span className='ph-page-info'>Page {meta.current_page} of {meta.last_page}</span>
              <button className='ph-page-btn' disabled={meta.current_page >= meta.last_page} onClick={() => fetchProblems(meta.current_page + 1)}>Next →</button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className='ph-modal-overlay' onClick={() => setShowForm(false)}>
          <div className='ph-modal' onClick={e => e.stopPropagation()}>
            <div className='ph-modal-header'>
              <h5 className='ph-modal-title'>💡 Post a Problem</h5>
              <button className='ph-modal-close' onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className='ph-modal-body'>
              <div className='ph-field'>
                <label>Title</label>
                <input
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder='Example: Manual attendance wastes class time'
                />
              </div>
              <div className='ph-field'>
                <label>Category</label>
                <input
                  value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  placeholder='Example: AI / Automation'
                />
              </div>
              <div className='ph-field'>
                <label>Description</label>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder='Explain the problem in detail...'
                />
              </div>
              <button className='ph-submit-btn' disabled={submitting} onClick={submitProblem}>
                {submitting ? 'Posting...' : '→ Post Problem'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default ProblemHub