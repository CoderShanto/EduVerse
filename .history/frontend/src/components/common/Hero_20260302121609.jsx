import React, { useEffect, useRef } from 'react'
import HeroImg from '../../assets/images/g.png'
import { Link } from 'react-router-dom'

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

        /* ── Background image with slow Ken Burns zoom ── */
        .hero-bg-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          z-index: 0;
          animation: kenBurns 18s ease-in-out infinite alternate;
          transform-origin: center center;
        }

        @keyframes kenBurns {
          0%   { transform: scale(1)    translateX(0%)   translateY(0%); }
          33%  { transform: scale(1.06) translateX(-1%)  translateY(-1%); }
          66%  { transform: scale(1.10) translateX(1%)   translateY(0.5%); }
          100% { transform: scale(1.05) translateX(-0.5%) translateY(-0.5%); }
        }

        /* ── Overlay ── */
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            100deg,
            rgb(255,255,255) 0%,
            rgba(255,255,255,0.72) 30%,
            rgba(255,255,255,0.25) 55%,
            rgba(255,255,255,0.00) 75%
          );
          z-index: 1;
        }

        /* ── Floating light particles ── */
        .particles {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(14,165,233,0.18);
          animation: floatParticle linear infinite;
        }

        .particle:nth-child(1)  { width:14px; height:14px; left:72%; top:15%; animation-duration:7s;  animation-delay:0s;   }
        .particle:nth-child(2)  { width:8px;  height:8px;  left:80%; top:40%; animation-duration:9s;  animation-delay:1s;   }
        .particle:nth-child(3)  { width:18px; height:18px; left:65%; top:60%; animation-duration:11s; animation-delay:2s;   }
        .particle:nth-child(4)  { width:10px; height:10px; left:88%; top:25%; animation-duration:8s;  animation-delay:0.5s; }
        .particle:nth-child(5)  { width:6px;  height:6px;  left:75%; top:75%; animation-duration:13s; animation-delay:3s;   }
        .particle:nth-child(6)  { width:12px; height:12px; left:92%; top:55%; animation-duration:10s; animation-delay:1.5s; }
        .particle:nth-child(7)  { width:20px; height:20px; left:60%; top:30%; animation-duration:14s; animation-delay:4s;   background: rgba(99,102,241,0.12); }
        .particle:nth-child(8)  { width:7px;  height:7px;  left:85%; top:80%; animation-duration:6s;  animation-delay:2.5s; }

        @keyframes floatParticle {
          0%   { transform: translateY(40px) scale(0.8); opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateY(-120px) scale(1.1); opacity: 0; }
        }

        /* ── Floating UI cards ── */
        .hero-card {
          position: absolute;
          z-index: 3;
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.9);
          border-radius: 16px;
          padding: 14px 18px;
          box-shadow: 0 8px 32px rgba(15,23,42,0.10);
          display: flex;
          align-items: center;
          gap: 12px;
          pointer-events: none;
        }

        /* Card 1 — top right: "Active Learners" */
        .card-learners {
          top: 14%;
          right: 6%;
          animation: floatCard1 6s ease-in-out infinite;
        }

        /* Card 2 — mid right: "Course Completed" */
        .card-completed {
          top: 52%;
          right: 3%;
          animation: floatCard2 7s ease-in-out infinite;
          animation-delay: 1s;
        }

        /* Card 3 — bottom center-right: "New Course" */
        .card-new {
          bottom: 14%;
          right: 20%;
          animation: floatCard1 8s ease-in-out infinite;
          animation-delay: 2s;
        }

        @keyframes floatCard1 {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50%       { transform: translateY(-12px) rotate(1deg); }
        }

        @keyframes floatCard2 {
          0%, 100% { transform: translateY(0px) rotate(1deg); }
          50%       { transform: translateY(10px) rotate(-1deg); }
        }

        .card-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .card-icon.blue  { background: #e0f2fe; }
        .card-icon.green { background: #dcfce7; }
        .card-icon.purple{ background: #ede9fe; }

        .card-info {}
        .card-label {
          font-size: 10px;
          font-weight: 500;
          color: #94a3b8;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          line-height: 1;
          margin-bottom: 3px;
        }
        .card-value {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1;
        }
        .card-value .accent { color: #0ea5e9; }

        /* Pulsing ring around card icon */
        .card-icon-wrap {
          position: relative;
          flex-shrink: 0;
        }
        .card-icon-wrap::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 14px;
          border: 2px solid rgba(14,165,233,0.25);
          animation: ringPulse 2.5s ease-in-out infinite;
        }
        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50%       { transform: scale(1.15); opacity: 0; }
        }

        /* Progress bar inside card */
        .card-progress {
          margin-top: 6px;
          height: 4px;
          background: #e2e8f0;
          border-radius: 100px;
          width: 100px;
          overflow: hidden;
        }
        .card-progress-fill {
          height: 100%;
          border-radius: 100px;
          background: linear-gradient(90deg, #0ea5e9, #38bdf8);
          animation: fillGrow 2.5s 0.5s ease forwards;
          width: 0%;
        }
        @keyframes fillGrow {
          to { width: 78%; }
        }

        /* ── Text content ── */
        .hero-content {
          position: relative;
          z-index: 4;
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 48px;
          width: 100%;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.80);
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
          50%       { opacity: 0.4; transform: scale(0.75); }
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

        .btn-main svg { transition: transform 0.25s; }
        .btn-main:hover svg { transform: translateX(5px); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 900px) {
          .hero-card { display: none; }
          .hero-content { padding: 60px 24px; }
          .hero-overlay {
            background: linear-gradient(
              180deg,
              rgba(255,255,255,0.88) 0%,
              rgba(255,255,255,0.6) 60%,
              rgba(255,255,255,0.15) 100%
            );
          }
        }
      `}</style>

      <section className="hero-section">
        {/* Ken Burns background */}
        <img src={HeroImg} alt="Students learning" className="hero-bg-img" />

        {/* Gradient overlay */}
        <div className="hero-overlay" />

        {/* Floating particles */}
        <div className="particles">
          {[...Array(8)].map((_, i) => <span className="particle" key={i} />)}
        </div>

        {/* Floating card 1 — Active Learners */}
        <div className="hero-card card-learners">
          <div className="card-icon-wrap">
            <div className="card-icon blue">👥</div>
          </div>
          <div className="card-info">
            <div className="card-label">Active Learners</div>
            <div className="card-value"><span className="accent">12,480</span></div>
          </div>
        </div>

        {/* Floating card 2 — Completion Rate */}
        <div className="hero-card card-completed">
          <div className="card-icon-wrap">
            <div className="card-icon green">✅</div>
          </div>
          <div className="card-info">
            <div className="card-label">Completion Rate</div>
            <div className="card-value">78%</div>
            <div className="card-progress">
              <div className="card-progress-fill" />
            </div>
          </div>
        </div>

        {/* Floating card 3 — New Course */}
        <div className="hero-card card-new">
          <div className="card-icon-wrap">
            <div className="card-icon purple">🎓</div>
          </div>
          <div className="card-info">
            <div className="card-label">New This Week</div>
            <div className="card-value"><span className="accent">+14</span> Courses</div>
          </div>
        </div>

        {/* Text content */}
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
            <Link to="/courses" className="btn-main">
              Explore Courses
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero