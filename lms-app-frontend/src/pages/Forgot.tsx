import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./Forgot.css";

const Forgot: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: Reset
    const [message, setMessage] = useState("");

    // Formik for Step 1: Email
    const emailFormik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
        }),
        onSubmit: (values) => {
            // Simulate API call to send code
            setTimeout(() => {
                setStep(2);
                setMessage(`Verification code sent to ${values.email}`);
            }, 500);
        },
    });

    // Formik for Step 2: Reset Password
    const resetFormik = useFormik({
        initialValues: {
            code: "",
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            code: Yup.string().required("Verification code is required"),
            newPassword: Yup.string()
                .min(8, "Password must be at least 8 characters")
                .matches(/^[a-zA-Z0-9]+$/, "Password must be alphanumeric")
                .required("New password is required"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("newPassword")], "Passwords must match")
                .required("Confirm password is required"),
        }),
        onSubmit: (_values) => {
            // Simulate API call to reset password
            setTimeout(() => {
                alert("Password changed successfully!");
                navigate("/signin");
            }, 500);
        },
    });

    return (
        <div className="body-container forgot-wrapper">
            <div className="forgot-card">
                <h2 className="forgot-title">Forgot Password</h2>

                {step === 1 && (
                    <form onSubmit={emailFormik.handleSubmit}>
                        <div className="field">
                            <span>Email Address</span>
                            <input
                                type="email"
                                name="email"
                                value={emailFormik.values.email}
                                onChange={emailFormik.handleChange}
                                onBlur={emailFormik.handleBlur}
                                placeholder="Enter your registered email"
                            />
                            {emailFormik.touched.email && emailFormik.errors.email ? (
                                <p className="error-text">{emailFormik.errors.email}</p>
                            ) : null}
                        </div>
                        <button
                            type="submit"
                            className="action-btn"
                            disabled={!emailFormik.isValid || !emailFormik.dirty || emailFormik.isSubmitting}
                        >
                            {emailFormik.isSubmitting ? "Sending..." : "Send Verification Code"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={resetFormik.handleSubmit}>
                        {message && <p className="success-text">{message}</p>}

                        <div className="field">
                            <span>Verification Code</span>
                            <input
                                type="text"
                                name="code"
                                value={resetFormik.values.code}
                                onChange={resetFormik.handleChange}
                                onBlur={resetFormik.handleBlur}
                                placeholder="Enter code"
                            />
                            {resetFormik.touched.code && resetFormik.errors.code ? (
                                <p className="error-text">{resetFormik.errors.code}</p>
                            ) : null}
                        </div>

                        <div className="field">
                            <span>New Password</span>
                            <input
                                type="password"
                                name="newPassword"
                                value={resetFormik.values.newPassword}
                                onChange={resetFormik.handleChange}
                                onBlur={resetFormik.handleBlur}
                                placeholder="Enter new password"
                            />
                            {resetFormik.touched.newPassword && resetFormik.errors.newPassword ? (
                                <p className="error-text">{resetFormik.errors.newPassword}</p>
                            ) : null}
                        </div>

                        <div className="field">
                            <span>Confirm Password</span>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={resetFormik.values.confirmPassword}
                                onChange={resetFormik.handleChange}
                                onBlur={resetFormik.handleBlur}
                                placeholder="Confirm new password"
                            />
                            {resetFormik.touched.confirmPassword && resetFormik.errors.confirmPassword ? (
                                <p className="error-text">{resetFormik.errors.confirmPassword}</p>
                            ) : null}
                        </div>

                        <button
                            type="submit"
                            className="action-btn"
                            disabled={!resetFormik.isValid || !resetFormik.dirty || resetFormik.isSubmitting}
                        >
                            {resetFormik.isSubmitting ? "Saving..." : "Save New Password"}
                        </button>
                    </form>
                )}

                <Link to="/signin" className="back-link">
                    Back to Sign In
                </Link>
            </div>
        </div>
    );
};

export default Forgot;
