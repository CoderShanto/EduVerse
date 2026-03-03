import React, { useEffect, useState } from 'react'
import UserSidebar from '../../../common/UserSidebar'
import Layout from '../../../common/Layout'
import { apiUrl, token } from '../../../common/Config'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .ml-root {
    background: #f6f4ef;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    padding-bottom: 3rem;
  }

  /* breadcrumb */
  .ml-breadcrumb { font-size: 0.78rem; color: #9a8f7e; letter-spacing: 0.04em; padding: 1.4rem 0 0; }
  .ml-breadcrumb a { color: #c17d3c; text-decoration: none; }
  .ml-breadcrumb a:hover { text-decoration: underline; }

  /* page header */
  .ml-page-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin: 1.2rem 0 1.8rem;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .ml-page-header h1 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    color: #1a1610;
    margin: 0;
    line-height: 1.2;
  }
  .ml-page-header p { color: #7a6f60; font-size: 0.85rem; margin: 0.3rem 0 0; }

  /* search + filter bar */
  .ml-toolbar {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 1.6rem;
  }
  .ml-search-wrap {
    position: relative;
    flex: 1;
    min-width: 200px;
  }
  .ml-search-wrap svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #9a8f7e;
    pointer-events: none;
  }
  .ml-search {
    width: 100%;
    padding: 0.55rem 1rem 0.55rem 2.4rem;
    border: 1.5px solid #ddd9d0;
    border-radius: 10px;
    background: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    color: #1a1610;
    outline: none;
    transition: border-color 0.2s;
  }
  .ml-search:focus { border-color: #c17d3c; }

  .ml-filter-btn {
    padding: 0.55rem 1.1rem;
    border-radius: 10px;
    border: 1.5px solid #ddd9d0;
    background: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 500;
    color: #4a3f30;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .ml-filter-btn:hover,
  .ml-filter-btn.active {
    background: #1a2744;
    color: #fff;
    border-color: #1a2744;
  }

  .ml-sort {
    padding: 0.55rem 1rem;
    border-radius: 10px;
    border: 1.5px solid #ddd9d0;
    background: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    color: #4a3f30;
    outline: none;
    cursor: pointer;
  }

  /* summary strip */
  .ml-summary {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1.6rem;
    flex-wrap: wrap;
  }
  .ml-summary-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #fff;
    border: 1.5px solid #ede9e1;
    border-radius: 10px;
    padding: 0.55rem 1rem;
    font-size: 0.82rem;
    color: #4a3f30;
    font-weight: 500;
  }
  .ml-summary-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* view toggle */
  .ml-view-toggle {
    display: flex;
    gap: 4px;
    margin-left: auto;
  }
  .ml-view-btn {
    width: 34px; height: 34px;
    border-radius: 8px;
    border: 1.5px solid #ddd9d0;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: #9a8f7e;
    font-size: 1rem;
    transition: all 0.15s;
  }
  .ml-view-btn.active { background: #1a2744; border-color: #1a2744; color: #fff; }

  /* ══ LAYOUTS ══ */
  .ml-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.6rem; }
  .ml-list  { display: flex; flex-direction: column; gap: 1.2rem; }

  /* ══ CARD SHELL ══ */
  .ml-card-shell {
    background: #fff;
    border-radius: 20px;
    border: 1.5px solid #ede9e1;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(26,22,16,0.06);
    transition: transform 0.25s cubic-bezier(.25,.8,.25,1), box-shadow 0.25s;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  .ml-card-shell:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 40px rgba(26,22,16,0.13);
    border-color: #d4c9b8;
  }

  /* list layout */
  .ml-list .ml-card-shell { flex-direction: row; border-radius: 16px; }
  .ml-list .ml-card-shell:hover { transform: translateX(4px); }
  .ml-list .ml-card-thumb { width: 220px; min-width: 220px; aspect-ratio: unset; min-height: 180px; }
  .ml-list .ml-card-body  { padding: 1.4rem 1.4rem 1.2rem; }

  /* ── thumbnail ── */
  .ml-card-thumb {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    background: #e8e2d8;
    overflow: hidden;
    flex-shrink: 0;
  }
  .ml-card-thumb img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.45s ease;
  }
  .ml-card-shell:hover .ml-card-thumb img { transform: scale(1.07); }

  /* fallback gradient thumb */
  .ml-thumb-fallback {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    font-size: 3.2rem;
  }

  /* play hover overlay */
  .ml-thumb-overlay {
    position: absolute; inset: 0;
    background: rgba(26,22,16,0.35);
    display: flex; align-items: center; justify-content: center;
    opacity: 0;
    transition: opacity 0.25s;
  }
  .ml-card-shell:hover .ml-thumb-overlay { opacity: 1; }
  .ml-play-btn {
    width: 52px; height: 52px;
    border-radius: 50%;
    background: rgba(255,255,255,0.95);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    transition: transform 0.2s;
  }
  .ml-card-shell:hover .ml-play-btn { transform: scale(1.1); }
  .ml-play-btn svg { margin-left: 3px; }

  /* status badge on thumb */
  .ml-badge {
    position: absolute;
    top: 12px; left: 12px;
    padding: 0.28rem 0.75rem;
    border-radius: 99px;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  .ml-badge.completed  { background: rgba(212,247,229,0.92); color: #1a6b41; }
  .ml-badge.inprogress { background: rgba(255,243,220,0.92); color: #8a5c00; }
  .ml-badge.notstarted { background: rgba(237,233,225,0.92); color: #6b5f50; }

  /* ── card body ── */
  .ml-card-body {
    padding: 1.2rem 1.3rem 0.8rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }
  .ml-card-category {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #c17d3c;
  }
  .ml-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem;
    font-weight: 700;
    color: #1a1610;
    line-height: 1.35;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .ml-card-instructor {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.75rem;
    color: #9a8f7e;
  }
  .ml-card-instructor svg { flex-shrink: 0; }

  /* ── progress ── */
  .ml-card-progress { padding: 0.4rem 1.3rem 0; }
  .ml-progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.4rem;
  }
  .ml-progress-label { font-size: 0.72rem; color: #9a8f7e; font-weight: 600; }
  .ml-progress-pct   { font-size: 0.78rem; font-weight: 700; color: #c17d3c; }
  .ml-progress-pct.done { color: #1a8c52; }
  .ml-progress-track {
    background: #ede9e1;
    border-radius: 99px;
    height: 7px;
    overflow: hidden;
  }
  .ml-progress-fill {
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg, #c17d3c, #e8a75a);
    transition: width 0.7s cubic-bezier(.25,.8,.25,1);
    position: relative;
  }
  .ml-progress-fill::after {
    content: '';
    position: absolute;
    right: 0; top: 0; bottom: 0;
    width: 6px;
    border-radius: 99px;
    background: rgba(255,255,255,0.5);
  }
  .ml-progress-fill.full { background: linear-gradient(90deg, #1a8c52, #34c17d); }
  .ml-progress-fill.full::after { display: none; }

  /* ── CTA button ── */
  .ml-cta-wrap { padding: 0.9rem 1.3rem 1.1rem; margin-top: auto; }
  .ml-continue-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.65rem 1rem;
    border-radius: 12px;
    text-align: center;
    font-size: 0.83rem;
    font-weight: 700;
    text-decoration: none;
    letter-spacing: 0.02em;
    transition: all 0.18s;
  }
  .ml-continue-btn.start    { background: #f0ece5; color: #4a3f30; }
  .ml-continue-btn.start:hover { background: #1a2744; color: #fff; }
  .ml-continue-btn.cont     { background: #1a2744; color: #fff; }
  .ml-continue-btn.cont:hover { background: #2b3f6e; color: #fff; }
  .ml-continue-btn.done     { background: #e8f8f0; color: #1a6b41; }
  .ml-continue-btn.done:hover { background: #1a6b41; color: #fff; }

  /* ══ EMPTY STATE ══ */
  .ml-empty {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 5rem 2rem;
    background: #fff;
    border-radius: 24px;
    border: 2px dashed #ddd9d0;
  }
  .ml-empty-illustration {
    width: 140px; height: 140px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f0ece5 0%, #e8ddd0 100%);
    display: flex; align-items: center; justify-content: center;
    font-size: 4rem;
    margin-bottom: 1.8rem;
    box-shadow: 0 8px 32px rgba(193,125,60,0.12);
  }
  .ml-empty h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    color: #1a1610;
    margin-bottom: 0.6rem;
  }
  .ml-empty p {
    color: #9a8f7e;
    font-size: 0.9rem;
    max-width: 360px;
    margin: 0 auto 2rem;
    line-height: 1.65;
  }
  .ml-empty-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.8rem 2.2rem;
    background: #1a2744;
    color: #fff;
    border-radius: 14px;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 700;
    transition: all 0.18s;
    box-shadow: 0 4px 16px rgba(26,39,68,0.2);
  }
  .ml-empty-cta:hover { background: #2b3f6e; color: #fff; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(26,39,68,0.25); }
  .ml-empty-features {
    display: flex;
    gap: 1rem;
    margin-top: 2.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  .ml-empty-feature {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.78rem;
    color: #9a8f7e;
    background: #f6f4ef;
    padding: 0.4rem 0.8rem;
    border-radius: 99px;
  }

  /* ══ NO RESULTS ══ */
  .ml-no-results {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 4rem 2rem;
    text-align: center;
  }
  .ml-no-results-icon {
    width: 80px; height: 80px;
    border-radius: 50%;
    background: #f0ece5;
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem;
    margin-bottom: 1.2rem;
  }
  .ml-no-results h4 {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    color: #1a1610;
    margin-bottom: 0.4rem;
  }
  .ml-no-results p { color: #9a8f7e; font-size: 0.85rem; margin: 0; }
  .ml-no-results button {
    margin-top: 1rem;
    padding: 0.5rem 1.4rem;
    border-radius: 10px;
    border: 1.5px solid #ddd9d0;
    background: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
    color: #4a3f30;
    cursor: pointer;
    transition: all 0.15s;
  }
  .ml-no-results button:hover { background: #1a2744; color: #fff; border-color: #1a2744; }

  /* ══ SKELETON ══ */
  @keyframes shimmer {
    0%   { background-position: -700px 0; }
    100% { background-position:  700px 0; }
  }
  .ml-skeleton {
    border-radius: 20px;
    overflow: hidden;
    background: #fff;
    border: 1.5px solid #ede9e1;
    box-shadow: 0 4px 16px rgba(26,22,16,0.04);
  }
  .ml-skel-thumb {
    width: 100%;
    aspect-ratio: 16/9;
    background: linear-gradient(90deg, #ede9e1 25%, #f6f4ef 50%, #ede9e1 75%);
    background-size: 700px 100%;
    animation: shimmer 1.5s infinite;
  }
  .ml-skel-body { padding: 1.2rem 1.3rem; display: flex; flex-direction: column; gap: 0.7rem; }
  .ml-skel-line {
    border-radius: 6px;
    background: linear-gradient(90deg, #ede9e1 25%, #f6f4ef 50%, #ede9e1 75%);
    background-size: 700px 100%;
    animation: shimmer 1.5s infinite;
  }

  @media (max-width: 768px) {
    .ml-page-header h1 { font-size: 1.5rem; }
    .ml-grid { grid-template-columns: 1fr; }
    .ml-summary { gap: 0.75rem; }
    .ml-list .ml-card-shell { flex-direction: column; }
    .ml-list .ml-card-thumb { width: 100%; min-height: unset; }
  }
`

const getProgress   = (e) => e?.progress ?? e?.completion_percentage ?? 0
const getStatus     = (pct) => pct >= 100 ? 'completed' : pct > 0 ? 'inprogress' : 'notstarted'
const getTitle      = (e) => e?.course?.title ?? e?.title ?? 'Course'
const getSlug       = (e) => e?.course?.slug ?? e?.course_id ?? e?.id
const getImage      = (e) => e?.course?.image ?? e?.course?.thumbnail ?? null
const getCategory   = (e) => e?.course?.category?.title ?? e?.course?.category ?? ''
const getInstructor = (e) => e?.course?.instructor?.name ?? e?.course?.user?.name ?? ''

const STATUS_LABELS = {
  completed:  '✓ Completed',
  inprogress: '● In Progress',
  notstarted: '○ Not Started',
}

const GRADIENTS = [
  ['#f5e6d3','#e8c49a'], ['#d3e8f5','#9ac4e8'],
  ['#d3f5e0','#9ae8b8'], ['#f5d3e8','#e89ac4'],
  ['#e8d3f5','#c49ae8'], ['#f5f0d3','#e8d89a'],
]
const EMOJIS = ['📘','🎨','💻','📐','📊','🔬','💡','🌐','🎯','📱']

const MyLearning = () => {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [filter, setFilter]           = useState('all')
  const [sort, setSort]               = useState('recent')
  const [view, setView]               = useState('grid')

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true)
        const res    = await fetch(`${apiUrl}/enrollments`, {
          method: 'GET',
          headers: { 'Content-type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
        })
        const result = await res.json()
        if (result.status === 200) setEnrollments(result.data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchEnrollments()
  }, [])

  const total      = enrollments.length
  const completed  = enrollments.filter(e => getProgress(e) >= 100).length
  const inProgress = enrollments.filter(e => getProgress(e) > 0 && getProgress(e) < 100).length

  const filtered = enrollments
    .filter(e => {
      if (!getTitle(e).toLowerCase().includes(search.toLowerCase())) return false
      if (filter === 'all') return true
      return getStatus(getProgress(e)) === filter
    })
    .sort((a, b) => {
      if (sort === 'az')       return getTitle(a).localeCompare(getTitle(b))
      if (sort === 'progress') return getProgress(b) - getProgress(a)
      return 0
    })

  const FILTERS = [
    { key: 'all',        label: `All (${total})` },
    { key: 'inprogress', label: `In Progress (${inProgress})` },
    { key: 'completed',  label: `Completed (${completed})` },
    { key: 'notstarted', label: 'Not Started' },
  ]

  return (
    <Layout>
      <style>{css}</style>
      <div className='ml-root'>
        <div className='container'>

          <nav className='ml-breadcrumb'>
            <a href='/account/dashboard'>Account</a>
            <span className='mx-2'>›</span>
            <span style={{ color: '#1a1610' }}>My Learning</span>
          </nav>

          <div className='row'>
            <div className='col-lg-3 account-sidebar'>
              <UserSidebar />
            </div>

            <div className='col-lg-9 mt-4 mt-lg-0'>

              <div className='ml-page-header'>
                <div>
                  <h1>My Learning</h1>
                  <p>{total} course{total !== 1 ? 's' : ''} enrolled</p>
                </div>
              </div>

              {/* Summary strip */}
              {!loading && total > 0 && (
                <div className='ml-summary'>
                  <div className='ml-summary-item'>
                    <div className='ml-summary-dot' style={{ background: '#c17d3c' }} />
                    {inProgress} In Progress
                  </div>
                  <div className='ml-summary-item'>
                    <div className='ml-summary-dot' style={{ background: '#34c17d' }} />
                    {completed} Completed
                  </div>
                  <div className='ml-summary-item'>
                    <div className='ml-summary-dot' style={{ background: '#ede9e1', border: '1px solid #ccc' }} />
                    {total - inProgress - completed} Not Started
                  </div>
                </div>
              )}

              {/* Toolbar */}
              {!loading && total > 0 && (
                <div className='ml-toolbar'>
                  <div className='ml-search-wrap'>
                    <svg width='15' height='15' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <circle cx='11' cy='11' r='8' strokeWidth='2'/>
                      <path d='M21 21l-4.35-4.35' strokeWidth='2' strokeLinecap='round'/>
                    </svg>
                    <input
                      className='ml-search'
                      placeholder='Search your courses…'
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                  <select className='ml-sort' value={sort} onChange={e => setSort(e.target.value)}>
                    <option value='recent'>Most Recent</option>
                    <option value='az'>A → Z</option>
                    <option value='progress'>By Progress</option>
                  </select>
                  <div className='ml-view-toggle'>
                    <button className={`ml-view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')} title='Grid'>⊞</button>
                    <button className={`ml-view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')} title='List'>☰</button>
                  </div>
                </div>
              )}

              {/* Filter pills */}
              {!loading && total > 0 && (
                <div className='d-flex flex-wrap gap-2 mb-4'>
                  {FILTERS.map(f => (
                    <button
                      key={f.key}
                      className={`ml-filter-btn ${filter === f.key ? 'active' : ''}`}
                      onClick={() => setFilter(f.key)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Content */}
              {loading ? (
                /* ── Skeleton ── */
                <div className='ml-grid'>
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className='ml-skeleton'>
                      <div className='ml-skel-thumb' />
                      <div className='ml-skel-body'>
                        <div className='ml-skel-line' style={{ height: 10, width: '40%' }} />
                        <div className='ml-skel-line' style={{ height: 16, width: '90%' }} />
                        <div className='ml-skel-line' style={{ height: 16, width: '70%' }} />
                        <div className='ml-skel-line' style={{ height: 10, width: '55%', marginTop: 4 }} />
                        <div className='ml-skel-line' style={{ height: 7, width: '100%' }} />
                        <div className='ml-skel-line' style={{ height: 38, width: '100%', marginTop: 8, borderRadius: 12 }} />
                      </div>
                    </div>
                  ))}
                </div>

              ) : total === 0 ? (
                /* ── Empty state ── */
                <div className='ml-grid'>
                  <div className='ml-empty'>
                    <div className='ml-empty-illustration'>📚</div>
                    <h3>Your learning journey starts here</h3>
                    <p>You haven't enrolled in any courses yet. Explore thousands of courses and start building skills that matter.</p>
                    <a href='/courses' className='ml-empty-cta'>
                      <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'>
                        <path d='M12 5v14M5 12l7 7 7-7' strokeLinecap='round' strokeLinejoin='round'/>
                      </svg>
                      Browse All Courses
                    </a>
                    <div className='ml-empty-features'>
                      <span className='ml-empty-feature'>🎓 Expert instructors</span>
                      <span className='ml-empty-feature'>📜 Certificates</span>
                      <span className='ml-empty-feature'>⏱ Learn at your pace</span>
                    </div>
                  </div>
                </div>

              ) : filtered.length === 0 ? (
                /* ── No results ── */
                <div className='ml-grid'>
                  <div className='ml-no-results'>
                    <div className='ml-no-results-icon'>🔍</div>
                    <h4>No courses found</h4>
                    <p>Nothing matched "{search || filter}". Try a different search or clear the filter.</p>
                    <button onClick={() => { setSearch(''); setFilter('all') }}>Clear filters</button>
                  </div>
                </div>

              ) : (
                /* ── Course cards ── */
                <div className={`ml-${view}`}>
                  {filtered.map((enrollment, idx) => {
                    const pct        = getProgress(enrollment)
                    const status     = getStatus(pct)
                    const image      = getImage(enrollment)
                    const category   = getCategory(enrollment)
                    const instructor = getInstructor(enrollment)
                    const title      = getTitle(enrollment)
                    const slug       = getSlug(enrollment)
                    const gi         = idx % GRADIENTS.length
                    const [g1, g2]  = GRADIENTS[gi]
                    const emoji      = EMOJIS[idx % EMOJIS.length]
                    const ctaClass   = status === 'completed' ? 'done' : status === 'inprogress' ? 'cont' : 'start'
                    const ctaText    = status === 'completed' ? '🏆 View Certificate' : status === 'inprogress' ? '▶ Continue Learning' : '🚀 Start Course'

                    return (
                      <div key={enrollment.id} className='ml-card-shell'>

                        {/* Thumbnail */}
                        <div className='ml-card-thumb'>
                          {image
                            ? <img src={image} alt={title} loading='lazy' />
                            : (
                              <div
                                className='ml-thumb-fallback'
                                style={{ background: `linear-gradient(135deg, ${g1} 0%, ${g2} 100%)` }}
                              >
                                {emoji}
                              </div>
                            )
                          }
                          {/* Hover play overlay */}
                          <div className='ml-thumb-overlay'>
                            <div className='ml-play-btn'>
                              <svg width='20' height='20' viewBox='0 0 24 24' fill='#1a2744' style={{ marginLeft: 3 }}>
                                <path d='M8 5v14l11-7z'/>
                              </svg>
                            </div>
                          </div>
                          {/* Status badge */}
                          <div className={`ml-badge ${status}`}>{STATUS_LABELS[status]}</div>
                        </div>

                        {/* Body */}
                        <div className='ml-card-body'>
                          {category && <div className='ml-card-category'>{category}</div>}
                          <h3 className='ml-card-title'>{title}</h3>
                          {instructor && (
                            <div className='ml-card-instructor'>
                              <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                                <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/>
                              </svg>
                              {instructor}
                            </div>
                          )}
                        </div>

                        {/* Progress */}
                        <div className='ml-card-progress'>
                          <div className='ml-progress-header'>
                            <span className='ml-progress-label'>Progress</span>
                            <span className={`ml-progress-pct ${status === 'completed' ? 'done' : ''}`}>{pct}%</span>
                          </div>
                          <div className='ml-progress-track'>
                            <div
                              className={`ml-progress-fill ${status === 'completed' ? 'full' : ''}`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* CTA */}
                        <div className='ml-cta-wrap'>
                          <a href={`/account/course/${slug}`} className={`ml-continue-btn ${ctaClass}`}>
                            {ctaText}
                          </a>
                        </div>

                      </div>
                    )
                  })}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MyLearning