import React, { useState, useMemo } from "react";

import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Stack,
  Chip,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TablePagination,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import type { LoanInputs } from "../interfaces/LoanInputs";
import type { ScheduleRow } from "../interfaces/ScheduleRow";
import { generateSchedule } from "../utils/SimCalc";
import type { OverrideMap } from "../utils/SimCalc";

const formatMoney = (v: number | string) =>
  Number(v).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatCurrency = (v: number | string) => `$${formatMoney(v)}`;

export default function Body() {
  const navigate = useNavigate();

  const [show, setShow] = useState(true);
  const [overrides, setOverrides] = useState<OverrideMap>({});

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const formik = useFormik({
    initialValues: {
      amount: "200000",
      annualRate: "7.2",
      months: "360",
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .required("Amount is required")
        .positive("Amount must be positive")
        .typeError("Amount must be a number"),
      annualRate: Yup.number()
        .required("Rate is required")
        .positive("Rate must be positive")
        .typeError("Rate must be a number"),
      months: Yup.number()
        .required("Months is required")
        .positive("Months must be positive")
        .integer("Months must be an integer")
        .typeError("Months must be a number"),
    }),
    onSubmit: (_values) => {
      setShow(true);
    },
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOverrideChange = (k: number, val: string) => {
    const s = val.trim();
    if (s === "") {
      setOverrides((prev) => {
        const next = { ...prev };
        delete next[k];
        return next;
      });
      return;
    }
    const n = Number(s);
    if (Number.isFinite(n) && n >= 0) {
      setOverrides((o) => ({ ...o, [k]: n }));
    }
  };

  const clearOverrides = () => setOverrides({});

  const { basePMT, schedule } = useMemo<{
    basePMT: number;
    schedule: ScheduleRow[];
  }>(() => {
    // Only calculate if values are valid numbers
    const amount = Number(formik.values.amount);
    const annualRate = Number(formik.values.annualRate);
    const months = Number(formik.values.months);

    if (isNaN(amount) || isNaN(annualRate) || isNaN(months)) {
      return { basePMT: 0, schedule: [] };
    }

    const inputs: LoanInputs = {
      amount,
      annualRate,
      months,
    };
    return generateSchedule(inputs, overrides);
  }, [formik.values.amount, formik.values.annualRate, formik.values.months, overrides]);

  const totalInterest = useMemo(
    () => schedule.reduce((acc, r) => acc + r.interest, 0),
    [schedule]
  );

  const chartData = useMemo(
    () => schedule.map((r) => ({ period: r.period, ending: r.ending })),
    [schedule]
  );

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        mt: 2,
        mb: 4,
        px: { xs: 2, md: 0 },
      }}
    >
      <Card
        elevation={4}
        sx={{
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Amortization Simulator
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            Adjust the loan amount, interest rate, and term. You can override any
            monthly payment and the remaining schedule will be recalculated so the
            loan still ends on time.
          </Typography>

          {/* Inputs + Buttons */}
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Amount"
                  name="amount"
                  type="number"
                  fullWidth
                  size="small"
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.amount && Boolean(formik.errors.amount)}
                  helperText={formik.touched.amount && formik.errors.amount}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Annual Rate (%)"
                  name="annualRate"
                  type="number"
                  fullWidth
                  size="small"
                  value={formik.values.annualRate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.annualRate && Boolean(formik.errors.annualRate)}
                  helperText={formik.touched.annualRate && formik.errors.annualRate}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Period (months)"
                  name="months"
                  type="number"
                  fullWidth
                  size="small"
                  value={formik.values.months}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.months && Boolean(formik.errors.months)}
                  helperText={formik.touched.months && formik.errors.months}
                />
              </Grid>

              <Grid size={12} sx={{ mt: 2 }}>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="flex-end"
                  flexWrap="wrap"
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!formik.isValid}
                  >
                    Calculate
                  </Button>

                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setShow(false)}
                  >
                    Hide Table
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    onClick={clearOverrides}
                  >
                    Clear
                  </Button>

                  {/* New: I want a loan */}
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ textTransform: "none", fontWeight: 600 }}
                    onClick={() => navigate("/home/loan-application")}
                  >
                    Apply for Loan
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>

          {show && schedule.length > 0 && (
            <>
              {/* Chips */}
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                mt={3}
                mb={2}
              >
                <Chip
                  color="primary"
                  variant="outlined"
                  label={`Baseline PMT: ${formatCurrency(basePMT)}`}
                />
                <Chip
                  color="secondary"
                  variant="outlined"
                  label={`Total Interest: ${formatCurrency(totalInterest)}`}
                />
              </Stack>

              {/* Chart */}
              <Card variant="outlined" sx={{ borderRadius: 3, mt: 1, mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} mb={1}>
                    Ending Balance by Period
                  </Typography>
                  <Box sx={{ width: "100%", height: 320, minHeight: 320, minWidth: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData}
                        margin={{
                          top: 10,
                          right: 20,
                          bottom: 10,
                          left: 0,
                        }}
                      >
                        <defs>
                          <linearGradient
                            id="balanceFill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#2563eb"
                              stopOpacity={0.35}
                            />
                            <stop
                              offset="100%"
                              stopColor="#2563eb"
                              stopOpacity={0.08}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                        <YAxis
                          tickFormatter={(v) =>
                            `$${Math.round(v).toLocaleString()}`
                          }
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                          formatter={(v: number) => [
                            formatCurrency(v),
                            "Ending Balance",
                          ]}
                          labelFormatter={(l) => `Period ${l}`}
                        />
                        <Area
                          type="monotone"
                          dataKey="ending"
                          stroke="#2563eb"
                          fill="url(#balanceFill)"
                        />
                        <Line
                          type="monotone"
                          dataKey="ending"
                          strokeWidth={2}
                          dot={false}
                          stroke="#1e40af"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>

              {/* Table */}
              <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Period</TableCell>
                      <TableCell>Beginning</TableCell>
                      <TableCell>Interest</TableCell>
                      <TableCell>Payment (editable)</TableCell>
                      <TableCell>Ending</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {schedule
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => (
                        <TableRow key={row.period}>
                          <TableCell>{row.period}</TableCell>
                          <TableCell>{formatCurrency(row.beginning)}</TableCell>
                          <TableCell>{formatCurrency(row.interest)}</TableCell>
                          <TableCell>
                            <Stack
                              direction="row"
                              spacing={0.5}
                              alignItems="center"
                            >
                              <TextField
                                type="number"
                                size="small"
                                value={overrides[row.period] ?? ""}
                                placeholder={formatMoney(row.suggested)}
                                onChange={(e) =>
                                  handleOverrideChange(
                                    row.period,
                                    e.target.value
                                  )
                                }
                                inputProps={{ min: 0, step: 0.01 }}
                                sx={{ width: 120 }}
                              />
                              {overrides[row.period] != null && (
                                <IconButton
                                  color="error"
                                  size="small"
                                  onClick={() =>
                                    handleOverrideChange(row.period, "")
                                  }
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Stack>
                          </TableCell>
                          <TableCell>{formatCurrency(row.ending)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[20, 50, 100, 200]}
                component="div"
                count={schedule.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
