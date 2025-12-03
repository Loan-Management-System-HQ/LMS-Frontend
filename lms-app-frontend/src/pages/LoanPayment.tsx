import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { generateSchedule } from "../utils/SimCalc";
import type { ScheduleRow } from "../interfaces/ScheduleRow";
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
} from "@mui/material";

const LoanPayment: React.FC = () => {
    const navigate = useNavigate();

    // Constants as per requirement
    const loanAmount = 200000;
    const periodMonths = 360;
    const interestRate = 7.2;
    const loanNumber = "LN-2025-8842"; // Constant loan number

    // Generate full schedule
    const { schedule } = useMemo(() => {
        return generateSchedule(
            { amount: loanAmount, annualRate: interestRate, months: periodMonths },
            {}
        );
    }, []);

    // We only want to show the first 11 rows (10 paid + 1 unpaid)
    // Row indices 0-9 are paid. Row index 10 is the next payment.
    const displayRows = schedule.slice(0, 11);

    const formatCurrency = (val: number) =>
        val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
                                Loan Number: {loanNumber}
                            </Typography>
                            <Stack direction="row" spacing={1} mt={1} alignItems="center">
                                <Chip label={`Principal: $${formatCurrency(loanAmount)}`} size="small" variant="outlined" />
                                <Chip label={`Rate: ${interestRate}%`} size="small" variant="outlined" />
                                <Chip label={`Term: ${periodMonths} Months`} size="small" variant="outlined" />
                            </Stack>
                        </Box>

                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            onClick={() => {
                                const dueAmount = displayRows[displayRows.length - 1].payment;
                                navigate("/home/loan-application", { state: { amount: dueAmount } });
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
                            <TableCell align="right"><strong>Beginning Balance</strong></TableCell>
                            <TableCell align="right"><strong>Interest</strong></TableCell>
                            <TableCell align="right"><strong>Paid Amount</strong></TableCell>
                            <TableCell align="right"><strong>Ending Balance</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayRows.map((row: ScheduleRow, index: number) => {
                            // Highlight the last row as the current due payment
                            const isLastRow = index === displayRows.length - 1;

                            return (
                                <TableRow
                                    key={row.period}
                                    sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        bgcolor: isLastRow ? "action.hover" : "inherit"
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.period}
                                    </TableCell>
                                    <TableCell align="right">{formatCurrency(row.beginning)}</TableCell>
                                    <TableCell align="right">{formatCurrency(row.interest)}</TableCell>
                                    <TableCell align="right">
                                        {isLastRow ? (
                                            <Typography color="primary" fontWeight="bold">
                                                {formatCurrency(row.payment)} (Due)
                                            </Typography>
                                        ) : (
                                            formatCurrency(row.payment)
                                        )}
                                    </TableCell>
                                    <TableCell align="right">{formatCurrency(row.ending)}</TableCell>
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
