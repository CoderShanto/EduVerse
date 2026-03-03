import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiUrl, token } from "../../../common/Config";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --surface2: #1a1a24;
    --border: rgba(255,255,255,0.06);
    --border-hover: rgba(255,255,255,0.12);
    --accent: #7c6aff;
    --accent2: #a78bff;
    --accent-glow: rgba(124, 106, 255, 0.25);
    --success: #34d399;
    --warning: #fbbf24;
    --danger: #f87171;
    --text: #f0f0f8;
    --text-muted: #6b6b8a;
    --text-dim: #3d3d52;
  }

  .cat-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .cat-root {
    font-family: 'Syne', sans-serif;
    background: var(--bg);
    min-height: 100vh;
    padding: 48px 40px;
    color: var(--text);
  }

  /* Header */
  .cat-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 48px;
  }

  .cat-title-block {}

  .cat-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 6px;
    opacity: 0.8;
  }

  .cat-title {
    font-size: 36px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text);
    line-height: 1;
  }

  .cat-subtitle {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 8px;
  }

  .cat-search-form {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .cat-input {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 10px 16px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 220px;
  }

  .cat-input::placeholder { color: var(--text-dim); }

  .cat-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }

  .cat-btn {
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 0.02em;
    border: none;
    border-radius: 10px;
    padding: 10px 20px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .cat-btn-primary {
    background: var(--accent);
    color: #fff;
    box-shadow: 0 4px 20px var(--accent-glow);
  }

  .cat-btn-primary:hover {
    background: var(--accent2);
    box-shadow: 0 6px 28px rgba(124,106,255,0.45);
    transform: translateY(-1px);
  }

  .cat-btn-ghost {
    background: var(--surface);
    color: var(--text-muted);
    border: 1px solid var(--border);
  }

  .cat-btn-ghost:hover {
    border-color: var(--border-hover);
    color: var(--text);
    background: var(--surface2);
  }

  /* Create card */
  .cat-create-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px;
    margin-bottom: 28px;
    position: relative;
    overflow: hidden;
  }

  .cat-create-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: 0.5;
  }

  .cat-create-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 16px;
  }

  .cat-create-row {
    display: grid;
    grid-template-columns: 1fr 200px 160px;
    gap: 12px;
    align-items: end;
  }

  .cat-field label {
    display: block;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 8px;
  }

  .cat-select {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 10px 14px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s;
    appearance: none;
    cursor: pointer;
  }

  .cat-select:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }

  .cat-field .cat-input { width: 100%; background: var(--surface2); }

  /* Table card */
  .cat-table-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
  }

  .cat-table-header {
    display: grid;
    grid-template-columns: 60px 1fr 120px 260px;
    padding: 14px 24px;
    border-bottom: 1px solid var(--border);
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-dim);
  }

  .cat-table-header .act { text-align: right; }

  .cat-row {
    display: grid;
    grid-template-columns: 60px 1fr 120px 260px;
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
    align-items: center;
    transition: background 0.15s;
    animation: rowIn 0.3s ease both;
  }

  @keyframes rowIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .cat-row:last-child { border-bottom: none; }

  .cat-row:hover { background: rgba(255,255,255,0.025); }

  .cat-row-id {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--text-dim);
  }

  .cat-row-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    letter-spacing: -0.01em;
  }

  .cat-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 20px;
    font-weight: 500;
  }

  .cat-badge::before {
    content: '';
    width: 5px; height: 5px;
    border-radius: 50%;
  }

  .cat-badge-active {
    background: rgba(52, 211, 153, 0.1);
    color: var(--success);
    border: 1px solid rgba(52,211,153,0.2);
  }

  .cat-badge-active::before { background: var(--success); }

  .cat-badge-inactive {
    background: rgba(107,107,138,0.12);
    color: var(--text-muted);
    border: 1px solid var(--border);
  }

  .cat-badge-inactive::before { background: var(--text-muted); }

  .cat-actions {
    display: flex;
    gap: 6px;
    justify-content: flex-end;
  }

  .cat-action-btn {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    border-radius: 8px;
    padding: 6px 14px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.18s;
  }

  .cat-action-edit {
    background: transparent;
    border-color: var(--border);
    color: var(--text-muted);
  }

  .cat-action-edit:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-glow);
  }

  .cat-action-toggle {
    background: transparent;
    border-color: var(--border);
    color: var(--text-muted);
  }

  .cat-action-toggle:hover {
    border-color: rgba(251,191,36,0.4);
    color: var(--warning);
    background: rgba(251,191,36,0.08);
  }

  .cat-action-delete {
    background: transparent;
    border-color: var(--border);
    color: var(--text-muted);
  }

  .cat-action-delete:hover {
    border-color: rgba(248,113,113,0.4);
    color: var(--danger);
    background: rgba(248,113,113,0.08);
  }

  /* Empty */
  .cat-empty {
    padding: 64px 24px;
    text-align: center;
    color: var(--text-dim);
    font-family: 'DM Mono', monospace;
    font-size: 13px;
  }

  /* Loading */
  .cat-loading {
    padding: 48px 24px;
    text-align: center;
  }

  .cat-spinner {
    width: 28px; height: 28px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin: 0 auto 12px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .cat-loading-text {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--text-muted);
  }

  /* Pagination */
  .cat-pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    padding: 16px 24px;
    border-top: 1px solid var(--border);
  }

  .cat-page-info {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--text-muted);
  }

  .cat-page-btn {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text-muted);
    border-radius: 8px;
    padding: 6px 14px;
    cursor: pointer;
    transition: all 0.18s;
  }

  .cat-page-btn:hover:not(:disabled) {
    border-color: var(--accent);
    color: var(--accent);
  }

  .cat-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  /* Modal */
  .cat-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .cat-modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    width: 100%;
    max-width: 440px;
    overflow: hidden;
    animation: slideUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
  }

  .cat-modal::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .cat-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 28px 0;
  }

  .cat-modal-title {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .cat-modal-close {
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text-muted);
    width: 30px; height: 30px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.18s;
    line-height: 1;
  }

  .cat-modal-close:hover {
    border-color: var(--danger);
    color: var(--danger);
  }

  .cat-modal-body {
    padding: 24px 28px 28px;
    display: grid;
    gap: 20px;
  }

  .cat-modal-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
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
    } catch (err) {
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
    if (!window.confirm("Delete this category?")) return;
    try {
      const res = await fetch(`${apiUrl}/categories/${id}`, { method: "DELETE", headers });
      const result = await res.json();
      if (result?.status === 200) { toast.success("Deleted"); fetchCategories(meta.current_page); }
      else { toast.error(result?.message || "Delete failed"); }
    } catch { toast.error("Network error"); }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="cat-root">
        {/* Header */}
        <div className="cat-header">
          <div className="cat-title-block">
            <div className="cat-eyebrow">Admin Panel</div>
            <h1 className="cat-title">Categories</h1>
            <p className="cat-subtitle">Manage all platform categories</p>
          </div>

          <form className="cat-search-form" onSubmit={(e) => { e.preventDefault(); fetchCategories(1); }}>
            <input
              className="cat-input"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="cat-btn cat-btn-primary" type="submit">Search</button>
          </form>
        </div>

        {/* Create */}
        <div className="cat-create-card">
          <div className="cat-create-label">New Category</div>
          <form className="cat-create-row" onSubmit={createCategory}>
            <div className="cat-field">
              <label>Name</label>
              <input
                className="cat-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Web Development"
              />
            </div>
            <div className="cat-field">
              <label>Status</label>
              <select className="cat-select" value={status} onChange={(e) => setStatus(Number(e.target.value))}>
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
            <button className="cat-btn cat-btn-primary" type="submit">Create</button>
          </form>
        </div>

        {/* Table */}
        <div className="cat-table-card">
          <div className="cat-table-header">
            <span>#</span>
            <span>Name</span>
            <span>Status</span>
            <span className="act">Actions</span>
          </div>

          {loading ? (
            <div className="cat-loading">
              <div className="cat-spinner" />
              <div className="cat-loading-text">Loading categories...</div>
            </div>
          ) : items.length === 0 ? (
            <div className="cat-empty">No categories found.</div>
          ) : (
            items.map((cat, i) => (
              <div className="cat-row" key={cat.id} style={{ animationDelay: `${i * 0.04}s` }}>
                <span className="cat-row-id">{cat.id}</span>
                <span className="cat-row-name">{cat.name}</span>
                <span>
                  <span className={`cat-badge ${cat.status === 1 ? "cat-badge-active" : "cat-badge-inactive"}`}>
                    {cat.status === 1 ? "Active" : "Inactive"}
                  </span>
                </span>
                <div className="cat-actions">
                  <button className="cat-action-btn cat-action-edit" onClick={() => openEdit(cat.id)}>Edit</button>
                  <button className="cat-action-btn cat-action-toggle" onClick={() => toggleStatus(cat.id)}>Toggle</button>
                  <button className="cat-action-btn cat-action-delete" onClick={() => removeCategory(cat.id)}>Delete</button>
                </div>
              </div>
            ))
          )}

          {meta.last_page > 1 && (
            <div className="cat-pagination">
              <button
                className="cat-page-btn"
                disabled={meta.current_page <= 1}
                onClick={() => fetchCategories(meta.current_page - 1)}
              >← Prev</button>
              <span className="cat-page-info">Page {meta.current_page} / {meta.last_page}</span>
              <button
                className="cat-page-btn"
                disabled={meta.current_page >= meta.last_page}
                onClick={() => fetchCategories(meta.current_page + 1)}
              >Next →</button>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editOpen && (
          <div className="cat-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeEdit()}>
            <div className="cat-modal">
              <div className="cat-modal-header">
                <h2 className="cat-modal-title">Edit Category</h2>
                <button className="cat-modal-close" onClick={closeEdit}>✕</button>
              </div>
              <div className="cat-modal-body">
                {editLoading ? (
                  <div className="cat-loading">
                    <div className="cat-spinner" />
                    <div className="cat-loading-text">Loading...</div>
                  </div>
                ) : (
                  <>
                    <div className="cat-field">
                      <label>Name</label>
                      <input
                        className="cat-input"
                        style={{ width: "100%", background: "var(--surface2)" }}
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </div>
                    <div className="cat-field">
                      <label>Status</label>
                      <select
                        className="cat-select"
                        value={editStatus}
                        onChange={(e) => setEditStatus(Number(e.target.value))}
                      >
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </div>
                    <div className="cat-modal-actions">
                      <button className="cat-btn cat-btn-primary" onClick={updateCategory}>Save Changes</button>
                      <button className="cat-btn cat-btn-ghost" onClick={closeEdit}>Cancel</button>
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