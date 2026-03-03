import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../../common/Layout'
import UserSidebar from '../../../common/UserSidebar'
import { apiUrl, token } from '../../../common/Config'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .ml-root {
    background: #f6f4ef;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    padding-bottom: 3rem;
  }

  .ml-breadcrumb {
    font-size: 0.78rem;
    color: #9a8f7e;
    letter-spacing: 0.04em;
    padding: 1.4rem 0 0;
  }
  .ml-breadcrumb a { color: #c17d3c; text-decoration: none; }
  .ml-breadcrumb a:hover { text-decoration: underline; }

  .ml-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin: 1.1rem 0 1.2rem;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .ml-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    color: #1a1610;
    margin: 0;
  }
  .ml-subtitle { margin: 0.25rem 0 0; color: #7a6f60; font-size: 0.88rem; }

  .ml-search-wrap {
    position: relative;
    width: 100%;
    margin: 0.8rem 0 1.3rem;
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
    padding: 0.62rem 1rem 0.62rem 2.4rem;
    border: 1.5px solid #ddd9d0;
    border-radius: 12px;
    background: #fff;
    font-size: 0.9rem;
    color: #1a1610;
    outline: none;
  }
  .ml-search:focus { border-color: #c17d3c; }

  .ml-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.15rem;
  }

  .ml-card {
    background: #fff;
    border-radius: 18px;
    border: 1.5px solid #ede9e1;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(26,22,16,0.05);
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    text-decoration: none;
    color: inherit;
    display: block;
  }
  .ml-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 28px rgba(26,22,16,0.12);
  }

  .ml-cover {
    height: 140px;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .ml-cover img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ml-cover-fallback { font-size: 42px; opacity: 0.5; }

  .ml-card-body { padding: 1rem 1.05rem 1.1rem; }
  .ml-course-title {
    font-weight: 800;
    color: #1a1610;
    font-size: 1rem;
    margin: 0;
    line-height: 1.25;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ml-hint {
    margin-top: 0.45rem;
    font-size: 0.82rem;
    color: #7a6f60;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .ml-hint span {
    display: inline-flex;
    padding: 0.18rem 0.55rem;
    border-radius: 999px;
    background: #fff8ee;
    border: 1px solid #f5d899;
    color: #8a5c00;
    font-weight: 800;
    font-size: 0.74rem;
  }

  .ml-empty {
    text-align: center;
    padding: 4rem 2rem;
    background: #fff;
    border-radius: 18px;
    border: 1.5px dashed #ddd9d0;
  }
  .ml-empty h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    color: #1a1610;
    margin: 0.5rem 0;
  }
  .ml-empty p { color: #9a8f7e; margin: 0; }

  @keyframes shimmer {
    0% { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
  .ml-skeleton {
    height: 240px;
    border-radius: 18px;
    background: linear-gradient(90deg, #ede9e1 25%, #f6f4ef 50%, #ede9e1 75%);
    background-size: 600px 100%;
    animation: shimmer 1.4s infinite;
  }

  @media (max-width: 768px) {
    .ml-title { font-size: 1.55rem; }
    .ml-grid { grid-template-columns: 1fr; }
  }
`

// ✅ robust getters (so it works with your API even if fields differ)
const getTitle = (e) => e?.course?.title ?? e?.title ?? 'Course'
const getImage = (e) =>
  e?.course?.course_small_image ??
  e?.course?.image ??
  e?.course_small_image ??
  e?.image ??
  ''

const getCourseId = (e) => e?.course_id ?? e?.course?.id ?? e?.id

const MyLearning = () => {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${apiUrl}/enrollments`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        const result = await res.json()
        setEnrollments(result?.status === 200 ? (result.data || []) : [])
      } catch (e) {
        console.error(e)
        setEnrollments([])
      } finally {
        setLoading(false)
      }
    }

    fetchEnrollments()
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return enrollments
    return enrollments.filter((e) => getTitle(e).toLowerCase().includes(q))
  }, [enrollments, search])

  return (
    <Layout>
      <style>{css}</style>
      <div className="ml-root">
        <div className="container">

          <nav className="ml-breadcrumb">
            <Link to="/account/dashboard">Account</Link>
            <span className="mx-2">›</span>
            <span style={{ color: '#1a1610' }}>My Learning</span>
          </nav>

          <div className="row">
            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>

            <div className="col-lg-9 mt-4 mt-lg-0">

              <div className="ml-header">
                <div>
                  <h1 className="ml-title">My Learning</h1>
                  <p className="ml-subtitle">{enrollments.length} course{enrollments.length !== 1 ? 's' : ''} enrolled</p>
                </div>
              </div>

              <div className="ml-search-wrap">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                  <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
                </svg>

                <input
                  className="ml-search"
                  placeholder="Search your courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {loading ? (
                <div className="ml-grid">
                  {[1,2,3,4,5,6].map(i => <div key={i} className="ml-skeleton" />)}
                </div>
              ) : filtered.length === 0 ? (
                <div className="ml-empty">
                  <div style={{ fontSize: 42, opacity: 0.6 }}>📚</div>
                  <h3>No courses found</h3>
                  <p>Try another keyword.</p>
                </div>
              ) : (
                <div className="ml-grid">
                  {filtered.map((e) => {
                    const title = getTitle(e)
                    const image = getImage(e)
                    const courseId = getCourseId(e)

                    // ✅ When user clicks card → go to course watch page
                    // Change this if your route is different
                    const to = `/watch-course/${courseId}`

                    return (
                      <Link key={e?.id ?? `${courseId}-${title}`} to={to} className="ml-card">
                        <div className="ml-cover">
                          {image ? (
                            <img src={image} alt={title} />
                          ) : (
                            <div className="ml-cover-fallback">📘</div>
                          )}
                        </div>

                        <div className="ml-card-body">
                          <h3 className="ml-course-title" title={title}>{title}</h3>
                          <div className="ml-hint">
                            <span>Click</span> to open and start learning →
                          </div>
                        </div>
                      </Link>
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