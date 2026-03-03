import React, { useEffect, useRef, useState } from 'react'
import Layout from '../common/Layout'
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
    --radius: 24px;
    --radius-sm: 14px;
    --shadow: 0 4px 24px rgba(79,110,247,0.08);
    --shadow-hover: 0 20px 50px rgba(79,110,247,0.16);
    --font: 'Plus Jakarta Sans', sans-serif;
    --font-serif: 'Fraunces', serif;
  }

  .ab-root {
    background: var(--bg);
    min-height: 100vh;
    font-family: var(--font);
    color: var(--text);
    overflow-x: hidden;
  }

  /* ─── BLOBS ─── */
  .ab-blob-wrap { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
  .ab-blob { position: absolute; border-radius: 50%; filter: blur(90px); }
  .ab-blob-1 { width: 700px; height: 700px; background: radial-gradient(circle,rgba(199,208,255,0.5),rgba(165,180,252,0.2)); top: -250px; right: -200px; opacity: 0.7; animation: blob-float 13s ease-in-out infinite alternate; }
  .ab-blob-2 { width: 500px; height: 500px; background: radial-gradient(circle,rgba(255,213,197,0.5),rgba(255,179,160,0.2)); bottom: -100px; left: -150px; opacity: 0.6; animation: blob-float 16s ease-in-out infinite alternate-reverse; }
  .ab-blob-3 { width: 300px; height: 300px; background: radial-gradient(circle,rgba(181,240,216,0.5),rgba(134,239,202,0.2)); top: 40%; left: 35%; opacity: 0.5; animation: blob-float 11s ease-in-out infinite alternate; }
  @keyframes blob-float { from{transform:translate(0,0) scale(1);} to{transform:translate(30px,20px) scale(1.1);} }

  .ab-inner { position: relative; z-index: 1; }

  /* ─── HERO ─── */
  .ab-hero {
    min-height: 92vh;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 6rem 1.5rem 4rem;
    position: relative;
  }

  /* Rotating ring decoration */
  .ab-ring {
    position: absolute; border-radius: 50%; border: 1.5px dashed rgba(79,110,247,0.2);
    pointer-events: none; animation: ring-spin 30s linear infinite;
  }
  .ab-ring.r1 { width: 420px; height: 420px; top: 50%; left: 50%; transform: translate(-50%,-50%); }
  .ab-ring.r2 { width: 620px; height: 620px; top: 50%; left: 50%; transform: translate(-50%,-50%); animation-direction: reverse; animation-duration: 50s; opacity: 0.5; }
  .ab-ring.r3 { width: 820px; height: 820px; top: 50%; left: 50%; transform: translate(-50%,-50%); animation-duration: 70s; opacity: 0.25; }
  @keyframes ring-spin { from{transform:translate(-50%,-50%) rotate(0deg);} to{transform:translate(-50%,-50%) rotate(360deg);} }

  /* Floating dots on ring */
  .ab-ring-dot {
    position: absolute; width: 8px; height: 8px; border-radius: 50%; top: -4px; left: 50%;
    margin-left: -4px;
    background: var(--blue); box-shadow: 0 0 12px rgba(79,110,247,0.6);
  }
  .ab-ring.r2 .ab-ring-dot { background: var(--purple); box-shadow: 0 0 12px rgba(124,92,191,0.6); }

  .ab-hero-content { position: relative; z-index: 1; max-width: 700px; margin: 0 auto; }

  .ab-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 0.68rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--blue); background: var(--blue-light); border: 1.5px solid var(--blue-mid);
    border-radius: 99px; padding: 6px 16px; margin-bottom: 1.5rem;
    animation: ab-up 0.6s both;
  }
  .ab-eyebrow::before, .ab-eyebrow::after {
    content: ''; width: 5px; height: 5px; border-radius: 50%; background: var(--blue); flex-shrink: 0;
  }

  .ab-hero-title {
    font-family: var(--font-serif);
    font-size: clamp(2.8rem, 7vw, 5.5rem);
    font-weight: 700; color: var(--text); margin: 0 0 1.2rem;
    line-height: 1.08; letter-spacing: -0.03em;
    animation: ab-up 0.7s 0.1s both;
  }
  .ab-hero-title em { font-style: italic; color: var(--blue); }
  .ab-hero-title .line2 { display: block; }

  .ab-hero-sub {
    font-size: 1.05rem; color: var(--text2); line-height: 1.8; margin: 0 auto 2.5rem;
    max-width: 520px; animation: ab-up 0.7s 0.2s both;
  }

  .ab-hero-ctas {
    display: flex; gap: 0.8rem; justify-content: center; flex-wrap: wrap;
    animation: ab-up 0.7s 0.3s both;
  }
  .ab-btn-primary {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 0.88rem; font-weight: 800; color: #fff;
    padding: 12px 28px; border-radius: 14px; text-decoration: none;
    background: linear-gradient(135deg,var(--blue),var(--purple));
    box-shadow: 0 8px 28px rgba(79,110,247,0.35);
    transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
  }
  .ab-btn-primary:hover { opacity: 0.88; transform: translateY(-2px); box-shadow: 0 16px 40px rgba(79,110,247,0.45); color: #fff; }
  .ab-btn-secondary {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 0.88rem; font-weight: 700; color: var(--text2);
    padding: 12px 24px; border-radius: 14px; text-decoration: none;
    background: var(--white); border: 1.5px solid var(--border);
    box-shadow: var(--shadow); transition: all 0.2s;
  }
  .ab-btn-secondary:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-light); }

  /* Scroll indicator */
  .ab-scroll-hint {
    position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    font-size: 0.65rem; font-weight: 700; color: var(--text3); letter-spacing: 0.1em; text-transform: uppercase;
    animation: ab-up 0.7s 0.5s both;
  }
  .ab-scroll-pill {
    width: 22px; height: 36px; border-radius: 99px; border: 2px solid var(--border);
    display: flex; justify-content: center; padding-top: 6px;
  }
  .ab-scroll-dot { width: 4px; height: 8px; border-radius: 99px; background: var(--blue); animation: scroll-bounce 1.8s ease-in-out infinite; }
  @keyframes scroll-bounce { 0%,100%{transform:translateY(0);opacity:1;} 50%{transform:translateY(10px);opacity:0.3;} }

  /* ─── STATS STRIP ─── */
  .ab-stats-strip {
    display: grid; grid-template-columns: repeat(4,1fr);
    gap: 1px; background: var(--border);
    border: 1.5px solid var(--border); border-radius: var(--radius);
    overflow: hidden; margin-bottom: 5rem;
    box-shadow: var(--shadow);
    animation: ab-up 0.6s 0.1s both;
  }
  .ab-stat-cell {
    background: var(--white); padding: 2rem 1.5rem; text-align: center;
    transition: background 0.2s;
  }
  .ab-stat-cell:hover { background: var(--blue-light); }
  .ab-stat-num {
    font-family: var(--font-serif); font-size: 3rem; font-weight: 700;
    color: var(--text); line-height: 1; letter-spacing: -0.03em;
    display: block;
  }
  .ab-stat-num em { color: var(--blue); font-style: italic; }
  .ab-stat-label { font-size: 0.78rem; font-weight: 700; color: var(--text2); margin-top: 0.4rem; text-transform: uppercase; letter-spacing: 0.08em; }

  /* ─── SECTION UTILITY ─── */
  .ab-section { padding: 0 0 5rem; }
  .ab-section-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 0.65rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--blue); background: var(--blue-light); border: 1.5px solid var(--blue-mid);
    border-radius: 99px; padding: 5px 13px; margin-bottom: 1rem;
  }
  .ab-section-title {
    font-family: var(--font-serif); font-size: clamp(1.8rem,3.5vw,2.8rem);
    font-weight: 700; color: var(--text); margin: 0 0 0.8rem; line-height: 1.15; letter-spacing: -0.02em;
  }
  .ab-section-title em { font-style: italic; color: var(--blue); }
  .ab-section-sub { font-size: 0.92rem; color: var(--text2); line-height: 1.8; max-width: 500px; }

  /* ─── MISSION SECTION ─── */
  .ab-mission-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;
    animation: ab-up 0.6s both;
  }
  .ab-mission-visual {
    position: relative; aspect-ratio: 1; max-width: 440px;
  }
  .ab-mission-bg-card {
    position: absolute; border-radius: 28px;
    background: linear-gradient(135deg,var(--blue-light),var(--purple-light));
    border: 1.5px solid var(--blue-mid);
  }
  .ab-mission-bg-card.c1 { inset: 0; }
  .ab-mission-bg-card.c2 { top: 20px; left: 20px; right: -20px; bottom: -20px; opacity: 0.5; z-index: -1; }
  .ab-mission-main-card {
    position: relative; z-index: 1;
    background: var(--white); border-radius: 22px;
    border: 1.5px solid var(--border); box-shadow: var(--shadow);
    padding: 2rem; margin: 1.5rem;
    display: flex; flex-direction: column; gap: 1rem;
  }
  .ab-mission-icon-row { display: flex; gap: 0.8rem; }
  .ab-icon-blob {
    width: 48px; height: 48px; border-radius: 14px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 1.4rem;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .ab-icon-blob:hover { transform: scale(1.15) rotate(-8deg); }
  .ab-mission-quote {
    font-family: var(--font-serif); font-size: 1.2rem; font-style: italic; color: var(--text);
    line-height: 1.5; border-left: 3px solid var(--blue); padding-left: 1rem;
  }

  /* Floating badge on mission */
  .ab-float-badge {
    position: absolute; background: var(--white);
    border: 1.5px solid var(--border); border-radius: 14px;
    box-shadow: 0 8px 28px rgba(79,110,247,0.15);
    padding: 0.7rem 1rem; display: flex; align-items: center; gap: 8px;
    font-size: 0.75rem; font-weight: 700; color: var(--text);
    animation: float-y 4s ease-in-out infinite alternate;
    z-index: 2;
  }
  .ab-float-badge.b1 { bottom: 10px; right: -10px; }
  .ab-float-badge.b2 { top: 10px; left: -15px; animation-direction: alternate-reverse; animation-duration: 5s; }
  .ab-float-badge-icon { width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
  @keyframes float-y { from{transform:translateY(0);} to{transform:translateY(-10px);} }

  /* ─── VALUES ─── */
  .ab-values-grid {
    display: grid; grid-template-columns: repeat(3,1fr); gap: 1.2rem;
  }
  .ab-value-card {
    background: var(--white); border-radius: var(--radius);
    border: 1.5px solid var(--border); box-shadow: var(--shadow);
    padding: 1.8rem; display: flex; flex-direction: column; gap: 0.9rem;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s, border-color 0.2s;
    animation: ab-up 0.5s both; position: relative; overflow: hidden;
  }
  .ab-value-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    border-radius: 99px 99px 0 0; opacity: 0; transition: opacity 0.2s;
  }
  .ab-value-card:nth-child(1)::before { background: linear-gradient(90deg,var(--blue),#818cf8); }
  .ab-value-card:nth-child(2)::before { background: linear-gradient(90deg,var(--green),#34d399); }
  .ab-value-card:nth-child(3)::before { background: linear-gradient(90deg,var(--orange),#fb923c); }
  .ab-value-card:nth-child(4)::before { background: linear-gradient(90deg,var(--purple),#a855f7); }
  .ab-value-card:nth-child(5)::before { background: linear-gradient(90deg,var(--yellow),#fbbf24); }
  .ab-value-card:nth-child(6)::before { background: linear-gradient(90deg,#06b6d4,#22d3ee); }
  .ab-value-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: var(--shadow-hover); border-color: #c7d0ff; }
  .ab-value-card:hover::before { opacity: 1; }
  /* Watermark */
  .ab-value-card::after {
    content: attr(data-num); position: absolute; bottom: -10px; right: 8px;
    font-family: var(--font-serif); font-size: 5rem; font-weight: 700;
    color: currentColor; opacity: 0.035; line-height: 1; pointer-events: none;
    transition: opacity 0.2s;
  }
  .ab-value-card:hover::after { opacity: 0.06; }
  .ab-value-icon { width: 52px; height: 52px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; }
  .ab-value-title { font-size: 1rem; font-weight: 800; color: var(--text); margin: 0; }
  .ab-value-text { font-size: 0.82rem; color: var(--text2); line-height: 1.7; margin: 0; }

  /* ─── TEAM ─── */
  .ab-team-grid {
    display: grid; grid-template-columns: repeat(4,1fr); gap: 1.3rem;
  }
  .ab-team-card {
    background: var(--white); border-radius: var(--radius);
    border: 1.5px solid var(--border); box-shadow: var(--shadow);
    overflow: hidden; text-align: center;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s, border-color 0.2s;
    animation: ab-up 0.5s both;
  }
  .ab-team-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: var(--shadow-hover); border-color: #c7d0ff; }
  .ab-team-avatar-wrap { padding: 1.8rem 1.5rem 0.8rem; }
  .ab-team-avatar {
    width: 80px; height: 80px; border-radius: 50%; margin: 0 auto;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-serif); font-size: 2rem; font-weight: 700; color: #fff;
    box-shadow: 0 8px 24px rgba(79,110,247,0.3);
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .ab-team-card:hover .ab-team-avatar { transform: scale(1.1); }
  .ab-team-body { padding: 0.6rem 1.2rem 1.4rem; }
  .ab-team-name { font-size: 0.92rem; font-weight: 800; color: var(--text); margin: 0 0 0.2rem; }
  .ab-team-role {
    font-size: 0.7rem; font-weight: 700; color: var(--blue);
    text-transform: uppercase; letter-spacing: 0.08em;
    background: var(--blue-light); border: 1px solid var(--blue-mid);
    border-radius: 99px; padding: 3px 10px; display: inline-block; margin-bottom: 0.6rem;
  }
  .ab-team-bio { font-size: 0.77rem; color: var(--text2); line-height: 1.6; }

  /* ─── CTA BANNER ─── */
  .ab-cta-banner {
    background: linear-gradient(135deg,#0f1035 0%,#1e1463 40%,#3730a3 70%,#4f6ef7 100%);
    border-radius: 28px; padding: 4rem 3rem;
    position: relative; overflow: hidden;
    text-align: center; box-shadow: 0 30px 80px rgba(15,16,53,0.4);
    animation: ab-up 0.6s both; margin-bottom: 4rem;
  }
  .ab-cta-banner::before {
    content: ''; position: absolute; top: -80%; left: -30%; width: 70%; height: 200%;
    background: linear-gradient(105deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0) 100%);
    transform: rotate(20deg); pointer-events: none;
  }
  .ab-cta-grid-overlay {
    position: absolute; inset: 0; pointer-events: none;
    background-image: linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px);
    background-size: 40px 40px;
  }
  .ab-cta-deco { position: absolute; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.07); pointer-events: none; }
  .ab-cta-deco.d1 { width: 300px; height: 300px; right: -100px; bottom: -100px; }
  .ab-cta-deco.d2 { width: 160px; height: 160px; left: 5%; top: -60px; }
  .ab-cta-content { position: relative; z-index: 1; max-width: 580px; margin: 0 auto; }
  .ab-cta-title { font-family: var(--font-serif); font-size: clamp(1.8rem,3.5vw,2.6rem); font-weight: 700; color: #fff; margin: 0 0 0.8rem; line-height: 1.2; }
  .ab-cta-title em { font-style: italic; opacity: 0.8; }
  .ab-cta-sub { font-size: 0.92rem; color: rgba(255,255,255,0.6); margin: 0 0 2rem; line-height: 1.7; }
  .ab-cta-btns { display: flex; gap: 0.8rem; justify-content: center; flex-wrap: wrap; }
  .ab-cta-btn-white {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 0.88rem; font-weight: 800; color: var(--text);
    padding: 12px 28px; border-radius: 14px; text-decoration: none;
    background: #fff; transition: opacity 0.2s, transform 0.2s;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  }
  .ab-cta-btn-white:hover { opacity: 0.9; transform: translateY(-2px); color: var(--blue); }
  .ab-cta-btn-ghost {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 0.88rem; font-weight: 700; color: rgba(255,255,255,0.8);
    padding: 12px 24px; border-radius: 14px; text-decoration: none;
    border: 1.5px solid rgba(255,255,255,0.25); background: rgba(255,255,255,0.08);
    transition: all 0.2s; backdrop-filter: blur(8px);
  }
  .ab-cta-btn-ghost:hover { background: rgba(255,255,255,0.15); color: #fff; border-color: rgba(255,255,255,0.4); }

  /* ─── ANIMATIONS ─── */
  @keyframes ab-up { from{opacity:0;transform:translateY(22px);} to{opacity:1;transform:translateY(0);} }

  /* ─── RESPONSIVE ─── */
  @media (max-width: 991px) {
    .ab-mission-grid { grid-template-columns: 1fr; }
    .ab-mission-visual { max-width: 100%; aspect-ratio: auto; }
    .ab-mission-main-card { margin: 1rem; }
    .ab-float-badge.b2 { display: none; }
    .ab-team-grid { grid-template-columns: repeat(2,1fr); }
    .ab-values-grid { grid-template-columns: repeat(2,1fr); }
    .ab-stats-strip { grid-template-columns: repeat(2,1fr); }
    .ab-ring { display: none; }
  }
  @media (max-width: 600px) {
    .ab-hero { min-height: 80vh; padding: 5rem 1rem 4rem; }
    .ab-cta-banner { padding: 2.5rem 1.5rem; }
    .ab-team-grid { grid-template-columns: repeat(2,1fr); }
    .ab-values-grid { grid-template-columns: 1fr; }
    .ab-stats-strip { grid-template-columns: repeat(2,1fr); }
  }
`

const TEAM = [
  { name: 'Sarah Chen', role: 'CEO & Founder', bio: 'Former Google engineer with 12 years in EdTech. Passionate about democratising education globally.', grad: 'linear-gradient(135deg,#4f6ef7,#7c5cbf)' },
  { name: 'Marcus Rivera', role: 'Head of Curriculum', bio: 'PhD in Educational Psychology. Designed learning programs for 200,000+ students worldwide.', grad: 'linear-gradient(135deg,#22c98e,#06b6d4)' },
  { name: 'Aisha Patel', role: 'Lead Instructor', bio: 'Award-winning educator and author of 3 bestselling programming books.', grad: 'linear-gradient(135deg,#ff7140,#ffb020)' },
  { name: 'James Okafor', role: 'CTO', bio: 'Built scalable learning infrastructure serving millions of concurrent learners every day.', grad: 'linear-gradient(135deg,#7c5cbf,#a855f7)' },
]

const VALUES = [
  { icon: '🎯', title: 'Outcome-First Learning', text: 'Every course is designed backwards from the job you want — not the topic a professor loves.', bg: 'var(--blue-light)' },
  { icon: '🌍', title: 'Radical Accessibility', text: 'World-class education should never be gated by geography, wealth, or background.', bg: 'var(--green-light)' },
  { icon: '🔬', title: 'Evidence-Based Design', text: 'We apply cognitive science and learning research to every video, quiz, and project.', bg: 'var(--orange-light)' },
  { icon: '🤝', title: 'Community First', text: 'Learning is social. Our forums, live sessions, and mentors keep you from ever feeling alone.', bg: 'var(--purple-light)' },
  { icon: '⚡', title: 'Speed of Industry', text: 'Courses updated every 90 days. When the tech changes, so do we — no stale content, ever.', bg: 'var(--yellow-light)' },
  { icon: '🏆', title: 'Verified Achievement', text: 'Our certificates are recognised by 1,200+ hiring partners across 60 countries.', bg: 'var(--blue-light)' },
]

const AboutUs = () => {
  return (
    <Layout>
      <style>{css}</style>
      <div className='ab-blob-wrap'>
        <div className='ab-blob ab-blob-1' /><div className='ab-blob ab-blob-2' /><div className='ab-blob ab-blob-3' />
      </div>

      <div className='ab-root'>
        <div className='ab-inner'>

          {/* ── HERO ── */}
          <section className='ab-hero'>
            <div className='ab-ring r1'><div className='ab-ring-dot' /></div>
            <div className='ab-ring r2'><div className='ab-ring-dot' /></div>
            <div className='ab-ring r3' />

            <div className='ab-hero-content'>
              <div className='ab-eyebrow'>About Smart Learning</div>
              <h1 className='ab-hero-title'>
                Education that
                <span className='line2'><em>actually</em> works</span>
              </h1>
              <p className='ab-hero-sub'>
                We started with one belief: the best education in the world should be available to anyone, anywhere — not just those who can afford a top university.
              </p>
              <div className='ab-hero-ctas'>
                <Link to='/courses' className='ab-btn-primary'>Explore Courses →</Link>
                <a href='#mission' className='ab-btn-secondary'>Our Mission ↓</a>
              </div>
            </div>

            <div className='ab-scroll-hint'>
              <div className='ab-scroll-pill'><div className='ab-scroll-dot' /></div>
              scroll
            </div>
          </section>

          <div className='container'>

            {/* ── STATS ── */}
            <div className='ab-stats-strip'>
              {[
                { num: '120', suffix: 'K+', label: 'Students Enrolled' },
                { num: '1.8', suffix: 'K', label: 'Hours of Content' },
                { num: '340', suffix: '+', label: 'Expert Instructors' },
                { num: '98', suffix: '%', label: 'Completion Rate' },
              ].map((s, i) => (
                <div key={i} className='ab-stat-cell'>
                  <span className='ab-stat-num'>{s.num}<em>{s.suffix}</em></span>
                  <div className='ab-stat-label'>{s.label}</div>
                </div>
              ))}
            </div>

            {/* ── MISSION ── */}
            <section id='mission' className='ab-section'>
              <div className='ab-mission-grid'>
                <div className='ab-mission-visual'>
                  <div className='ab-mission-bg-card c2' />
                  <div className='ab-mission-bg-card c1' />
                  <div className='ab-mission-main-card'>
                    <div className='ab-mission-icon-row'>
                      {[
                        { icon: '🎓', bg: 'linear-gradient(135deg,#4f6ef7,#7c5cbf)' },
                        { icon: '🚀', bg: 'linear-gradient(135deg,#22c98e,#06b6d4)' },
                        { icon: '💡', bg: 'linear-gradient(135deg,#ffb020,#ff7140)' },
                      ].map((b, i) => (
                        <div key={i} className='ab-icon-blob' style={{ background: b.bg, color: '#fff' }}>{b.icon}</div>
                      ))}
                    </div>
                    <div className='ab-mission-quote'>
                      "We don't just teach skills. We reshape careers, rebuild confidence, and rewrite futures."
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text2)', fontWeight: 600 }}>— Sarah Chen, CEO</div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {['Founded 2019', '60+ Countries', 'Award-Winning Platform'].map(tag => (
                        <span key={tag} style={{ fontSize: '0.68rem', fontWeight: 700, padding: '4px 10px', borderRadius: '99px', background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text2)' }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className='ab-float-badge b1'>
                    <div className='ab-float-badge-icon' style={{ background: 'var(--green-light)' }}>🏆</div>
                    <div><div style={{ fontWeight: 800, fontSize: '0.78rem' }}>Best EdTech 2024</div><div style={{ fontSize: '0.65rem', color: 'var(--text3)' }}>Forbes Education Awards</div></div>
                  </div>
                  <div className='ab-float-badge b2'>
                    <div className='ab-float-badge-icon' style={{ background: 'var(--yellow-light)' }}>⭐</div>
                    <div><div style={{ fontWeight: 800, fontSize: '0.78rem' }}>4.9 / 5.0 Rating</div><div style={{ fontSize: '0.65rem', color: 'var(--text3)' }}>120,000+ Reviews</div></div>
                  </div>
                </div>

                <div>
                  <div className='ab-section-eyebrow'>Our Mission</div>
                  <h2 className='ab-section-title'>We exist to <em>close</em> the skills gap</h2>
                  <p className='ab-section-sub' style={{ marginBottom: '1.5rem' }}>
                    The world changes faster than traditional education can keep up. By the time a student graduates, half their coursework is already outdated.
                  </p>
                  <p className='ab-section-sub' style={{ marginBottom: '1.5rem' }}>
                    Smart Learning was built to fix that. We partner directly with industry leaders to ensure every course reflects what employers actually need — today, not five years ago.
                  </p>
                  <p className='ab-section-sub'>
                    From a first line of code to a promotion to senior engineer, we're with you at every step.
                  </p>
                  <div style={{ display: 'flex', gap: '0.8rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                    <Link to='/courses' className='ab-btn-primary'>Start Learning →</Link>
                    <Link to='/courses' className='ab-btn-secondary'>View Courses</Link>
                  </div>
                </div>
              </div>
            </section>

            {/* ── VALUES ── */}
            <section className='ab-section'>
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <div className='ab-section-eyebrow' style={{ display: 'inline-flex' }}>Our Values</div>
                <h2 className='ab-section-title'>What we <em>stand</em> for</h2>
              </div>
              <div className='ab-values-grid'>
                {VALUES.map((v, i) => (
                  <div key={i} className='ab-value-card' data-num={i + 1} style={{ animationDelay: `${i * 0.07}s` }}>
                    <div className='ab-value-icon' style={{ background: v.bg }}>{v.icon}</div>
                    <div className='ab-value-title'>{v.title}</div>
                    <p className='ab-value-text'>{v.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── TEAM ── */}
            <section className='ab-section'>
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <div className='ab-section-eyebrow' style={{ display: 'inline-flex' }}>The Team</div>
                <h2 className='ab-section-title'>People behind <em>the platform</em></h2>
                <p className='ab-section-sub' style={{ margin: '0.5rem auto 0', textAlign: 'center' }}>A small, obsessive team united by one mission: make learning work.</p>
              </div>
              <div className='ab-team-grid'>
                {TEAM.map((member, i) => (
                  <div key={i} className='ab-team-card' style={{ animationDelay: `${i * 0.07}s` }}>
                    <div className='ab-team-avatar-wrap'>
                      <div className='ab-team-avatar' style={{ background: member.grad }}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div className='ab-team-body'>
                      <div className='ab-team-name'>{member.name}</div>
                      <div className='ab-team-role'>{member.role}</div>
                      <p className='ab-team-bio'>{member.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── CTA BANNER ── */}
            <div className='ab-cta-banner'>
              <div className='ab-cta-grid-overlay' />
              <div className='ab-cta-deco d1' /><div className='ab-cta-deco d2' />
              <div className='ab-cta-content'>
                <h2 className='ab-cta-title'>Ready to transform <em>your career?</em></h2>
                <p className='ab-cta-sub'>Join 120,000+ learners who have already taken the leap. Your first course is free — no credit card required.</p>
                <div className='ab-cta-btns'>
                  <Link to='/courses' className='ab-cta-btn-white'>🎓 Start for Free →</Link>
                  <Link to='/courses' className='ab-cta-btn-ghost'>Browse Courses</Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AboutUs