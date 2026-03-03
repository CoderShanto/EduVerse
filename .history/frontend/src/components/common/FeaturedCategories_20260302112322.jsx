import React, { useEffect, useState } from 'react'
import { apiUrl, token } from './Config'
import { Link } from 'react-router-dom'

const CATEGORY_ICONS = {
  'ai': '🤖', 'artificial intelligence': '🤖',
  'web': '🌐', 'web development': '🌐',
  'design': '🎨', 'ui': '🎨', 'ux': '🎨',
  'data': '📊', 'data science': '📊', 'analytics': '📊',
  'mobile': '📱', 'android': '📱', 'ios': '📱',
  'business': '💼', 'management': '💼',
  'marketing': '📣', 'digital marketing': '📣',
  'security': '🔐', 'cybersecurity': '🔐',
  'cloud': '☁️', 'devops': '☁️',
  'python': '🐍', 'javascript': '⚡', 'java': '☕',
  'health': '❤️', 'fitness': '❤️',
  'finance': '💰', 'accounting': '💰',
  'education': '📚', 'language': '🗣️',
  'photography': '📷', 'video': '🎬',
  'music': '🎵', 'art': '🖌️',
  'science': '🔬', 'math': '🧮',
}

const getIcon = (name = '') => {
  const lower = name.toLowerCase()
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key)) return icon
  }
  return '📘'
}

