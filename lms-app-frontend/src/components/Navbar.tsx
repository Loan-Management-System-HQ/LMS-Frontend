// src/components/Navbar.tsx
import React from "react";
import "./Navbar.css";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <img src="/logo192.png" alt="Logo" className="navbar-logo" />
          <h1 className="navbar-title">Loan Management System</h1>
        </div>
        <div className="navbar-right">
          <button className="login-button">Login</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
