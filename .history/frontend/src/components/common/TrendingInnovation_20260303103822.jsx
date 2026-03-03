import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { apiUrl, token as configToken } from "./Config";
import { AuthContext } from "../context/Auth";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,400&display=swap');

  .fti-section {
    padding: 5rem 0 4.5rem;
    background: #ffffff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* Subtle tinted band at top */
  .fti-section::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 6px;
    background: linear-gradient(90deg,#4f6ef7,#7c5cbf,#a855f7,#4f6ef7);
    background-size: 300% 100%;
    animation: fti-stripe 6s linear infinite;
  }
  @keyframes fti-stripe { 0%{background-position:0% 0;} 100%{background-position:300% 0;} }

  /* Background deco */
  .fti-deco-blob {
    position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; opacity: 0.18;
  }
  .fti-deco-blob-1 { width: 500px; height: 500px; background: radial-gradient(circle,#c7d0ff,#a5b4fc); top: -180px; right: -120px; animation: blob-float 12s ease-in-out infinite alternate; }
  .fti-deco-blob-2 { width: 300px; height: 300px; background: radial-gradient(circle,#ffd5c5,#ffb3a0); bottom: -80px; left: -60px; animation: blob-float 10s ease-in-out infinite alternate-reverse; }
  @keyframes blob-float { from{transform:translate(0,0) scale(1);} to{transform:translate(22px,14px) scale(1.08);} }

  /* Header */
  .fti-header {
    display: flex; align-items: flex-end; justify-content: space-between;
    gap: 1.5rem; margin-bottom: 2.8rem; flex-wrap: wrap;
    position: relative; z-index: 1;
  }
  .fti-header-left { flex: 1; min-width: 0; }
  .fti-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 0.68rem; font-weight: 800; letter-spacing: 0.14em;
    text-transform: uppercase; color: #4f6ef7;
    background: #eef0ff; border: 1.5px solid #dde2ff;
    border-radius: 99px; padding: 5px 14px; margin-bottom: 0.8rem;
  }
  .fti-eyebrow::before, .fti-eyebrow::after {
    content: ''; width: 5px; height: 5px; border-radius: 50%; background: #4f6ef7; flex-shrink: 0;
  }
  .fti-title {
    font-family: 'Fraunces', serif;
    font-size: clamp(1.8rem, 4vw, 2.5rem);
    font-weight: 700; color: #14142b; margin: 0 0 0.5rem;
    line-height: 1.15; letter-spacing: -0.02em;
  }
  .fti-title em { font-style: italic; color: #4f6ef7; }
  .fti-subtitle { font-size: 0.9rem; color: #6e7191; margin: 0; line-height: 1.7; max-width: 460px; }
  
  .fti-actions {
    display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0;
  }
  .fti-btn {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 0.82rem; font-weight: 800; color: #4f6ef7;
    text-decoration: none; padding: 10px 22px; border-radius: 13px;
    background: #eef0ff; border: 1.5px solid #dde2ff;
    transition: background 0.2s, color 0.2s, transform 0.2s, box-shadow 0.2s;
    white-space: nowrap; cursor: pointer;
  }
  .fti-btn:hover {
    background: #4f6ef7; color: #fff; border-color: #4f6ef7;
    transform: translateY(-2px); box-shadow: 0 8px 24px rgba(79,110,247,0.3);
  }
  .fti-btn-primary {
    background: linear-gradient(135deg,#4f6ef7,#7c5cbf) !important;
    border: none !important; color: #fff !important;
    box-shadow: 0 4px 14px rgba(79,110,247,0.25) !important;
  }
  .fti-btn-primary:hover {
    opacity: 0.88 !important; transform: translateY(-1px) !important;
  }

  /* Grid */
  .fti-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.4rem;
    position: relative; z-index: 1;
  }

  /* Skeleton */
  .fti-skeleton {
    border-radius: 20px; height: 220px;
    background: linear-gradient(90deg,#eef0ff 0%,#f5f7ff 50%,#eef0ff 100%);
    background-size: 700px 100%; animation: fti-shimmer 1.6s infinite;
    border: 1.5px solid #e4e7f4;
  }
  @keyframes fti-shimmer { 0%{background-position:-700px 0;} 100%{background-position:700px 0;} }

  /* Animate cards in */
  .fti-card-wrap {
    animation: fti-in 0.5s both;
  }
  @keyframes fti-in {
    from { opacity: 0; transform: translateY(22px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Problem Card Styling */
  .fti-card {
    border-radius: 20px !important;
    border: 1.5px solid #e4e7f4 !important;
    box-shadow: 0 4px 20px rgba(79,110,247,0.07) !important;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s, border-color 0.2s !important;
    overflow: hidden !important;
    background: #fff !important;
    padding: 1.1rem 1.2rem 1.2rem !important;
    display: flex; flex-direction: column; height: 100%;
    text-decoration: none; color: inherit;
  }
  .fti-card:hover {
    transform: translateY(-8px) scale(1.015) !important;
    box-shadow: 0 20px 50px rgba(79,110,247,0.16) !important;
    border-color: #c7d0ff !important;
  }

  .fti-card-badges {
    display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap;
  }
  .fti-badge {
    font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 99px;
    background: #f0f4ff; border: 1px solid #e4e7f4; color: #6e7191;
    text-transform: capitalize;
  }
  .fti-badge-status {
    font-size: 0.68rem; padding: 3px 9px; font-weight: 800;
  }
  .fti-badge-status.open { background: #e6f7ee; color: #2e7d32; border-color: #c8e6c9; }
  .fti-badge-status.building { background: #fff3e0; color: #9a5e00; border-color: #ffe0b2; }
  .fti-badge-status.closed { background: #f5f5f5; color: #616161; border-color: #e0e0e0; }

  .fti-card-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.05rem; font-weight: 700; color: #14142b;
    margin: 0 0 0.5rem; line-height: 1.4;
  }
  .fti-card-desc {
    font-size: 0.85rem; color: #6e7191; margin: 0 0 1rem; line-height: 1.6;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .fti-card-footer {
    margin-top: auto; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; flex-wrap: wrap;
  }
  .fti-card-author {
    font-size: 0.75rem; color: #6e7191; font-weight: 500;
  }
  .fti-card-action {
    font-size: 0.75rem; font-weight: 700; color: #4f6ef7;
    padding: 6px 14px; border-radius: 10px;
    background: #eef0ff; border: 1.5px solid #dde2ff;
    transition: all 0.2s; text-decoration: none;
  }
  .fti-card-action:hover {
    background: #4f6ef7; color: #fff; border-color: #4f6ef7;
    transform: translateY(-1px);
  }

  /* Empty state */
  .fti-empty {
    text-align: center; padding: 3rem 1rem; color: #6e7191;
  }
  .fti-empty-icon { font-size: 3rem; opacity: 0.4; margin-bottom: 1rem; display: block; }

  /* Count strip */
  .fti-count-strip {
    display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;
    position: relative; z-index: 1;
  }
  .fti-count-chip {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.72rem; font-weight: 700; padding: 4px 12px; border-radius: 99px;
    background: #f0f4ff; border: 1.5px solid #e4e7f4; color: #6e7191;
  }
  .fti-count-chip b { color: #4f6ef7; font-family: 'Fraunces', serif; font-size: 0.9rem; }

  @media (max-width: 576px) {
    .fti-grid { grid-template-columns: 1fr 1fr; gap: 0.9rem; }
    .fti-header { flex-direction: column; align-items: flex-start; }
    .fti-section { padding: 3.5rem 0 3rem; }
    .fti-card-title { font-size: 1rem; }
  }
  @media (max-width: 400px) {
    .fti-grid { grid-template-columns: 1fr; }
    .fti-actions { width: 100%; justify-content: flex-start; }
  }
`;

const TrendingInnovation = ({
  title = "🔥 Trending Now",
  subtitle = "Top problems students are working on right now",
  limit = 6,
  category = "all",
}) => {
  const { user } = useContext(AuthContext);
  const authToken = useMemo(
    () => user?.token || user?.user?.token || configToken,
    [user]
  );

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const fetchTrending = async () => {
    try {
      setLoading(true);
      const qs = new URLSearchParams();
      qs.set("page", "1");
      qs.set("per_page", String(limit));
      if (category && category !== "all") qs.set("category", category);
      qs.set("sort", "trending");

      const res = await fetch(`${apiUrl}/problems?${qs.toString()}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const result = await res.json();
      if (result.status === 200) {
        const arr = result.data?.data || result.data || [];
        setItems(arr.slice(0, limit));
      } else {
        toast.error(result.message || "Failed to load trending problems");
      }
    } catch (e) {
      console.error(e);
      toast.error("Server error loading trending problems");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) fetchTrending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, limit, category]);

  return (
    <>
      <style>{css}</style>
      <section className='fti-section'>
        <div className='fti-deco-blob fti-deco-blob-1' />
        <div className='fti-deco-blob fti-deco-blob-2' />

        <div className='container'>
          {/* Header */}
          <div className='fti-header'>
            <div className='fti-header-left'>
              <div className='fti-eyebrow'>Innovation Hub</div>
              <h2 className='fti-title'>Top <em>Problems</em> to Solve</h2>
              <p className='fti-subtitle'>{subtitle}</p>
            </div>
            <div className='fti-actions'>
              <button className='fti-btn' onClick={fetchTrending} disabled={loading}>
                {loading ? "Refreshing..." : "↻ Refresh"}
              </button>
              <Link className='fti-btn fti-btn-primary' to="/account/innovation/problems">
                View All <span>→</span>
              </Link>
            </div>
          </div>

          {/* Count */}
          {!loading && items.length > 0 && (
            <div className='fti-count-strip'>
              <span className='fti-count-chip'><b>{items.length}</b> trending problems</span>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className='fti-grid'>
              {[1,2,3,4,5,6].slice(0, limit).map(i => (
                <div key={i} className='fti-skeleton' />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className='fti-empty'>
              <span className='fti-empty-icon'>💡</span>
              <p className='mb-0'>No trending problems yet.<br/>Be the first to post one!</p>
            </div>
          ) : (
            <div className='fti-grid'>
              {items.map((p, idx) => (
                <div
                  key={p.id || p._id || idx}
                  className='fti-card-wrap'
                  style={{ animationDelay: `${idx * 0.06}s` }}
                >
                  <Link to={`/account/innovation/problem/${p.id}`} className='fti-card'>
                    <div className='fti-card-badges'>
                      <span className='fti-badge'>{p.category || "General"}</span>
                      <span className={`fti-badge fti-badge-status ${p.status || 'open'}`}>
                        {p.status || "open"}
                      </span>
                    </div>
                    
                    <h3 className='fti-card-title'>{p.title}</h3>
                    
                    <p className='fti-card-desc'>
                      {String(p.description || "").slice(0, 110)}
                      {String(p.description || "").length > 110 ? "…" : ""}
                    </p>
                    
                    <div className='fti-card-footer'>
                      <span className='fti-card-author'>
                        by {p.user?.name || "Unknown"}
                      </span>
                      <span className='fti-card-action'>View Details →</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default TrendingInnovation;