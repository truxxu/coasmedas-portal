import { normalizeMoney, normalizeString } from "@/types/api/common";
import type {
  BalanceSummary,
  MovementItem,
  SavingsAccountResponse,
  CreditAccountResponse,
  InvestmentAccountResponse,
  ContributionsResponse,
  ProtectionAccountResponse,
} from "@/types/api/products";
import type { Transaction, TransactionType } from "@/src/types/transaction";
import type { SavingsProduct } from "@/src/types/savings";
import type {
  ObligacionProduct,
  ObligacionStatus,
} from "@/src/types/obligaciones";
import type {
  InversionProduct,
  InversionStatus,
} from "@/src/types/inversiones";
import type { AportesProduct } from "@/src/types/products";
import type {
  ProteccionProduct,
  ProteccionStatus,
} from "@/src/types/proteccion";
import { parseApiDate, parseApiTime, getTodayDate } from "./dates";

// ─── Balance Summary ───

/**
 * Extract the consolidated BalanceSummary from the API response array.
 * Returns parsed numeric balances per product category.
 */
export function parseBalanceSummary(items: BalanceSummary[]): {
  aportes: number;
  ahorro: number;
  inversion: number;
  credito: number;
  proteccion: number;
} {
  const raw = items[0] ?? {
    aportes: "0",
    ahorro: "0",
    inversion: "0",
    credito: "0",
    proteccion: "0",
  };
  return {
    aportes: normalizeMoney(raw.aportes),
    ahorro: normalizeMoney(raw.ahorro),
    inversion: normalizeMoney(raw.inversion),
    credito: normalizeMoney(raw.credito),
    proteccion: normalizeMoney(raw.proteccion),
  };
}

// ─── Movement → Transaction ───

export function mapMovementToTransaction(
  item: MovementItem,
  index: number,
): Transaction {
  const amount = normalizeMoney(item.valorTransaccion);
  const tipo = item.tipoTransaccion.toUpperCase();
  const type: TransactionType = tipo === "C" || tipo === "CR" ? "CREDITO" : "DEBITO";
  const signedAmount = type === "DEBITO" ? -Math.abs(amount) : Math.abs(amount);

  const date = parseApiDate(item.fechaTransaccion);
  const time = parseApiTime(item.horaTransaccion);

  return {
    id: item.referencia || String(index + 1),
    description: item.descripcion.replace(/_+$/, '').trim(),
    date: time ? `${date} ${time}` : date,
    amount: signedAmount,
    type,
  };
}

export function mapMovements(items: MovementItem[]): Transaction[] {
  return items.map(mapMovementToTransaction).sort((a, b) => b.date.localeCompare(a.date));
}

// ─── Savings ───

export function mapSavingsResponse(
  item: SavingsAccountResponse,
): SavingsProduct {
  return {
    id: item.idCuenta,
    title: item.nombreProducto,
    accountType: item.nombreProducto,
    productNumber: item.numeroCuenta,
    balance: normalizeMoney(item.saldoDisponible),
    status: "activo",
  };
}

export function mapSavingsProducts(
  items: SavingsAccountResponse[],
): SavingsProduct[] {
  return items.map(mapSavingsResponse);
}

// ─── Credits / Obligaciones ───

export function mapCreditResponse(
  item: CreditAccountResponse,
): ObligacionProduct {
  const diasMora = normalizeMoney(item.diasMora);
  const status: ObligacionStatus = diasMora > 0 ? "en_mora" : "al_dia";

  return {
    id: item.idCuenta,
    title: item.nombreProducto,
    productNumber: item.numeroCuenta,
    productPrefix: item.tipoCartera ? `${item.tipoCartera}-` : undefined,
    currentBalance: normalizeMoney(item.saldo),
    status,
    disbursedAmount: normalizeMoney(item.pagoTotal),
    nextPaymentDate: parseApiDate(item.fechaPago),
    nextPaymentAmount: normalizeMoney(item.pagoMinimo),
  };
}

export function mapCreditProducts(
  items: CreditAccountResponse[],
): ObligacionProduct[] {
  return items.map(mapCreditResponse);
}

// ─── Investments / Inversiones ───

export function mapInvestmentResponse(
  item: InvestmentAccountResponse,
): InversionProduct {
  const maturityDate = parseApiDate(item.fechaVencimiento);
  const today = getTodayDate();
  const status: InversionStatus =
    maturityDate && maturityDate < today ? "vencido" : "activo";

  const cobisCode = normalizeString(item.codigoProductoCobis);
  const prefix = cobisCode === "4" ? "PAC-" : "DTA-";

  return {
    id: item.idCuenta,
    title: item.nombreProducto,
    productNumber: item.numeroCuenta,
    productPrefix: prefix,
    amount: normalizeMoney(item.saldoTotal),
    status,
    interestRate: `${normalizeMoney(item.tasaEfectiva)}% E.A`,
    termDays: normalizeMoney(item.plazo),
    creationDate: "",
    maturityDate,
  };
}

export function mapInvestmentProducts(
  items: InvestmentAccountResponse[],
): InversionProduct[] {
  return items.map(mapInvestmentResponse);
}

// ─── Contributions / Aportes ───

export function mapContributionsResponse(
  data: ContributionsResponse,
): AportesProduct {
  const a = data.aportes;
  const b = data.ahorroPermanente;
  return {
    planName: "Plan de Aportes",
    productNumber: a.numeroCuentaAportes,
    totalBalance: normalizeMoney(a.saldoTotalAportes),
    paymentDeadline: parseApiDate(a.fechaCubrimientoAportes),
    detalleAportes: {
      vigentes: normalizeMoney(a.aportesVigentes),
      enMora: normalizeMoney(a.aportesMora),
      fechaCubrimiento: parseApiDate(a.fechaCubrimientoAportes),
    },
    detalleFondos: {
      vigentes: normalizeMoney(a.fondosSolidariosVigentes),
      enMora: normalizeMoney(a.fondosSolidariosMora),
      fechaCubrimiento: parseApiDate(a.fechaCubrimientoFondosSolidarios),
    },
    totalPermanente: normalizeMoney(b?.saldoTotalAhorroPermanente),
  };
}

// ─── Protection / Proteccion ───

export function mapProtectionResponse(
  item: ProtectionAccountResponse,
): ProteccionProduct {
  const diasMora = normalizeMoney(item.diasMora);
  const status: ProteccionStatus = diasMora > 0 ? "inactivo" : "activo";

  return {
    id: item.idCuenta,
    title: item.nombreProducto,
    productNumber: item.numeroCuenta,
    status,
    minimumPayment: normalizeMoney(item.pagoMinimo),
    paymentDeadline: parseApiDate(item.fechaPago),
    annualPayment: normalizeMoney(item.pagoTotal),
  };
}

export function mapProtectionProducts(
  items: ProtectionAccountResponse[],
): ProteccionProduct[] {
  return items.map(mapProtectionResponse);
}
