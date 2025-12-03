import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Body from "./pages/SimBody";
import PreApply from "./pages/PreApply";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Forgot from "./pages/Forgot";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";

import { UserProvider } from "./context/UserContext";

import "./App.css";

export default function App() {
  return (
    <UserProvider>
      <Router>
        <div className="app">
          <Navbar />

          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/simulation" element={<Body />} />
            <Route path="/preapply" element={<PreApply />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot" element={<Forgot />} />

            {/* PROTECTED ROUTES */}
            <Route
              path="/home/*"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
          </Routes>

          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
}
