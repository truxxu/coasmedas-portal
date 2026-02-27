/**
 * Payment Mappers
 *
 * Maps API response types to UI types used by payment flow organisms.
 * Follows patterns from src/utils/productMappers.ts.
 *
 * @see /types/api/payments.ts — API response/request types
 * @see /src/types/payment.ts — UI types (Pago Unificado)
 * @see /src/types/aportes-payment.ts — UI types (Aportes)
 * @see /src/types/obligacion-payment.ts — UI types (Obligaciones)
 * @see /src/types/protection-payment.ts — UI types (Proteccion)
 */

import { normalizeMoney, normalizeString } from '@/types/api/common';
import type { AccountReference } from '@/types/api/common';
import type {
  PaymentProduct,
  PaymentAccountTarget,
  PaymentTransactionResult,
} from '@/types/api/payments';
import type {
  SavingsAccountResponse,
  CreditAccountResponse,
  ContributionsResponse,
  ProtectionAccountResponse,
} from '@/types/api/products';
import type { PaymentAccount, PendingPayments, TransactionResult } from '@/src/types/payment';
import type { AportesPaymentBreakdown, AportesTransactionResult } from '@/src/types/aportes-payment';
import type { ObligacionSourceAccount, ObligacionPaymentProduct, ObligacionTransactionResult } from '@/src/types/obligacion-payment';
import type { ProtectionPaymentProduct, ProtectionPaymentResultData } from '@/src/types/protection-payment';
import { maskNumber, formatCurrency } from '@/src/utils';
import { parseApiDate, parseApiTime, formatDate } from '@/src/utils/dates';

// ─── Source Account Mappers ───

/**
 * Map savings API response → PaymentAccount (Aportes & Pago Unificado).
 */
export function mapSavingsToPaymentAccount(item: SavingsAccountResponse): PaymentAccount {
  return {
    id: item.idCuenta,
    name: item.nombreProducto,
    balance: normalizeMoney(item.saldoDisponible),
    number: maskNumber(item.numeroCuenta),
  };
}

/**
 * Map savings API response → ObligacionSourceAccount (Obligaciones & Proteccion).
 */
export function mapSavingsToSourceAccount(item: SavingsAccountResponse): ObligacionSourceAccount {
  const balance = normalizeMoney(item.saldoDisponible);
  return {
    id: item.idCuenta,
    type: 'ahorros',
    accountNumber: item.numeroCuenta,
    maskedNumber: maskNumber(item.numeroCuenta),
    balance,
    displayName: `${item.nombreProducto} - Saldo: ${formatCurrency(balance)}`,
  };
}

/**
 * Map credits API response → ObligacionSourceAccount.
 */
export function mapCreditsToSourceAccount(item: CreditAccountResponse): ObligacionSourceAccount {
  const balance = normalizeMoney(item.cupoDisponible);
  return {
    id: item.idCuenta,
    type: 'corriente',
    accountNumber: item.numeroCuenta,
    maskedNumber: maskNumber(item.numeroCuenta),
    balance,
    displayName: `${item.nombreProducto} - Saldo: ${formatCurrency(balance)}`,
  };
}

// ─── Product Mappers ───

/**
 * Map contributions API response → AportesPaymentBreakdown.
 */
export function mapContributionsToBreakdown(data: ContributionsResponse): AportesPaymentBreakdown {
  const a = data.aportes;
  const fechaCubrimiento = parseApiDate(a.fechaCubrimientoAportes);
  return {
    planName: 'Plan de Aportes',
    productNumber: maskNumber(a.numeroCuentaAportes),
    aportesVigentes: normalizeMoney(a.aportesVigentes),
    fondoSolidaridadVigente: normalizeMoney(a.fondosSolidariosVigentes),
    aportesEnMora: normalizeMoney(a.aportesMora),
    fondoSolidaridadEnMora: normalizeMoney(a.fondosSolidariosMora),
    fechaLimitePago: fechaCubrimiento ? formatDate(fechaCubrimiento) : '',
    costoTransaccion: 0,
  };
}

/**
 * Map credit API response → ObligacionPaymentProduct.
 */
export function mapCreditToObligacionPaymentProduct(item: CreditAccountResponse): ObligacionPaymentProduct {
  const diasMora = normalizeMoney(item.diasMora);
  return {
    id: item.idCuenta,
    name: item.nombreProducto,
    productNumber: maskNumber(item.numeroCuenta),
    totalBalance: normalizeMoney(item.pagoTotal),
    minimumPayment: normalizeMoney(item.pagoMinimo),
    paymentDeadline: parseApiDate(item.fechaPago) ? formatDate(parseApiDate(item.fechaPago)) : '',
    status: diasMora > 0 ? 'en_mora' : 'al_dia',
  };
}

/**
 * Map protection API response → ProtectionPaymentProduct.
 */
export function mapProtectionToPaymentProduct(item: ProtectionAccountResponse): ProtectionPaymentProduct {
  const diasMora = normalizeMoney(item.diasMora);
  return {
    id: item.idCuenta,
    title: item.nombreProducto,
    productNumber: maskNumber(item.numeroCuenta),
    nextPaymentAmount: normalizeMoney(item.pagoMinimo),
    status: diasMora > 0 ? 'inactivo' : 'activo',
  };
}

/**
 * Map PaymentProduct[] → PendingPayments (Pago Unificado).
 * Groups products by tipoProducto and sums pagoMinimo per category.
 */
