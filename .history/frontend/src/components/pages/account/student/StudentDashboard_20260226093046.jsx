import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../../common/Layout'
import UserSidebar from '../../../common/UserSidebar'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../../context/Auth'
import { apiUrl } from '../../../common/Config'

// Simple Icon Components to avoid external dependencies
const IconBook = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const IconAward = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
const IconClock = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IconPlay = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>

const StudentDashboard = () => {
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState(null)
  const [recentCourses, setRecentCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)

        // 1. Fetch Stats
        const statsRes = await fetch(`${apiUrl}/dashboard/stats`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${user?.token}`,
          },
        })
        const statsResult = await statsRes.json()

        // 2. Fetch Recent/Course Data (Update endpoint as per your backend)
        // For now, we mock this if API isn't ready, replace with real fetch later
        const coursesRes = await fetch(`${apiUrl}/courses/my-learning`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${user?.token}`,
            },
        })
        const coursesResult = await coursesRes.json()

        if (statsResult.status === 200) {
          setStats(statsResult.stats)
        }
        
        if (coursesResult.status === 200) {
            setRecentCourses(coursesResult.courses || [])
        }

      } catch (e) {
        console.error("Dashboard load error", e)
      } finally {
        setLoading(false)
      }
    }

    if (user?.token) loadDashboardData()
  }, [user])

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <div className='col-md-3 mb-4'>
      <div className='card shadow-sm h-100'>
        <div className='card-body'>
          <div className="clearfix mb-3">
            <div className="float-start" style={{width: '40px', height: '40px', background: '#eee', borderRadius: '50%'}}></div>
            <div className="float-end" style={{width: '100px', height: '20px', background: '#eee', borderRadius: '4px'}}></div>
          </div>
          <div style={{width: '60%', height: '24px', background: '#eee', borderRadius: '4px', marginBottom: '8px'}}></div>
          <div style={{width: '40%', height: '14px', background: '#eee', borderRadius: '4px'}}></div>
        </div>
      </div>
    </div>
  )

  return (
    <Layout>
      <section className='section-4 bg-light'>
        <div className='container pb-5 pt-4'>

          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/account/dashboard" className="text-decoration-none">Account</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
            </ol>
          </nav>

          {/* Welcome Header */}
          <div className="row mb-4">
            <div className="col-md-8">
              <h1 className="h3 fw-bold text-dark">Welcome back, {user?.name || 'Student'}! 👋</h1>
              <p className="text-muted">You've learned <strong>{stats?.learning_hours || 0} hours</strong> so far. Keep it up!</p>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <Link to="/courses" className="btn btn-primary btn-sm px-4">
                Browse Courses
              </Link>
            </div>
          </div>

          <div className='row'>
            {/* Sidebar */}
            <div className='col-lg-3 mb-4'>
              <div className="card border-0 shadow-sm sticky-top" style={{top: '100px', zIndex: 1}}>
                <div className="card-body p-0">
                   <UserSidebar />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className='col-lg-9'>
              {loading ? (
                <div className='row'>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              ) : (
                <>
                  {/* Stats Row */}
                  <div className='row mb-4'>
                    <div className='col-sm-6 col-md-3 mb-3'>
                      <div className='card border-0 shadow-sm h-100 hover-card'>
                        <div className='card-body'>
                          <div className="d-flex align-items-center">
                            <div className="flex-shrink-0 bg-primary bg-opacity-10 text-primary p-3 rounded">
                              <IconBook />
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <h6 className="text-muted mb-1 small text-uppercase fw-bold">Enrolled</h6>
                              <h3 className="mb-0 fw-bold">{stats?.enrolled_courses ?? 0}</h3>
                            </div>
                          </div>
                        </div>
                        <div className='card-footer bg-white border-0 pt-0 pb-3'>
                          <Link to="/account/my-learning" className="text-decoration-none small fw-bold">View All &rarr;</Link>
                        </div>
                      </div>
                    </div>

                    <div className='col-sm-6 col-md-3 mb-3'>
                      <div className='card border-0 shadow-sm h-100 hover-card'>
                        <div className='card-body'>
                          <div className="d-flex align-items-center">
                            <div className="flex-shrink-0 bg-success bg-opacity-10 text-success p-3 rounded">
                              <IconCheck />
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <h6 className="text-muted mb-1 small text-uppercase fw-bold">Completed</h6>
                              <h3 className="mb-0 fw-bold">{stats?.completed_courses ?? 0}</h3>
                            </div>
                          </div>
                        </div>
                        <div className='card-footer bg-white border-0 pt-0 pb-3'>
                          <span className="text-muted small">Great job!</span>
                        </div>
                      </div>
                    </div>

                    <div className='col-sm-6 col-md-3 mb-3'>
                      <div className='card border-0 shadow-sm h-100 hover-card'>
                        <div className='card-body'>
                          <div className="d-flex align-items-center">
                            <div className="flex-shrink-0 bg-warning bg-opacity-10 text-warning p-3 rounded">
                              <IconAward />
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <h6 className="text-muted mb-1 small text-uppercase fw-bold">Certificates</h6>
                              <h3 className="mb-0 fw-bold">{stats?.certificates ?? 0}</h3>
                            </div>
                          </div>
                        </div>
                        <div className='card-footer bg-white border-0 pt-0 pb-3'>
                          <Link to="/account/certificates" className="text-decoration-none small fw-bold">View Certs &rarr;</Link>
                        </div>
                      </div>
                    </div>

                    <div className='col-sm-6 col-md-3 mb-3'>
                      <div className='card border-0 shadow-sm h-100 hover-card'>
                        <div className='card-body'>
                          <div className="d-flex align-items-center">
                            <div className="flex-shrink-0 bg-info bg-opacity-10 text-info p-3 rounded">
                              <IconClock />
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <h6 className="text-muted mb-1 small text-uppercase fw-bold">Hours Spent</h6>
                              <h3 className="mb-0 fw-bold">{stats?.learning_hours ?? 0}</h3>
                            </div>
                          </div>
                        </div>
                        <div className='card-footer bg-white border-0 pt-0 pb-3'>
                          <span className="text-muted small">Lifetime</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Continue Learning Section */}
                  <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 fw-bold">Continue Learning</h5>
                      <Link to="/account/my-learning" className="btn btn-sm btn-outline-secondary">View All</Link>
                    </div>
                    <div className="card-body p-0">
                      {recentCourses && recentCourses.length > 0 ? (
                        <div className="list-group list-group-flush">
                          {recentCourses.slice(0, 3).map((course, index) => (
                            <div key={index} className="list-group-item p-4">
                              <div className="row align-items-center">
                                <div className="col-md-2 mb-3 mb-md-0">
                                  <img src={course.image} alt={course.title} className="img-fluid rounded" style={{height: '80px', width: '100%', objectFit: 'cover'}} />
                                </div>
                                <div className="col-md-6 mb-3 mb-md-0">
                                  <h6 className="fw-bold mb-1 text-dark">{course.title}</h6>
                                  <p className="text-muted small mb-2">{course.instructor_name} • {course.lessons_count} Lessons</p>
                                  <div className="progress" style={{height: '6px'}}>
                                    <div className="progress-bar bg-primary" role="progressbar" style={{width: `${course.progress}%`}}></div>
                                  </div>
                                  <small className="text-muted mt-1 d-block">{course.progress}% Complete</small>
                                </div>
                                <div className="col-md-4 text-md-end">
                                  <Link to={`/courses/detail/${course.slug}/learn`} className="btn btn-primary btn-sm">
                                    <span className="d-flex align-items-center gap-2">
                                      <IconPlay /> Resume
                                    </span>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-5">
                          <p className="text-muted mb-3">You haven't enrolled in any courses yet.</p>
                          <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recommendations / Info */}
                  <div className="row">
                    <div className="col-md-6 mb-4">
                        <div className="card border-0 shadow-sm h-100 bg-primary text-white" style={{background: 'linear-gradient(45deg, #0d6efd, #0a58ca)'}}>
                            <div className="card-body p-4">
                                <h4 className="fw-bold">Need Help?</h4>
                                <p className="opacity-75">Our support team is available 24/7 to assist you with your learning journey.</p>
                                <button className="btn btn-light text-primary fw-bold btn-sm">Contact Support</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-3">Upcoming Live Classes</h5>
                                <div className="d-flex align-items-start mb-3">
                                    <div className="bg-light rounded p-2 text-center me-3" style={{minWidth: '50px'}}>
                                        <span className="d-block fw-bold text-danger">OCT</span>
                                        <span className="d-block h5 mb-0 fw-bold">24</span>
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-1">React Advanced Patterns</h6>
                                        <small className="text-muted">08:00 PM - 09:30 PM</small>
                                    </div>
                                </div>
                                <hr className="my-2"/>
                                <div className="d-flex align-items-start">
                                    <div className="bg-light rounded p-2 text-center me-3" style={{minWidth: '50px'}}>
                                        <span className="d-block fw-bold text-danger">OCT</span>
                                        <span className="d-block h5 mb-0 fw-bold">28</span>
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-1">UI/UX Design Basics</h6>
                                        <small className="text-muted">06:00 PM - 07:00 PM</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>

                </>
              )}
            </div>
          </div>

        </div>
      </section>
      
      {/* Custom Styles for Hover Effects */}
      <style>{`
        .hover-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
        }
        .section-4 {
            min-height: 100vh;
        }
      `}</style>
    </Layout>
  )
}

export default StudentDashboard