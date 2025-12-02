// src/pages/Payment.tsx
import React from "react";
import {
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
} from "@mui/material";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Luhn algorithm for card number validation
const luhnCheck = (value: string): boolean => {
  let sum = 0;
  let shouldDouble = false;

  for (let i = value.length - 1; i >= 0; i--) {
    let digit = parseInt(value[i], 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

// Yup validation schema
const PaymentSchema = Yup.object({
  loanNumber: Yup.string().required("Loan Number is required"),

  customerName: Yup.string()
    .required("Customer Name is required")
    .min(3, "Name must be at least 3 characters"),

  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be positive"),

  cardName: Yup.string()
    .required("Name on Card is required")
    .min(3, "Cardholder name too short"),

  cardNumber: Yup.string()
    .required("Card Number is required")
    .matches(/^\d+$/, "Only digits allowed")
    .min(13, "Card number must be at least 13 digits")
    .max(19, "Card number must be at most 19 digits")
    .test("luhn-check", "Invalid card number", (value) =>
      value ? luhnCheck(value) : false
    ),

  expiry: Yup.string()
    .required("Expiry Date is required")
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format must be MM/YY"),

  cvv: Yup.string()
    .required("CVV is required")
    .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

// Initial values
const initialValues = {
  loanNumber: "",
  customerName: "",
  amount: "",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

const Payment: React.FC = () => {
  const handleSubmit = (values: typeof initialValues) => {
    console.log("PAYMENT SUBMITTED (TODO)");
    console.log(values);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
          Payment Information
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={PaymentSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <Grid container spacing={3}>
                {/* Loan Number */}
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    label="Loan Number"
                    name="loanNumber"
                    fullWidth
                    error={touched.loanNumber && Boolean(errors.loanNumber)}
                    helperText={<ErrorMessage name="loanNumber" />}
                  />
                </Grid>

                {/* Customer Name */}
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    label="Customer Name"
                    name="customerName"
                    fullWidth
                    error={touched.customerName && Boolean(errors.customerName)}
                    helperText={<ErrorMessage name="customerName" />}
                  />
                </Grid>

                {/* Amount */}
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    label="Amount to Pay"
                    name="amount"
                    type="number"
                    fullWidth
                    error={touched.amount && Boolean(errors.amount)}
                    helperText={<ErrorMessage name="amount" />}
                  />
                </Grid>

                {/* Name on Card */}
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    label="Name on Card"
                    name="cardName"
                    fullWidth
                    error={touched.cardName && Boolean(errors.cardName)}
                    helperText={<ErrorMessage name="cardName" />}
                  />
                </Grid>

                {/* Card Number */}
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    label="Card Number"
                    name="cardNumber"
                    fullWidth
                    inputProps={{ maxLength: 19 }}
                    error={touched.cardNumber && Boolean(errors.cardNumber)}
                    helperText={<ErrorMessage name="cardNumber" />}
                  />
                </Grid>

                {/* Expiry + CVV */}
                <Grid item xs={8}>
                  <Field
                    as={TextField}
                    label="Expiry Date (MM/YY)"
                    name="expiry"
                    fullWidth
                    error={touched.expiry && Boolean(errors.expiry)}
                    helperText={<ErrorMessage name="expiry" />}
                  />
                </Grid>

                <Grid item xs={4}>
                  <Field
                    as={TextField}
                    label="CVV"
                    name="cvv"
                    type="password"
                    fullWidth
                    inputProps={{ maxLength: 4 }}
                    error={touched.cvv && Boolean(errors.cvv)}
                    helperText={<ErrorMessage name="cvv" />}
                  />
                </Grid>

                {/* Pay Button */}
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    type="submit"
                    sx={{
                      mt: 2,
                      py: 1,
                      background: "linear-gradient(90deg, #1e3a8a, #2563eb)",
                      color: "#fff",
                      fontWeight: 600,
                      borderRadius: 2,
                      "&:hover": {
                        background: "linear-gradient(90deg, #1e40af, #1d4ed8)",
                      },
                    }}
                  >
                    Pay Now
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default Payment;
