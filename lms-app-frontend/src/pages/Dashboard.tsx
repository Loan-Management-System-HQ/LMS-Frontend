import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Snackbar
} from "@mui/material";
import { UserContext } from "../context/UserContext";
import { loanService, type LoanApplication } from "../services/loanService";

const Dashboard: React.FC = () => {
  const { isStaff } = useContext(UserContext);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response: any = await loanService.getApplications();
      // Handle pagination or direct list
      const data = response.results ? response.results : response;
      if (Array.isArray(data)) {
        setApplications(data);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      setError("Failed to load loan applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isStaff) {
      fetchApplications();
    }
  }, [isStaff]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await loanService.approveApplication(id);
      setSuccessMsg(`Application ${id.substring(0, 8)}... approved successfully.`);
      fetchApplications(); // Refresh list
    } catch (err) {
      console.error("Failed to approve application:", err);
      setError("Failed to approve application.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await loanService.rejectApplication(id);
      setSuccessMsg(`Application ${id.substring(0, 8)}... rejected.`);
      fetchApplications(); // Refresh list
    } catch (err) {
      console.error("Failed to reject application:", err);
      setError("Failed to reject application.");
    } finally {
      setActionLoading(null);
    }
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

  if (isStaff) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
            Staff Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" paragraph>
            Manage and review loan applications.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Snackbar
            open={!!successMsg}
            autoHideDuration={6000}
            onClose={() => setSuccessMsg(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert onClose={() => setSuccessMsg(null)} severity="success" variant="filled">
              {successMsg}
            </Alert>
          </Snackbar>

          <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, mt: 3 }}>
            <Table sx={{ minWidth: 650 }} aria-label="loan applications table">
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Applicant</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Amount</strong></TableCell>
                  <TableCell><strong>Duration</strong></TableCell>
                  <TableCell><strong>Rate</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      No applications found.
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((app) => (
                    <TableRow key={app.id} hover>
                      <TableCell>#{app.id?.substring(0, 8)}</TableCell>
                      <TableCell>{app.customer_name || "N/A"}</TableCell>
                      <TableCell>{app.created_at ? new Date(app.created_at).toLocaleDateString() : "N/A"}</TableCell>
                      <TableCell>${app.amount}</TableCell>
                      <TableCell>{app.duration} months</TableCell>
                      <TableCell>{app.interest_rate}%</TableCell>
                      <TableCell>
                        <Chip
                          label={app.status}
                          color={getStatusColor(app.status || "DRAFT")}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {(app.status === "SUBMITTED" || app.status === "DRAFT" || app.status === "UNDER_REVIEW") && (
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => app.id && handleApprove(app.id)}
                              disabled={actionLoading === app.id}
                            >
                              {actionLoading === app.id ? <CircularProgress size={20} /> : "Approve"}
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => app.id && handleReject(app.id)}
                              disabled={actionLoading === app.id}
                            >
                              Reject
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
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
          Welcome to FastFunding
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph sx={{ maxWidth: 800 }}>
          Your comprehensive solution for managing loans efficiently and effectively.
        </Typography>

        <Grid container spacing={4} mt={1}>
          <Grid size={12}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold" color="#1e293b">
                  About Our System
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, color: "#475569" }}>
                  FastFunding is designed to streamline the entire loan lifecycle, from application to repayment.
                  Whether you are looking to simulate loan scenarios, apply for a new loan, track your application status, or manage your payments,
                  FastFunding provides a user-friendly and secure platform to meet your financial needs.
                </Typography>

                <Box sx={{ mt: 3, bgcolor: "#f8fafc", p: 3, borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    Explore our features:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Simulation:</strong> Calculate payments and visualize amortization schedules.
                      </Typography>
                      <Typography variant="body2">
                        <strong>Loan Application:</strong> Apply for new loans with ease.
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Loan Status:</strong> Track the progress of your applications in real-time.
                      </Typography>
                      <Typography variant="body2">
                        <strong>Loan Payment:</strong> Manage and make payments securely.
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
