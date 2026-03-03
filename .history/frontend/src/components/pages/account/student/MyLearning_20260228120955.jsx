import React, { useEffect, useState } from 'react'
import UserSidebar from '../../../common/UserSidebar'
import CourseEnrolled from '../../../common/CourseEnrolled'
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

  /* layouts */
  .ml-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 1.2rem; }
  .ml-list { display: flex; flex-direction: column; gap: 1rem; }

  /* card shell */
  .ml-card-shell {
    background: #fff;
    border-radius: 16px;
    border: 1.5px solid #ede9e1;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(26,22,16,0.05);
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;
  }
  .ml-card-shell:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(26,22,16,0.1); }

  /* status ribbon */
  .ml-ribbon {
    position: absolute;
    top: 12px; right: 12px;
    padding: 0.2rem 0.6rem;
    border-radius: 99px;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    z-index: 2;
  }
  .ml-ribbon.completed  { background: #d4f7e5; color: #1a6b41; }
  .ml-ribbon.inprogress { background: #fff3dc; color: #8a5c00; }
  .ml-ribbon.notstarted { background: #ede9e1; color: #6b5f50; }

  /* progress bar */
  .ml-card-progress { padding: 0 1rem 1rem; }
  .ml-card-progress-label {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: #9a8f7e;
    margin-bottom: 0.3rem;
  }
  .ml-progress-track {
    background: #ede9e1;
    border-radius: 99px;
    height: 6px;
    overflow: hidden;
  }
  .ml-progress-fill {
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg, #c17d3c, #e8a75a);
    transition: width 0.6s ease;
  }
  .ml-progress-fill.full { background: linear-gradient(90deg, #34c17d, #5ae8a7); }

  /* continue button */
  .ml-continue-btn {
    display: block;
    margin: 0 1rem 1rem;
    padding: 0.5rem;
    border-radius: 10px;
    text-align: center;
    font-size: 0.82rem;
    font-weight: 600;
    text-decoration: none;
    background: #1a2744;
    color: #fff;
    transition: background 0.15s;
  }
  .ml-continue-btn:hover { background: #2b3f6e; color: #fff; }
  .ml-continue-btn.completed-btn { background: #e8f8f0; color: #1a6b41; }
  .ml-continue-btn.completed-btn:hover { background: #c8f0dc; }

  /* empty state */
  .ml-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 4rem 2rem;
    background: #fff;
    border-radius: 18px;
    border: 1.5px dashed #ddd9d0;
  }
  .ml-empty-icon { font-size: 3rem; margin-bottom: 1rem; }
  .ml-empty h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    color: #1a1610;
    margin-bottom: 0.5rem;
  }
  .ml-empty p { color: #9a8f7e; font-size: 0.88rem; max-width: 340px; margin: 0 auto 1.5rem; }
  .ml-empty-cta {
    display: inline-block;
    padding: 0.7rem 1.8rem;
    background: #1a2744;
    color: #fff;
    border-radius: 12px;
    text-decoration: none;
    font-size: 0.88rem;
    font-weight: 600;
    transition: background 0.15s;
  }
  .ml-empty-cta:hover { background: #2b3f6e; color: #fff; }

  /* skeleton */
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .ml-skeleton {
    background: linear-gradient(90deg, #ede9e1 25%, #f6f4ef 50%, #ede9e1 75%);
    background-size: 600px 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 16px;
    height: 240px;
  }

  .ml-no-results {
    grid-column: 1 / -1;
    text-align: center;
    padding: 3rem;
    color: #9a8f7e;
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    .ml-page-header h1 { font-size: 1.5rem; }
    .ml-grid { grid-template-columns: 1fr; }
    .ml-summary { gap: 0.75rem; }
  }
`

const getProgress = (e) => e?.progress ?? e?.completion_percentage ?? 0
const getStatus   = (pct) => pct >= 100 ? 'completed' : pct > 0 ? 'inprogress' : 'notstarted'
const getTitle    = (e) => e?.course?.title ?? e?.title ?? 'Course'
const getSlug     = (e) => e?.course?.slug ?? e?.course_id ?? e?.id

const STATUS_LABELS = {
  completed:  '✓ Completed',
  inprogress: '● In Progress',
  notstarted: '○ Not Started',
}

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
                <div className='ml-grid'>
                  {[1,2,3,4,5,6].map(i => <div key={i} className='ml-skeleton' />)}
                </div>
              ) : total === 0 ? (
                <div className='ml-empty'>
                  <div className='ml-empty-icon'>📚</div>
                  {/* <h3>No courses yet</h3> */}
                  <p>You haven't enrolled in any courses. Start exploring and find something you love!</p>
                  <a href='/courses' className='ml-empty-cta'>Browse Courses</a>
                </div>
              ) : filtered.length === 0 ? (
                <div className='ml-no-results'>No courses match your search or filter.</div>
              ) : (
                <div className={`ml-${view}`}>
                  {filtered.map(enrollment => {
                    const pct    = getProgress(enrollment)
                    const status = getStatus(pct)
                    return (
                      <div key={enrollment.id} className='ml-card-shell'>
                        <div className={`ml-ribbon ${status}`}>{STATUS_LABELS[status]}</div>
                        <CourseEnrolled enrollment={enrollment} />
                        {/* <div className='ml-card-progress'>
                          <div className='ml-card-progress-label'>
                            <span>Progress</span>
                            <span>{pct}%</span>
                          </div>
                          <div className='ml-progress-track'>
                            <div
                              className={`ml-progress-fill ${pct >= 100 ? 'full' : ''}`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                        </div> */}
                        <a
                          href={`/account/watch-course/${getSlug(enrollment)}`}
                          className={`ml-continue-btn ${status === 'completed' ? 'completed-btn' : ''}`}
                        >
                          {status === 'completed' ? '🏆 View Certificate' :
                           status === 'inprogress' ? '▶ Continue Learning' :
                           '🚀 Start Course'}
                        </a>
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