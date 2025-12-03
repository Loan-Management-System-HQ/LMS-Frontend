import React, { useContext } from "react";
import { Box, Typography, Card, CardContent, Grid, Container, Button } from "@mui/material";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

const Dashboard: React.FC = () => {
  const { isStaff } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
            Welcome to FastFunding
          </Typography>
          {isStaff && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Shield size={20} />}
              onClick={() => navigate("/home/staff")}
            >
              Go to Staff Dashboard
            </Button>
          )}
        </Box>
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
