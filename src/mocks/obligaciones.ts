import { ObligacionProduct } from '@/src/types/obligaciones';
import { Transaction } from '@/src/types/transaction';
import { MonthOption } from '@/src/types/products';
import { generateMonthOptions } from '@/src/utils/dates';

/**
 * Mock loan/credit products for carousel
 */
export const mockObligacionProducts: ObligacionProduct[] = [
  {
    id: '1',
    title: 'Crédito de Libre Inversión',
    productNumber: '5678',
    currentBalance: 12500000,
    status: 'al_dia',
    disbursedAmount: 20000000,
    nextPaymentDate: '2025-11-30',
    nextPaymentAmount: 850000,
  },
  {
    id: '2',
    title: 'Cupo Rotativo Personal',
    productNumber: '1010',
    productPrefix: 'CR-',
    currentBalance: 3000000,
    status: 'al_dia',
    disbursedAmount: 5000000,
    nextPaymentDate: '2025-12-20',
    nextPaymentAmount: 150000,
  },
  {
    id: '3',
    title: 'Crédito de Vivienda',
    productNumber: '2233',
    currentBalance: 85000000,
    status: 'en_mora',
    disbursedAmount: 120000000,
    nextPaymentDate: '2025-11-15',
    nextPaymentAmount: 1250000,
  },
];

/**
 * Mock transactions for loan accounts
 */
export const mockObligacionesTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-11-25',
    description: 'Pago cuota mensual',
    amount: 850000,
    type: 'DEBITO',
  },
  {
    id: '2',
    date: '2024-10-25',
    description: 'Pago cuota mensual',
    amount: 850000,
    type: 'DEBITO',
  },
  {
    id: '3',
    date: '2024-09-25',
    description: 'Pago cuota mensual',
    amount: 850000,
    type: 'DEBITO',
  },
];

/**
 * Available months for report download
 */
export const mockObligacionesAvailableMonths: MonthOption[] = generateMonthOptions(12);
