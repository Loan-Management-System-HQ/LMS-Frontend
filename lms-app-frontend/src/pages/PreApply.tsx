// src/pages/PreApply.tsx
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack
} from "@mui/material";

const PreApply: React.FC = () => {
  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState("");
  const [rate, setRate] = useState("");

  return (
    <Box
      sx={{
        maxWidth: 900,
        margin: "2rem auto",
        px: 2,
      }}
    >
      <Card
        sx={{
          p: 3,
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            fontWeight={700}
            mb={3}
            textAlign="center"
          >
            Loan Pre-Application
          </Typography>

          {/* Form fields */}
          <Stack spacing={3}>
            <TextField
              label="Loan Amount"
              type="number"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <TextField
              label="Period (months)"
              type="number"
              fullWidth
              value={months}
              onChange={(e) => setMonths(e.target.value)}
            />

            <TextField
              label="Proposed Interest Rate (%)"
              type="number"
              fullWidth
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />

            {/* Apply button (inactive for now) */}
            <Button
              variant="contained"
              size="large"
              sx={{
                py: 1.2,
                borderRadius: 2,
                backgroundColor: "#2563eb",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#1e40af" },
              }}
              onClick={() => {
                // TODO: Hook up later
                console.log("Apply button clicked (not implemented yet)");
              }}
            >
              Apply
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PreApply;
