import React, { useEffect, useState } from 'react'
import { apiUrl } from './Config'

const css = `
.home-stats-wrapper {
  margin-top: -60px;
  margin-bottom: 60px;
}

.home-stats-card {
  background: linear-gradient(135deg, #111827, #1f2937);
  border-radius: 20px;
  padding: 35px 20px;
  color: white;
  box-shadow: 0 20px 50px rgba(0,0,0,0.25);
}

.home-stat-item {
  text-align: center;
  position: relative;
}

.home-stat-item:not(:last-child)::after {
  content: "";
  position: absolute;
  right: 0;
  top: 20%;
  height: 60%;
  width: 1px;
  background: rgba(255,255,255,0.1);
}

.home-stat-number {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 8px;
}

.home-stat-label {
  font-size: 14px;
  opacity: 0.8;
}

.stat-yellow { color: #facc15; }
.stat-green  { color: #22c55e; }
.stat-blue   { color: #3b82f6; }
.stat-purple { color: #a855f7; }

@media (max-width: 768px) {
  .home-stat-item:not(:last-child)::after { display: none; }
}
`

const HomeStats = () => {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetch(`${apiUrl}/home/stats`)
      .then(res => res.json())
      .then(result => {
        if (result.status === 200) {
          setStats(result.data)
        }
      })
  }, [])

  if (!stats) return null

  return (
    <>
      <style>{css}</style>

      <div className="home-stats-wrapper container">
        <div className="home-stats-card row g-4 text-center">

          <div className="col-md-3 home-stat-item">
            <div className="home-stat-number stat-yellow">
              {stats.courses}
            </div>
            <div className="home-stat-label">Available Courses</div>
          </div>

          <div className="col-md-3 home-stat-item">
            <div className="home-stat-number stat-green">
              {stats.learners.toLocaleString()}
            </div>
            <div className="home-stat-label">Total Learners</div>
          </div>

          <div className="col-md-3 home-stat-item">
            <div className="home-stat-number stat-purple">
              {stats.materials.toLocaleString()}
            </div>
            <div className="home-stat-label">Learning Materials</div>
          </div>

          <div className="col-md-3 home-stat-item">
            <div className="home-stat-number stat-blue">
              {stats.instructors}
            </div>
            <div className="home-stat-label">Expert Instructors</div>
          </div>

        </div>
      </div>
    </>
  )
}

export default HomeStats