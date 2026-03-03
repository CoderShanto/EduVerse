import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../../common/Layout'
import { Link, useParams } from 'react-router-dom'
import UserSidebar from '../../../common/UserSidebar'
import { Rating } from 'react-simple-star-rating'
import { useForm } from 'react-hook-form'
import { apiUrl } from '../../../common/Config'
import toast from 'react-hot-toast'
import { AuthContext } from '../../../context/Auth'

const LeaveRating = () => {
  const { user } = useContext(AuthContext)
  const token = user?.token

  const [rating, setRating] = useState(0)
  const [course, setCourse] = useState(null)
  const params = useParams()

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const handleRating = (rate) => {
    setRating(rate)
  }

  const fetchCourse = async () => {
    try {
      const res = await fetch(`${apiUrl}/fetch-course/${params.id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })

      const result = await res.json()

      if (result.status === 200) {
        setCourse(result.data)
      } else {
        toast.error(result.message || "Course not found")
      }
    } catch (e) {
      toast.error("Failed to load course")
    }
  }

  const onSubmit = async (data) => {
    if (!course?.id) return toast.error("Course not loaded")
    if (!rating) return toast.error("Please select rating stars")

    const payload = {
      course_id: course.id,
      rating: rating,
      comment: data.comment,
    }

    try {
      const res = await fetch(`${apiUrl}/leave-rating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (res.ok && result.status === 200) {
        toast.success(result.message)
        reset()
        setRating(0)
      } else {
        toast.error(result.message || "Something went wrong")
      }
    } catch (e) {
      toast.error("Something went wrong")
    }
  }

  useEffect(() => {
    fetchCourse()
  }, [])

  return (
    <Layout>
      <section className='section-4'>
        <div className='container pb-5 pt-3'>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/account/dashboard">Account</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Leave Rating</li>
            </ol>
          </nav>

          <div className='row'>
            <div className='col-md-12 mt-5 mb-3'>
              <div className='d-flex justify-content-between'>
                <h2 className='h4 mb-0 pb-0'>
                  Leave Rating {course?.title ? `/ ${course.title}` : ''}
                </h2>
              </div>
            </div>

            <div className='col-lg-3 account-sidebar'>
              <UserSidebar />
            </div>

            <div className='col-lg-9'>
              <div className='card p-3 border-0 shadow-lg'>
                <div className='card-body'>
                  <form onSubmit={handleSubmit(onSubmit)}>

                    <div className='mb-3'>
                      <label className='form-label'>Comment</label>
                      <textarea
                        {...register('comment', { required: "Please enter your feedback" })}
                        className={`form-control ${errors.comment ? 'is-invalid' : ''}`}
                        placeholder='What is your personal feedback?'
                      />
                      {errors.comment && <p className='invalid-feedback'>{errors.comment.message}</p>}
                    </div>

                    <div className='mb-3'>
                      <Rating onClick={handleRating} initialValue={rating} />
                    </div>

                    <button className='btn btn-primary'>Submit</button>

                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  )
}

export default LeaveRating