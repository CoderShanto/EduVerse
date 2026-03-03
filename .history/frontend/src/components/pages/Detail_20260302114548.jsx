import React, { useEffect, useState } from 'react'
import Layout from '../common/Layout'
import { Rating } from 'react-simple-star-rating'
import { Accordion, ListGroup } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { apiUrl, convertMinutesToHours, token } from '../common/Config'
import { LuMonitorPlay } from 'react-icons/lu'
import Loading from '../common/Loading'
import FreePreview from '../common/FreePreview'
import toast from 'react-hot-toast'

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
    --shadow-hover: 0 20px 50px rgba(79,110,247,0.16);
    --font: 'Plus Jakarta Sans', sans-serif;
    --font-serif: 'Fraunces', serif;
  }

  .dt-root {
    background: var(--bg);
    min-height: 100vh;
    font-family: var(--font);
    padding-bottom: 5rem;
    color: var(--text);
    position: relative;
  }

  /* Blobs */
  .dt-blob-wrap { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
  .dt-blob { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.22; }
  .dt-blob-1 { width: 600px; height: 600px; background: radial-gradient(circle,#c7d0ff,#a5b4fc); top: -200px; right: -150px; animation: blob-float 12s ease-in-out infinite alternate; }
  .dt-blob-2 { width: 400px; height: 400px; background: radial-gradient(circle,#ffd5c5,#ffb3a0); bottom: 0; left: -100px; animation: blob-float 14s ease-in-out infinite alternate-reverse; }
  @keyframes blob-float { from{transform:translate(0,0) scale(1);} to{transform:translate(28px,18px) scale(1.1);} }

  .dt-inner { position: relative; z-index: 1; padding-top: 1.5rem; }

  /* ── HERO BANNER ── */
  .dt-hero {
    background: linear-gradient(135deg,#0f1035 0%,#1e1463 40%,#3730a3 70%,#4f6ef7 100%);
    border-radius: 28px;
    margin-bottom: 2rem;
    position: relative; overflow: hidden;
    box-shadow: 0 30px 80px rgba(15,16,53,0.45);
    animation: dt-up 0.7s cubic-bezier(0.22,1,0.36,1) both;
  }
  .dt-hero-shine {
    position: absolute; top: -80%; left: -30%; width: 70%; height: 200%;
    background: linear-gradient(105deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.06) 50%,rgba(255,255,255,0) 100%);
    transform: rotate(20deg); pointer-events: none;
  }
  .dt-hero-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image: linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px);
    background-size: 40px 40px;
  }
  .dt-hero-deco { position: absolute; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.08); pointer-events: none; }
  .dt-hero-deco.d1 { width: 260px; height: 260px; right: -80px; bottom: -80px; }
  .dt-hero-deco.d2 { width: 140px; height: 140px; right: 100px; top: -50px; }
  .dt-hero-deco.d3 { width: 80px; height: 80px; left: 38%; top: -20px; opacity: 0.5; }

  .dt-hero-body { padding: 2.4rem 2.8rem 2.2rem; position: relative; z-index: 1; }

  /* Breadcrumb */
  .dt-bc { font-size: 0.72rem; color: rgba(255,255,255,0.45); margin-bottom: 1.3rem; display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
  .dt-bc a { color: rgba(255,255,255,0.65); text-decoration: none; font-weight: 600; transition: color 0.2s; }
  .dt-bc a:hover { color: #fff; }

  .dt-cat-pill {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.65rem; font-weight: 800; padding: 5px 13px; border-radius: 99px;
    background: rgba(79,110,247,0.3); border: 1px solid rgba(79,110,247,0.5); color: #a5b4fc;
    text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.9rem;
  }

  .dt-hero-title {
    font-family: var(--font-serif); font-size: clamp(1.8rem,3.5vw,2.6rem);
    font-weight: 700; color: #fff; margin: 0 0 0.8rem; line-height: 1.2; letter-spacing: -0.02em;
  }

  .dt-hero-meta { display: flex; align-items: center; gap: 1.2rem; flex-wrap: wrap; margin-bottom: 1.2rem; }
  .dt-hero-rating { display: flex; align-items: center; gap: 6px; }
  .dt-rating-num { font-family: var(--font-serif); font-size: 1.1rem; font-weight: 700; color: var(--yellow); }
  .dt-meta-chip {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.72rem; font-weight: 600; color: rgba(255,255,255,0.6);
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
    border-radius: 99px; padding: 4px 12px;
  }
  .dt-meta-chip b { color: rgba(255,255,255,0.9); font-weight: 700; }

  /* ── STAT CARDS ROW ── */
  .dt-stats-row {
    display: flex; gap: 0.8rem; flex-wrap: wrap; margin-top: 1.4rem;
    padding-top: 1.4rem; border-top: 1px solid rgba(255,255,255,0.1);
  }
  .dt-stat {
    display: flex; flex-direction: column; gap: 2px;
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px; padding: 0.7rem 1.1rem; flex: 1; min-width: 90px;
  }
  .dt-stat-val { font-family: var(--font-serif); font-size: 1.2rem; font-weight: 700; color: #fff; }
  .dt-stat-label { font-size: 0.65rem; font-weight: 600; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.09em; }

  /* ── SECTION CARDS ── */
  .dt-card {
    background: var(--white); border-radius: var(--radius);
    border: 1.5px solid var(--border); box-shadow: var(--shadow);
    padding: 1.8rem 2rem; margin-bottom: 1.3rem;
    animation: dt-up 0.5s both;
    position: relative; overflow: hidden;
  }
  .dt-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg,var(--blue),var(--purple));
    border-radius: 99px 99px 0 0;
    opacity: 0; transition: opacity 0.2s;
  }
  .dt-card:hover::before { opacity: 1; }

  .dt-section-title {
    font-size: 0.7rem; font-weight: 800; color: var(--text2);
    text-transform: uppercase; letter-spacing: 0.12em;
    display: flex; align-items: center; gap: 0.5rem; margin: 0 0 1.2rem;
  }
  .dt-section-title::after { content: ''; flex: 1; height: 1.5px; background: var(--border); }
  .dt-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  .dt-desc { font-size: 0.88rem; color: var(--text2); line-height: 1.8; white-space: pre-line; }

  /* Outcome / Requirement list */
  .dt-check-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
  .dt-check-item {
    display: flex; align-items: flex-start; gap: 10px;
    font-size: 0.85rem; color: var(--text2); line-height: 1.5;
    padding: 0.6rem 0.8rem; border-radius: 10px;
    transition: background 0.15s;
  }
  .dt-check-item:hover { background: var(--bg); }
  .dt-check-icon {
    width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; margin-top: 1px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.65rem; font-weight: 900;
  }
  .dt-check-icon.green { background: var(--green-light); color: var(--green); }
  .dt-check-icon.blue  { background: var(--blue-light);  color: var(--blue);  }

  /* Curriculum accordion */
  .dt-accordion .accordion-item {
    border: 1.5px solid var(--border) !important;
    border-radius: var(--radius-sm) !important;
    margin-bottom: 0.6rem; overflow: hidden;
    background: var(--white) !important;
  }
  .dt-accordion .accordion-button {
    font-family: var(--font) !important;
    font-weight: 700 !important; font-size: 0.88rem !important;
    color: var(--text) !important;
    background: var(--bg) !important;
    border-radius: 0 !important;
    box-shadow: none !important; padding: 1rem 1.2rem !important;
  }
  .dt-accordion .accordion-button:not(.collapsed) {
    background: var(--blue-light) !important;
    color: var(--blue) !important;
  }
  .dt-accordion .accordion-button::after { filter: none !important; }
  .dt-chap-meta { font-size: 0.7rem; color: var(--text3); font-weight: 500; margin-left: auto; white-space: nowrap; }

  .dt-lesson-item {
    display: flex; align-items: center; justify-content: space-between; gap: 0.8rem;
    padding: 0.75rem 1.2rem; border-bottom: 1px solid var(--border);
    transition: background 0.15s;
  }
  .dt-lesson-item:last-child { border-bottom: none; }
  .dt-lesson-item:hover { background: var(--blue-light); }
  .dt-lesson-left { display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--text2); font-weight: 500; flex: 1; min-width: 0; }
  .dt-lesson-icon { color: var(--blue); flex-shrink: 0; }
  .dt-lesson-right { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }
  .dt-preview-btn {
    font-size: 0.65rem; font-weight: 800; padding: 3px 10px; border-radius: 8px;
    background: var(--blue); color: #fff; text-decoration: none; cursor: pointer; border: none;
    transition: opacity 0.2s; white-space: nowrap;
  }
  .dt-preview-btn:hover { opacity: 0.8; color: #fff; }
  .dt-lesson-dur { font-size: 0.7rem; color: var(--text3); font-weight: 600; }
  .dt-curriculum-summary {
    display: flex; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 1.2rem;
  }
  .dt-cur-chip {
    font-size: 0.72rem; font-weight: 700; padding: 5px 12px; border-radius: 99px;
    border: 1.5px solid var(--border); background: var(--bg); color: var(--text2);
  }

  /* Reviews */
  .dt-review {
    display: flex; gap: 1rem; padding: 1.1rem 0; border-bottom: 1.5px solid var(--border);
    animation: dt-up 0.4s both;
  }
  .dt-review:last-child { border-bottom: none; padding-bottom: 0; }
  .dt-review-avatar {
    width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
    background: linear-gradient(135deg,var(--blue),var(--purple));
    display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem; font-weight: 800; color: #fff;
  }
  .dt-review-name { font-size: 0.88rem; font-weight: 800; color: var(--text); }
  .dt-review-date { font-size: 0.68rem; color: var(--text3); font-weight: 500; margin-left: 6px; }
  .dt-review-comment { font-size: 0.82rem; color: var(--text2); line-height: 1.6; margin-top: 0.3rem; }

  /* ── STICKY SIDEBAR ── */
  .dt-sidebar {
    position: sticky; top: 82px;
    animation: dt-up 0.5s 0.1s both;
  }
  .dt-enroll-card {
    background: var(--white); border-radius: var(--radius);
    border: 1.5px solid var(--border); box-shadow: 0 8px 40px rgba(79,110,247,0.14);
    overflow: hidden;
  }
  .dt-course-thumb {
    width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block;
    transition: transform 0.4s ease;
  }
  .dt-enroll-card:hover .dt-course-thumb { transform: scale(1.04); }
  .dt-thumb-wrap { overflow: hidden; position: relative; }
  .dt-thumb-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom,transparent 50%,rgba(14,18,36,0.6) 100%);
    display: flex; align-items: flex-end; padding: 1rem;
  }
  .dt-enroll-body { padding: 1.4rem 1.5rem; }
  .dt-price-row { display: flex; align-items: baseline; gap: 0.8rem; margin-bottom: 0.3rem; }
  .dt-price {
    font-family: var(--font-serif); font-size: 2.2rem; font-weight: 700; color: var(--text);
    line-height: 1;
  }
  .dt-cross-price {
    font-size: 1rem; color: var(--text3); text-decoration: line-through; font-weight: 500;
  }
  .dt-discount-chip {
    font-size: 0.65rem; font-weight: 800; padding: 3px 9px; border-radius: 8px;
    background: var(--orange-light); border: 1.5px solid #fcd9c5; color: var(--orange);
  }

  .dt-enroll-btn {
    width: 100%; padding: 14px; border-radius: 14px; border: none; cursor: pointer;
    font-family: var(--font); font-size: 0.95rem; font-weight: 800; color: #fff;
    background: linear-gradient(135deg,#4f6ef7,#7c5cbf);
    box-shadow: 0 8px 28px rgba(79,110,247,0.35);
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
    margin-top: 1.1rem; letter-spacing: 0.02em;
  }
  .dt-enroll-btn:hover {
    opacity: 0.88; transform: translateY(-2px);
    box-shadow: 0 16px 40px rgba(79,110,247,0.45);
  }
  .dt-enroll-btn:active { transform: translateY(0); }

  .dt-includes { padding: 1.2rem 1.5rem; border-top: 1.5px solid var(--border); }
  .dt-includes-title { font-size: 0.72rem; font-weight: 800; color: var(--text2); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.8rem; }
  .dt-include-item {
    display: flex; align-items: center; gap: 10px;
    font-size: 0.8rem; color: var(--text2); font-weight: 500;
    padding: 0.5rem 0; border-bottom: 1px solid var(--border);
  }
  .dt-include-item:last-child { border-bottom: none; }
  .dt-include-icon {
    width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 0.8rem;
  }

  /* Guarantee tag */
  .dt-guarantee {
    text-align: center; padding: 0.8rem 1.5rem; border-top: 1.5px solid var(--border);
    font-size: 0.72rem; color: var(--text3); font-weight: 600;
    display: flex; align-items: center; justify-content: center; gap: 5px;
  }

  /* ── Animations ── */
  @keyframes dt-up { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }

  @media (max-width: 991px) {
    .dt-sidebar { position: static; margin-top: 1.5rem; }
    .dt-hero-body { padding: 1.8rem 1.6rem 1.6rem; }
    .dt-hero-title { font-size: 1.7rem; }
    .dt-card { padding: 1.4rem 1.4rem; }
  }
  @media (max-width: 576px) {
    .dt-stats-row { gap: 0.5rem; }
    .dt-stat { padding: 0.6rem 0.8rem; }
    .dt-stat-val { font-size: 1rem; }
  }
`

export const Detail = () => {
  const [show, setShow] = useState(false)
  const [freeLesson, setFreeLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState(null)
  const params = useParams()
  const navigate = useNavigate()

  const handleClose = () => setShow(false)
  const handleShow = (lesson) => { setShow(true); setFreeLesson(lesson) }

  const fetchCourse = () => {
    setLoading(true)
    fetch(`${apiUrl}/fetch-course/${params.id}`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Accept: 'application/json' },
    })
      .then(res => res.json())
      .then(result => {
        setLoading(false)
        if (result.status == 200) setCourse(result.data)
        else console.log('Something went wrong')
      })
  }

  const enrollCourse = async () => {
    await fetch(`${apiUrl}/enroll-course`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ course_id: course.id }),
    })
      .then(async res => ({ status: res.status, data: await res.json() }))
      .then(({ status, data }) => {
        if (status == 200) toast.success(data.message)
        else if (status == 401) { toast.error('Please login to enroll this course'); navigate('/account/login') }
        else toast.error(data.message)
      })
  }

  useEffect(() => { if (params.id) fetchCourse() }, [params.id])

  const discountPct = course?.cross_price && course?.price
    ? Math.round((1 - course.price / course.cross_price) * 100)
    : null

  return (
    <Layout>
      <style>{css}</style>
      {freeLesson && <FreePreview show={show} handleClose={handleClose} freeLesson={freeLesson} />}

      <div className='dt-blob-wrap'>
        <div className='dt-blob dt-blob-1' /><div className='dt-blob dt-blob-2' />
      </div>

      <div className='dt-root'>
        {loading && <div className='container pt-5'><Loading /></div>}

        {!loading && course && (
          <div className='container dt-inner pb-5'>

            {/* ── HERO ── */}
            <div className='dt-hero'>
              <div className='dt-hero-shine' />
              <div className='dt-hero-grid' />
              <div className='dt-hero-deco d1' /><div className='dt-hero-deco d2' /><div className='dt-hero-deco d3' />
              <div className='dt-hero-body'>
                <div className='dt-bc'>
                  <a href='/'>Home</a><span>›</span>
                  <a href='/courses'>Courses</a><span>›</span>
                  <span style={{ color: 'rgba(255,255,255,0.75)' }}>{course.title}</span>
                </div>
                <div className='dt-cat-pill'>📂 {course?.category?.name || 'Course'}</div>
                <h1 className='dt-hero-title'>{course.title}</h1>
                <div className='dt-hero-meta'>
                  <div className='dt-hero-rating'>
                    <span className='dt-rating-num'>{course.rating || '4.0'}</span>
                    <Rating readonly initialValue={parseFloat(course.rating || 4)} size={18} />
                  </div>
                  <span className='dt-meta-chip'>👥 <b>{course.enrollments_count || 0}</b> students</span>
                  <span className='dt-meta-chip'>🌐 <b>{course.language?.name}</b></span>
                  <span className='dt-meta-chip'>📶 <b>{course.level?.name}</b></span>
                </div>
                <div className='dt-stats-row'>
                  <div className='dt-stat'>
                    <span className='dt-stat-val'>{course.chapters_count || 0}</span>
                    <span className='dt-stat-label'>Chapters</span>
                  </div>
                  <div className='dt-stat'>
                    <span className='dt-stat-val'>{course.total_lessons || 0}</span>
                    <span className='dt-stat-label'>Lessons</span>
                  </div>
                  <div className='dt-stat'>
                    <span className='dt-stat-val'>{convertMinutesToHours(course.total_duration || 0)}</span>
                    <span className='dt-stat-label'>Duration</span>
                  </div>
                  <div className='dt-stat'>
                    <span className='dt-stat-val'>{course.reviews?.length || 0}</span>
                    <span className='dt-stat-label'>Reviews</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── MAIN GRID ── */}
            <div className='row g-4'>
              <div className='col-lg-8'>

                {/* Overview */}
                <div className='dt-card' style={{ animationDelay: '0.1s' }}>
                  <div className='dt-section-title'><span className='dt-dot' style={{ background: 'var(--blue)' }} />Overview</div>
                  <div className='dt-desc'>{course.description}</div>
                </div>

                {/* What you'll learn */}
                {course.outcomes?.length > 0 && (
                  <div className='dt-card' style={{ animationDelay: '0.15s' }}>
                    <div className='dt-section-title'><span className='dt-dot' style={{ background: 'var(--green)' }} />What You Will Learn</div>
                    <ul className='dt-check-list'>
                      {course.outcomes.map((o, i) => (
                        <li key={i} className='dt-check-item'>
                          <span className='dt-check-icon green'>✓</span>
                          <span>{o.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Requirements */}
                {course.requirements?.length > 0 && (
                  <div className='dt-card' style={{ animationDelay: '0.2s' }}>
                    <div className='dt-section-title'><span className='dt-dot' style={{ background: 'var(--purple)' }} />Requirements</div>
                    <ul className='dt-check-list'>
                      {course.requirements.map((r, i) => (
                        <li key={i} className='dt-check-item'>
                          <span className='dt-check-icon blue'>→</span>
                          <span>{r.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Curriculum */}
                {course.chapters?.length > 0 && (
                  <div className='dt-card' style={{ animationDelay: '0.25s' }}>
                    <div className='dt-section-title'><span className='dt-dot' style={{ background: 'var(--yellow)' }} />Course Curriculum</div>
                    <div className='dt-curriculum-summary'>
                      <span className='dt-cur-chip'>📖 {course.chapters_count} Chapters</span>
                      <span className='dt-cur-chip'>🎬 {course.total_lessons} Lessons</span>
                      <span className='dt-cur-chip'>⏱ {convertMinutesToHours(course.total_duration)}</span>
                    </div>
                    <Accordion defaultActiveKey='0' className='dt-accordion'>
                      {course.chapters.map((chapter, index) => (
                        <Accordion.Item eventKey={String(index)} key={chapter.id || index}>
                          <Accordion.Header>
                            <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {chapter.title}
                            </span>
                            <span className='dt-chap-meta'>
                              {chapter.lessons_count} lessons · {convertMinutesToHours(chapter.lessons_sum_duration)}
                            </span>
                          </Accordion.Header>
                          <Accordion.Body style={{ padding: 0 }}>
                            {chapter.lessons?.map(lesson => (
                              <div key={lesson.id} className='dt-lesson-item'>
                                <div className='dt-lesson-left'>
                                  <LuMonitorPlay className='dt-lesson-icon' size={15} />
                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lesson.title}</span>
                                </div>
                                <div className='dt-lesson-right'>
                                  {lesson.is_free_preview === 'yes' && (
                                    <button className='dt-preview-btn' onClick={() => handleShow(lesson)}>
                                      ▶ Preview
                                    </button>
                                  )}
                                  <span className='dt-lesson-dur'>{convertMinutesToHours(lesson.duration)}</span>
                                </div>
                              </div>
                            ))}
                          </Accordion.Body>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  </div>
                )}

                {/* Reviews */}
                {course.reviews?.length > 0 && (
                  <div className='dt-card' style={{ animationDelay: '0.3s' }}>
                    <div className='dt-section-title'><span className='dt-dot' style={{ background: 'var(--orange)' }} />Student Reviews</div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text2)', marginBottom: '1rem' }}>What our students say about this course</p>
                    {course.reviews.map((review, idx) => (
                      <div key={review.id} className='dt-review' style={{ animationDelay: `${0.3 + idx * 0.05}s` }}>
                        <div className='dt-review-avatar'>
                          {(review.user?.name || 'U')[0].toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div>
                            <span className='dt-review-name'>{review.user?.name}</span>
                            <span className='dt-review-date'>{review.created_at}</span>
                          </div>
                          <Rating readonly initialValue={parseFloat(review.rating || 5)} size={15} />
                          <p className='dt-review-comment'>{review.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* ── SIDEBAR ── */}
              <div className='col-lg-4'>
                <div className='dt-sidebar'>
                  <div className='dt-enroll-card'>

                    {/* Thumbnail */}
                    <div className='dt-thumb-wrap'>
                      <img src={course.course_small_image} alt={course.title} className='dt-course-thumb' />
                      <div className='dt-thumb-overlay'>
                        {discountPct && (
                          <span style={{
                            fontSize: '0.7rem', fontWeight: 800, padding: '4px 10px', borderRadius: '8px',
                            background: 'var(--orange)', color: '#fff'
                          }}>{discountPct}% OFF</span>
                        )}
                      </div>
                    </div>

                    {/* Price + enroll */}
                    <div className='dt-enroll-body'>
                      <div className='dt-price-row'>
                        <span className='dt-price'>${course.price}</span>
                        {course.cross_price && <span className='dt-cross-price'>${course.cross_price}</span>}
                        {discountPct && <span className='dt-discount-chip'>{discountPct}% off</span>}
                      </div>
                      {course.cross_price && (
                        <p style={{ fontSize: '0.72rem', color: 'var(--orange)', fontWeight: 700, margin: '0.2rem 0 0' }}>
                          ⚡ Limited time offer
                        </p>
                      )}
                      <button onClick={enrollCourse} className='dt-enroll-btn'>
                        🎓 Enroll Now
                      </button>
                    </div>

                    {/* What's included */}
                    <div className='dt-includes'>
                      <div className='dt-includes-title'>This course includes</div>
                      {[
                        { icon: '♾️', bg: '#eef0ff', label: 'Full lifetime access' },
                        { icon: '📱', bg: '#e6faf3', label: 'Access on mobile and TV' },
                        { icon: '🏆', bg: '#fff8e6', label: 'Certificate of completion' },
                        { icon: '🎬', bg: '#fff2ee', label: `${course.total_lessons || 0} video lessons` },
                        { icon: '⏱', bg: '#f5f0ff', label: `${convertMinutesToHours(course.total_duration || 0)} content` },
                      ].map((item, i) => (
                        <div key={i} className='dt-include-item'>
                          <span className='dt-include-icon' style={{ background: item.bg }}>{item.icon}</span>
                          {item.label}
                        </div>
                      ))}
                    </div>

                    {/* Guarantee */}
                    <div className='dt-guarantee'>
                      🔒 30-Day Money-Back Guarantee
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}