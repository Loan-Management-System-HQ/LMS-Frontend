import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import LeftMenu from "../components/LeftMenu";

import Dashboard from "./Dashboard";
import Simulation from "./SimBody";

import Profile from "./Profile";
import LoanApply from "./LoanApply";
import LoanPayment from "./LoanPayment";



import LoanStatus from "./LoanStatus";

import PaymentProcess from "./PaymentProcess";

const Home: React.FC = () => {
  const { email } = useContext(UserContext);

  if (!email) return <Navigate to="/signin" replace />;

  return (
    <div style={{ display: "flex" }}>
      <LeftMenu />

      <div className="main-content" style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/loan-application" element={<LoanApply />} />

          <Route path="/loan-status" element={<LoanStatus />} />
          <Route path="/loan-payment" element={<LoanPayment />} />
          <Route path="/payment-process" element={<PaymentProcess />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
