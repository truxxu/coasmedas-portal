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

import { apiPost } from "@/lib/api/client";
import type {
  TransferAccountsRequest,
  CreateInternalTransferRequest,
  TransferTargetSavings,
  TransferTargetCredits,
  TransferTargetInvestments,
  InternalTransferResult,
  BankListItem,
  EntityListItem,
  GetTransactionCostRequest,
  TransactionCostResponse,
  CreateExternalTransferRequest,
  ExternalTransferApiResult,
  QueryProductRequest,
} from "@/types/api/transfers";
import type {
  SavingsAccountResponse,
  CreditAccountResponse,
  InvestmentAccountResponse,
} from "@/types/api/products";
import type { UserIdentification } from "@/types/api/common";

// ─── Internal Transfer Sources ───

/**
 * List savings accounts available as transfer source.
 * Returns same structure as `/products/savings`.
 *
 * @endpoint POST /transfer/internal/sources/savings
 * @auth JWT
 * @status ✅ Used in mobile (internal transfer source selection)
 */
export async function getTransferSourcesSavings(
  params: TransferAccountsRequest,
): Promise<SavingsAccountResponse[]> {
  return apiPost<SavingsAccountResponse[]>(
    "/transfer/internal/sources/savings",
    params,
  );
}

/**
 * List credit accounts available as transfer source.
 * Returns same structure as `/products/credits`.
 *
 * @endpoint POST /transfer/internal/sources/credits
 * @auth JWT
 * @status ✅ Used in mobile (internal transfer source selection)
 */
export async function getTransferSourcesCredits(
  params: TransferAccountsRequest,
): Promise<CreditAccountResponse[]> {
  return apiPost<CreditAccountResponse[]>(
    "/transfer/internal/sources/credits",
    params,
  );
}

/**
 * List investment accounts available as transfer source.
 * Returns same structure as `/products/investments`.
 *
 * @endpoint POST /transfer/internal/sources/investments
 * @auth JWT
 * @status ✅ Used in mobile (internal transfer source selection)
 */
export async function getTransferSourcesInvestments(
  params: TransferAccountsRequest,
): Promise<InvestmentAccountResponse[]> {
  return apiPost<InvestmentAccountResponse[]>(
    "/transfer/internal/sources/investments",
    params,
  );
}

// ─── Internal Transfer Targets ───

/**
 * List savings accounts available as transfer destination.
 *
 * @endpoint POST /transfer/internal/targets/savings
 * @auth JWT
 * @status ✅ Used in mobile (internal transfer destination selection)
 */
export async function getTransferTargetsSavings(
  params: TransferAccountsRequest,
): Promise<TransferTargetSavings[]> {
  return apiPost<TransferTargetSavings[]>(
    "/transfer/internal/targets/savings",
    params,
  );
}

/**
 * List credit accounts available as transfer destination.
 *
 * @endpoint POST /transfer/internal/targets/credits
 * @auth JWT
 * @status ✅ Used in mobile (internal transfer destination selection)
 */
export async function getTransferTargetsCredits(
  params: TransferAccountsRequest,
): Promise<TransferTargetCredits[]> {
  return apiPost<TransferTargetCredits[]>(
    "/transfer/internal/targets/credits",
    params,
  );
}

/**
 * List investment accounts available as transfer destination.
 *
 * @endpoint POST /transfer/internal/targets/investments
 * @auth JWT
 * @status ✅ Used in mobile (internal transfer destination selection)
 */
export async function getTransferTargetsInvestments(
  params: TransferAccountsRequest,
): Promise<TransferTargetInvestments[]> {
  return apiPost<TransferTargetInvestments[]>(
    "/transfer/internal/targets/investments",
    params,
  );
}

// ─── Internal Transfer Transaction ───

/**
 * Execute an internal transfer between own accounts.
 *
 * @endpoint POST /transfer/internal/createTransaction
 * @auth JWT + OTP
 * @status ✅ Used in mobile (transfer verification)
 */
