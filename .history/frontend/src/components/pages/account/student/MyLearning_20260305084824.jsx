import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../common/Layout";
import UserSidebar from "../../../common/UserSidebar";
import { apiUrl, token } from "../../../common/Config";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,400&display=swap');
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
    --text: #14142b;
    --text2: #6e7191;
    --text3: #a0abc0;
    --border: #e4e7f4;
    --radius: 22px;
    --radius-sm: 14px;
    --shadow: 0 4px 24px rgba(79,110,247,0.08);
    --shadow-hover: 0 20px 50px rgba(79,110,247,0.18);
    --font: 'Plus Jakarta Sans', sans-serif;
    --font-serif: 'Fraunces', serif;
  }
  .ml-root { background: var(--bg); min-height: 100vh; font-family: var(--font); padding-bottom: 4rem; color: var(--text); position: relative; }
  .ml-blob-wrap { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
  .ml-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.28; }
  .ml-blob-1 { width: 500px; height: 500px; background: radial-gradient(circle,#c7d0ff,#a5b4fc); top: -150px; right: -100px; animation: blob-float 10s ease-in-out infinite alternate; }
  .ml-blob-2 { width: 360px; height: 360px; background: radial-gradient(circle,#ffd5c5,#ffb3a0); bottom: 0; left: -80px; animation: blob-float 14s ease-in-out infinite alternate-reverse; }
  .ml-blob-3 { width: 220px; height: 220px; background: radial-gradient(circle,#b5f0d8,#86efca); top: 40%; left: 40%; animation: blob-float 9s ease-in-out infinite alternate; }
  @keyframes blob-float { from{transform:translate(0,0) scale(1);} to{transform:translate(28px,18px) scale(1.1);} }
  .ml-inner { position: relative; z-index: 1; }
  .ml-bc { font-size: 0.75rem; color: var(--text3); padding: 1.5rem 0 1rem; display: flex; align-items: center; gap: 0.4rem; font-weight: 500; }
  .ml-bc a { color: var(--blue); text-decoration: none; }
  .ml-bc a:hover { text-decoration: underline; }
  .ml-hero { background: linear-gradient(135deg,#4f6ef7 0%,#7c5cbf 55%,#a855f7 100%); border-radius: 28px; padding: 1.8rem 2.2rem; margin-bottom: 1.8rem; position: relative; overflow: hidden; box-shadow: 0 20px 60px rgba(79,110,247,0.32); animation: ml-up 0.6s cubic-bezier(0.22,1,0.36,1) both; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
  .ml-hero::before { content: ''; position: absolute; top: -60%; left: -20%; width: 60%; height: 200%; background: linear-gradient(105deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.1) 50%,rgba(255,255,255,0) 100%); transform: rotate(25deg); pointer-events: none; }
  .ml-hero-deco { position: absolute; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.12); pointer-events: none; }
  .ml-hero-deco.d1 { width: 200px; height: 200px; right: -60px; bottom: -60px; }
  .ml-hero-deco.d2 { width: 110px; height: 110px; right: 80px; top: -40px; }
  .ml-hero-left { position: relative; z-index: 1; }
  .ml-hero-title { font-size: 1.5rem; font-weight: 800; color: #fff; margin: 0; letter-spacing: -0.02em; }
  .ml-hero-sub { font-size: 0.8rem; color: rgba(255,255,255,0.65); margin-top: 0.3rem; }
  .ml-count-chip { position: relative; z-index: 1; background: rgba(255,255,255,0.18); border: 1.5px solid rgba(255,255,255,0.3); border-radius: 99px; padding: 6px 18px; font-family: var(--font-serif); font-size: 1.1rem; font-weight: 700; color: #fff; display: inline-flex; align-items: center; gap: 8px; }
  .ml-count-chip span { font-family: var(--font); font-size: 0.72rem; font-weight: 600; opacity: 0.7; }
  .ml-search-wrap { position: relative; margin-bottom: 1.6rem; animation: ml-up 0.5s 0.1s both; }
  .ml-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text3); pointer-events: none; }
  .ml-search { width: 100%; padding: 0.75rem 1rem 0.75rem 2.6rem; border: 1.5px solid var(--border); border-radius: var(--radius-sm); background: var(--white); font-family: var(--font); font-size: 0.88rem; color: var(--text); outline: none; box-shadow: var(--shadow); transition: border-color 0.2s, box-shadow 0.2s; }
  .ml-search:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(79,110,247,0.12); }
  .ml-search::placeholder { color: var(--text3); }
  .ml-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.2rem; }
  .ml-card { background: var(--white); border-radius: var(--radius); border: 1.5px solid var(--border); overflow: hidden; box-shadow: var(--shadow); transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s, border-color 0.2s; text-decoration: none; color: inherit; display: block; animation: ml-up 0.4s both; position: relative; }
  .ml-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: var(--shadow-hover); border-color: #c7d0ff; color: inherit; text-decoration: none; }
  .ml-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg,var(--blue),#818cf8); opacity: 0; transition: opacity 0.2s; z-index: 1; }
  .ml-card:hover::before { opacity: 1; }
  .ml-cover { height: 148px; background: linear-gradient(135deg,var(--blue-light),var(--blue-mid)); display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; }
  .ml-cover img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
  .ml-card:hover .ml-cover img { transform: scale(1.05); }
  .ml-cover-fallback { font-size: 3rem; opacity: 0.4; }
  .ml-play-overlay { position: absolute; inset: 0; background: rgba(79,110,247,0.18); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; }
  .ml-card:hover .ml-play-overlay { opacity: 1; }
  .ml-play-btn { width: 44px; height: 44px; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; box-shadow: 0 4px 20px rgba(0,0,0,0.2); transform: scale(0.8); transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1); }
  .ml-card:hover .ml-play-btn { transform: scale(1); }
  .ml-card-body { padding: 1.1rem 1.2rem 1.2rem; }
  .ml-course-title { font-weight: 800; color: var(--text); font-size: 0.95rem; margin: 0; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ml-card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 0.7rem; }
  .ml-start-hint { font-size: 0.72rem; color: var(--text3); font-weight: 600; display: flex; align-items: center; gap: 4px; }
  .ml-open-chip { font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 99px; background: var(--blue-light); border: 1.5px solid var(--blue-mid); color: var(--blue); transition: background 0.2s, color 0.2s; }
  .ml-card:hover .ml-open-chip { background: var(--blue); color: #fff; border-color: var(--blue); }
  .ml-empty { text-align: center; padding: 4rem 2rem; background: var(--white); border-radius: var(--radius); border: 1.5px dashed var(--border); box-shadow: var(--shadow); animation: ml-up 0.4s both; }
  .ml-empty-icon { font-size: 3rem; opacity: 0.5; margin-bottom: 0.8rem; }
  .ml-empty h3 { font-family: var(--font-serif); font-size: 1.3rem; color: var(--text); margin: 0 0 0.4rem; }
  .ml-empty p { color: var(--text2); margin: 0; font-size: 0.85rem; }
  .ml-skeleton { height: 240px; border-radius: var(--radius); background: linear-gradient(90deg,#e8ecff 0%,#f0f4ff 50%,#e8ecff 100%); background-size: 600px 100%; animation: shimmer 1.6s infinite; border: 1.5px solid var(--border); }
  @keyframes shimmer { 0%{background-position:-600px 0;} 100%{background-position:600px 0;} }
  @keyframes ml-up { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }
  @media (max-width: 768px) { .ml-grid { grid-template-columns: 1fr 1fr; } .ml-hero { padding: 1.4rem 1.4rem; } }
  @media (max-width: 500px) { .ml-grid { grid-template-columns: 1fr; } }
`;

const backendBase = apiUrl.replace(/\/api$/, "");

const buildImg = (raw, title) => {
  const placeholder = `https://placehold.co/600x350?text=${encodeURIComponent(title || "Course")}`;
  if (!raw) return { src: "", placeholder };

  const isHttp = typeof raw === "string" && /^https?:\/\//i.test(raw);
  const localSmall = `${backendBase}/uploads/course/small/${raw}`;
  return { src: isHttp ? raw : localSmall, placeholder };
};

const getTitle = (e) => e?.course?.title ?? e?.title ?? "Course";
const getCourseId = (e) => e?.course_id ?? e?.course?.id ?? e?.id;

// ✅ updated: checks new DB columns first
const getRawImage = (e) =>
  e?.course?.image_small_url ??
  e?.course?.image_url ??
  e?.course?.course_small_image ??
  e?.course?.image ??
  e?.image_small_url ??
  e?.image_url ??
  e?.course_small_image ??
  e?.image ??
  "";

const MyLearning = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiUrl}/enrollments`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        setEnrollments(result?.status === 200 ? result.data || [] : []);
      } catch (e) {
        console.error(e);
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return enrollments;
    return enrollments.filter((e) => getTitle(e).toLowerCase().includes(q));
  }, [enrollments, search]);

  return (
    <Layout>
      <style>{css}</style>

      <div className="ml-blob-wrap">
        <div className="ml-blob ml-blob-1" />
        <div className="ml-blob ml-blob-2" />
        <div className="ml-blob ml-blob-3" />
      </div>

      <div className="ml-root">
        <div className="container ml-inner">
          <nav className="ml-bc">
            <Link to="/account/dashboard">Account</Link>
            <span>›</span>
            <span>My Learning</span>
          </nav>

          <div className="row">
            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>

            <div className="col-lg-9 mt-4 mt-lg-0">
              <div className="ml-hero mb-4">
                <div className="ml-hero-deco d1" />
                <div className="ml-hero-deco d2" />
                <div className="ml-hero-left">
                  <div className="ml-hero-title">📚 My Learning</div>
                  <div className="ml-hero-sub">All your enrolled courses in one place. Click any to continue learning.</div>
                </div>
                <div className="ml-count-chip">
                  {enrollments.length}
                  <span>course{enrollments.length !== 1 ? "s" : ""} enrolled</span>
                </div>
              </div>

              <div className="ml-search-wrap">
                <svg className="ml-search-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="11" cy="11" r="8" strokeWidth="2" />
                  <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  className="ml-search"
                  placeholder="Search your courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {loading ? (
                <div className="ml-grid">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="ml-skeleton" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="ml-empty">
                  <div className="ml-empty-icon">📚</div>
                  <h3>No courses found</h3>
                  <p>{search ? "Try a different keyword." : "You have not enrolled in any courses yet."}</p>
                </div>
              ) : (
                <div className="ml-grid">
                  {filtered.map((e, idx) => {
                    const title = getTitle(e);
                    const raw = getRawImage(e);
                    const { src, placeholder } = buildImg(raw, title);
                    const courseId = getCourseId(e);
                    const to = `/account/watch-course/${courseId}`;

                    return (
                      <Link
                        key={e?.id ?? `${courseId}-${title}`}
                        to={to}
                        className="ml-card"
                        style={{ animationDelay: `${idx * 0.04}s` }}
                      >
                        <div className="ml-cover">
                          <img
                            src={src || placeholder}
                            alt={title}
                            onError={(ev) => {
                              ev.currentTarget.src = placeholder;
                            }}
                          />
                          <div className="ml-play-overlay">
                            <div className="ml-play-btn">▶</div>
                          </div>
                        </div>

                        <div className="ml-card-body">
                          <h3 className="ml-course-title" title={title}>
                            {title}
                          </h3>
                          <div className="ml-card-footer">
                            <span className="ml-start-hint">Continue learning</span>
                            <span className="ml-open-chip">Open →</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyLearning;