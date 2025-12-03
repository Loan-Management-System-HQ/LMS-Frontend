// src/pages/PreApply.tsx
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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
  const formik = useFormik({
    initialValues: {
      amount: "",
      months: "",
      rate: "",
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .required("Amount is required")
        .positive("Amount must be positive")
        .typeError("Amount must be a number"),
      months: Yup.number()
        .required("Period is required")
        .positive("Period must be positive")
        .integer("Period must be an integer")
        .typeError("Period must be a number"),
      rate: Yup.number()
        .required("Rate is required")
        .positive("Rate must be positive")
        .typeError("Rate must be a number"),
    }),
    onSubmit: (values) => {
      // TODO: Hook up later
      console.log("Apply button clicked (not implemented yet)", values);
    },
  });

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
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Loan Amount"
                name="amount"
                type="number"
                fullWidth
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
              />

              <TextField
                label="Period (months)"
                name="months"
                type="number"
                fullWidth
                value={formik.values.months}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.months && Boolean(formik.errors.months)}
                helperText={formik.touched.months && formik.errors.months}
              />

              <TextField
                label="Proposed Interest Rate (%)"
                name="rate"
                type="number"
                fullWidth
                value={formik.values.rate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.rate && Boolean(formik.errors.rate)}
                helperText={formik.touched.rate && formik.errors.rate}
              />

              {/* Apply button (inactive for now) */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!formik.isValid || !formik.dirty}
                sx={{
                  py: 1.2,
                  borderRadius: 2,
                  backgroundColor: "#2563eb",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#1e40af" },
                }}
              >
                Apply
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PreApply;
