import React, { useContext, useEffect, useMemo, useState } from 'react'
import Layout from '../../common/Layout'
import toast from 'react-hot-toast'
import { apiUrl } from '../../common/Config'
import { AuthContext } from '../../context/Auth'
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
    --orange: #ff7140;
    --orange-light: #fff2ee;
    --green: #22c98e;
    --green-light: #e6faf3;
    --yellow: #ffb020;
    --yellow-light: #fff8e6;
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

  .lb-root {
    background: var(--bg);
    min-height: 100vh;
    font-family: var(--font);
    padding-bottom: 4rem;
    color: var(--text);
    position: relative;
  }

  /* Blobs */
  .lb-blob-wrap { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
  .lb-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.28; }
  .lb-blob-1 { width: 520px; height: 520px; background: radial-gradient(circle,#c7d0ff,#a5b4fc); top: -160px; right: -120px; animation: blob-float 10s ease-in-out infinite alternate; }
  .lb-blob-2 { width: 360px; height: 360px; background: radial-gradient(circle,#ffd5c5,#ffb3a0); bottom: 0; left: -80px; animation: blob-float 14s ease-in-out infinite alternate-reverse; }
  .lb-blob-3 { width: 240px; height: 240px; background: radial-gradient(circle,#fde68a,#fbbf24); top: 30%; right: 10%; animation: blob-float 11s ease-in-out infinite alternate; }
  @keyframes blob-float { from{transform:translate(0,0) scale(1);} to{transform:translate(28px,18px) scale(1.1);} }

  .lb-inner { position: relative; z-index: 1; padding: 1.5rem 0 0; }

  /* Page header */
  .lb-page-header {
    background: linear-gradient(135deg,#4f6ef7 0%,#7c5cbf 55%,#a855f7 100%);
    border-radius: 28px;
    padding: 2rem 2.4rem;
    margin-bottom: 1.8rem;
    position: relative; overflow: hidden;
    box-shadow: 0 20px 60px rgba(79,110,247,0.35);
    animation: lb-up 0.6s cubic-bezier(0.22,1,0.36,1) both;
    display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
  }
  .lb-page-header::before {
    content: '';
    position: absolute; top: -60%; left: -20%;
    width: 60%; height: 200%;
    background: linear-gradient(105deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.1) 50%,rgba(255,255,255,0) 100%);
    transform: rotate(25deg); pointer-events: none;
  }
  .lb-hdr-deco {
    position: absolute; border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.12); pointer-events: none;
  }
  .lb-hdr-deco.d1 { width: 200px; height: 200px; right: -60px; bottom: -60px; }
  .lb-hdr-deco.d2 { width: 110px; height: 110px; right: 80px; top: -40px; }
  .lb-page-header-left { position: relative; z-index: 1; }
  .lb-page-title { font-size: 1.5rem; font-weight: 800; color: #fff; margin: 0; letter-spacing: -0.02em; }
  .lb-page-sub { font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-top: 0.3rem; }
  .lb-back-btn {
    position: relative; z-index: 1;
    font-size: 0.78rem; font-weight: 700; color: #fff;
    border: 1.5px solid rgba(255,255,255,0.35);
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(8px);
    border-radius: 12px; padding: 8px 18px;
    text-decoration: none;
    transition: background 0.2s;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .lb-back-btn:hover { background: rgba(255,255,255,0.22); color: #fff; }

  /* Controls */
  .lb-controls {
    background: var(--white); border-radius: var(--radius);
    padding: 1.3rem 1.5rem; border: 1.5px solid var(--border);
    box-shadow: var(--shadow); margin-bottom: 1.6rem;
    animation: lb-up 0.5s 0.1s both;
    display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
  }
  .lb-search {
    flex: 1; min-width: 200px;
    background: var(--bg); border: 1.5px solid var(--border);
    border-radius: 12px; padding: 9px 14px;
    font-family: var(--font); font-size: 0.85rem; color: var(--text);
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .lb-search:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(79,110,247,0.12); }
  .lb-search::placeholder { color: var(--text3); }
  .lb-ctrl-btns { display: flex; gap: 0.6rem; flex-wrap: wrap; }
  .lb-btn {
    font-size: 0.78rem; font-weight: 700; border-radius: 12px; padding: 8px 16px;
    cursor: pointer; border: 1.5px solid var(--border);
    background: var(--white); color: var(--text2);
    font-family: var(--font); transition: all 0.2s;
    display: inline-flex; align-items: center; gap: 5px;
  }
  .lb-btn:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-light); }
  .lb-btn.active { background: var(--text); color: #fff; border-color: var(--text); }
  .lb-btn.refresh { color: var(--blue); border-color: var(--blue-mid); background: var(--blue-light); }
  .lb-btn.refresh:hover { background: var(--blue); color: #fff; border-color: var(--blue); }
  .lb-scoring-note {
    width: 100%; font-size: 0.72rem; color: var(--text3); padding-top: 0.3rem;
    border-top: 1px solid var(--border); margin-top: 0.3rem;
  }
  .lb-scoring-note b { color: var(--text2); }

  /* Podium */
  .lb-podium { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.2rem; margin-bottom: 1.6rem; }

  .lb-podium-card {
    background: var(--white); border-radius: var(--radius);
    border: 1.5px solid var(--border); box-shadow: var(--shadow);
    padding: 1.5rem; position: relative; overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
    animation: lb-up 0.5s both;
  }
  .lb-podium-card:nth-child(1){animation-delay:0.12s;}
  .lb-podium-card:nth-child(2){animation-delay:0.2s;}
  .lb-podium-card:nth-child(3){animation-delay:0.28s;}
  .lb-podium-card:hover { transform: translateY(-7px) scale(1.02); box-shadow: var(--shadow-hover); }

  .lb-podium-card.rank-1 { background: linear-gradient(145deg,#fff8e6,#fffdf5); border-color: #fde68a; }
  .lb-podium-card.rank-2 { background: linear-gradient(145deg,#f4f4f5,#fff); border-color: #d4d4d8; }
  .lb-podium-card.rank-3 { background: linear-gradient(145deg,#fff2ee,#fff); border-color: #fcd9c5; }
  .lb-podium-card.is-me { box-shadow: 0 0 0 3px rgba(34,201,142,0.25), var(--shadow); }

  .lb-podium-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 4px; border-radius: 99px 99px 0 0;
  }
  .rank-1::before { background: linear-gradient(90deg,#f59e0b,#fbbf24); }
  .rank-2::before { background: linear-gradient(90deg,#9ca3af,#d1d5db); }
  .rank-3::before { background: linear-gradient(90deg,#f97316,#fb923c); }

  .lb-podium-medal { font-size: 2.2rem; line-height: 1; margin-bottom: 0.5rem; }
  .lb-podium-name { font-size: 1.05rem; font-weight: 800; color: var(--text); }
  .lb-you-chip {
    font-size: 0.62rem; font-weight: 800; padding: 3px 8px; border-radius: 99px;
    background: var(--green-light); color: #065f46; border: 1px solid #a7f3d0;
    text-transform: uppercase; letter-spacing: 0.06em; vertical-align: middle;
    margin-left: 6px;
  }
  .lb-podium-score {
    font-family: var(--font-serif); font-size: 2.8rem; font-weight: 700;
    color: var(--text); line-height: 1; margin: 0.6rem 0 0.2rem;
  }
  .rank-1 .lb-podium-score { color: #d97706; }
  .rank-2 .lb-podium-score { color: #71717a; }
  .rank-3 .lb-podium-score { color: var(--orange); }
  .lb-podium-score-label { font-size: 0.7rem; color: var(--text3); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }
  .lb-chips { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 0.9rem; }
  .lb-chip {
    font-size: 0.65rem; font-weight: 700; padding: 4px 9px; border-radius: 99px;
    border: 1.5px solid var(--border); background: var(--white); color: var(--text2);
    white-space: nowrap;
  }
  .lb-chip.yellow { background: var(--yellow-light); border-color: #fde68a; color: #92400e; }
  .lb-chip.green  { background: var(--green-light);  border-color: #a7f3d0; color: #065f46; }
  .lb-chip.blue   { background: var(--blue-light);   border-color: var(--blue-mid); color: var(--blue); }
  .lb-chip.purple { background: var(--purple-light); border-color: #ddd6fe; color: var(--purple); }

  /* Table card */
  .lb-table-card {
    background: var(--white); border-radius: var(--radius);
    border: 1.5px solid var(--border); box-shadow: var(--shadow);
    overflow: hidden; animation: lb-up 0.5s 0.3s both;
  }
  .lb-table-header {
    padding: 1.2rem 1.6rem; border-bottom: 1.5px solid var(--border);
    display: flex; align-items: center; gap: 0.5rem;
  }
  .lb-table-title {
    font-size: 0.72rem; font-weight: 800; color: var(--text2);
    text-transform: uppercase; letter-spacing: 0.12em; margin: 0;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .lb-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  table.lb-table { width: 100%; border-collapse: collapse; }
  table.lb-table thead tr {
    border-bottom: 1.5px solid var(--border);
  }
  table.lb-table thead th {
    padding: 0.75rem 1rem;
    font-size: 0.68rem; font-weight: 800; color: var(--text3);
    text-transform: uppercase; letter-spacing: 0.1em;
    white-space: nowrap; background: var(--bg);
  }
  table.lb-table tbody tr {
    border-bottom: 1px solid var(--border);
    transition: background 0.15s;
  }
  table.lb-table tbody tr:last-child { border-bottom: none; }
  table.lb-table tbody tr:hover { background: var(--bg); }
  table.lb-table tbody tr.is-me { background: rgba(34,201,142,0.06); }
  table.lb-table tbody td { padding: 0.85rem 1rem; vertical-align: middle; }

  .lb-rank-cell { font-family: var(--font-serif); font-size: 1.3rem; font-weight: 700; color: var(--text3); }
  .lb-rank-cell.top { color: var(--text); }
  .lb-name-main { font-size: 0.87rem; font-weight: 700; color: var(--text); }
  .lb-score-big {
    font-family: var(--font-serif); font-size: 1.3rem; font-weight: 700; color: var(--text);
    background: var(--bg); border: 1.5px solid var(--border); border-radius: 10px;
    padding: 4px 12px; display: inline-block;
  }
  .lb-tip { font-size: 0.72rem; color: var(--text3); padding: 1rem 1.6rem; border-top: 1.5px solid var(--border); }

  /* Empty / Loading */
  .lb-empty { text-align: center; padding: 4rem 1rem; color: var(--text2); font-size: 0.9rem; }
  .lb-skeleton { border-radius: var(--radius); height: 130px; background: linear-gradient(90deg,#e8ecff 0%,#f0f4ff 50%,#e8ecff 100%); background-size:700px 100%; animation: shimmer 1.6s infinite; border: 1.5px solid var(--border); }
  @keyframes shimmer { 0%{background-position:-700px 0;} 100%{background-position:700px 0;} }
  @keyframes lb-up { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }

  @media (max-width: 900px) { .lb-podium { grid-template-columns: 1fr; } }
  @media (max-width: 600px) { .lb-page-header { flex-direction: column; } }
`

const Leaderboard = () => {
  const { user } = useContext(AuthContext)
  const authToken = user?.token || user?.user?.token
  const myUserId = user?.user?.id || user?.id

  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState([])
  const [q, setQ] = useState('')
  const [activeOnly, setActiveOnly] = useState(false)

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${apiUrl}/innovation/leaderboard`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${authToken}` },
      })
      const result = await res.json()
      if (result.status === 200) setRows(result.data || [])
      else { toast.error(result.message || 'Failed to load leaderboard'); setRows([]) }
    } catch (e) {
      console.log(e)
      toast.error('Server error loading leaderboard')
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authToken) fetchLeaderboard()
    // eslint-disable-next-line
  }, [authToken])

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase()
    return (rows || [])
      .filter(r => activeOnly ? Number(r.score || 0) > 0 : true)
      .filter(r => qq ? String(r.name || '').toLowerCase().includes(qq) : true)
  }, [rows, q, activeOnly])

  const top3 = filtered.slice(0, 3)
  const rest = filtered.slice(3)

  const medal = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return null
  }

  const PodiumCard = ({ rank, item }) => {
    if (!item) return null
    const isMe = Number(item.user_id) === Number(myUserId)
    return (
      <div className={`lb-podium-card rank-${rank}${isMe ? ' is-me' : ''}`}>
        <div className='lb-podium-medal'>{medal(rank)}</div>
        <div className='lb-podium-name'>
          {item.name}
          {isMe && <span className='lb-you-chip'>You</span>}
        </div>
        <div className='lb-podium-score'>{item.score}</div>
        <div className='lb-podium-score-label'>Total Score</div>
        <div className='lb-chips'>
          <span className='lb-chip'>Updates ×{item.updates}</span>
          <span className='lb-chip yellow'>Selected ×{item.selected_ideas}</span>
          <span className='lb-chip green'>Completed ×{item.completed_ideas}</span>
          <span className='lb-chip purple'>Bonus +{item.quality_bonus}</span>
          <span className='lb-chip blue'>Courses ×{item.completed_courses || 0}</span>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <style>{css}</style>
      <div className='lb-blob-wrap'>
        <div className='lb-blob lb-blob-1' /><div className='lb-blob lb-blob-2' /><div className='lb-blob lb-blob-3' />
      </div>

      <div className='lb-root'>
        <div className='container lb-inner'>

          {/* Header */}
          <div className='lb-page-header'>
            <div className='lb-hdr-deco d1' /><div className='lb-hdr-deco d2' />
            <div className='lb-page-header-left'>
              <div className='lb-page-title'>🏆 Innovation Leaderboard</div>
              <div className='lb-page-sub'>Ranked by updates, selected ideas, showcases, quality bonus &amp; completed courses.</div>
            </div>
            <Link to='/account/innovation' className='lb-back-btn'>← Back to Hub</Link>
          </div>

          {/* Controls */}
          <div className='lb-controls'>
            <input
              className='lb-search'
              placeholder='Search by student name...'
              value={q}
              onChange={e => setQ(e.target.value)}
            />
            <div className='lb-ctrl-btns'>
              <button className={`lb-btn${activeOnly ? ' active' : ''}`} onClick={() => setActiveOnly(v => !v)}>
                {activeOnly ? '✓ Active Only' : 'Show Active Only'}
              </button>
              <button className='lb-btn refresh' onClick={fetchLeaderboard}>↻ Refresh</button>
            </div>
            <div className='lb-scoring-note'>
              <b>Scoring:</b> Updates×5 &nbsp;+&nbsp; Selected×25 &nbsp;+&nbsp; Completed×50 &nbsp;+&nbsp; Quality Bonus (score ≥ 8 → +5) &nbsp;+&nbsp; Courses×10
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className='lb-podium'>
              {[1,2,3].map(i => <div key={i} className='lb-skeleton' />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className='lb-empty'>No leaderboard data yet.</div>
          ) : (
            <>
              {/* Podium */}
              <div className='lb-podium'>
                <PodiumCard rank={1} item={top3[0]} />
                <PodiumCard rank={2} item={top3[1]} />
                <PodiumCard rank={3} item={top3[2]} />
              </div>

              {/* Table */}
              <div className='lb-table-card'>
                <div className='lb-table-header'>
                  <p className='lb-table-title'>
                    <span className='lb-dot' style={{ background: 'var(--blue)' }} />
                    Full Rankings
                  </p>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className='lb-table'>
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Student</th>
                        <th>Score</th>
                        <th>Updates</th>
                        <th>Selected</th>
                        <th>Completed</th>
                        <th>Bonus</th>
                        <th>Courses</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((r, idx) => {
                        const rank = idx + 1
                        const isMe = Number(r.user_id) === Number(myUserId)
                        return (
                          <tr key={r.user_id} className={isMe ? 'is-me' : ''}>
                            <td>
                              <span className={`lb-rank-cell${rank <= 3 ? ' top' : ''}`}>
                                {medal(rank) || `#${rank}`}
                              </span>
                            </td>
                            <td>
                              <div className='lb-name-main'>
                                {r.name}
                                {isMe && <span className='lb-you-chip'>You</span>}
                              </div>
                            </td>
                            <td><span className='lb-score-big'>{r.score}</span></td>
                            <td><span className='lb-chip'>{r.updates}×5</span></td>
                            <td><span className='lb-chip yellow'>{r.selected_ideas}×25</span></td>
                            <td><span className='lb-chip green'>{r.completed_ideas}×50</span></td>
                            <td><span className='lb-chip purple'>+{r.quality_bonus}</span></td>
                            <td><span className='lb-chip blue'>{r.completed_courses || 0}×10</span></td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div className='lb-tip'>💡 Add build updates regularly &amp; complete showcases to climb the ranks faster 🚀</div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Leaderboard