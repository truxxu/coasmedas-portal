import { InversionProduct } from '@/src/types/inversiones';
import { Transaction, MonthOption } from '@/src/types/products';
import { generateMonthOptions } from '@/src/utils/dates';

/**
 * Mock CDAT investment products for carousel
 */
export const mockInversionProducts: InversionProduct[] = [
  {
    id: '1',
    title: 'CDTA Tradicional',
    productNumber: '123',
    productPrefix: 'DTA-',
    amount: 25000000,
    status: 'activo',
    interestRate: '12.5% E.A',
    termDays: 180,
    creationDate: '2025-08-15',
    maturityDate: '2026-02-11',
  },
  {
    id: '2',
    title: 'CDTA Plus',
    productNumber: '456',
    productPrefix: 'DTA-',
    amount: 50000000,
    status: 'activo',
    interestRate: '13.0% E.A',
    termDays: 360,
    creationDate: '2025-10-01',
    maturityDate: '2026-09-26',
  },
  {
    id: '3',
    title: 'CDTA Flexible',
    productNumber: '789',
    productPrefix: 'DTA-',
    amount: 15000000,
    status: 'vencido',
    interestRate: '11.0% E.A',
    termDays: 90,
    creationDate: '2025-06-01',
    maturityDate: '2025-08-30',
  },
];

/**
 * Mock transactions for investment accounts
 */
export const mockInversionesTransactions: Transaction[] = [
  {
    id: '1',
    date: '2025-08-15',
    description: 'Apertura CDAT',
    amount: 25000000,
    type: 'debit',
  },
  {
    id: '2',
    date: '2025-11-15',
    description: 'Liquidacion intereses',
    amount: 937500,
    type: 'credit',
  },
];

/**
 * Available months for report download
 */
export const mockInversionesAvailableMonths: MonthOption[] = generateMonthOptions(12);
