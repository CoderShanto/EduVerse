import React, { useContext, useEffect, useMemo, useState } from "react";
import Layout from "../../../common/Layout";
import UserSidebar from "../../../common/UserSidebar";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/Auth";
import { apiUrl, token as configToken } from "../../../common/Config";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,400&display=swap');

  :root {
    --bg: #f0f4ff;
    --white: #ffffff;
    --blue: #4f6ef7;
    --blue-light: #eef0ff;
    --blue-mid: #dde2ff;
    --purple: #7c5cbf;
    --orange: #ff7140;
    --orange-light: #fff2ee;
    --green: #22c98e;
    --green-light: #e6faf3;
    --yellow: #ffb020;
    --text: #14142b;
    --text2: #6e7191;
    --text3: #a0abc0;
    --border: #e4e7f4;
    --radius: 22px;
    --radius-sm: 14px;
    --shadow: 0 4px 24px rgba(79,110,247,0.08);
    --shadow-hover: 0 16px 48px rgba(79,110,247,0.16);
    --font: 'Plus Jakarta Sans', sans-serif;
    --font-serif: 'Fraunces', serif;
  }

  .sd-root {
    background: var(--bg);
    min-height: 100vh;
    font-family: var(--font);
    padding-bottom: 4rem;
    color: var(--text);
    position: relative;
  }

  .sd-blob-wrap {
    position: fixed;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 0;
  }
  .sd-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.35;
  }
  .sd-blob-1 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, #c7d0ff, #a5b4fc);
    top: -150px;
    right: -100px;
    animation: blob-float 10s ease-in-out infinite alternate;
  }
  .sd-blob-2 {
    width: 380px;
    height: 380px;
    background: radial-gradient(circle, #ffd5c5, #ffb3a0);
    bottom: 0;
    left: -80px;
    animation: blob-float 14s ease-in-out infinite alternate-reverse;
  }
  .sd-blob-3 {
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, #b5f0d8, #86efca);
    top: 40%;
    left: 40%;
    animation: blob-float 8s ease-in-out infinite alternate;
  }
  @keyframes blob-float {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(30px, 20px) scale(1.1); }
  }

  .sd-inner { position: relative; z-index: 1; }

  .sd-bc {
    font-size: 0.75rem; color: var(--text3);
    padding: 1.5rem 0 1rem;
    display: flex; align-items: center; gap: 0.4rem;
    font-weight: 500;
  }
  .sd-bc a { color: var(--blue); text-decoration: none; }
  .sd-bc a:hover { text-decoration: underline; }

  /* Greeting */
  .sd-greeting {
    background: linear-gradient(135deg, #4f6ef7 0%, #7c5cbf 60%, #a855f7 100%);
    border-radius: 28px;
    padding: 2.2rem 2.4rem;
    display: flex; align-items: center;
    justify-content: space-between; gap: 1.5rem;
    margin-bottom: 1.8rem;
    position: relative; overflow: hidden;
    box-shadow: 0 20px 60px rgba(79,110,247,0.35);
    animation: sd-up 0.6s cubic-bezier(0.22,1,0.36,1) both;
  }
  .sd-greeting::before {
    content: '';
    position: absolute; top: -60%; left: -20%;
    width: 60%; height: 200%;
    background: linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0) 100%);
    transform: rotate(25deg); pointer-events: none;
  }
  .sd-greeting-deco {
    position: absolute; border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.15); pointer-events: none;
  }
  .sd-greeting-deco.d1 { width: 200px; height: 200px; right: -60px; bottom: -60px; }
  .sd-greeting-deco.d2 { width: 120px; height: 120px; right: 80px; top: -40px; }
  .sd-greeting-left { display: flex; align-items: center; gap: 1.4rem; position: relative; z-index: 1; }
  .sd-avatar {
    width: 64px; height: 64px; border-radius: 20px;
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255,255,255,0.35);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-serif); font-size: 1.5rem; font-style: italic; color: #fff;
    flex-shrink: 0; box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    animation: pop-in 0.5s 0.15s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes pop-in {
    from { opacity: 0; transform: scale(0.5) rotate(-15deg); }
    to   { opacity: 1; transform: scale(1) rotate(0); }
  }
  .sd-greeting-text h2 {
    font-size: 1.45rem; font-weight: 800; color: #fff; margin: 0; letter-spacing: -0.02em;
  }
  .sd-greeting-text p { font-size: 0.82rem; color: rgba(255,255,255,0.65); margin: 0.3rem 0 0; }

  .sd-clock { z-index: 1; text-align: right; flex-shrink: 0; }
  .sd-clock-time {
    font-family: var(--font-serif); font-size: 2.6rem; font-weight: 700;
    color: #fff; line-height: 1; letter-spacing: -0.03em;
  }
  .sd-clock-ampm {
    font-family: var(--font-serif); font-size: 1.2rem; font-weight: 400;
    color: rgba(255,255,255,0.7); margin-left: 4px; vertical-align: baseline;
  }
  .sd-secs { opacity: 0.4; font-size: 1.8rem; }
  .sd-clock-date { font-size: 0.75rem; color: rgba(255,255,255,0.6); margin-top: 0.25rem; font-weight: 500; }
  .sd-clock-day { font-size: 0.7rem; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.1rem; }
  .sd-live-badge {
    display: inline-flex; align-items: center; gap: 5px;
    background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25);
    border-radius: 99px; padding: 3px 10px;
    font-size: 0.65rem; font-weight: 700; color: #fff;
    text-transform: uppercase; letter-spacing: 0.08em; margin-top: 0.5rem;
  }
  .sd-live-badge::before {
    content: ''; width: 6px; height: 6px; border-radius: 50%;
    background: #4ade80; box-shadow: 0 0 8px #4ade80;
    animation: live-pulse 1.6s ease-in-out infinite;
  }
  @keyframes live-pulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }

  /* Stat Cards */
  .sd-stats-row {
    display: grid; grid-template-columns: repeat(3,1fr); gap: 1.2rem; margin-bottom: 1.6rem;
  }
  .sd-stat-card {
    background: var(--white); border-radius: var(--radius);
    padding: 1.6rem 1.5rem; border: 1.5px solid var(--border);
    box-shadow: var(--shadow); position: relative; overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
    animation: sd-up 0.5s both; display: flex; flex-direction: column;
  }
  .sd-stat-card:nth-child(1){animation-delay:0.1s;}
  .sd-stat-card:nth-child(2){animation-delay:0.2s;}
  .sd-stat-card:nth-child(3){animation-delay:0.3s;}
  .sd-stat-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: var(--shadow-hover); }
  .sd-stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 4px; border-radius: 99px 99px 0 0;
  }
  .sd-stat-card.c-blue::before { background: linear-gradient(90deg,#4f6ef7,#818cf8); }
  .sd-stat-card.c-orange::before { background: linear-gradient(90deg,#ff7140,#fb923c); }
  .sd-stat-card.c-green::before { background: linear-gradient(90deg,#22c98e,#34d399); }
  .sd-stat-card::after {
    content: attr(data-num); position: absolute; right: -10px; bottom: -20px;
    font-family: var(--font-serif); font-size: 7rem; font-weight: 700; line-height: 1;
    opacity: 0.04; color: #000; pointer-events: none; user-select: none;
  }
  .sd-stat-icon {
    width: 48px; height: 48px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; margin-bottom: 1.2rem;
  }
  .c-blue .sd-stat-icon { background: var(--blue-light); }
  .c-orange .sd-stat-icon { background: var(--orange-light); }
  .c-green .sd-stat-icon { background: var(--green-light); }
  .sd-num {
    font-family: var(--font-serif); font-size: 3.2rem; font-weight: 700;
    line-height: 1; color: var(--text); margin-bottom: 0.3rem;
  }
  .sd-label {
    font-size: 0.8rem; color: var(--text2); font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .sd-stat-link {
    margin-top: auto; padding-top: 1rem; font-size: 0.78rem; font-weight: 700;
    text-decoration: none; display: inline-flex; align-items: center; gap: 5px;
    transition: gap 0.2s;
  }
  .c-blue .sd-stat-link { color: var(--blue); }
  .c-orange .sd-stat-link { color: var(--orange); }
  .c-green .sd-stat-link { color: var(--green); }
  .sd-stat-link:hover { gap: 10px; }

  /* Cards */
  .sd-card {
    background: var(--white); border-radius: var(--radius);
    padding: 1.6rem; border: 1.5px solid var(--border);
    box-shadow: var(--shadow); height: 100%;
    animation: sd-up 0.5s 0.3s both; position: relative; overflow: hidden;
  }
  .sd-section-title {
    font-size: 0.72rem; font-weight: 800; color: var(--text2);
    text-transform: uppercase; letter-spacing: 0.12em;
    margin: 0 0 1.2rem; display: flex; align-items: center; gap: 0.5rem;
  }
  .sd-section-title::after { content: ''; flex: 1; height: 1.5px; background: var(--border); }
  .sd-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  .sd-course-row {
    display: flex; align-items: center; gap: 1rem;
    padding: 0.85rem 0; border-bottom: 1px solid var(--border);
  }
  .sd-course-row:last-of-type { border-bottom: none; }
  .sd-course-thumb {
    width: 46px; height: 46px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; flex-shrink: 0; overflow: hidden;
    background: var(--blue-light); border: 1.5px solid var(--border);
  }
  .sd-course-thumb img { width:100%; height:100%; object-fit:cover; display:block; }
  .sd-course-info { flex: 1; min-width: 0; }
  .sd-course-name {
    font-size: 0.85rem; font-weight: 700; color: var(--text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .sd-course-pct { font-size: 0.7rem; color: var(--text3); margin-top: 0.15rem; font-weight: 500; }
  .sd-prog-track {
    background: var(--bg); border-radius: 99px; height: 5px; overflow: hidden; margin-top: 0.4rem;
  }
  .sd-prog-fill {
    height: 100%; border-radius: 99px;
    background: linear-gradient(90deg, var(--blue), #818cf8);
    transition: width 0.8s cubic-bezier(0.25,1,0.5,1);
  }
  .sd-continue-btn {
    font-size: 0.72rem; font-weight: 700; color: var(--blue); text-decoration: none;
    white-space: nowrap; display: inline-flex; align-items: center; gap: 4px;
    padding: 6px 12px; border: 1.5px solid var(--blue-mid); border-radius: 10px;
    background: var(--blue-light); transition: all 0.2s;
  }
  .sd-continue-btn:hover { background: var(--blue); color: #fff; border-color: var(--blue); gap: 8px; }

  .sd-list-row {
    background: var(--bg); border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    padding: 0.9rem 1rem; display: flex; align-items: flex-start;
    justify-content: space-between; gap: 0.8rem;
    transition: border-color 0.2s, transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
  }
  .sd-list-row:hover {
    border-color: #c7d0ff; transform: translateX(5px);
    box-shadow: 0 4px 20px rgba(79,110,247,0.1);
  }
  .sd-list-row-title {
    font-size: 0.84rem; font-weight: 700; color: var(--text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .sd-list-row-sub {
    font-size: 0.72rem; color: var(--text2);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 0.2rem;
  }
  .sd-pill {
    font-size: 0.65rem; padding: 3px 9px; border-radius: 999px;
    border: 1.5px solid var(--border); background: var(--white);
    color: var(--text2); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;
  }
  .sd-view-btn {
    font-size: 0.72rem; font-weight: 700; color: var(--purple);
    text-decoration: none; white-space: nowrap;
    display: inline-flex; align-items: center; gap: 4px;
    padding: 5px 10px; border: 1.5px solid #e0d5f5;
    border-radius: 9px; background: #f5f0ff; flex-shrink: 0; transition: all 0.2s;
  }
  .sd-view-btn:hover { background: var(--purple); color: #fff; border-color: var(--purple); }
  .sd-hub-link {
    font-size: 0.76rem; font-weight: 700; color: var(--blue); text-decoration: none;
    display: inline-flex; align-items: center; gap: 5px;
    margin-top: 0.8rem; opacity: 0.8; transition: gap 0.2s, opacity 0.2s;
  }
  .sd-hub-link:hover { gap: 9px; opacity: 1; }

  .sd-muted { font-size: 0.82rem; color: var(--text2); line-height: 1.6; }
  .sd-muted a { color: var(--blue); text-decoration: none; font-weight: 600; }
  .sd-muted a:hover { text-decoration: underline; }

  .sd-skeleton {
    border-radius: var(--radius); height: 130px;
    background: linear-gradient(90deg,#e8ecff 0%,#f0f4ff 50%,#e8ecff 100%);
    background-size: 700px 100%; animation: shimmer 1.6s infinite;
    border: 1.5px solid var(--border);
  }
  @keyframes shimmer {
    0%   { background-position: -700px 0; }
    100% { background-position: 700px 0; }
  }
  @keyframes sd-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 900px) { .sd-stats-row { grid-template-columns: 1fr; } }
  @media (max-width: 768px) {
    .sd-greeting { flex-direction: column; text-align: center; align-items: center; }
    .sd-clock { text-align: center; }
    .sd-greeting-left { flex-direction: column; align-items: center; }
  }
`;

// ✅ FIX: remove /api and /api/ safely
const backendBase = apiUrl.replace(/\/api\/?$/, "");

// ✅ FIX: return usable src for all formats
const resolveImg = (raw, title) => {
  const placeholder = `https://placehold.co/200x200?text=${encodeURIComponent(title || "Course")}`;

  if (!raw || typeof raw !== "string") return { src: placeholder, placeholder };

  const trimmed = raw.trim();
  if (!trimmed) return { src: placeholder, placeholder };

  if (/^https?:\/\//i.test(trimmed)) return { src: trimmed, placeholder };
  if (trimmed.startsWith("/")) return { src: `${backendBase}${trimmed}`, placeholder };
  if (/^(uploads|storage)\//i.test(trimmed)) return { src: `${backendBase}/${trimmed}`, placeholder };

  return { src: `${backendBase}/uploads/course/small/${trimmed}`, placeholder };
};

const getTimeGreeting = () => {
  const h = new Date().getHours();
  if (h >= 4 && h < 12) return "Morning";
  if (h >= 12 && h < 17) return "Afternoon";
  if (h >= 17 && h < 21) return "Evening";
  return "Night";
};

// ── LiveClock: 12-hour format with AM/PM ──
const LiveClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const raw = now.getHours();
  const ampm = raw >= 12 ? "PM" : "AM";
  const hour = raw % 12 === 0 ? 12 : raw % 12;
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return (
    <div className="sd-clock">
      <div className="sd-clock-time">
        {hour}:{mm}
        <span className="sd-secs">:{ss}</span>
        <span className="sd-clock-ampm">{ampm}</span>
      </div>
      <div className="sd-clock-date">
        {now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </div>
      <div className="sd-clock-day">{now.toLocaleDateString("en-US", { weekday: "long" })}</div>
      <div className="sd-live-badge">Live</div>
    </div>
  );
};

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const authToken = user?.token || user?.user?.token || configToken;

  const userName = user?.user?.name || user?.name || "Student";
  const initials = useMemo(
    () => (userName || "Student").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    [userName]
  );

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [latestProblems, setLatestProblems] = useState([]);
  const [latestShowcases, setLatestShowcases] = useState([]);

  // ✅ NEW: thumbnail cache for course progress
  const [courseThumbs, setCourseThumbs] = useState({}); // { [courseId]: imagePathOrUrl }

  const enrolled = stats?.enrolled_courses ?? 0;
  const completed = stats?.completed_courses ?? 0;
  const streak = stats?.streak_days ?? 0;
  const progressCourses = Array.isArray(stats?.progress_courses) ? stats.progress_courses : [];

  // this route in your project is /account/watch-course/:id (your MyLearning uses /account/watch-course)
  const WATCH_ROUTE_BASE = "/account/watch-course";

  // ✅ Hydrate course thumbnails using course_id
  const hydrateProgressImages = async (progressList) => {
    try {
      const ids = [...new Set(progressList.map((c) => c?.course_id || c?.course?.id).filter(Boolean))];
      if (ids.length === 0) return;

      const missing = ids.filter((id) => !courseThumbs[id]);
      if (missing.length === 0) return;

      const results = await Promise.all(
        missing.map(async (id) => {
          try {
            const r = await fetch(`${apiUrl}/courses/${id}`, {
              headers: { Accept: "application/json", Authorization: `Bearer ${authToken}` },
            });
            const j = await r.json();

            // adapt to your backend shapes
            const course = j?.course || j?.data || (j?.status === 200 ? j?.data : null);

            const img =
              course?.course_small_image ||
              course?.image ||
              course?.course_image ||
              course?.cover_image ||
              "";

            return [id, img];
          } catch {
            return [id, ""];
          }
        })
      );

      const next = {};
      for (const [id, img] of results) next[id] = img;

      setCourseThumbs((prev) => ({ ...prev, ...next }));
    } catch (e) {
      console.log("Hydrate progress images error:", e);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);

        // stats
        const sR = await fetch(`${apiUrl}/dashboard/stats`, {
          headers: { Accept: "application/json", Authorization: `Bearer ${authToken}` },
        });
        const sJ = await sR.json();
        const newStats = sJ?.status === 200 ? sJ.stats : null;
        setStats(newStats);

        // ✅ hydrate images for course progress
        const pc = Array.isArray(newStats?.progress_courses) ? newStats.progress_courses : [];
        await hydrateProgressImages(pc);

        // problems
        const pR = await fetch(`${apiUrl}/problems?page=1`, {
          headers: { Accept: "application/json", Authorization: `Bearer ${authToken}` },
        });
        const pJ = await pR.json();
        setLatestProblems((pJ?.status === 200 ? pJ.data?.data || [] : []).slice(0, 4));

        // showcases
        const shR = await fetch(`${apiUrl}/showcases?page=1`, {
          headers: { Accept: "application/json", Authorization: `Bearer ${authToken}` },
        });
        const shJ = await shR.json();
        const raw = shJ?.status === 200 ? shJ.data?.data || shJ.data || [] : [];
        setLatestShowcases((Array.isArray(raw) ? raw : []).slice(0, 4));
      } catch (e) {
        console.log("Dashboard error:", e);
      } finally {
        setLoading(false);
      }
    };

    if (authToken) loadAll();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

  return (
    <Layout>
      <style>{css}</style>

      <div className="sd-blob-wrap">
        <div className="sd-blob sd-blob-1" />
        <div className="sd-blob sd-blob-2" />
        <div className="sd-blob sd-blob-3" />
      </div>

      <div className="sd-root">
        <div className="container sd-inner">
          <nav className="sd-bc">
            <Link to="/account/dashboard">Account</Link>
            <span>›</span>
            <span>Student Dashboard</span>
          </nav>

          <div className="row">
            <div className="col-lg-3 account-sidebar mb-4">
              <UserSidebar />
            </div>

            <div className="col-lg-9">
              <div className="sd-greeting mb-4">
                <div className="sd-greeting-deco d1" />
                <div className="sd-greeting-deco d2" />
                <div className="sd-greeting-left">
                  <div className="sd-avatar">{initials}</div>
                  <div className="sd-greeting-text">
                    <h2>
                      Good {getTimeGreeting()}, {userName}! 👋
                    </h2>
                    <p>Learn courses &amp; build real projects in Innovation.</p>
                  </div>
                </div>
                <LiveClock />
              </div>

              {loading ? (
                <div className="sd-stats-row mb-4">{[1, 2, 3].map((i) => <div key={i} className="sd-skeleton" />)}</div>
              ) : (
                <>
                  <div className="sd-stats-row mb-4">
                    <div className="sd-stat-card c-blue" data-num={enrolled}>
                      <div className="sd-stat-icon">📚</div>
                      <div className="sd-num">{enrolled}</div>
                      <div className="sd-label">Enrolled Courses</div>
                      <Link to="/account/student/my-learning" className="sd-stat-link">
                        View All →
                      </Link>
                    </div>

                    <div className="sd-stat-card c-orange" data-num={completed}>
                      <div className="sd-stat-icon">✅</div>
                      <div className="sd-num">{completed}</div>
                      <div className="sd-label">Completed</div>
                      <Link to="/account/certificates" className="sd-stat-link">
                        Certificates →
                      </Link>
                    </div>

                    <div className="sd-stat-card c-green" data-num={streak}>
                      <div className="sd-stat-icon">🔥</div>
                      <div className="sd-num">{streak}</div>
                      <div className="sd-label">Day Streak</div>
                      {streak > 0 ? (
                        <span className="sd-stat-link" style={{ cursor: "default", color: "var(--text3)" }}>
                          Keep it going!
                        </span>
                      ) : (
                        <Link to="/account/student/my-learning" className="sd-stat-link">
                          Start today →
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* ✅ COURSE PROGRESS - FIXED THUMBNAILS */}
                  <div className="row g-3 mb-4">
                    <div className="col-12">
                      <div className="sd-card">
                        <p className="sd-section-title">
                          <span className="sd-dot" style={{ background: "var(--blue)" }} />
                          Course Progress
                        </p>

                        {progressCourses.length > 0 ? (
                          <>
                            {progressCourses.map((c, i) => {
                              const courseId = c?.course_id || c?.course?.id;
                              const title = c?.title || c?.course_title || c?.course?.title || "Course";
                              const pct = Number.isFinite(Number(c.progress)) ? Number(c.progress) : 0;

                              // ✅ take from progress item OR hydrated cache
                              const rawImg =
                                c?.image_small_url ||
                                c?.image_url ||
                                c?.course_small_image ||
                                c?.image ||
                                c?.course?.course_small_image ||
                                c?.course?.image ||
                                (courseId ? courseThumbs[courseId] : "") ||
                                "";

                              const { src, placeholder } = resolveImg(rawImg, title);

                              return (
                                <div key={`${courseId || "course"}-${i}`} className="sd-course-row">
                                  <div className="sd-course-thumb">
                                    <img
                                      src={src}
                                      alt={title}
                                      onError={(ev) => {
                                        ev.currentTarget.src = placeholder;
                                      }}
                                    />
                                  </div>

                                  <div className="sd-course-info">
                                    <div className="sd-course-name">{title}</div>
                                    <div className="sd-prog-track">
                                      <div className="sd-prog-fill" style={{ width: `${pct}%` }} />
                                    </div>
                                    <div className="sd-course-pct">{pct}% complete</div>
                                  </div>

                                  {courseId && (
                                    <Link to={`${WATCH_ROUTE_BASE}/${courseId}`} className="sd-continue-btn">
                                      Continue →
                                    </Link>
                                  )}
                                </div>
                              );
                            })}

                            <Link to="/account/student/my-learning" className="sd-hub-link" style={{ marginTop: "0.8rem" }}>
                              All courses →
                            </Link>
                          </>
                        ) : (
                          <div className="sd-muted">
                            No course progress yet. Start from <Link to="/account/student/my-learning">My Courses</Link>.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Innovation Spotlight */}
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <div className="sd-card">
                        <p className="sd-section-title">
                          <span className="sd-dot" style={{ background: "var(--yellow)" }} />
                          Innovation Spotlight
                        </p>
                        {latestProblems.length === 0 ? (
                          <div className="sd-muted">
                            No problems yet. Post one in <Link to="/account/innovation">Problem Hub</Link>.
                          </div>
                        ) : (
                          <div className="d-flex flex-column gap-2">
                            {latestProblems.map((p, idx) => (
                              <div key={p.id} className="sd-list-row" style={{ animationDelay: `${idx * 0.06}s` }}>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                  <div className="sd-list-row-title">{p.title}</div>
                                  <div className="sd-list-row-sub">{String(p.description || "").slice(0, 70)}</div>
                                  <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                                    <span className="sd-pill">{p.category || "General"}</span>
                                    <span className="sd-pill">{p.status || "open"}</span>
                                  </div>
                                </div>
                                <Link to={`/account/innovation/problem/${p.id}`} className="sd-view-btn">
                                  View →
                                </Link>
                              </div>
                            ))}
                            <Link to="/account/innovation" className="sd-hub-link">
                              Go to Problem Hub →
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Showcase Spotlight */}
                    <div className="col-md-6">
                      <div className="sd-card">
                        <p className="sd-section-title">
                          <span className="sd-dot" style={{ background: "var(--green)" }} />
                          Showcase Spotlight
                        </p>
                        {latestShowcases.length === 0 ? (
                          <div className="sd-muted">
                            No showcases yet. Build in <Link to="/account/innovation/my-teams">My Teams</Link> and publish.
                          </div>
                        ) : (
                          <div className="d-flex flex-column gap-2">
                            {latestShowcases.map((s, idx) => (
                              <div key={s.id || s.idea_id} className="sd-list-row" style={{ animationDelay: `${idx * 0.06}s` }}>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                  <div className="sd-list-row-title">{s.idea_title || s.title || "Showcase"}</div>
                                  <div className="sd-list-row-sub">Problem: {s.problem_title || "—"}</div>
                                  <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                                    <span className="sd-pill">Score: {s.score ?? 0}/10</span>
                                    <span className="sd-pill">Completed</span>
                                  </div>
                                </div>
                                <Link to={`/account/innovation/showcases/${s.id || s.idea_id}`} className="sd-view-btn">
                                  Open →
                                </Link>
                              </div>
                            ))}
                            <Link to="/account/innovation/showcase" className="sd-hub-link">
                              Explore all →
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;