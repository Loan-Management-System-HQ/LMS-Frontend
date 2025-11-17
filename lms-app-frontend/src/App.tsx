// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Body from "./pages/SimBody";
import PreApply from "./pages/PreApply";
// import ApplyPage from "./pages/ApplyPage";  // add when needed
// import LandingPage from "./pages/LandingPage"; // add when needed

import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />

        <Routes>
          {/* Main Simulation Page */}
          <Route path="/" element={<Body />} />

          {/* Pre-Application Page */}
          <Route path="/preapply" element={<PreApply />} />

          {/* You can add more pages later */}
          {/* <Route path="/apply" element={<ApplyPage />} /> */}
          {/* <Route path="/home" element={<LandingPage />} /> */}
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}