const GRADIENTS = [
  'linear-gradient(135deg,#4f6ef7,#818cf8)',
  'linear-gradient(135deg,#7c5cbf,#a855f7)',
  'linear-gradient(135deg,#ff7140,#fb923c)',
  'linear-gradient(135deg,#22c98e,#34d399)',
  'linear-gradient(135deg,#ffb020,#fbbf24)',
  'linear-gradient(135deg,#06b6d4,#22d3ee)',
  'linear-gradient(135deg,#ec4899,#f472b6)',
  'linear-gradient(135deg,#6366f1,#818cf8)',
]

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,400&display=swap');

  .fc-section {
    padding: 5rem 0 4rem;
    background: #f0f4ff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* Subtle background blobs */
  .fc-bg-blob {
    position: absolute; border-radius: 50%;
    filter: blur(80px); pointer-events: none;
  }
  .fc-bg-blob-1 {
    width: 400px; height: 400px;
    background: radial-gradient(circle,rgba(199,208,255,0.55),rgba(165,180,252,0.2));
    top: -100px; right: -80px;
    animation: blob-float 12s ease-in-out infinite alternate;
  }
  .fc-bg-blob-2 {
    width: 300px; height: 300px;
    background: radial-gradient(circle,rgba(255,213,197,0.5),rgba(255,179,160,0.2));
    bottom: -60px; left: -60px;
    animation: blob-float 10s ease-in-out infinite alternate-reverse;
  }
  @keyframes blob-float { from{transform:translate(0,0) scale(1);} to{transform:translate(24px,16px) scale(1.08);} }

  /* Header */
  .fc-header { text-align: center; margin-bottom: 3rem; position: relative; z-index: 1; }
  .fc-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 0.68rem; font-weight: 800; letter-spacing: 0.14em;
    text-transform: uppercase; color: #4f6ef7;
    background: #eef0ff; border: 1.5px solid #dde2ff;
    border-radius: 99px; padding: 5px 14px; margin-bottom: 1rem;
  }
  .fc-eyebrow::before, .fc-eyebrow::after {
    content: ''; width: 5px; height: 5px; border-radius: 50%;
    background: #4f6ef7; flex-shrink: 0;
  }
  .fc-title {
    font-family: 'Fraunces', serif;
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    font-weight: 700; color: #14142b; margin: 0 0 0.7rem;
    line-height: 1.15; letter-spacing: -0.02em;
  }
  .fc-title em { font-style: italic; color: #4f6ef7; }
  .fc-subtitle { font-size: 0.92rem; color: #6e7191; max-width: 480px; margin: 0 auto; line-height: 1.7; }

  /* Grid */
  .fc-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.1rem;
    position: relative; z-index: 1;
  }

  /* Category card */
  .fc-card {
    background: #fff; border-radius: 20px;
    border: 1.5px solid #e4e7f4;
    padding: 1.5rem 1.3rem 1.4rem;
    text-decoration: none; color: inherit;
    display: flex; flex-direction: column; align-items: flex-start; gap: 0.8rem;
    box-shadow: 0 4px 20px rgba(79,110,247,0.07);
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s, border-color 0.2s;
    animation: fc-card-in 0.5s both;
    position: relative; overflow: hidden;
    cursor: pointer;
  }
  .fc-card::before {
    content: ''; position: absolute; inset: 0;
    opacity: 0; transition: opacity 0.25s;
    border-radius: 20px;
  }
  .fc-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 50px rgba(79,110,247,0.18);
    border-color: #c7d0ff;
    color: inherit; text-decoration: none;
  }
  .fc-card:hover::before { opacity: 1; }

  /* Watermark number */
  .fc-card::after {
    content: attr(data-num);
    position: absolute; bottom: -8px; right: 8px;
    font-family: 'Fraunces', serif; font-size: 4rem; font-weight: 700;
    color: currentColor; opacity: 0.04; line-height: 1; pointer-events: none;
    transition: opacity 0.25s;
  }
  .fc-card:hover::after { opacity: 0.07; }

  /* Icon blob */
  .fc-icon-wrap {
    width: 48px; height: 48px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; flex-shrink: 0;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .fc-card:hover .fc-icon-wrap { transform: scale(1.15) rotate(-8deg); }

  .fc-cat-name {
    font-size: 0.9rem; font-weight: 800; color: #14142b; line-height: 1.25;
    transition: color 0.2s;
  }
  .fc-card:hover .fc-cat-name { color: #4f6ef7; }

  .fc-card-arrow {
    font-size: 0.72rem; font-weight: 700; color: #a0abc0;
    margin-top: auto;
    display: flex; align-items: center; gap: 4px;
    transition: color 0.2s, gap 0.2s;
  }
  .fc-card:hover .fc-card-arrow { color: #4f6ef7; gap: 8px; }

  @keyframes fc-card-in {
    from { opacity: 0; transform: translateY(22px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Skeleton */
  .fc-skeleton {
    border-radius: 20px; height: 140px;
    background: linear-gradient(90deg,#e8ecff 0%,#f0f4ff 50%,#e8ecff 100%);
    background-size: 700px 100%; animation: shimmer 1.6s infinite;
    border: 1.5px solid #e4e7f4;
  }
  @keyframes shimmer { 0%{background-position:-700px 0;} 100%{background-position:700px 0;} }

  /* View all */
  .fc-footer { text-align: center; margin-top: 2.5rem; position: relative; z-index: 1; }
  .fc-view-all {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 0.85rem; font-weight: 800; color: #4f6ef7;
    text-decoration: none; padding: 10px 26px; border-radius: 14px;
    background: #eef0ff; border: 1.5px solid #dde2ff;
    transition: background 0.2s, color 0.2s, transform 0.2s, box-shadow 0.2s;
  }
  .fc-view-all:hover {
    background: #4f6ef7; color: #fff; border-color: #4f6ef7;
    transform: translateY(-2px); box-shadow: 0 8px 24px rgba(79,110,247,0.3);
  }
  .fc-view-all span { transition: transform 0.2s; }
  .fc-view-all:hover span { transform: translateX(4px); }

  @media (max-width: 576px) {
    .fc-grid { grid-template-columns: 1fr 1fr; }
    .fc-section { padding: 3.5rem 0 2.5rem; }
  }
`

const FeaturedCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = () => {
    setLoading(true)
    fetch(`${apiUrl}/fetch-categories`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(result => {
        if (result.status == 200) setCategories(result.data)
        else console.log('Something went wrong')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCategories() }, [])

  return (
    <>
      <style>{css}</style>
      <section className='fc-section'>
        <div className='fc-bg-blob fc-bg-blob-1' />
        <div className='fc-bg-blob fc-bg-blob-2' />

        <div className='container'>
          {/* Header */}
          <div className='fc-header'>
            <div className='fc-eyebrow'>Explore</div>
            <h2 className='fc-title'>Browse by <em>Category</em></h2>
            <p className='fc-subtitle'>Discover courses designed to help you excel in your professional and personal growth.</p>
          </div>

          {/* Grid */}
          {loading ? (
            <div className='fc-grid'>
              {[1,2,3,4,5,6,7,8].map(i => <div key={i} className='fc-skeleton' />)}
            </div>
          ) : (
            <div className='fc-grid'>
              {categories.map((cat, idx) => {
                const grad = GRADIENTS[idx % GRADIENTS.length]
                const icon = getIcon(cat.name)
                return (
                  <Link
                    key={cat.id}
                    to={`/courses?category=${cat.id}`}
                    className='fc-card'
                    data-num={idx + 1}
                    style={{ animationDelay: `${idx * 0.045}s` }}
                  >
                    <div className='fc-icon-wrap' style={{ background: grad }}>
                      {icon}
                    </div>
                    <div className='fc-cat-name'>{cat.name}</div>
                    <div className='fc-card-arrow'>Explore <span>→</span></div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Footer CTA */}
          {!loading && categories.length > 0 && (
            <div className='fc-footer'>
              <Link to='/courses' className='fc-view-all'>
                View All Courses <span>→</span>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default FeaturedCategories