import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { apiUrl } from '../../common/Config'
import { AuthContext } from '../../context/Auth'

const IdeaWorkspace = () => {
  const { id } = useParams()
  const { user } = useContext(AuthContext)

  const role = user?.user?.role?.toLowerCase() || ''
  const isAdminOrInstructor = ['admin', 'instructor'].includes(role)

  const authToken = user?.token || user?.user?.token

  const [loading, setLoading] = useState(true)
  const [workspace, setWorkspace] = useState(null)
  const [isMember, setIsMember] = useState(false)

  const [updateForm, setUpdateForm] = useState({
    content: '',
    proof_type: '',
    proof_url: ''
  })

  const [feedbackForms, setFeedbackForms] = useState({})

  const fetchWorkspace = async () => {
    try {
      setLoading(true)

      const res = await fetch(`${apiUrl}/ideas/${id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      })

      const result = await res.json()

      if (result.status === 200) {
        setWorkspace(result.data.idea)
        setIsMember(result.data.is_member)
      } else {
        toast.error(result.message || 'Failed to load workspace')
      }
    } catch (err) {
      console.log(err)
      toast.error('Server error loading workspace')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authToken) fetchWorkspace()
  }, [id])

  const submitUpdate = async (e) => {
    e.preventDefault()

    if (!updateForm.content.trim()) {
      toast.error('Content required')
      return
    }

    try {
      const res = await fetch(`${apiUrl}/ideas/${id}/updates`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updateForm),
      })

      const result = await res.json()

      if (result.status === 200) {
        toast.success('Update posted')
        setUpdateForm({ content: '', proof_type: '', proof_url: '' })
        fetchWorkspace()
      } else {
        toast.error(result.message || 'Failed to post update')
      }
    } catch (err) {
      console.log(err)
      toast.error('Server error posting update')
    }
  }

  const submitFeedback = async (updateId) => {
    const form = feedbackForms[updateId]

    if (!form?.comment) {
      toast.error('Feedback comment required')
      return
    }

    try {
      const res = await fetch(`${apiUrl}/updates/${updateId}/feedback`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(form),
      })

      const result = await res.json()

      if (result.status === 200) {
        toast.success('Feedback added')
        fetchWorkspace()
      } else {
        toast.error(result.message || 'Failed to add feedback')
      }
    } catch (err) {
      console.log(err)
      toast.error('Server error adding feedback')
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="container py-5 text-center">Loading workspace...</div>
      </Layout>
    )
  }

  if (!workspace) {
    return (
      <Layout>
        <div className="container py-5 text-center text-danger">
          Workspace not available.
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container my-4">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Workspace</h3>
          <Link to="/account/innovation/my-teams" className="btn btn-outline-secondary btn-sm">
            ← Back to My Teams
          </Link>
        </div>

        {/* IDEA INFO */}
        <div className="card mb-4">
          <div className="card-body">
            <h5>{workspace.title}</h5>
            <p className="text-muted mb-1">{workspace.problem?.title}</p>
            <span className="badge bg-success">Building</span>
          </div>
        </div>

        {/* TEAM MEMBERS */}
        <div className="card mb-4">
          <div className="card-body">
            <h6>Team Members</h6>
            <ul className="mb-0">
              {workspace.members_users?.map(member => (
                <li key={member.id}>{member.name}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* POST UPDATE */}
        {isMember && (
          <div className="card mb-4">
            <div className="card-body">
              <h6>Post Update</h6>
              <form onSubmit={submitUpdate}>
                <textarea
                  className="form-control mb-2"
                  rows="3"
                  placeholder="Describe progress..."
                  value={updateForm.content}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, content: e.target.value })
                  }
                />

                <select
                  className="form-select mb-2"
                  value={updateForm.proof_type}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, proof_type: e.target.value })
                  }
                >
                  <option value="">Proof Type</option>
                  <option value="github">GitHub</option>
                  <option value="demo">Demo</option>
                  <option value="pdf">PDF</option>
                  <option value="image">Image</option>
                  <option value="link">Link</option>
                </select>

                <input
                  className="form-control mb-2"
                  placeholder="Proof URL (optional)"
                  value={updateForm.proof_url}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, proof_url: e.target.value })
                  }
                />

                <button className="btn btn-primary btn-sm">
                  Submit Update
                </button>
              </form>
            </div>
          </div>
        )}

        {/* UPDATES FEED */}
        <div className="card">
          <div className="card-body">
            <h6>Build Log</h6>

            {workspace.updates?.length === 0 && (
              <div className="text-muted">No updates yet.</div>
            )}

            {workspace.updates?.map(update => (
              <div key={update.id} className="border rounded p-3 mb-3">
                <div className="d-flex justify-content-between">
                  <strong>{update.user?.name}</strong>
                  <small className="text-muted">
                    {new Date(update.created_at).toLocaleString()}
                  </small>
                </div>

                <p className="mt-2">{update.content}</p>

                {update.proof_url && (
                  <a href={update.proof_url} target="_blank" rel="noreferrer">
                    View Proof ({update.proof_type})
                  </a>
                )}

                {/* Feedback */}
                {update.feedback?.map(fb => (
                  <div key={fb.id} className="mt-2 p-2 bg-light border rounded">
                    <strong>{fb.mentor?.name}</strong>
                    {fb.score && <span className="badge bg-warning ms-2">{fb.score}/10</span>}
                    <div>{fb.comment}</div>
                  </div>
                ))}

                {/* Admin/Instructor Feedback Form */}
                {isAdminOrInstructor && (
                  <div className="mt-3">
                    <textarea
                      className="form-control mb-2"
                      placeholder="Add feedback..."
                      onChange={(e) =>
                        setFeedbackForms({
                          ...feedbackForms,
                          [update.id]: {
                            ...feedbackForms[update.id],
                            comment: e.target.value
                          }
                        })
                      }
                    />
                    <input
                      type="number"
                      min="1"
                      max="10"
                      className="form-control mb-2"
                      placeholder="Score (1-10)"
                      onChange={(e) =>
                        setFeedbackForms({
                          ...feedbackForms,
                          [update.id]: {
                            ...feedbackForms[update.id],
                            score: e.target.value
                          }
                        })
                      }
                    />
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => submitFeedback(update.id)}
                    >
                      Submit Feedback
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  )
}

export default IdeaWorkspace