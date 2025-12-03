import React, { useState, useContext, useEffect } from "react";
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
import { loanService } from "../services/loanService";

interface LoanApplication {
    id: string;
    amount: string;
    duration: number;
    interest_rate: string;
    created_at: string;
    status: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
    documents: any[]; // Adjust based on actual response
}

import { useFormik } from "formik";
import * as Yup from "yup";

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

const LoanApplicationForm: React.FC<{ email: string; currentDate: string; onSuccess: (id: string) => void }> = ({ email, currentDate, onSuccess }) => {
    const [error, setError] = useState<string | null>(null);

    const formik = useFormik({
        initialValues: {
            amount: "",
            period: "",
            rate: "",
            purpose: "Personal", // Default purpose
        },
        validationSchema: Yup.object({
            amount: Yup.number()
                .required("Amount is required")
                .positive("Amount must be positive")
                .typeError("Amount must be a number"),
            period: Yup.number()
                .required("Period is required")
                .positive("Period must be positive")
                .integer("Period must be an integer")
                .typeError("Period must be a number"),
            rate: Yup.number()
                .required("Interest Rate is required")
                .positive("Rate must be positive")
                .typeError("Rate must be a number"),
        }),
        onSubmit: async (values) => {
            setError(null);
            try {
                const response = await loanService.applyForLoan({
                    amount: Number(values.amount),
                    duration: Number(values.period), // Backend expects 'duration', not 'term_months'
                    interest_rate: Number(values.rate), // Backend expects 'interest_rate'
                    // purpose: values.purpose, // Backend doesn't seem to have 'purpose' in serializer, check if needed
                    // remarks: ... 
                });
                // Assuming response contains the created application object with an id
                if (response && response.id) {
                    onSuccess(response.id);
                } else {
                    setError("Failed to create application: No ID returned");
                }
            } catch (err: any) {
                console.error("Loan application error:", err);
                const errorMsg = err.response?.data
                    ? (typeof err.response.data === 'object' ? JSON.stringify(err.response.data) : err.response.data)
                    : "Failed to submit loan application. Please try again.";
                setError(errorMsg);
            }
        },
    });

    return (
        <Box component="form" noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
                fullWidth
                label="Applicant Name"
                value={email}
                margin="normal"
                InputProps={{ readOnly: true }}
                variant="filled"
            />
            <TextField
                fullWidth
                label="Application Date"
                value={currentDate}
                margin="normal"
                InputProps={{ readOnly: true }}
                variant="filled"
            />
            <TextField
                fullWidth
                label="Loan Amount ($)"
                name="amount"
                type="number"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
                margin="normal"
                required
            />
            <TextField
                fullWidth
                label="Period (Months)"
                name="period"
                type="number"
                value={formik.values.period}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.period && Boolean(formik.errors.period)}
                helperText={formik.touched.period && formik.errors.period}
                margin="normal"
                required
            />
            <TextField
                fullWidth
                label="Proposed Interest Rate (%)"
                name="rate"
                type="number"
                value={formik.values.rate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.rate && Boolean(formik.errors.rate)}
                helperText={formik.touched.rate && formik.errors.rate}
                margin="normal"
                required
            />

            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
            >
                {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Apply"}
            </Button>
        </Box>
    );
};

const LoanApply: React.FC = () => {
    const { email } = useContext(UserContext);
    const navigate = useNavigate();
    const currentDate = new Date().toLocaleDateString();

    const [tabValue, setTabValue] = useState(0);
    const [loanId, setLoanId] = useState<string | null>(null);
    const [applications, setApplications] = useState<LoanApplication[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
            const response: any = await loanService.getApplications();
            // Handle pagination (DRF returns { count: ..., results: [...] })
            const data = response.results ? response.results : response;

            // Ensure data is an array
            if (Array.isArray(data)) {
                setApplications(data);
            } else {
                console.error("Expected array of applications, got:", response);
                setApplications([]);
            }
        } catch (error) {
            console.error("Failed to fetch loan history:", error);
        } finally {
            setLoadingHistory(false);
        }
    };

    useEffect(() => {
        if (tabValue === 1) {
            fetchHistory();
        }
    }, [tabValue]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleUploadClick = () => {
        if (loanId) {
            navigate(`/home/loan-application/upload/${loanId}`);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "APPROVED": return "success";
            case "REJECTED": return "error";
            case "SUBMITTED":
            case "UNDER_REVIEW": return "warning";
            default: return "default";
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
                        <LoanApplicationForm
                            email={email || ""}
                            currentDate={currentDate}
                            onSuccess={(id) => setLoanId(id)}
                        />
                    ) : (
                        <Box sx={{ textAlign: "center", py: 3 }}>
                            <Alert severity="success" sx={{ mb: 3 }}>
                                Loan Application Initiated Successfully!
                            </Alert>
                            <Typography variant="h5" gutterBottom color="primary">
                                Loan ID: #{loanId.substring(0, 8)}...
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
                                {/* <TableCell><strong>Documents</strong></TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loadingHistory ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <CircularProgress size={24} />
                                    </TableCell>
                                </TableRow>
                            ) : applications.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No applications found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                applications.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            #{row.id.substring(0, 8)}
                                        </TableCell>
                                        <TableCell>{new Date(row.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell>${row.amount}</TableCell>
                                        <TableCell>{row.duration} months</TableCell>
                                        <TableCell>{row.interest_rate}%</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={row.status}
                                                color={getStatusColor(row.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        {/* <TableCell>
                                            {row.documents && row.documents.length > 0 ? (
                                                <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
                                                    {row.documents.map((doc, idx) => (
                                                        <li key={idx} style={{ fontSize: "0.85rem" }}>{doc.display_filename || doc.file_name}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span style={{ color: "#94a3b8" }}>None</span>
                                            )}
                                        </TableCell> */}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CustomTabPanel>
        </Box>
    );
};

export default LoanApply;
