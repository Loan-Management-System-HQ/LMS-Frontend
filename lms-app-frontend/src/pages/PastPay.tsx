// src/pages/PastPay.tsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Box,
  Divider,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Example past payment dataset (replace with real backend data later)
const pastPayments = [
  { period: 1, beginning: 200000, interest: 1200, payment: 1357.58, ending: 199842.42 },
  { period: 2, beginning: 199842.42, interest: 1199.05, payment: 1357.58, ending: 199683.90 },
  { period: 3, beginning: 199683.90, interest: 1198.10, payment: 1357.58, ending: 199524.43 },
  { period: 4, beginning: 199524.43, interest: 1197.15, payment: 1357.58, ending: 199364.00 },
];

// Example “next payment due”
const nextPayment = {
  period: pastPayments.length + 1,
  beginning: 199364.00,
  interest: 1196.18,
  payment: 1357.58,
  ending: 198, // placeholder
};

const formatMoney = (v: number) =>
  v.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function PastPay() {
  const navigate = useNavigate();
  const totalPaid = pastPayments.reduce((sum, p) => sum + p.payment, 0);

  return (
    <Card
      sx={{
        maxWidth: 1250,
        margin: "2rem auto",
        padding: "1.5rem",
        borderRadius: "16px",
        boxShadow: 3,
      }}
    >
      {/* Summary Section */}
      <Box
        sx={{
          background: "#f0f8ff",
          padding: "1rem",
          borderRadius: "12px",
          marginBottom: "1.5rem",
          border: "1px solid #d0e7ff",
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={1}>
          Payment Summary
        </Typography>

        <Typography>
          <strong>Payments Completed:</strong> {pastPayments.length}
        </Typography>

        <Typography>
          <strong>Total Paid:</strong> ${formatMoney(totalPaid)}
        </Typography>

        <Typography>
          <strong>Next Payment Amount:</strong> ${formatMoney(nextPayment.payment)}
        </Typography>
      </Box>

      <CardContent>
        <Typography variant="h5" fontWeight={600} mb={2}>
          Past Payments
        </Typography>

        <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Period</strong></TableCell>
                <TableCell><strong>Beginning</strong></TableCell>
                <TableCell><strong>Interest</strong></TableCell>
                <TableCell><strong>Payment</strong></TableCell>
                <TableCell><strong>Ending</strong></TableCell>
                <TableCell></TableCell> {/* Button column */}
              </TableRow>
            </TableHead>

            <TableBody>
              {/* Past Payments */}
              {pastPayments.map((row) => (
                <TableRow key={row.period}>
                  <TableCell>{row.period}</TableCell>
                  <TableCell>${formatMoney(row.beginning)}</TableCell>
                  <TableCell>${formatMoney(row.interest)}</TableCell>

                  <TableCell>
                    <Paper
                      elevation={0}
                      sx={{
                        padding: "8px 12px",
                        backgroundColor: "#f5f5f5",
                        borderRadius: "6px",
                        textAlign: "right",
                      }}
                    >
                      ${formatMoney(row.payment)}
                    </Paper>
                  </TableCell>

                  <TableCell>${formatMoney(row.ending)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}

              {/* Divider */}
              <TableRow>
                <TableCell colSpan={6}>
                  <Divider sx={{ marginY: 2 }} />
                </TableCell>
              </TableRow>

              {/* Next Payment Due */}
              <TableRow
                sx={{
                  backgroundColor: "#eaf7ff",
                }}
              >
                <TableCell>
                  <strong>{nextPayment.period}</strong>
                </TableCell>
                <TableCell>
                  <strong>${formatMoney(nextPayment.beginning)}</strong>
                </TableCell>
                <TableCell>
                  <strong>${formatMoney(nextPayment.interest)}</strong>
                </TableCell>

                <TableCell>
                  <Paper
                    elevation={0}
                    sx={{
                      padding: "8px 12px",
                      backgroundColor: "#d9efff",
                      borderRadius: "6px",
                      textAlign: "right",
                      fontWeight: 600,
                    }}
                  >
                    ${formatMoney(nextPayment.payment)}
                  </Paper>
                </TableCell>

                <TableCell>
                  <strong>${formatMoney(nextPayment.ending)}</strong>
                </TableCell>

                {/* ⭐ The new button */}
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: "10px", textTransform: "none" }}
                    onClick={() => navigate("/payment")}
                  >
                    I want to pay
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
