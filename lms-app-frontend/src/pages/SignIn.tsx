// src/screens/SignIn.tsx
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./SignIn.css";
import { UserContext } from "../context/UserContext";
import authService from "../services/authService";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { setEmail } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setFormError("");
      try {
        await authService.login({
          email: values.email,
          password: values.password,
        });

        setEmail(values.email); // save in context
        navigate("/home"); // go to Home layout
      } catch (err: any) {
        console.error("Login failed:", err);
        if (err.response?.data?.error) {
          setFormError(err.response.data.error);
        } else if (err.response?.data?.detail) {
          setFormError(err.response.data.detail);
        } else {
          setFormError("Login failed. Please check your credentials.");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="body-container signin-wrapper">
      <div className="signin-card">
        <h2 className="signin-title">User Login</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="field">
            <span>Email Address</span>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your email"
              disabled={loading}
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="error-text">{formik.errors.email}</p>
            ) : null}
          </div>

          <div className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your password"
              disabled={loading}
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="error-text">{formik.errors.password}</p>
            ) : null}
          </div>

          {formError && <p className="error-text">{formError}</p>}

          <button
            type="submit"
            className="btn-primary signin-btn"
            disabled={!formik.isValid || !formik.dirty || loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="signin-links">
            <Link to="/signup">Sign Up</Link>
            <Link to="/forgot">Forgot Password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;

