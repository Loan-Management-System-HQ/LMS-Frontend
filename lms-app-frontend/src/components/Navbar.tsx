import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Logo from "../assets/logo.png";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, clearEmail } = useContext(UserContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setDropdownOpen(false);
  }, [email]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    clearEmail();
    navigate("/signin");
  };

  const hideLogin = location.pathname === "/signin";

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <button className="navbar-logo-button" onClick={() => navigate("/")}>
          <img src={Logo} alt="Logo" className="navbar-logo" />
        </button>

        <div className="navbar-right">
          {!email && !hideLogin && (
            <button className="login-button" onClick={() => navigate("/signin")}>
              Login
            </button>
          )}

          {email && (
            <div className="profile-container" ref={dropdownRef}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                alt="User Avatar"
                className="profile-avatar"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <p className="dropdown-name">User</p>
                  <p className="dropdown-email">{email}</p>
                  <button onClick={() => navigate("/home/profile")}>Profile</button>
                  <button onClick={handleLogout}>Log Out</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
