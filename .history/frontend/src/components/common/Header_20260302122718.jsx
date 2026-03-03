import React, { useContext, useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/Auth'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,400&display=swap');

  :root {
    --blue: #4f6ef7;
    --blue-light: #eef0ff;
    --blue-mid: #dde2ff;
    --purple: #7c5cbf;
    --text: #14142b;
    --text2: #6e7191;
    --border: #e4e7f4;
    --bg: #f0f4ff;
    --font: 'Plus Jakarta Sans', sans-serif;
    --font-serif: 'Fraunces', serif;
  }

  .hdr-wrap {
    position: sticky;
    top: 0;
    z-index: 1000;
    font-family: var(--font);
  }

  /* ── Top bar ── */
  .hdr-bar {
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1.5px solid var(--border);
    box-shadow: 0 2px 16px rgba(79,110,247,0.06);
    transition: background 0.3s, box-shadow 0.3s;
  }
  .hdr-bar.scrolled {
    background: rgba(255,255,255,0.97);
    box-shadow: 0 6px 28px rgba(79,110,247,0.11);
  }

  .hdr-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 66px;
    gap: 1rem;
  }

  /* ── Brand ── */
  .hdr-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    flex-shrink: 0;
  }
  .hdr-logo-mark {
    width: 36px;
    height: 36px;
    border-radius: 11px;
    background: linear-gradient(135deg, #4f6ef7, #7c5cbf);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.05rem;
    flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(79,110,247,0.32);
    transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s;
  }
  .hdr-brand:hover .hdr-logo-mark {
    transform: scale(1.1) rotate(-6deg);
    box-shadow: 0 8px 22px rgba(79,110,247,0.42);
  }
  .hdr-brand-name {
    font-family: var(--font-serif);
    font-weight: 700;
    font-size: 1.18rem;
    color: var(--text);
    letter-spacing: -0.02em;
    line-height: 1;
  }
  .hdr-brand-name em {
    font-style: italic;
    color: var(--blue);
  }

  /* ── Desktop nav (single nav, multiple links) ── */
  .hdr-nav {
    display: flex;
    align-items: center;
    gap: 2px;
    flex: 1;
    padding-left: 8px;
  }

  .hdr-nav-link {
    font-size: 0.84rem;
    font-weight: 600;
    color: var(--text2);
    text-decoration: none;
    padding: 7px 14px;
    border-radius: 10px;
    transition: color 0.18s, background 0.18s;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
  }
  .hdr-nav-link:hover {
    color: var(--blue);
    background: var(--blue-light);
  }
  .hdr-nav-link.active {
    color: var(--blue);
    background: var(--blue-light);
    font-weight: 700;
  }

  /* ── Right-side actions ── */
  .hdr-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  /* Ghost login link */
  .hdr-login {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--text2);
    text-decoration: none;
    padding: 7px 14px;
    border-radius: 10px;
    border: 1.5px solid var(--border);
    transition: color 0.18s, border-color 0.18s, background 0.18s;
    white-space: nowrap;
  }
  .hdr-login:hover {
    color: var(--blue);
    border-color: var(--blue-mid);
    background: var(--blue-light);
  }

  /* Primary CTA */
  .hdr-cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.83rem;
    font-weight: 800;
    color: #fff;
    text-decoration: none;
    padding: 9px 20px;
    border-radius: 12px;
    background: linear-gradient(135deg, #4f6ef7, #7c5cbf);
    box-shadow: 0 4px 16px rgba(79,110,247,0.28);
    transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
    white-space: nowrap;
  }
  .hdr-cta:hover {
    opacity: 0.88;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(79,110,247,0.38);
    color: #fff;
    text-decoration: none;
  }
  .hdr-cta-arrow {
    font-size: 0.76rem;
    opacity: 0.75;
    transition: transform 0.2s;
  }
  .hdr-cta:hover .hdr-cta-arrow {
    transform: translateX(3px);
  }

  /* ── Mobile toggle ── */
  .hdr-toggle {
    display: none;
    flex-direction: column;
    gap: 5px;
    width: 34px;
    height: 34px;
    justify-content: center;
    align-items: center;
    background: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.2s, border-color 0.2s;
  }
  .hdr-toggle:hover {
    background: var(--blue-light);
    border-color: var(--blue-mid);
  }
  .hdr-toggle span {
    display: block;
    width: 16px;
    height: 2px;
    border-radius: 2px;
    background: var(--text2);
    transition: transform 0.25s, opacity 0.25s, width 0.25s;
  }
  .hdr-toggle.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .hdr-toggle.open span:nth-child(2) { opacity: 0; width: 0; }
  .hdr-toggle.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  /* ── Mobile drawer ── */
  .hdr-drawer {
    display: none;
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(20px);
    border-bottom: 1.5px solid var(--border);
    padding: 0.6rem 0 1.2rem;
    animation: drawer-slide 0.22s cubic-bezier(0.22,1,0.36,1) both;
  }
  .hdr-drawer.open { display: block; }

  @keyframes drawer-slide {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .hdr-drawer-divider {
    height: 1px;
    background: var(--border);
    margin: 0.6rem 16px;
  }

  .hdr-drawer-link {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text2);
    text-decoration: none;
    padding: 10px 16px;
    border-radius: 12px;
    margin: 0 8px 2px;
    transition: color 0.18s, background 0.18s;
  }
  .hdr-drawer-link:hover,
  .hdr-drawer-link.active {
    color: var(--blue);
    background: var(--blue-light);
  }

  .hdr-drawer-cta {
    display: block;
    text-align: center;
    font-size: 0.88rem;
    font-weight: 800;
    color: #fff;
    text-decoration: none;
    padding: 12px 20px;
    border-radius: 12px;
    margin: 0.8rem 8px 0;
    background: linear-gradient(135deg, #4f6ef7, #7c5cbf);
    box-shadow: 0 4px 16px rgba(79,110,247,0.22);
    transition: opacity 0.2s;
  }
  .hdr-drawer-cta:hover { opacity: 0.88; color: #fff; }

  @media (max-width: 768px) {
    .hdr-nav,
    .hdr-actions { display: none !important; }
    .hdr-toggle  { display: flex; }
  }
`

const Header = () => {
  const { user } = useContext(AuthContext)
  const location = useLocation()
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const role = user?.user?.role
  const accountLink =
    role === 'student'    ? '/account/student/dashboard'
    : role === 'instructor' ? '/account/instructor/dashboard'
    : role === 'admin'      ? '/account/admin/analytics'
    : '/account/login'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const isActive = (path) => location.pathname.startsWith(path)

  return (
    <>
      <style>{css}</style>
      <div className="hdr-wrap">

        {/* ── Main bar ── */}
        <div className={`hdr-bar${scrolled ? ' scrolled' : ''}`}>
          <Container>
            <div className="hdr-inner">

              {/* Brand */}
              <Link to="/" className="hdr-brand">
                <div className="hdr-logo-mark">✦</div>
                <div className="hdr-brand-name">Smart<em>Learning</em></div>
              </Link>

              {/* Desktop nav — single nav, all links inside */}
              <nav className="hdr-nav">
                <Link
                  to="/courses"
                  className={`hdr-nav-link${isActive('/courses') ? ' active' : ''}`}
                >
                  All Courses
                </Link>
                <Link
                  to="/about-us"
                  className={`hdr-nav-link${isActive('/about-us') ? ' active' : ''}`}
                >
                  About Us
                </Link>
              </nav>

              {/* Desktop right actions */}
              <div className="hdr-actions">
                <Link to={accountLink} className="hdr-cta">
                  My Account
                  <span className="hdr-cta-arrow">→</span>
                </Link>
              </div>

              {/* Mobile hamburger */}
              <button
                className={`hdr-toggle${mobileOpen ? ' open' : ''}`}
                onClick={() => setMobileOpen(v => !v)}
                aria-label="Toggle menu"
              >
                <span /><span /><span />
              </button>

            </div>
          </Container>
        </div>

        {/* ── Mobile drawer ── */}
        <div className={`hdr-drawer${mobileOpen ? ' open' : ''}`}>
          <Container>
            <Link
              to="/courses"
              className={`hdr-drawer-link${isActive('/courses') ? ' active' : ''}`}
            >
              All Courses
            </Link>
            <Link
              to="/about-us"
              className={`hdr-drawer-link${isActive('/about-us') ? ' active' : ''}`}
            >
              About Us
            </Link>
            <div className="hdr-drawer-divider" />
            <Link to={accountLink} className="hdr-drawer-cta">
              My Account →
            </Link>
          </Container>
        </div>

      </div>
    </>
  )
}

export default Header