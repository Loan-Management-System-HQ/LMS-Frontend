import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Tabs,
    Tab,
    Alert,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./LoanApply.css";

interface LoanApplication {
    id: number;
    amount: string;
    period: string;
    rate: string;
    date: string;
    status: "Pending" | "Approved" | "Denied";
    documents: string[];
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const LoanApply: React.FC = () => {
    const { email } = useContext(UserContext);
    const navigate = useNavigate();
    const currentDate = new Date().toLocaleDateString();

    const [tabValue, setTabValue] = useState(0);
    const [amount, setAmount] = useState("");
    const [period, setPeriod] = useState("");
    const [rate, setRate] = useState("");
    const [isApplying, setIsApplying] = useState(false);
    const [loanId, setLoanId] = useState<number | null>(null);

    // Mock data for history
    const [applications] = useState<LoanApplication[]>([
        {
            id: 1001,
            amount: "5000",
            period: "12",
            rate: "5.5",
            date: "10/15/2023",
            status: "Approved",
            documents: ["ID.pdf", "Paystub.pdf"],
        },
        {
            id: 1002,
            amount: "10000",
            period: "24",
            rate: "6.0",
            date: "11/20/2023",
            status: "Pending",
            documents: ["ID.pdf"],
        },
    ]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleApplyClick = () => {
        if (!amount || !period || !rate) {
            alert("Please fill in all loan details first.");
            return;
        }
        setIsApplying(true);

        // Simulate API call to get Loan ID
        setTimeout(() => {
            const newLoanId = Math.floor(100000 + Math.random() * 900000); // Generate random 6-digit ID
            setLoanId(newLoanId);
            setIsApplying(false);
        }, 1500);
    };

    const handleUploadClick = () => {
        if (loanId) {
            navigate(`/home/loan-application/upload/${loanId}`);
        }
    };

    return (
        <Box sx={{ width: "100%", typography: "body1" }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                Loan Application
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="loan application tabs">
                    <Tab label="Apply for Loan" />
                    <Tab label="History" />
                </Tabs>
            </Box>

            {/* TAB 1: APPLY FOR LOAN */}
            <CustomTabPanel value={tabValue} index={0}>
                <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: "auto", borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        New Loan Request
                    </Typography>

                    {!loanId ? (
                        <Box component="form" noValidate autoComplete="off">
                            <TextField
                                fullWidth
                                label="Applicant Name"
                                value={email || ""}
                                margin="normal"
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="filled"
                            />
                            <TextField
                                fullWidth
                                label="Application Date"
                                value={currentDate}
                                margin="normal"
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="filled"
                            />
                            <TextField
                                fullWidth
                                label="Loan Amount ($)"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Period (Months)"
                                type="number"
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Proposed Interest Rate (%)"
                                type="number"
                                value={rate}
                                onChange={(e) => setRate(e.target.value)}
                                margin="normal"
                                required
                            />

                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                sx={{ mt: 3 }}
                                onClick={handleApplyClick}
                                disabled={isApplying}
                            >
                                {isApplying ? <CircularProgress size={24} color="inherit" /> : "Apply"}
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ textAlign: "center", py: 3 }}>
                            <Alert severity="success" sx={{ mb: 3 }}>
                                Loan Application Initiated Successfully!
                            </Alert>
                            <Typography variant="h5" gutterBottom color="primary">
                                Loan ID: #{loanId}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Your application has been generated. Please upload the required documents to proceed.
                            </Typography>

                            <Button
                                variant="contained"
                                color="secondary"
                                size="large"
                                onClick={handleUploadClick}
                                sx={{ mt: 2 }}
                            >
                                Upload Documents
                            </Button>
                        </Box>
                    )}
                </Paper>
            </CustomTabPanel>

            {/* TAB 2: HISTORY */}
            <CustomTabPanel value={tabValue} index={1}>
                <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                    <Table sx={{ minWidth: 650 }} aria-label="loan history table">
                        <TableHead sx={{ bgcolor: "#f1f5f9" }}>
                            <TableRow>
                                <TableCell><strong>Loan ID</strong></TableCell>
                                <TableCell><strong>Date</strong></TableCell>
                                <TableCell><strong>Amount</strong></TableCell>
                                <TableCell><strong>Period</strong></TableCell>
                                <TableCell><strong>Rate</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Documents</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {applications.map((row) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        #{row.id}
                                    </TableCell>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>${row.amount}</TableCell>
                                    <TableCell>{row.period} months</TableCell>
                                    <TableCell>{row.rate}%</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={row.status}
                                            color={row.status === "Approved" ? "success" : row.status === "Pending" ? "warning" : "error"}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {row.documents.length > 0 ? (
                                            <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
                                                {row.documents.map((doc, idx) => (
                                                    <li key={idx} style={{ fontSize: "0.85rem" }}>{doc}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span style={{ color: "#94a3b8" }}>None</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CustomTabPanel>
        </Box>
    );
};

export default LoanApply;
