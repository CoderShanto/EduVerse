import React, { useContext, useEffect, useMemo, useState } from "react"
import Layout from "../../common/Layout"
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
  Legend,
  Filler,
} from "chart.js"

import { Line, Bar, Doughnut } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
)

const cardStyle = {
  borderRadius: 16,
}

const chartCardHeader = (title, subtitle) => (
  <div className="d-flex justify-content-between align-items-start mb-2">
    <div>
      <div className="fw-semibold" style={{ fontSize: 15 }}>{title}</div>
      {subtitle ? <div className="text-muted" style={{ fontSize: 12 }}>{subtitle}</div> : null}
    </div>
  </div>
)

// ✅ Chart global options (clean + modern)
const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        usePointStyle: true,
        boxWidth: 8,
        font: { size: 12, weight: "600" },
      },
    },
    tooltip: {
      backgroundColor: "rgba(17, 24, 39, 0.95)", // gray-900
      titleColor: "#fff",
      bodyColor: "#fff",
      padding: 12,
      cornerRadius: 10,
      displayColors: true,
    },
  },
  scales: {
    x: {
      grid: { color: "rgba(0,0,0,0.06)" },
      ticks: { color: "rgba(0,0,0,0.65)", maxRotation: 55, minRotation: 55, font: { size: 11 } },
    },
    y: {
      beginAtZero: true,
      grid: { color: "rgba(0,0,0,0.06)" },
      ticks: { color: "rgba(0,0,0,0.65)", font: { size: 11 } },
    },
  },
}

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
      headers: { Accept: "application/json", Authorization: `Bearer ${authToken}` },
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
          fetchJSON(`${apiUrl}/admin/analytics/innovation`),
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
      { label: "Students", value: overview.students, icon: "👨‍🎓", bg: "linear-gradient(135deg,#dbeafe,#bfdbfe)", border: "#bfdbfe" },
      { label: "Enrollments", value: overview.enrollments, icon: "🧾", bg: "linear-gradient(135deg,#dcfce7,#bbf7d0)", border: "#bbf7d0" },
      { label: "Revenue (Est.)", value: `৳ ${Number(overview.estimated_revenue || 0).toLocaleString()}`, icon: "💰", bg: "linear-gradient(135deg,#ffedd5,#fed7aa)", border: "#fed7aa" },
      { label: "Active Courses", value: overview.active_courses, icon: "📚", bg: "linear-gradient(135deg,#ede9fe,#ddd6fe)", border: "#ddd6fe" },
    ]
  }, [overview])

  // ✅ Pretty Line chart datasets (color + fill)
  const enrollLineData = useMemo(() => {
    if (!enrollTrend) return null
    return {
      labels: enrollTrend.labels,
      datasets: [
        {
          label: "Enrollments",
          data: enrollTrend.values,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.14)",
          fill: true,
          tension: 0.35,
          pointRadius: 2,
          pointHoverRadius: 5,
          borderWidth: 3,
        },
      ],
    }
  }, [enrollTrend])

  const revenueLineData = useMemo(() => {
    if (!revenueTrend) return null
    return {
      labels: revenueTrend.labels,
      datasets: [
        {
          label: "Revenue (Estimated)",
          data: revenueTrend.values,
          borderColor: "#16a34a",
          backgroundColor: "rgba(22, 163, 74, 0.14)",
          fill: true,
          tension: 0.35,
          pointRadius: 2,
          pointHoverRadius: 5,
          borderWidth: 3,
        },
      ],
    }
  }, [revenueTrend])

  const topCourseBarData = useMemo(() => {
    const labels = topCourses.map((x) => x.title)
    const values = topCourses.map((x) => Number(x.enrollments || 0))
    return {
      labels,
      datasets: [
        {
          label: "Enrollments",
          data: values,
          backgroundColor: "rgba(249, 115, 22, 0.6)",
          borderColor: "#f97316",
          borderWidth: 2,
          borderRadius: 10,
        },
      ],
    }
  }, [topCourses])

  const innovationFunnel = useMemo(() => {
    if (!innovation) return null
    return {
      labels: ["Problems", "Ideas", "Selected", "Showcases"],
      datasets: [
        {
          label: "Pipeline",
          data: [innovation.problems, innovation.ideas, innovation.selected_ideas, innovation.showcases],
          backgroundColor: [
            "rgba(59, 130, 246, 0.65)",  // blue
            "rgba(168, 85, 247, 0.65)",  // purple
            "rgba(245, 158, 11, 0.65)",  // amber
            "rgba(34, 197, 94, 0.65)",   // green
          ],
          borderRadius: 10,
        },
      ],
    }
  }, [innovation])

  const innovationPie = useMemo(() => {
    if (!innovation) return null
    return {
      labels: ["Votes", "Updates", "Showcases"],
      datasets: [
        {
          label: "Activity",
          data: [innovation.votes, innovation.updates, innovation.showcases],
          backgroundColor: [
            "rgba(59, 130, 246, 0.65)",
            "rgba(245, 158, 11, 0.65)",
            "rgba(34, 197, 94, 0.65)",
          ],
          borderColor: ["#3b82f6", "#f59e0b", "#22c55e"],
          borderWidth: 2,
        },
      ],
    }
  }, [innovation])

  const doughnutOptions = useMemo(() => ({
    ...baseOptions,
    cutout: "70%",
    plugins: {
      ...baseOptions.plugins,
      legend: { position: "top", labels: baseOptions.plugins.legend.labels },
    },
  }), [])

  const chartHeight = 280

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
                      <div className="card border-0 shadow-sm h-100" style={{ ...cardStyle, overflow: "hidden" }}>
                        <div
                          className="card-body"
                          style={{ background: c.bg, border: `1px solid ${c.border}` }}
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            <div>
                              <div className="text-muted" style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.4 }}>
                                {c.label}
                              </div>
                              <div className="fw-bold" style={{ fontSize: 22 }}>{c.value}</div>
                            </div>
                            <div style={{ fontSize: 26 }}>{c.icon}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Charts Row */}
                <div className="row g-3 mb-3">
                  <div className="col-lg-6">
                    <div className="card border-0 shadow-sm" style={cardStyle}>
                      <div className="card-body">
                        {chartCardHeader("Enrollments", "Last 30 days")}
                        <div style={{ height: chartHeight }}>
                          {enrollLineData && <Line data={enrollLineData} options={baseOptions} />}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="card border-0 shadow-sm" style={cardStyle}>
                      <div className="card-body">
                        {chartCardHeader("Revenue Trend", "Estimated from enrollment × course price")}
                        <div style={{ height: chartHeight }}>
                          {revenueLineData && <Line data={revenueLineData} options={baseOptions} />}
                        </div>
                        <div className="text-muted mt-2" style={{ fontSize: 12 }}>
                          *Replace with real Orders/Payments later.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Courses + Innovation */}
                <div className="row g-3">
                  <div className="col-lg-7">
                    <div className="card border-0 shadow-sm" style={cardStyle}>
                      <div className="card-body">
                        {chartCardHeader("Top Courses", "Most enrolled courses")}
                        <div style={{ height: 330 }}>
                          <Bar data={topCourseBarData} options={baseOptions} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-5">
                    <div className="card border-0 shadow-sm mb-3" style={cardStyle}>
                      <div className="card-body">
                        {chartCardHeader("Innovation Funnel", "Problems → Ideas → Selected → Showcases")}
                        <div style={{ height: 240 }}>
                          {innovationFunnel && <Bar data={innovationFunnel} options={baseOptions} />}
                        </div>
                      </div>
                    </div>

                    <div className="card border-0 shadow-sm" style={cardStyle}>
                      <div className="card-body">
                        {chartCardHeader("Innovation Activity", "Votes vs Updates vs Showcases")}
                        <div style={{ height: 260 }}>
                          {innovationPie && <Doughnut data={innovationPie} options={doughnutOptions} />}
                        </div>
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