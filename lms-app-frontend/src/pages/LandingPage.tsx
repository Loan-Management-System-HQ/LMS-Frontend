import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            <div className="landing-content">
                <div className="glass-card">
                    <h1 className="landing-title">
                        FastFunding <span className="highlight">LMS</span>
                    </h1>
                    <p className="landing-subtitle">
                        Experience the future of loan management. Streamlined, secure, and smart.
                        Manage your finances with our state-of-the-art simulation and tracking tools.
                    </p>

                    <div className="feature-grid">
                        <div className="feature-item">
                            <h3>Smart Simulation</h3>
                            <p>Visualize your repayment plans instantly.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Secure Payments</h3>
                            <p>Bank-grade security for all transactions.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Real-time Tracking</h3>
                            <p>Monitor your loan status 24/7.</p>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button
                            className="btn-simulation"
                            onClick={() => navigate("/simulation")}
                        >
                            Start Simulation
                        </button>
                        <button
                            className="btn-login"
                            onClick={() => navigate("/signin")}
                        >
                            Login to Portal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
