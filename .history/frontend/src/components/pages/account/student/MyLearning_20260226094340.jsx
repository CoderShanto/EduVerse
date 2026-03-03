import React, { useContext, useEffect, useState } from 'react'
import UserSidebar from '../../../common/UserSidebar'
import Layout from '../../../common/Layout'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../../context/Auth'
import { apiUrl } from '../../../common/Config'

// Icons
const IconSearch = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const IconPlay = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>

const MyLearning = () => {
    const { user } = useContext(AuthContext)
    const [enrollments, setEnrollments] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState('all') // all, active, completed

    const fetchEnrollments = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${apiUrl}/enrollments`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${user?.token}`,
                },
            })
            const result = await res.json()
            if (result.status === 200) {
                setEnrollments(result.data)
            } else {
                setEnrollments([])
            }
        } catch (error) {
            console.error("Failed to fetch enrollments", error)
            setEnrollments([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user?.token) fetchEnrollments()
    }, [user])

    // Filter Logic
    const filteredCourses = enrollments.filter(course => {
        const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase())
        const isCompleted = course.progress >= 100
        const matchesFilter = 
            filterType === 'all' ? true :
            filterType === 'completed' ? isCompleted :
            !isCompleted // active
        
        return matchesSearch && matchesFilter
    })

    // Skeleton Loader
    const SkeletonCard = () => (
        <div className='col-md-6 col-lg-4 mb-4'>
            <div className='card border-0 shadow-sm h-100'>
                <div style={{height: '160px', background: '#eee'}}></div>
                <div className='card-body'>
                    <div style={{width: '80%', height: '20px', background: '#eee', marginBottom: '10px', borderRadius: '4px'}}></div>
                    <div style={{width: '50%', height: '14px', background: '#eee', marginBottom: '20px', borderRadius: '4px'}}></div>
                    <div style={{width: '100%', height: '6px', background: '#eee', borderRadius: '4px'}}></div>
                </div>
            </div>
        </div>
    )

    return (
        <Layout>
            <section className='section-4 bg-light'>
                <div className='container py-5'>
                    
                    {/* Header & Search */}
                    <div className='row mb-4 align-items-center'>
                        <div className='col-md-6'>
                            <h2 className='h3 fw-bold text-dark mb-0'>My Learning</h2>
                            <p className='text-muted mb-0'>Manage and track your course progress</p>
                        </div>
                        <div className='col-md-6 mt-3 mt-md-0'>
                            <div className='input-group'>
                                <span className='input-group-text bg-white border-end-0'>
                                    <IconSearch />
                                </span>
                                <input 
                                    type='text' 
                                    className='form-control border-start-0 ps-0' 
                                    placeholder='Search your courses...' 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
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

                        {/* Content */}
                        <div className='col-lg-9'>
                            
                            {/* Filter Tabs */}
                            <div className='d-flex gap-2 mb-4 overflow-auto pb-2'>
                                <button 
                                    className={`btn btn-sm px-4 rounded-pill ${filterType === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    onClick={() => setFilterType('all')}
                                >
                                    All Courses
                                </button>
                                <button 
                                    className={`btn btn-sm px-4 rounded-pill ${filterType === 'active' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    onClick={() => setFilterType('active')}
                                >
                                    In Progress
                                </button>
                                <button 
                                    className={`btn btn-sm px-4 rounded-pill ${filterType === 'completed' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    onClick={() => setFilterType('completed')}
                                >
                                    Completed
                                </button>
                            </div>

                            {/* Course Grid */}
                            {loading ? (
                                <div className='row'>
                                    <SkeletonCard />
                                    <SkeletonCard />
                                    <SkeletonCard />
                                </div>
                            ) : filteredCourses.length > 0 ? (
                                <div className='row gy-4'>
                                    {filteredCourses.map((enrollment) => (
                                        <div className='col-md-6 col-lg-4' key={enrollment.id}>
                                            <div className='card border-0 shadow-sm h-100 hover-card course-card'>
                                                <div className='position-relative'>
                                                    <img 
                                                        src={enrollment.course_image || 'https://via.placeholder.com/400x250'} 
                                                        className='card-img-top' 
                                                        alt={enrollment.title} 
                                                        style={{height: '180px', objectFit: 'cover'}}
                                                    />
                                                    {enrollment.progress >= 100 && (
                                                        <span className='badge bg-success position-absolute top-0 end-0 m-3'>
                                                            <IconCheck /> Completed
                                                        </span>
                                                    )}
                                                </div>
                                                <div className='card-body d-flex flex-column'>
                                                    <h5 className='card-title fw-bold text-dark mb-2' style={{fontSize: '1.1rem'}}>
                                                        {enrollment.title}
                                                    </h5>
                                                    <p className='card-text text-muted small mb-3'>
                                                        {enrollment.instructor_name || 'Instructor'}
                                                    </p>
                                                    
                                                    <div className='mt-auto'>
                                                        <div className='d-flex justify-content-between mb-1'>
                                                            <small className='text-muted fw-bold'>{enrollment.progress || 0}% Complete</small>
                                                            <small className='text-muted'>{enrollment.lessons_completed || 0}/{enrollment.total_lessons || 0} Lessons</small>
                                                        </div>
                                                        <div className='progress mb-3' style={{height: '6px'}}>
                                                            <div 
                                                                className={`progress-bar ${enrollment.progress >= 100 ? 'bg-success' : 'bg-primary'}`} 
                                                                role='progressbar' 
                                                                style={{width: `${enrollment.progress || 0}%`}}
                                                            ></div>
                                                        </div>
                                                        
                                                        <Link 
                                                            to={`/courses/detail/${enrollment.course_slug || enrollment.id}/learn`} 
                                                            className='btn btn-outline-primary w-100 btn-sm d-flex align-items-center justify-content-center gap-2'
                                                        >
                                                            {enrollment.progress > 0 && enrollment.progress < 100 ? (
                                                                <><IconPlay /> Continue Learning</>
                                                            ) : enrollment.progress >= 100 ? (
                                                                <><IconCheck /> Review Course</>
                                                            ) : (
                                                                <><IconPlay /> Start Course</>
                                                            )}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                /* Empty State */
                                <div className='text-center py-5 bg-white rounded shadow-sm'>
                                    <div className='mb-3 text-muted'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                                    </div>
                                    <h4 className='fw-bold text-dark'>No courses found</h4>
                                    <p className='text-muted mb-4'>
                                        {searchTerm ? `No results for "${searchTerm}"` : "You haven't enrolled in any courses yet."}
                                    </p>
                                    <Link to='/courses' className='btn btn-primary px-4'>Browse All Courses</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Custom Styles */}
            <style>{`
                .hover-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .hover-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
                }
                .course-card .card-img-top {
                    border-top-left-radius: 0.375rem;
                    border-top-right-radius: 0.375rem;
                }
                .section-4 {
                    min-height: 100vh;
                }
            `}</style>
        </Layout>
    )
}

export default MyLearning