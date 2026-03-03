import React, { useContext } from 'react'
import { FaChartBar, FaDesktop, FaUserLock } from 'react-icons/fa'
import { BsMortarboardFill } from 'react-icons/bs'
import { MdLogout } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/Auth'
import { FaUserCircle } from "react-icons/fa";
import { BsPatchCheckFill } from "react-icons/bs"

const UserSidebar = () => {
  const { user, logout } = useContext(AuthContext);

  const role = user?.user?.role; // ✅ student / instructor / admin

  // ✅ role dashboard link
  const dashboardLink =
    role === "student"
      ? "/account/student/dashboard"
      : role === "instructor"
      ? "/account/instructor/dashboard"
      : role === "admin"
      ? "/account/admin/dashboard"
      : "/account/login";

  return (
    <div className='card border-0 shadow-lg'>
      <div className='card-body p-4'>
        <ul>

          {/* Dashboard (everyone) */}
          <li className='d-flex align-items-center'>
            <Link to={dashboardLink}>
              <FaChartBar size={16} className='me-2' /> Dashboard
            </Link>
          </li>

          {/* Profile (everyone) */}
          <li className='d-flex align-items-center'>
            <Link to="/account/profile">
              <FaUserCircle size={16} className='me-2' /> Profile
            </Link>
          </li>

          {/* STUDENT links */}
          {role === "student" && (
            <>
              <li className='d-flex align-items-center'>
                <Link to="/account/student/my-learning">
                  <BsMortarboardFill size={16} className='me-2' /> My Learning
                </Link>
              </li>
            </>
          )}
        {role === "student" && (
  <li className='d-flex align-items-center'>
    <Link to="/account/student/my-learning">
      <BsPatchCheckFill size={16} className='me-2' />
      Certificates
    </Link>
  </li>
)}

          {/* INSTRUCTOR links */}
          {(role === "instructor" || role === "admin") && (
            <>
              <li className='d-flex align-items-center'>
                <Link to="/account/my-courses">
                  <FaDesktop size={16} className='me-2' /> My Courses
                </Link>
              </li>
            </>
          )}

               {/* Admin links */}
           {(role === "admin" || role === "instructor") && (
            <>
              <li className='d-flex align-items-center'>
                <Link to="/account/courses/create">
                  <BsMortarboardFill size={16} className='me-2' /> Create Course
                </Link>
              </li>
            </>
          )}

            {/* Admin links */}
           {(role === "admin") && (
            <>
              <li className='d-flex align-items-center'>
                <Link to="/courses">
                  <BsMortarboardFill size={16} className='me-2' /> All Courses
                </Link>
              </li>
            </>
          )}

          {/* Change password (everyone) */}
          <li className='d-flex align-items-center'>
            <Link to="/account/change-password">
              <FaUserLock size={16} className='me-2' /> Change Password
            </Link>
          </li>

          {/* Logout */}
          <li>
            <button
              type="button"
              onClick={logout}
              className="btn btn-link p-0 text-danger text-decoration-none"
            >
              <MdLogout size={16} className='me-2' /> Logout
            </button>
          </li>

        </ul>
      </div>
    </div>
  )
}

export default UserSidebar