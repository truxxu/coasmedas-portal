import { SavingsProduct } from '@/src/types/savings';
import { Transaction } from '@/src/types/transaction';
import { MonthOption } from '@/src/types/products';
import { generateMonthOptions } from '@/src/utils/dates';

/**
 * Mock savings products for carousel
 */
export const mockSavingsProducts: SavingsProduct[] = [
  {
    id: '1',
    title: 'Cuenta de Ahorros',
    accountType: 'Ahorros',
    productNumber: '4428',
    balance: 8730500,
    status: 'activo',
  },
  {
    id: '2',
    title: 'Ahorro Programado',
    accountType: 'Ahorro Programado',
    productNumber: '1234',
    balance: 2500000,
    status: 'activo',
  },
  {
    id: '3',
    title: 'Ahorro Metas',
    accountType: 'Ahorro',
    productNumber: '9876',
    balance: 1200000,
    status: 'bloqueado',
  },
];

/**
 * Mock transactions for savings accounts
 */
export const mockAhorrosTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-11-20',
    description: 'Abono mensual',
    amount: 20000,
    type: 'CREDITO',
  },
  {
    id: '2',
    date: '2024-11-15',
    description: 'Transferencia recibida',
    amount: 150000,
    type: 'CREDITO',
  },
  {
    id: '3',
    date: '2024-11-10',
    description: 'Retiro cajero',
    amount: 50000,
    type: 'DEBITO',
  },
];

/**
 * Available months for report download
 */
export const mockAhorrosAvailableMonths: MonthOption[] = generateMonthOptions(12);
