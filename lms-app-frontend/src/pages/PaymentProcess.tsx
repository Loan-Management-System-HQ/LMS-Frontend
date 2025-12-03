import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Box, Typography, Alert } from "@mui/material";
import "./PaymentProcess.css";
import loanService from "../services/loanService";

interface PaymentFormValues {
    cardName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
}

interface PaymentState {
    amount?: number;
    loanNumber?: string;
    period?: number;
    installmentId?: string;
}

const PaymentProcess: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { amount, loanNumber, period, installmentId } = (location.state as PaymentState) || {};

    const initialValues: PaymentFormValues = {
        cardName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
    };

    const validationSchema = Yup.object({
        cardName: Yup.string().required("Cardholder name is required"),
        cardNumber: Yup.string()
            .matches(/^[0-9]{16}$/, "Card number must be 16 digits")
            .required("Card number is required"),
        expiryDate: Yup.string()
            .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Invalid date format (MM/YY)")
            .required("Expiry date is required"),
        cvv: Yup.string()
            .matches(/^[0-9]{3,4}$/, "CVV must be 3 or 4 digits")
            .required("CVV is required"),
    });

    const handleSubmit = async (values: PaymentFormValues, { setSubmitting, setStatus }: any) => {
        if (!installmentId || !amount) {
            setStatus("Invalid payment details.");
            setSubmitting(false);
            return;
        }

        try {
            await loanService.makePayment(installmentId, amount);
            alert(`Payment Successful! Paid with card ending in ${values.cardNumber.slice(-4)}`);
            navigate("/home/loan-payment");
        } catch (err) {
            console.error("Payment failed:", err);
            setStatus("Payment failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <div className="payment-process-container">
                <Typography variant="h5" className="payment-title">
                    Secure Payment
                </Typography>

                {location.state?.error && (
                    <Alert severity="error" sx={{ mb: 2 }}>{location.state.error}</Alert>
                )}

                {amount && (
                    <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 1, border: "1px solid", borderColor: "grey.200" }}>
                        <Typography variant="subtitle1" gutterBottom>
                            <strong>Loan Number:</strong> {loanNumber}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            <strong>Period:</strong> {period}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                            <strong>Amount Due:</strong> ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Typography>
                    </Box>
                )}

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, errors, touched, status }) => (
                        <Form className="payment-form">
                            {status && <Alert severity="error" sx={{ mb: 2 }}>{status}</Alert>}
                            <div className="form-group">
                                <label htmlFor="cardName" className="form-label">
                                    Cardholder Name
                                </label>
                                <Field
                                    type="text"
                                    name="cardName"
                                    className={`form-input ${errors.cardName && touched.cardName ? "error" : ""
                                        }`}
                                    placeholder="John Doe"
                                />
                                <ErrorMessage
                                    name="cardName"
                                    component="div"
                                    className="error-message"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="cardNumber" className="form-label">
                                    Card Number
                                </label>
                                <Field
                                    type="text"
                                    name="cardNumber"
                                    className={`form-input ${errors.cardNumber && touched.cardNumber ? "error" : ""
                                        }`}
                                    placeholder="1234567812345678"
                                    maxLength={16}
                                />
                                <ErrorMessage
                                    name="cardNumber"
                                    component="div"
                                    className="error-message"
                                />
                            </div>

                            <div className="card-row">
                                <div className="form-group">
                                    <label htmlFor="expiryDate" className="form-label">
                                        Expiry Date (MM/YY)
                                    </label>
                                    <Field
                                        type="text"
                                        name="expiryDate"
                                        className={`form-input ${errors.expiryDate && touched.expiryDate ? "error" : ""
                                            }`}
                                        placeholder="MM/YY"
                                        maxLength={5}
                                    />
                                    <ErrorMessage
                                        name="expiryDate"
                                        component="div"
                                        className="error-message"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="cvv" className="form-label">
                                        CVV
                                    </label>
                                    <Field
                                        type="text"
                                        name="cvv"
                                        className={`form-input ${errors.cvv && touched.cvv ? "error" : ""
                                            }`}
                                        placeholder="123"
                                        maxLength={4}
                                    />
                                    <ErrorMessage
                                        name="cvv"
                                        component="div"
                                        className="error-message"
                                    />
                                </div>
                            </div>

                            <div className="payment-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => navigate("/home/loan-payment")}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Processing..." : "Pay Now"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Box>
    );
};

export default PaymentProcess;
