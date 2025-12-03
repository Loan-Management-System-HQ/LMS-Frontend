// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Body from "./pages/SimBody";
import PreApply from "./pages/PreApply";
import Payment from "./pages/Payment";
import PastPay from "./pages/PastPay";
import StaffLoans from "./pages/StaffLoans";
import StaffApproval from "./pages/StaffApproval";


export default function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="/preapply" element={<PreApply />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/pastpay" element={<PastPay />} />
        <Route path="/staff-loans" element={<StaffLoans />} />
        <Route path="/staff-approval/:loanId" element={<StaffApproval />} />
      </Routes>

      <Footer />
    </Router>
  );
}
