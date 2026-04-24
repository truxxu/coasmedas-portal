import type { UserIdentification } from "./common";

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
 * Request for POST /movements — consolidated mode.
 * When only user identification + indPag are sent, the backend returns
 * recent movements across all of the user's products.
 */
export interface ConsolidatedMovementsRequest extends UserIdentification {
  /** Pagination indicator — "1" for first page */
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

/**
 * Consolidated balance summary returned by POST /balances.
 * The response is an array with a single object containing string balances
 * keyed by product category.
 */
export interface BalanceSummary {
  aportes: string;
  ahorro: string;
  inversion: string;
  credito: string;
  proteccion: string;
}

/**
 * Request for POST /products/contributions/movements.
 * Aportes-specific movements with server-side date range filtering.
 */
export interface ContributionsMovementsRequest extends UserIdentification {
  idCuenta: string;
  /** Format: YYYYMMDD */
  startDate: string;
  /** Format: YYYYMMDD */
  endDate: string;
  /** Pagination indicator */
  indPag?: string;
}

// ─── /movements Response ───

export interface MovementItem {
  /** Format: YYYYMMDD */
  fechaTransaccion: string;
  /** Format: HHMMSS */
  horaTransaccion?: string;
  referencia?: string;
  /** DB/CR (product-scoped) or D/C (consolidated) — debit / credit */
  tipoTransaccion: string;
  valorTransaccion: string | number;
  saldoPorTrn?: string | number;
  descripcion: string;
}

// ─── /products/savings/movements ───

/**
 * Request for POST /products/savings/movements.
 * Savings-specific movements with server-side date range filtering.
 */
export interface SavingsMovementsRequest extends UserIdentification {
  idCuenta: string;
  /** Format: YYYYMMDD */
  startDate: string;
  /** Format: YYYYMMDD */
  endDate: string;
  /** Pagination indicator */
  indPag?: string;
}

export interface SavingsMovementsResponse {
  saldoDisponibleTemp: string | number;
  saldoCanjeTemp: string | number;
  saldoRemesasTemp: string | number;
  saldoBolsilloTemp: string | number;
  /** Format: YYYYMMDD (may be "19000101" when no movements) */
  ultimoMovimiento: string;
  descripcionMovimiento: string;
  nroMovimientos: string;
  nroMovimientosPaginaActual: string;
  records: MovementItem[];
}

// ─── /products/contributions/movements Response ───

export interface ContributionsMovementItem {
  /** Format: YYYYMMDD */
  fechaTransaccion: string;
  /** "C" = credit, "D" = debit */
  tipoTransaccion: string;
  valorTransaccion: string | number;
  descripcion: string;
}

export interface ContributionsMovementsResponse {
  saldoFecha: string | number;
  nroMovimientos: string;
  nroMovimientosPaginaActual: string;
  records: ContributionsMovementItem[];
}

// ─── /products/savings Response ───

export interface SavingsAccountResponse {
  numeroCuenta: string;
  alias?: string;
  estado: string;
  nombreProducto: string;
  saldoDisponible?: string | number;
  saldoTotal: string | number;
  idCuenta: string;
  codigoProductoCobis: string | number;
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

// ─── /products/pockets ───

/**
 * Request for POST /products/pockets.
 * Lists coaspocket (bolsillos) associated with a savings account.
 */
export interface PocketsRequest extends UserIdentification {
  idCuenta: string;
  /** Pagination indicator */
  indPag?: string;
}

export interface PocketRecord {
  idBolsillo: number;
  nombreBolsillo: string;
  /** "ACTIVO" | "INACTIVO" (uppercase from backend) */
  estado: string;
  saldo: string | number;
}

export interface PocketsResponse {
  nroMovimientos: string;
  nroMovimientosPaginaActual: string;
  records: PocketRecord[];
}

// ─── /products/pockets/create ───

/**
 * Request for POST /products/pockets/create.
 * Creates a new coaspocket (bolsillo) under the given savings account.
 */
export interface CreatePocketRequest extends UserIdentification {
  idCuenta: string;
  nombreBolsillo: string;
}

export interface CreatePocketResponse {
  idBolsillo?: number | string;
  nombreBolsillo?: string;
  [key: string]: unknown;
}

// ─── /products/pockets/movements ───

/**
 * Request for POST /products/pockets/movements.
 * Pocket-specific movements with server-side date range filtering.
 */
export interface PocketsMovementsRequest extends UserIdentification {
  idCuenta: string;
  idBolsillo: string;
  /** Format: YYYYMMDD */
  startDate: string;
  /** Format: YYYYMMDD */
  endDate: string;
  /** Pagination indicator */
  indPag?: string;
}

export interface PocketsMovementsResponse {
  nroMovimientos: string;
  nroMovimientosPaginaActual: string;
  records: MovementItem[];
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
