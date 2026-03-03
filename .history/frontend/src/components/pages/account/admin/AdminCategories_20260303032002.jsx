import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiUrl, token } from "../../../common/Config";

const css = `
  .ac-card {
    border-radius: 16px;
    overflow: hidden;
  }
  .ac-toolbar {
    border-radius: 16px;
  }
  .ac-table thead th {
    font-size: 12px;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: #6b7280;
    border-bottom: 1px solid #eef0f3 !important;
    background: #fbfbfc;
  }
  .ac-table tbody td {
    border-bottom: 1px solid #f0f2f6 !important;
    vertical-align: middle;
  }
  .ac-row:hover td {
    background: #fafafa;
  }
  .ac-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 13px;
    border-radius: 999px;
    border: 1px solid transparent;
    font-weight: 700;
    font-size: 12px;
    text-decoration: none;
    cursor: pointer;
    transition: transform .08s ease, box-shadow .12s ease, background .12s ease, border-color .12s ease;
    user-select: none;
    line-height: 1;
    background: none;
  }
  .ac-pill:active { transform: scale(.97); }
  .ac-pill.edit {
    background: #eef6ff;
    border-color: #cfe4ff;
    color: #1d4ed8;
  }
  .ac-pill.edit:hover {
    background: #deefff;
    box-shadow: 0 6px 18px rgba(29,78,216,.10);
  }
  .ac-pill.toggle {
    background: #fffbeb;
    border-color: #fde68a;
    color: #92400e;
  }
  .ac-pill.toggle:hover {
    background: #fef3c7;
    box-shadow: 0 6px 18px rgba(251,191,36,.15);
  }
  .ac-pill.delete {
    background: #fff1f2;
    border-color: #fecdd3;
    color: #be123c;
  }
  .ac-pill.delete:hover {
    background: #ffe4e6;
    box-shadow: 0 6px 18px rgba(190,18,60,.10);
  }
  .ac-pill:disabled {
    opacity: .55;
    cursor: not-allowed;
  }
  .ac-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    flex-wrap: wrap;
  }
  .ac-badge {
    border-radius: 999px;
    padding: 5px 11px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: .04em;
  }
  .ac-id {
    font-size: 12px;
    color: #9ca3af;
    font-weight: 600;
  }
  .ac-name {
    font-weight: 700;
    font-size: 14px;
    color: #111827;
  }
  .ac-label {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .05em;
    text-transform: uppercase;
    color: #6b7280;
    margin-bottom: 6px;
    display: block;
  }
  /* Modal */
  .ac-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15,15,25,0.45);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
    animation: acFadeIn .18s ease;
  }
  @keyframes acFadeIn { from { opacity: 0; } to { opacity: 1; } }
  .ac-modal {
    background: #fff;
    border-radius: 20px;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 24px 64px rgba(0,0,0,.14);
    animation: acSlideUp .22s cubic-bezier(0.34,1.56,0.64,1);
    overflow: hidden;
  }
  @keyframes acSlideUp {
    from { opacity: 0; transform: translateY(20px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)   scale(1); }
  }
  .ac-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px 0;
  }
  .ac-modal-title {
    font-size: 17px;
    font-weight: 800;
    color: #111827;
  }
  .ac-modal-close {
    background: #f3f4f6;
    border: none;
    color: #6b7280;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background .15s;
  }
  .ac-modal-close:hover { background: #fee2e2; color: #be123c; }
  .ac-modal-body {
    padding: 20px 24px 24px;
    display: grid;
    gap: 16px;
  }
`;