export async function createInternalTransfer(
  params: CreateInternalTransferRequest,
): Promise<InternalTransferResult> {
  return apiPost<InternalTransferResult>(
    "/transfer/internal/createTransaction",
    params,
  );
}

// ─── External Transfer Sources ───

/**
 * List savings accounts available as external transfer source.
 *
 * @endpoint POST /transfer/external/sources/savings
 * @auth JWT
 * @status ✅ Used in mobile (external transfer source selection)
 */
export async function getExternalSourcesSavings(
  params: TransferAccountsRequest,
): Promise<SavingsAccountResponse[]> {
  return apiPost<SavingsAccountResponse[]>(
    "/transfer/external/sources/savings",
    params,
  );
}

/**
 * List credit accounts available as external transfer source.
 *
 * @endpoint POST /transfer/external/sources/credits
 * @auth JWT
 * @status ✅ Used in mobile (external transfer source selection)
 */
export async function getExternalSourcesCredits(
  params: TransferAccountsRequest,
): Promise<CreditAccountResponse[]> {
  return apiPost<CreditAccountResponse[]>(
    "/transfer/external/sources/credits",
    params,
  );
}

// ─── External Transfer (Banks - Visionamos) ───

/**
 * List available banks for external transfers (Visionamos network).
 *
 * @endpoint POST /transfer/external/listBanks
 * @auth JWT
 * @status ✅ Used in mobile (bank selection)
 */
export async function listBanks(): Promise<BankListItem[]> {
  return apiPost<BankListItem[]>("/transfer/external/listBanks");
}

/**
 * Get transaction cost (commission) for an external bank transfer.
 *
 * @endpoint POST /transfer/external/getTransactionCost
 * @auth JWT
 * @status ✅ Used in mobile (shows commission before confirming)
 */
export async function getTransactionCost(
  params: GetTransactionCostRequest,
): Promise<TransactionCostResponse> {
  return apiPost<TransactionCostResponse>(
    "/transfer/external/getTransactionCost",
    params,
  );
}

/**
 * Execute an external bank transfer (Visionamos network).
 *
 * @endpoint POST /transfer/external/banks/createTransaction
 * @auth JWT + OTP
 * @status ✅ Used in mobile (transfer verification)
 */
export async function createExternalBankTransfer(
  params: CreateExternalTransferRequest,
): Promise<ExternalTransferApiResult> {
  return apiPost<ExternalTransferApiResult>(
    "/transfer/external/banks/createTransaction",
    params,
  );
}

// ─── External Transfer (Coopcentral Entities) ───

/**
 * List available entities in Coopcentral network.
 *
 * @endpoint POST /transfer/external/listEntities
 * @auth JWT
 * @status ✅ Used in mobile (entity selection)
 */
export async function listEntities(): Promise<EntityListItem[]> {
  return apiPost<EntityListItem[]>("/transfer/external/listEntities");
}

/**
 * Validate destination product exists in Coopcentral entity.
 * Returns no payload (just statusCode confirmation).
 *
 * @endpoint POST /transfer/external/entities/targets/queryProduct
 * @auth JWT
 * @status ✅ Used in mobile (destination validation)
 */
export async function queryEntityProduct(
  params: QueryProductRequest,
): Promise<void> {
  await apiPost<void>(
    "/transfer/external/entities/targets/queryProduct",
    params,
  );
}

/**
 * Execute an external entity transfer (Coopcentral network).
 *
 * @endpoint POST /transfer/external/entities/createTransaction
 * @auth JWT + OTP
 * @status ✅ Used in mobile (transfer verification)
 */
export async function createExternalEntityTransfer(
  params: CreateExternalTransferRequest,
): Promise<ExternalTransferApiResult> {
  return apiPost<ExternalTransferApiResult>(
    "/transfer/external/entities/createTransaction",
    params,
  );
}
