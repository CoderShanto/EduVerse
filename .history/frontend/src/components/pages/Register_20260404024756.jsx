import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const apiUrl = "https://eduverse-r2lu.onrender.com/api/register";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrors({});
    setMessage("");

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("Register success:", response.data);

      if (response.data?.status === 200) {
        setMessage(response.data?.message || "User registered successfully.");
        setFormData({
          name: "",
          email: "",
          password: "",
        });
      } else {
        setMessage(response.data?.message || "Registration response received.");
      }
    } catch (error) {
      console.log("Full error:", error);
      console.log("Backend response:", error.response?.data);

      const responseData = error.response?.data;
      const backendErrors = responseData?.errors;

      if (backendErrors && typeof backendErrors === "object") {
        setErrors(backendErrors);
      } else {
        setErrors({});
        setMessage(responseData?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="text-center mb-4">Register</h3>

              {message && (
                <div className="alert alert-info" role="alert">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <small className="text-danger">
                      {Array.isArray(errors.name) ? errors.name[0] : errors.name}
                    </small>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <small className="text-danger">
                      {Array.isArray(errors.email) ? errors.email[0] : errors.email}
                    </small>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && (
                    <small className="text-danger">
                      {Array.isArray(errors.password)
                        ? errors.password[0]
                        : errors.password}
                    </small>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;