import React, { useEffect, useState } from 'react'
import UserSidebar from '../../../common/UserSidebar'
import Layout from '../../../common/Layout'
import { apiUrl, token } from '../../../common/Config'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Manrope:wght@300;400;500;600;700&display=swap');

  .ml-root {
    background: #0e1117;
    min-height: 100vh;
    font-family: 'Manrope', sans-serif;
    padding-bottom: 4rem;
  }

  /* ── breadcrumb ── */
  .ml-bc {
    padding: 1.4rem 0 0;
    font-size: 0.75rem;
    color: #4a5568;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .ml-bc a { color: #4d8ef0; text-decoration: none; }
  .ml-bc a:hover { color: #7aaff5; }

  /* ── page header ── */
  .ml-header { margin: 1.4rem 0 1.8rem; }
  .ml-header h1 {
    font-family: 'Syne', sans-serif;
    font-size: 2.2rem;
    font-weight: 800;
    color: #ffffff;
    margin: 0 0 0.3rem;
    letter-spacing: -0.02em;
  }
  .ml-header p { color: #6b7280; font-size: 0.88rem; margin: 0; }

  /* ── summary chips ── */
  .ml-summary { display: flex; gap: 0.75rem; margin-bottom: 1.6rem; flex-wrap: wrap; }
  .ml-stat-chip {
    background: #161b27;
    border: 1px solid #1e2d47;
    border-radius: 10px;
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: #94a3b8;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .ml-stat-chip span {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
  }

  /* ── toolbar ── */
  .ml-toolbar { display: flex; gap: 0.75rem; align-items: center; margin-bottom: 1.2rem; flex-wrap: wrap; }
  .ml-search-wrap { position: relative; flex: 1; min-width: 200px; }
  .ml-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #4a5568; pointer-events: none; }
  .ml-search {
    width: 100%;
    padding: 0.6rem 1rem 0.6rem 2.4rem;
    background: #161b27;
    border: 1px solid #1e2d47;
    border-radius: 10px;
    font-family: 'Manrope', sans-serif;
    font-size: 0.85rem;
    color: #e2e8f0;
    outline: none;
    transition: border-color 0.2s;
  }
  .ml-search::placeholder { color: #4a5568; }
  .ml-search:focus { border-color: #4d8ef0; }
  .ml-select {
    padding: 0.6rem 1rem;
    background: #161b27;
    border: 1px solid #1e2d47;
    border-radius: 10px;
    font-family: 'Manrope', sans-serif;
    font-size: 0.82rem;
    color: #94a3b8;
    outline: none;
    cursor: pointer;
  }
  .ml-view-toggle { display: flex; gap: 4px; }
  .ml-vbtn {
    width: 36px; height: 36px;
    border-radius: 8px;
    border: 1px solid #1e2d47;
    background: #161b27;
    color: #4a5568;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.15s;
  }
  .ml-vbtn.active { background: #4d8ef0; border-color: #4d8ef0; color: #fff; }

  /* ── filter pills ── */
  .ml-filters { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.8rem; }
  .ml-pill {
    padding: 0.4rem 1rem;
    border-radius: 99px;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid #1e2d47;
    background: #161b27;
    color: #6b7280;
    transition: all 0.15s;
  }
  .ml-pill:hover { border-color: #4d8ef0; color: #4d8ef0; }
  .ml-pill.active { background: #4d8ef0; border-color: #4d8ef0; color: #fff; }

  /* ══ GRID / LIST LAYOUTS ══ */
  .ml-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.4rem;
  }
  .ml-list { display: flex; flex-direction: column; gap: 1rem; }

  /* ══ COURSE CARD ══ */
  .ml-card {
    background: #13181f;
    border: 1px solid #1a2235;
    border-radius: 18px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.22s cubic-bezier(.25,.8,.25,1), box-shadow 0.22s, border-color 0.22s;
    position: relative;
    text-decoration: none;
  }
  .ml-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 50px rgba(77,142,240,0.12), 0 4px 20px rgba(0,0,0,0.4);
    border-color: #2a3f6a;
  }

  /* list layout overrides */
  .ml-list .ml-card { flex-direction: row; border-radius: 14px; }
  .ml-list .ml-card:hover { transform: translateX(4px); box-shadow: 4px 0 20px rgba(77,142,240,0.1); }
  .ml-list .ml-thumb-wrap { width: 200px; min-width: 200px; aspect-ratio: unset; }

  /* ── thumbnail ── */
  .ml-thumb-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 16/9;
    background: #1a2235;
    overflow: hidden;
    flex-shrink: 0;
  }
  .ml-thumb-wrap img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }
  .ml-card:hover .ml-thumb-wrap img { transform: scale(1.06); }

  .ml-thumb-fallback {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    font-size: 2.8rem;
    min-height: 160px;
  }

  /* play overlay */
  .ml-play-overlay {
    position: absolute; inset: 0;
    background: rgba(10,14,22,0.5);
    display: flex; align-items: center; justify-content: center;
    opacity: 0;
    transition: opacity 0.22s;
  }
  .ml-card:hover .ml-play-overlay { opacity: 1; }
  .ml-play-circle {
    width: 50px; height: 50px;
    border-radius: 50%;
    background: #4d8ef0;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 30px rgba(77,142,240,0.6);
  }

  /* status badge */
  .ml-badge {
    position: absolute;
    top: 10px; left: 10px;
    padding: 0.22rem 0.7rem;
    border-radius: 99px;
    font-size: 0.67rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    backdrop-filter: blur(8px);
  }
  .ml-badge.completed  { background: rgba(52,193,125,0.18); color: #34c17d; border: 1px solid rgba(52,193,125,0.35); }
  .ml-badge.inprogress { background: rgba(77,142,240,0.18); color: #7aaff5; border: 1px solid rgba(77,142,240,0.35); }
  .ml-badge.notstarted { background: rgba(255,255,255,0.07); color: #94a3b8; border: 1px solid rgba(255,255,255,0.12); }

  /* ── card body ── */
  .ml-card-body {
    padding: 1.1rem 1.2rem 1.3rem;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    flex: 1;
  }
  .ml-cat {
    font-size: 0.67rem;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: #4d8ef0;
  }
  .ml-title {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #e2e8f0;
    line-height: 1.35;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .ml-instructor {
    font-size: 0.74rem;
    color: #4a5568;
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  /* progress */
  .ml-prog { margin-top: 0.3rem; }
  .ml-prog-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.72rem;
    color: #4a5568;
    font-weight: 600;
    margin-bottom: 0.35rem;
  }
  .ml-pct        { color: #4d8ef0; }
  .ml-pct.done   { color: #34c17d; }
  .ml-track { height: 5px; background: #1a2235; border-radius: 99px; overflow: hidden; }
  .ml-fill {
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg, #3b7de8, #7aaff5);
    transition: width 0.7s cubic-bezier(.25,.8,.25,1);
  }
  .ml-fill.done { background: linear-gradient(90deg, #27ae7a, #56d4a0); }

  /* cta button */
  .ml-cta {
    display: flex; align-items: center; justify-content: center; gap: 0.4rem;
    margin-top: 0.5rem;
    padding: 0.6rem;
    border-radius: 10px;
    font-size: 0.8rem;
    font-weight: 700;
    text-decoration: none;
    letter-spacing: 0.02em;
    transition: all 0.15s;
  }
  .ml-cta.start    { background: #1e2d47; color: #7aaff5; }
  .ml-cta.start:hover { background: #4d8ef0; color: #fff; }
  .ml-cta.cont     { background: #4d8ef0; color: #fff; }
  .ml-cta.cont:hover { background: #3b7de8; color: #fff; }
  .ml-cta.done     { background: rgba(52,193,125,0.1); color: #34c17d; border: 1px solid rgba(52,193,125,0.25); }
  .ml-cta.done:hover { background: rgba(52,193,125,0.2); }

  /* ── empty / no-results ── */
  .ml-empty {
    grid-column: 1/-1;
    text-align: center;
    padding: 5rem 2rem;
    background: #13181f;
    border: 1px dashed #1a2235;
    border-radius: 20px;
  }
  .ml-empty-icon { font-size: 3.5rem; margin-bottom: 1rem; }
  .ml-empty h3 {
    font-family: 'Syne', sans-serif;
    font-size: 1.5rem;
    color: #e2e8f0;
    margin-bottom: 0.5rem;
  }
  .ml-empty p { color: #4a5568; font-size: 0.88rem; max-width: 320px; margin: 0 auto 1.5rem; line-height: 1.6; }
  .ml-empty-btn {
    display: inline-block;
    padding: 0.75rem 2rem;
    background: #4d8ef0;
    color: #fff;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 700;
    font-size: 0.88rem;
    transition: background 0.15s;
  }
  .ml-empty-btn:hover { background: #3b7de8; color: #fff; }
  .ml-no-results {
    grid-column: 1/-1;
    text-align: center;
    padding: 3rem;
    color: #4a5568;
    font-size: 0.9rem;
  }

  /* ── skeleton ── */
  @keyframes shimmer {
    0%   { background-position: -700px 0; }
    100% { background-position:  700px 0; }
  }
  .ml-skel {
    background: linear-gradient(90deg, #13181f 25%, #1a2235 50%, #13181f 75%);
    background-size: 700px 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 18px;
    height: 300px;
  }

  @media (max-width: 768px) {
    .ml-header h1 { font-size: 1.6rem; }
    .ml-grid { grid-template-columns: 1fr; }
    .ml-list .ml-thumb-wrap { width: 130px; min-width: 130px; }
  }
`

/* ── Gradient fallbacks + emojis ── */
const GRADIENTS = [
  ['#0f1f3d','#3b7de8'], ['#0d2616','#27ae7a'], ['#1a0d2e','#8b5cf6'],
  ['#2e0d0d','#e85b3b'], ['#0d1e2e','#06b6d4'], ['#2e2a0d','#d97706'],
]
const EMOJIS = ['⚛️','🎨','🐍','📐','📊','🔬','💡','🌐','🎯','📱']

/* ── helpers ── */
const getProgress   = (e) => e?.progress ?? e?.completion_percentage ?? 0
const getStatus     = (pct) => pct >= 100 ? 'completed' : pct > 0 ? 'inprogress' : 'notstarted'
const getTitle      = (e) => e?.course?.title ?? e?.title ?? 'Course'
const getCategory   = (e) => e?.course?.category?.title ?? e?.course?.category ?? ''
const getInstructor = (e) => e?.course?.instructor?.name ?? e?.course?.user?.name ?? ''
const getImage      = (e) => e?.course?.image ?? e?.course?.thumbnail ?? null
const getSlug       = (e) => e?.course?.slug ?? e?.course_id ?? e?.id

const STATUS_LABEL = {
  completed:  '✓ Completed',
  inprogress: '● In Progress',
  notstarted: '○ Not Started',
}

/* ── CourseCard ── */
const CourseCard = ({ enrollment }) => {
  const pct        = getProgress(enrollment)
  const status     = getStatus(pct)
  const title      = getTitle(enrollment)
  const image      = getImage(enrollment)
  const category   = getCategory(enrollment)
  const instructor = getInstructor(enrollment)
  const slug       = getSlug(enrollment)
  const gi         = (enrollment.id ?? 0) % GRADIENTS.length
  const [g1, g2]  = GRADIENTS[gi]
  const emoji      = EMOJIS[(enrollment.id ?? 0) % EMOJIS.length]

  const ctaClass = status === 'completed' ? 'done' : status === 'inprogress' ? 'cont' : 'start'
  const ctaText  = status === 'completed' ? '🏆 View Certificate' : status === 'inprogress' ? '▶ Continue Learning' : '🚀 Start Course'

  return (
    <div className='ml-card'>

      {/* Thumbnail */}
      <div className='ml-thumb-wrap'>
        {image
          ? <img src={image} alt={title} loading='lazy' />
          : (
            <div className='ml-thumb-fallback' style={{ background: `linear-gradient(135deg, ${g1} 0%, ${g2} 100%)` }}>
              {emoji}
            </div>
          )
        }

        {/* Play hover overlay */}
        <div className='ml-play-overlay'>
          <div className='ml-play-circle'>
            <svg width='18' height='18' viewBox='0 0 24 24' fill='white' style={{ marginLeft: 3 }}>
              <path d='M8 5v14l11-7z'/>
            </svg>
          </div>
        </div>

        {/* Status badge */}
        <div className={`ml-badge ${status}`}>{STATUS_LABEL[status]}</div>
      </div>

      {/* Card body */}
      <div className='ml-card-body'>
        {category && <div className='ml-cat'>{category}</div>}

        <h3 className='ml-title'>{title}</h3>

        {instructor && (
          <div className='ml-instructor'>
            <svg width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
              <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/>
            </svg>
            {instructor}
          </div>
        )}

        {/* Progress */}
        <div className='ml-prog'>
          <div className='ml-prog-row'>
            <span>Progress</span>
            <span className={`ml-pct ${status === 'completed' ? 'done' : ''}`}>{pct}%</span>
          </div>
          <div className='ml-track'>
            <div
              className={`ml-fill ${status === 'completed' ? 'done' : ''}`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <a href={`/account/course/${slug}`} className={`ml-cta ${ctaClass}`}>
          {ctaText}
        </a>
      </div>
    </div>
  )
}

/* ── Main Page ── */
const MyLearning = () => {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [filter, setFilter]           = useState('all')
  const [sort, setSort]               = useState('recent')
  const [view, setView]               = useState('grid')

  useEffect(() => {
    const fetch_ = async () => {
      try {
        setLoading(true)
        const res    = await fetch(`${apiUrl}/enrollments`, {
          method: 'GET',
          headers: { 'Content-type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
        })
        const result = await res.json()
        if (result.status === 200) setEnrollments(result.data)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetch_()
  }, [])

  const total      = enrollments.length
  const completed  = enrollments.filter(e => getProgress(e) >= 100).length
  const inProgress = enrollments.filter(e => getProgress(e) > 0 && getProgress(e) < 100).length
  const notStarted = total - completed - inProgress

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
    { key: 'all',        label: `All  ${total}`          },
    { key: 'inprogress', label: `In Progress  ${inProgress}` },
    { key: 'completed',  label: `Completed  ${completed}` },
    { key: 'notstarted', label: `Not Started  ${notStarted}` },
  ]

  return (
    <Layout>
      <style>{css}</style>
      <div className='ml-root'>
        <div className='container'>

          {/* Breadcrumb */}
          <nav className='ml-bc'>
            <a href='/account/dashboard'>Account</a>
            <span className='mx-2'>›</span>
            <span style={{ color: '#94a3b8' }}>My Learning</span>
          </nav>

          <div className='row'>
            <div className='col-lg-3 account-sidebar' style={{ marginTop: '2rem' }}>
              <UserSidebar />
            </div>

            <div className='col-lg-9 mt-4 mt-lg-0'>

              {/* Header */}
              <div className='ml-header'>
                <h1>My Learning</h1>
                <p>{total} course{total !== 1 ? 's' : ''} enrolled</p>
              </div>

              {/* Stat chips */}
              {!loading && total > 0 && (
                <div className='ml-summary'>
                  <div className='ml-stat-chip'><span>{inProgress}</span> In Progress</div>
                  <div className='ml-stat-chip'><span>{completed}</span> Completed</div>
                  <div className='ml-stat-chip'><span>{notStarted}</span> Not Started</div>
                </div>
              )}

              {/* Toolbar */}
              {!loading && total > 0 && (
                <>
                  <div className='ml-toolbar'>
                    <div className='ml-search-wrap'>
                      <span className='ml-search-icon'>
                        <svg width='14' height='14' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                          <circle cx='11' cy='11' r='8'/><path d='M21 21l-4.35-4.35' strokeLinecap='round'/>
                        </svg>
                      </span>
                      <input
                        className='ml-search'
                        placeholder='Search your courses…'
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                      />
                    </div>
                    <select className='ml-select' value={sort} onChange={e => setSort(e.target.value)}>
                      <option value='recent'>Most Recent</option>
                      <option value='az'>A → Z</option>
                      <option value='progress'>By Progress</option>
                    </select>
                    <div className='ml-view-toggle'>
                      <button className={`ml-vbtn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')} title='Grid view'>⊞</button>
                      <button className={`ml-vbtn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')} title='List view'>☰</button>
                    </div>
                  </div>

                  <div className='ml-filters'>
                    {FILTERS.map(f => (
                      <button key={f.key} className={`ml-pill ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Course cards */}
              {loading ? (
                <div className='ml-grid'>
                  {[1,2,3,4,5,6].map(i => <div key={i} className='ml-skel' />)}
                </div>
              ) : total === 0 ? (
                <div className='ml-grid'>
                  <div className='ml-empty'>
                    <div className='ml-empty-icon'>🎓</div>
                    <h3>No courses yet</h3>
                    <p>You haven't enrolled in any courses. Start your learning journey today!</p>
                    <a href='/courses' className='ml-empty-btn'>Browse Courses</a>
                  </div>
                </div>
              ) : filtered.length === 0 ? (
                <div className='ml-grid'><div className='ml-no-results'>No courses match your search.</div></div>
              ) : (
                <div className={`ml-${view}`}>
                  {filtered.map(enrollment => (
                    <CourseCard key={enrollment.id} enrollment={enrollment} />
                  ))}
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