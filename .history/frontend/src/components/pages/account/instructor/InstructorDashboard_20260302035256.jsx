import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../../common/Layout'
import UserSidebar from '../../../common/UserSidebar'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { apiUrl, token as configToken } from '../../../common/Config'
import { AuthContext } from '../../../context/Auth'

const InstructorDashboard = () => {
  const { user } = useContext(AuthContext)
  const authToken = user?.token || user?.user?.token || configToken

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${apiUrl}/instructor/dashboard/stats`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      })
      const result = await res.json()
      if (result.status === 200) setStats(result.stats)
      else toast.error(result.message || 'Failed to load instructor stats')
    } catch (e) {
      console.log(e)
      toast.error('Server error loading instructor stats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authToken) load()
    // eslint-disable-next-line
  }, [authToken])

  const Card = ({ title, value, hint, linkText, linkTo }) => (
    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div className="text-muted" style={{ fontSize: 13 }}>{title}</div>
            <div className="fw-bold" style={{ fontSize: 28 }}>{value}</div>
            {hint && <div className="text-muted" style={{ fontSize: 12 }}>{hint}</div>}
          </div>
        </div>
      </div>
      {linkTo ? (
        <div className="card-footer bg-transparent border-0 pt-0">
          <Link to={linkTo} className="btn btn-sm btn-outline-primary">
            {linkText} →
          </Link>
        </div>
      ) : (
        <div className="card-footer bg-transparent border-0 pt-0">&nbsp;</div>
      )}
    </div>
  )

  return (
    <Layout>
      <section className="section-4">
        <div className="container pb-5 pt-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/account">Account</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Instructor Dashboard</li>
            </ol>
          </nav>

          <div className="row">
            <div className="col-md-12 mt-4 mb-3">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h2 className="h4 mb-0">Instructor Dashboard</h2>
                <Link to="/account/my-courses" className="btn btn-sm btn-dark">
                  Manage Courses →
                </Link>
              </div>
              <small className="text-muted">Track your courses, students, and feedback.</small>
            </div>

            <div className="col-lg-3 account-sidebar mb-4">
              <UserSidebar />
            </div>

            <div className="col-lg-9">
              {loading ? (
                <div className="text-center py-5">Loading...</div>
              ) : !stats ? (
                <div className="alert alert-danger">Stats not available.</div>
              ) : (
                <>
                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <Card
                        title="My Courses"
                        value={stats.total_courses}
                        hint="Courses you created"
                        linkText="View Courses"
                        linkTo="/account/my-courses"
                      />
                    </div>

                    <div className="col-md-4">
                      <Card
                        title="Total Enrollments"
                        value={stats.total_enrollments}
                        hint="Students enrolled in your courses"
                        linkText="View Enrollments"
                        linkTo="/account/my-courses"
                      />
                    </div>

                    <div className="col-md-4">
                      <Card
                        title="Avg Rating"
                        value={stats.avg_rating}
                        hint={`${stats.total_reviews} total reviews`}
                        linkText="Reviews"
                        linkTo="/account/my-courses"
                      />
                    </div>
                  </div>

                  <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="mb-0">Recent Enrollments</h5>
                        <span className="badge bg-dark">{(stats.recent_enrollments || []).length}</span>
                      </div>

                      {(stats.recent_enrollments || []).length === 0 ? (
                        <div className="text-muted">No enrollments yet.</div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-sm align-middle">
                            <thead>
                              <tr>
                                <th>Student</th>
                                <th>Course</th>
                                <th>Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {stats.recent_enrollments.map((r) => (
                                <tr key={r.id}>
                                  <td>
                                    <div className="fw-semibold">{r.student_name}</div>
                                    <div className="text-muted" style={{ fontSize: 12 }}>{r.student_email}</div>
                                  </td>
                                  <td>{r.course_title}</td>
                                  <td className="text-muted" style={{ fontSize: 13 }}>
                                    {r.created_at ? new Date(r.created_at).toLocaleString() : '—'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default InstructorDashboard