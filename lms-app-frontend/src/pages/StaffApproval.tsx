// src/pages/StaffApproval.tsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
  Paper,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export default function StaffApproval() {
  const navigate = useNavigate();
  const { loanId } = useParams(); // <-- Retrieve Loan ID

  const handleDownload = (doc: string) => {
    alert(`Downloading ${doc} for loan ${loanId}...`);
  };

  const handleApprove = () => {
    alert(`Loan ${loanId} approved.`);
  };

  const handleDecline = () => {
    alert(`Loan ${loanId} declined.`);
  };

  return (
    <Card
      sx={{
        maxWidth: 800,
        margin: "2rem auto",
        padding: "1.5rem",
        borderRadius: "16px",
        boxShadow: 3,
      }}
    >
      {/* BACK BUTTON */}
      <Box mb={2}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/staff-loans")}
          sx={{ borderRadius: "10px", textTransform: "none" }}
        >
          Back to Loan List
        </Button>
      </Box>

      <CardContent>
        <Typography variant="h5" fontWeight={600} mb={3}>
          Review Loan — {loanId}
        </Typography>

        {/* Required Documents */}
        <Typography variant="h6" mb={2}>
          Required Documents
        </Typography>

        <Stack spacing={2}>
          <Paper sx={rowStyle}>
            <Typography>Government ID</Typography>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => handleDownload("Government ID")}
            >
              Download
            </Button>
          </Paper>

          <Paper sx={rowStyle}>
            <Typography>Credit History Report</Typography>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => handleDownload("Credit History")}
            >
              Download
            </Button>
          </Paper>

          <Paper sx={rowStyle}>
            <Typography>Payroll Stub</Typography>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => handleDownload("Payroll Stub")}
            >
              Download
            </Button>
          </Paper>
        </Stack>

        {/* Approval / Decline Buttons */}
        <Box
          mt={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
            sx={{ paddingX: "2rem" }}
            onClick={handleApprove}
          >
            Approve
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<CancelIcon />}
            sx={{ paddingX: "2rem" }}
            onClick={handleDecline}
          >
            Decline
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

const rowStyle = {
  padding: "0.75rem 1rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
