import React, { useEffect, useState, useRef } from 'react'
import Course from '../common/Course'
import Layout from '../common/Layout'
import { apiUrl } from '../common/Config'
import { Link, useSearchParams } from 'react-router-dom'
import Loading from '../common/Loading'
import NotFound from '../common/NotFound'

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

  .crs-root {
    background: var(--bg);
    min-height: 100vh;
    font-family: var(--font);
    padding-bottom: 5rem;
    color: var(--text);
    position: relative;
  }

  /* Blobs */
  .crs-blob-wrap { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
  .crs-blob { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.22; }
  .crs-blob-1 { width: 600px; height: 600px; background: radial-gradient(circle,#c7d0ff,#a5b4fc); top: -200px; right: -150px; animation: blob-float 12s ease-in-out infinite alternate; }
  .crs-blob-2 { width: 400px; height: 400px; background: radial-gradient(circle,#ffd5c5,#ffb3a0); bottom: 0; left: -100px; animation: blob-float 14s ease-in-out infinite alternate-reverse; }
  .crs-blob-3 { width: 280px; height: 280px; background: radial-gradient(circle,#b5f0d8,#86efca); top: 50%; left: 35%; animation: blob-float 10s ease-in-out infinite alternate; }
  @keyframes blob-float { from{transform:translate(0,0) scale(1);} to{transform:translate(28px,18px) scale(1.1);} }

  .crs-inner { position: relative; z-index: 1; padding-top: 1.5rem; }

  /* Hero banner */
  .crs-hero {
    background: linear-gradient(135deg,#4f6ef7 0%,#7c5cbf 55%,#a855f7 100%);
    border-radius: 28px; padding: 2.2rem 2.6rem;
    margin-bottom: 2rem; position: relative; overflow: hidden;
    box-shadow: 0 24px 64px rgba(79,110,247,0.35);
    animation: crs-up 0.6s cubic-bezier(0.22,1,0.36,1) both;
  }
  .crs-hero::before {
    content: ''; position: absolute; top: -60%; left: -20%; width: 60%; height: 200%;
    background: linear-gradient(105deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.1) 50%,rgba(255,255,255,0) 100%);
    transform: rotate(25deg); pointer-events: none;
  }
  .crs-hero-deco { position: absolute; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.12); pointer-events: none; }
  .crs-hero-deco.d1 { width: 220px; height: 220px; right: -70px; bottom: -70px; }
  .crs-hero-deco.d2 { width: 120px; height: 120px; right: 90px; top: -45px; }
  .crs-hero-deco.d3 { width: 60px; height: 60px; left: 40%; top: -20px; }
  .crs-hero-content { position: relative; z-index: 1; }
  .crs-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 0.65rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase;
    background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25);
    border-radius: 99px; padding: 4px 12px; color: rgba(255,255,255,0.9); margin-bottom: 0.7rem;
  }
  .crs-hero-title {
    font-family: var(--font-serif); font-size: clamp(1.8rem,3.5vw,2.4rem);
    font-weight: 700; color: #fff; margin: 0 0 0.4rem; letter-spacing: -0.02em; line-height: 1.15;
  }
  .crs-hero-title em { font-style: italic; opacity: 0.85; }
  .crs-hero-sub { font-size: 0.85rem; color: rgba(255,255,255,0.65); margin: 0; }

  /* Breadcrumb */
  .crs-bc { font-size: 0.73rem; color: rgba(255,255,255,0.55); margin-top: 1rem; display: flex; align-items: center; gap: 0.4rem; }
  .crs-bc a { color: rgba(255,255,255,0.7); text-decoration: none; font-weight: 600; }
  .crs-bc a:hover { color: #fff; }

  /* Search bar below hero */
  .crs-search-bar {
    background: var(--white); border-radius: var(--radius);
    border: 1.5px solid var(--border); box-shadow: var(--shadow);
    padding: 0.9rem 1.2rem; margin-bottom: 1.6rem;
    display: flex; gap: 0.7rem; align-items: center; flex-wrap: wrap;
    animation: crs-up 0.5s 0.1s both;
  }
  .crs-search-input-wrap { flex: 1; min-width: 180px; position: relative; }
  .crs-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text3); pointer-events: none; }
  .crs-search-input {
    width: 100%; background: var(--bg); border: 1.5px solid var(--border);
    border-radius: 12px; padding: 9px 14px 9px 36px;
    font-family: var(--font); font-size: 0.85rem; color: var(--text); outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .crs-search-input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(79,110,247,0.1); }
  .crs-search-input::placeholder { color: var(--text3); }
  .crs-sort-select {
    background: var(--bg); border: 1.5px solid var(--border); border-radius: 12px;
    padding: 9px 14px; font-family: var(--font); font-size: 0.83rem; color: var(--text);
    outline: none; cursor: pointer; transition: border-color 0.2s; min-width: 150px;
  }
  .crs-sort-select:focus { border-color: var(--blue); }
  .crs-result-chip {
    font-size: 0.72rem; font-weight: 700; padding: 5px 12px; border-radius: 99px;
    background: var(--blue-light); border: 1.5px solid var(--blue-mid); color: var(--blue);
    white-space: nowrap;
    display: inline-flex; align-items: center; gap: 5px;
  }
  .crs-result-chip b { font-family: var(--font-serif); font-size: 0.9rem; }

  /* Layout */
  .crs-layout { display: flex; gap: 1.5rem; align-items: flex-start; }
  .crs-sidebar-col { width: 280px; flex-shrink: 0; }
  .crs-main-col { flex: 1; min-width: 0; }

  /* Sidebar */
  .crs-sidebar {
    background: var(--white); border-radius: var(--radius);
    border: 1.5px solid var(--border); box-shadow: var(--shadow);
    overflow: hidden; position: sticky; top: 80px;
    animation: crs-up 0.5s 0.08s both;
  }
  .crs-sidebar-header {
    background: linear-gradient(135deg,var(--blue-light),var(--purple-light));
    padding: 1rem 1.3rem; border-bottom: 1.5px solid var(--border);
    position: relative; overflow: hidden;
  }
  .crs-sidebar-header::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg,var(--blue),var(--purple));
  }
  .crs-sidebar-title { font-size: 0.72rem; font-weight: 800; color: var(--text2); text-transform: uppercase; letter-spacing: 0.12em; margin: 0; display: flex; align-items: center; gap: 0.5rem; }
  .crs-sidebar-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--blue); flex-shrink: 0; }
  .crs-clear-btn {
    font-size: 0.68rem; font-weight: 800; color: var(--orange);
    background: none; border: none; padding: 0; cursor: pointer;
    font-family: var(--font); margin-left: auto; transition: opacity 0.2s;
  }
  .crs-clear-btn:hover { opacity: 0.7; }

  .crs-sidebar-body { padding: 1.1rem 1.3rem; }
  .crs-filter-section { margin-bottom: 1.3rem; padding-bottom: 1.3rem; border-bottom: 1.5px solid var(--border); }
  .crs-filter-section:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
  .crs-filter-label {
    font-size: 0.68rem; font-weight: 800; color: var(--text2); text-transform: uppercase;
    letter-spacing: 0.1em; margin-bottom: 0.7rem; display: flex; align-items: center; gap: 5px;
  }
  .crs-filter-label .cnt {
    font-size: 0.6rem; background: var(--blue-light); color: var(--blue);
    border: 1px solid var(--blue-mid); border-radius: 99px; padding: 1px 7px; font-weight: 800;
    font-family: var(--font); text-transform: none; letter-spacing: 0;
  }

  /* Checkbox list */
  .crs-check-list { display: flex; flex-direction: column; gap: 4px; list-style: none; padding: 0; margin: 0; }
  .crs-check-item label {
    display: flex; align-items: center; gap: 8px; cursor: pointer;
    font-size: 0.8rem; color: var(--text2); font-weight: 500;
    padding: 5px 8px; border-radius: 9px; transition: background 0.15s, color 0.15s;
  }
  .crs-check-item label:hover { background: var(--blue-light); color: var(--blue); }
  .crs-check-item input[type='checkbox'] {
    width: 15px; height: 15px; border-radius: 4px; flex-shrink: 0;
    accent-color: var(--blue); cursor: pointer;
  }

  /* Price range slider */
  .crs-price-range { padding: 0.2rem 0; }
  .crs-price-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; }
  .crs-price-val {
    font-family: var(--font-serif); font-size: 0.9rem; font-weight: 700; color: var(--blue);
    background: var(--blue-light); border: 1.5px solid var(--blue-mid);
    border-radius: 8px; padding: 3px 10px;
  }
  .crs-range-track { position: relative; height: 5px; background: var(--border); border-radius: 99px; margin: 0.4rem 0; }
  .crs-range-fill {
    position: absolute; height: 100%; background: linear-gradient(90deg,var(--blue),var(--purple));
    border-radius: 99px; pointer-events: none;
  }
  .crs-range-input {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 100%; height: 5px; opacity: 0; cursor: pointer;
    -webkit-appearance: none; appearance: none; margin: 0;
  }
  .crs-range-thumb {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 18px; height: 18px; border-radius: 50%;
    background: var(--white); border: 2.5px solid var(--blue);
    box-shadow: 0 2px 8px rgba(79,110,247,0.3);
    pointer-events: none;
  }
  input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: var(--blue); cursor: pointer; }
  input[type='range'] { -webkit-appearance: none; appearance: none; background: transparent; outline: none; }
  input[type='range']::-webkit-slider-runnable-track { height: 5px; }

  /* Active filter chips */
  .crs-active-filters { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 0.8rem; }
  .crs-filter-chip {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.65rem; font-weight: 700; padding: 4px 10px; border-radius: 99px;
    background: var(--blue-light); border: 1.5px solid var(--blue-mid); color: var(--blue);
    cursor: pointer; transition: background 0.15s, color 0.15s;
  }
  .crs-filter-chip:hover { background: var(--blue); color: #fff; border-color: var(--blue); }
  .crs-filter-chip .x { font-size: 0.7rem; opacity: 0.7; }

  /* Main area toolbar */
  .crs-toolbar {
    display: flex; align-items: center; justify-content: space-between; gap: 1rem;
    margin-bottom: 1.3rem; flex-wrap: wrap;
  }
  .crs-toolbar-left { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
  .crs-tab {
    font-size: 0.75rem; font-weight: 700; padding: 6px 14px; border-radius: 10px;
    border: 1.5px solid var(--border); background: var(--white); color: var(--text2);
    cursor: pointer; font-family: var(--font); transition: all 0.18s;
  }
  .crs-tab.active, .crs-tab:hover { background: var(--blue); color: #fff; border-color: var(--blue); }

  /* Course grid */
  .crs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.3rem;
  }
  .crs-card-wrap { animation: crs-up 0.4s both; }

  /* Override Course card */
  .crs-grid .card {
    border-radius: 20px !important;
    border: 1.5px solid var(--border) !important;
    box-shadow: var(--shadow) !important;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s, border-color 0.2s !important;
    overflow: hidden !important; background: #fff !important;
  }
  .crs-grid .card:hover {
    transform: translateY(-8px) scale(1.015) !important;
    box-shadow: var(--shadow-hover) !important;
    border-color: #c7d0ff !important;
  }
  .crs-grid .card img { transition: transform 0.4s ease !important; }
  .crs-grid .card:hover img { transform: scale(1.05) !important; }
  .crs-grid .btn-primary {
    background: linear-gradient(135deg,var(--blue),var(--purple)) !important;
    border: none !important; border-radius: 11px !important;
    font-weight: 700 !important; font-size: 0.8rem !important;
    box-shadow: 0 4px 14px rgba(79,110,247,0.22) !important;
  }
  .crs-grid .btn-primary:hover { opacity: 0.88 !important; transform: translateY(-1px) !important; }

  /* Skeleton */
  .crs-skeleton {
    border-radius: 20px; height: 290px;
    background: linear-gradient(90deg,#e8ecff 0%,#f0f4ff 50%,#e8ecff 100%);
    background-size: 700px 100%; animation: shimmer 1.6s infinite;
    border: 1.5px solid var(--border);
  }
  @keyframes shimmer { 0%{background-position:-700px 0;} 100%{background-position:700px 0;} }
  @keyframes crs-up { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }

  /* Mobile sidebar drawer */
  .crs-mob-filter-btn {
    display: none;
    font-size: 0.8rem; font-weight: 700; padding: 8px 18px; border-radius: 12px;
    border: 1.5px solid var(--border); background: var(--white); color: var(--text2);
    cursor: pointer; font-family: var(--font); gap: 6px; align-items: center;
    transition: all 0.2s;
  }
  .crs-mob-filter-btn.has-active { border-color: var(--blue); color: var(--blue); background: var(--blue-light); }
  .crs-mob-overlay {
    display: none; position: fixed; inset: 0; background: rgba(14,18,36,0.5);
    backdrop-filter: blur(4px); z-index: 200;
  }
  .crs-mob-overlay.open { display: block; animation: modal-fade 0.2s both; }
  @keyframes modal-fade { from{opacity:0;} to{opacity:1;} }
  .crs-mob-sidebar {
    position: fixed; top: 0; left: 0; bottom: 0; width: 300px; max-width: 90vw;
    background: var(--white); z-index: 201; overflow-y: auto;
    transform: translateX(-100%); transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
    box-shadow: 8px 0 40px rgba(14,18,36,0.2);
  }
  .crs-mob-sidebar.open { transform: translateX(0); }
  .crs-mob-close {
    position: absolute; top: 12px; right: 12px;
    width: 32px; height: 32px; border-radius: 10px;
    background: var(--bg); border: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 0.9rem; color: var(--text2);
    z-index: 5;
  }

  @media (max-width: 900px) {
    .crs-sidebar-col { display: none; }
    .crs-mob-filter-btn { display: flex; }
  }
  @media (max-width: 580px) {
    .crs-grid { grid-template-columns: 1fr 1fr; gap: 0.9rem; }
    .crs-hero { padding: 1.6rem 1.6rem; }
    .crs-search-bar { flex-direction: column; }
    .crs-search-input-wrap { width: 100%; }
    .crs-sort-select { width: 100%; }
  }
  @media (max-width: 380px) { .crs-grid { grid-template-columns: 1fr; } }
`

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const [keyword, setKeyword] = useState('')
  const [sort, setSort] = useState('desc')
  const [levels, setLevels] = useState([])
  const [languages, setLanguages] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [mobOpen, setMobOpen] = useState(false)
  const [priceMax, setPriceMax] = useState(200)
  const [priceFilter, setPriceFilter] = useState(200)

  const [categoryChecked, setCategoryChecked] = useState(() => {
    const c = searchParams.get('category'); return c ? c.split(',') : []
  })
  const [levelChecked, setLevelChecked] = useState(() => {
    const l = searchParams.get('level'); return l ? l.split(',') : []
  })
  const [languageChecked, setLanguageChecked] = useState(() => {
    const l = searchParams.get('language'); return l ? l.split(',') : []
  })

  const activeCount = categoryChecked.length + levelChecked.length + languageChecked.length

  const handleCategory = (e) => {
    const { checked, value } = e.target
    setCategoryChecked(p => checked ? [...p, value] : p.filter(id => id != value))
  }
  const handleLevel = (e) => {
    const { checked, value } = e.target
    setLevelChecked(p => checked ? [...p, value] : p.filter(id => id != value))
  }
  const handleLanguage = (e) => {
    const { checked, value } = e.target
    setLanguageChecked(p => checked ? [...p, value] : p.filter(id => id != value))
  }

  const fetchCourses = () => {
    setLoading(true)
    const search = []
    if (categoryChecked.length > 0) search.push(['category', categoryChecked])
    if (levelChecked.length > 0) search.push(['level', levelChecked])
    if (languageChecked.length > 0) search.push(['language', languageChecked])
    if (keyword.length > 0) search.push(['keyword', keyword])
    search.push(['sort', sort])
    const params = search.length > 0 ? new URLSearchParams(search) : new URLSearchParams()
    if (search.length > 0) setSearchParams(params); else setSearchParams([])
    fetch(`৳{apiUrl}/fetch-courses?${params}`, {
      method: 'GET', headers: { 'Content-type': 'application/json', Accept: 'application/json' },
    })
      .then(res => res.json())
      .then(result => {
        setLoading(false)
        if (result.status == 200) setCourses(result.data)
        else console.log('Something went wrong')
      })
  }

  const fetchCategories = () => {
    fetch(`${apiUrl}/fetch-categories`, { method: 'GET', headers: { 'Content-type': 'application/json', Accept: 'application/json' } })
      .then(r => r.json()).then(result => { if (result.status == 200) setCategories(result.data) })
  }
  const fetchLevels = () => {
    fetch(`${apiUrl}/fetch-levels`, { method: 'GET', headers: { 'Content-type': 'application/json', Accept: 'application/json' } })
      .then(r => r.json()).then(result => { if (result.status == 200) setLevels(result.data) })
  }
  const fetchLanguages = () => {
    fetch(`${apiUrl}/fetch-languages`, { method: 'GET', headers: { 'Content-type': 'application/json', Accept: 'application/json' } })
      .then(r => r.json()).then(result => { if (result.status == 200) setLanguages(result.data) })
  }

  const clearFilters = () => {
    setLevelChecked([]); setCategoryChecked([]); setLanguageChecked([])
    setKeyword(''); setPriceFilter(200)
    document.querySelectorAll('.crs-check-item input[type=checkbox]').forEach(el => el.checked = false)
  }

  useEffect(() => { fetchCategories(); fetchLevels(); fetchLanguages() }, [])
  useEffect(() => { fetchCourses() }, [categoryChecked, levelChecked, languageChecked, keyword, sort])

  // filtered by price client-side — 200 = "Any", null/missing price always shown
  const displayedCourses = courses.filter(c => {
    if (priceFilter >= 200) return true
    const raw = c.price ?? c.selling_price ?? c.discounted_price ?? null
    if (raw === null || raw === undefined || raw === '' || isNaN(parseFloat(raw))) return true
    return parseFloat(raw) <= priceFilter
  })

  const SidebarContent = () => (
    <>
      <div className='crs-sidebar-header'>
        <div className='crs-sidebar-title'>
          <span className='crs-sidebar-dot' />
          Filters
          {activeCount > 0 && <span style={{ marginLeft: 4, fontFamily: 'var(--font)', fontSize: '0.65rem', background: 'var(--blue)', color: '#fff', borderRadius: '99px', padding: '2px 8px' }}>{activeCount}</span>}
          <button className='crs-clear-btn' onClick={clearFilters}>Clear All</button>
        </div>
      </div>
      <div className='crs-sidebar-body'>

        {/* Active filter chips */}
        {activeCount > 0 && (
          <div className='crs-active-filters' style={{ marginBottom: '1rem' }}>
            {categoryChecked.map(id => {
              const cat = categories.find(c => String(c.id) === String(id))
              return cat ? (
                <span key={id} className='crs-filter-chip' onClick={() => setCategoryChecked(p => p.filter(x => x != id))}>
                  {cat.name} <span className='x'>✕</span>
                </span>
              ) : null
            })}
            {levelChecked.map(id => {
              const lv = levels.find(l => String(l.id) === String(id))
              return lv ? (
                <span key={id} className='crs-filter-chip' onClick={() => setLevelChecked(p => p.filter(x => x != id))}>
                  {lv.name} <span className='x'>✕</span>
                </span>
              ) : null
            })}
            {languageChecked.map(id => {
              const ln = languages.find(l => String(l.id) === String(id))
              return ln ? (
                <span key={id} className='crs-filter-chip' onClick={() => setLanguageChecked(p => p.filter(x => x != id))}>
                  {ln.name} <span className='x'>✕</span>
                </span>
              ) : null
            })}
          </div>
        )}

        {/* Price range */}
        <div className='crs-filter-section'>
          <div className='crs-filter-label'>Price Range</div>
          <div className='crs-price-range'>
            <div className='crs-price-row'>
              <span style={{ fontSize: '0.72rem', color: 'var(--text3)', fontWeight: 600 }}>$0</span>
              <span className='crs-price-val'>${priceFilter === 200 ? 'Any' : priceFilter}</span>
            </div>
            <input
              type='range' min='0' max='200' step='5'
              value={priceFilter}
              onChange={e => setPriceFilter(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--blue)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.67rem', color: 'var(--text3)', marginTop: '0.3rem' }}>
              <span>Free</span><span>$50</span><span>$100</span><span>$200+</span>
            </div>
          </div>
        </div>

        {/* Category */}
        <div className='crs-filter-section'>
          <div className='crs-filter-label'>
            Category
            {categories.length > 0 && <span className='cnt'>{categories.length}</span>}
          </div>
          <ul className='crs-check-list'>
            {categories.map(cat => (
              <li key={cat.id} className='crs-check-item'>
                <label htmlFor={`cat-${cat.id}`}>
                  <input
                    type='checkbox' id={`cat-${cat.id}`} value={cat.id}
                    defaultChecked={categoryChecked.includes(String(cat.id))}
                    onChange={handleCategory}
                  />
                  {cat.name}
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Level */}
        <div className='crs-filter-section'>
          <div className='crs-filter-label'>
            Level
            {levels.length > 0 && <span className='cnt'>{levels.length}</span>}
          </div>
          <ul className='crs-check-list'>
            {levels.map(lv => (
              <li key={lv.id} className='crs-check-item'>
                <label htmlFor={`lv-${lv.id}`}>
                  <input
                    type='checkbox' id={`lv-${lv.id}`} value={lv.id}
                    defaultChecked={levelChecked.includes(String(lv.id))}
                    onChange={handleLevel}
                  />
                  {lv.name}
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Language */}
        <div className='crs-filter-section'>
          <div className='crs-filter-label'>
            Language
            {languages.length > 0 && <span className='cnt'>{languages.length}</span>}
          </div>
          <ul className='crs-check-list'>
            {languages.map(lang => (
              <li key={lang.id} className='crs-check-item'>
                <label htmlFor={`lang-${lang.id}`}>
                  <input
                    type='checkbox' id={`lang-${lang.id}`} value={lang.id}
                    defaultChecked={languageChecked.includes(String(lang.id))}
                    onChange={handleLanguage}
                  />
                  {lang.name}
                </label>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </>
  )

  return (
    <Layout>
      <style>{css}</style>
      <div className='crs-blob-wrap'>
        <div className='crs-blob crs-blob-1' /><div className='crs-blob crs-blob-2' /><div className='crs-blob crs-blob-3' />
      </div>

      <div className='crs-root'>
        <div className='container crs-inner'>

          {/* Hero */}
          <div className='crs-hero'>
            <div className='crs-hero-deco d1' /><div className='crs-hero-deco d2' /><div className='crs-hero-deco d3' />
            <div className='crs-hero-content'>
              <div className='crs-hero-eyebrow'>📚 All Courses</div>
              <h1 className='crs-hero-title'>Find Your Next <em>Skill</em></h1>
              <p className='crs-hero-sub'>Filter by category, level, language, and price to find exactly what you need.</p>
              <div className='crs-bc'>
                <a href='/'>Home</a>
                <span>›</span>
                <span style={{ color: 'rgba(255,255,255,0.8)' }}>Courses</span>
              </div>
            </div>
          </div>

          {/* Search + sort bar */}
          <div className='crs-search-bar'>
            <div className='crs-search-input-wrap'>
              <svg className='crs-search-icon' width='15' height='15' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <circle cx='11' cy='11' r='8' strokeWidth='2' /><path d='M21 21l-4.35-4.35' strokeWidth='2' strokeLinecap='round' />
              </svg>
              <input
                className='crs-search-input'
                placeholder='Search courses by keyword...'
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchCourses()}
              />
            </div>
            <select className='crs-sort-select' value={sort} onChange={e => setSort(e.target.value)}>
              <option value='desc'>⬇ Newest First</option>
              <option value='asc'>⬆ Oldest First</option>
            </select>
            {!loading && (
              <span className='crs-result-chip'>
                <b>{displayedCourses.length}</b> course{displayedCourses.length !== 1 ? 's' : ''}
              </span>
            )}
            {/* Mobile filter btn */}
            <button
              className={`crs-mob-filter-btn${activeCount > 0 ? ' has-active' : ''}`}
              onClick={() => setMobOpen(true)}
            >
              ⚙ Filters {activeCount > 0 && `(${activeCount})`}
            </button>
          </div>

          {/* Main layout */}
          <div className='crs-layout'>

            {/* Desktop sidebar */}
            <div className='crs-sidebar-col'>
              <div className='crs-sidebar'>
                <SidebarContent />
              </div>
            </div>

            {/* Course grid */}
            <div className='crs-main-col'>
              {loading ? (
                <div className='crs-grid'>
                  {[1,2,3,4,5,6].map(i => <div key={i} className='crs-skeleton' />)}
                </div>
              ) : displayedCourses.length === 0 ? (
                <NotFound />
              ) : (
                <div className='crs-grid'>
                  {displayedCourses.map((course, idx) => (
                    <div key={course.id} className='crs-card-wrap' style={{ animationDelay: `${idx * 0.045}s` }}>
                      <Course course={course} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`crs-mob-overlay${mobOpen ? ' open' : ''}`} onClick={() => setMobOpen(false)} />
      <div className={`crs-mob-sidebar${mobOpen ? ' open' : ''}`}>
        <button className='crs-mob-close' onClick={() => setMobOpen(false)}>✕</button>
        <SidebarContent />
      </div>
    </Layout>
  )
}

export default Courses