export function mapPaymentProductsToPendingPayments(items: PaymentProduct[]): PendingPayments {
  let aportes = 0;
  let obligaciones = 0;
  let proteccion = 0;

  for (const item of items) {
    const amount = normalizeMoney(item.pagoMinimo);
    const tipo = item.tipoProducto.toUpperCase();
    if (tipo === 'AP') {
      aportes += amount;
    } else if (tipo === 'CR' || tipo === 'OB') {
      obligaciones += amount;
    } else if (tipo === 'PR' || tipo === 'SE') {
      proteccion += amount;
    }
  }

  return {
    aportes,
    obligaciones,
    proteccion,
    total: aportes + obligaciones + proteccion,
  };
}

// ─── Transaction Result Mappers ───

function formatResultDate(fechaTrn: string): string {
  const iso = parseApiDate(fechaTrn);
  if (!iso) return '';
  return formatDate(iso);
}

function formatResultTime(horaTrn: number | string): string {
  return parseApiTime(String(horaTrn));
}

/**
 * Map API payment result → AportesTransactionResult.
 */
export function mapResultToAportes(
  result: PaymentTransactionResult,
  context: { lineaCredito: string; numeroProducto: string },
): AportesTransactionResult {
  return {
    status: 'success',
    lineaCredito: context.lineaCredito,
    numeroProducto: context.numeroProducto,
    valorPagado: normalizeMoney(result.vlrPagoTotal),
    costoTransaccion: 0,
    fechaTransmision: formatResultDate(result.fechaTrn),
    horaTransaccion: formatResultTime(result.horaTrn),
    numeroAprobacion: normalizeString(result.numAprobacion),
    descripcion: 'Exitosa',
  };
}

/**
 * Map API payment result → ObligacionTransactionResult.
 */
export function mapResultToObligacion(
  result: PaymentTransactionResult,
  context: { lineaCredito: string; numeroProducto: string },
): ObligacionTransactionResult {
  return {
    status: 'success',
    lineaCredito: context.lineaCredito,
    numeroProducto: context.numeroProducto,
    valorPagado: normalizeMoney(result.vlrPagoTotal),
    costoTransaccion: 0,
    abonoExcedente: 'Reduccion de Cuota',
    fechaTransmision: formatResultDate(result.fechaTrn),
    horaTransaccion: formatResultTime(result.horaTrn),
    numeroAprobacion: normalizeString(result.numAprobacion),
    descripcion: 'Exitosa',
  };
}

/**
 * Map API payment result → ProtectionPaymentResultData.
 */
export function mapResultToProtection(
  result: PaymentTransactionResult,
  context: { creditLine: string; productNumber: string },
): ProtectionPaymentResultData {
  return {
    success: true,
    creditLine: context.creditLine,
    productNumber: context.productNumber,
    amountPaid: normalizeMoney(result.vlrPagoTotal),
    transactionCost: 0,
    transmissionDate: formatResultDate(result.fechaTrn),
    transactionTime: formatResultTime(result.horaTrn),
    approvalNumber: normalizeString(result.numAprobacion),
    description: 'Exitosa',
  };
}

/**
 * Map API payment result → TransactionResult (Pago Unificado).
 */
export function mapResultToTransaction(result: PaymentTransactionResult): TransactionResult {
  return {
    status: 'success',
    transactionCost: 0,
    transactionDate: formatResultDate(result.fechaTrn),
    transactionTime: formatResultTime(result.horaTrn),
    approvalNumber: normalizeString(result.numAprobacion),
    description: 'Exitosa',
  };
}

// ─── Transaction Request Builders ───

/**
 * Build AccountReference from a SavingsAccountResponse.
 */
export function buildAccountReference(account: SavingsAccountResponse): AccountReference {
  return {
    codigoProductoCobis: account.codigoProductoCobis,
    idCuenta: account.idCuenta,
    numeroCuenta: account.numeroCuenta,
  };
}

/**
 * Build a PaymentAccountTarget for aportes (contributions).
 */
export function buildAportesTarget(contributions: ContributionsResponse, amount: number): PaymentAccountTarget {
  const a = contributions.aportes;
  return {
    idCuenta: normalizeString(a.idCuentaAportes),
    numeroCuenta: a.numeroCuentaAportes,
    codigoProductoCobis: normalizeString(a.codigoProductoCobisAportes),
    vlrPago: amount,
  };
}

/**
 * Build a PaymentAccountTarget from a CreditAccountResponse.
 */
export function buildCreditTarget(credit: CreditAccountResponse, amount: number): PaymentAccountTarget {
  return {
    idCuenta: credit.idCuenta,
    numeroCuenta: credit.numeroCuenta,
    codigoProductoCobis: credit.codigoProductoCobis,
    vlrPago: amount,
  };
}

/**
 * Build a PaymentAccountTarget from a ProtectionAccountResponse.
 */
export function buildProtectionTarget(protection: ProtectionAccountResponse, amount: number): PaymentAccountTarget {
  return {
    idCuenta: protection.idCuenta,
    numeroCuenta: protection.numeroCuenta,
    codigoProductoCobis: protection.codigoProductoCobis,
    vlrPago: amount,
  };
}

/**
 * Build PaymentAccountTarget[] from the unified payment products list.
 */
export function buildUnifiedTargets(products: PaymentProduct[]): PaymentAccountTarget[] {
  return products.map((p) => ({
    idCuenta: p.idCuenta,
    numeroCuenta: p.numeroCuenta,
    codigoProductoCobis: '', // Will be populated from product detail if available
    vlrPago: normalizeMoney(p.pagoMinimo),
  }));
}