export default function AdminCategories() {
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

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchCategories = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${apiUrl}/categories?search=${encodeURIComponent(search)}&page=${page}`,
        { method: "GET", headers }
      );
      const result = await res.json();
      if (result?.status === 200) {
        setItems(result.data.data || []);
        setMeta({ current_page: result.data.current_page, last_page: result.data.last_page });
      } else {
        toast.error(result?.message || "Failed to load categories");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(1); }, []);

  const createCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Category name required");
    try {
      const res = await fetch(`${apiUrl}/categories`, {
        method: "POST", headers, body: JSON.stringify({ name: name.trim(), status }),
      });
      const result = await res.json();
      if (result?.status === 200) {
        toast.success("Category created");
        setName(""); setStatus(1);
        fetchCategories(meta.current_page);
      } else {
        toast.error(result?.message || "Create failed");
      }
    } catch { toast.error("Network error"); }
  };

  const openEdit = async (id) => {
    setEditOpen(true); setEditId(id); setEditLoading(true);
    try {
      const res = await fetch(`${apiUrl}/categories/${id}`, { method: "GET", headers });
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
        method: "PUT", headers, body: JSON.stringify({ name: editName.trim(), status: editStatus }),
      });
      const result = await res.json();
      if (result?.status === 200) {
        toast.success("Category updated");
        closeEdit(); fetchCategories(meta.current_page);
      } else { toast.error(result?.message || "Update failed"); }
    } catch { toast.error("Network error"); }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/categories/${id}/status`, { method: "PATCH", headers });
      const result = await res.json();
      if (result?.status === 200) { toast.success("Status updated"); fetchCategories(meta.current_page); }
      else { toast.error(result?.message || "Failed"); }
    } catch { toast.error("Network error"); }
  };

  const removeCategory = async (id) => {
    if (!window.confirm("Delete this category? This cannot be undone.")) return;
    try {
      setDeletingId(id);
      const res = await fetch(`${apiUrl}/categories/${id}`, { method: "DELETE", headers });
      const result = await res.json();
      if (result?.status === 200) {
        toast.success("Category deleted");
        setItems((prev) => prev.filter((c) => c.id !== id));
      } else { toast.error(result?.message || "Delete failed"); }
    } catch { toast.error("Network error"); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="container my-4">
      <style>{css}</style>

      {/* Page heading */}
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
        <div>
          <h3 className="mb-0 fw-bold">Admin • Categories</h3>
          <small className="text-muted">Search and manage every category.</small>
        </div>
      </div>

      {/* Create toolbar */}
      <div className="card border-0 shadow-sm mb-3 ac-toolbar">
        <div className="card-body">
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 10 }}>
            New Category
          </p>
          <form className="d-flex align-items-end gap-2 flex-wrap" onSubmit={createCategory}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <input
                className="form-control"
                placeholder="Category name, e.g. Web Development"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <select
              className="form-select"
              style={{ maxWidth: 160 }}
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
            <button className="btn btn-primary" type="submit">+ Create</button>
          </form>
        </div>
      </div>

      {/* Search toolbar */}
      <div className="card border-0 shadow-sm mb-3 ac-toolbar">
        <div className="card-body d-flex align-items-center gap-2 flex-wrap">
          <div style={{ flex: 1, minWidth: 220 }}>
            <input
              className="form-control"
              placeholder="Search by category name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchCategories(1)}
            />
          </div>
          <button className="btn btn-outline-secondary" onClick={() => fetchCategories(1)} disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </button>
          <button className="btn btn-outline-secondary" onClick={() => fetchCategories(meta.current_page)} disabled={loading}>
            Refresh
          </button>
        </div>
      </div>

      {/* Table card */}
      <div className="card border-0 shadow-sm ac-card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="text-muted" style={{ fontSize: 13 }}>
              Showing <b>{items.length}</b> categor{items.length === 1 ? "y" : "ies"}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5 text-muted">Loading categories…</div>
          ) : items.length === 0 ? (
            <div className="text-center py-5">
              <h5 className="mb-1">No categories found</h5>
              <div className="text-muted">Try a different search keyword.</div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table ac-table align-middle mb-0">
                <thead>
                  <tr>
                    <th style={{ width: 70 }}>#</th>
                    <th>Name</th>
                    <th style={{ width: 130 }}>Status</th>
                    <th style={{ width: 260 }} className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((cat) => (
                    <tr key={cat.id} className="ac-row">
                      <td><span className="ac-id">{cat.id}</span></td>
                      <td><span className="ac-name">{cat.name}</span></td>
                      <td>
                        <span className={`ac-badge badge ${cat.status === 1 ? "bg-success" : "bg-secondary"}`}>
                          {cat.status === 1 ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="ac-actions">
                          <button className="ac-pill edit" onClick={() => openEdit(cat.id)}>✏️ Edit</button>
                          <button className="ac-pill toggle" onClick={() => toggleStatus(cat.id)}>⇄ Toggle</button>
                          <button
                            className="ac-pill delete"
                            onClick={() => removeCategory(cat.id)}
                            disabled={deletingId === cat.id}
                          >
                            {deletingId === cat.id ? "⏳ Deleting" : "🗑 Delete"}
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
            <div className="d-flex justify-content-end align-items-center gap-2 mt-3">
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={meta.current_page <= 1}
                onClick={() => fetchCategories(meta.current_page - 1)}
              >← Prev</button>
              <span className="text-muted" style={{ fontSize: 13 }}>
                Page {meta.current_page} of {meta.last_page}
              </span>
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={meta.current_page >= meta.last_page}
                onClick={() => fetchCategories(meta.current_page + 1)}
              >Next →</button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <div className="ac-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeEdit()}>
          <div className="ac-modal">
            <div className="ac-modal-header">
              <h2 className="ac-modal-title">Edit Category</h2>
              <button className="ac-modal-close" onClick={closeEdit}>✕</button>
            </div>
            <div className="ac-modal-body">
              {editLoading ? (
                <div className="text-center py-3 text-muted">Loading…</div>
              ) : (
                <>
                  <div>
                    <label className="ac-label">Name</label>
                    <input
                      className="form-control"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="ac-label">Status</label>
                    <select
                      className="form-select"
                      value={editStatus}
                      onChange={(e) => setEditStatus(Number(e.target.value))}
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <button className="btn btn-primary" onClick={updateCategory}>Save Changes</button>
                    <button className="btn btn-outline-secondary" onClick={closeEdit}>Cancel</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}