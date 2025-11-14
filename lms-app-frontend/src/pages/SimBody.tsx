// src/pages/SimBody.tsx
import React, { useState, useMemo, ChangeEvent } from "react";
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
import "../App.css";

import type { LoanInputs } from "../interfaces/LoanInputs.ts"
import type {ScheduleRow} from "../interfaces/ScheduleRow.ts"
import { OverrideMap, generateSchedule } from "../utils/SimCalc.ts";

export default function Body() {
  const [amount, setAmount] = useState("200000");
  const [annualRate, setAnnualRate] = useState("7.2");
  const [months, setMonths] = useState("360");
  const [show, setShow] = useState(true);
  const [overrides, setOverrides] = useState<OverrideMap>({});

  const formatMoney = (v: number | string) =>
    Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatCurrency = (v: number | string) => `$${formatMoney(v)}`;

  const handleOverrideChange = (k: number, val: string) => {
    const s = val.trim();
    if (s === "") {
      setOverrides((prev: any) => {
        const next = { ...prev };
        delete next[k];
        return next;
      });
      return;
    }
    const n = Number(s);
    if (Number.isFinite(n) && n >= 0) {
      setOverrides((o: any) => ({ ...o, [k]: n }));
    }
  };

  const clearOverrides = () => setOverrides({});

  const { basePMT, schedule } = useMemo(() => {
    const inputs: LoanInputs = {
      amount: Number(amount),
      annualRate: Number(annualRate),
      months: Number(months),
    };
    return generateSchedule(inputs, overrides);
  }, [amount, annualRate, months, overrides]);

  const totalInterest = useMemo(() => schedule.reduce((acc: any, r: { interest: any; }) => acc + r.interest, 0), [schedule]);

  const chartData = useMemo(() => schedule.map((r: { period: any; ending: any; }) => ({ period: r.period, ending: r.ending })), [schedule]);

  return (
    <div className="body-container">
      <div className="card-row">
        <label className="field">
          <span>Amount</span>
          <input type="number" min="0" step="100" value={amount} onChange={(e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)} />
        </label>
        <label className="field">
          <span>Annual Rate (%)</span>
          <input type="number" min="0" step="0.01" value={annualRate} onChange={(e: ChangeEvent<HTMLInputElement>) => setAnnualRate(e.target.value)} />
        </label>
        <label className="field">
          <span>Period (months)</span>
          <input type="number" min="1" step="1" value={months} onChange={(e: ChangeEvent<HTMLInputElement>) => setMonths(e.target.value)} />
        </label>
        <div className="button-row">
          <button className="btn-primary" onClick={() => setShow(true)}>Calculate</button>
          <button className="btn-ghost" onClick={() => setShow(false)}>Hide Table</button>
          <button className="btn-warn" onClick={clearOverrides}>Clear Overrides</button>
        </div>
      </div>

      {show && schedule.length > 0 && (
        <>
          <div className="chip-row">
            <div className="chip"><b>Baseline PMT:</b> {formatCurrency(basePMT)}</div>
            <div className="chip"><b>Total Interest:</b> {formatCurrency(totalInterest)}</div>
          </div>

          <div className="chart-card">
            <h3>Ending Balance by Period</h3>
            <div className="chart-container">
              <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                  <defs>
                    <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0.08} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `$${Math.round(v).toLocaleString()}`} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => [formatCurrency(v), "Ending Balance"]} labelFormatter={(l) => `Period ${l}`} />
                  <Area type="monotone" dataKey="ending" stroke="#2563eb" fill="url(#balanceFill)" />
                  <Line type="monotone" dataKey="ending" strokeWidth={2} dot={false} stroke="#1e40af" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Beginning</th>
                  <th>Interest</th>
                  <th>Payment (editable)</th>
                  <th>Ending</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.period}>
                    <td>{row.period}</td>
                    <td>{formatCurrency(row.beginning)}</td>
                    <td>{formatCurrency(row.interest)}</td>
                    <td>
                      <div className="override-cell">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={overrides[row.period] ?? ""}
                          placeholder={formatMoney(row.suggested)}
                          onChange={(e) => handleOverrideChange(row.period, e.target.value)}
                        />
                        {overrides[row.period] != null && (
                          <button className="btn-x" onClick={() => handleOverrideChange(row.period, "")}>✕</button>
                        )}
                      </div>
                    </td>
                    <td>{formatCurrency(row.ending)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
