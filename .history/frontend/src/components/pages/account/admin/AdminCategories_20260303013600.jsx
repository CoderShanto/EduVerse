import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiUrl, token } from "../../common/Config"; 
// ⚠️ Adjust this import path based on your project.
// If your Config is somewhere else, change it.

const AdminCategories = () => {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);

  const [loading, setLoading] = useState(false);

  // form state
  const [name, setName] = useState("");
  const [status, setStatus] = useState(1);
  const [editId, setEditId] = useState(null);

  // search
  const [search, setSearch] = useState("");

  const fetchCategories = async (page = 1) => {
    try {
      setLoading(true);

      const res = await fetch(
        `${apiUrl}/admin/categories?search=${encodeURIComponent(search)}&page=${page}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (result?.status === 200) {
        // result.data is pagination object
        setItems(result.data.data || []);
        setMeta({
          current_page: result.data.current_page,
          last_page: result.data.last_page,
        });
      } else {
        toast.error(result?.message || "Failed to load categories");
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  const resetForm = () => {
    setName("");
    setStatus(1);
    setEditId(null);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Category name required");

    try {
      const url = editId
        ? `${apiUrl}/admin/categories/${editId}`
        : `${apiUrl}/admin/categories`;

      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, status }),
      });

      const result = await res.json();

      if (result?.status === 200) {
        toast.success(editId ? "Category updated" : "Category created");
        resetForm();
        fetchCategories(meta?.current_page || 1);
      } else {
        toast.error(result?.message || "Something went wrong");
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error");
    }
  };

  const startEdit = (cat) => {
    setEditId(cat.id);
    setName(cat.name);
    setStatus(cat.status);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleStatus = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/admin/categories/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (result?.status === 200) {
        toast.success("Status updated");
        fetchCategories(meta?.current_page || 1);
      } else {
        toast.error(result?.message || "Failed to update status");
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      const res = await fetch(`${apiUrl}/admin/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (result?.status === 200) {
        toast.success("Category deleted");
        fetchCategories(meta?.current_page || 1);
      } else {
        toast.error(result?.message || "Delete failed");
      }
    } catch (e) {
      console.error(e);
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
          <small className="text-muted">Create, edit, activate/deactivate categories</small>
        </div>

        <form className="d-flex gap-2" onSubmit={onSearch}>
          <input
            className="form-control"
            placeholder="Search category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 220 }}
          />
          <button className="btn btn-dark" type="submit">
            Search
          </button>
        </form>
      </div>

      {/* Create / Update Form */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <form className="row g-2 align-items-end" onSubmit={submit}>
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

            <div className="col-md-3 d-flex gap-2">
              <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                {editId ? "Update" : "Create"}
              </button>

              {editId && (
                <button className="btn btn-outline-secondary w-100" type="button" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* List */}
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
                    <th style={{ width: 260 }} className="text-end">
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
                        <button className="btn btn-sm btn-outline-dark me-2" onClick={() => startEdit(cat)}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-outline-warning me-2" onClick={() => toggleStatus(cat.id)}>
                          Toggle
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => remove(cat.id)}>
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
          {meta && meta.last_page > 1 && (
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
    </div>
  );
};

export default AdminCategories;