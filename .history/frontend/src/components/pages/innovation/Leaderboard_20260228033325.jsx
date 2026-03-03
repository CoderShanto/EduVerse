import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import toast from 'react-hot-toast'
import { apiUrl } from '../../common/Config'
import { AuthContext } from '../../context/Auth'
import { Link } from 'react-router-dom'

const Leaderboard = () => {
  const { user } = useContext(AuthContext)
  const authToken = user?.token || user?.user?.token

  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState([])

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
  }, [authToken])

  const badgeForRank = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  return (
    <Layout>
      <div className="container my-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 className="mb-0">Innovation • Leaderboard</h3>
            <small className="text-muted">Ranked by meaningful progress (updates, selected ideas, completed showcases).</small>
          </div>
          <Link to="/account/innovation" className="btn btn-outline-secondary btn-sm">
            Back to Hub
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="text-center py-5 text-muted">No leaderboard data yet.</div>
        ) : (
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th style={{ width: 90 }}>Rank</th>
                      <th>Name</th>
                      <th style={{ width: 120 }}>Score</th>
                      <th style={{ width: 130 }}>Updates</th>
                      <th style={{ width: 160 }}>Selected Ideas</th>
                      <th style={{ width: 170 }}>Completed Ideas</th>
                      <th style={{ width: 150 }}>Quality Bonus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, idx) => (
                      <tr key={r.user_id}>
                        <td className="fw-bold">{badgeForRank(idx + 1)}</td>
                        <td>
                          <div className="fw-semibold">{r.name}</div>
                          <div className="text-muted" style={{ fontSize: 12 }}>User ID: {r.user_id}</div>
                        </td>
                        <td>
                          <span className="badge bg-dark" style={{ fontSize: 13 }}>
                            {r.score}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark" style={{ border: '1px solid #eee' }}>
                            {r.updates} × 5
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-warning text-dark">
                            {r.selected_ideas} × 25
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-success">
                            {r.completed_ideas} × 50
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-info text-dark">
                            {r.quality_bonus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 text-muted" style={{ fontSize: 13 }}>
                <strong>Scoring:</strong> Updates×5 + Selected×25 + Completed×50 + QualityBonus (score ≥ 8 → +5 per completed idea).
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Leaderboard