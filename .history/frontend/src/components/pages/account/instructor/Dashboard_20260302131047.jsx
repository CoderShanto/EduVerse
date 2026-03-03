import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../../common/Layout'
import UserSidebar from '../../../common/UserSidebar'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { apiUrl, token as configToken } from '../../../common/Config'
import { AuthContext } from '../../../context/Auth'

const Card = ({ title, value, hint, linkTo, linkLabel, tone = 'dark' }) => {
  const badgeClass =
    tone === 'green' ? 'bg-success'
    : tone === 'blue' ? 'bg-primary'
    : tone === 'yellow' ? 'bg-warning text-dark'
    : 'bg-dark'

  return (
    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div className="text-muted" style={{ fontSize: 13 }}>{title}</div>
            <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.1 }}>{value}</div>
            {hint && <div className="text-muted mt-1" style={{ fontSize: 12 }}>{hint}</div>}
          </div>
          <span className={`badge ${badgeClass}`}>{title}</span>
        </div>

        {linkTo && (
          <div className="mt-3">
            <Link to={linkTo} className="btn btn-sm btn-outline-dark">
              {linkLabel || 'View'} →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const authToken = user?.token || user?.user?.token || configToken

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${apiUrl}/instructor/dashboard/stats`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${authToken}` },
      })
      const result = await res.json()

      if (result.status === 200) {
        setStats(result.data)
      } else {
        toast.error(result.message || 'Failed to load instructor stats')
      }
    } catch (e) {
      console.log(e)
      toast.error('Server error loading instructor dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authToken) load()
    // eslint-disable-next-line
  }, [authToken])

  return (
    <Layout>
      <section className='section-4'>
        <div className='container pb-5 pt-3'>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/account">Account</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Instructor Dashboard</li>
            </ol>
          </nav>

          <div className='row'>
            <div className='col-md-12 mt-4 mb-3'>
              <div className='d-flex justify-content-between align-items-center flex-wrap gap-2'>
                <h2 className='h4 mb-0'>Instructor Dashboard</h2>

                <div className="d-flex gap-2">
                  <Link to="/account/courses/create" className="btn btn-sm btn-primary">
                    + Create Course
                  </Link>
                  <Link to="/account/my-courses" className="btn btn-sm btn-outline-dark">
                    My Courses →
                  </Link>
                </div>
              </div>
              <div className="text-muted mt-1" style={{ fontSize: 13 }}>
                Track your course performance and recent enrollments.
              </div>
            </div>

            <div className='col-lg-3 account-sidebar mb-4'>
              <UserSidebar />
            </div>

            <div className='col-lg-9'>
              {loading ? (
                <div className="text-center py-5">Loading...</div>
              ) : !stats ? (
                <div className="alert alert-danger">No stats found.</div>
              ) : (
                <>
                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <Card
                        title="Total Courses"
                        value={stats.total_courses}
                        hint="All courses you created"
                        linkTo="/account/my-courses"
                        linkLabel="Manage"
                        tone="blue"
                      />
                    </div>

                    <div className="col-md-4">
                      <Card
                        title="Active Courses"
                        value={stats.active_courses}
                        hint="Published and visible"
                        linkTo="/account/my-courses"
                        linkLabel="View"
                        tone="green"
                      />
                    </div>

                    <div className="col-md-4">
                      <Card
                        title="Enrollments"
                        value={stats.total_enrollments}
                        hint="Students enrolled in your courses"
                        tone="yellow"
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <Card
                        title="Total Reviews"
                        value={stats.total_reviews}
                        hint="All reviews across your courses"
                        tone="dark"
                      />
                    </div>
                    <div className="col-md-6">
                      <Card
                        title="Avg Rating"
                        value={stats.avg_rating}
                        hint="Average rating across your courses"
                        tone="dark"
                      />
                    </div>
                  </div>

                  <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="mb-0">Recent Enrollments</h5>
                        <span className="badge bg-light text-dark" style={{ border: '1px solid #eee' }}>
                          Last 5
                        </span>
                      </div>

                      {stats.recent_enrollments?.length ? (
                        <div className="table-responsive">
                          <table className="table table-sm align-middle mb-0">
                            <thead>
                              <tr>
                                <th>Student</th>
                                <th>Course</th>
                                <th className="text-end">Date</th>
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
                                  <td className="text-end text-muted" style={{ fontSize: 13 }}>
                                    {r.created_at ? new Date(r.created_at).toLocaleString() : '—'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-muted py-4">No enrollments yet.</div>
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

export default Dashboard