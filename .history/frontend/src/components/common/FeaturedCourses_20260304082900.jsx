import React, { useEffect, useState } from 'react'
import Course from './Course'
import { apiUrl, token } from './Config'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,400&display=swap');

  .fco-section {
    padding: 5rem 0 4.5rem;
    background: #ffffff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* Subtle tinted band at top */
  .fco-section::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 6px;
    background: linear-gradient(90deg,#4f6ef7,#7c5cbf,#a855f7,#4f6ef7);
    background-size: 300% 100%;
    animation: fco-stripe 6s linear infinite;
  }
  @keyframes fco-stripe { 0%{background-position:0% 0;} 100%{background-position:300% 0;} }

  /* Background deco */
  .fco-deco-blob {
    position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; opacity: 0.18;
  }
  .fco-deco-blob-1 { width: 500px; height: 500px; background: radial-gradient(circle,#c7d0ff,#a5b4fc); top: -180px; right: -120px; animation: blob-float 12s ease-in-out infinite alternate; }
  .fco-deco-blob-2 { width: 300px; height: 300px; background: radial-gradient(circle,#ffd5c5,#ffb3a0); bottom: -80px; left: -60px; animation: blob-float 10s ease-in-out infinite alternate-reverse; }
  @keyframes blob-float { from{transform:translate(0,0) scale(1);} to{transform:translate(22px,14px) scale(1.08);} }

  /* Header */
  .fco-header {
    display: flex; align-items: flex-end; justify-content: space-between;
    gap: 1.5rem; margin-bottom: 2.8rem; flex-wrap: wrap;
    position: relative; z-index: 1;
  }
  .fco-header-left { flex: 1; min-width: 0; }
  .fco-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 0.68rem; font-weight: 800; letter-spacing: 0.14em;
    text-transform: uppercase; color: #4f6ef7;
    background: #eef0ff; border: 1.5px solid #dde2ff;
    border-radius: 99px; padding: 5px 14px; margin-bottom: 0.8rem;
  }
  .fco-eyebrow::before, .fco-eyebrow::after {
    content: ''; width: 5px; height: 5px; border-radius: 50%; background: #4f6ef7; flex-shrink: 0;
  }
  .fco-title {
    font-family: 'Fraunces', serif;
    font-size: clamp(1.8rem, 4vw, 2.5rem);
    font-weight: 700; color: #14142b; margin: 0 0 0.5rem;
    line-height: 1.15; letter-spacing: -0.02em;
  }
  .fco-title em { font-style: italic; color: #4f6ef7; }
  .fco-subtitle { font-size: 0.9rem; color: #6e7191; margin: 0; line-height: 1.7; max-width: 460px; }
  .fco-view-all {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 0.82rem; font-weight: 800; color: #4f6ef7;
    text-decoration: none; padding: 10px 22px; border-radius: 13px;
    background: #eef0ff; border: 1.5px solid #dde2ff; flex-shrink: 0;
    transition: background 0.2s, color 0.2s, transform 0.2s, box-shadow 0.2s;
    white-space: nowrap;
  }
  .fco-view-all span { transition: transform 0.2s; }
  .fco-view-all:hover {
    background: #4f6ef7; color: #fff; border-color: #4f6ef7;
    transform: translateY(-2px); box-shadow: 0 8px 24px rgba(79,110,247,0.3);
  }
  .fco-view-all:hover span { transform: translateX(4px); }

  /* Grid */
  .fco-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.4rem;
    position: relative; z-index: 1;
  }

  /* Skeleton */
  .fco-skeleton {
    border-radius: 20px; height: 300px;
    background: linear-gradient(90deg,#eef0ff 0%,#f5f7ff 50%,#eef0ff 100%);
    background-size: 700px 100%; animation: fco-shimmer 1.6s infinite;
    border: 1.5px solid #e4e7f4;
  }
  @keyframes fco-shimmer { 0%{background-position:-700px 0;} 100%{background-position:700px 0;} }

  /* Animate course cards in */
  .fco-card-wrap {
    animation: fco-in 0.5s both;
  }
  @keyframes fco-in {
    from { opacity: 0; transform: translateY(22px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Override Course card styles to match system */
  .fco-grid .card {
    border-radius: 20px !important;
    border: 1.5px solid #e4e7f4 !important;
    box-shadow: 0 4px 20px rgba(79,110,247,0.07) !important;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s, border-color 0.2s !important;
    overflow: hidden !important;
    background: #fff !important;
  }
  .fco-grid .card:hover {
    transform: translateY(-8px) scale(1.015) !important;
    box-shadow: 0 20px 50px rgba(79,110,247,0.16) !important;
    border-color: #c7d0ff !important;
  }
  .fco-grid .card img {
    transition: transform 0.4s ease !important;
  }
  .fco-grid .card:hover img {
    transform: scale(1.05) !important;
  }
  .fco-grid .card .card-body {
    padding: 1.1rem 1.2rem 1.2rem !important;
  }
  .fco-grid .btn-primary {
    background: linear-gradient(135deg,#4f6ef7,#7c5cbf) !important;
    border: none !important; border-radius: 11px !important;
    font-weight: 700 !important; font-size: 0.8rem !important;
    box-shadow: 0 4px 14px rgba(79,110,247,0.25) !important;
    transition: opacity 0.2s, transform 0.2s !important;
  }
  .fco-grid .btn-primary:hover {
    opacity: 0.88 !important; transform: translateY(-1px) !important;
  }

  /* Counter strip */
  .fco-count-strip {
    display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;
    position: relative; z-index: 1;
  }
  .fco-count-chip {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.72rem; font-weight: 700; padding: 4px 12px; border-radius: 99px;
    background: #f0f4ff; border: 1.5px solid #e4e7f4; color: #6e7191;
  }
  .fco-count-chip b { color: #4f6ef7; font-family: 'Fraunces', serif; font-size: 0.9rem; }

  @media (max-width: 576px) {
    .fco-grid { grid-template-columns: 1fr 1fr; gap: 0.9rem; }
    .fco-header { flex-direction: column; align-items: flex-start; }
    .fco-section { padding: 3.5rem 0 3rem; }
  }
  @media (max-width: 400px) {
    .fco-grid { grid-template-columns: 1fr; }
  }
`

const FeaturedCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchFeaturedCourses = () => {
    setLoading(true)
    fetch(`${apiUrl}/fetch-featured-courses`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(result => {
        if (result.status == 200) setCourses(result.data)
        else console.log('Something went wrong')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchFeaturedCourses() }, [])

  return (
    <>
      <style>{css}</style>
      <section className='fco-section'>
        <div className='fco-deco-blob fco-deco-blob-1' />
        <div className='fco-deco-blob fco-deco-blob-2' />

        <div className='container'>

          {/* Header */}
          <div className='fco-header'>
            <div className='fco-header-left'>
              <div className='fco-eyebrow'>Featured</div>
              <h2 className='fco-title'>Top <em>Courses</em> for You</h2>
              <p className='fco-subtitle'>Discover courses designed to help you excel in your professional and personal growth.</p>
            </div>
            {/* <a href='/courses' className='fco-view-all'>View All <span>→</span></a> */}
          </div>

          {/* Count */}
          {!loading && courses.length > 0 && (
            <div className='fco-count-strip'>
              <span className='fco-count-chip'><b>{courses.length}</b> courses available</span>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className='fco-grid'>
              {[1,2,3,4].map(i => <div key={i} className='fco-skeleton' />)}
            </div>
          ) : (
            <div className='fco-grid'>
              {courses.map((course, idx) => (
                <div
                  key={course.id || course._id || idx}
                  className='fco-card-wrap'
                  style={{ animationDelay: `${idx * 0.06}s` }}
                >
                  <Course course={course} />
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </>
  )
}

export default FeaturedCourses