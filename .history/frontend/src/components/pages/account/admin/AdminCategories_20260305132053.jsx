import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiUrl } from "../../../common/Config";
import { AuthContext } from "../../../context/Auth";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .acc-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #f4f5f9;
    min-height: 100vh;
    padding: 32px 28px 60px;
  }

  /* ── Back button ── */
  .acc-back {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 7px 14px;
    cursor: pointer;
    margin-bottom: 24px;
    transition: all .15s;
    text-decoration: none;
  }
  .acc-back:hover {
    background: #f8fafc;
    color: #1e293b;
    border-color: #cbd5e1;
    transform: translateX(-2px);
  }
  .acc-back svg { transition: transform .15s; }
  .acc-back:hover svg { transform: translateX(-3px); }

  /* ── Page header ── */
  .acc-page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 28px;
  }
  .acc-page-title {
    font-size: 26px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.03em;
    margin: 0;
  }
  .acc-page-sub {
    font-size: 13px;
    color: #94a3b8;
    margin-top: 3px;
    font-weight: 500;
  }
  .acc-count-chip {
    background: #e0e7ff;
    color: #4338ca;
    font-size: 12px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 99px;
  }

  /* ── Cards ── */
  .acc-card {
    background: #fff;
    border-radius: 18px;
    border: 1px solid #e8ecf1;
    box-shadow: 0 2px 12px rgba(15,23,42,.05);
    margin-bottom: 20px;
    overflow: hidden;
  }

  .acc-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 24px;
    border-bottom: 1px solid #f1f5f9;
  }
  .acc-card-title {
    font-size: 13px;
    font-weight: 700;
    color: #1e293b;
    letter-spacing: .01em;
  }
  .acc-card-body { padding: 20px 24px; }

  /* ── Search & filter row ── */
  .acc-filter-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
  }
  .acc-filter-row .acc-input { flex: 1; min-width: 200px; }

  /* ── Inputs ── */
  .acc-input,
  .acc-select {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13.5px;
    font-weight: 500;
    color: #1e293b;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 11px;
    padding: 10px 14px;
    outline: none;
    transition: border-color .18s, box-shadow .18s, background .18s;
    width: 100%;
  }
  .acc-input::placeholder { color: #b0bac6; }
  .acc-input:focus,
  .acc-select:focus {
    border-color: #6366f1;
    background: #fff;
    box-shadow: 0 0 0 3.5px rgba(99,102,241,.12);
  }
  .acc-select { cursor: pointer; appearance: none; }
  .acc-field label {
    display: block;
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: .07em;
    text-transform: uppercase;
    color: #94a3b8;
    margin-bottom: 7px;
  }

  /* ── Buttons ── */
  .acc-btn {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13.5px;
    font-weight: 700;
    border-radius: 11px;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    transition: all .17s;
    white-space: nowrap;
  }
  .acc-btn-primary {
    background: #6366f1;
    color: #fff;
    box-shadow: 0 4px 14px rgba(99,102,241,.28);
  }
  .acc-btn-primary:hover {
    background: #4f46e5;
    box-shadow: 0 6px 20px rgba(99,102,241,.38);
    transform: translateY(-1px);
  }
  .acc-btn-ghost {
    background: #f1f5f9;
    color: #475569;
    border: 1.5px solid #e2e8f0;
  }
  .acc-btn-ghost:hover {
    background: #e9eef5;
    color: #1e293b;
  }
  .acc-btn:disabled { opacity: .5; cursor: not-allowed; transform: none !important; }

  /* ── Create form grid ── */
  .acc-create-grid {
    display: grid;
    grid-template-columns: 1fr 180px auto;
    gap: 14px;
    align-items: end;
  }
  @media (max-width: 640px) {
    .acc-create-grid { grid-template-columns: 1fr; }
  }

  /* ── Table ── */
  .acc-table-wrap { overflow-x: auto; }
  .acc-table {
    width: 100%;
    border-collapse: collapse;
  }
  .acc-table thead tr {
    background: #f8fafc;
    border-bottom: 2px solid #f1f5f9;
  }
  .acc-table thead th {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .09em;
    text-transform: uppercase;
    color: #94a3b8;
    padding: 13px 20px;
    text-align: left;
    white-space: nowrap;
  }
  .acc-table thead th.right { text-align: right; }
  .acc-table tbody tr {
    border-bottom: 1px solid #f1f5f9;
    transition: background .12s;
  }
  .acc-table tbody tr:last-child { border-bottom: none; }
  .acc-table tbody tr:hover { background: #fafbff; }
  .acc-table tbody td {
    padding: 15px 20px;
    vertical-align: middle;
  }

  .acc-row-id {
    font-size: 12px;
    font-weight: 700;
    color: #cbd5e1;
    font-variant-numeric: tabular-nums;
  }
  .acc-row-name {
    font-size: 14.5px;
    font-weight: 700;
    color: #1e293b;
    letter-spacing: -.01em;
  }

  /* ── Status badge ── */
  .acc-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: .04em;
    padding: 5px 12px;
    border-radius: 99px;
  }
  .acc-status::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .acc-status-active {
    background: #dcfce7;
    color: #15803d;
  }
  .acc-status-active::before { background: #22c55e; }
  .acc-status-inactive {
    background: #f1f5f9;
    color: #64748b;
  }
  .acc-status-inactive::before { background: #94a3b8; }

  /* ── Action pills ── */
  .acc-actions { display: flex; justify-content: flex-end; gap: 7px; flex-wrap: wrap; }
  .acc-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 13px;
    border-radius: 99px;
    border: 1.5px solid transparent;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all .15s;
    background: none;
    white-space: nowrap;
  }
  .acc-pill:active { transform: scale(.96); }
  .acc-pill-edit   { background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8; }
  .acc-pill-edit:hover   { background: #dbeafe; box-shadow: 0 4px 14px rgba(29,78,216,.12); }
  .acc-pill-toggle { background: #fffbeb; border-color: #fde68a; color: #b45309; }
  .acc-pill-toggle:hover { background: #fef3c7; box-shadow: 0 4px 14px rgba(180,83,9,.10); }
  .acc-pill-delete { background: #fff1f2; border-color: #fecdd3; color: #be123c; }
  .acc-pill-delete:hover { background: #ffe4e6; box-shadow: 0 4px 14px rgba(190,18,60,.12); }
  .acc-pill:disabled { opacity: .5; cursor: not-allowed; }

  /* ── Empty / loading ── */
  .acc-empty {
    text-align: center;
    padding: 60px 20px;
    color: #94a3b8;
  }
  .acc-empty-icon { font-size: 40px; margin-bottom: 12px; }
  .acc-empty-title { font-size: 16px; font-weight: 700; color: #64748b; margin-bottom: 4px; }
  .acc-empty-sub   { font-size: 13px; }

  .acc-loading { text-align: center; padding: 56px 20px; }
  .acc-spinner {
    width: 30px; height: 30px;
    border: 3px solid #e2e8f0;
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: accSpin .7s linear infinite;
    margin: 0 auto 12px;
  }
  @keyframes accSpin { to { transform: rotate(360deg); } }
  .acc-loading-text { font-size: 13px; font-weight: 500; color: #94a3b8; }

  /* ── Pagination ── */
  .acc-pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    padding: 16px 24px;
    border-top: 1px solid #f1f5f9;
    background: #fafbff;
  }
  .acc-page-btn {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 12.5px;
    font-weight: 700;
    background: #fff;
    border: 1.5px solid #e2e8f0;
    color: #475569;
    border-radius: 9px;
    padding: 6px 16px;
    cursor: pointer;
    transition: all .15s;
  }
  .acc-page-btn:hover:not(:disabled) {
    border-color: #6366f1;
    color: #6366f1;
    background: #eef2ff;
  }
  .acc-page-btn:disabled { opacity: .35; cursor: not-allowed; }
  .acc-page-info { font-size: 12.5px; font-weight: 600; color: #94a3b8; }

  /* ── Modal ── */
  .acc-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15,23,42,.5);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1100;
    padding: 20px;
    animation: accFade .18s ease;
  }
  @keyframes accFade { from { opacity: 0; } to { opacity: 1; } }
  .acc-modal {
    background: #fff;
    border-radius: 22px;
    width: 100%;
    max-width: 460px;
    box-shadow: 0 30px 80px rgba(15,23,42,.18);
    overflow: hidden;
    animation: accUp .22s cubic-bezier(.34,1.56,.64,1);
  }
  @keyframes accUp {
    from { opacity: 0; transform: translateY(22px) scale(.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }
  .acc-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 26px 0;
  }
  .acc-modal-title {
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -.02em;
  }
  .acc-modal-close {
    width: 32px; height: 32px;
    background: #f1f5f9;
    border: none;
    border-radius: 9px;
    color: #64748b;
    font-size: 16px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all .15s;
  }
  .acc-modal-close:hover { background: #fee2e2; color: #be123c; }
  .acc-modal-body {
    padding: 22px 26px 26px;
    display: grid;
    gap: 18px;
  }
  .acc-modal-footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  /* Divider */
  .acc-divider {
    height: 1px;
    background: #f1f5f9;
    margin: 0;
    border: none;
  }
`;

export default function AdminCategories() {
  // ✅ FIX: get the live session token from AuthContext instead of static Config token
  const { user } = useContext(AuthContext);
  const authToken = user?.token || user?.user?.token;

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [status, setStatus] = useState(1);

  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  // ✅ FIX: headers now use authToken from context, not the stale static token
  const getHeaders = () => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${authToken}`,
  });

  const fetchCategories = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${apiUrl}/categories?search=${encodeURIComponent(search)}&page=${page}`,
        { method: "GET", headers: getHeaders() }
      );
      const result = await res.json();
      if (result?.status === 200) {
        setItems(result.data.data || []);
        setMeta({ current_page: result.data.current_page, last_page: result.data.last_page });
      } else {
        toast.error(result?.message || "Failed to load");
      }
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (authToken) fetchCategories(1);
  }, [authToken]); // ✅ re-fetch when token becomes available

  const createCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Category name required");
    try {
      const res = await fetch(`${apiUrl}/categories`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ name: name.trim(), status }),
      });
      const result = await res.json();
      if (result?.status === 200) {
        toast.success("Category created!");
        setName(""); setStatus(1);
        fetchCategories(meta.current_page);
      } else { toast.error(result?.message || "Create failed"); }
    } catch { toast.error("Network error"); }
  };

  const openEdit = async (id) => {
    setEditOpen(true); setEditId(id); setEditLoading(true);
    try {
      const res = await fetch(`${apiUrl}/categories/${id}`, { method: "GET", headers: getHeaders() });
      const result = await res.json();
      if (result?.status === 200) {
        setEditName(result.data.name || "");
        setEditStatus(Number(result.data.status ?? 1));
      } else { toast.error(result?.message || "Failed"); closeEdit(); }
    } catch { toast.error("Network error"); closeEdit(); }
    finally { setEditLoading(false); }
  };

  const closeEdit = () => {
    setEditOpen(false); setEditId(null);
    setEditName(""); setEditStatus(1); setEditLoading(false);
  };

  const updateCategory = async (e) => {
    e.preventDefault();
    if (!editId || !editName.trim()) return toast.error("Name required");
    try {
      const res = await fetch(`${apiUrl}/categories/${editId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ name: editName.trim(), status: editStatus }),
      });
      const result = await res.json();
      if (result?.status === 200) {
        toast.success("Category updated!");
        closeEdit(); fetchCategories(meta.current_page);
      } else { toast.error(result?.message || "Update failed"); }
    } catch { toast.error("Network error"); }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/categories/${id}/status`, { method: "PATCH", headers: getHeaders() });
      const result = await res.json();
      if (result?.status === 200) {
        toast.success("Status toggled!");
        fetchCategories(meta.current_page);
      } else { toast.error(result?.message || "Failed"); }
    } catch { toast.error("Network error"); }
  };

  const removeCategory = async (id) => {
    if (!window.confirm("Delete this category? This cannot be undone.")) return;
    try {
      setDeletingId(id);
      const res = await fetch(`${apiUrl}/categories/${id}`, { method: "DELETE", headers: getHeaders() });
      const result = await res.json();
      if (result?.status === 200) {
        toast.success("Category deleted");
        setItems((prev) => prev.filter((c) => c.id !== id));
      } else { toast.error(result?.message || "Delete failed"); }
    } catch { toast.error("Network error"); }
    finally { setDeletingId(null); }
  };

  return (
    <>
      <style>{css}</style>
      <div className="acc-root">

        {/* Back Button */}
        <button className="acc-back" onClick={() => window.history.back()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>

        {/* Page Header */}
        <div className="acc-page-header">
          <div>
            <h1 className="acc-page-title">Categories</h1>
            <p className="acc-page-sub">Manage and organize all platform categories</p>
          </div>
          <span className="acc-count-chip">{items.length} total</span>
        </div>

        {/* ── Create New ── */}
        <div className="acc-card">
          <div className="acc-card-header">
            <span className="acc-card-title">✦ Add New Category</span>
          </div>
          <div className="acc-card-body">
            <form className="acc-create-grid" onSubmit={createCategory}>
              <div className="acc-field">
                <label>Category Name</label>
                <input
                  className="acc-input"
                  placeholder="e.g. Web Development"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="acc-field">
                <label>Status</label>
                <select className="acc-select" value={status} onChange={(e) => setStatus(Number(e.target.value))}>
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
              <div className="acc-field">
                <label style={{ visibility: "hidden" }}>_</label>
                <button className="acc-btn acc-btn-primary" type="submit">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ── Search ── */}
        <div className="acc-card">
          <div className="acc-card-body" style={{ padding: "16px 24px" }}>
            <div className="acc-filter-row">
              <input
                className="acc-input"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchCategories(1)}
                style={{ flex: 1 }}
              />
              <button className="acc-btn acc-btn-primary" onClick={() => fetchCategories(1)} disabled={loading} style={{ flexShrink: 0 }}>
                {loading ? "Searching…" : "Search"}
              </button>
              <button className="acc-btn acc-btn-ghost" onClick={() => fetchCategories(meta.current_page)} disabled={loading} style={{ flexShrink: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="acc-card" style={{ marginBottom: 0 }}>
          <div className="acc-card-header">
            <span className="acc-card-title">All Categories</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>
              {items.length} result{items.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="acc-loading">
              <div className="acc-spinner" />
              <div className="acc-loading-text">Fetching categories…</div>
            </div>
          ) : items.length === 0 ? (
            <div className="acc-empty">
              <div className="acc-empty-icon">📂</div>
              <div className="acc-empty-title">No categories found</div>
              <div className="acc-empty-sub">Try a different search or create one above.</div>
            </div>
          ) : (
            <div className="acc-table-wrap">
              <table className="acc-table">
                <thead>
                  <tr>
                    <th style={{ width: 60 }}>#</th>
                    <th>Name</th>
                    <th style={{ width: 130 }}>Status</th>
                    <th style={{ width: 260 }} className="right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((cat) => (
                    <tr key={cat.id}>
                      <td><span className="acc-row-id">#{cat.id}</span></td>
                      <td><span className="acc-row-name">{cat.name}</span></td>
                      <td>
                        <span className={`acc-status ${cat.status === 1 ? "acc-status-active" : "acc-status-inactive"}`}>
                          {cat.status === 1 ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="acc-actions">
                          <button className="acc-pill acc-pill-edit" onClick={() => openEdit(cat.id)}>✏️ Edit</button>
                          <button className="acc-pill acc-pill-toggle" onClick={() => toggleStatus(cat.id)}>⇄ Toggle</button>
                          <button
                            className="acc-pill acc-pill-delete"
                            onClick={() => removeCategory(cat.id)}
                            disabled={deletingId === cat.id}
                          >
                            {deletingId === cat.id ? "⏳…" : "🗑 Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {meta.last_page > 1 && (
            <div className="acc-pagination">
              <button className="acc-page-btn" disabled={meta.current_page <= 1} onClick={() => fetchCategories(meta.current_page - 1)}>← Prev</button>
              <span className="acc-page-info">Page {meta.current_page} / {meta.last_page}</span>
              <button className="acc-page-btn" disabled={meta.current_page >= meta.last_page} onClick={() => fetchCategories(meta.current_page + 1)}>Next →</button>
            </div>
          )}
        </div>

        {/* ── Edit Modal ── */}
        {editOpen && (
          <div className="acc-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeEdit()}>
            <div className="acc-modal">
              <div className="acc-modal-header">
                <h2 className="acc-modal-title">Edit Category</h2>
                <button className="acc-modal-close" onClick={closeEdit}>✕</button>
              </div>
              <div className="acc-modal-body">
                {editLoading ? (
                  <div className="acc-loading" style={{ padding: "24px 0" }}>
                    <div className="acc-spinner" />
                    <div className="acc-loading-text">Loading…</div>
                  </div>
                ) : (
                  <>
                    <div className="acc-field">
                      <label>Name</label>
                      <input
                        className="acc-input"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </div>
                    <div className="acc-field">
                      <label>Status</label>
                      <select
                        className="acc-select"
                        value={editStatus}
                        onChange={(e) => setEditStatus(Number(e.target.value))}
                      >
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </div>
                    <div className="acc-modal-footer">
                      <button className="acc-btn acc-btn-primary" onClick={updateCategory}>Save Changes</button>
                      <button className="acc-btn acc-btn-ghost" onClick={closeEdit}>Cancel</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}