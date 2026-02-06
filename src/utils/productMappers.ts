import { normalizeMoney, normalizeString } from '@/types/api/common';
import type {
  BalanceItem,
  MovementItem,
  SavingsAccountResponse,
  CreditAccountResponse,
  InvestmentAccountResponse,
  ContributionsResponse,
  ProtectionAccountResponse,
} from '@/types/api/products';
import type { Account, AccountType } from '@/src/types/account';
import type { Transaction, TransactionType } from '@/src/types/transaction';
import type { SavingsProduct } from '@/src/types/savings';
import type { ObligacionProduct, ObligacionStatus } from '@/src/types/obligaciones';
import type { InversionProduct, InversionStatus } from '@/src/types/inversiones';
import type { AportesProduct } from '@/src/types/products';
import type { ProteccionProduct, ProteccionStatus } from '@/src/types/proteccion';
import { parseApiDate, getTodayDate } from './dates';

// ─── Balance → Account ───

const PRODUCT_TYPE_MAP: Record<string, AccountType> = {
  AHORROS: 'AHORROS',
  CORRIENTE: 'CORRIENTE',
  CREDITO: 'CREDITO',
  INVERSION: 'INVERSION',
};

function resolveAccountType(producto: string): AccountType {
  const upper = producto.toUpperCase();
  for (const key of Object.keys(PRODUCT_TYPE_MAP)) {
    if (upper.includes(key)) return PRODUCT_TYPE_MAP[key];
  }
  return 'AHORROS';
}

export function mapBalanceToAccount(item: BalanceItem, index: number): Account {
  const balance = normalizeMoney(item.saldo);
  return {
    accountNumber: String(index + 1),
    accountType: resolveAccountType(item.producto),
    productCode: item.producto,
    availableBalance: balance,
    totalBalance: balance,
    maskedNumber: `****${String(index + 1).padStart(4, '0')}`,
  };
}

export function mapBalances(items: BalanceItem[]): Account[] {
  return items.map(mapBalanceToAccount);
}

// ─── Movement → Transaction ───

export function mapMovementToTransaction(item: MovementItem, index: number): Transaction {
  const amount = normalizeMoney(item.valorTransaccion);
  const tipo = item.tipoTransaccion.toUpperCase();
  const type: TransactionType = tipo === 'CR' ? 'CREDITO' : 'DEBITO';
  const signedAmount = type === 'DEBITO' ? -Math.abs(amount) : Math.abs(amount);

  return {
    id: item.referencia || String(index + 1),
    description: item.descripcion,
    date: parseApiDate(item.fechaTransaccion),
    amount: signedAmount,
    type,
  };
}

export function mapMovements(items: MovementItem[]): Transaction[] {
  return items.map(mapMovementToTransaction);
}

// ─── Savings ───

export function mapSavingsResponse(item: SavingsAccountResponse): SavingsProduct {
  return {
    id: item.idCuenta,
    title: item.nombreProducto,
    accountType: item.nombreProducto,
    productNumber: item.numeroCuenta,
    balance: normalizeMoney(item.saldoDisponible),
    status: 'activo',
  };
}

export function mapSavingsProducts(items: SavingsAccountResponse[]): SavingsProduct[] {
  return items.map(mapSavingsResponse);
}

// ─── Credits / Obligaciones ───

export function mapCreditResponse(item: CreditAccountResponse): ObligacionProduct {
  const diasMora = normalizeMoney(item.diasMora);
  const status: ObligacionStatus = diasMora > 0 ? 'en_mora' : 'al_dia';

  return {
    id: item.idCuenta,
    title: item.nombreProducto,
    productNumber: item.numeroCuenta,
    productPrefix: item.tipoCartera ? `${item.tipoCartera}-` : undefined,
    currentBalance: normalizeMoney(item.saldo),
    status,
    disbursedAmount: normalizeMoney(item.pagoTotal),
    nextPaymentDate: parseApiDate(item.fechaPago),
    nextPaymentAmount: normalizeMoney(item.pagoMinimo),
  };
}

export function mapCreditProducts(items: CreditAccountResponse[]): ObligacionProduct[] {
  return items.map(mapCreditResponse);
}

// ─── Investments / Inversiones ───

export function mapInvestmentResponse(item: InvestmentAccountResponse): InversionProduct {
  const maturityDate = parseApiDate(item.fechaVencimiento);
  const today = getTodayDate();
  const status: InversionStatus = maturityDate && maturityDate < today ? 'vencido' : 'activo';

  const cobisCode = normalizeString(item.codigoProductoCobis);
  const prefix = cobisCode === '4' ? 'PAC-' : 'DTA-';

  return {
    id: item.idCuenta,
    title: item.nombreProducto,
    productNumber: item.numeroCuenta,
    productPrefix: prefix,
    amount: normalizeMoney(item.saldoTotal),
    status,
    interestRate: `${normalizeMoney(item.tasaEfectiva)}% E.A`,
    termDays: normalizeMoney(item.plazo),
    creationDate: '',
    maturityDate,
  };
}

export function mapInvestmentProducts(items: InvestmentAccountResponse[]): InversionProduct[] {
  return items.map(mapInvestmentResponse);
}

// ─── Contributions / Aportes ───

export function mapContributionsResponse(data: ContributionsResponse): AportesProduct {
  const a = data.aportes;
  return {
    planName: 'Plan de Aportes',
    productNumber: a.numeroCuentaAportes,
    totalBalance: normalizeMoney(a.saldoTotalAportes),
    paymentDeadline: parseApiDate(a.fechaCubrimientoAportes),
    detalleAportes: {
      vigentes: normalizeMoney(a.aportesVigentes),
      enMora: normalizeMoney(a.aportesMora),
      fechaCubrimiento: parseApiDate(a.fechaCubrimientoAportes),
    },
    detalleFondos: {
      vigentes: normalizeMoney(a.fondosSolidariosVigentes),
      enMora: normalizeMoney(a.fondosSolidariosMora),
      fechaCubrimiento: parseApiDate(a.fechaCubrimientoFondosSolidarios),
    },
  };
}

// ─── Protection / Proteccion ───

export function mapProtectionResponse(item: ProtectionAccountResponse): ProteccionProduct {
  const diasMora = normalizeMoney(item.diasMora);
  const status: ProteccionStatus = diasMora > 0 ? 'inactivo' : 'activo';

  return {
    id: item.idCuenta,
    title: item.nombreProducto,
    productNumber: item.numeroCuenta,
    status,
    minimumPayment: normalizeMoney(item.pagoMinimo),
    paymentDeadline: parseApiDate(item.fechaPago),
    annualPayment: normalizeMoney(item.pagoTotal),
  };
}

export function mapProtectionProducts(items: ProtectionAccountResponse[]): ProteccionProduct[] {
  return items.map(mapProtectionResponse);
}
