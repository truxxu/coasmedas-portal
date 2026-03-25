import type { UserIdentification, AccountReference, DocumentType } from './common';

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

// ─── External Transfer (Banks - Visionamos) ───

/**
 * Bank item returned by POST /transfer/external/listBanks.
 */
export interface BankListItem {
  code: string;
  name: string;
}

/**
 * Destination account for external transfers (banks and entities).
 */
export interface ExternalTransferDestination {
  name: string;
  documentType: DocumentType;
  documentNumber: string;
  accountNumber: string;
  /** "01" = savings, etc. */
  accountType: string;
  /** From listBanks or listEntities */
  entityCode: string;
}

/**
 * Source account reference for external transfers.
 */
export interface ExternalTransferSourceRef {
  codigoProductoCobis: string;
  tipoCartera: string;
  idCuenta: string;
  numeroCuenta?: string;
}

/**
 * Request for POST /transfer/external/getTransactionCost.
 */
export interface GetTransactionCostRequest extends UserIdentification {
  origen: ExternalTransferSourceRef;
  destino: ExternalTransferDestination;
  valorTransferencia: number;
}

/**
 * Response from POST /transfer/external/getTransactionCost.
 */
export interface TransactionCostResponse {
  numAprobacion: string | number;
  comision: number;
}

/**
 * Request for POST /transfer/external/banks/createTransaction
 * and POST /transfer/external/entities/createTransaction.
 */
export interface CreateExternalTransferRequest extends UserIdentification {
  otp: string;
  origen: ExternalTransferSourceRef & { numeroCuenta: string };
  destino: ExternalTransferDestination;
  valorTransferencia: number;
}

/**
 * Result from external transfer createTransaction endpoints.
 * Same shape as InternalTransferResult.
 */
export type ExternalTransferApiResult = InternalTransferResult;

// ─── External Transfer (Coopcentral Entities) ───

/**
 * Entity item returned by POST /transfer/external/listEntities.
 * Same shape as BankListItem.
 */
export type EntityListItem = BankListItem;

/**
 * Request for POST /transfer/external/entities/targets/queryProduct.
 */
export interface QueryProductRequest extends UserIdentification {
  destino: ExternalTransferDestination;
}
