import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import UserSidebar from '../../common/UserSidebar'
import toast from 'react-hot-toast'
import { apiUrl } from '../../common/Config'
import { AuthContext } from '../../context/Auth'
import { Link } from 'react-router-dom'

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

  .ct-root {
    background: var(--bg);
    min-height: 100vh;
    font-family: var(--font);
    padding-bottom: 4rem;
    color: var(--text);
    position: relative;
  }

  .ct-blob-wrap { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
  .ct-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.25; }
  .ct-blob-1 { width: 500px; height: 500px; background: radial-gradient(circle,#c7d0ff,#a5b4fc); top: -150px; right: -100px; animation: blob-float 10s ease-in-out infinite alternate; }
  .ct-blob-2 { width: 360px; height: 360px; background: radial-gradient(circle,#ffd5c5,#ffb3a0); bottom: 0; left: -80px; animation: blob-float 14s ease-in-out infinite alternate-reverse; }
  .ct-blob-3 { width: 220px; height: 220px; background: radial-gradient(circle,#fff3b5,#fde68a); top: 40%; right: 15%; animation: blob-float 9s ease-in-out infinite alternate; }
  @keyframes blob-float { from{transform:translate(0,0) scale(1);} to{transform:translate(28px,18px) scale(1.1);} }

  .ct-inner { position: relative; z-index: 1; padding-top: 1.5rem; }

  /* Hero */
  .ct-hero {
    background: linear-gradient(135deg,#4f6ef7 0%,#7c5cbf 55%,#a855f7 100%);
    border-radius: 28px; padding: 2rem 2.4rem;
    margin-bottom: 1.8rem; position: relative; overflow: hidden;
    box-shadow: 0 20px 60px rgba(79,110,247,0.32);
    animation: ct-up 0.6s cubic-bezier(0.22,1,0.36,1) both;
    display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
  }
  .ct-hero::before {
    content: ''; position: absolute; top: -60%; left: -20%; width: 60%; height: 200%;
    background: linear-gradient(105deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.1) 50%,rgba(255,255,255,0) 100%);
    transform: rotate(25deg); pointer-events: none;
  }
  .ct-hero-deco { position: absolute; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.12); pointer-events: none; }
  .ct-hero-deco.d1 { width: 200px; height: 200px; right: -60px; bottom: -60px; }
  .ct-hero-deco.d2 { width: 110px; height: 110px; right: 80px; top: -40px; }
  .ct-hero-left { position: relative; z-index: 1; }
  .ct-hero-title { font-size: 1.5rem; font-weight: 800; color: #fff; margin: 0; letter-spacing: -0.02em; }
  .ct-hero-sub { font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-top: 0.3rem; }
  .ct-hero-right { position: relative; z-index: 1; display: flex; align-items: center; gap: 0.7rem; flex-wrap: wrap; }
  .ct-count-badge {
    font-family: var(--font-serif); font-size: 1.8rem; font-weight: 700; color: #fff;
    background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.25);
    border-radius: 14px; padding: 6px 18px; line-height: 1;
    backdrop-filter: blur(8px);
  }

  /* Tip card */
  .ct-tip {
    background: var(--white); border-radius: var(--radius);
    border: 1.5px solid var(--border); box-shadow: var(--shadow);
    padding: 1rem 1.4rem; margin-bottom: 1.6rem;
    display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
    animation: ct-up 0.5s 0.05s both;
    position: relative; overflow: hidden;
  }
  .ct-tip::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg,var(--yellow),var(--orange));
  }
  .ct-tip-left { display: flex; align-items: center; gap: 10px; }
  .ct-tip-icon {
    width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
    background: var(--yellow-light); border: 1.5px solid #fde68a;
    display: flex; align-items: center; justify-content: center; font-size: 1rem;
  }
  .ct-tip-text { font-size: 0.82rem; color: var(--text2); font-weight: 600; }
  .ct-tip-text b { color: var(--text); }
  .ct-my-courses-btn {
    font-size: 0.75rem; font-weight: 800; color: var(--blue);
    text-decoration: none; padding: 7px 16px; border-radius: 11px;
    background: var(--blue-light); border: 1.5px solid var(--blue-mid);
    display: inline-flex; align-items: center; gap: 5px; white-space: nowrap;
    transition: background 0.2s, color 0.2s;
  }
  .ct-my-courses-btn:hover { background: var(--blue); color: #fff; border-color: var(--blue); }

  /* Grid */
  .ct-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr));
    gap: 1.3rem;
  }

  /* Certificate card */
  .ct-card {
    background: var(--white); border-radius: var(--radius);
    border: 1.5px solid var(--border); box-shadow: var(--shadow);
    overflow: hidden; display: flex; flex-direction: column;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s, border-color 0.2s;
    animation: ct-up 0.5s both; position: relative;
  }
  .ct-card:hover { transform: translateY(-8px) scale(1.015); box-shadow: var(--shadow-hover); border-color: #c7d0ff; }

  /* Decorative certificate top band */
  .ct-card-band {
    padding: 1.4rem 1.5rem 1.2rem; position: relative; overflow: hidden;
    background: linear-gradient(135deg,var(--yellow-light),var(--orange-light));
    border-bottom: 1.5px solid var(--border);
  }
  .ct-card-band::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3.5px;
    background: linear-gradient(90deg,var(--yellow),var(--orange),var(--yellow));
    background-size: 200% 100%; animation: band-shine 3s linear infinite;
  }
  @keyframes band-shine { 0%{background-position:0% 0;} 100%{background-position:200% 0;} }
  .ct-card-band-revoked {
    background: linear-gradient(135deg,#fef2f2,#fee2e2);
    border-bottom-color: #fca5a5;
  }
  .ct-card-band-revoked::before { background: linear-gradient(90deg,#ef4444,#f87171); animation: none; }

  .ct-thumb {
    width: 52px; height: 52px; border-radius: 13px;
    overflow: hidden; flex-shrink: 0; border: 2px solid rgba(255,255,255,0.8);
    box-shadow: 0 4px 14px rgba(0,0,0,0.12);
    background: var(--white); display: flex; align-items: center; justify-content: center;
    font-size: 1.6rem; transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .ct-card:hover .ct-thumb { transform: scale(1.1) rotate(-5deg); }
  .ct-thumb img { width: 100%; height: 100%; object-fit: cover; }

  .ct-band-row { display: flex; align-items: flex-start; gap: 10px; }
  .ct-band-info { flex: 1; min-width: 0; }
  .ct-course-title { font-size: 0.92rem; font-weight: 800; color: var(--text); margin: 0; line-height: 1.3;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ct-status-chip {
    font-size: 0.6rem; font-weight: 800; padding: 3px 9px; border-radius: 99px;
    text-transform: uppercase; letter-spacing: 0.08em; flex-shrink: 0; margin-top: 2px;
  }
  .ct-status-chip.issued { background: var(--green-light); border: 1.5px solid #a7f3d0; color: #065f46; }
  .ct-status-chip.revoked { background: #fee2e2; border: 1.5px solid #fca5a5; color: #991b1b; }

  /* Cert number display */
  .ct-cert-num {
    margin-top: 0.8rem;
    font-size: 0.68rem; font-weight: 700; color: var(--text3);
    text-transform: uppercase; letter-spacing: 0.1em;
    display: flex; align-items: center; gap: 6px;
  }
  .ct-cert-num b {
    font-family: var(--font-serif); font-size: 0.85rem; color: var(--text2);
    font-style: italic; letter-spacing: 0;
  }

  /* Card body */
  .ct-card-body { padding: 1.1rem 1.5rem 1.4rem; display: flex; flex-direction: column; gap: 0.8rem; flex: 1; }
  .ct-meta-row { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: var(--text2); font-weight: 600; }
  .ct-meta-row span { color: var(--text3); }
  .ct-meta-row b { color: var(--text); }

  .ct-note { font-size: 0.7rem; color: var(--text3); font-weight: 600; line-height: 1.5; }

  /* Download button */
  .ct-download-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 7px;
    width: 100%; padding: 10px; border-radius: 12px; border: none; cursor: pointer;
    font-family: var(--font); font-size: 0.83rem; font-weight: 800; color: #fff;
    background: linear-gradient(135deg,var(--blue),var(--purple));
    box-shadow: 0 4px 16px rgba(79,110,247,0.25);
    transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
    margin-top: auto;
  }
  .ct-download-btn:hover:not(:disabled) {
    opacity: 0.88; transform: translateY(-1px); box-shadow: 0 8px 28px rgba(79,110,247,0.35);
  }
  .ct-download-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .ct-download-btn.revoked-btn {
    background: #f1f5f9; color: var(--text3); box-shadow: none;
  }

  /* Spinning loader inside button */
  .ct-spin { display: inline-block; width: 14px; height: 14px; border: 2.5px solid rgba(255,255,255,0.35); border-top-color: #fff; border-radius: 50%; animation: ct-spin 0.7s linear infinite; }
  @keyframes ct-spin { to{transform:rotate(360deg);} }

  /* Empty state */
  .ct-empty {
    background: var(--white); border-radius: var(--radius);
    border: 1.5px dashed var(--border); box-shadow: var(--shadow);
    padding: 4rem 2rem; text-align: center;
    animation: ct-up 0.5s both;
  }
  .ct-empty-icon { font-size: 3rem; opacity: 0.3; margin-bottom: 0.8rem; }
  .ct-empty-title { font-size: 1rem; font-weight: 800; color: var(--text); margin-bottom: 0.4rem; }
  .ct-empty-sub { font-size: 0.82rem; color: var(--text2); margin: 0; }

  /* Skeleton */
  .ct-skeleton { border-radius: var(--radius); height: 260px;
    background: linear-gradient(90deg,#e8ecff 0%,#f0f4ff 50%,#e8ecff 100%);
    background-size: 700px 100%; animation: shimmer 1.6s infinite;
    border: 1.5px solid var(--border); }
  @keyframes shimmer { 0%{background-position:-700px 0;} 100%{background-position:700px 0;} }
  @keyframes ct-up { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }

  @media (max-width: 600px) {
    .ct-hero { flex-direction: column; }
    .ct-grid { grid-template-columns: 1fr; }
  }
`

const Certificates = () => {
  const { user } = useContext(AuthContext)
  const authToken = user?.token || user?.user?.token

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [downloadingId, setDownloadingId] = useState(null)

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${apiUrl}/certificates`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${authToken}` },
      })
      const result = await res.json()
      if (result.status === 200) setItems(result.data || [])
      else toast.error(result.message || 'Failed to load certificates')
    } catch (e) {
      console.log(e); toast.error('Server error loading certificates')
    } finally { setLoading(false) }
  }

  const downloadPdf = async (cert) => {
    try {
      setDownloadingId(cert.id)
      const res = await fetch(`${apiUrl}/certificates/${cert.id}/download`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${authToken}`, Accept: 'application/pdf' },
      })
      if (!res.ok) {
        let msg = 'Failed to download PDF'
        try { const j = await res.json(); msg = j.message || msg } catch {}
        toast.error(msg); return
      }
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `Certificate-${cert.certificate_no}.pdf`
      document.body.appendChild(a); a.click(); a.remove()
      window.URL.revokeObjectURL(url)
      toast.success('Certificate downloaded!')
    } catch (e) {
      console.log(e); toast.error('Server error downloading certificate')
    } finally { setDownloadingId(null) }
  }

  useEffect(() => { if (authToken) load() }, [authToken])

  const issuedCount = items.filter(c => c.status === 'issued').length

  return (
    <Layout>
      <style>{css}</style>
      <div className='ct-blob-wrap'>
        <div className='ct-blob ct-blob-1' /><div className='ct-blob ct-blob-2' /><div className='ct-blob ct-blob-3' />
      </div>

      <div className='ct-root'>
        <div className='container ct-inner'>
          <div className='row g-4'>
            <div className='col-lg-3'>
              <UserSidebar />
            </div>

            <div className='col-lg-9'>

              {/* Hero */}
              <div className='ct-hero'>
                <div className='ct-hero-deco d1' /><div className='ct-hero-deco d2' />
                <div className='ct-hero-left'>
                  <div className='ct-hero-title'>🏆 My Certificates</div>
                  <div className='ct-hero-sub'>Automatically issued when your course progress reaches 100%.</div>
                </div>
                <div className='ct-hero-right'>
                  {!loading && items.length > 0 && (
                    <div className='ct-count-badge'>{issuedCount}</div>
                  )}
                </div>
              </div>

              {/* Tip */}
              <div className='ct-tip'>
                <div className='ct-tip-left'>
                  <div className='ct-tip-icon'>💡</div>
                  <div className='ct-tip-text'>
                    <b>Pro tip:</b> Add certificates to your CV &amp; LinkedIn profile. Share proof links with employers.
                  </div>
                </div>
                <Link className='ct-my-courses-btn' to='/account/student/my-learning'>
                  My Courses →
                </Link>
              </div>

              {/* Content */}
              {loading ? (
                <div className='ct-grid'>
                  {[1,2,3,4].map(i => <div key={i} className='ct-skeleton' />)}
                </div>
              ) : items.length === 0 ? (
                <div className='ct-empty'>
                  <div className='ct-empty-icon'>🎓</div>
                  <div className='ct-empty-title'>No certificates yet</div>
                  <p className='ct-empty-sub'>Complete a course to unlock your first certificate.</p>
                  <Link to='/account/student/my-learning' className='ct-my-courses-btn' style={{ marginTop: '1rem', display: 'inline-flex' }}>
                    Go to My Courses →
                  </Link>
                </div>
              ) : (
                <div className='ct-grid'>
                  {items.map((c, idx) => {
                    const issued = c.status === 'issued'
                    return (
                      <div key={c.id} className='ct-card' style={{ animationDelay: `${idx * 0.06}s` }}>

                        {/* Band */}
                        <div className={`ct-card-band${issued ? '' : ' ct-card-band-revoked'}`}>
                          <div className='ct-band-row'>
                            <div className='ct-thumb'>
                              {c.course?.course_small_image
                                ? <img src={c.course.course_small_image} alt='' />
                                : '🎓'}
                            </div>
                            <div className='ct-band-info'>
                              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px' }}>
                                <div className='ct-course-title'>{c.course?.title || 'Course'}</div>
                                <span className={`ct-status-chip ${issued ? 'issued' : 'revoked'}`}>
                                  {issued ? '✓ Issued' : '✗ Revoked'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className='ct-cert-num'>
                            Cert No: <b>{c.certificate_no}</b>
                          </div>
                        </div>

                        {/* Body */}
                        <div className='ct-card-body'>
                          <div className='ct-meta-row'>
                            <span>📅 Issued:</span>
                            <b>{c.issued_at ? new Date(c.issued_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</b>
                          </div>

                          <div className='ct-note'>
                            🔒 Your certificate is stored permanently — even if the course updates later.
                          </div>

                          {issued ? (
                            <button
                              className='ct-download-btn'
                              onClick={() => downloadPdf(c)}
                              disabled={downloadingId === c.id}
                            >
                              {downloadingId === c.id
                                ? <><span className='ct-spin' /> Generating PDF…</>
                                : <>⬇ Download Certificate PDF</>}
                            </button>
                          ) : (
                            <button className='ct-download-btn revoked-btn' disabled>
                              Certificate Revoked
                            </button>
                          )}
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

export default Certificates