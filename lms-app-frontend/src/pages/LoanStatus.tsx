import React, { useState, useEffect } from "react";
import {
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Alert,
    Box,
} from "@mui/material";
import "./LoanStatus.css";
import loanService, { type Loan, type Installment } from "../services/loanService";

const LoanStatus: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [loans, setLoans] = useState<Loan[]>([]);
    const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
    const [rows, setRows] = useState<Installment[]>([]);
    const [error, setError] = useState<string | null>(null);

    // 1. Load the list of loans on mount
    useEffect(() => {
        const fetchLoans = async () => {
            try {
                setLoading(true);
                const response: any = await loanService.getLoans();
                // Handle pagination (DRF returns { count: ..., results: [...] })
                const data = response.results ? response.results : response;

                if (Array.isArray(data)) {
                    setLoans(data);
                    if (data.length > 0) {
                        setSelectedLoanId(data[0].id);
                    }
                } else {
                    console.error("Unexpected response format:", response);
                    setLoans([]);
                    setError("Received invalid data from server.");
                }
            } catch (err) {
                console.error("Failed to fetch loans:", err);
                setError("Failed to load loans. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchLoans();
    }, []);

    // 2. Load details when a loan is selected
    useEffect(() => {
        if (!selectedLoanId) return;

        const fetchLoanDetails = async () => {
            try {
                setLoading(true);
                // Find the internal ID based on the loan_id string if needed, 
                // but getInstallments expects the ID used in the URL.
                // Assuming loan_id is what we need or we need the numeric id.
                // Let's find the loan object first
                const loan = loans.find(l => l.id === selectedLoanId);
                if (loan) {
                    const data = await loanService.getInstallments(loan.id.toString());
                    setRows(data);
                }
            } catch (err) {
                console.error("Failed to fetch installments:", err);
                setError("Failed to load loan details.");
            } finally {
                setLoading(false);
            }
        };

        fetchLoanDetails();
    }, [selectedLoanId, loans]);

    const formatCurrency = (val: number) =>
        val.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString();
    };

    const selectedLoan = loans.find((l) => l.id === selectedLoanId);

    if (loading && loans.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div className="loan-status-container">
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Sidebar: List of Loans */}
            <div className="status-sidebar">
                <Paper className="loan-list-paper" elevation={2}>
                    <div className="loan-list-header">
                        Your Loans
                    </div>
                    {loans.length === 0 ? (
                        <Box p={2}>
                            <Typography variant="body2" color="textSecondary">
                                No loans found.
                            </Typography>
                        </Box>
                    ) : (
                        <List disablePadding>
                            {loans.map((loan) => (
                                <ListItem
                                    key={loan.id}
                                    onClick={() => setSelectedLoanId(loan.id)}
                                    className={`loan-list-item ${selectedLoanId === loan.id ? 'selected' : ''}`}
                                >
                                    <ListItemText
                                        primary={loan.id.substring(0, 8)}
                                        secondary={formatCurrency(loan.amount)}
                                        primaryTypographyProps={{ className: "loan-list-item-text" }}
                                    />
                                    <Chip
                                        label={loan.status}
                                        size="small"
                                        color={loan.status === "APPROVED" || loan.status === "ACTIVE" ? "success" : "default"}
                                        variant={loan.status === "APPROVED" || loan.status === "ACTIVE" ? "filled" : "outlined"}
                                        className="loan-status-chip"
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Paper>
            </div>

            {/* Main Content: Details Table */}
            <div className="status-main-content">
                <Typography variant="h4" className="status-title">
                    Loan Status
                </Typography>

                {selectedLoan && (
                    <Paper elevation={3} className="status-header-paper">
                        <Typography variant="h6" gutterBottom>
                            Loan Details: <strong>{selectedLoan.id.substring(0, 8)}</strong>
                        </Typography>
                        <Typography variant="body2" className="status-subtitle">
                            Status: <strong>{selectedLoan.status}</strong> | Amount: <strong>{formatCurrency(selectedLoan.amount)}</strong> | Term: <strong>{selectedLoan.duration} months</strong>
                        </Typography>
                    </Paper>
                )}

                {loading ? (
                    <div className="status-loading-container">
                        <CircularProgress />
                    </div>
                ) : (
                    <TableContainer component={Paper} elevation={2} className="status-table-container">
                        <Table sx={{ minWidth: 650 }} aria-label="loan status table">
                            <TableHead className="status-table-head">
                                <TableRow>
                                    <TableCell><strong>Period</strong></TableCell>
                                    <TableCell><strong>Due Date</strong></TableCell>
                                    <TableCell align="right"><strong>Amount Due</strong></TableCell>
                                    <TableCell align="right"><strong>Amount Paid</strong></TableCell>
                                    <TableCell align="center"><strong>Status</strong></TableCell>
                                    <TableCell><strong>Paid Date</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            No installments found for this loan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    rows.map((row) => (
                                        <TableRow key={row.id} className="status-row">
                                            <TableCell component="th" scope="row">
                                                {row.installment_number}
                                            </TableCell>
                                            <TableCell>{formatDate(row.due_date)}</TableCell>
                                            <TableCell align="right">{formatCurrency(row.due_amount)}</TableCell>
                                            <TableCell align="right">{formatCurrency(row.payment_amount)}</TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={row.status}
                                                    color={
                                                        row.status === "PAID"
                                                            ? "success"
                                                            : row.status === "OVERDUE"
                                                                ? "error"
                                                                : "warning"
                                                    }
                                                    size="small"
                                                    variant={row.status === "PENDING" ? "outlined" : "filled"}
                                                />
                                            </TableCell>
                                            <TableCell>{formatDate(row.payment_date)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>
        </div>
    );
};

export default LoanStatus;
