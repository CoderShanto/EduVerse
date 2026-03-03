import React, { useContext, useEffect, useMemo, useState } from 'react'
import Layout from '../../common/Layout'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { apiUrl } from '../../common/Config'
import { AuthContext } from '../../context/Auth'

const IdeaWorkspace = () => {
  const { id } = useParams()
  const { user } = useContext(AuthContext)

  const role = (user?.user?.role || '').toLowerCase().trim()
  const isAdminOrInstructor = ['admin', 'instructor'].includes(role)

  const authToken = user?.token || user?.user?.token

  const [loading, setLoading] = useState(true)
  const [workspace, setWorkspace] = useState(null)
  const [isMember, setIsMember] = useState(false)

  // update form supports either URL or FILE
  const [updateForm, setUpdateForm] = useState({
    content: '',
    proof_type: '',
    proof_url: '',
  })
  const [proofFile, setProofFile] = useState(null)
  const [posting, setPosting] = useState(false)

  // feedback per update
  const [feedbackForms, setFeedbackForms] = useState({})

  const members = useMemo(() => {
    // backend might return membersUsers or members_users depending on serializer
    return workspace?.membersUsers || workspace?.members_users || []
  }, [workspace])

  const updates = useMemo(() => workspace?.updates || [], [workspace])

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
        setIsMember(!!result.data.is_member)
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
    // eslint-disable-next-line
  }, [id])

  const resetProofInputs = () => {
    setUpdateForm((p) => ({ ...p, proof_url: '' }))
    setProofFile(null)
  }

  const onChangeProofType = (val) => {
    setUpdateForm((p) => ({ ...p, proof_type: val }))
    // if switching type, clear previous proof input
    resetProofInputs()
  }

  const submitUpdate = async (e) => {
    e.preventDefault()

    if (!updateForm.content.trim()) {
      toast.error('Content required')
      return
    }

    const type = (updateForm.proof_type || '').trim()

    // If pdf/image -> must have file
    if ((type === 'pdf' || type === 'image') && !proofFile) {
      toast.error(`Please upload a ${type.toUpperCase()} file`)
      return
    }

    // If github/demo/link -> require URL
    if ((type === 'github' || type === 'demo' || type === 'link') && !updateForm.proof_url.trim()) {
      toast.error('Please provide a proof URL')
      return
    }

    try {
      setPosting(true)

      // Use FormData always (supports both file + url)
      const fd = new FormData()
      fd.append('content', updateForm.content)
      if (type) fd.append('proof_type', type)

      if (proofFile) {
        fd.append('proof_file', proofFile) // must match backend field name
      } else if (updateForm.proof_url.trim()) {
        fd.append('proof_url', updateForm.proof_url.trim())
      }

      const res = await fetch(`${apiUrl}/ideas/${id}/updates`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
          // ❌ DO NOT set Content-Type here; browser will set multipart boundary
        },
        body: fd,
      })

      const result = await res.json()

      if (result.status === 200) {
        toast.success(result.message || 'Update posted')
        setUpdateForm({ content: '', proof_type: '', proof_url: '' })
        setProofFile(null)
        fetchWorkspace()
      } else {
        toast.error(result.message || 'Failed to post update')
      }
    } catch (err) {
      console.log(err)
      toast.error('Server error posting update')
    } finally {
      setPosting(false)
    }
  }

  const submitFeedback = async (updateId) => {
    const form = feedbackForms[updateId] || {}

    if (!String(form.comment || '').trim()) {
      toast.error('Feedback comment required')
      return
    }

    const payload = {
      comment: String(form.comment).trim(),
    }

    if (form.score !== undefined && form.score !== null && String(form.score).trim() !== '') {
      payload.score = Number(form.score)
    }

    try {
      const res = await fetch(`${apiUrl}/updates/${updateId}/feedback`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (result.status === 200) {
        toast.success(result.message || 'Feedback added')
        setFeedbackForms((p) => ({ ...p, [updateId]: { comment: '', score: '' } }))
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
          <h3 className="mb-0">Workspace</h3>
          <Link to="/account/innovation/my-teams" className="btn btn-outline-secondary btn-sm">
            ← Back to My Teams
          </Link>
        </div>

        {/* IDEA INFO */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between flex-wrap gap-2">
              <div>
                <h5 className="mb-1">{workspace.title}</h5>
                <div className="text-muted">{workspace.problem?.title}</div>
              </div>
              <div className="text-end">
                <span className="badge bg-success">Building</span>
              </div>
            </div>
          </div>
        </div>

        {/* TEAM MEMBERS */}
        <div className="card mb-4">
          <div className="card-body">
            <h6 className="mb-2">Team Members</h6>
            {members.length === 0 ? (
              <div className="text-muted">No members yet.</div>
            ) : (
              <ul className="mb-0">
                {members.map((m) => (
                  <li key={m.id}>{m.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* POST UPDATE */}
        {!isMember ? (
          <div className="alert alert-warning">
            Only team members can post updates. (Join the team from Problem Details)
          </div>
        ) : (
          <div className="card mb-4">
            <div className="card-body">
              <h6 className="mb-2">Post Update</h6>

              <form onSubmit={submitUpdate}>
                <div className="mb-2">
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Describe progress..."
                    value={updateForm.content}
                    onChange={(e) => setUpdateForm((p) => ({ ...p, content: e.target.value }))}
                  />
                </div>

                <div className="mb-2">
                  <select
                    className="form-select"
                    value={updateForm.proof_type}
                    onChange={(e) => onChangeProofType(e.target.value)}
                  >
                    <option value="">Proof Type (optional)</option>
                    <option value="github">GitHub</option>
                    <option value="demo">Demo</option>
                    <option value="pdf">PDF Upload</option>
                    <option value="image">Image Upload</option>
                    <option value="link">Link</option>
                  </select>
                </div>

                {/* For pdf/image show file input */}
                {(updateForm.proof_type === 'pdf' || updateForm.proof_type === 'image') && (
                  <div className="mb-2">
                    <input
                      type="file"
                      className="form-control"
                      accept={updateForm.proof_type === 'pdf' ? 'application/pdf' : 'image/*'}
                      onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                    />
                    <small className="text-muted">
                      Max 10MB. Allowed: PDF / JPG / PNG / WEBP.
                    </small>
                  </div>
                )}

                {/* For link/github/demo show URL input */}
                {(updateForm.proof_type === 'github' ||
                  updateForm.proof_type === 'demo' ||
                  updateForm.proof_type === 'link') && (
                  <div className="mb-2">
                    <input
                      className="form-control"
                      placeholder="Proof URL (required)"
                      value={updateForm.proof_url}
                      onChange={(e) => setUpdateForm((p) => ({ ...p, proof_url: e.target.value }))}
                    />
                  </div>
                )}

                {/* If proof type not selected, allow optional URL */}
                {!updateForm.proof_type && (
                  <div className="mb-2">
                    <input
                      className="form-control"
                      placeholder="Optional proof URL"
                      value={updateForm.proof_url}
                      onChange={(e) => setUpdateForm((p) => ({ ...p, proof_url: e.target.value }))}
                    />
                  </div>
                )}

                <button className="btn btn-primary btn-sm" disabled={posting}>
                  {posting ? 'Posting...' : 'Submit Update'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* UPDATES FEED */}
        <div className="card">
          <div className="card-body">
            <h6 className="mb-3">Build Log</h6>

            {updates.length === 0 && <div className="text-muted">No updates yet.</div>}

            {updates.map((u) => (
              <div key={u.id} className="border rounded p-3 mb-3">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <strong>{u.user?.name || 'Member'}</strong>
                  <small className="text-muted">{u.created_at ? new Date(u.created_at).toLocaleString() : ''}</small>
                </div>

                <p className="mt-2 mb-2" style={{ whiteSpace: 'pre-line' }}>
                  {u.content}
                </p>

                {/* Proof */}
                {u.proof_url && (
                  <div className="mb-2">
                    <a href={u.proof_url} target="_blank" rel="noreferrer">
                      View Proof{u.proof_type ? ` (${u.proof_type})` : ''}
                    </a>
                  </div>
                )}

                {/* Feedback list */}
                {(u.feedback || []).map((fb) => (
                  <div key={fb.id} className="mt-2 p-2 bg-light border rounded">
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <strong>{fb.mentor?.name || 'Reviewer'}</strong>
                      {fb.score ? <span className="badge bg-warning text-dark">{fb.score}/10</span> : null}
                    </div>
                    <div>{fb.comment}</div>
                  </div>
                ))}

                {/* Admin/Instructor feedback form */}
                {isAdminOrInstructor && (
                  <div className="mt-3">
                    <textarea
                      className="form-control mb-2"
                      placeholder="Add feedback..."
                      value={feedbackForms[u.id]?.comment || ''}
                      onChange={(e) =>
                        setFeedbackForms((p) => ({
                          ...p,
                          [u.id]: { ...(p[u.id] || {}), comment: e.target.value },
                        }))
                      }
                    />

                    <input
                      type="number"
                      min="1"
                      max="10"
                      className="form-control mb-2"
                      placeholder="Score (1-10) (optional)"
                      value={feedbackForms[u.id]?.score || ''}
                      onChange={(e) =>
                        setFeedbackForms((p) => ({
                          ...p,
                          [u.id]: { ...(p[u.id] || {}), score: e.target.value },
                        }))
                      }
                    />

                    <button className="btn btn-sm btn-outline-primary" onClick={() => submitFeedback(u.id)}>
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