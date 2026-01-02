import {
  PaymentAccount,
  PendingPayments,
  TransactionResult,
} from '@/src/types/payment';
import { Step } from '@/src/types/stepper';

/**
 * Mock payment accounts
 */
export const mockPaymentAccounts: PaymentAccount[] = [
  {
    id: '1',
    name: 'Cuenta de Ahorros',
    balance: 8730500,
    number: '****4428',
  },
  {
    id: '2',
    name: 'Cuenta Corriente',
    balance: 5200000,
    number: '****7891',
  },
  {
    id: '3',
    name: 'Cuenta Nómina',
    balance: 3450000,
    number: '****2341',
  },
];

/**
 * Mock pending payments
 */
export const mockPendingPayments: PendingPayments = {
  aportes: 170058,
  obligaciones: 1100000,
  proteccion: 205000,
  total: 1475058,
};

/**
 * Mock user data
 */
export const mockUserData = {
  name: 'CAMILO ANDRÉS CRUZ',
  document: 'CC 1.***.***234',
};

/**
 * Mock transaction result (success)
 */
export const mockTransactionResult: TransactionResult = {
  status: 'success',
  transactionCost: 0,
  transactionDate: '19 de diciembre de 2025',
  transactionTime: '11:04 a.m',
  approvalNumber: '102450',
  description: 'Exitosa',
};

/**
 * Mock transaction result (error)
 */
export const mockTransactionResultError: TransactionResult = {
  status: 'error',
  transactionCost: 0,
  transactionDate: '19 de diciembre de 2025',
  transactionTime: '11:04 a.m',
  approvalNumber: '-',
  description: 'Fondos insuficientes',
};

/**
 * Payment flow steps
 */
export const PAYMENT_STEPS: Step[] = [
  { number: 1, label: 'Detalle' },
  { number: 2, label: 'Confirmación' },
  { number: 3, label: 'SMS' },
  { number: 4, label: 'Finalización' },
];

/**
 * Mock SMS verification code (for testing)
 */
export const MOCK_VALID_CODE = '123456';
