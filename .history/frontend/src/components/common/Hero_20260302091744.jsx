import React, { useEffect, useRef } from 'react'
// import HeroImg from '../../assets/images/c.png'

const Hero = () => {
  const heroRef = useRef(null)

  useEffect(() => {
    const elements = heroRef.current?.querySelectorAll('[data-reveal]')
    elements?.forEach((el, i) => {
      el.style.animationDelay = `${i * 0.12}s`
      el.classList.add('revealed')
    })
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --ink: #0d0f1a;
          --cream: #f5f0e8;
          --amber: #e8a020;
          --amber-light: #f5c760;
          --slate: #1e2235;
          --muted: #6b7491;
        }

        .hero-section {
          min-height: 100vh;
          background-color: var(--ink);
          background-image:
            radial-gradient(ellipse 80% 60% at 70% 50%, rgba(232,160,32,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 10% 80%, rgba(30,34,53,0.9) 0%, transparent 50%);
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding: 80px 0;
        }

        /* Decorative grid lines */
        .hero-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(245,240,232,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,240,232,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        /* Floating orb */
        .hero-orb {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232,160,32,0.15) 0%, transparent 70%);
          top: 50%;
          right: -100px;
          transform: translateY(-50%);
          pointer-events: none;
          animation: orb-pulse 6s ease-in-out infinite;
        }

        @keyframes orb-pulse {
          0%, 100% { transform: translateY(-50%) scale(1); opacity: 0.8; }
          50% { transform: translateY(-50%) scale(1.1); opacity: 1; }
        }

        .hero-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
          position: relative;
          z-index: 1;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 60px;
        }

        /* LEFT COLUMN */
        .hero-left {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(232,160,32,0.12);
          border: 1px solid rgba(232,160,32,0.3);
          color: var(--amber-light);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 100px;
          width: fit-content;
        }

        .hero-badge::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--amber);
          animation: blink 2s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .hero-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(42px, 5.5vw, 76px);
          font-weight: 900;
          line-height: 1.0;
          color: var(--cream);
          margin: 0;
          letter-spacing: -0.02em;
        }

        .hero-headline .accent-line {
          display: block;
          color: var(--amber);
          font-style: italic;
          position: relative;
        }

        .hero-headline .accent-line::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, var(--amber), transparent);
        }

        .hero-subtext {
          font-size: 16px;
          font-weight: 300;
          line-height: 1.75;
          color: var(--muted);
          max-width: 440px;
          margin: 0;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .btn-primary-hero {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--amber);
          color: var(--ink);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.03em;
          text-decoration: none;
          padding: 14px 28px;
          border-radius: 4px;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }

        .btn-primary-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
          opacity: 0;
          transition: opacity 0.25s;
        }

        .btn-primary-hero:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(232,160,32,0.35);
          color: var(--ink);
          text-decoration: none;
        }

        .btn-primary-hero:hover::before { opacity: 1; }

        .btn-primary-hero .arrow {
          font-size: 18px;
          transition: transform 0.25s;
        }

        .btn-primary-hero:hover .arrow { transform: translateX(4px); }

        .btn-secondary-hero {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: var(--cream);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          text-decoration: none;
          padding: 14px 0;
          border-bottom: 1px solid rgba(245,240,232,0.2);
          transition: all 0.25s ease;
        }

        .btn-secondary-hero:hover {
          color: var(--amber-light);
          border-color: var(--amber-light);
          text-decoration: none;
          gap: 14px;
        }

        .hero-stats {
          display: flex;
          gap: 32px;
          padding-top: 8px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .stat-number {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 700;
          color: var(--cream);
        }

        .stat-number span {
          color: var(--amber);
        }

        .stat-label {
          font-size: 11px;
          font-weight: 400;
          color: var(--muted);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .stat-divider {
          width: 1px;
          background: rgba(245,240,232,0.1);
          align-self: stretch;
        }

        /* RIGHT COLUMN */
        .hero-right {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .image-frame {
          position: relative;
          width: 100%;
          max-width: 460px;
        }

        .image-bg-shape {
          position: absolute;
          inset: -20px;
          border-radius: 24px 8px 24px 8px;
          background: linear-gradient(135deg, rgba(232,160,32,0.15), rgba(30,34,53,0.5));
          border: 1px solid rgba(232,160,32,0.2);
          transform: rotate(2deg);
          z-index: 0;
        }

        .image-wrapper {
          position: relative;
          z-index: 1;
          border-radius: 16px 4px 16px 4px;
          overflow: hidden;
          background: var(--slate);
          aspect-ratio: 4/5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Placeholder when no image */
        .img-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          color: var(--muted);
          font-size: 14px;
          background: linear-gradient(145deg, #1e2235, #0d0f1a);
        }

        .img-placeholder svg {
          opacity: 0.3;
        }

        .floating-card {
          position: absolute;
          background: rgba(13,15,26,0.9);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(245,240,232,0.08);
          border-radius: 12px;
          padding: 12px 16px;
          z-index: 2;
        }

        .card-top-left {
          top: -16px;
          left: -32px;
          animation: float-1 4s ease-in-out infinite;
        }

        .card-bottom-right {
          bottom: 24px;
          right: -32px;
          animation: float-2 5s ease-in-out infinite;
        }

        @keyframes float-1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes float-2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(6px); }
        }

        .card-label {
          font-size: 10px;
          color: var(--muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .card-value {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          color: var(--cream);
        }

        .card-value .amber { color: var(--amber); }

        .card-sub {
          font-size: 11px;
          color: var(--muted);
        }

        .progress-bar-wrap {
          margin-top: 6px;
          height: 3px;
          background: rgba(245,240,232,0.1);
          border-radius: 100px;
          width: 100px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--amber), var(--amber-light));
          border-radius: 100px;
          animation: grow 2s ease forwards;
        }

        @keyframes grow {
          from { width: 0%; }
          to { width: 87%; }
        }

        /* Reveal animations */
        [data-reveal] {
          opacity: 0;
          transform: translateY(24px);
          animation: reveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        [data-reveal].revealed {
          /* animation runs */
        }

        @keyframes reveal {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .hero-right { order: -1; }
          .image-frame { max-width: 320px; }
          .card-top-left { left: -12px; }
          .card-bottom-right { right: -12px; }
          .hero-stats { gap: 20px; }
        }
      `}</style>

      <section className="hero-section" ref={heroRef}>
        <div className="hero-orb" />

        <div className="hero-container">
          <div className="hero-grid">

            {/* LEFT */}
            <div className="hero-left">
              <div data-reveal>
                <span className="hero-badge">Online Learning Platform</span>
              </div>

              <h1 className="hero-headline" data-reveal>
                Learn Anytime,
                <span className="accent-line">Anywhere.</span>
              </h1>

              <p className="hero-subtext" data-reveal>
                Join our Learning Management System and explore a wide range of courses 
                to enhance your skills and achieve your goals.
              </p>

              <div className="hero-actions" data-reveal>
                <a href="#courses" className="btn-primary-hero">
                  Explore Courses
                  <span className="arrow">→</span>
                </a>
                <a href="#how-it-works" className="btn-secondary-hero">
                  How it works →
                </a>
              </div>

              <div className="hero-stats" data-reveal>
                <div className="stat-item">
                  <div className="stat-number">12<span>k+</span></div>
                  <div className="stat-label">Students</div>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                  <div className="stat-number">320<span>+</span></div>
                  <div className="stat-label">Courses</div>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                  <div className="stat-number">98<span>%</span></div>
                  <div className="stat-label">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="hero-right" data-reveal>
              <div className="image-frame">
                <div className="image-bg-shape" />

                <div className="image-wrapper">
                  {/* Replace below with your actual image */}
                  {/* <img src={HeroImg} alt="Student Learning" className="hero-img" /> */}
                  <div className="img-placeholder">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21,15 16,10 5,21"/>
                    </svg>
                    <span>Your Image Here</span>
                  </div>
                </div>

                {/* Floating cards */}
                <div className="floating-card card-top-left">
                  <div className="card-label">Course completion</div>
                  <div className="card-value"><span className="amber">87%</span></div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar-fill" />
                  </div>
                </div>

                <div className="floating-card card-bottom-right">
                  <div className="card-label">New this week</div>
                  <div className="card-value">14</div>
                  <div className="card-sub">courses added</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

export default Hero