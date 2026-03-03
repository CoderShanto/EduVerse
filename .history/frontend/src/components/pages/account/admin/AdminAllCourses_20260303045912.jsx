import React, { useEffect, useMemo, useState, useContext } from "react";
import Layout from "../../../common/Layout";
import UserSidebar from "../../../common/UserSidebar";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { apiUrl } from "../../../common/Config";
import { AuthContext } from "../../../context/Auth";

const css = `
  .aac-card { border-radius: 16px; overflow: hidden; }
  .aac-toolbar { border-radius: 16px; }
  .aac-table thead th {
    font-size: 12px; letter-spacing: .06em; text-transform: uppercase;
    color: #6b7280; border-bottom: 1px solid #eef0f3 !important;
    background: #fbfbfc;
  }
  .aac-table tbody td { border-bottom: 1px solid #f0f2f6 !important; vertical-align: middle; }
  .aac-row:hover td { background: #fafafa; }
  .aac-pill {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 7px 12px; border-radius: 999px;
    border: 1px solid transparent; font-weight: 700; font-size: 12px;
    cursor: pointer; transition: transform .08s ease, box-shadow .12s ease, background .12s ease, border-color .12s ease;
    user-select: none; line-height: 1;
  }
  .aac-pill:active { transform: scale(.98); }
  .aac-pill.edit { background: #eef6ff; border-color: #cfe4ff; color: #1d4ed8; }
  .aac-pill.edit:hover { background: #deefff; box-shadow: 0 6px 18px rgba(29,78,216,.10); }
  .aac-pill.delete { background: #fff1f2; border-color: #fecdd3; color: #be123c; }
  .aac-pill.delete:hover { background: #ffe4e6; box-shadow: 0 6px 18px rgba(190,18,60,.10); }
  .aac-pill:disabled { opacity: .65; cursor: not-allowed; }
  .aac-actions { display: flex; justify-content: flex-end; gap: 10px; flex-wrap: wrap; }
  .aac-cover {
    width: 56px; height: 44px; border-radius: 12px; background: #f3f4f6;
    overflow: hidden; display: flex; align-items: center; justify-content: center;
  }
  .aac-cover img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .aac-title { font-weight: 800; font-size: 14px; color: #111827; }
  .aac-sub { font-size: 12px; color: #6b7280; }
  .aac-badge { border-radius: 999px; padding: 6px 10px; font-size: 12px; font-weight: 800; }
`;

