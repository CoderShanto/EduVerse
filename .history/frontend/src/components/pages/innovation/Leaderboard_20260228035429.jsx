import React, { useContext, useEffect, useMemo, useState } from 'react'
import Layout from '../../common/Layout'
import toast from 'react-hot-toast'
import { apiUrl } from '../../common/Config'
import { AuthContext } from '../../context/Auth'
import { Link } from 'react-router-dom'

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
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      })
      const result = await res.json()

      if (result.status === 200) {
        setRows(result.data || [])
      } else {
        toast.error(result.message || 'Failed to load leaderboard')
        setRows([])
      }
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
      .filter(r => (activeOnly ? Number(r.score || 0) > 0 : true))
      .filter(r => (qq ? String(r.name || '').toLowerCase().includes(qq) : true))
  }, [rows, q, activeOnly])

  const top3 = filtered.slice(0, 3)
  const rest = filtered.slice(3)

  const badgeForRank = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  const ScoreChip = ({ label, value, color = 'bg-light text-dark' }) => (
    <span className={`badge ${color}`} style={{ borderRadius: 999, padding: '7px 10px', fontWeight: 700 }}>
      {label}: {value}
    </span>
  )

  const PodiumCard = ({ rank, item }) => {
    if (!item) return null

    const isMe = Number(item.user_id) === Number(myUserId)

    const ringStyle = isMe
      ? { outline: '3px solid rgba(25,135,84,0.25)' }
      : {}

    return (
      <div className="col-md-4">
        <div
          className="card h-100 border-0 shadow-sm"
          style={{
            borderRadius: 18,
            background: rank === 1
              ? 'linear-gradient(135deg, rgba(255,215,0,0.18), rgba(255,255,255,1))'
              : rank === 2
              ? 'linear-gradient(135deg, rgba(192,192,192,0.18), rgba(255,255,255,1))'
              : 'linear-gradient(135deg, rgba(205,127,50,0.15), rgba(255,255,255,1))',
            ...ringStyle,
          }}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div style={{ fontSize: 28, fontWeight: 900 }}>{badgeForRank(rank)}</div>
                <div className="fw-bold" style={{ fontSize: 18 }}>
                  {item.name} {isMe && <span className="badge bg-success ms-2">You</span>}
                </div>
                <div className="text-muted" style={{ fontSize: 12 }}>User ID: {item.user_id}</div>
              </div>

              <div className="text-end">
                <div className="badge bg-dark" style={{ fontSize: 16, padding: '10px 12px', borderRadius: 14 }}>
                  {item.score}
                </div>
                <div className="text-muted" style={{ fontSize: 12, marginTop: 6 }}>Total Score</div>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2 mt-3">
              <ScoreChip label="Updates" value={`${item.updates}×5`} />
              <ScoreChip label="Selected" value={`${item.selected_ideas}×25`} color="bg-warning text-dark" />
              <ScoreChip label="Completed" value={`${item.completed_ideas}×50`} color="bg-success" />
              <ScoreChip label="Bonus" value={item.quality_bonus} color="bg-info text-dark" />
              <ScoreChip label="Courses" value={`${item.completed_courses || 0}×10`} color="bg-primary" />
            </div>

            <div className="mt-3" style={{ fontSize: 13, color: '#6c757d' }}>
              Keep posting updates & finish projects to climb ranks 🚀
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <div className="container my-4">

        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div>
            <h3 className="mb-0">Innovation • Leaderboard</h3>
            <small className="text-muted">
              Ranked by progress: updates, selected ideas, completed showcases, quality bonus, completed courses.
            </small>
          </div>
          <Link to="/account/innovation" className="btn btn-outline-secondary btn-sm">
            Back to Hub
          </Link>
        </div>

        {/* Controls */}
        <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 16 }}>
          <div className="card-body">
            <div className="row g-2 align-items-center">
              <div className="col-md-8">
                <input
                  className="form-control"
                  placeholder="Search by student name..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>

              <div className="col-md-4 d-flex justify-content-md-end gap-2">
                <button
                  className={`btn ${activeOnly ? 'btn-dark' : 'btn-outline-dark'}`}
                  onClick={() => setActiveOnly(v => !v)}
                >
                  {activeOnly ? 'Showing Active Only' : 'Show Active Only'}
                </button>

                <button className="btn btn-outline-primary" onClick={fetchLeaderboard}>
                  Refresh
                </button>
              </div>
            </div>

            <div className="mt-2 text-muted" style={{ fontSize: 13 }}>
              <strong>Scoring:</strong> Updates×5 + Selected×25 + Completed×50 + QualityBonus (score ≥ 8 → +5) + CompletedCourses×10
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5 text-muted">No leaderboard data yet.</div>
        ) : (
          <>
            {/* Podium */}
            <div className="row g-3 mb-3">
              <PodiumCard rank={1} item={top3[0]} />
              <PodiumCard rank={2} item={top3[1]} />
              <PodiumCard rank={3} item={top3[2]} />
            </div>

            {/* Table */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th style={{ width: 90 }}>Rank</th>
                        <th>Name</th>
                        <th style={{ width: 110 }}>Score</th>
                        <th style={{ width: 120 }}>Updates</th>
                        <th style={{ width: 140 }}>Selected</th>
                        <th style={{ width: 150 }}>Completed</th>
                        <th style={{ width: 140 }}>Bonus</th>
                        <th style={{ width: 160 }}>Courses</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((r, idx) => {
                        const rank = idx + 1
                        const isMe = Number(r.user_id) === Number(myUserId)
                        return (
                          <tr
                            key={r.user_id}
                            style={{
                              background: isMe ? 'rgba(25,135,84,0.07)' : undefined,
                              borderRadius: 12,
                            }}
                          >
                            <td className="fw-bold">{badgeForRank(rank)}</td>
                            <td>
                              <div className="fw-semibold">
                                {r.name} {isMe && <span className="badge bg-success ms-2">You</span>}
                              </div>
                              <div className="text-muted" style={{ fontSize: 12 }}>User ID: {r.user_id}</div>
                            </td>
                            <td><span className="badge bg-dark" style={{ fontSize: 13 }}>{r.score}</span></td>
                            <td><span className="badge bg-light text-dark" style={{ border: '1px solid #eee' }}>{r.updates}×5</span></td>
                            <td><span className="badge bg-warning text-dark">{r.selected_ideas}×25</span></td>
                            <td><span className="badge bg-success">{r.completed_ideas}×50</span></td>
                            <td><span className="badge bg-info text-dark">{r.quality_bonus}</span></td>
                            <td><span className="badge bg-primary">{(r.completed_courses || 0)}×10</span></td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-2 text-muted" style={{ fontSize: 13 }}>
                  Tip: Add build updates regularly + complete showcases to boost rank faster 🚀
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

export default Leaderboard