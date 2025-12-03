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
import loanService, { type LoanApplication } from "../services/loanService";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const StaffPanel: React.FC = () => {
    const { isStaff } = React.useContext(UserContext);
    const navigate = useNavigate();
    const [loans, setLoans] = useState<LoanApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        if (!isStaff) {
            navigate("/home");
            return;
        }
        fetchLoans();
    }, [isStaff, navigate]);

    const fetchLoans = async () => {
        setLoading(true);
        try {
            const response: any = await loanService.getApplications();
            // Handle pagination (DRF returns { count: ..., results: [...] })
            const data = response.results ? response.results : response;

            if (Array.isArray(data)) {
                setLoans(data);
            } else {
                setLoans([]);
                console.error("Unexpected response format:", response);
            }
        } catch (err) {
            console.error("Failed to fetch applications:", err);
            setError("Failed to fetch loan applications.");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: "approve" | "deny") => {
        setActionLoading(id);
        try {
            if (action === "approve") {
                await loanService.approveApplication(id);
            } else {
                await loanService.rejectApplication(id);
            }

            setNotification({
                message: `Loan application ${id.substring(0, 8)}... has been ${action === "approve" ? "approved" : "denied"}.`,
                type: "success"
            });

            // Refresh the list
            fetchLoans();
        } catch (err) {
            console.error(`Failed to ${action} application:`, err);
            setNotification({
                message: `Failed to ${action} loan application.`,
                type: "error"
            });
        } finally {
            setActionLoading(null);
        }
    };

    const handleCloseNotification = () => {
        setNotification(null);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "APPROVED": return "success";
            case "REJECTED": return "error";
            case "SUBMITTED":
            case "UNDER_REVIEW": return "warning";
            case "DRAFT": return "default";
            default: return "default";
        }
    };

    if (loading && loans.length === 0) {
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
                Manage and review loan applications.
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
                                        <Typography color="textSecondary">No applications found.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                loans.map((loan) => (
                                    <TableRow
                                        key={loan.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#f1f5f9' } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            #{loan.id?.substring(0, 8)}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="medium">
                                                {loan.customer_name || "Unknown"}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>${loan.amount.toLocaleString()}</TableCell>
                                        <TableCell>{formatDate(loan.created_at)}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={loan.status}
                                                size="small"
                                                color={getStatusColor(loan.status || "")}
                                                sx={{ fontWeight: 500 }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            {(loan.status === "SUBMITTED" || loan.status === "UNDER_REVIEW" || loan.status === "DRAFT") && (
                                                <Box display="flex" justifyContent="flex-end" gap={1}>
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        size="small"
                                                        startIcon={<CheckCircle size={16} />}
                                                        onClick={() => loan.id && handleAction(loan.id, "approve")}
                                                        disabled={actionLoading === loan.id}
                                                        sx={{ textTransform: 'none' }}
                                                    >
                                                        {actionLoading === loan.id ? "..." : "Approve"}
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        size="small"
                                                        startIcon={<XCircle size={16} />}
                                                        onClick={() => loan.id && handleAction(loan.id, "deny")}
                                                        disabled={actionLoading === loan.id}
                                                        sx={{ textTransform: 'none' }}
                                                    >
                                                        {actionLoading === loan.id ? "..." : "Deny"}
                                                    </Button>
                                                </Box>
                                            )}
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
