// src/components/Navbar.tsx
import React from "react";
import "./Navbar.css";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-content">

        {/* Clickable logo */}
        <div className="navbar-left">
          <button
            className="navbar-logo-button"
            onClick={() => navigate("/")}
          >
            <img
              src={Logo}
              alt="FastFunding logo"
              className="navbar-logo"
            />
          </button>
        </div>

        {/* Right section */}
        <div className="navbar-right">
          <button className="login-button">Login</button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
