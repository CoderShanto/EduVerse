import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiUrl, token } from "../../../common/Config"; // adjust if needed

export default function AdminCategories() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });
  const [loading, setLoading] = useState(false);

  // search
  const [search, setSearch] = useState("");

  // create
  const [name, setName] = useState("");
  const [status, setStatus] = useState(1);

  // edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState(1);

  // -----------------------------
  // Helpers
  // -----------------------------
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  // -----------------------------
  // GET: /admin/categories
  // -----------------------------
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
        setMeta({
          current_page: result.data.current_page,
          last_page: result.data.last_page,
        });
      } else {
        toast.error(result?.message || "Failed to load categories");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(1);
    // eslint-disable-next-line
  }, []);

  // -----------------------------
  // POST: /admin/categories
  // -----------------------------
  const createCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Category name required");

    try {
      const res = await fetch(`${apiUrl}/categories`, {
        method: "POST",
        headers,
        body: JSON.stringify({ name: name.trim(), status }),
      });

      const result = await res.json();

      if (result?.status === 200) {
        toast.success("Category created");
        setName("");
        setStatus(1);
        fetchCategories(meta.current_page);
      } else {
        toast.error(result?.message || "Create failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    }
  };

  // -----------------------------
  // GET: /admin/categories/{id}
  // -----------------------------
  const openEdit = async (id) => {
    setEditOpen(true);
    setEditId(id);
    setEditLoading(true);

    try {
      const res = await fetch(`${apiUrl}/categories/${id}`, {
        method: "GET",
        headers,
      });

      const result = await res.json();

      if (result?.status === 200) {
        setEditName(result.data.name || "");
        setEditStatus(Number(result.data.status ?? 1));
      } else {
        toast.error(result?.message || "Failed to load category");
        closeEdit();
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
      closeEdit();
    } finally {
      setEditLoading(false);
    }
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditId(null);
    setEditName("");
    setEditStatus(1);
    setEditLoading(false);
  };

  // -----------------------------
  // PUT: /admin/categories/{id}
  // -----------------------------
  const updateCategory = async (e) => {
    e.preventDefault();
    if (!editId) return;
    if (!editName.trim()) return toast.error("Name required");

    try {
      const res = await fetch(`${apiUrl}/categories/${editId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ name: editName.trim(), status: editStatus }),
      });

      const result = await res.json();

      if (result?.status === 200) {
        toast.success("Category updated");
        closeEdit();
        fetchCategories(meta.current_page);
      } else {
        toast.error(result?.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    }
  };

  // -----------------------------
  // PATCH: /admin/categories/{id}/status
  // -----------------------------
  const toggleStatus = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/categories/${id}/status`, {
        method: "PATCH",
        headers,
      });

      const result = await res.json();

      if (result?.status === 200) {
        toast.success("Status updated");
        fetchCategories(meta.current_page);
      } else {
        toast.error(result?.message || "Status update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    }
  };

  // -----------------------------
  // DELETE: /admin/categories/{id}
  // -----------------------------
  const removeCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      const res = await fetch(`${apiUrl}/categories/${id}`, {
        method: "DELETE",
        headers,
      });

      const result = await res.json();

      if (result?.status === 200) {
        toast.success("Category deleted");
        fetchCategories(meta.current_page);
      } else {
        toast.error(result?.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    }
  };

  const onSearch = (e) => {
    e.preventDefault();
    fetchCategories(1);
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="mb-0">Categories</h3>
          <small className="text-muted">Manage all platform categories</small>
        </div>

        <form className="d-flex gap-2" onSubmit={onSearch}>
          <input
            className="form-control"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 220 }}
          />
          <button className="btn btn-dark" type="submit">
            Search
          </button>
        </form>
      </div>

      {/* Create */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <form className="row g-2 align-items-end" onSubmit={createCategory}>
            <div className="col-md-6">
              <label className="form-label">Category Name</label>
              <input
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Web Development"
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(Number(e.target.value))}
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>

            <div className="col-md-3">
              <button className="btn btn-primary w-100" type="submit">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {loading ? (
            <div className="text-muted">Loading...</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th style={{ width: 70 }}>#</th>
                    <th>Name</th>
                    <th style={{ width: 120 }}>Status</th>
                    <th style={{ width: 290 }} className="text-end">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((cat) => (
                    <tr key={cat.id}>
                      <td>{cat.id}</td>
                      <td className="fw-semibold">{cat.name}</td>
                      <td>
                        <span className={`badge ${cat.status === 1 ? "bg-success" : "bg-secondary"}`}>
                          {cat.status === 1 ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-dark me-2" onClick={() => openEdit(cat.id)}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-outline-warning me-2" onClick={() => toggleStatus(cat.id)}>
                          Toggle
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeCategory(cat.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {items.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {meta.last_page > 1 && (
            <div className="d-flex justify-content-end align-items-center gap-2 mt-3">
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={meta.current_page <= 1}
                onClick={() => fetchCategories(meta.current_page - 1)}
              >
                Prev
              </button>

              <span className="small text-muted">
                Page {meta.current_page} of {meta.last_page}
              </span>

              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={meta.current_page >= meta.last_page}
                onClick={() => fetchCategories(meta.current_page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.4)" }}>
          <div className="modal-dialog">
            <div className="modal-content border-0" style={{ borderRadius: 14 }}>
              <div className="modal-header">
                <h5 className="modal-title">Edit Category</h5>
                <button className="btn-close" onClick={closeEdit}></button>
              </div>

              <div className="modal-body">
                {editLoading ? (
                  <div className="text-muted">Loading...</div>
                ) : (
                  <form onSubmit={updateCategory} className="d-grid gap-3">
                    <div>
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={editStatus}
                        onChange={(e) => setEditStatus(Number(e.target.value))}
                      >
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </div>

                    <div className="d-flex gap-2">
                      <button className="btn btn-primary w-100" type="submit">
                        Save
                      </button>
                      <button className="btn btn-outline-secondary w-100" type="button" onClick={closeEdit}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}