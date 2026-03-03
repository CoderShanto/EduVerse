import React, { useContext, useEffect, useMemo, useState } from "react"
import Layout from "../../../common/Layout"
import UserSidebar from "../../common/UserSidebar"
import toast from "react-hot-toast"
import { apiUrl } from "../../common/Config"
import { AuthContext } from "../../context/Auth"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js"

import { Line, Bar, Doughnut } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend)

const AdminAnalytics = () => {
  const { user } = useContext(AuthContext)
  const authToken = user?.token || user?.user?.token

  const [loading, setLoading] = useState(true)

  const [overview, setOverview] = useState(null)
  const [enrollTrend, setEnrollTrend] = useState(null)
  const [revenueTrend, setRevenueTrend] = useState(null)
  const [topCourses, setTopCourses] = useState([])
  const [innovation, setInnovation] = useState(null)

  const fetchJSON = async (url) => {
    const res = await fetch(url, {
      headers: { Accept: "application/json", Authorization: `Bearer ${authToken}` }
    })
    return await res.json()
  }

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)

        const [a, b, c, d, e] = await Promise.all([
          fetchJSON(`${apiUrl}/admin/analytics/overview`),
          fetchJSON(`${apiUrl}/admin/analytics/enrollments-trend?days=30`),
          fetchJSON(`${apiUrl}/admin/analytics/revenue-trend?days=30`),
          fetchJSON(`${apiUrl}/admin/analytics/top-courses?limit=6`),
          fetchJSON(`${apiUrl}/admin/analytics/innovation`)
        ])

        if (a.status !== 200) return toast.error(a.message || "Failed overview")
        if (b.status !== 200) return toast.error(b.message || "Failed enroll trend")
        if (c.status !== 200) return toast.error(c.message || "Failed revenue trend")
        if (d.status !== 200) return toast.error(d.message || "Failed top courses")
        if (e.status !== 200) return toast.error(e.message || "Failed innovation")

        setOverview(a.data)
        setEnrollTrend(b.data)
        setRevenueTrend(c.data)
        setTopCourses(d.data || [])
        setInnovation(e.data)
      } catch (err) {
        console.log(err)
        toast.error("Server error loading analytics")
      } finally {
        setLoading(false)
      }
    }

    if (authToken) load()
  }, [authToken])

  const cards = useMemo(() => {
    if (!overview) return []
    return [
      { label: "Students", value: overview.students, icon: "👨‍🎓" },
      { label: "Enrollments", value: overview.enrollments, icon: "🧾" },
      { label: "Estimated Revenue", value: `৳ ${Number(overview.estimated_revenue || 0).toLocaleString()}`, icon: "💰" },
      { label: "Active Courses", value: overview.active_courses, icon: "📚" },
    ]
  }, [overview])

  const enrollLineData = useMemo(() => {
    if (!enrollTrend) return null
    return {
      labels: enrollTrend.labels,
      datasets: [{ label: "Enrollments", data: enrollTrend.values, tension: 0.35 }]
    }
  }, [enrollTrend])

  const revenueLineData = useMemo(() => {
    if (!revenueTrend) return null
    return {
      labels: revenueTrend.labels,
      datasets: [{ label: "Revenue (Estimated)", data: revenueTrend.values, tension: 0.35 }]
    }
  }, [revenueTrend])

  const topCourseBarData = useMemo(() => {
    const labels = topCourses.map((x) => x.title)
    const values = topCourses.map((x) => Number(x.enrollments || 0))
    return {
      labels,
      datasets: [{ label: "Enrollments", data: values }]
    }
  }, [topCourses])

  const innovationFunnel = useMemo(() => {
    if (!innovation) return null
    return {
      labels: ["Problems", "Ideas", "Selected", "Showcases"],
      datasets: [
        {
          label: "Innovation Funnel",
          data: [innovation.problems, innovation.ideas, innovation.selected_ideas, innovation.showcases]
        }
      ]
    }
  }, [innovation])

  const innovationPie = useMemo(() => {
    if (!innovation) return null
    return {
      labels: ["Votes", "Updates", "Showcases"],
      datasets: [
        {
          label: "Innovation Activity",
          data: [innovation.votes, innovation.updates, innovation.showcases]
        }
      ]
    }
  }, [innovation])

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
                <h3 className="mb-0">Admin Analytics</h3>
                <small className="text-muted">Business + Learning + Innovation performance.</small>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">Loading analytics...</div>
            ) : (
              <>
                {/* KPI Cards */}
                <div className="row g-3 mb-3">
                  {cards.map((c, idx) => (
                    <div className="col-md-3" key={idx}>
                      <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
                        <div className="card-body">
                          <div style={{ fontSize: 22 }}>{c.icon}</div>
                          <div className="fw-bold" style={{ fontSize: 22 }}>{c.value}</div>
                          <div className="text-muted" style={{ fontSize: 13 }}>{c.label}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Charts Row */}
                <div className="row g-3 mb-3">
                  <div className="col-lg-6">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
                      <div className="card-body">
                        <div className="fw-semibold mb-2">Enrollments (Last 30 Days)</div>
                        {enrollLineData && <Line data={enrollLineData} />}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
                      <div className="card-body">
                        <div className="fw-semibold mb-2">Revenue Trend (Estimated)</div>
                        {revenueLineData && <Line data={revenueLineData} />}
                        <div className="text-muted mt-2" style={{ fontSize: 12 }}>
                          *MVP estimate = sum(course.price) per enrollment. Replace later with real Orders/Payments.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Courses + Innovation */}
                <div className="row g-3">
                  <div className="col-lg-7">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
                      <div className="card-body">
                        <div className="fw-semibold mb-2">Top Courses</div>
                        <Bar data={topCourseBarData} />
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-5">
                    <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 16 }}>
                      <div className="card-body">
                        <div className="fw-semibold mb-2">Innovation Funnel</div>
                        {innovationFunnel && <Bar data={innovationFunnel} />}
                      </div>
                    </div>

                    <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
                      <div className="card-body">
                        <div className="fw-semibold mb-2">Innovation Activity</div>
                        {innovationPie && <Doughnut data={innovationPie} />}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminAnalytics