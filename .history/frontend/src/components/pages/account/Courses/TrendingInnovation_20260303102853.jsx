import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { apiUrl, token as configToken } from "./Config";
import { AuthContext } from "../context/Auth";

/**
 * TrendingInnovation
 * - Shows top problems from ProblemHub
 * - Designed to be embedded on Home page
 */
const TrendingInnovation = ({
  title = "🔥 Trending Now",
  subtitle = "Top problems students are working on right now",
  limit = 6,
  category = "all", // optionally pass a category to filter
}) => {
  const { user } = useContext(AuthContext);
  const authToken = useMemo(
    () => user?.token || user?.user?.token || configToken,
    [user]
  );

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const fetchTrending = async () => {
    try {
      setLoading(true);

      const qs = new URLSearchParams();
      qs.set("page", "1");
      qs.set("per_page", String(limit)); // if backend ignores, no harm
      if (category && category !== "all") qs.set("category", category);

      // If your backend supports sorting, keep these.
      // If not, it will still return default list and widget still works.
      qs.set("sort", "trending");

      const res = await fetch(`${apiUrl}/problems?${qs.toString()}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const result = await res.json();

      if (result.status === 200) {
        const arr = result.data?.data || result.data || [];
        setItems(arr.slice(0, limit));
      } else {
        toast.error(result.message || "Failed to load trending problems");
      }
    } catch (e) {
      console.log(e);
      toast.error("Server error loading trending problems");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) fetchTrending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, limit, category]);

  return (
    <div className="card border-0 shadow-lg">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
          <div>
            <h4 className="h5 mb-1">{title}</h4>
            <p className="text-muted mb-0" style={{ fontSize: 13 }}>
              {subtitle}
            </p>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={fetchTrending}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>

            <Link className="btn btn-primary btn-sm" to="/account/innovation/problems">
              View All
            </Link>
          </div>
        </div>

        <hr />

        {loading ? (
          <div className="row g-3">
            {[1, 2, 3, 4, 5, 6].slice(0, limit).map((i) => (
              <div className="col-md-6" key={i}>
                <div className="border rounded-3 p-3">
                  <div className="placeholder-glow">
                    <span className="placeholder col-8"></span>
                    <span className="placeholder col-12"></span>
                    <span className="placeholder col-10"></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-4">
            <div style={{ fontSize: 36, opacity: 0.4 }}>💡</div>
            <p className="text-muted mb-0">No trending problems yet.</p>
          </div>
        ) : (
          <div className="row g-3">
            {items.map((p) => (
              <div className="col-md-6" key={p.id}>
                <div className="border rounded-4 p-3 h-100 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center gap-2">
                    <span className="badge text-bg-light">
                      {p.category || "General"}
                    </span>
                    <span
                      className={`badge ${
                        p.status === "open"
                          ? "text-bg-success"
                          : p.status === "building"
                          ? "text-bg-warning"
                          : "text-bg-secondary"
                      }`}
                      style={{ textTransform: "uppercase" }}
                    >
                      {p.status || "open"}
                    </span>
                  </div>

                  <h6 className="mt-2 mb-1" style={{ fontWeight: 800 }}>
                    {p.title}
                  </h6>

                  <p className="text-muted mb-3" style={{ fontSize: 13 }}>
                    {String(p.description || "").slice(0, 110)}
                    {String(p.description || "").length > 110 ? "…" : ""}
                  </p>

                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      by {p.user?.name || "Unknown"}
                    </small>

                    <Link
                      className="btn btn-outline-primary btn-sm"
                      to={`/account/innovation/problem/${p.id}`}
                    >
                      Join / View →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingInnovation;