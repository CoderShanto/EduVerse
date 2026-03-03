import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/Auth'

import { FaChartBar, FaUserCircle, FaUserLock } from 'react-icons/fa'
import { BsMortarboardFill, BsPatchCheckFill } from 'react-icons/bs'
import { MdLogout } from 'react-icons/md'
import { HiOutlineLightBulb } from 'react-icons/hi'
import { AiOutlineTeam } from 'react-icons/ai'
import { FiAward, FiInbox } from 'react-icons/fi'
import { RiFileList3Line } from 'react-icons/ri'
import { TbTournament } from 'react-icons/tb'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  :root {
    --sb-bg: #ffffff;
    --sb-border: #f0f2f8;
    --sb-blue: #4f6ef7;
    --sb-blue-light: #eef0ff;
    --sb-blue-mid: #dde2ff;
    --sb-purple: #7c5cbf;
    --sb-text: #14142b;
    --sb-muted: #8892a4;
    --sb-danger: #ef4444;
    --sb-danger-light: #fef2f2;
    --sb-section: #a0abc0;
    --sb-hover-bg: #f7f8fc;
    --sb-active-bg: #eef0ff;
    --sb-active-text: #4f6ef7;
    --sb-radius: 12px;
    --sb-font: 'Plus Jakarta Sans', sans-serif;
  }

  .sb-root {
    font-family: var(--sb-font);
    background: var(--sb-bg);
    border-radius: 20px;
    border: 1.5px solid var(--sb-border);
    box-shadow: 0 4px 32px rgba(79,110,247,0.08), 0 1px 4px rgba(20,20,43,0.04);
    overflow: hidden;
    width: 100%;
  }

  /* ── User avatar strip at top ── */
  .sb-header {
    background: linear-gradient(135deg, #4f6ef7 0%, #7c5cbf 100%);
    padding: 22px 20px 18px;
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    overflow: hidden;
  }

  .sb-header::before {
    content: '';
    position: absolute;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    top: -40px;
    right: -20px;
  }
  .sb-header::after {
    content: '';
    position: absolute;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
    bottom: -20px;
    right: 40px;
  }

  .sb-avatar {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: rgba(255,255,255,0.22);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    flex-shrink: 0;
    border: 2px solid rgba(255,255,255,0.35);
    position: relative;
    z-index: 1;
  }

  .sb-user-info {
    position: relative;
    z-index: 1;
    min-width: 0;
  }

  .sb-user-name {
    font-size: 0.9rem;
    font-weight: 700;
    color: #fff;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sb-user-role {
    font-size: 0.7rem;
    font-weight: 500;
    color: rgba(255,255,255,0.7);
    text-transform: uppercase;
    letter-spacing: 0.09em;
    margin-top: 2px;
  }

  .sb-role-badge {
    margin-left: auto;
    background: rgba(255,255,255,0.18);
    border: 1px solid rgba(255,255,255,0.28);
    color: #fff;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 3px 9px;
    border-radius: 100px;
    position: relative;
    z-index: 1;
    white-space: nowrap;
  }

  /* ── Scrollable body ── */
  .sb-body {
    padding: 12px 10px 10px;
    max-height: calc(100vh - 180px);
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #e4e7f4 transparent;
  }

  .sb-body::-webkit-scrollbar { width: 4px; }
  .sb-body::-webkit-scrollbar-track { background: transparent; }
  .sb-body::-webkit-scrollbar-thumb { background: #e4e7f4; border-radius: 4px; }

  /* ── Section label ── */
  .sb-section {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--sb-section);
    padding: 14px 10px 6px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sb-section::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--sb-border);
  }

  /* ── Nav item ── */
  .sb-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: var(--sb-radius);
    text-decoration: none;
    color: var(--sb-text);
    font-size: 0.83rem;
    font-weight: 500;
    transition: background 0.15s, color 0.15s, transform 0.15s;
    margin-bottom: 2px;
    position: relative;
    overflow: hidden;
  }

  .sb-item:hover {
    background: var(--sb-hover-bg);
    color: var(--sb-blue);
    text-decoration: none;
    transform: translateX(2px);
  }

  .sb-item.sb-active {
    background: var(--sb-active-bg);
    color: var(--sb-active-text);
    font-weight: 700;
    text-decoration: none;
  }

  /* left accent bar on active */
  .sb-item.sb-active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 20%;
    bottom: 20%;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: var(--sb-blue);
  }

  .sb-item-icon {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: var(--sb-hover-bg);
    color: var(--sb-muted);
    transition: background 0.15s, color 0.15s;
  }

  .sb-item:hover .sb-item-icon,
  .sb-item.sb-active .sb-item-icon {
    background: var(--sb-blue-mid);
    color: var(--sb-blue);
  }

  .sb-item-label {
    flex: 1;
    line-height: 1;
  }

  /* ── Divider ── */
  .sb-divider {
    height: 1px;
    background: var(--sb-border);
    margin: 8px 4px;
  }

  /* ── Logout ── */
  .sb-logout {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: var(--sb-radius);
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--sb-danger);
    font-family: var(--sb-font);
    font-size: 0.83rem;
    font-weight: 600;
    transition: background 0.15s, transform 0.15s;
    margin-bottom: 2px;
  }

  .sb-logout:hover {
    background: var(--sb-danger-light);
    transform: translateX(2px);
  }

  .sb-logout-icon {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--sb-danger-light);
    color: var(--sb-danger);
    flex-shrink: 0;
    transition: background 0.15s;
  }

  .sb-logout:hover .sb-logout-icon {
    background: #fecaca;
  }

  /* staggered entry animation */
  .sb-item, .sb-logout {
    animation: sbSlideIn 0.3s ease both;
  }

  @keyframes sbSlideIn {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }
