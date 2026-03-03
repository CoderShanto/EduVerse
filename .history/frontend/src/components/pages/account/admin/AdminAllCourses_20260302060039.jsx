import React, { useEffect, useState, useContext } from 'react'
import Layout from '../../../common/Layout'
import UserSidebar from '../../../common/UserSidebar'
import { Link, useSearchParams } from 'react-router-dom'
import Loading from '../../../common/Loading'
import NotFound from '../../../common/NotFound'
import { apiUrl } from '../../../common/Config'
import { AuthContext } from '../../../context/Auth'

const AdminAllCourses = () => {
  const { user } = useContext(AuthContext)
  const authToken = user?.token || user?.user?.token

  const [searchParams, setSearchParams] = useSearchParams()
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'desc')

  const [categories, setCategories] = useState([])
  const [levels, setLevels] = useState([])
  const [languages, setLanguages] = useState([])

  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const [categoryChecked, setCategoryChecked] = useState(() => {
    const c = searchParams.get('category')
    return c ? c.split(',') : []
  })

  const [levelChecked, setLevelChecked] = useState(() => {
    const l = searchParams.get('level')
    return l ? l.split(',') : []
  })

  const [languageChecked, setLanguageChecked] = useState(() => {
    const lg = searchParams.get('language')
    return lg ? lg.split(',') : []
  })

  const handleToggle = (value, list, setList) => {
    if (list.includes(value)) setList(list.filter((x) => x !== value))
    else setList([...list, value])
  }

  const clearFilters = () => {
    setCategoryChecked([])
    setLevelChecked([])
    setLanguageChecked([])
    setKeyword('')
    setSort('desc')
    setSearchParams({})
  }

  const fetchMeta = async () => {
    try {
      const [cRes, lRes, langRes] = await Promise.all([
        fetch(`${apiUrl}/fetch-categories`).then((r) => r.json()),
        fetch(`${apiUrl}/fetch-levels`).then((r) => r.json()),
        fetch(`${apiUrl}/fetch-languages`).then((r) => r.json()),
      ])

      if (cRes.status === 200) setCategories(cRes.data)
      if (lRes.status === 200) setLevels(lRes.data)
      if (langRes.status === 200) setLanguages(langRes.data)
    } catch (e) {
      console.log(e)
    }
  }

  const fetchCourses = async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams()
      if (keyword) params.append('keyword', keyword)
      params.append('sort', sort)

      if (categoryChecked.length) params.append('category', categoryChecked.join(','))
      if (levelChecked.length) params.append('level', levelChecked.join(','))
      if (languageChecked.length) params.append('language', languageChecked.join(','))

      setSearchParams(params)

      const res = await fetch(`${apiUrl}/admin/courses?${params.toString()}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      })
      const result = await res.json()

      if (result.status === 200) setCourses(result.data || [])
      else setCourses([])
    } catch (e) {
      console.log(e)
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMeta()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (authToken) fetchCourses()
    // eslint-disable-next-line
  }, [authToken, keyword, sort, categoryChecked, levelChecked, languageChecked])

  return (
    <Layout>
      <div className="container my-4">
        <div className="row">
          <div className="col-lg-3 account-sidebar mb-4">
            <UserSidebar />
          </div>

          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <div>
                <h3 className="mb-0">Admin • All Courses</h3>
                <small className="text-muted">Search, filter and manage every course.</small>
              </div>
              <span className="badge bg-dark">{courses.length}</span>
            </div>

            {/* FILTERS */}
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Search</label>
                    <input
                      className="form-control"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="Search by course title..."
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Sort</label>
                    <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                      <option value="desc">Newest First</option>
                      <option value="asc">Oldest First</option>
                    </select>
                  </div>

                  <div className="col-md-3 d-flex align-items-end">
                    <button className="btn btn-outline-danger w-100" onClick={clearFilters}>
                      Clear Filters
                    </button>
                  </div>
                </div>

                <hr />

                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="fw-bold mb-2">Category</div>
                    {categories.map((c) => (
                      <div className="form-check" key={c.id}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={categoryChecked.includes(String(c.id))}
                          onChange={() => handleToggle(String(c.id), categoryChecked, setCategoryChecked)}
                        />
                        <label className="form-check-label">{c.name}</label>
                      </div>
                    ))}
                  </div>

                  <div className="col-md-4">
                    <div className="fw-bold mb-2">Level</div>
                    {levels.map((l) => (
                      <div className="form-check" key={l.id}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={levelChecked.includes(String(l.id))}
                          onChange={() => handleToggle(String(l.id), levelChecked, setLevelChecked)}
                        />
                        <label className="form-check-label">{l.name}</label>
                      </div>
                    ))}
                  </div>

                  <div className="col-md-4">
                    <div className="fw-bold mb-2">Language</div>
                    {languages.map((lg) => (
                      <div className="form-check" key={lg.id}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={languageChecked.includes(String(lg.id))}
                          onChange={() => handleToggle(String(lg.id), languageChecked, setLanguageChecked)}
                        />
                        <label className="form-check-label">{lg.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* COURSES LIST */}
            {loading ? (
              <Loading />
            ) : courses.length === 0 ? (
              <NotFound />
            ) : (
              <div className="row g-3">
                {courses.map((c) => (
                  <div className="col-md-6 col-lg-4" key={c.id}>
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
                      <div style={{ height: 150, overflow: 'hidden', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                        {c.image ? (
                          <img
                            src={`${apiUrl.replace('/api', '')}/uploads/courses/${c.image}`}
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="h-100 d-flex justify-content-center align-items-center bg-light text-muted">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="card-body">
                        <div className="fw-bold">{c.title}</div>
                        <div className="text-muted" style={{ fontSize: 13 }}>
                          Price: ৳{c.price} • Status: {c.status == 1 ? 'Active' : 'Draft'}
                        </div>

                        <div className="mt-2 d-flex gap-2 flex-wrap">
                          <Link className="btn btn-sm btn-outline-primary" to={`/admin/courses/edit/${c.id}`}>
                            Edit
                          </Link>
                          <Link className="btn btn-sm btn-outline-dark" to={`/course/${c.id}`}>
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminAllCourses