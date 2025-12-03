// src/components/Navbar.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* LOGO BUTTON */}
        <div
          className="navbar-left"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <div className="logo-container">
            <img src={logo} alt="FastFunding Logo" className="navbar-logo" />
          </div>
        </div>

        {/* LOGIN BUTTON */}
        <div className="navbar-right">
          <button className="login-button">Login</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
