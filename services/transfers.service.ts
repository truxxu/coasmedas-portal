/**
 * Transfers Service
 *
 * Handles internal transfers (between own accounts),
 * external bank transfers (Visionamos), and entity transfers (Coopcentral).
 *
 * @see /docs/CONSOLIDATED_API_REFERENCE.md#6-internal-transfers
 * @see /docs/CONSOLIDATED_API_REFERENCE.md#7-external-transfers-banks---visionamos
 * @see /docs/CONSOLIDATED_API_REFERENCE.md#8-external-transfers-coopcentral-entities
 * @see /services/_template.ts for implementation patterns
 */

import { apiPost } from '@/lib/api/client';
import type {
  TransferAccountsRequest,
  CreateInternalTransferRequest,
  TransferTargetSavings,
  TransferTargetCredits,
  TransferTargetInvestments,
  InternalTransferResult,
} from '@/types/api/transfers';
import type {
  SavingsAccountResponse,
  CreditAccountResponse,
  InvestmentAccountResponse,
} from '@/types/api/products';

// ─── Internal Transfer Sources ───

/**
 * List savings accounts available as transfer source.
 * Returns same structure as `/products/savings`.
 *
 * @endpoint POST /transfer/internal/sources/savings
 * @auth JWT
 * @status ✅ Used in mobile (internal transfer source selection)
 */
export async function getTransferSourcesSavings(params: TransferAccountsRequest): Promise<SavingsAccountResponse[]> {
  return apiPost<SavingsAccountResponse[]>('/transfer/internal/sources/savings', params);
}

/**
 * List credit accounts available as transfer source.
 * Returns same structure as `/products/credits`.
 *
 * @endpoint POST /transfer/internal/sources/credits
 * @auth JWT
 * @status ✅ Used in mobile (internal transfer source selection)
 */
export async function getTransferSourcesCredits(params: TransferAccountsRequest): Promise<CreditAccountResponse[]> {
  return apiPost<CreditAccountResponse[]>('/transfer/internal/sources/credits', params);
}

/**
 * List investment accounts available as transfer source.
 * Returns same structure as `/products/investments`.
 *
 * @endpoint POST /transfer/internal/sources/investments
 * @auth JWT
 * @status ✅ Used in mobile (internal transfer source selection)
 */
export async function getTransferSourcesInvestments(params: TransferAccountsRequest): Promise<InvestmentAccountResponse[]> {
  return apiPost<InvestmentAccountResponse[]>('/transfer/internal/sources/investments', params);
}

// ─── Internal Transfer Targets ───

/**
 * List savings accounts available as transfer destination.
 *
 * @endpoint POST /transfer/internal/targets/savings
 * @auth JWT
 * @status ✅ Used in mobile (internal transfer destination selection)
 */
export async function getTransferTargetsSavings(params: TransferAccountsRequest): Promise<TransferTargetSavings[]> {
  return apiPost<TransferTargetSavings[]>('/transfer/internal/targets/savings', params);
}

/**
 * List credit accounts available as transfer destination.
 *
 * @endpoint POST /transfer/internal/targets/credits
 * @auth JWT
 * @status ✅ Used in mobile (internal transfer destination selection)
 */
export async function getTransferTargetsCredits(params: TransferAccountsRequest): Promise<TransferTargetCredits[]> {
  return apiPost<TransferTargetCredits[]>('/transfer/internal/targets/credits', params);
}

/**
 * List investment accounts available as transfer destination.
 *
 * @endpoint POST /transfer/internal/targets/investments
 * @auth JWT
 * @status ✅ Used in mobile (internal transfer destination selection)
 */
export async function getTransferTargetsInvestments(params: TransferAccountsRequest): Promise<TransferTargetInvestments[]> {
  return apiPost<TransferTargetInvestments[]>('/transfer/internal/targets/investments', params);
}

// ─── Internal Transfer Transaction ───

/**
 * Execute an internal transfer between own accounts.
 *
 * @endpoint POST /transfer/internal/createTransaction
 * @auth JWT + OTP
 * @status ✅ Used in mobile (transfer verification)
 */
export async function createInternalTransfer(params: CreateInternalTransferRequest): Promise<InternalTransferResult> {
  return apiPost<InternalTransferResult>('/transfer/internal/createTransaction', params);
}

// TODO: Implement external transfer endpoints (Banks - Visionamos)
// TODO: Implement external transfer endpoints (Coopcentral Entities)
