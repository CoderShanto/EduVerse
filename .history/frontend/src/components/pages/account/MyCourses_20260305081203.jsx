import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import UserSidebar from '../../common/UserSidebar'
import EditCourse from '../../common/EditCourse'
import Layout from '../../common/Layout'
import { apiUrl, token } from '../../common/Config'
import toast from 'react-hot-toast'

const MyCourses = () => {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)

    // ✅ Fixed: Pure async/await with proper error handling
    const fetchCourses = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${apiUrl}/my-courses`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            
            const result = await response.json()
            
            if (result.status === 200) {
                setCourses(result.courses || [])
            } else {
                toast.error(result.message || "Failed to load courses")
                console.error("Fetch error:", result)
            }
        } catch (error) {
            console.error("Network error:", error)
            toast.error("Unable to connect to server")
        } finally {
            setLoading(false)
        }
    }

    // ✅ Fixed: Proper async delete with optimistic update + rollback on failure
    const deleteCourse = async (id) => {
        if (!confirm("Are you sure you want to delete this course?")) return

        // Optimistic UI update
        const originalCourses = [...courses]
        const newCourses = courses.filter(course => course.id !== id)
        setCourses(newCourses)

        try {
            const response = await fetch(`${apiUrl}/courses/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            const result = await response.json()

            if (result.status === 200) {
                toast.success("Course deleted successfully")
                // Already updated optimistically, no need to re-fetch
            } else {
                // ❌ Rollback on failure
                setCourses(originalCourses)
                toast.error(result.message || "Failed to delete course")
            }
        } catch (error) {
            // ❌ Rollback on network error
            setCourses(originalCourses)
            console.error("Delete error:", error)
            toast.error("Network error while deleting")
        }
    }

    // ✅ Fetch on mount
    useEffect(() => {
        fetchCourses()
    }, [])

    return (
        <Layout>
            <section className='section-4'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <h2 className='h4 mb-0 pb-0'>My Courses</h2>
                                <div className='d-flex gap-2'>
                                    <button 
                                        className='btn btn-outline-secondary'
                                        onClick={fetchCourses}
                                        disabled={loading}
                                    >
                                        {loading ? 'Loading...' : '↻ Refresh'}
                                    </button>
                                    <Link to="/account/courses/create" className='btn btn-primary'>
                                        + Create Course
                                    </Link>
                                </div>
                            </div>
                        </div>
                        
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar/>
                        </div>
                        
                        <div className='col-lg-9'>
                            {/* ✅ Loading State */}
                            {loading && courses.length === 0 ? (
                                <div className='text-center py-5'>
                                    <div className='spinner-border text-primary' role='status'>
                                        <span className='visually-hidden'>Loading...</span>
                                    </div>
                                    <p className='text-muted mt-2 mb-0'>Loading your courses...</p>
                                </div>
                            ) : 
                            /* ✅ Empty State */
                            !loading && courses.length === 0 ? (
                                <div className='text-center py-5 border rounded-3 bg-light'>
                                    <h5 className='mb-2'>No courses yet</h5>
                                    <p className='text-muted mb-3'>Start by creating your first course!</p>
                                    <Link to="/account/courses/create" className='btn btn-primary'>
                                        + Create Course
                                    </Link>
                                </div>
                            ) : 
                            /* ✅ Course Grid */
                            (
                                <div className='row gy-4'>
                                    {courses.map(course => (
                                        <EditCourse 
                                            key={course.id}
                                            course={course}
                                            deleteCourse={deleteCourse}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default MyCourses