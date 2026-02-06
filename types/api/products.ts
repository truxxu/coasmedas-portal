import type { UserIdentification } from './common';

// ─── Request Types ───

/**
 * Request for POST /balances.
 * Simple user identification — returns all product balances.
 */
export type BalancesRequest = UserIdentification;

/**
 * Request for POST /movements.
 * Requires product/account identifiers and a date for history lookup.
 */
export interface MovementsRequest extends UserIdentification {
  codigoProductoCobis: string;
  idCuenta: string;
  /** Format: YYYYMMDD */
  fechaConsulta: string;
  /** Required for credit products, omit for others */
  tipoCartera?: string;
  /** Pagination indicator */
  indPag?: string;
}

/**
 * Request for product-list endpoints (savings, credits, investments, contributions, protection).
 */
export interface ProductsRequest extends UserIdentification {
  /** Pagination indicator (optional per mobile evidence) */
  indPag?: string;
}

// ─── /balances Response ───

export interface BalanceItem {
  producto: string;
  saldo: string | number;
}

// ─── /movements Response ───

export interface MovementItem {
  /** Format: YYYYMMDD */
  fechaTransaccion: string;
  /** Format: HHMMSS */
  horaTransaccion: string;
  referencia: string;
  /** DB = debit, CR = credit */
  tipoTransaccion: string;
  valorTransaccion: string | number;
  saldoPorTrn: string | number;
  descripcion: string;
}

// ─── /products/savings Response ───

export interface SavingsAccountResponse {
  numeroCuenta: string;
  alias: string;
  nombreProducto: string;
  saldoDisponible: string | number;
  saldoTotal: string | number;
  idCuenta: string;
  codigoProductoCobis: string;
}

// ─── /products/credits Response ───

export interface CreditAccountResponse {
  numeroCuenta: string;
  codigoProducto: string;
  nombreProducto: string;
  saldo: string | number;
  cupoDisponible: string | number;
  pagoMinimo: string | number;
  pagoTotal: string | number;
  diasMora: string | number;
  /** Format: YYYYMMDD */
  fechaPago: string;
  /** Format: YYYYMMDD */
  fechaCorte: string;
  /** Format: YYYYMM */
  periodoFacturado: string;
  tipoCartera: string;
  idCuenta: string;
  codigoProductoCobis: string;
}

// ─── /products/investments Response ───

export interface InvestmentAccountResponse {
  numeroCuenta: string;
  nombreProducto: string;
  cuota: string | number;
  saldoTotal: string | number;
  plazo: string | number;
  /** Format: YYYYMMDD */
  fechaVencimiento: string;
  tasaEfectiva: string | number;
  idCuenta: string;
  /** "4" = PAC, "21" = CDAT */
  codigoProductoCobis: string;
}

// ─── /products/contributions Response ───

export interface AportesDetail {
  saldoTotalAportes: string | number;
  aportesVigentes: string | number;
  aportesMora: string | number;
  /** Format: YYYYMMDD */
  fechaCubrimientoAportes: string;
  fondosSolidariosVigentes: string | number;
  fondosSolidariosMora: string | number;
  /** Format: YYYYMMDD */
  fechaCubrimientoFondosSolidarios: string;
  numeroCuentaAportes: string;
  idCuentaAportes: string | number;
  /** Note: returned as number (not string like other endpoints) */
  codigoProductoCobisAportes: number;
}

export interface AhorroPermanenteDetail {
  saldoTotalAhorroPermanente: string | number;
  saldoDisponibleAhorroPermanente: string | number;
  numeroCuentaAhorroPermanente: string;
  idCuentaAhorroPermanente: string | number;
  /** Note: returned as number (not string like other endpoints) */
  codigoProductoCobisAhorroPermanente: number;
}

export interface ContributionsResponse {
  aportes: AportesDetail;
  /** Omitted when idCuentaAhorroPermanente == 0 */
  ahorroPermanente?: AhorroPermanenteDetail;
}

// ─── /products/protection Response ───

export interface ProtectionAccountResponse {
  numeroCuenta: string;
  nombreProducto: string;
  pagoMinimo: string | number;
  pagoTotal: string | number;
  diasMora: string | number;
  /** Format: YYYYMMDD */
  fechaPago: string;
  idCuenta: string;
  codigoProductoCobis: string;
}
