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
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    // input change hole previous error remove
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
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
        setMessage(response.data.message || "User registered successfully.");

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
        const firstKey = Object.keys(backendErrors)[0];
        console.log(backendErrors[firstKey]?.[0] || "Validation error");
      } else {
        console.log(responseData?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "450px", margin: "40px auto" }}>
      <h2>Register</h2>

      {message && (
        <div
          style={{
            marginBottom: "15px",
            padding: "10px",
            background: "#f3f3f3",
            borderRadius: "6px",
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            style={{ width: "100%", padding: "10px" }}
          />
          {errors.name && (
            <p style={{ color: "red", marginTop: "5px" }}>
              {Array.isArray(errors.name) ? errors.name[0] : errors.name}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            style={{ width: "100%", padding: "10px" }}
          />
          {errors.email && (
            <p style={{ color: "red", marginTop: "5px" }}>
              {Array.isArray(errors.email) ? errors.email[0] : errors.email}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
            style={{ width: "100%", padding: "10px" }}
          />
          {errors.password && (
            <p style={{ color: "red", marginTop: "5px" }}>
              {Array.isArray(errors.password)
                ? errors.password[0]
                : errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 16px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
