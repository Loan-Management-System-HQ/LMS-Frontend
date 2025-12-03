// src/pages/StaffLoans.tsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Button,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const loanApps = [
  { loanId: "LN-0001", customer: "John Smith", amount: 200000, status: "Pending" },
  { loanId: "LN-0002", customer: "Maria Garcia", amount: 150000, status: "Pending" },
  { loanId: "LN-0003", customer: "David Brown", amount: 100000, status: "Approved" },
  { loanId: "LN-0004", customer: "Ana Martinez", amount: 85000, status: "Declined" },
];

const formatMoney = (v: number) =>
  v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function StaffLoans() {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        maxWidth: 1100,
        margin: "2rem auto",
        padding: "1.5rem",
        borderRadius: "16px",
        boxShadow: 3,
      }}
    >
      <CardContent>
        <Typography variant="h5" fontWeight={600} mb={2}>
          Loan Applications
        </Typography>

        <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Loan ID</strong></TableCell>
                <TableCell><strong>Customer</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loanApps.map((loan) => (
                <TableRow key={loan.loanId}>
                  <TableCell>{loan.loanId}</TableCell>
                  <TableCell>{loan.customer}</TableCell>
                  <TableCell>${formatMoney(loan.amount)}</TableCell>

                  {/* Status column */}
                  <TableCell>
                    {loan.status === "Approved" && (
                      <Chip label="Approved" color="success" variant="outlined" />
                    )}

                    {loan.status === "Declined" && (
                      <Chip label="Declined" color="error" variant="outlined" />
                    )}

                    {loan.status === "Pending" && (
                      <Chip label="Pending" color="warning" variant="outlined" />
                    )}
                  </TableCell>

                  {/* Action column */}
                  <TableCell>
                    {loan.status === "Pending" ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/staff-approval/${loan.loanId}`)}
                      >
                        Review
                      </Button>
                    ) : (
                      <></> // Nothing for approved/declined
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
