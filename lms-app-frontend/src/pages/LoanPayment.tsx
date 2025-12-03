import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Card,
    CardContent,
    Button,
    Typography,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Stack,
    Chip,
    CircularProgress,
    Alert,
} from "@mui/material";
import loanService, { type Loan, type Installment } from "../services/loanService";

const LoanPayment: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeLoan, setActiveLoan] = useState<Loan | null>(null);
    const [installments, setInstallments] = useState<Installment[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // 1. Get Loans
                const loansResponse: any = await loanService.getLoans();
                const loansData = loansResponse.results ? loansResponse.results : loansResponse;

                // Find first ACTIVE loan
                const active = Array.isArray(loansData)
                    ? loansData.find((l: Loan) => l.status === "ACTIVE")
                    : null;

                if (active) {
                    setActiveLoan(active);
                    // 2. Get Installments for this loan
                    // Note: getInstallments expects the ID used in API URL, which is usually the UUID string or ID
                    // Based on previous usage, let's try active.id
                    const installmentsData = await loanService.getInstallments(active.id.toString());
                    setInstallments(installmentsData);
                } else {
                    setError("No active loans found.");
                }
            } catch (err) {
                console.error("Failed to fetch loan data:", err);
                setError("Failed to load loan data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatCurrency = (val: number) =>
        Number(val).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString();
    };

    // Find the next due installment
    const nextDueInstallment = installments.find(inst => inst.status === "PENDING" || inst.status === "PARTIAL");

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error || !activeLoan) {
        return (
            <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
                <Alert severity={error ? "error" : "info"}>
                    {error || "You have no active loans to pay."}
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
            {/* Header Section */}
            <Card elevation={3} sx={{ mb: 3, borderRadius: 2 }}>
                <CardContent>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", md: "center" }}
                        spacing={2}
                    >
                        <Box>
                            <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                                Loan Payment
                            </Typography>
                            <Typography variant="subtitle1" fontWeight="medium">
                                Loan Number: {activeLoan.id.substring(0, 8)}
                            </Typography>
                            <Stack direction="row" spacing={1} mt={1} alignItems="center">
                                <Chip label={`Principal: $${formatCurrency(activeLoan.amount)}`} size="small" variant="outlined" />
                                <Chip label={`Rate: ${activeLoan.interest_rate}%`} size="small" variant="outlined" />
                                <Chip label={`Term: ${activeLoan.duration} Months`} size="small" variant="outlined" />
                            </Stack>
                        </Box>

                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            disabled={!nextDueInstallment}
                            onClick={() => {
                                if (nextDueInstallment) {
                                    navigate("/home/payment-process", {
                                        state: {
                                            amount: nextDueInstallment.due_amount - (nextDueInstallment.payment_amount || 0),
                                            loanNumber: activeLoan.id,
                                            period: nextDueInstallment.installment_number,
                                            installmentId: nextDueInstallment.id
                                        }
                                    });
                                }
                            }}
                            sx={{ minWidth: 150, textTransform: "none", fontWeight: 600 }}
                        >
                            Make Payment
                        </Button>
                    </Stack>
                </CardContent>
            </Card>

            {/* Payment Schedule Table */}
            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="payment schedule table">
                    <TableHead sx={{ bgcolor: "grey.100" }}>
                        <TableRow>
                            <TableCell><strong>Period</strong></TableCell>
                            <TableCell><strong>Due Date</strong></TableCell>
                            <TableCell align="right"><strong>Amount Due</strong></TableCell>
                            <TableCell align="right"><strong>Paid Amount</strong></TableCell>
                            <TableCell align="center"><strong>Status</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {installments.map((row) => {
                            const isNextDue = nextDueInstallment?.id === row.id;

                            return (
                                <TableRow
                                    key={row.id}
                                    sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        bgcolor: isNextDue ? "action.hover" : "inherit"
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.installment_number}
                                    </TableCell>
                                    <TableCell>{formatDate(row.due_date)}</TableCell>
                                    <TableCell align="right">
                                        {isNextDue ? (
                                            <Typography color="primary" fontWeight="bold">
                                                {formatCurrency(row.due_amount)} (Due)
                                            </Typography>
                                        ) : (
                                            formatCurrency(row.due_amount)
                                        )}
                                    </TableCell>
                                    <TableCell align="right">{formatCurrency(row.payment_amount)}</TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={row.status}
                                            color={row.status === "PAID" ? "success" : row.status === "OVERDUE" ? "error" : "default"}
                                            size="small"
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default LoanPayment;
