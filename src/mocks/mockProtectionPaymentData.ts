import type {
  ProtectionPaymentSourceAccount,
  ProtectionPaymentProduct,
  ProtectionPaymentResultData,
} from '@/src/types/protection-payment';

export const PROTECTION_PAYMENT_STEPS = [
  { number: 1, label: 'Detalle' },
  { number: 2, label: 'Confirmacion' },
  { number: 3, label: 'SMS' },
  { number: 4, label: 'Finalizacion' },
];

export const mockProtectionSourceAccounts: ProtectionPaymentSourceAccount[] = [
  {
    id: '1',
    type: 'ahorros',
    accountNumber: '12345678',
    maskedNumber: '***5678',
    balance: 8730500,
    displayName: 'Cuenta de Ahorros - Saldo: $ 8.730.500',
  },
  {
    id: '2',
    type: 'corriente',
    accountNumber: '87654321',
    maskedNumber: '***4321',
    balance: 2500000,
    displayName: 'Cuenta Corriente - Saldo: $ 2.500.000',
  },
];

export const mockProtectionPaymentProducts: ProtectionPaymentProduct[] = [
  {
    id: '1',
    title: 'Seguro de Vida Grupo Deudores',
    productNumber: 'No******65-9',
    nextPaymentAmount: 150000,
    status: 'activo',
  },
  {
    id: '2',
    title: 'Poliza Exequial Familiar',
    productNumber: 'No******12-3',
    nextPaymentAmount: 55000,
    status: 'activo',
  },
];

export const mockProtectionPaymentResult: ProtectionPaymentResultData = {
  success: true,
  creditLine: 'Seguro de Vida Grupo Deudores',
  productNumber: 'No******65-9',
  amountPaid: 150000,
  transactionCost: 0,
  transmissionDate: '3 de septiembre de 2025',
  transactionTime: '10:21 pm',
  approvalNumber: '463342',
  description: 'Exitosa',
};

export const mockProtectionPaymentResultError: ProtectionPaymentResultData = {
  success: false,
  creditLine: 'Seguro de Vida Grupo Deudores',
  productNumber: 'No******65-9',
  amountPaid: 0,
  transactionCost: 0,
  transmissionDate: '3 de septiembre de 2025',
  transactionTime: '10:21 pm',
  approvalNumber: '',
  description: 'Fondos insuficientes',
};

export const MOCK_PROTECTION_VALID_CODE = '123456';
