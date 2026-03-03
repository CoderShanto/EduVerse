import React from 'react'
import { Link } from 'react-router-dom'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,400&display=swap');

  :root {
    --ft-bg: #0d0f1c;
    --ft-surface: #13162a;
    --ft-border: rgba(255,255,255,0.07);
    --ft-blue: #4f6ef7;
    --ft-blue-light: rgba(79,110,247,0.12);
    --ft-purple: #7c5cbf;
    --ft-text: #e2e8f4;
    --ft-muted: #6b7591;
    --ft-font: 'Plus Jakarta Sans', sans-serif;
    --ft-serif: 'Fraunces', serif;
  }

  .ft-root {
    background: var(--ft-bg);
    font-family: var(--ft-font);
    position: relative;
    overflow: hidden;
  }

  /* top glow line */
  .ft-root::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--ft-blue), var(--ft-purple), transparent);
    opacity: 0.6;
  }

  /* ambient bg orb */
  .ft-root::after {
    content: '';
    position: absolute;
    width: 600px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(ellipse, rgba(79,110,247,0.07) 0%, transparent 70%);
    top: -80px; left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
  }

  .ft-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 64px 40px 0;
    position: relative;
    z-index: 1;
  }

  .ft-grid {
    display: grid;
    grid-template-columns: 1.6fr 1fr 1fr;
    gap: 48px;
    padding-bottom: 52px;
    border-bottom: 1px solid var(--ft-border);
  }

  /* ── Brand col ── */
  .ft-brand-mark {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    margin-bottom: 18px;
  }

  .ft-logo-box {
    width: 38px; height: 38px;
    border-radius: 11px;
    background: linear-gradient(135deg, #4f6ef7, #7c5cbf);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
    box-shadow: 0 4px 18px rgba(79,110,247,0.35);
    flex-shrink: 0;
  }

  .ft-brand-name {
    font-family: var(--ft-serif);
    font-weight: 700;
    font-size: 1.2rem;
    color: #fff;
    letter-spacing: -0.02em;
  }

  .ft-brand-name em {
    font-style: italic;
    color: #7c9bfb;
  }

  .ft-tagline {
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.75;
    color: var(--ft-muted);
    max-width: 300px;
    margin-bottom: 24px;
  }

  /* Social icons */
  .ft-socials {
    display: flex;
    gap: 8px;
  }

  .ft-social-btn {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: var(--ft-surface);
    border: 1px solid var(--ft-border);
    display: flex; align-items: center; justify-content: center;
    color: var(--ft-muted);
    font-size: 0.8rem;
    text-decoration: none;
    transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.2s;
  }

  .ft-social-btn:hover {
    background: var(--ft-blue-light);
    border-color: rgba(79,110,247,0.35);
    color: #7c9bfb;
    transform: translateY(-2px);
  }

  /* ── Link cols ── */
  .ft-col-title {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ft-muted);
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ft-col-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--ft-border);
  }

  .ft-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .ft-links a {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--ft-text);
    text-decoration: none;
    padding: 6px 0;
    transition: color 0.18s, gap 0.18s;
    opacity: 0.8;
  }

  .ft-links a::before {
    content: '';
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--ft-blue);
    opacity: 0;
    flex-shrink: 0;
    transition: opacity 0.18s, transform 0.18s;
    transform: scale(0.5);
  }

  .ft-links a:hover {
    color: #7c9bfb;
    gap: 10px;
    opacity: 1;
  }

  .ft-links a:hover::before {
    opacity: 1;
    transform: scale(1);
  }

  /* ── Bottom bar ── */
  .ft-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0 24px;
    gap: 16px;
    flex-wrap: wrap;
  }

  .ft-copy {
    font-size: 0.78rem;
    color: var(--ft-muted);
    font-weight: 400;
  }

  .ft-copy span {
    color: #7c9bfb;
    font-weight: 600;
  }

  .ft-bottom-links {
    display: flex;
    gap: 20px;
  }

  .ft-bottom-links a {
    font-size: 0.76rem;
    color: var(--ft-muted);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.18s;
  }

  .ft-bottom-links a:hover {
    color: #7c9bfb;
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .ft-grid {
      grid-template-columns: 1fr 1fr;
      gap: 32px;
    }
    .ft-brand-col {
      grid-column: 1 / -1;
    }
    .ft-tagline { max-width: 100%; }
  }

  @media (max-width: 560px) {
    .ft-grid {
      grid-template-columns: 1fr;
    }
    .ft-inner { padding: 48px 20px 0; }
    .ft-bottom {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
  }
`

const Footer = () => {
  return (
    <>
      <style>{css}</style>
      <footer className="ft-root">
        <div className="ft-inner">
          <div className="ft-grid">

            {/* ── Brand ── */}
            <div className="ft-brand-col">
              <Link to="/" className="ft-brand-mark">
                <div className="ft-logo-box">✦</div>
                <div className="ft-brand-name">Smart<em>Learning</em></div>
              </Link>
              <p className="ft-tagline">
                Join our Learning Management System and explore a wide range of
                courses to enhance your skills and achieve your goals — at your own pace.
              </p>
              <div className="ft-socials">
                <a href="#" className="ft-social-btn" aria-label="Twitter">𝕏</a>
                <a href="#" className="ft-social-btn" aria-label="LinkedIn">in</a>
                <a href="#" className="ft-social-btn" aria-label="YouTube">▶</a>
                <a href="#" className="ft-social-btn" aria-label="Instagram">◈</a>
              </div>
            </div>

            {/* ── Popular Categories ── */}
            <div>
              <div className="ft-col-title">Popular Categories</div>
              <ul className="ft-links">
                <li><a href="#">Digital Marketing</a></li>
                <li><a href="#">Web Development</a></li>
                <li><a href="#">Machine Learning</a></li>
                <li><a href="#">Web Design</a></li>
                <li><a href="#">Logo Design</a></li>
                <li><a href="#">Graphic Design</a></li>
              </ul>
            </div>

            {/* ── Quick Links ── */}
            <div>
              <div className="ft-col-title">Quick Links</div>
              <ul className="ft-links">
                <li><Link to="/account/login">Login</Link></li>
                <li><Link to="/account/register">Register</Link></li>
                <li><Link to="/account/student/dashboard">My Account</Link></li>
                <li><Link to="/courses">All Courses</Link></li>
                <li><Link to="/about-us">About Us</Link></li>
              </ul>
            </div>

          </div>

          {/* ── Bottom bar ── */}
          <div className="ft-bottom">
            <div className="ft-copy">
              © 2026 All Rights Reserved to <span>Shanto</span>
            </div>
            <div className="ft-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Use</a>
              <a href="#">Support</a>
            </div>
          </div>

        </div>
      </footer>
    </>
  )
}

export default Footer