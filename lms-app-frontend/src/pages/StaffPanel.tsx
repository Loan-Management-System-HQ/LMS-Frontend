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
    Button,
    Chip,
    CircularProgress,
    Alert,
    Snackbar
} from "@mui/material";
import { CheckCircle, XCircle } from "lucide-react";
import type { LoanApplication } from "../interfaces/LoanApplication";

const StaffPanel: React.FC = () => {
    const [loans, setLoans] = useState<LoanApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

    // Mock data for demonstration if API fails or is not ready
    const mockLoans: LoanApplication[] = [
        { id: "L001", applicantName: "John Doe", amount: 5000, date: "2023-10-25", status: "Draft", email: "john@example.com" },
        { id: "L002", applicantName: "Jane Smith", amount: 12000, date: "2023-10-26", status: "Draft", email: "jane@example.com" },
        { id: "L003", applicantName: "Robert Johnson", amount: 3500, date: "2023-10-27", status: "Draft", email: "bob@example.com" },
    ];

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        setLoading(true);
        try {
            // Replace with actual API call
            // const response = await fetch('/api/loans?status=Draft');
            // const data = await response.json();
            // setLoans(data);

            // Simulating API call
            setTimeout(() => {
                setLoans(mockLoans);
                setLoading(false);
            }, 1000);
        } catch (err) {
            setError("Failed to fetch loan applications.");
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: "approve" | "deny") => {
        try {
            // Replace with actual API call
            // await fetch(`/api/loans/${id}/${action}`, { method: 'POST' });

            // Simulating API success
            setLoans((prevLoans: LoanApplication[]) => prevLoans.filter((loan: LoanApplication) => loan.id !== id));

            setNotification({
                message: `Loan application ${id} has been ${action === "approve" ? "approved" : "denied"}.`,
                type: "success"
            });
        } catch (err) {
            setNotification({
                message: `Failed to ${action} loan application.`,
                type: "error"
            });
        }
    };

    const handleCloseNotification = () => {
        setNotification(null);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                Staff Dashboard
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 4, color: '#64748b' }}>
                Manage and review draft loan applications.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="loan applications table">
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Application ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Applicant</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loans.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                        <Typography color="textSecondary">No draft applications found.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                loans.map((loan) => (
                                    <TableRow
                                        key={loan.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#f1f5f9' } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            #{loan.id}
                                        </TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2" fontWeight="medium">{loan.applicantName}</Typography>
                                                <Typography variant="caption" color="textSecondary">{loan.email}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>${loan.amount.toLocaleString()}</TableCell>
                                        <TableCell>{loan.date}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={loan.status}
                                                size="small"
                                                sx={{ bgcolor: '#e2e8f0', color: '#475569', fontWeight: 500 }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box display="flex" justifyContent="flex-end" gap={1}>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    startIcon={<CheckCircle size={16} />}
                                                    onClick={() => handleAction(loan.id, "approve")}
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    startIcon={<XCircle size={16} />}
                                                    onClick={() => handleAction(loan.id, "deny")}
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    Deny
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Snackbar
                open={!!notification}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseNotification} severity={notification?.type || "info"} sx={{ width: '100%' }}>
                    {notification?.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default StaffPanel;
