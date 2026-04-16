/**
 * Transfer Mappers
 *
 * Maps API response types to UI types used by transfer flow organisms.
 *
 * @see /types/api/transfers.ts — API response/request types
 * @see /src/types/transfer.ts — UI types
 */

import { normalizeMoney, normalizeString } from "@/types/api/common";
import type { AccountReference } from "@/types/api/common";
import type {
  SavingsAccountResponse,
  CreditAccountResponse,
} from "@/types/api/products";
import type {
  TransferTargetSavings,
  TransferTargetCredits,
  TransferTargetInvestments,
  InternalTransferResult,
} from "@/types/api/transfers";
import type {
  TransferAccount,
  DestinationProduct,
  TransferResult,
} from "@/src/types/transfer";
import { maskNumber } from "@/src/utils";
import { parseApiDate, parseApiTime, formatDate } from "@/src/utils/dates";

// ─── Source Account Mappers ───

/**
 * Map savings API response → TransferAccount (source).
 */
export function mapSavingsToTransferAccount(
  item: SavingsAccountResponse,
): TransferAccount {
  return {
    id: item.idCuenta,
    name: item.nombreProducto,
    accountType: "Ahorros",
    productNumber: item.numeroCuenta,
    balance: normalizeMoney(item.saldoTotal),
  };
}

/**
 * Map credits API response → TransferAccount (source).
 */
export function mapCreditsToTransferAccount(
  item: CreditAccountResponse,
): TransferAccount {
  return {
    id: item.idCuenta,
    name: item.nombreProducto,
    accountType: "Credito",
    productNumber: item.numeroCuenta,
    balance: normalizeMoney(item.cupoDisponible),
  };
}

// ─── Target Account Mappers ───

/**
 * Map target savings → DestinationProduct.
 */
export function mapTargetSavingsToDestination(
  item: TransferTargetSavings,
): DestinationProduct {
  return {
    id: item.idCuenta,
    name: item.nombreProducto,
    productNumber: item.numeroCuenta,
    productType: "Ahorros",
  };
}

/**
 * Map target credits → DestinationProduct.
 */
export function mapTargetCreditsToDestination(
  item: TransferTargetCredits,
): DestinationProduct {
  return {
    id: item.idCuenta,
    name: item.nombreProducto,
    productNumber: item.numeroCuenta,
    productType: "Credito",
  };
}

/**
 * Map target investments → DestinationProduct.
 */
export function mapTargetInvestmentsToDestination(
  item: TransferTargetInvestments,
): DestinationProduct {
  return {
    id: item.idCuenta,
    name: item.nombreProducto,
    productNumber: item.numeroCuenta,
    productType: "Inversion",
  };
}

// ─── Account Reference Builders ───

/**
 * Build AccountReference from a SavingsAccountResponse (source).
 */
export function buildTransferSourceReference(
  account: SavingsAccountResponse,
): AccountReference {
  return {
    codigoProductoCobis: String(account.codigoProductoCobis),
    idCuenta: account.idCuenta,
    numeroCuenta: account.numeroCuenta,
  };
}

/**
 * Build AccountReference from a CreditAccountResponse (source).
 */
export function buildTransferCreditSourceReference(
  account: CreditAccountResponse,
): AccountReference {
  return {
    codigoProductoCobis: account.codigoProductoCobis,
    idCuenta: account.idCuenta,
    numeroCuenta: account.numeroCuenta,
    tipoCartera: account.tipoCartera,
  };
}

/**
 * Build AccountReference from a target savings account.
 */
export function buildTargetSavingsReference(
  target: TransferTargetSavings,
): AccountReference {
  return {
    codigoProductoCobis: target.codigoProductoCobis,
    idCuenta: target.idCuenta,
    numeroCuenta: target.numeroCuenta,
  };
}

/**
 * Build AccountReference from a target credits account.
 */
export function buildTargetCreditsReference(
  target: TransferTargetCredits,
): AccountReference {
  return {
    codigoProductoCobis: target.codigoProductoCobis,
    idCuenta: target.idCuenta,
    numeroCuenta: target.numeroCuenta,
    tipoCartera: target.tipoCartera,
  };
}

// ─── Result Mapper ───

/**
 * Map API internal transfer result → TransferResult (UI type).
 */
export function mapTransferResult(
  result: InternalTransferResult,
  context: { sourceType: string; productNumber: string },
): TransferResult {
  const iso = parseApiDate(String(result.fechaTrn));
  return {
    status: "success",
    sourceType: context.sourceType,
    productNumber: context.productNumber,
    amountPaid: normalizeMoney(result.valorTransferencia),
    transactionCost: 0,
    transmissionDate: iso ? formatDate(iso) : "",
    transactionTime: parseApiTime(String(result.horaTrn)),
    approvalNumber: normalizeString(result.numAprobacion),
    description: "Transferencia Exitosa",
  };
}

// ─── Helpers ───

/**
 * Find a source account's display name for confirmation/result screens.
 */
export function getSourceDisplayName(
  savingsData: SavingsAccountResponse[],
  creditsData: CreditAccountResponse[],
  sourceId: string,
): { name: string; number: string; type: "savings" | "credits" } | null {
  const savings = savingsData.find(
    (a) => String(a.idCuenta) === String(sourceId),
  );
  if (savings) {
    return {
      name: `${savings.nombreProducto} (${maskNumber(savings.numeroCuenta)})`,
      number: savings.numeroCuenta,
      type: "savings",
    };
  }
  const credit = creditsData.find(
    (a) => String(a.idCuenta) === String(sourceId),
  );
  if (credit) {
    return {
      name: `${credit.nombreProducto} (${maskNumber(credit.numeroCuenta)})`,
      number: credit.numeroCuenta,
      type: "credits",
    };
  }
  return null;
}

/**
 * Find a destination account's display name for confirmation/result screens.
 */
export function getDestinationDisplayName(
  targetSavings: TransferTargetSavings[],
  targetCredits: TransferTargetCredits[],
  targetInvestments: TransferTargetInvestments[],
  destinationId: string,
): string | null {
  const savings = targetSavings.find(
    (a) => String(a.idCuenta) === String(destinationId),
  );
  if (savings)
    return `${savings.nombreProducto} (${maskNumber(savings.numeroCuenta)})`;

  const credit = targetCredits.find(
    (a) => String(a.idCuenta) === String(destinationId),
  );
  if (credit)
    return `${credit.nombreProducto} (${maskNumber(credit.numeroCuenta)})`;

  const investment = targetInvestments.find(
    (a) => String(a.idCuenta) === String(destinationId),
  );
  if (investment)
    return `${investment.nombreProducto} (${maskNumber(investment.numeroCuenta)})`;

  return null;
}
