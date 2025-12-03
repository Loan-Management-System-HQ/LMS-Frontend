import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import "./LoanApply.css";

interface LoanApplication {
    id: number;
    amount: string;
    period: string;
    rate: string;
    date: string;
    documents: string[];
}

const LoanApply: React.FC = () => {
    const { email } = useContext(UserContext);
    const currentDate = new Date().toLocaleDateString();

    const [amount, setAmount] = useState("");
    const [period, setPeriod] = useState("");
    const [rate, setRate] = useState("");
    const [isApplying, setIsApplying] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [applications, setApplications] = useState<LoanApplication[]>([]);

    const handleApplyClick = () => {
        if (!amount || !period || !rate) {
            alert("Please fill in all loan details first.");
            return;
        }
        setIsApplying(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(e.target.files);
        }
    };

    const handleSubmit = () => {
        if (!selectedFiles || selectedFiles.length === 0) {
            alert("Please upload at least one document.");
            return;
        }

        const fileNames = Array.from(selectedFiles).map((file) => file.name);

        const newApplication: LoanApplication = {
            id: Date.now(),
            amount,
            period,
            rate,
            date: currentDate,
            documents: fileNames,
        };

        setApplications([newApplication, ...applications]);

        // Reset form
        setAmount("");
        setPeriod("");
        setRate("");
        setSelectedFiles(null);
        setIsApplying(false);
        alert("Loan Application Submitted Successfully!");
    };

    return (
        <div className="loan-apply-container">
            {/* Left Side: Application Form */}
            <div className="apply-form-section">
                <h2 className="section-title">New Loan Application</h2>

                <div className="form-group">
                    <label>Applicant Name</label>
                    <input type="text" value={email} readOnly />
                </div>

                <div className="form-group">
                    <label>Application Date</label>
                    <input type="text" value={currentDate} readOnly />
                </div>

                <div className="form-group">
                    <label>Loan Amount ($)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        disabled={isApplying}
                    />
                </div>

                <div className="form-group">
                    <label>Period (Months)</label>
                    <input
                        type="number"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        placeholder="Enter months"
                        disabled={isApplying}
                    />
                </div>

                <div className="form-group">
                    <label>Proposed Interest Rate (%)</label>
                    <input
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        placeholder="Enter rate"
                        disabled={isApplying}
                    />
                </div>

                {!isApplying ? (
                    <button className="apply-btn" onClick={handleApplyClick}>
                        Apply
                    </button>
                ) : (
                    <div className="upload-section">
                        <h3>Upload Documents</h3>
                        <p className="helper-text">Please upload ID proof, Income proof, etc.</p>

                        <div className="file-input-wrapper">
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                        </div>

                        <button className="apply-btn" onClick={handleSubmit}>
                            Submit Application
                        </button>
                        <button
                            className="apply-btn"
                            style={{ backgroundColor: "#64748b", marginTop: "0.5rem" }}
                            onClick={() => setIsApplying(false)}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            {/* Right Side: Application List */}
            <div className="applications-list-section">
                <h2 className="section-title">Your Applications</h2>

                {applications.length === 0 ? (
                    <p style={{ color: "#64748b", textAlign: "center" }}>No applications yet.</p>
                ) : (
                    applications.map((app) => (
                        <div key={app.id} className="application-card">
                            <div className="app-header">
                                <span>Application #{app.id.toString().slice(-4)}</span>
                                <span>{app.date}</span>
                            </div>

                            <div className="app-details">
                                <div>Amount: ${app.amount}</div>
                                <div>Period: {app.period} months</div>
                                <div>Rate: {app.rate}%</div>
                            </div>

                            <div className="app-documents">
                                <div className="doc-title">Uploaded Documents:</div>
                                <ul className="doc-list">
                                    {app.documents.map((doc, index) => (
                                        <li key={index} className="doc-item">📄 {doc}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LoanApply;
