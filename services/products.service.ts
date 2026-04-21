/**
 * Products & Account Service
 *
 * Handles product queries, balances, and transaction movements.
 *
 * @see /docs/CONSOLIDATED_API_REFERENCE.md#4-account--products
 * @see /services/_template.ts for implementation patterns
 */

import { apiPost } from "@/lib/api/client";
import type {
  BalancesRequest,
  BalanceSummary,
  MovementsRequest,
  MovementItem,
  ProductsRequest,
  SavingsAccountResponse,
  CreditAccountResponse,
  InvestmentAccountResponse,
  ContributionsResponse,
  ContributionsMovementsRequest,
  ContributionsMovementsResponse,
  SavingsMovementsRequest,
  SavingsMovementsResponse,
  ProtectionAccountResponse,
} from "@/types/api/products";

// ─── Balances ───

/**
 * Query consolidated account balances across all product types.
 *
 * @endpoint POST /balances
 * @auth JWT
 * @status ✅ Used in mobile (dashboard)
 */
export async function getBalances(
  params: BalancesRequest,
): Promise<BalanceSummary[]> {
  return apiPost<BalanceSummary[]>("/balances", params);
}

// ─── Movements ───

/**
 * Query account transaction movements for a specific product.
 *
 * @endpoint POST /movements
 * @auth JWT
 * @status ✅ Used in mobile (product details)
 */
export async function getMovements(
  params: MovementsRequest,
): Promise<MovementItem[]> {
  return apiPost<MovementItem[]>("/movements", params);
}

// ─── Products ───

/**
 * Query user's savings accounts with full details.
 *
 * @endpoint POST /products/savings
 * @auth JWT
 * @status ✅ Used in mobile (ahorros page)
 */
export async function getProductsSavings(
  params: ProductsRequest,
): Promise<SavingsAccountResponse[]> {
  return apiPost<SavingsAccountResponse[]>("/products/savings", params);
}

/**
 * Query savings transaction movements within a date range.
 *
 * @endpoint POST /products/savings/movements
 * @auth JWT
 * @status ✅ Used in ahorros page
 */
export async function getSavingsMovements(
  params: SavingsMovementsRequest,
): Promise<SavingsMovementsResponse> {
  return apiPost<SavingsMovementsResponse>(
    "/products/savings/movements",
    params,
  );
}

/**
 * Query user's credit/loan accounts.
 *
 * @endpoint POST /products/credits
 * @auth JWT
 * @status ✅ Used in mobile (obligaciones page)
 */
export async function getProductsCredits(
  params: ProductsRequest,
): Promise<CreditAccountResponse[]> {
  return apiPost<CreditAccountResponse[]>("/products/credits", params);
}

/**
 * Query user's investment products (CDAT, PAC).
 *
 * @endpoint POST /products/investments
 * @auth JWT
 * @status ✅ Used in mobile (inversiones page)
 */
export async function getProductsInvestments(
  params: ProductsRequest,
): Promise<InvestmentAccountResponse[]> {
  return apiPost<InvestmentAccountResponse[]>("/products/investments", params);
}

/**
 * Query user's contributions (aportes) and permanent savings.
 * Returns an object (not array) with `aportes` and optional `ahorroPermanente`.
 *
 * @endpoint POST /products/contributions
 * @auth JWT
 * @status ✅ Used in mobile (aportes page)
 */
export async function getProductsContributions(
  params: ProductsRequest,
): Promise<ContributionsResponse> {
  return apiPost<ContributionsResponse>("/products/contributions", params);
}

/**
 * Query contributions (aportes) transaction movements within a date range.
 *
 * @endpoint POST /products/contributions/movements
 * @auth JWT
 * @status ✅ Used in aportes page
 */
export async function getContributionsMovements(
  params: ContributionsMovementsRequest,
): Promise<ContributionsMovementsResponse> {
  return apiPost<ContributionsMovementsResponse>(
    "/products/contributions/movements",
    params,
  );
}

/**
 * Query user's protection/insurance products.
 *
 * @endpoint POST /products/protection
 * @auth JWT
 * @status ✅ Used in mobile (proteccion page)
 */
export async function getProductsProtection(
  params: ProductsRequest,
): Promise<ProtectionAccountResponse[]> {
  return apiPost<ProtectionAccountResponse[]>("/products/protection", params);
}
