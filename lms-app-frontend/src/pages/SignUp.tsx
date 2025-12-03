import React, { useState } from "react";
import "./SignUp.css";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const alphanumericRegex = /^[A-Za-z0-9]+$/;

  const isFormValid =
    name.trim() !== "" &&
    emailRegex.test(email) &&
    phone.trim() !== "" &&
    password.trim() !== "" &&
    alphanumericRegex.test(password) &&
    confirmPassword === password;

  const handleSubmit = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setEmailSent(true);
    console.log("Email sent with code:", code);
  };

  const verifyCode = () => {
    if (verificationCode === generatedCode) {
      alert("Verification successful!");
    } else {
      alert("Invalid verification code.");
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h2 className="signup-title">User Registration</h2>

        {!emailSent && (
          <>
            <div className="field">
              <span>Name *</span>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="field">
              <span>Email Address *</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {!emailRegex.test(email) && email !== "" && (
                <p className="error-text">Invalid email format</p>
              )}
            </div>

            <div className="field">
              <span>Phone *</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="field">
              <span>Password *</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password !== "" && !alphanumericRegex.test(password) && (
                <p className="error-text">Password must be alphanumeric</p>
              )}
            </div>

            <div className="field">
              <span>Confirm Password *</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword !== password && confirmPassword !== "" && (
                <p className="error-text">Passwords do not match</p>
              )}
            </div>

            <button
              className="signup-btn"
              disabled={!isFormValid}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </>
        )}

        {emailSent && (
          <>
            <p className="verification-info">
              A 6-digit verification code has been sent to your email.
            </p>

            <div className="field">
              <span>Enter Verification Code</span>
              <input
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>

            <button className="signup-btn" onClick={verifyCode}>
              Verify
            </button>
          </>
        )}
      </div>
    </div>
  );
}
