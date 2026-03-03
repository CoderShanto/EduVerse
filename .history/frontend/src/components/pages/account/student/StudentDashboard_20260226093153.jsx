import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../../common/Layout'
import UserSidebar from '../../../common/UserSidebar'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../../context/Auth'
import { apiUrl } from '../../../common/Config'

const StudentDashboard = () => {
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)

        const res = await fetch(`${apiUrl}/dashboard/stats`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${user?.token}`,
          },
        })

        const result = await res.json()

        if (result.status === 200) {
          setStats(result.stats)
        } else {
          setStats(null)
        }

      } catch (e) {
        setStats(null)
      } finally {
        setLoading(false)
      }
    }

    if (user?.token) loadStats()
  }, [user])

  return (
    <Layout>
      <section className='section-4'>
        <div className='container pb-5 pt-3'>

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/account/dashboard">Account</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Student Dashboard</li>
            </ol>
          </nav>

          <div className='row'>
            <div className='col-md-12 mt-4 mb-3'>
              <div className='d-flex justify-content-between'>
                <h2 className='h4 mb-0 pb-0'>Student Dashboard</h2>
              </div>
            </div>

            <div className='col-lg-3 account-sidebar'>
              <UserSidebar />
            </div>

            <div className='col-lg-9'>
              {loading ? (
                <div className="alert alert-info">Loading dashboard...</div>
              ) : (
                <div className='row'>

                  <div className='col-md-4 mb-3'>
                    <div className='card shadow'>
                      <div className='card-body p-3'>
                        <h2>{stats?.enrolled_courses ?? 0}</h2>
                        <span>Enrolled Courses</span>
                      </div>
                      <div className='card-footer'>
                        <Link to="/account/my-learning">Go to My Learning</Link>
                      </div>
                    </div>
                  </div>

                  {/* You can add more later */}
                  <div className='col-md-4 mb-3'>
                    <div className='card shadow'>
                      <div className='card-body p-3'>
                        <h2>—</h2>
                        <span>Continue Learning</span>
                      </div>
                      <div className='card-footer'>
                        <span className="text-muted">Coming next</span>
                      </div>
                    </div>
                  </div>

                  <div className='col-md-4 mb-3'>
                    <div className='card shadow'>
                      <div className='card-body p-3'>
                        <h2>—</h2>
                        <span>Progress</span>
                      </div>
                      <div className='card-footer'>
                        <span className="text-muted">Coming next</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>

        </div>
      </section>
    </Layout>
  )
}

export default StudentDashboard