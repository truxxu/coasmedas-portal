/**
 * BRE-B Service
 *
 * Handles BRE-B key-based instant transfers via Visionamos.
 * All BRE-B endpoints proxy to the Visionamos BRE-B API and require JWT auth.
 *
 * @see /docs/CONSOLIDATED_API_REFERENCE.md#9-bre-b-key-based-instant-transfers
 */

import { apiPost } from "@/lib/api/client";
import type {
  ListBrebAccountsRequest,
  ListBrebAccountsResponse,
  ListBrebKeysRequest,
  ListBrebKeysResponse,
  ResolveBrebKeyRequest,
  ResolveBrebKeyResponse,
  CreateBrebKeyRequest,
  CreateBrebKeyResponse,
  UpdateBrebKeyRequest,
  UpdateBrebKeyResponse,
  DeleteBrebKeyRequest,
  DeleteBrebKeyResponse,
  BlockBrebKeyRequest,
  BlockBrebKeyResponse,
  UnblockBrebKeyRequest,
  UnblockBrebKeyResponse,
  AcceptBrebTermsRequest,
  AcceptBrebTermsResponse,
  InitBrebTxRequest,
  InitBrebTxResponse,
  BrebTxStatusRequest,
  BrebTxStatusResponse,
  ListBrebTxsRequest,
  ListBrebTxsResponse,
} from "@/types/api/breb";

// ─── Accounts ───

/**
 * List accounts eligible for BRE-B key registration.
 *
 * @endpoint POST /bre-b/accounts/list
 * @auth JWT
 * @status ✅ Used in mobile
 */
export async function listBrebAccounts(
  params: ListBrebAccountsRequest,
): Promise<ListBrebAccountsResponse> {
  return apiPost<ListBrebAccountsResponse>("/bre-b/accounts/list", params);
}

// ─── Keys ───

/**
 * List the user's registered BRE-B keys.
 *
 * @endpoint POST /bre-b/keys/list
 * @auth JWT
 * @status ✅ Used in mobile
 */
export async function listBrebKeys(
  params: ListBrebKeysRequest,
): Promise<ListBrebKeysResponse> {
  return apiPost<ListBrebKeysResponse>("/bre-b/keys/list", params);
}

/**
 * Resolve a BRE-B key value to its recipient information.
 *
 * @endpoint POST /bre-b/keys/resolve
 * @auth JWT
 * @status ✅ Used in mobile
 */
export async function resolveBrebKey(
  params: ResolveBrebKeyRequest,
): Promise<ResolveBrebKeyResponse> {
  return apiPost<ResolveBrebKeyResponse>("/bre-b/keys/resolve", params);
}

/**
 * Create a new BRE-B key.
 *
 * @endpoint POST /bre-b/keys/create
 * @auth JWT
 * @status ✅ Used in mobile
 */
export async function createBrebKey(
  params: CreateBrebKeyRequest,
): Promise<CreateBrebKeyResponse> {
  return apiPost<CreateBrebKeyResponse>("/bre-b/keys/create", params);
}

/**
 * Update an existing BRE-B key.
 *
 * @endpoint POST /bre-b/keys/update
 * @auth JWT
 * @status ✅ Used in mobile
 */
export async function updateBrebKey(
  params: UpdateBrebKeyRequest,
): Promise<UpdateBrebKeyResponse> {
  return apiPost<UpdateBrebKeyResponse>("/bre-b/keys/update", params);
}

/**
 * Delete a BRE-B key.
 *
 * @endpoint POST /bre-b/keys/delete
 * @auth JWT
 * @status ✅ Used in mobile
 */
export async function deleteBrebKey(
  params: DeleteBrebKeyRequest,
): Promise<DeleteBrebKeyResponse> {
  return apiPost<DeleteBrebKeyResponse>("/bre-b/keys/delete", params);
}

/**
 * Block a BRE-B key.
 *
 * @endpoint POST /bre-b/keys/block
 * @auth JWT
 * @status ✅ Used in mobile
 */
export async function blockBrebKey(
  params: BlockBrebKeyRequest,
): Promise<BlockBrebKeyResponse> {
  return apiPost<BlockBrebKeyResponse>("/bre-b/keys/block", params);
}

/**
 * Unblock a previously blocked BRE-B key.
 *
 * @endpoint POST /bre-b/keys/unblock
 * @auth JWT
 * @status ✅ Used in mobile
 */
export async function unblockBrebKey(
  params: UnblockBrebKeyRequest,
): Promise<UnblockBrebKeyResponse> {
  return apiPost<UnblockBrebKeyResponse>("/bre-b/keys/unblock", params);
}

// ─── Terms ───

/**
 * Accept BRE-B terms and conditions.
 *
 * @endpoint POST /bre-b/terms/accept
 * @auth JWT
 * @status ✅ Used in mobile
 */
export async function acceptBrebTerms(
  params: AcceptBrebTermsRequest,
): Promise<AcceptBrebTermsResponse> {
  return apiPost<AcceptBrebTermsResponse>("/bre-b/terms/accept", params);
}

// ─── Transactions ───

/**
 * Initiate a BRE-B transfer transaction.
 *
 * @endpoint POST /bre-b/txs/init
 * @auth JWT
 * @status ✅ Used in mobile
 */
export async function initBrebTx(
  params: InitBrebTxRequest,
): Promise<InitBrebTxResponse> {
  return apiPost<InitBrebTxResponse>("/bre-b/txs/init", params);
}

/**
 * Check the status of a BRE-B transaction by `paymentId`.
 *
 * @endpoint POST /bre-b/txs/status
 * @auth JWT
 * @status ✅ Used in mobile
 */
export async function getBrebTxStatus(
  params: BrebTxStatusRequest,
): Promise<BrebTxStatusResponse> {
  return apiPost<BrebTxStatusResponse>("/bre-b/txs/status", params);
}

/**
 * List BRE-B transaction history within a date range.
 *
 * @endpoint POST /bre-b/txs/list
 * @auth JWT
 * @status ✅ Used in mobile
 */
export async function listBrebTxs(
  params: ListBrebTxsRequest,
): Promise<ListBrebTxsResponse> {
  return apiPost<ListBrebTxsResponse>("/bre-b/txs/list", params);
}
