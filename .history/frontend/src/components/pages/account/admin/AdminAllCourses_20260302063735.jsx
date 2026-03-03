import React, { useEffect, useMemo, useState } from 'react'
import Layout from '../../../common/Layout'
import UserSidebar from '../../../common/UserSidebar'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { apiUrl } from '../../../common/Config'
import { AuthContext } from '../../../context/Auth'
import { useContext } from 'react'

const AdminAllCourses = () => {
  const { user } = useContext(AuthContext)
  const authToken = user?.token || user?.user?.token

  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState([])

  const [keyword, setKeyword] = useState('')
  const [sort, setSort] = useState('desc') // desc=newest, asc=oldest
  const [deletingId, setDeletingId] = useState(null)

  const fetchCourses = async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams()
      params.set('sort', sort)
      if (keyword.trim()) params.set('keyword', keyword.trim())

      // ✅ uses your existing public endpoint
      const res = await fetch(`${apiUrl}/fetch-courses?${params.toString()}`, {
        headers: { Accept: 'application/json' },
      })
      const result = await res.json()

      if (result.status === 200) {
        setCourses(result.data || [])
      } else {
        toast.error(result.message || 'Failed to load courses')
        setCourses([])
      }
    } catch (e) {
      console.log(e)
      toast.error('Server error loading courses')
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
    // eslint-disable-next-line
  }, [sort])

  // local filter (instant UI) + server keyword fetch (optional)
  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase()
    if (!k) return courses
    return courses.filter((c) => String(c.title || '').toLowerCase().includes(k))
  }, [courses, keyword])

  // OPTIONAL: if you already have delete endpoint, keep it.
  // Otherwise remove delete button section.
  const deleteCourse = async (courseId) => {
    if (!window.confirm('Delete this course? This cannot be undone.')) return

    try {
      setDeletingId(courseId)

      // ⚠️ Change this endpoint to your real one if different:
      // common patterns:
      // DELETE /api/courses/{id}
      // POST /api/admin/courses/{id}/delete
      const res = await fetch(`${apiUrl}/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      })

      // some APIs return 204 (no content)
      let result = null
      try {
        result = await res.json()
      } catch {
        result = { status: res.ok ? 200 : 400 }
      }

      if (res.ok && (result?.status === 200 || result?.status === 204 || result?.status === undefined)) {
        toast.success('Course deleted')
        setCourses((prev) => prev.filter((c) => c.id !== courseId))
      } else {
        toast.error(result?.message || 'Delete failed (check your API route)')
      }
    } catch (e) {
      console.log(e)
      toast.error('Server error deleting course')
    } finally {
      setDeletingId(null)
    }
  }

  const badge = (text, cls) => (
    <span className={`badge ${cls}`} style={{ borderRadius: 999 }}>
      {text}
    </span>
  )

  return (
    <Layout>
      <div className="container my-4">
        <div className="row">
          <div className="col-lg-3 account-sidebar mb-4">
            <UserSidebar />
          </div>

          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
              <div>
                <h3 className="mb-0">Admin • All Courses</h3>
                <small className="text-muted">Manage courses (edit, review, delete).</small>
              </div>

              <div className="d-flex gap-2">
                <Link className="btn btn-sm btn-primary" to="/account/courses/create">
                  + Create Course
                </Link>
              </div>
            </div>

            {/* Top bar (simple) */}
            <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 16 }}>
              <div className="card-body d-flex align-items-center gap-2 flex-wrap">
                <div style={{ flex: 1, minWidth: 220 }}>
                  <input
                    className="form-control"
                    placeholder="Search by course title..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>

                <select
                  className="form-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  style={{ maxWidth: 180 }}
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>

                <button className="btn btn-outline-secondary" onClick={fetchCourses} disabled={loading}>
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="text-muted" style={{ fontSize: 13 }}>
                    Showing <b>{filtered.length}</b> course(s)
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-5">Loading...</div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-5">
                    <h5 className="mb-1">No courses found</h5>
                    <div className="text-muted">Try another keyword.</div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th style={{ width: 70 }}>Cover</th>
                          <th>Course</th>
                          <th style={{ width: 120 }}>Price</th>
                          <th style={{ width: 120 }}>Status</th>
                          <th style={{ width: 120 }}>Featured</th>
                          <th style={{ width: 160 }}>Created</th>
                          <th style={{ width: 170 }} className="text-end">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((c) => {
                          const img = c.course_small_image || c.image_url || c.image || ''
                          const isActive = String(c.status) === '1' || String(c.status).toLowerCase() === 'active'
                          const featured = String(c.is_featured).toLowerCase() === 'yes' || String(c.is_featured) === '1'

                          return (
                            <tr key={c.id}>
                              <td>
                                <div
                                  style={{
                                    width: 54,
                                    height: 40,
                                    borderRadius: 10,
                                    background: '#f3f4f6',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 18,
                                  }}
                                >
                                  {img ? (
                                    <img
                                      src={img}
                                      alt=""
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                  ) : (
                                    '📘'
                                  )}
                                </div>
                              </td>

                              <td style={{ minWidth: 260 }}>
                                <div className="fw-semibold">{c.title || 'Untitled'}</div>
                                <div className="text-muted" style={{ fontSize: 12 }}>
                                  ID: {c.id} • Level: {c.level?.name || c.level_name || '—'} • Lang:{' '}
                                  {c.language?.name || c.language_name || '—'}
                                </div>
                              </td>

                              <td>
                                <div className="fw-semibold">{c.price ?? '—'}</div>
                                {c.cross_price ? (
                                  <div className="text-muted" style={{ fontSize: 12, textDecoration: 'line-through' }}>
                                    {c.cross_price}
                                  </div>
                                ) : null}
                              </td>

                              <td>{isActive ? badge('Active', 'bg-success') : badge('Hidden', 'bg-secondary')}</td>

                              <td>{featured ? badge('Yes', 'bg-warning text-dark') : badge('No', 'bg-light text-dark')}</td>

                              <td className="text-muted" style={{ fontSize: 13 }}>
                                {c.created_at ? new Date(c.created_at).toLocaleString() : '—'}
                              </td>

                              <td className="text-end">
                                {/* ✅ Change this route to your real edit page */}
                                <Link
                                  to={`/account/courses/edit/${c.id}`}
                                  className="btn btn-sm btn-outline-primary me-2"
                                >
                                  Edit
                                </Link>

                                {/* OPTIONAL delete */}
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => deleteCourse(c.id)}
                                  disabled={deletingId === c.id}
                                >
                                  {deletingId === c.id ? 'Deleting...' : 'Delete'}
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="text-muted mt-2" style={{ fontSize: 12 }}>
              Tip: If your image field is only a filename (like <code>123.jpg</code>), you must prepend your uploads base
              URL in backend or frontend.
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminAllCourses