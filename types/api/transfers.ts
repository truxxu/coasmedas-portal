import type { UserIdentification, AccountReference } from './common';

// ─── Request Types ───

/**
 * Request for transfer source/target listing endpoints.
 * @see POST /transfer/internal/sources/*
 * @see POST /transfer/internal/targets/*
 */
export interface TransferAccountsRequest extends UserIdentification {
  /** Pagination indicator (optional per mobile evidence) */
  indPag?: string;
}

/**
 * Request for POST /transfer/internal/createTransaction.
 */
export interface CreateInternalTransferRequest extends UserIdentification {
  otp: string;
  origen: AccountReference;
  destino: AccountReference;
  valorTransferencia: number;
}

// ─── Target Response Types ───
// Sources reuse SavingsAccountResponse, CreditAccountResponse, InvestmentAccountResponse
// from types/api/products.ts (same structure per API docs).
// Targets have slightly different shapes documented below.

/**
 * Savings account available as transfer target.
 * @see POST /transfer/internal/targets/savings
 */
export interface TransferTargetSavings {
  idCuenta: string;
  numeroCuenta: string;
  alias: string;
  nombreProducto: string;
  codigoProductoCobis: string;
  saldoDisponible: string | number;
}

/**
 * Credit account available as transfer target.
 * @see POST /transfer/internal/targets/credits
 */
export interface TransferTargetCredits {
  idCuenta: string;
  tipoCartera: string;
  numeroCuenta: string;
  codigoProducto: string;
  nombreProducto: string;
  codigoProductoCobis: string;
  cupoDisponible: string | number;
}

/**
 * Investment account available as transfer target.
 * Same structure as TransferTargetSavings per API docs.
 * @see POST /transfer/internal/targets/investments
 */
export type TransferTargetInvestments = TransferTargetSavings;

// ─── Transaction Result ───

/**
 * Result from POST /transfer/internal/createTransaction.
 */
export interface InternalTransferResult {
  numAprobacion: string | number;
  /** Format: YYYYMMDD */
  fechaTrn: string;
  /** Format: HHMMSS (may omit leading zero) */
  horaTrn: string | number;
  valorTransferencia: string | number;
}
