import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./SignUp.css";
import authService from "../services/authService";
import { UserContext } from "../context/UserContext";

export default function SignUp() {
  const navigate = useNavigate();
  const { setEmail: setContextEmail } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      password2: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phone: Yup.string().required("Phone number is required"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters"),
      password2: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      try {
        // Backend expects 'name', 'email', 'phone', 'password', 'password2'
        const response = await authService.register(values);

        if (response.access) {
          localStorage.setItem("access_token", response.access);
          localStorage.setItem("refresh_token", response.refresh);
          localStorage.setItem("user", JSON.stringify(response.user));
          setContextEmail(values.email);
          navigate("/home");
        } else {
          navigate("/signin");
        }
      } catch (err: any) {
        console.error("Registration failed:", err);
        if (err.response?.data) {
          const data = err.response.data;
          // Handle DRF errors
          const errorMsg = Object.keys(data)
            .map((key) => {
              const val = Array.isArray(data[key]) ? data[key][0] : data[key];
              return `${key}: ${val}`;
            })
            .join(", ");
          setError(errorMsg || "Registration failed.");
        } else {
          setError("Registration failed. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h2 className="signup-title">User Registration</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="field">
            <span>Name *</span>
            <input
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            {formik.touched.name && formik.errors.name ? (
              <p className="error-text">{formik.errors.name}</p>
            ) : null}
          </div>

          <div className="field">
            <span>Email Address *</span>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="error-text">{formik.errors.email}</p>
            ) : null}
          </div>

          <div className="field">
            <span>Phone *</span>
            <input
              type="tel"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            {formik.touched.phone && formik.errors.phone ? (
              <p className="error-text">{formik.errors.phone}</p>
            ) : null}
          </div>

          <div className="field">
            <span>Password *</span>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="error-text">{formik.errors.password}</p>
            ) : null}
          </div>

          <div className="field">
            <span>Confirm Password *</span>
            <input
              type="password"
              name="password2"
              value={formik.values.password2}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            {formik.touched.password2 && formik.errors.password2 ? (
              <p className="error-text">{formik.errors.password2}</p>
            ) : null}
          </div>

          {error && <p className="error-text" style={{ textAlign: 'center' }}>{error}</p>}

          <button
            type="submit"
            className="signup-btn"
            disabled={!formik.isValid || !formik.dirty || loading}
          >
            {loading ? "Registering..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