`

const UserSidebar = () => {
  const { user, logout } = useContext(AuthContext)
  const location = useLocation()

  const role = user?.user?.role ? String(user.user.role).toLowerCase().trim() : ''
  const userName = user?.user?.name || user?.user?.fullName || 'My Account'

  const dashboardLink =
    role === 'student'     ? '/account/student/dashboard'
    : role === 'instructor' ? '/account/instructor/dashboard'
    : role === 'admin'      ? '/account/admin/analytics'
    : '/account/login'

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + '/')

  const roleLabel =
    role === 'admin' ? 'Admin' :
    role === 'instructor' ? 'Instructor' :
    role === 'student' ? 'Student' : 'User'

  const Item = ({ to, icon, label, delay = 0 }) => (
    <Link
      to={to}
      className={`sb-item${isActive(to) ? ' sb-active' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="sb-item-icon">{icon}</span>
      <span className="sb-item-label">{label}</span>
    </Link>
  )

  const Section = ({ children }) => (
    <div className="sb-section">{children}</div>
  )

  return (
    <>
      <style>{css}</style>
      <div className="sb-root">

        {/* ── User strip ── */}
        <div className="sb-header">
          <div className="sb-avatar">
            <FaUserCircle color="#fff" size={22} />
          </div>
          <div className="sb-user-info">
            <div className="sb-user-name">{userName}</div>
            <div className="sb-user-role">{roleLabel}</div>
          </div>
          <div className="sb-role-badge">{roleLabel}</div>
        </div>

        {/* ── Scrollable nav ── */}
        <div className="sb-body">

          {/* LEARNING */}
          <Section>Learning</Section>

          <Item to={dashboardLink} icon={<FaChartBar size={14} />} label="Dashboard" delay={40} />

          {role === 'student' && <>
            <Item to="/account/student/my-learning"  icon={<BsMortarboardFill size={14} />} label="My Courses"    delay={60} />
            <Item to="/account/certificates"          icon={<BsPatchCheckFill size={14} />}  label="Certificates"  delay={80} />
          </>}

          {role === 'instructor' && <>
            <Item to="/account/my-courses"     icon={<BsMortarboardFill size={14} />} label="My Courses"     delay={60} />
            <Item to="/account/courses/create" icon={<FiInbox size={14} />}           label="Create Course"  delay={80} />
          </>}

          {role === 'admin' && <>
          <Item to="/account/admin/courses"  icon={<RiFileList3Line size={14} />} label="All Courses"   delay={80} />
            <Item to="/account/courses/create" icon={<FiInbox size={14} />}         label="Create Course" delay={60} />
            
            <Item to="/admin/categories"  icon={<RiFileList3Line size={14} />} label="Create Categories"   delay={80} />
          </>}

          {/* INNOVATION (Student only) */}
          {role === 'student' && <>
            <Section>Innovation</Section>
            <Item to="/account/innovation"              icon={<HiOutlineLightBulb size={14} />} label="Problem Hub"  delay={100} />
            <Item to="/account/innovation/my-ideas"     icon={<RiFileList3Line size={14} />}    label="My Ideas"     delay={120} />
            <Item to="/account/innovation/my-teams"     icon={<AiOutlineTeam size={14} />}      label="My Teams"     delay={140} />
            <Item to="/account/innovation/showcase"     icon={<FiAward size={14} />}            label="Showcase"     delay={160} />
            <Item to="/account/innovation/leaderboard"  icon={<TbTournament size={14} />}       label="Leaderboard"  delay={180} />
          </>}

          {/* PORTFOLIO (Student only) */}
          {role === 'student' && <>
            <Section>Portfolio</Section>
            <Item to="/account/portfolio" icon={<FaUserCircle size={14} />} label="Portfolio" delay={200} />
          </>}

          {/* ACCOUNT */}
          <Section>Account</Section>
          <Item to="/account/profile"         icon={<FaUserCircle size={14} />} label="Profile"          delay={220} />
          <Item to="/account/change-password" icon={<FaUserLock size={14} />}   label="Change Password"  delay={240} />

          <div className="sb-divider" />

          <button
            type="button"
            className="sb-logout"
            onClick={logout}
            style={{ animationDelay: '260ms' }}
          >
            <span className="sb-logout-icon"><MdLogout size={15} /></span>
            Logout
          </button>

        </div>
      </div>
    </>
  )
}

export default UserSidebar