// src/utils/SimCalc.ts
import type { LoanInputs } from "../interfaces/LoanInputs.ts"
import type {ScheduleRow} from "../interfaces/ScheduleRow.ts"

export type OverrideMap = Record<number, number>;

export const calculatePMT = (pv: number, rate: number, m: number): number => {
  if (m <= 0) return 0;
  if (Math.abs(rate) < 1e-12) return pv / m;
  return (rate * pv) / (1 - Math.pow(1 + rate, -m));
};

export const generateSchedule = (
  { amount, annualRate, months }: LoanInputs,
  overrides: OverrideMap
): { basePMT: number; schedule: ScheduleRow[] } => {
  const PV = amount;
  const n = Math.max(0, Math.floor(months));
  const r = annualRate / 100 / 12;

  if (!(PV > 0) || !(n > 0) || Number.isNaN(r)) {
    return { basePMT: 0, schedule: [] };
  }

  const rows: ScheduleRow[] = [];
  let balance = PV;
  let remaining = n;
  let activePMT = calculatePMT(balance, r, remaining);

  for (let k = 1; k <= n; k++) {
    const begin = balance;
    const interest = r * begin;

    let payment = overrides[k] ?? activePMT;
    const maxToClose = begin * (1 + r);
    if (payment > maxToClose) payment = maxToClose;

    let end = begin + interest - payment;
    if (end < 1e-8) end = 0;

    rows.push({
      period: k,
      beginning: begin,
      interest,
      payment,
      ending: end,
      suggested: activePMT,
    });

    balance = end;
    remaining = n - k;
    if (remaining > 0) {
      activePMT = calculatePMT(balance, r, remaining);
    }
  }

  return { basePMT: calculatePMT(PV, r, n), schedule: rows };
};

