import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Forgot.css";

const Forgot: React.FC = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: Email, 2: Reset
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const validateEmail = (value: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const isAlphanumeric = (str: string) => /^[a-zA-Z0-9]+$/.test(str);

    const handleSendCode = () => {
        setError("");
        setMessage("");

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }
        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        // Simulate API call to send code
        setTimeout(() => {
            setStep(2);
            setMessage(`Verification code sent to ${email}`);
        }, 500);
    };

    const handleSave = () => {
        setError("");
        setMessage("");

        if (!code.trim()) {
            setError("Please enter the verification code.");
            return;
        }
        if (!newPassword) {
            setError("Please enter a new password.");
            return;
        }
        if (!isAlphanumeric(newPassword)) {
            setError("Password must be alphanumeric (letters and numbers only).");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Simulate API call to reset password
        setTimeout(() => {
            alert("Password changed successfully!");
            navigate("/signin");
        }, 500);
    };

    return (
        <div className="body-container forgot-wrapper">
            <div className="forgot-card">
                <h2 className="forgot-title">Forgot Password</h2>

                {step === 1 && (
                    <>
                        <div className="field">
                            <span>Email Address</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your registered email"
                            />
                        </div>
                        {error && <p className="error-text">{error}</p>}
                        <button className="action-btn" onClick={handleSendCode}>
                            Send Verification Code
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        {message && <p className="success-text">{message}</p>}

                        <div className="field">
                            <span>Verification Code</span>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Enter code"
                            />
                        </div>

                        <div className="field">
                            <span>New Password</span>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                            />
                        </div>

                        <div className="field">
                            <span>Confirm Password</span>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                            />
                        </div>

                        {error && <p className="error-text">{error}</p>}

                        <button className="action-btn" onClick={handleSave}>
                            Save New Password
                        </button>
                    </>
                )}

                <Link to="/signin" className="back-link">
                    Back to Sign In
                </Link>
            </div>
        </div>
    );
};

export default Forgot;
