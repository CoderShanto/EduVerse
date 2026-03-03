import React from 'react'
import HeroImg from '../../assets/images/g.png'

const Hero = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        .hero-section {
          min-height: 100vh;
          width: 100%;
          position: relative;
          display: flex;
          align-items: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          overflow: hidden;
        }

        .hero-bg-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          z-index: 0;
        }

        /* Much lighter overlay — only left side gets white, right stays fully visible */
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            100deg,
            rgb(255, 255, 255) 0%,
            rgba(255,255,255,0.72) 30%,
            rgba(255,255,255,0.25) 55%,
            rgba(255,255,255,0.00) 75%
          );
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 48px;
          width: 100%;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(14,165,233,0.3);
          color: #0284c7;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 7px 16px;
          border-radius: 100px;
          margin-bottom: 28px;
          width: fit-content;
          animation: fadeUp 0.6s ease forwards;
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #0ea5e9;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.75); }
        }

        .hero-title {
          font-size: clamp(44px, 6vw, 80px);
          font-weight: 800;
          line-height: 1.05;
          color: #0f172a;
          margin: 0 0 24px 0;
          letter-spacing: -0.03em;
          max-width: 560px;
          animation: fadeUp 0.6s 0.1s ease both;
        }

        .hero-title .line-blue {
          color: #0ea5e9;
          display: block;
        }

        .hero-desc {
          font-size: 17px;
          font-weight: 400;
          line-height: 1.75;
          color: #334155;
          max-width: 420px;
          margin: 0 0 36px 0;
          animation: fadeUp 0.6s 0.2s ease both;
        }

        .hero-actions {
          animation: fadeUp 0.6s 0.3s ease both;
        }

        .btn-main {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #0ea5e9;
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          padding: 16px 34px;
          border-radius: 100px;
          transition: all 0.25s ease;
          box-shadow: 0 8px 28px rgba(14,165,233,0.4);
        }

        .btn-main:hover {
          background: #0284c7;
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(14,165,233,0.5);
          color: #fff;
          text-decoration: none;
        }

        .btn-main svg {
          transition: transform 0.25s;
        }
        .btn-main:hover svg {
          transform: translateX(5px);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .hero-content { padding: 60px 24px; }
          .hero-overlay {
            background: linear-gradient(
              180deg,
              rgba(255,255,255,0.85) 0%,
              rgba(255,255,255,0.6) 60%,
              rgba(255,255,255,0.2) 100%
            );
          }
        }
      `}</style>

      <section className="hero-section">
        <img src={HeroImg} alt="Students learning" className="hero-bg-img" />
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            Learning Management System
          </div>

          <h1 className="hero-title">
            Build Skills. Build Teams.
            <span className="line-blue">Build the Future.</span>
          </h1>

          <p className="hero-desc">
            Join our platform and explore a wide range of courses to enhance
            your skills and achieve your goals — at your own pace.
          </p>

          <div className="hero-actions">
            <a href="#courses" className="btn-main">
              Explore Courses
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero