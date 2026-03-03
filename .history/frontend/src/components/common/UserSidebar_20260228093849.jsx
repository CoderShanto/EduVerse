import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/Auth'

import { FaChartBar, FaUserCircle, FaUserLock } from 'react-icons/fa'
import { BsMortarboardFill, BsPatchCheckFill } from 'react-icons/bs'
import { MdLogout } from 'react-icons/md'
import { HiOutlineLightBulb } from 'react-icons/hi'
import { AiOutlineTeam } from 'react-icons/ai'
import { FiAward, FiSettings, FiInbox } from 'react-icons/fi'
import { RiFileList3Line } from 'react-icons/ri'
import { TbTournament } from 'react-icons/tb'
import { LuBadgeCheck } from 'react-icons/lu'
import { BiMessageSquareDetail } from 'react-icons/bi'

const UserSidebar = () => {
  const { user, logout } = useContext(AuthContext)
  const location = useLocation()

  // ✅ role: student / instructor / admin / mentor (if you use)
  const role = user?.user?.role ? String(user.user.role).toLowerCase().trim() : ''

  // ✅ role dashboard link
  const dashboardLink =
    role === 'student'
      ? '/account/student/dashboard'
      : role === 'instructor'
      ? '/account/instructor/dashboard'
      : role === 'admin'
      ? '/account/admin/dashboard'
      : '/account/login'

  const isMentorRole = role === 'admin' || role === 'instructor' || role === 'mentor'

  // ✅ Active link helper (supports nested routes)
  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + '/')

  const Item = ({ to, icon, label }) => (
    <li className='d-flex align-items-center mb-1'>
      <Link
        to={to}
        className={`w-100 d-flex align-items-center px-2 py-2 rounded ${
          isActive(to) ? 'bg-light fw-bold' : ''
        }`}
        style={{ textDecoration: 'none' }}
      >
        <span className='me-2' style={{ width: 18, display: 'inline-flex', justifyContent: 'center' }}>
          {icon}
        </span>
        <span>{label}</span>
      </Link>
    </li>
  )

  const SectionTitle = ({ children }) => (
    <li className='mt-3 mb-2 text-uppercase fw-bold' style={{ fontSize: 12, letterSpacing: '0.06em', color: '#8a8a8a' }}>
      {children}
    </li>
  )

  return (
    <div className='card border-0 shadow-lg'>
      <div className='card-body p-4'>
        <ul className='list-unstyled mb-0'>

          {/* ─────────────────────────
              LEARNING
          ───────────────────────── */}
          <SectionTitle>Learning</SectionTitle>

          <Item
            to={dashboardLink}
            icon={<FaChartBar size={16} />}
            label='Dashboard'
          />

          {/* Student learning links */}
          {role === 'student' && (
            <>
              <Item
                to='/account/student/my-learning'
                icon={<BsMortarboardFill size={16} />}
                label='My Courses'
              />

              <Item
                to='/account/certificates'
                icon={<BsPatchCheckFill size={16} />}
                label='Certificates'
              />

              
            </>
          )}

          {/* Instructor/Admin learning links (keep your existing routes) */}
          {(role === 'instructor' || role === 'admin') && (
            <>
              <Item
                to='/account/my-courses'
                icon={<BsMortarboardFill size={16} />}
                label='My Courses'
              />

              <Item
                to='/account/courses/create'
                icon={<FiInbox size={16} />}
                label='Create Course'
              />

              {role === 'admin' && (
                <Item
                  to='/courses'
                  icon={<RiFileList3Line size={16} />}
                  label='All Courses'
                />
              )}
            </>
          )}

          {/* ─────────────────────────
              INNOVATION (Student)
          ───────────────────────── */}
          {role === 'student' && (
            <>
              <SectionTitle>Innovation</SectionTitle>

              <Item 
                to='/account/innovation'
                icon={<HiOutlineLightBulb size={16} />}
                label='Problem Hub'
              />

              <Item
                to='/account/innovation/my-ideas'
                icon={<RiFileList3Line size={16} />}
                label='My Ideas'
              />

              <Item
                to='/account/innovation/my-teams'
                icon={<AiOutlineTeam size={16} />}
                label='My Teams'
              />

              <Item
                to='/account/innovation/showcase'
                icon={<FiAward size={16} />}
                label='Showcase'
              />

              {/* Optional */}
              <Item
                to='/account/innovation/leaderboard'
                icon={<TbTournament size={16} />}
                label='Leaderboard'
              />
            </>
          )}

          {/* ─────────────────────────
              PROFILE (Student)
          ───────────────────────── */}
          {role === 'student' && (
            <>
              <SectionTitle>Profile</SectionTitle>

              <Item
                to='/account/portfolio'
                icon={<FaUserCircle size={16} />}
                label='Portfolio'
              />

             
            </>
          )}

          {/* ─────────────────────────
              MENTOR TOOLS (role only)
          ───────────────────────── */}
          {isMentorRole && (
            <>
              <SectionTitle>Mentor Tools</SectionTitle>

              <Item
                to='/innovation/review'
                icon={<FiInbox size={16} />}
                label='Review Queue'
              />

              <Item
                to='/innovation/feedback'
                icon={<BiMessageSquareDetail size={16} />}
                label='Feedback Panel'
              />
            </>
          )}

          {/* ─────────────────────────
              ACCOUNT (Everyone)
          ───────────────────────── */}
          <SectionTitle>Account</SectionTitle>

          <Item
            to='/account/profile'
            icon={<FaUserCircle size={16} />}
            label='Profile'
          />

          <Item
            to='/account/change-password'
            icon={<FaUserLock size={16} />}
            label='Change Password'
          />

          <li className='mt-2'>
            <button
              type='button'
              onClick={logout}
              className='btn btn-link p-0 text-danger text-decoration-none d-flex align-items-center'
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