import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { apiUrl } from "./Config";
import { AuthContext } from "../context/Auth";

const css = `
  :root{
    --lb-bg:#f0f4ff; --lb-white:#fff; --lb-blue:#4f6ef7; --lb-purple:#7c5cbf;
    --lb-text:#14142b; --lb-text2:#6e7191; --lb-text3:#a0abc0; --lb-border:#e4e7f4;
    --lb-radius:22px; --lb-shadow:0 4px 24px rgba(79,110,247,0.08);
  }

  .hlb-wrap{ position:relative; }
  .hlb-card{
    background:var(--lb-white);
    border:1.5px solid var(--lb-border);
    border-radius:var(--lb-radius);
    box-shadow:var(--lb-shadow);
    overflow:hidden;
  }

  .hlb-head{
    padding:18px 18px 14px;
    background:linear-gradient(135deg,var(--lb-blue) 0%,var(--lb-purple) 100%);
    color:#fff;
    position:relative;
    overflow:hidden;
  }
  .hlb-head:before{
    content:'';
    position:absolute; inset:-60% -20% auto auto;
    width:300px; height:300px; border-radius:50%;
    background:rgba(255,255,255,0.10);
    filter: blur(10px);
  }

  .hlb-title{ font-weight:900; font-size:1rem; margin:0; letter-spacing:-0.02em; }
  .hlb-sub{ font-size:0.78rem; margin-top:4px; color:rgba(255,255,255,0.7); }

  .hlb-body{ padding:16px 18px; }
  .hlb-row{
    display:flex; align-items:center; justify-content:space-between;
    padding:10px 0; border-bottom:1px solid var(--lb-border);
    gap:10px;
  }
  .hlb-row:last-child{ border-bottom:none; }

  .hlb-left{ display:flex; align-items:center; gap:10px; min-width:0; }
  .hlb-rank{
    width:34px; height:34px; border-radius:12px;
    display:flex; align-items:center; justify-content:center;
    font-weight:900; font-size:0.85rem;
    background:#f2f5ff; color:var(--lb-blue);
    flex-shrink:0;
  }
  .hlb-rank.top1{ background:#fff8e6; color:#b45309; }
  .hlb-rank.top2{ background:#f4f4f5; color:#52525b; }
  .hlb-rank.top3{ background:#fff2ee; color:#c2410c; }

  .hlb-name{
    font-weight:800; font-size:0.86rem; color:var(--lb-text);
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  }
  .hlb-you{
    margin-left:6px;
    font-size:0.62rem; font-weight:900;
    padding:3px 8px; border-radius:999px;
    background:#e6faf3; border:1px solid #a7f3d0; color:#065f46;
    text-transform:uppercase; letter-spacing:0.06em;
  }

  .hlb-score{
    font-weight:900; font-size:0.95rem;
    color:var(--lb-text);
    background:var(--lb-bg);
    border:1px solid var(--lb-border);
    padding:6px 10px; border-radius:12px;
    flex-shrink:0;
  }

  .hlb-foot{
    display:flex; align-items:center; justify-content:space-between;
    gap:10px; padding:14px 18px;
    border-top:1px solid var(--lb-border);
    background:#fbfcff;
  }

  .hlb-tip{ font-size:0.78rem; color:var(--lb-text2); }
  .hlb-btn{
    font-size:0.78rem; font-weight:900;
    color:#fff; background:var(--lb-blue);
    text-decoration:none;
    padding:10px 14px; border-radius:14px;
    transition:opacity .2s, transform .2s;
    white-space:nowrap;
  }
  .hlb-btn:hover{ opacity:.9; transform:translateY(-1px); }

  .hlb-mini{
    display:flex; gap:8px; margin-top:10px; flex-wrap:wrap;
  }
  .hlb-pill{
    font-size:0.68rem; font-weight:800;
    padding:6px 10px; border-radius:999px;
    border:1px solid var(--lb-border);
    background:#fff; color:var(--lb-text2);
  }

  .hlb-loading{ padding:16px 18px; color:var(--lb-text2); font-size:0.85rem; }
`;

const medal = (rank) => (rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`);

const HomeLeaderboard = ({ limit = 5 }) => {
  const { user } = useContext(AuthContext);
  const authToken = useMemo(() => user?.token || user?.user?.token, [user]);
  const myUserId = user?.user?.id || user?.id;

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/innovation/leaderboard`, {
        headers: { Accept: "application/json", Authorization: `Bearer ${authToken}` },
      });
      const result = await res.json();
      if (result.status === 200) setRows(result.data || []);
      else {
        toast.error(result.message || "Failed to load leaderboard");
        setRows([]);
      }
    } catch (e) {
      console.log(e);
      toast.error("Server error loading leaderboard");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) fetchLeaderboard();
  }, [authToken]);

  const top = useMemo(() => (rows || []).slice(0, limit), [rows, limit]);

  const myRow = useMemo(() => {
    if (!myUserId) return null;
    return (rows || []).find((r) => Number(r.user_id) === Number(myUserId)) || null;
  }, [rows, myUserId]);

  const myRank = useMemo(() => {
    if (!myRow) return null;
    const idx = (rows || []).findIndex((r) => Number(r.user_id) === Number(myUserId));
    return idx >= 0 ? idx + 1 : null;
  }, [rows, myRow, myUserId]);

  return (
    <div className="hlb-wrap">
      <style>{css}</style>

      <div className="hlb-card">
        <div className="hlb-head">
          <h3 className="hlb-title">🏆 Leaderboard Preview</h3>
          <div className="hlb-sub">Compete by posting updates, getting ideas selected & completing showcases.</div>

          {/* little hype pills */}
          <div className="hlb-mini">
            <span className="hlb-pill">Updates ×5</span>
            <span className="hlb-pill">Selected ×25</span>
            <span className="hlb-pill">Completed ×50</span>
            <span className="hlb-pill">Courses ×10</span>
          </div>
        </div>

        {loading ? (
          <div className="hlb-loading">Loading leaderboard…</div>
        ) : top.length === 0 ? (
          <div className="hlb-loading">No leaderboard data yet.</div>
        ) : (
          <div className="hlb-body">
            {top.map((r, idx) => {
              const rank = idx + 1;
              const isMe = Number(r.user_id) === Number(myUserId);
              return (
                <div className="hlb-row" key={r.user_id}>
                  <div className="hlb-left">
                    <div className={`hlb-rank ${rank <= 3 ? `top${rank}` : ""}`}>
                      {rank <= 3 ? medal(rank) : `#${rank}`}
                    </div>
                    <div className="hlb-name">
                      {r.name}
                      {isMe && <span className="hlb-you">You</span>}
                    </div>
                  </div>
                  <div className="hlb-score">{r.score}</div>
                </div>
              );
            })}

            {/* If you are not in top list, show your rank */}
            {myRow && !top.some((x) => Number(x.user_id) === Number(myUserId)) && (
              <div className="hlb-row" style={{ marginTop: 6 }}>
                <div className="hlb-left">
                  <div className="hlb-rank">#{myRank}</div>
                  <div className="hlb-name">
                    {myRow.name}
                    <span className="hlb-you">You</span>
                  </div>
                </div>
                <div className="hlb-score">{myRow.score}</div>
              </div>
            )}
          </div>
        )}

        <div className="hlb-foot">
          <div className="hlb-tip">🔥 Tip: Post build updates daily to climb faster.</div>
          <Link to="/account/innovation/leaderboard" className="hlb-btn">
            View Full →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeLeaderboard;