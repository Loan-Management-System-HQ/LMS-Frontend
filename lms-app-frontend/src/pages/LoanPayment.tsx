import React, { useMemo } from "react";
import { generateSchedule } from "../utils/SimCalc";
import "./LoanPayment.css";

const LoanPayment: React.FC = () => {
    // Constants as per requirement
    const loanAmount = 200000;
    const periodMonths = 360;
    const interestRate = 7.2;
    const loanNumber = "LN-2025-8842"; // Constant loan number

    // Generate full schedule
    const { schedule } = useMemo(() => {
        return generateSchedule(
            { amount: loanAmount, annualRate: interestRate, months: periodMonths },
            {}
        );
    }, []);

    // We only want to show the first 11 rows (10 paid + 1 unpaid)
    // Row indices 0-9 are paid. Row index 10 is the next payment.
    const displayRows = schedule.slice(0, 11);

    const formatCurrency = (val: number) =>
        val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="loan-payment-container">
            <div className="loan-header">
                <span className="loan-number">Loan Number: {loanNumber}</span>
                <div>
                    <strong>Principal:</strong> ${formatCurrency(loanAmount)} |{" "}
                    <strong>Rate:</strong> {interestRate}% |{" "}
                    <strong>Term:</strong> {periodMonths} Months
                </div>
            </div>

            <div className="payment-table-container">
                <table className="payment-table">
                    <thead>
                        <tr>
                            <th>Period</th>
                            <th>Beginning Balance</th>
                            <th>Interest</th>
                            <th>Paid Amount</th>
                            <th>Ending Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayRows.map((row, index) => {
                            const isLastRow = index === displayRows.length - 1;

                            // For the last row (11th row, index 10), we show the button.
                            // For previous rows, we show the calculated payment.

                            return (
                                <tr key={row.period}>
                                    <td>{row.period}</td>
                                    <td>{formatCurrency(row.beginning)}</td>
                                    <td>{formatCurrency(row.interest)}</td>
                                    <td>
                                        {isLastRow ? (
                                            <button
                                                className="pay-btn"
                                                onClick={() => alert(`Initiating payment for Period ${row.period}`)}
                                            >
                                                Payment
                                            </button>
                                        ) : (
                                            formatCurrency(row.payment)
                                        )}
                                    </td>
                                    <td>{formatCurrency(row.ending)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LoanPayment;