const AdminAllCourses = () => {
  const { user } = useContext(AuthContext);
  const authToken = user?.token || user?.user?.token;

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("desc");
  const [deletingId, setDeletingId] = useState(null);

  // ✅ IMPORTANT: Use ADMIN endpoint (NOT public fetch-courses)
  const fetchCourses = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${apiUrl}/admin/courses`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const result = await res.json();

      if (result?.status === 200) {
        setCourses(result.data || []);
      } else {
        toast.error(result?.message || "Failed to load courses");
        setCourses([]);
      }
    } catch (e) {
      console.log(e);
      toast.error("Server error loading courses");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line
  }, []);

  const filtered = useMemo(() => {
    let list = [...courses];

    // client-side search
    const k = keyword.trim().toLowerCase();
    if (k) {
      list = list.filter((c) => String(c.title || "").toLowerCase().includes(k));
    }

    // client-side sort by created_at
    list.sort((a, b) => {
      const da = new Date(a.created_at || 0).getTime();
      const db = new Date(b.created_at || 0).getTime();
      return sort === "desc" ? db - da : da - db;
    });

    return list;
  }, [courses, keyword, sort]);

  const deleteCourse = async (courseId) => {
    if (!window.confirm("Delete this course? This cannot be undone.")) return;

    try {
      setDeletingId(courseId);

      const res = await fetch(`${apiUrl}/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      let result = null;
      try {
        result = await res.json();
      } catch {
        result = { status: res.ok ? 200 : 400 };
      }

      if (res.ok && (result?.status === 200 || result?.status === 204 || result?.status === undefined)) {
        toast.success("Course deleted");
        setCourses((prev) => prev.filter((c) => c.id !== courseId));
      } else {
        toast.error(result?.message || "Delete failed (check your API route)");
      }
    } catch (e) {
      console.log(e);
      toast.error("Server error deleting course");
    } finally {
      setDeletingId(null);
    }
  };

  const statusBadge = (c) => {
    const isActive = Number(c.status) === 1;
    return (
      <span className={`aac-badge badge ${isActive ? "bg-success" : "bg-secondary"}`}>
        {isActive ? "Published" : "Unpublished"}
      </span>
    );
  };

  const featuredBadge = (c) => {
    const featured = Number(c.is_featured) === 1;
    return (
      <span className={`aac-badge badge ${featured ? "bg-warning text-dark" : "bg-light text-dark"}`}>
        {featured ? "Featured" : "No"}
      </span>
    );
  };

  return (
    <Layout>
      <style>{css}</style>

      <div className="container my-4">
        <div className="row">
          <div className="col-lg-3 account-sidebar mb-4">
            <UserSidebar />
          </div>

          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
              <div>
                <h3 className="mb-0">Admin • All Courses</h3>
                <small className="text-muted">Manage every course (published + unpublished).</small>
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-secondary" onClick={fetchCourses} disabled={loading}>
                  {loading ? "Loading..." : "Refresh"}
                </button>

                <Link className="btn btn-sm btn-primary" to="/account/courses/create">
                  + Create Course
                </Link>
              </div>
            </div>

            {/* Toolbar */}
            <div className="card border-0 shadow-sm mb-3 aac-toolbar">
              <div className="card-body d-flex align-items-center gap-2 flex-wrap">
                <div style={{ flex: 1, minWidth: 220 }}>
                  <input
                    className="form-control"
                    placeholder="Search by course title..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>

                <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)} style={{ maxWidth: 180 }}>
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="card border-0 shadow-sm aac-card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="text-muted" style={{ fontSize: 13 }}>
                    Showing <b>{filtered.length}</b> course(s)
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-5">Loading courses…</div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-5">
                    <h5 className="mb-1">No courses found</h5>
                    <div className="text-muted">Try another keyword.</div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table aac-table align-middle mb-0">
                      <thead>
                        <tr>
                          <th style={{ width: 80 }}>Cover</th>
                          <th>Course</th>
                          <th style={{ width: 120 }}>Price</th>
                          <th style={{ width: 150 }}>Status</th>
                          <th style={{ width: 140 }}>Featured</th>
                          <th style={{ width: 160 }}>Created</th>
                          <th style={{ width: 210 }} className="text-end">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((c) => {
                          const img = c.course_small_image || c.image_url || c.image || "";
                          const createdAt = c.created_at ? new Date(c.created_at).toLocaleString() : "—";

                          return (
                            <tr key={c.id} className="aac-row">
                              <td>
                                <div className="aac-cover">
                                  {img ? <img src={img} alt="" /> : <span style={{ fontSize: 18 }}>📘</span>}
                                </div>
                              </td>

                              <td style={{ minWidth: 260 }}>
                                <div className="aac-title">{c.title || "Untitled"}</div>
                                <div className="aac-sub">
                                  ID: {c.id} • Category: {c.category?.name || c.category_name || "—"}
                                </div>
                              </td>

                              <td>
                                <div className="fw-bold">{c.price ?? "—"}</div>
                                {c.cross_price ? (
                                  <div className="text-muted" style={{ fontSize: 12, textDecoration: "line-through" }}>
                                    {c.cross_price}
                                  </div>
                                ) : null}
                              </td>

                              <td>{statusBadge(c)}</td>
                              <td>{featuredBadge(c)}</td>

                              <td className="text-muted" style={{ fontSize: 13 }}>
                                {createdAt}
                              </td>

                              <td className="text-end">
                                <div className="aac-actions">
                                  <Link to={`/account/courses/edit/${c.id}`} className="aac-pill edit">
                                    ✏️ Edit
                                  </Link>

                                  <button
                                    type="button"
                                    className="aac-pill delete"
                                    onClick={() => deleteCourse(c.id)}
                                    disabled={deletingId === c.id}
                                  >
                                    {deletingId === c.id ? "⏳ Deleting" : "🗑 Delete"}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="text-muted mt-2" style={{ fontSize: 12 }}>
              Admin list should always use <code>/admin/courses</code> so unpublished courses never disappear.
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminAllCourses;