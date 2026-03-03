import React, { useContext, useEffect, useMemo, useState } from 'react'
import Layout from '../../common/Layout'
import toast from 'react-hot-toast'
import { apiUrl, token as configToken } from '../../common/Config'
import { Link, Links } from 'react-router-dom'
import { AuthContext } from '../../context/Auth'


const ProblemHub = () => {
  const { user } = useContext(AuthContext)

  const authToken = useMemo(() => {
    // supports multiple token shapes used in your project
    return user?.token || user?.user?.token || configToken
  }, [user])

  const [items, setItems] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', category: '', description: '' })
  const [submitting, setSubmitting] = useState(false)

  const fetchProblems = async (page = 1) => {
    try {
      setLoading(true)

      const qs = new URLSearchParams()
      if (search.trim()) qs.set('search', search.trim())
      if (category && category !== 'all') qs.set('category', category)
      qs.set('page', String(page))

      const res = await fetch(`${apiUrl}/problems?${qs.toString()}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      })
      const result = await res.json()

      if (result.status === 200) {
        setItems(result.data?.data || [])
        setMeta({
          current_page: result.data?.current_page || 1,
          last_page: result.data?.last_page || 1,
          total: result.data?.total || 0,
        })
      } else {
        toast.error(result.message || 'Failed to load problems')
      }
    } catch (e) {
      console.log(e)
      toast.error('Server error while loading problems')
    } finally {
      setLoading(false)
    }
  }

  const submitProblem = async (e) => {
    e.preventDefault()

    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Title and description are required')
      return
    }

    try {
      setSubmitting(true)

      const res = await fetch(`${apiUrl}/problems`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          description: form.description,
        }),
      })

      const result = await res.json()

      if (result.status === 200) {
        toast.success(result.message || 'Problem posted!')
        setShowForm(false)
        setForm({ title: '', category: '', description: '' })
        fetchProblems(1)
      } else if (result.status === 422) {
        toast.error('Validation failed')
      } else {
        toast.error(result.message || 'Something went wrong')
      }
    } catch (e) {
      console.log(e)
      toast.error('Server error while posting problem')
    } finally {
      setSubmitting(false)
    }
  }

  // initial load when token ready
  useEffect(() => {
    if (authToken) fetchProblems(1)
    // eslint-disable-next-line
  }, [authToken])

  // Enter to search
  const onSearchKeyDown = (e) => {
    if (e.key === 'Enter') fetchProblems(1)
  }

  return (
    <Layout>
      <div className='container my-4'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <div>
            <h3 className='mb-0'>Innovation • Problem Hub</h3>
            <small className='text-muted'>Post real problems. Propose ideas. Build solutions.</small>
          </div>
          <button className='btn btn-primary' onClick={() => setShowForm(true)}>
            + Post Problem
          </button>
        </div>

        {/* Filters */}
        <div className='card mb-3'>
          <div className='card-body'>
            <div className='row g-2'>
              <div className='col-md-7'>
                <input
                  className='form-control'
                  placeholder='Search problems... (press Enter)'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={onSearchKeyDown}
                />
              </div>

              <div className='col-md-3'>
                <select
                  className='form-select'
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value='all'>All Categories</option>
                  <option value='AI / Automation'>AI / Automation</option>
                  <option value='Education'>Education</option>
                  <option value='Health'>Health</option>
                  <option value='Campus Life'>Campus Life</option>
                  <option value='Environment'>Environment</option>
                </select>
              </div>

              <div className='col-md-2 d-flex gap-2'>
                <button className='btn btn-dark w-100' onClick={() => fetchProblems(1)}>
                  Filter
                </button>
              </div>
            </div>

            {meta && (
              <div className='mt-2 text-muted' style={{ fontSize: 13 }}>
                Total: <strong>{meta.total}</strong>
              </div>
            )}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className='text-center py-5'>Loading...</div>
        ) : items.length === 0 ? (
          <div className='text-center py-5 text-muted'>No problems found.</div>
        ) : (
          <div className='row g-3'>
            {items.map((p) => (
              <div className='col-md-6' key={p.id}>
                <div className='card h-100'>
                  <div className='card-body'>
                    <div className='d-flex justify-content-between align-items-center'>
                      <span className='badge bg-secondary'>{p.category || 'General'}</span>

                      <span
                        className={`badge ${
                          p.status === 'open'
                            ? 'bg-success'
                            : p.status === 'building'
                            ? 'bg-warning text-dark'
                            : 'bg-dark'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>

                    <h5 className='mt-2'>{p.title}</h5>
                    <p className='text-muted' style={{ minHeight: 48 }}>
                      {String(p.description || '').slice(0, 120)}
                      {String(p.description || '').length > 120 ? '...' : ''}
                    </p>

                    <div className='d-flex justify-content-between align-items-center'>
                      <small className='text-muted'>Posted by: {p.user?.name || 'Unknown'}</small>

                      <Link to={`/account/innovation/problem/${p.id}`} className='btn btn-outline-primary btn-sm'>
                        View →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className='d-flex justify-content-center gap-2 mt-4'>
            <button
              className='btn btn-outline-secondary'
              disabled={meta.current_page <= 1}
              onClick={() => fetchProblems(meta.current_page - 1)}
            >
              Prev
            </button>

            <div className='align-self-center'>
              Page {meta.current_page} of {meta.last_page}
            </div>

            <button
              className='btn btn-outline-secondary'
              disabled={meta.current_page >= meta.last_page}
              onClick={() => fetchProblems(meta.current_page + 1)}
            >
              Next
            </button>
          </div>
        )}

        {/* Modal/Form */}
        {showForm && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: 16,
            }}
            onClick={() => setShowForm(false)}
          >
            <div
              className='card'
              style={{ width: 720, maxWidth: '100%' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className='card-body'>
                <div className='d-flex justify-content-between align-items-center mb-2'>
                  <h5 className='mb-0'>Post a Problem</h5>
                  <button className='btn btn-sm btn-outline-secondary' onClick={() => setShowForm(false)}>
                    ✕
                  </button>
                </div>

                <form onSubmit={submitProblem}>
                  <div className='mb-2'>
                    <label className='form-label'>Title</label>
                    <input
                      className='form-control'
                      value={form.title}
                      onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                      placeholder='Example: Manual attendance wastes class time'
                    />
                  </div>

                  <div className='mb-2'>
                    <label className='form-label'>Category</label>
                    <input
                      className='form-control'
                      value={form.category}
                      onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                      placeholder='Example: AI / Automation'
                    />
                  </div>

                  <div className='mb-3'>
                    <label className='form-label'>Description</label>
                    <textarea
                      className='form-control'
                      rows={5}
                      value={form.description}
                      onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                      placeholder='Explain the problem in detail...'
                    />
                  </div>

                  <button className='btn btn-primary' disabled={submitting}>
                    {submitting ? 'Posting...' : 'Post Problem'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default ProblemHub