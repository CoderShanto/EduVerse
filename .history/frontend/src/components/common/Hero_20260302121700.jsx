import React, { useEffect, useRef } from 'react'
import HeroImg from '../../assets/images/g.png'
import { Link } from 'react-router-dom'

const Hero = () => {
  const imgRef = useRef(null)
  const sectionRef = useRef(null)

  // Parallax on mouse move
  useEffect(() => {
    const section = sectionRef.current
    const img = imgRef.current
    if (!section || !img) return

    const handleMove = (e) => {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth - 0.5) * 18
      const y = (e.clientY / innerHeight - 0.5) * 10
      img.style.transform = `scale(1.08) translate(${x}px, ${y}px)`
    }

    const handleLeave = () => {
      img.style.transform = 'scale(1.08) translate(0px, 0px)'
    }

    section.addEventListener('mousemove', handleMove)
    section.addEventListener('mouseleave', handleLeave)
    return () => {
      section.removeEventListener('mousemove', handleMove)
      section.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,400&display=swap');

        :root {
          --blue: #4f6ef7;
          --blue-light: #eef0ff;
          --blue-mid: #dde2ff;
          --purple: #7c5cbf;
          --green: #22c98e;
          --yellow: #ffb020;
          --font: 'Plus Jakarta Sans', sans-serif;
          --font-serif: 'Fraunces', serif;
        }

        .hero-section {
          min-height: 100vh;
          width: 100%;
          position: relative;
          display: flex;
          align-items: center;
          font-family: var(--font);
          overflow: hidden;
          background: #0a0d1f;
        }

        /* ── IMAGE with Ken Burns + parallax ── */
        .hero-img-wrap {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }

        .hero-bg-img {
          position: absolute;
          inset: -5%;
          width: 110%;
          height: 110%;
          object-fit: cover;
          object-position: center top;
          transform: scale(1.08);
          transition: transform 0.12s cubic-bezier(0.25,0.46,0.45,0.94);
          will-change: transform;
          animation: ken-burns 18s ease-in-out infinite alternate;
          filter: brightness(0.55) saturate(1.15);
        }

        @keyframes ken-burns {
          0%   { transform: scale(1.08) translateX(0px)   translateY(0px); }
          25%  { transform: scale(1.12) translateX(-12px) translateY(-6px); }
          50%  { transform: scale(1.1)  translateX(8px)   translateY(-10px); }
          75%  { transform: scale(1.13) translateX(-6px)  translateY(4px); }
          100% { transform: scale(1.08) translateX(10px)  translateY(-4px); }
        }

        /* ── Grain overlay ── */
        .hero-grain {
          position: absolute; inset: 0; z-index: 1; pointer-events: none; opacity: 0.06;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 180px;
          animation: grain-shift 0.8s steps(1) infinite;
        }
        @keyframes grain-shift {
          0%  { background-position: 0 0; }
          20% { background-position: -40px -60px; }
          40% { background-position: 60px -20px; }
          60% { background-position: -20px 50px; }
          80% { background-position: 40px 30px; }
        }

        /* ── Overlay gradient ── */
        .hero-overlay {
          position: absolute; inset: 0; z-index: 2;
          background: linear-gradient(
            105deg,
            rgba(10,13,31,0.92) 0%,
            rgba(14,18,56,0.80) 30%,
            rgba(14,18,56,0.50) 55%,
            rgba(14,18,56,0.10) 75%,
            transparent 100%
          );
        }

        /* Animated light sweep */
        .hero-sweep {
          position: absolute; inset: 0; z-index: 3; pointer-events: none;
          background: linear-gradient(105deg, transparent 30%, rgba(79,110,247,0.06) 50%, transparent 70%);
          animation: sweep-move 8s ease-in-out infinite alternate;
        }
        @keyframes sweep-move { from{transform:translateX(-20%);} to{transform:translateX(20%);} }

        /* Animated dots grid on left */
        .hero-dot-grid {
          position: absolute; top: 0; left: 0; bottom: 0; width: 50%; z-index: 3;
          pointer-events: none;
          background-image: radial-gradient(circle, rgba(79,110,247,0.25) 1px, transparent 1px);
          background-size: 36px 36px;
          mask-image: linear-gradient(to right, rgba(0,0,0,0.15) 0%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, rgba(0,0,0,0.15) 0%, transparent 100%);
          animation: dots-pulse 6s ease-in-out infinite alternate;
        }
        @keyframes dots-pulse { from{opacity:0.6;} to{opacity:1;} }

        /* ── CONTENT ── */
        .hero-content {
          position: relative; z-index: 10;
          max-width: 1200px; margin: 0 auto;
          padding: 100px 48px;
          width: 100%;
        }

        /* Eyebrow badge */
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(79,110,247,0.15);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(79,110,247,0.35);
          color: #a5b4fc;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          padding: 7px 16px; border-radius: 100px;
          margin-bottom: 28px; width: fit-content;
          animation: fadeUp 0.7s ease both;
        }
        .badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--blue);
          box-shadow: 0 0 8px rgba(79,110,247,0.8);
          animation: dot-pulse 2s ease-in-out infinite;
        }
        @keyframes dot-pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.3;transform:scale(0.7);} }

        /* Title */
        .hero-title {
          font-family: var(--font-serif);
          font-size: clamp(3rem, 7vw, 5.5rem);
          font-weight: 700; line-height: 1.06;
          color: #fff; margin: 0 0 24px;
          letter-spacing: -0.03em; max-width: 600px;
          animation: fadeUp 0.7s 0.1s ease both;
        }
        .hero-title em {
          font-style: italic;
          background: linear-gradient(135deg,#a5b4fc,#c4b5fd,#818cf8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 4s ease-in-out infinite alternate;
        }
        @keyframes gradient-shift {
          from { filter: hue-rotate(0deg); }
          to   { filter: hue-rotate(40deg); }
        }
        .hero-title .line2 { display: block; }

        /* Desc */
        .hero-desc {
          font-size: 1.05rem; line-height: 1.8;
          color: rgba(255,255,255,0.58);
          max-width: 420px; margin: 0 0 40px;
          animation: fadeUp 0.7s 0.2s ease both;
          font-weight: 400;
        }

        /* Actions */
        .hero-actions {
          display: flex; gap: 0.8rem; flex-wrap: wrap;
          animation: fadeUp 0.7s 0.3s ease both;
        }

        .btn-main {
          display: inline-flex; align-items: center; gap: 10px;
          background: linear-gradient(135deg, var(--blue), var(--purple));
          color: #fff; font-family: var(--font);
          font-size: 0.9rem; font-weight: 800;
          text-decoration: none; padding: 14px 32px;
          border-radius: 14px;
          box-shadow: 0 8px 28px rgba(79,110,247,0.45);
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          letter-spacing: 0.01em;
        }
        .btn-main:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 20px 48px rgba(79,110,247,0.55);
          color: #fff; text-decoration: none;
        }
        .btn-main svg { transition: transform 0.25s; }
        .btn-main:hover svg { transform: translateX(5px); }

        .btn-ghost {
          display: inline-flex; align-items: center; gap: 10px;
          color: rgba(255,255,255,0.75); font-family: var(--font);
          font-size: 0.9rem; font-weight: 700;
          text-decoration: none; padding: 14px 28px;
          border-radius: 14px;
          border: 1.5px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(10px);
          transition: all 0.22s;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.14);
          border-color: rgba(255,255,255,0.35);
          color: #fff; text-decoration: none;
          transform: translateY(-2px);
        }

        /* ── Floating stat cards ── */
        .hero-float-cards {
          position: absolute; right: 48px; top: 50%; transform: translateY(-50%);
          display: flex; flex-direction: column; gap: 1rem;
          z-index: 10; animation: fadeUp 0.7s 0.5s ease both;
        }
        .hero-float-card {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 18px; padding: 1rem 1.3rem;
          display: flex; align-items: center; gap: 12px;
          min-width: 190px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
        }
        .hero-float-card:hover { transform: translateX(-6px) scale(1.03); box-shadow: 0 16px 48px rgba(0,0,0,0.4); }
        .hero-float-card:nth-child(1) { animation: float-card 5s ease-in-out infinite alternate; }
        .hero-float-card:nth-child(2) { animation: float-card 6s 0.8s ease-in-out infinite alternate-reverse; }
        .hero-float-card:nth-child(3) { animation: float-card 5.5s 0.4s ease-in-out infinite alternate; }
        @keyframes float-card {
          from { transform: translateY(0); }
          to   { transform: translateY(-10px); }
        }
        .float-card-icon {
          width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 1.1rem;
        }
        .float-card-val {
          font-family: var(--font-serif); font-size: 1.4rem; font-weight: 700; color: #fff;
          line-height: 1;
        }
        .float-card-label {
          font-size: 0.68rem; color: rgba(255,255,255,0.55); font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px;
        }

        /* ── Bottom bar ── */
        .hero-bottom-bar {
          position: absolute; bottom: 0; left: 0; right: 0; z-index: 10;
          padding: 1.2rem 48px;
          background: linear-gradient(to top,rgba(10,13,31,0.7),transparent);
          display: flex; align-items: center; gap: 2rem; flex-wrap: wrap;
          animation: fadeUp 0.7s 0.6s ease both;
        }
        .hero-trust-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.72rem; color: rgba(255,255,255,0.5); font-weight: 600;
        }
        .hero-trust-icon {
          width: 24px; height: 24px; border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem;
        }

        /* Scroll hint */
        .hero-scroll {
          position: absolute; bottom: 1.5rem; left: 50%; transform: translateX(-50%);
          z-index: 10; display: flex; flex-direction: column; align-items: center; gap: 5px;
          font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(255,255,255,0.3); font-weight: 600;
          animation: fadeUp 0.7s 0.8s ease both;
        }
        .scroll-pill {
          width: 22px; height: 36px; border-radius: 99px;
          border: 1.5px solid rgba(255,255,255,0.2);
          display: flex; justify-content: center; padding-top: 6px;
        }
        .scroll-dot {
          width: 4px; height: 8px; border-radius: 99px;
          background: rgba(255,255,255,0.4);
          animation: scroll-drop 1.8s ease-in-out infinite;
        }
        @keyframes scroll-drop { 0%,100%{transform:translateY(0);opacity:1;} 60%{transform:translateY(10px);opacity:0.2;} }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Responsive */
        @media (max-width: 991px) {
          .hero-float-cards { display: none; }
          .hero-bottom-bar { padding: 1rem 24px; gap: 1rem; }
        }
        @media (max-width: 768px) {
          .hero-content { padding: 80px 24px 120px; }
          .hero-title { font-size: 3rem; }
          .hero-scroll { display: none; }
        }
      `}</style>

      <section className='hero-section' ref={sectionRef}>

        {/* Animated image */}
        <div className='hero-img-wrap'>
          <img ref={imgRef} src={HeroImg} alt='Students learning' className='hero-bg-img' />
        </div>

        {/* Grain */}
        <div className='hero-grain' />

        {/* Overlays */}
        <div className='hero-overlay' />
        <div className='hero-sweep' />
        <div className='hero-dot-grid' />

        {/* Content */}
        <div className='hero-content'>
          <div className='hero-badge'>
            <span className='badge-dot' />
            Learning Management System
          </div>

          <h1 className='hero-title'>
            Build Skills.
            <span className='line2'>Build <em>the Future.</em></span>
          </h1>

          <p className='hero-desc'>
            Join our platform and explore a wide range of courses to enhance
            your skills and achieve your goals — at your own pace.
          </p>

          <div className='hero-actions'>
            <Link to='/courses' className='btn-main'>
              Explore Courses
              <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M5 12h14M12 5l7 7-7 7'/>
              </svg>
            </Link>
            <Link to='/about' className='btn-ghost'>
              About Us →
            </Link>
          </div>
        </div>

        {/* Floating stat cards */}
        <div className='hero-float-cards'>
          {[
            { icon: '🎓', bg: 'linear-gradient(135deg,#4f6ef7,#7c5cbf)', val: '120K+', label: 'Active Students' },
            { icon: '📚', bg: 'linear-gradient(135deg,#22c98e,#06b6d4)', val: '1,800+', label: 'Course Hours' },
            { icon: '⭐', bg: 'linear-gradient(135deg,#ffb020,#ff7140)', val: '4.9 / 5', label: 'Average Rating' },
          ].map((card, i) => (
            <div key={i} className='hero-float-card'>
              <div className='float-card-icon' style={{ background: card.bg }}>{card.icon}</div>
              <div>
                <div className='float-card-val'>{card.val}</div>
                <div className='float-card-label'>{card.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust bar */}
        <div className='hero-bottom-bar'>
          {[
            { icon: '🔐', bg: 'rgba(79,110,247,0.2)', text: 'Secure & Certified' },
            { icon: '♾️', bg: 'rgba(34,201,142,0.2)', text: 'Lifetime Access' },
            { icon: '🌍', bg: 'rgba(255,176,32,0.2)', text: 'Learn from Anywhere' },
            { icon: '🏆', bg: 'rgba(255,113,64,0.2)', text: 'Industry Recognized' },
          ].map((t, i) => (
            <div key={i} className='hero-trust-item'>
              <div className='hero-trust-icon' style={{ background: t.bg }}>{t.icon}</div>
              {t.text}
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className='hero-scroll'>
          <div className='scroll-pill'><div className='scroll-dot' /></div>
          scroll
        </div>

      </section>
    </>
  )
}

export default Hero