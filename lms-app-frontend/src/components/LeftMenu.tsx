import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Calculator,
  FileText,
  CheckCircle,
  CreditCard,
} from "lucide-react";
import "./LeftMenu.css";

const LeftMenu: React.FC = () => {
  return (
    <div className="left-menu">
      <h2 className="menu-title">Dashboard</h2>

      <nav className="menu-links">
        <NavLink
          to="/home"
          end
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <Home size={18} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/simulation"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <Calculator size={18} />
          <span>Simulation</span>
        </NavLink>

        <NavLink
          to="/home/loan-application"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FileText size={18} />
          <span>Loan Application</span>
        </NavLink>

        <NavLink
          to="/home/loan-status"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <CheckCircle size={18} />
          <span>Loan Status</span>
        </NavLink>

        <NavLink
          to="/home/loan-payment"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <CreditCard size={18} />
          <span>Loan Payment</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default LeftMenu;
