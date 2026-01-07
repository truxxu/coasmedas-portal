import type {
  SourceAccount,
  RegisteredService,
  UtilityPaymentResult,
} from '@/src/types';
import type { StepperStep } from '@/src/types';

export const UTILITY_PAYMENT_STEPS: StepperStep[] = [
  { number: 1, label: 'Detalle' },
  { number: 2, label: 'Confirmacion' },
  { number: 3, label: 'SMS' },
  { number: 4, label: 'Finalizacion' },
];

export const MOCK_VALID_CODE = '123456';

export const mockUtilitySourceAccounts: SourceAccount[] = [
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

export const mockRegisteredServices: RegisteredService[] = [
  {
    id: '1',
    alias: 'Luz Apartamento',
    provider: 'ENEL',
    serviceType: 'Energia',
    reference: '123456789',
    displayName: 'Luz Apartamento (ENEL - Energia)',
    amount: 185000,
  },
  {
    id: '2',
    alias: 'Gas Casa',
    provider: 'Vanti',
    serviceType: 'Gas',
    reference: '987654321',
    displayName: 'Gas Casa (Vanti - Gas)',
    amount: 95000,
  },
  {
    id: '3',
    alias: 'Agua Oficina',
    provider: 'EAAB',
    serviceType: 'Agua',
    reference: '456789123',
    displayName: 'Agua Oficina (EAAB - Agua)',
    amount: 120000,
  },
];

export const mockUtilityPaymentResult: UtilityPaymentResult = {
  success: true,
  creditLine: 'Cambio de palabras',
  productNumber: '***5678',
  amountPaid: 850000,
  transactionCost: 0,
  transmissionDate: '1 de septiembre de 2025',
  transactionTime: '10:21 pm',
  approvalNumber: '950606',
  description: 'Exitosa',
};

export const mockUtilityPaymentResultError: UtilityPaymentResult = {
  success: false,
  creditLine: 'Cambio de palabras',
  productNumber: '***5678',
  amountPaid: 0,
  transactionCost: 0,
  transmissionDate: '1 de septiembre de 2025',
  transactionTime: '10:21 pm',
  approvalNumber: '',
  description: 'Fondos insuficientes',
};
