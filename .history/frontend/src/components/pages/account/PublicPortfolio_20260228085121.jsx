import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../../common/Layout'
import toast from 'react-hot-toast'
import { apiUrl } from '../../common/Config'

const PublicPortfolio = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  const fetchPortfolio = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${apiUrl}/portfolio/${id}`, {
        headers: { Accept: 'application/json' },
      })
      const result = await res.json()

      if (result.status === 200) {
        setData(result.data)
      } else {
        toast.error(result.message || 'Portfolio not found')
      }
    } catch (e) {
      console.log(e)
      toast.error('Server error loading portfolio')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchPortfolio()
    // eslint-disable-next-line
  }, [id])

  return (
    <Layout>
      <div className="container my-5">
        {loading ? (
          <div className="text-center py-5">Loading portfolio...</div>
        ) : !data ? (
          <div className="alert alert-danger">Portfolio not found.</div>
        ) : (
          <>
            <div className="text-center mb-4">
              <h2>{data.user?.name}</h2>
              <div className="text-muted">{data.user?.role}</div>
            </div>

            {/* Stats */}
            <div className="row g-3 mb-4">
              <div className="col-md-4 text-center">
                <div className="card shadow-sm p-3">
                  <h4>{data.stats?.completed_courses}</h4>
                  <div className="text-muted">Completed Courses</div>
                </div>
              </div>
              <div className="col-md-4 text-center">
                <div className="card shadow-sm p-3">
                  <h4>{data.stats?.innovation_showcases}</h4>
                  <div className="text-muted">Innovation Projects</div>
                </div>
              </div>
              <div className="col-md-4 text-center">
                <div className="card shadow-sm p-3">
                  <h4>{data.stats?.in_progress_courses}</h4>
                  <div className="text-muted">In Progress</div>
                </div>
              </div>
            </div>

            {/* Innovation Showcases */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="mb-3">Innovation Projects</h5>

                {(data.innovation?.showcases || []).length === 0 ? (
                  <div className="text-muted">No projects published.</div>
                ) : (
                  <div className="row g-3">
                    {data.innovation.showcases.map((s) => (
                      <div className="col-md-6" key={s.idea_id}>
                        <div className="border rounded p-3 h-100">
                          <div className="fw-bold">{s.idea_title}</div>
                          <div className="text-muted" style={{ fontSize: 13 }}>
                            Problem: {s.problem_title}
                          </div>
                          <div className="mt-2">{s.summary}</div>

                          <div className="mt-2 d-flex gap-2 flex-wrap">
                            {s.repo_url && (
                              <a className="btn btn-sm btn-dark" href={s.repo_url} target="_blank" rel="noreferrer">
                                GitHub
                              </a>
                            )}
                            {s.demo_url && (
                              <a className="btn btn-sm btn-primary" href={s.demo_url} target="_blank" rel="noreferrer">
                                Demo
                              </a>
                            )}
                            {s.report_url && (
                              <a className="btn btn-sm btn-success" href={s.report_url} target="_blank" rel="noreferrer">
                                Report
                              </a>
                            )}
                          </div>

                          <div className="mt-2 text-muted" style={{ fontSize: 12 }}>
                            Score: {s.score}/10
                          </div>
                        </div>
                      </div>
                    ))}
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

export default PublicPortfolio