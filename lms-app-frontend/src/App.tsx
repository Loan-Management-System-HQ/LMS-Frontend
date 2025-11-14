import React from "react";
import Navbar from "./components/Navbar";
import Body from "./pages/SimBody";
import Footer from "./components/Footer";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <Body />
      <Footer />
    </div>
  );
}
