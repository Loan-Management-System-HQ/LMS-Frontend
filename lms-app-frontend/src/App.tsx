// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Body from "./pages/SimBody";
import PreApply from "./pages/PreApply";
import Payment from "./pages/Payment";

import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />  

        <Routes>
          {/* Default page */}
          <Route path="/" element={<Body />} />

          {/* Loan application pre-form */}
          <Route path="/preapply" element={<PreApply />} />

          {/* Payment page */}
          <Route path="/payment" element={<Payment />} />   
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}
