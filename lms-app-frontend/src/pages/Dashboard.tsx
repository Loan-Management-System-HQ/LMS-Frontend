import React from "react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Welcome to FastFunding
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Your comprehensive solution for managing loans efficiently and effectively.
      </Typography>

      <Grid container spacing={3} mt={2}>
        <Grid item xs={12}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                About Our System
              </Typography>
              <Typography variant="body1" paragraph>
                FastFunding is designed to streamline the entire loan lifecycle, from application to repayment.
                Whether you are looking to simulate loan scenarios, apply for a new loan, track your application status, or manage your payments,
                FastFunding provides a user-friendly and secure platform to meet your financial needs.
              </Typography>
              <Typography variant="body1" component="div">
                Explore our features using the menu on the left:
                <ul>
                  <li>
                    <strong>Simulation:</strong> Calculate payments and visualize amortization schedules.
                  </li>
                  <li>
                    <strong>Loan Application:</strong> Apply for new loans with ease.
                  </li>
                  <li>
                    <strong>Loan Status:</strong> Track the progress of your applications in real-time.
                  </li>
                  <li>
                    <strong>Loan Payment:</strong> Manage and make payments securely.
                  </li>
                </ul>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
