// src/screens/SignIn.tsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./SignIn.css";
import { UserContext } from "../context/UserContext";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { setEmail } = useContext(UserContext);

  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  useEffect(() => {
    if (!emailInput) setEmailError("");
    else if (!validateEmail(emailInput)) setEmailError("Invalid email format");
    else setEmailError("");
  }, [emailInput]);

  useEffect(() => {
    const valid = emailInput && !emailError && password.trim() !== "";
    setIsFormValid(valid);
    console.log("isFormValid:", valid, { emailInput, password, emailError });
  }, [emailInput, emailError, password]);

  const handleSignIn = () => {
    if (!isFormValid) {
      setFormError("Please fill all fields correctly.");
      return;
    }
    setFormError("");

    setEmail(emailInput); // save in context + localStorage

    navigate("/home"); // go to Home layout
  };

  return (
    <div className="body-container signin-wrapper">
      <div className="signin-card">
        <h2 className="signin-title">User Login</h2>

        <div className="field">
          <span>Email Address</span>
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Enter your email"
          />
          {emailError && <p className="error-text">{emailError}</p>}
        </div>

        <div className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        {formError && <p className="error-text">{formError}</p>}

        <button
          className="btn-primary signin-btn"
          onClick={handleSignIn}
          disabled={!isFormValid}
        >
          Sign In
        </button>

        <div className="signin-links">
          <Link to="/signup">Sign Up</Link>
          <Link to="/forgot">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
