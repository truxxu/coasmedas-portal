import type {
  BrebTxMovement,
  BrebTxPaymentDetail,
  ListBrebTxsRequest,
} from "@/types/api/breb";
import type {
  BrebTransaction,
  BrebTransactionDateRange,
  BrebTransactionStatus,
  BrebTransactionType,
} from "@/src/types/brebTransactionHistory";
import { maskNumber } from "./formatCurrency";

const STATE_TO_STATUS: Record<string, BrebTransactionStatus> = {
  ACSC: "exitosa",
  ACSP: "exitosa",
  ACTC: "exitosa",
  ACCP: "exitosa",
  U000: "exitosa",
  OK: "exitosa",
  RJCT: "fallida",
  CNCL: "fallida",
  TIMEOUT: "fallida",
  PDNG: "revision_en_curso",
  PROC: "revision_en_curso",
  SCHD: "revision_en_curso",
};

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.\-]/g, "");
    if (!cleaned) return null;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function normaliseStatus(state: string | undefined): BrebTransactionStatus {
  if (!state) return "exitosa";
  return STATE_TO_STATUS[state.trim().toUpperCase()] ?? "exitosa";
}

function describeProduct(
  detail: BrebTxPaymentDetail | undefined,
): string | undefined {
  if (!detail) return undefined;
  const label = detail.typeAccountDescription?.trim() || "Cuenta";
  const masked = detail.numberAccount ? maskNumber(detail.numberAccount) : "";
  return masked ? `${label} ${masked}` : label;
}

function pickKeyUsed(
  ...details: (BrebTxPaymentDetail | undefined)[]
): string | undefined {
  for (const d of details) {
    const v = d?.valueKeyCustomer?.trim();
    if (v) return v;
  }
  return undefined;
}

/**
 * Map a backend movement to the UI domain model. Direction (debit/credit) is
 * derived from whether the logged-in user matches the source or target party.
 * Returns `null` when an entry lacks the minimum fields (id + amount).
 */
export function mapBrebTxMovementToUi(
  m: BrebTxMovement,
  userDocumentNumber: string,
): BrebTransaction | null {
  const id = (m.paymentId || m.endToEndIndentification)?.trim();
  const amount = toNumber(m.amount);
  if (!id || amount === null) return null;

  const source = m.sourcePaymentDetail;
  const target = m.targetPaymentDetail;
  const userIsSource = source?.identification === userDocumentNumber;
  const userIsTarget = target?.identification === userDocumentNumber;

  // Default to debit when ambiguous (e.g. self-transfer source.id === target.id === user).
  const isDebit = userIsSource || !userIsTarget;
  const sign = isDebit ? "debit" : "credit";
  const type: BrebTransactionType = isDebit ? "envio_llave" : "recepcion_llave";

  const counterparty = isDebit ? target : source;
  const counterpartyName = counterparty?.name?.trim();
  const title = counterpartyName
    ? `${isDebit ? "Envío con Llave a" : "Recepción de Llave de"} ${counterpartyName}`
    : isDebit
      ? "Envío Bre-B"
      : "Recepción Bre-B";

  return {
    id,
    title,
    type,
    date: m.datePayment ?? new Date().toISOString(),
    amount: Math.abs(amount),
    sign,
    status: normaliseStatus(m.stateOperation),
    keyUsed: pickKeyUsed(source, target),
    sourceProduct: describeProduct(source),
    destinationProduct: describeProduct(target),
  };
}

const DATE_RANGE_DAYS: Record<BrebTransactionDateRange, number> = {
  ultimos_30: 30,
  ultimos_60: 60,
  ultimos_90: 90,
  todos: 365,
};

function toYyyymmdd(d: Date): number {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

/**
 * Build the date-range fields for `listBrebTxs` from a UI dropdown selection.
 * `todos` falls back to a 365-day window since the endpoint requires a range.
 */
export function buildDateRangeParams(
  range: BrebTransactionDateRange,
  now: Date = new Date(),
): Pick<
  ListBrebTxsRequest,
  "initialDate" | "initialHour" | "finalDate" | "finalHour"
> {
  const days = DATE_RANGE_DAYS[range];
  const start = new Date(now);
  start.setDate(start.getDate() - days);
  return {
    initialDate: toYyyymmdd(start),
    initialHour: "000000",
    finalDate: toYyyymmdd(now),
    finalHour: "235959",
  };
}
