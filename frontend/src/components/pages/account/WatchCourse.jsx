import React, { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import Accordion from 'react-bootstrap/Accordion'
import { MdSlowMotionVideo } from 'react-icons/md'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { apiUrl, token } from '../../common/Config'
import { Link, useParams } from 'react-router-dom'
import ReactPlayer from 'react-player'
import toast from 'react-hot-toast'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,400&display=swap');

  :root {
    --bg: #0a0d1f;
    --bg2: #0e1230;
    --bg3: #131840;
    --surface: #141836;
    --surface2: #1a1f45;
    --surface3: #1e2550;
    --blue: #4f6ef7;
    --blue-light: rgba(79,110,247,0.15);
    --blue-mid: rgba(79,110,247,0.3);
    --purple: #7c5cbf;
    --green: #22c98e;
    --green-light: rgba(34,201,142,0.15);
    --yellow: #ffb020;
    --yellow-light: rgba(255,176,32,0.15);
    --orange: #ff7140;
    --text: #f1f5ff;
    --text2: #8892b0;
    --text3: #4a5380;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.12);
    --radius: 18px;
    --radius-sm: 12px;
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
    --font: 'Plus Jakarta Sans', sans-serif;
    --font-serif: 'Fraunces', serif;
    --sidebar-w: 340px;
  }

  /* ─── Full dark layout ─── */
  .wc-root {
    background: var(--bg);
    min-height: 100vh;
    font-family: var(--font);
    color: var(--text);
    display: flex; flex-direction: column;
  }

  /* ─── Top bar ─── */
  .wc-topbar {
    background: var(--bg2);
    border-bottom: 1px solid var(--border);
    padding: 0.75rem 1.5rem;
    display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
    position: sticky; top: 0; z-index: 100;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  }
  .wc-back-btn {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 0.72rem; font-weight: 700; color: var(--text2);
    text-decoration: none; padding: 6px 12px; border-radius: 9px;
    background: var(--surface2); border: 1px solid var(--border);
    transition: all 0.2s; flex-shrink: 0;
  }
  .wc-back-btn:hover { color: var(--text); border-color: var(--border2); }
  .wc-topbar-title {
    font-size: 0.88rem; font-weight: 700; color: var(--text);
    flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .wc-topbar-progress {
    display: flex; align-items: center; gap: 10px; flex-shrink: 0;
  }
  .wc-progress-track {
    width: 160px; height: 6px; border-radius: 99px;
    background: var(--surface3); overflow: hidden; position: relative;
  }
  .wc-progress-fill {
    height: 100%; border-radius: 99px;
    background: linear-gradient(90deg,var(--blue),var(--green));
    transition: width 0.7s cubic-bezier(0.22,1,0.36,1);
    position: relative;
  }
  .wc-progress-fill::after {
    content: ''; position: absolute; right: 0; top: 50%; transform: translateY(-50%);
    width: 10px; height: 10px; border-radius: 50%;
    background: var(--green); box-shadow: 0 0 8px rgba(34,201,142,0.8);
  }
  .wc-progress-pct {
    font-size: 0.72rem; font-weight: 800; color: var(--green);
    white-space: nowrap;
  }

  /* ─── Main grid ─── */
  .wc-body {
    display: flex; flex: 1; min-height: 0;
    overflow: hidden;
  }

  /* ─── Video area ─── */
  .wc-video-col {
    flex: 1; min-width: 0;
    display: flex; flex-direction: column;
    overflow-y: auto;
  }

  .wc-player-wrap {
    background: #000;
    position: relative; width: 100%;
    aspect-ratio: 16/9;
    flex-shrink: 0;
  }
  .wc-player-wrap > div { width: 100% !important; height: 100% !important; }

  /* Lesson meta below player */
  .wc-lesson-meta {
    padding: 1.4rem 2rem 2rem;
    border-bottom: 1px solid var(--border);
    background: var(--bg2);
  }
  .wc-lesson-header {
    display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
    margin-bottom: 1rem;
  }
  .wc-lesson-title {
    font-family: var(--font-serif); font-size: 1.5rem; font-weight: 700; color: var(--text);
    margin: 0; line-height: 1.2; letter-spacing: -0.02em;
  }

  /* Mark complete button */
  .wc-complete-btn {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 0.8rem; font-weight: 800; color: #fff;
    padding: 10px 20px; border-radius: 12px; border: none; cursor: pointer;
    font-family: var(--font);
    background: linear-gradient(135deg,var(--blue),var(--purple));
    box-shadow: 0 4px 16px rgba(79,110,247,0.35);
    transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
    white-space: nowrap; flex-shrink: 0;
  }
  .wc-complete-btn:hover:not(.done) { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(79,110,247,0.45); }
  .wc-complete-btn.done {
    background: var(--green-light);
    border: 1.5px solid rgba(34,201,142,0.4);
    color: var(--green); box-shadow: none; cursor: default;
  }

  .wc-lesson-desc {
    font-size: 0.88rem; color: var(--text2); line-height: 1.8;
    margin-top: 0.5rem;
  }
  .wc-lesson-desc * { color: var(--text2) !important; font-family: var(--font) !important; }

  /* Lesson nav (prev / next) */
  .wc-lesson-nav {
    display: flex; gap: 0.6rem; padding: 1rem 2rem;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
  }
  .wc-nav-btn {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 0.75rem; font-weight: 700; color: var(--text2);
    padding: 7px 14px; border-radius: 10px; cursor: pointer;
    background: var(--surface); border: 1px solid var(--border);
    transition: all 0.2s; font-family: var(--font);
    text-decoration: none;
  }
  .wc-nav-btn:hover { color: var(--text); border-color: var(--border2); background: var(--surface2); }
  .wc-nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  /* Empty player state */
  .wc-empty-player {
    width: 100%; aspect-ratio: 16/9; background: var(--bg3);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 0.8rem;
  }
  .wc-empty-player-icon { font-size: 3rem; opacity: 0.3; }
  .wc-empty-player-text { font-size: 0.85rem; color: var(--text2); font-weight: 600; }

  /* ─── Sidebar ─── */
  .wc-sidebar {
    width: var(--sidebar-w); flex-shrink: 0;
    background: var(--bg2);
    border-left: 1px solid var(--border);
    display: flex; flex-direction: column;
    overflow: hidden;
  }
  .wc-sidebar-header {
    padding: 1rem 1.2rem 0.8rem;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .wc-sidebar-course-title {
    font-size: 0.82rem; font-weight: 800; color: var(--text);
    line-height: 1.3; margin-bottom: 0.6rem;
  }
  .wc-sidebar-stats {
    display: flex; gap: 0.5rem; flex-wrap: wrap;
  }
  .wc-sidebar-chip {
    font-size: 0.62rem; font-weight: 700; padding: 3px 9px; border-radius: 99px;
    background: var(--surface2); border: 1px solid var(--border2); color: var(--text2);
  }
  .wc-sidebar-chip.blue { background: var(--blue-light); border-color: var(--blue-mid); color: #818cf8; }
  .wc-sidebar-chip.green { background: var(--green-light); border-color: rgba(34,201,142,0.3); color: var(--green); }

  .wc-sidebar-scroll {
    flex: 1; overflow-y: auto; padding: 0.6rem 0;
  }
  .wc-sidebar-scroll::-webkit-scrollbar { width: 4px; }
  .wc-sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
  .wc-sidebar-scroll::-webkit-scrollbar-thumb { background: var(--surface3); border-radius: 99px; }

  /* Chapter */
  .wc-chapter {
    margin-bottom: 0.2rem;
  }
  .wc-chapter-header {
    display: flex; align-items: center; gap: 8px; justify-content: space-between;
    padding: 0.7rem 1.2rem; cursor: pointer;
    transition: background 0.15s;
  }
  .wc-chapter-header:hover { background: var(--surface); }
  .wc-chapter-title {
    font-size: 0.78rem; font-weight: 800; color: var(--text2); flex: 1; min-width: 0;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .wc-chapter-count {
    font-size: 0.62rem; font-weight: 700; color: var(--text3);
    background: var(--surface2); border-radius: 99px; padding: 2px 7px; flex-shrink: 0;
  }
  .wc-chapter-arrow {
    color: var(--text3); font-size: 0.65rem; flex-shrink: 0;
    transition: transform 0.2s;
  }
  .wc-chapter-arrow.open { transform: rotate(90deg); }

  /* Lesson row */
  .wc-lesson-row {
    display: flex; align-items: center; gap: 10px;
    padding: 0.65rem 1.2rem 0.65rem 1.5rem;
    cursor: pointer; text-decoration: none;
    transition: background 0.15s; position: relative;
  }
  .wc-lesson-row::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    background: var(--blue); border-radius: 0 3px 3px 0;
    opacity: 0; transition: opacity 0.15s;
  }
  .wc-lesson-row:hover { background: var(--surface); }
  .wc-lesson-row.active { background: var(--surface2); }
  .wc-lesson-row.active::before { opacity: 1; }

  .wc-lesson-check {
    width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    border: 1.5px solid var(--surface3);
    background: var(--surface); font-size: 0.65rem; color: var(--text3);
    transition: all 0.2s;
  }
  .wc-lesson-check.completed {
    background: var(--green-light); border-color: rgba(34,201,142,0.4);
    color: var(--green); font-size: 0.8rem;
  }
  .wc-lesson-check.active-ring {
    border-color: var(--blue); color: var(--blue);
    box-shadow: 0 0 10px rgba(79,110,247,0.4);
  }

  .wc-lesson-row-title {
    flex: 1; min-width: 0; font-size: 0.78rem; font-weight: 600; color: var(--text2);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    transition: color 0.15s;
  }
  .wc-lesson-row.active .wc-lesson-row-title,
  .wc-lesson-row:hover .wc-lesson-row-title { color: var(--text); }
  .wc-lesson-row-title.completed { color: var(--green) !important; }

  /* Play indicator on active */
  .wc-play-dot {
    width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0;
    background: var(--blue); display: flex; align-items: center; justify-content: center;
    font-size: 0.5rem; color: #fff;
    animation: play-pulse 2s ease-in-out infinite;
  }
  @keyframes play-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(79,110,247,0.4);} 50%{box-shadow:0 0 0 6px rgba(79,110,247,0);} }

  /* Loading skeleton */
  .wc-skeleton {
    border-radius: 12px;
    background: linear-gradient(90deg,var(--surface) 0%,var(--surface2) 50%,var(--surface) 100%);
    background-size: 700px 100%; animation: shimmer 1.6s infinite;
  }
  @keyframes shimmer { 0%{background-position:-700px 0;} 100%{background-position:700px 0;} }

  /* Mobile responsive */
  @media (max-width: 900px) {
    .wc-body { flex-direction: column; }
    .wc-sidebar { width: 100%; border-left: none; border-top: 1px solid var(--border); max-height: 50vh; }
    .wc-topbar-progress { display: none; }
    .wc-lesson-meta { padding: 1rem 1rem 1.2rem; }
    .wc-lesson-nav { padding: 0.8rem 1rem; }
  }
`

const WatchCourse = () => {
  const [course, setCourse] = useState(null)
  const [activeLesson, setActiveLesson] = useState(null)
  const [completedLessons, setCompletedLessons] = useState([])
  const [progress, setProgress] = useState(0)
  const [openChapters, setOpenChapters] = useState({})
  const params = useParams()

  const fetchCourse = async () => {
    await fetch(`${apiUrl}/enroll/${params.id}`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(result => {
        if (result.status == 200) {
          setCourse(result.data)
          setActiveLesson(result.activeLesson)
          setCompletedLessons(result.completedLessons)
          setProgress(result.progress)
          // open active chapter by default
          if (result.activeLesson?.chapter_id) {
            setOpenChapters({ [result.activeLesson.chapter_id]: true })
          }
        }
      })
  }

  const showLesson = async (lesson) => {
    setActiveLesson(lesson)
    setOpenChapters(p => ({ ...p, [lesson.chapter_id]: true }))
    const data = { lesson_id: lesson.id, chapter_id: lesson.chapter_id, course_id: params.id }
    await fetch(`${apiUrl}/save-activity`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    })
  }

  const markAsComplete = async (lesson) => {
    const data = { lesson_id: lesson.id, chapter_id: lesson.chapter_id, course_id: params.id }
    await fetch(`${apiUrl}/mark-as-complete`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(result => {
        if (result.status == 200) {
          toast.success(result.message)
          setCompletedLessons(result.completedLessons)
          setProgress(result.progress)
        }
      })
  }

  // Flat list of all lessons for prev/next
  const allLessons = course?.chapters?.flatMap(ch => ch.lessons || []) || []
  const currentIdx = allLessons.findIndex(l => l.id === activeLesson?.id)
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null

  const totalLessons = allLessons.length
  const completedCount = completedLessons.length

  useEffect(() => { fetchCourse() }, [])

  return (
    <Layout>
      <style>{css}</style>
      <div className='wc-root'>

        {/* ─── TOP BAR ─── */}
        <div className='wc-topbar'>
          <Link to='/account/student/my-learning' className='wc-back-btn'>← Back</Link>
          <div className='wc-topbar-title'>
            {course?.title || 'Loading…'}
          </div>
          {course && (
            <div className='wc-topbar-progress'>
              <div className='wc-progress-track'>
                <div className='wc-progress-fill' style={{ width: `${progress}%` }} />
              </div>
              <span className='wc-progress-pct'>{progress}%</span>
            </div>
          )}
        </div>

        {/* ─── BODY ─── */}
        <div className='wc-body'>

          {/* Video column */}
          <div className='wc-video-col'>

            {/* Player */}
            <div className='wc-player-wrap'>
              {activeLesson?.video_url ? (
                <ReactPlayer
                  width='100%' height='100%'
                  controls
                  config={{ file: { attributes: { controlsList: 'nodownload' } } }}
                  url={activeLesson.video_url}
                />
              ) : (
                <div className='wc-empty-player'>
                  <div className='wc-empty-player-icon'>▶</div>
                  <div className='wc-empty-player-text'>Select a lesson to start watching</div>
                </div>
              )}
            </div>

            {/* Lesson nav */}
            {activeLesson && (
              <div className='wc-lesson-nav'>
                <button
                  className='wc-nav-btn'
                  disabled={!prevLesson}
                  onClick={() => prevLesson && showLesson(prevLesson)}
                >
                  ← Previous
                </button>
                <button
                  className='wc-nav-btn'
                  disabled={!nextLesson}
                  onClick={() => nextLesson && showLesson(nextLesson)}
                  style={{ marginLeft: 'auto' }}
                >
                  Next →
                </button>
              </div>
            )}

            {/* Lesson meta */}
            {activeLesson && (
              <div className='wc-lesson-meta'>
                <div className='wc-lesson-header'>
                  <h2 className='wc-lesson-title'>{activeLesson.title}</h2>
                  <button
                    className={`wc-complete-btn${completedLessons.includes(activeLesson.id) ? ' done' : ''}`}
                    onClick={() => !completedLessons.includes(activeLesson.id) && markAsComplete(activeLesson)}
                  >
                    <IoMdCheckmarkCircleOutline size={17} />
                    {completedLessons.includes(activeLesson.id) ? 'Completed!' : 'Mark Complete'}
                  </button>
                </div>
                {activeLesson.description && (
                  <div
                    className='wc-lesson-desc'
                    dangerouslySetInnerHTML={{ __html: activeLesson.description }}
                  />
                )}
              </div>
            )}

          </div>

          {/* ─── Sidebar ─── */}
          {course && (
            <div className='wc-sidebar'>
              <div className='wc-sidebar-header'>
                <div className='wc-sidebar-course-title'>{course.title}</div>
                <div className='wc-sidebar-stats'>
                  <span className='wc-sidebar-chip blue'>📖 {course.chapters?.length || 0} Chapters</span>
                  <span className='wc-sidebar-chip'>🎬 {totalLessons} Lessons</span>
                  <span className={`wc-sidebar-chip${completedCount === totalLessons && totalLessons > 0 ? ' green' : ''}`}>
                    ✓ {completedCount}/{totalLessons} Done
                  </span>
                </div>
              </div>

              <div className='wc-sidebar-scroll'>
                {course.chapters?.map(chapter => {
                  const isOpen = !!openChapters[chapter.id]
                  const chapterCompleted = chapter.lessons?.filter(l => completedLessons.includes(l.id)).length || 0
                  return (
                    <div key={chapter.id} className='wc-chapter'>
                      <div
                        className='wc-chapter-header'
                        onClick={() => setOpenChapters(p => ({ ...p, [chapter.id]: !p[chapter.id] }))}
                      >
                        <div className='wc-chapter-title'>{chapter.title}</div>
                        <span className='wc-chapter-count'>{chapterCompleted}/{chapter.lessons?.length || 0}</span>
                        <span className={`wc-chapter-arrow${isOpen ? ' open' : ''}`}>▶</span>
                      </div>

                      {isOpen && chapter.lessons?.map(lesson => {
                        const isActive = activeLesson?.id === lesson.id
                        const isDone = completedLessons.includes(lesson.id)
                        return (
                          <div
                            key={lesson.id}
                            className={`wc-lesson-row${isActive ? ' active' : ''}`}
                            onClick={() => showLesson(lesson)}
                          >
                            <div className={`wc-lesson-check${isDone ? ' completed' : isActive ? ' active-ring' : ''}`}>
                              {isDone ? '✓' : isActive ? '▶' : ''}
                            </div>
                            <span className={`wc-lesson-row-title${isDone ? ' completed' : ''}`}>
                              {lesson.title}
                            </span>
                            {isActive && <div className='wc-play-dot'>▶</div>}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  )
}

export default WatchCourse