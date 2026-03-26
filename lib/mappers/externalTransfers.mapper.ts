/**
 * External Transfer Mappers
 *
 * Maps API response types to UI types used by external transfer flow organisms
 * (Otros Bancos and Red Coopcentral).
 *
 * @see /types/api/transfers.ts — API response/request types
 * @see /src/types/externalTransfer.ts — UI types (Otros Bancos)
 * @see /src/types/redCoopTransfer.ts — UI types (Red Coopcentral)
 */

import { normalizeMoney, normalizeString } from "@/types/api/common";
import type {
  SavingsAccountResponse,
  CreditAccountResponse,
} from "@/types/api/products";
import type {
  ExternalTransferSourceRef,
  ExternalTransferApiResult,
} from "@/types/api/transfers";
import type {
  ExternalTransferSourceAccount,
  ExternalTransferResult,
} from "@/src/types/externalTransfer";
import type {
  RedCoopSourceAccount,
  RedCoopTransferResult,
} from "@/src/types/redCoopTransfer";
import { maskNumber } from "@/src/utils";
import { parseApiDate, parseApiTime, formatDate } from "@/src/utils/dates";

// ─── Source Account Mappers ───

/**
 * Map savings API response → ExternalTransferSourceAccount (UI type).
 */
export function mapSavingsToExternalSource(
  item: SavingsAccountResponse,
): ExternalTransferSourceAccount {
  return {
    id: item.idCuenta,
    type: item.nombreProducto,
    balance: normalizeMoney(item.saldoTotal),
    maskedNumber: maskNumber(item.numeroCuenta),
  };
}

/**
 * Map credits API response → ExternalTransferSourceAccount (UI type).
 */
export function mapCreditsToExternalSource(
  item: CreditAccountResponse,
): ExternalTransferSourceAccount {
  return {
    id: item.idCuenta,
    type: item.nombreProducto,
    balance: normalizeMoney(item.cupoDisponible),
    maskedNumber: maskNumber(item.numeroCuenta),
  };
}

/**
 * Map savings API response → RedCoopSourceAccount (UI type).
 */
export function mapSavingsToRedCoopSource(
  item: SavingsAccountResponse,
): RedCoopSourceAccount {
  return {
    id: item.idCuenta,
    type: item.nombreProducto,
    balance: normalizeMoney(item.saldoTotal),
    maskedNumber: maskNumber(item.numeroCuenta),
  };
}

/**
 * Map credits API response → RedCoopSourceAccount (UI type).
 */
export function mapCreditsToRedCoopSource(
  item: CreditAccountResponse,
): RedCoopSourceAccount {
  return {
    id: item.idCuenta,
    type: item.nombreProducto,
    balance: normalizeMoney(item.cupoDisponible),
    maskedNumber: maskNumber(item.numeroCuenta),
  };
}

// ─── Source Reference Builder ───

/**
 * Build ExternalTransferSourceRef from a SavingsAccountResponse.
 */
export function buildExternalSavingsSourceRef(
  account: SavingsAccountResponse,
): ExternalTransferSourceRef & { numeroCuenta: string } {
  return {
    codigoProductoCobis: account.codigoProductoCobis,
    tipoCartera: "",
    idCuenta: account.idCuenta,
    numeroCuenta: account.numeroCuenta,
  };
}

/**
 * Build ExternalTransferSourceRef from a CreditAccountResponse.
 */
export function buildExternalCreditSourceRef(
  account: CreditAccountResponse,
): ExternalTransferSourceRef & { numeroCuenta: string } {
  return {
    codigoProductoCobis: account.codigoProductoCobis,
    tipoCartera: account.tipoCartera,
    idCuenta: account.idCuenta,
    numeroCuenta: account.numeroCuenta,
  };
}

// ─── Source Lookup Helper ───

/**
 * Find a source account from raw API data and return display info + source ref.
 */
export function getExternalSourceInfo(
  savingsData: SavingsAccountResponse[],
  creditsData: CreditAccountResponse[],
  sourceId: string,
): {
  name: string;
  number: string;
  type: "savings" | "credits";
  sourceRef: ExternalTransferSourceRef & { numeroCuenta: string };
} | null {
  const savings = savingsData.find(
    (a) => String(a.idCuenta) === String(sourceId),
  );
  if (savings) {
    return {
      name: `${savings.nombreProducto} (${maskNumber(savings.numeroCuenta)})`,
      number: savings.numeroCuenta,
      type: "savings",
      sourceRef: buildExternalSavingsSourceRef(savings),
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
      sourceRef: buildExternalCreditSourceRef(credit),
    };
  }
  return null;
}

// ─── Result Mappers ───

/**
 * Map API external transfer result → ExternalTransferResult (UI type).
 */
export function mapExternalBankTransferResult(
  result: ExternalTransferApiResult,
  context: {
    sourceAccount: string;
    destinationBank: string;
    destinationAccountNumber: string;
    concept: string;
  },
): ExternalTransferResult {
  const iso = parseApiDate(String(result.fechaTrn));
  return {
    status: "success",
    sourceAccount: context.sourceAccount,
    destinationBank: context.destinationBank,
    destinationAccountNumber: context.destinationAccountNumber,
    amountTransferred: normalizeMoney(result.valorTransferencia),
    concept: context.concept,
    transactionCost: 0,
    transactionDate: iso ? formatDate(iso) : "",
    transactionTime: parseApiTime(String(result.horaTrn)),
    approvalNumber: normalizeString(result.numAprobacion),
    description: "Transferencia Exitosa",
  };
}

/**
 * Map API external transfer result → RedCoopTransferResult (UI type).
 */
export function mapExternalEntityTransferResult(
  result: ExternalTransferApiResult,
  context: {
    sourceAccount: string;
    destinationBank: string;
    destinationAccountNumber: string;
    concept: string;
  },
): RedCoopTransferResult {
  const iso = parseApiDate(String(result.fechaTrn));
  return {
    status: "success",
    sourceAccount: context.sourceAccount,
    destinationBank: context.destinationBank,
    destinationAccountNumber: context.destinationAccountNumber,
    amountTransferred: normalizeMoney(result.valorTransferencia),
    concept: context.concept,
    transactionCost: 0,
    transactionDate: iso ? formatDate(iso) : "",
    transactionTime: parseApiTime(String(result.horaTrn)),
    approvalNumber: normalizeString(result.numAprobacion),
    description: "Transferencia Exitosa",
  };
}
