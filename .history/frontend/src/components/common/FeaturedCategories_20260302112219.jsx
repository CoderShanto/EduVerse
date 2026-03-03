import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { apiUrl, token } from "./Config";

const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${apiUrl}/fetch-categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const result = await res.json();

      if (result?.status === 200) {
        setCategories(result.data || []);
      } else {
        toast.error(result?.message || "Failed to load categories");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while loading categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // show only first 8 categories as "Featured"
  const featured = useMemo(() => categories.slice(0, 8), [categories]);

  return (
    <section className="section-2 py-4">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-2 py-3 mt-3">
          <div>
            <h2 className="h3 mb-1">Explore Categories</h2>
            <p className="text-muted mb-0">
              Discover categories designed to help you grow your skills.
            </p>
          </div>

          <Link to="/categories" className="btn btn-outline-dark btn-sm">
            View all
          </Link>
        </div>

        {/* Grid */}
        <div className="row gy-3">
          {loading
            ? Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="col-6 col-md-4 col-lg-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div
                        className="rounded-circle bg-light mb-3"
                        style={{ width: 44, height: 44 }}
                      />
                      <div className="bg-light rounded" style={{ height: 12, width: "70%" }} />
                      <div className="bg-light rounded mt-2" style={{ height: 10, width: "45%" }} />
                    </div>
                  </div>
                </div>
              ))
            : featured.map((category) => (
                <div key={category.id} className="col-6 col-md-4 col-lg-3">
                  <Link
                    to={`/courses?category=${encodeURIComponent(category.id)}`}
                    className="text-decoration-none"
                  >
                    <div
                      className="card border-0 shadow-sm h-100 category-card"
                      style={{
                        transition: "transform .2s ease, box-shadow .2s ease",
                        borderRadius: 16,
                      }}
                    >
                      <div className="card-body d-flex flex-column gap-2">
                        {/* Icon bubble */}
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle"
                          style={{
                            width: 46,
                            height: 46,
                            background:
                              "linear-gradient(135deg, rgba(0,0,0,.08), rgba(0,0,0,.02))",
                            fontWeight: 700,
                            color: "#111",
                          }}
                        >
                          {(category.name || "?").trim().charAt(0).toUpperCase()}
                        </div>

                        {/* Title */}
                        <div className="d-flex align-items-center justify-content-between gap-2">
                          <h6 className="mb-0 text-dark text-truncate">
                            {category.name}
                          </h6>
                          <span
                            className="badge"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(255,153,0,.18), rgba(255,153,0,.06))",
                              color: "#7a4a00",
                              borderRadius: 999,
                              fontWeight: 600,
                            }}
                          >
                            Explore
                          </span>
                        </div>

                        {/* Sub text */}
                        <p className="text-muted mb-0" style={{ fontSize: 13 }}>
                          Curated learning paths and projects.
                        </p>

                        {/* CTA row */}
                        <div className="mt-auto d-flex align-items-center gap-2">
                          <span className="text-dark" style={{ fontSize: 13, fontWeight: 600 }}>
                            Browse courses
                          </span>
                          <span className="text-muted" aria-hidden>
                            →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
        </div>

        {/* Empty state */}
        {!loading && featured.length === 0 && (
          <div className="text-center py-5 text-muted">
            No categories found.
          </div>
        )}

        {/* Small hover effect (Bootstrap-friendly) */}
        <style>{`
          .category-card:hover{
            transform: translateY(-4px);
            box-shadow: 0 14px 40px rgba(0,0,0,.10) !important;
          }
        `}</style>
      </div>
    </section>
  );
};

export default FeaturedCategories;