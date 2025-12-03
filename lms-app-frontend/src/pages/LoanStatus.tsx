import React, { useState, useEffect } from "react";
import {
    Box,
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
} from "@mui/material";
import "./LoanStatus.css";

interface LoanStatusRow {
    period: number;
    beginningBalance: number;
    interest: number;
    paidAmount: number;
    endingBalance: number;
    status: "Paid" | "Pending" | "Overdue";
    paymentDate?: string;
}

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
    Box,
} from "@mui/material";
import "./LoanStatus.css";

interface LoanStatusRow {
    period: number;
    beginningBalance: number;
    interest: number;
    paidAmount: number;
    endingBalance: number;
    status: "Paid" | "Pending" | "Overdue";
    paymentDate?: string;
}

interface LoanSummary {
    id: string;
    loanNumber: string;
    status: "Open" | "Closed";
    amount: number;
}

const LoanStatus: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [loans, setLoans] = useState<LoanSummary[]>([]);
    const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
    const [rows, setRows] = useState<LoanStatusRow[]>([]);

    // 1. Load the list of loans on mount
    useEffect(() => {
        const fetchLoans = async () => {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            const dummyLoans: LoanSummary[] = [
                { id: "1", loanNumber: "LN-2025-8842", status: "Open", amount: 200000 },
                { id: "2", loanNumber: "LN-2023-1045", status: "Closed", amount: 50000 },
                { id: "3", loanNumber: "LN-2021-9921", status: "Closed", amount: 120000 },
            ];
            setLoans(dummyLoans);
            if (dummyLoans.length > 0) {
                setSelectedLoanId(dummyLoans[0].id);
            }
        };
        fetchLoans();
    }, []);

    // 2. Load details when a loan is selected
    useEffect(() => {
        if (!selectedLoanId) return;

        const fetchLoanDetails = async () => {
            setLoading(true);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 800));

            // Generate different dummy data based on loan ID
            const isClosed = loans.find((l) => l.id === selectedLoanId)?.status === "Closed";

            const dummyData: LoanStatusRow[] = Array.from({ length: 12 }, (_, i) => {
                const period = i + 1;
                const beginningBalance = 200000 - i * 1000;
                const interest = beginningBalance * (0.072 / 12);
                const paidAmount = 1357.5;
                const endingBalance = beginningBalance + interest - paidAmount;

                let status: "Paid" | "Pending" | "Overdue" = "Pending";
                let paymentDate = undefined;

                if (isClosed) {
                    status = "Paid";
                    paymentDate = new Date(2023, i, 15).toLocaleDateString();
                } else {
                    if (i < 10) {
                        status = "Paid";
                        paymentDate = new Date(2024, i, 15).toLocaleDateString();
                    } else if (i === 10) {
                        status = "Overdue";
                    }
                }

                return {
                    period,
                    beginningBalance,
                    interest,
                    paidAmount,
                    endingBalance,
                    status,
                    paymentDate,
                };
            });

            setRows(dummyData);
            setLoading(false);
        };

        fetchLoanDetails();
    }, [selectedLoanId, loans]);

    const formatCurrency = (val: number) =>
        val.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });

    const selectedLoan = loans.find((l) => l.id === selectedLoanId);

    return (
        <div className="loan-status-container">
            {/* Sidebar: List of Loans */}
            <div className="status-sidebar">
                <Paper className="loan-list-paper" elevation={2}>
                    <div className="loan-list-header">
                        Your Loans
                    </div>
                    <List disablePadding>
                        {loans.map((loan) => (
                            <ListItem
                                key={loan.id}
                                button
                                onClick={() => setSelectedLoanId(loan.id)}
                                className={`loan-list-item ${selectedLoanId === loan.id ? 'selected' : ''}`}
                            >
                                <ListItemText
                                    primary={loan.loanNumber}
                                    secondary={formatCurrency(loan.amount)}
                                    primaryTypographyProps={{ className: "loan-list-item-text" }}
                                />
                                <Chip
                                    label={loan.status}
                                    size="small"
                                    color={loan.status === "Open" ? "success" : "default"}
                                    variant={loan.status === "Open" ? "filled" : "outlined"}
                                    className="loan-status-chip"
                                />
                            </ListItem>
                        ))}
                    </List>
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
                            Loan Details: <strong>{selectedLoan.loanNumber}</strong>
                        </Typography>
                        <Typography variant="body2" className="status-subtitle">
                            Status: <strong>{selectedLoan.status}</strong> | Amount: <strong>{formatCurrency(selectedLoan.amount)}</strong>
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
                                    <TableCell><strong>Payment Date</strong></TableCell>
                                    <TableCell align="right"><strong>Beginning Balance</strong></TableCell>
                                    <TableCell align="right"><strong>Interest</strong></TableCell>
                                    <TableCell align="right"><strong>Paid Amount</strong></TableCell>
                                    <TableCell align="right"><strong>Ending Balance</strong></TableCell>
                                    <TableCell align="center"><strong>Status</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.period} className="status-row">
                                        <TableCell component="th" scope="row">
                                            {row.period}
                                        </TableCell>
                                        <TableCell>{row.paymentDate || "-"}</TableCell>
                                        <TableCell align="right">{formatCurrency(row.beginningBalance)}</TableCell>
                                        <TableCell align="right">{formatCurrency(row.interest)}</TableCell>
                                        <TableCell align="right">{formatCurrency(row.paidAmount)}</TableCell>
                                        <TableCell align="right">{formatCurrency(row.endingBalance)}</TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={row.status}
                                                color={
                                                    row.status === "Paid"
                                                        ? "success"
                                                        : row.status === "Overdue"
                                                            ? "error"
                                                            : "warning"
                                                }
                                                size="small"
                                                variant={row.status === "Pending" ? "outlined" : "filled"}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>
        </div>
    );
};

export default LoanStatus;
