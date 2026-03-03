import React, { useContext, useState } from 'react'
import Layout from '../../common/Layout'
import { Link } from 'react-router-dom'
import UserSidebar from '../../common/UserSidebar'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { apiUrl } from '../../common/Config'
import { AuthContext } from '../../context/Auth'

const ChangePassword = () => {
  const { user } = useContext(AuthContext)
  const authToken = user?.token || user?.user?.token

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
  } = useForm()

  const [loading, setLoading] = useState(false)
  const newPassword = watch('new_password')

  const onSubmit = async (data) => {
    setLoading(true)

    // ✅ IMPORTANT: backend expects new_password_confirmation
    const payload = {
      old_password: data.old_password,
      new_password: data.new_password,
      new_password_confirmation: data.new_password_confirmation,
    }

    try {
      const res = await fetch(`${apiUrl}/update-password`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      })

      const result = await res.json()
      setLoading(false)

      if (result.status === 200) {
        toast.success(result.message)
        reset()
      } else {
        const apiErrors = result.errors || {}
        Object.keys(apiErrors).forEach((field) => {
          setError(field, { message: apiErrors[field][0] })
        })

        if (!Object.keys(apiErrors).length) {
          toast.error(result.message || 'Something went wrong')
        }
      }
    } catch (e) {
      console.log(e)
      setLoading(false)
      toast.error('Server error')
    }
  }

  return (
    <Layout>
      <section className="section-4">
        <div className="container pb-5 pt-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/account">Account</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Change Password
              </li>
            </ol>
          </nav>

          <div className="row">
            <div className="col-md-12 mt-5 mb-3">
              <div className="d-flex justify-content-between">
                <h2 className="h4 mb-0 pb-0">Change Password</h2>
              </div>
            </div>

            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>

            <div className="col-lg-9">
              <div className="row">
                <div className="col-md-12">
                  <div className="card p-3 border-0 shadow-lg">
                    <div className="card-body">
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                          <label className="form-label">Old Password</label>
                          <input
                            type="password"
                            {...register('old_password', {
                              required: 'The old password field is required',
                            })}
                            className={`form-control ${errors.old_password ? 'is-invalid' : ''}`}
                            placeholder="Old Password"
                          />
                          {errors.old_password && (
                            <p className="invalid-feedback">{errors.old_password.message}</p>
                          )}
                        </div>

                        <div className="mb-3">
                          <label className="form-label">New Password</label>
                          <input
                            type="password"
                            {...register('new_password', {
                              required: 'The new password field is required',
                              minLength: { value: 5, message: 'Minimum 5 characters' },
                            })}
                            className={`form-control ${errors.new_password ? 'is-invalid' : ''}`}
                            placeholder="New Password"
                          />
                          {errors.new_password && (
                            <p className="invalid-feedback">{errors.new_password.message}</p>
                          )}
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Confirm Password</label>
                          <input
                            type="password"
                            {...register('new_password_confirmation', {
                              required: 'Please confirm your password',
                              validate: (value) =>
                                newPassword === value || 'The passwords do not match',
                            })}
                            className={`form-control ${
                              errors.new_password_confirmation ? 'is-invalid' : ''
                            }`}
                            placeholder="Confirm Password"
                          />
                          {errors.new_password_confirmation && (
                            <p className="invalid-feedback">
                              {errors.new_password_confirmation.message}
                            </p>
                          )}
                        </div>

                        <button disabled={loading} className="btn btn-primary">
                          {loading ? '...Loading' : 'Change Password'}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  )
}

export default ChangePassword