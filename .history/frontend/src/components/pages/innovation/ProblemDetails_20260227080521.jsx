import React, { useContext, useEffect, useMemo, useState } from 'react'
import Layout from '../../common/Layout'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { apiUrl, token as configToken } from '../../common/Config'
import { AuthContext } from '../../context/Auth'

const ProblemDetails = () => {
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const [joining, setJoining] = useState(false)

  const role = user?.user?.role ? String(user.user.role).toLowerCase().trim() : ''
  const isMentorRole = ['admin', 'instructor', 'mentor'].includes(role)

  // token fallback (your app sometimes uses config token)
  const authToken = user?.token || user?.user?.token || configToken

  const [loading, setLoading] = useState(true)
  const [problem, setProblem] = useState(null)
  const [ideas, setIdeas] = useState([])
  const [myVotes, setMyVotes] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)

  const [ideaForm, setIdeaForm] = useState({ title: '', description: '' })
  const [submittingIdea, setSubmittingIdea] = useState(false)

  const votedSet = useMemo(() => new Set(myVotes || []), [myVotes])

  const joinTeam = async (ideaId) => {
  try {
    setJoining(true)
    const res = await fetch(`${apiUrl}/ideas/${ideaId}/join`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    })
    const result = await res.json()

    if (result.status === 200) {
      toast.success(result.message || 'Joined team!')
      setRefreshKey(k => k + 1) // reload details
    } else {
      toast.error(result.message || 'Join failed')
    }
  } catch (e) {
    console.log(e)
    toast.error('Server error joining team')
  } finally {
    setJoining(false)
  }
}

  const fetchDetails = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${apiUrl}/problems/${id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      })
      const result = await res.json()

      if (result.status === 200) {
        setProblem(result.data.problem)
        setIdeas(result.data.problem?.ideas || [])
        setMyVotes(result.data.my_voted_idea_ids || [])
      } else {
        toast.error(result.message || 'Failed to load problem')
      }
    } catch (e) {
      console.log(e)
      toast.error('Server error loading problem')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authToken && id) fetchDetails()
    // eslint-disable-next-line
  }, [id, authToken, refreshKey])

  const addIdea = async (e) => {
    e.preventDefault()

    if (!ideaForm.title.trim() || !ideaForm.description.trim()) {
      toast.error('Title and description are required')
      return
    }

    try {
      setSubmittingIdea(true)
      const res = await fetch(`${apiUrl}/problems/${id}/ideas`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: ideaForm.title,
          description: ideaForm.description,
        }),
      })
      const result = await res.json()

      if (result.status === 200) {
        toast.success('Idea added')
        setIdeaForm({ title: '', description: '' })
        setRefreshKey((k) => k + 1)
      } else if (result.status === 422) {
        toast.error('Validation failed')
      } else {
        toast.error(result.message || 'Failed to add idea')
      }
    } catch (e) {
      console.log(e)
      toast.error('Server error adding idea')
    } finally {
      setSubmittingIdea(false)
    }
  }

  const toggleVote = async (ideaId) => {
    try {
      const res = await fetch(`${apiUrl}/ideas/${ideaId}/vote`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      })
      const result = await res.json()

      if (result.status === 200) {
        const voted = !!result.data?.voted
        const votes_count = Number(result.data?.votes_count || 0)

        // update list locally for instant UI
        setIdeas((prev) =>
          prev.map((it) => (it.id === ideaId ? { ...it, votes_count } : it))
        )

        setMyVotes((prev) => {
          const set = new Set(prev || [])
          if (voted) set.add(ideaId)
          else set.delete(ideaId)
          return Array.from(set)
        })

        toast.success(result.message || (voted ? 'Voted' : 'Vote removed'))
      } else {
        toast.error(result.message || 'Vote failed')
      }
    } catch (e) {
      console.log(e)
      toast.error('Server error voting')
    }
  }

  const selectIdea = async (ideaId) => {
    if (!isMentorRole) return

    try {
      const res = await fetch(`${apiUrl}/ideas/${ideaId}/select`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      })
      const result = await res.json()

      if (result.status === 200) {
        toast.success('Idea selected for building')
        setRefreshKey((k) => k + 1)
      } else {
        toast.error(result.message || 'Select failed')
      }
    } catch (e) {
      console.log(e)
      toast.error('Server error selecting idea')
    }
  }

  return (
    <Layout>
      <div className="container my-4">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 className="mb-0">Problem Details</h3>
            <small className="text-muted">
              <Link to="/innovation" style={{ textDecoration: 'none' }}>← Back to Problem Hub</Link>
            </small>
          </div>
          {problem && (
            <span className={`badge ${
              problem.status === 'open' ? 'bg-success'
              : problem.status === 'building' ? 'bg-warning text-dark'
              : 'bg-dark'
            }`}>
              {problem.status}
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-center py-5">Loading...</div>
        ) : !problem ? (
          <div className="alert alert-danger">Problem not found.</div>
        ) : (
          <>
            {/* Problem card */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between flex-wrap gap-2">
                  <span className="badge bg-secondary">{problem.category || 'General'}</span>
                  <small className="text-muted">
                    Posted by: <strong>{problem.user?.name || 'Unknown'}</strong>
                  </small>
                </div>

                <h4 className="mt-2">{problem.title}</h4>
                <p className="text-muted mb-0" style={{ whiteSpace: 'pre-line' }}>
                  {problem.description}
                </p>
              </div>
            </div>

            <div className="row g-3">

              {/* Ideas */}
              <div className="col-lg-7">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="mb-0">Ideas</h5>
                      <small className="text-muted">{ideas.length} total</small>
                    </div>

                    {ideas.length === 0 ? (
                      <div className="text-muted py-3">
                        No ideas yet. Be the first to propose one 👇
                      </div>
                    ) : (
                      <div className="d-flex flex-column gap-3">
                        {ideas.map((idea) => {
                          const voted = votedSet.has(idea.id)
                          return (
                            <div key={idea.id} className={`border rounded p-3 ${idea.is_selected ? 'border-success' : ''}`}>
                              <div className="d-flex justify-content-between align-items-start gap-2">
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <h6 className="mb-0">{idea.title}</h6>
                                    {idea.is_selected == 1 && (
                                      <button
                                        className="btn btn-sm btn-primary ms-2"
                                        onClick={() => joinTeam(idea.id)}
                                        disabled={joining}
                                      >
                                        {joining ? 'Joining...' : 'Join Team'}
                                      </button>
                                    )}
                                  </div>
                                  <small className="text-muted">
                                    By {idea.user?.name || 'Unknown'}
                                  </small>
                                </div>

                                <div className="text-end" style={{ minWidth: 150 }}>
                                  <button
                                    className={`btn btn-sm ${voted ? 'btn-success' : 'btn-outline-success'} me-2`}
                                    onClick={() => toggleVote(idea.id)}
                                  >
                                    {voted ? 'Voted' : 'Vote'} • {idea.votes_count}
                                  </button>

                                  {isMentorRole && !idea.is_selected && (
                                    <button
                                      className="btn btn-sm btn-outline-primary"
                                      onClick={() => selectIdea(idea.id)}
                                    >
                                      Select
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div className="mt-2 text-muted" style={{ whiteSpace: 'pre-line' }}>
                                {idea.description}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Add Idea Form */}
              <div className="col-lg-5">
                <div className="card">
                  <div className="card-body">
                    <h5 className="mb-2">Propose an Idea</h5>
                    <form onSubmit={addIdea}>
                      <div className="mb-2">
                        <label className="form-label">Idea Title</label>
                        <input
                          className="form-control"
                          value={ideaForm.title}
                          onChange={(e) => setIdeaForm((p) => ({ ...p, title: e.target.value }))}
                          placeholder="Example: QR code attendance app"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          rows={5}
                          value={ideaForm.description}
                          onChange={(e) => setIdeaForm((p) => ({ ...p, description: e.target.value }))}
                          placeholder="Explain how it works, who benefits, and why it's good."
                        />
                      </div>

                      <button className="btn btn-primary" disabled={submittingIdea}>
                        {submittingIdea ? 'Submitting...' : 'Submit Idea'}
                      </button>
                    </form>

                    <hr />

                    <div className="text-muted" style={{ fontSize: 13 }}>
                      <div><strong>Tip:</strong> The best ideas are simple + measurable.</div>
                      <div className="mt-1">Example: “Reduce attendance time from 10 minutes to 30 seconds.”</div>
                    </div>
                  </div>
                </div>

                {isMentorRole && (
                  <div className="alert alert-info mt-3">
                    <strong>Mentor Mode:</strong> You can select one idea to move this problem into <b>Building</b>.
                  </div>
                )}
              </div>

            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

export default ProblemDetails