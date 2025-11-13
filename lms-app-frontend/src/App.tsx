import React, { useMemo, useState, ChangeEvent } from "react";
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
import "./App.css";

interface ScheduleRow {
  period: number;
  beginning: number;
  interest: number;
  payment: number;
  ending: number;
  suggested: number;
}

export default function App() {
  const [amount, setAmount] = useState<string>("200000");
  const [annualRate, setAnnualRate] = useState<string>("7.2");
  const [months, setMonths] = useState<string>("360");
  const [show, setShow] = useState<boolean>(true);
  const [overrides, setOverrides] = useState<Record<number, number>>({});

  const money = (v: number | string): string =>
    Number(v).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const currency = (v: number | string): string => `$${money(v)}`;

  const setOverride = (k: number, val: string) => {
    const s = val.trim();
    if (s === "") {
      const next = { ...overrides };
      delete next[k];
      setOverrides(next);
      return;
    }
    const n = Number(s);
    if (Number.isFinite(n) && n >= 0) {
      setOverrides((o) => ({ ...o, [k]: n }));
    }
  };

  const clearOverrides = () => setOverrides({});

  const { basePMT, schedule } = useMemo(() => {
    const PV = Number(amount);
    const n = Math.max(0, Math.floor(Number(months)));
    const r = Number(annualRate) / 100 / 12;

    if (!(PV > 0) || !(n > 0) || Number.isNaN(r)) {
      return { basePMT: 0, schedule: [] as ScheduleRow[] };
    }

    const pmt = (pv: number, rate: number, m: number): number => {
      if (m <= 0) return 0;
      if (Math.abs(rate) < 1e-12) return pv / m;
      return (rate * pv) / (1 - Math.pow(1 + rate, -m));
    };

    const rows: ScheduleRow[] = [];
    let bal = PV;
    let remaining = n;
    let activePMT = pmt(bal, r, remaining);

    for (let k = 1; k <= n; k++) {
      const begin = bal;
      const interest = r * begin;

      let pay = overrides[k] != null ? Number(overrides[k]) : activePMT;
      const maxToClose = begin * (1 + r);
      if (pay > maxToClose) pay = maxToClose;

      const principal = pay - interest;
      let end = begin + interest - pay;
      if (end < 1e-8) end = 0;

      rows.push({
        period: k,
        beginning: begin,
        interest,
        payment: pay,
        ending: end,
        suggested: activePMT,
      });

      bal = end;
      remaining = n - k;
      if (remaining > 0) {
        activePMT = pmt(bal, r, remaining);
      }
    }

    return { basePMT: pmt(PV, r, n), schedule: rows };
  }, [amount, annualRate, months, overrides]);

  const totalInterest = useMemo(
    () => schedule.reduce((acc, r) => acc + (r.interest || 0), 0),
    [schedule]
  );

  const chartData = useMemo(
    () => schedule.map((row) => ({ period: row.period, ending: row.ending })),
    [schedule]
  );

  return (
    <div className="app-container">
      <h1>📊 Amortization (One-Off Payment Overrides)</h1>
      <p className="subtitle">
        Type a custom payment in any month. That payment applies{" "}
        <b>only for that month</b>, then a new equal payment is recalculated so
        the loan still ends on the original month.
      </p>

      <div className="card-row">
        <label className="field">
          <span>Amount</span>
          <input
            type="number"
            min="0"
            step="100"
            value={amount}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAmount(e.target.value)
            }
          />
        </label>
        <label className="field">
          <span>Annual Rate (%)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={annualRate}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAnnualRate(e.target.value)
            }
          />
        </label>
        <label className="field">
          <span>Period (months)</span>
          <input
            type="number"
            min="1"
            step="1"
            value={months}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setMonths(e.target.value)
            }
          />
        </label>

        <div className="button-row">
          <button className="btn-primary" onClick={() => setShow(true)}>
            Calculate
          </button>
          <button className="btn-ghost" onClick={() => setShow(false)}>
            Hide Table
          </button>
          <button className="btn-warn" onClick={clearOverrides}>
            Clear Overrides
          </button>
        </div>
      </div>

      {show && schedule.length > 0 && (
        <>
          <div className="chip-row">
            <div className="chip">
              <b>Baseline Monthly Payment:</b> ${money(basePMT)}
            </div>
            <div className="chip">
              <b>Total Interest:</b> ${money(totalInterest)}
            </div>
          </div>

          <div className="chart-card">
            <h3>Ending Balance by Period</h3>
            <div className="chart-container">
              <ResponsiveContainer>
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
                >
                  <defs>
                    <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
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
                    tickFormatter={(v) => `$${Math.round(v).toLocaleString()}`}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value: number) => [currency(value), "Ending Balance"]}
                    labelFormatter={(label) => `Period ${label}`}
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
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Beginning Balance</th>
                  <th>Interest</th>
                  <th>Payment (editable)</th>
                  <th>Ending Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.period}>
                    <td>{row.period}</td>
                    <td>{currency(row.beginning)}</td>
                    <td>{currency(row.interest)}</td>
                    <td>
                      <div className="override-cell">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={overrides[row.period] ?? ""}
                          placeholder={money(row.suggested)}
                          onChange={(e) =>
                            setOverride(row.period, e.target.value)
                          }
                          title="One-off payment for this month"
                        />
                        {overrides[row.period] != null && (
                          <button
                            className="btn-x"
                            onClick={() => setOverride(row.period, "")}
                            title="Clear this override"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </td>
                    <td>{currency(row.ending)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="notes">
              Notes: Rate is nominal annual divided by 12. Overpayments are
              trimmed automatically. After any override, a new constant PMT is
              computed to ensure the balance reaches $0 by term.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
