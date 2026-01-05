import { PaymentAccount } from '@/src/types/payment';
import { Step } from '@/src/types/stepper';
import {
  AportesPaymentBreakdown,
  AportesTransactionResult,
} from '@/src/types/aportes-payment';

/**
 * Mock payment accounts for aportes payment
 */
export const mockAportesPaymentAccounts: PaymentAccount[] = [
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
];

/**
 * Mock user data for aportes payment
 */
export const mockAportesUserData = {
  name: 'CAMILO ANDRES CRUZ',
  document: 'CC 1.***.***234',
};

/**
 * Mock aportes payment breakdown
 */
export const mockAportesPaymentBreakdown: AportesPaymentBreakdown = {
  planName: 'Plan Senior',
  productNumber: '***5488',
  aportesVigentes: 500058,
  fondoSolidaridadVigente: 390000,
  aportesEnMora: 0,
  fondoSolidaridadEnMora: 0,
  fechaLimitePago: '15 Nov 2024',
  costoTransaccion: 0,
};

/**
 * Mock aportes transaction result (success)
 */
export const mockAportesTransactionResult: AportesTransactionResult = {
  status: 'success',
  lineaCredito: 'Plan Senior',
  numeroProducto: '***5488',
  valorPagado: 107058,
  costoTransaccion: 0,
  fechaTransmision: '3 de septiembre de 2025',
  horaTransaccion: '10:21 pm',
  numeroAprobacion: '463342',
  descripcion: 'Exitosa',
};

/**
 * Mock aportes transaction result (error)
 */
export const mockAportesTransactionResultError: AportesTransactionResult = {
  status: 'error',
  lineaCredito: 'Plan Senior',
  numeroProducto: '***5488',
  valorPagado: 0,
  costoTransaccion: 0,
  fechaTransmision: '3 de septiembre de 2025',
  horaTransaccion: '10:21 pm',
  numeroAprobacion: '-',
  descripcion: 'Fondos insuficientes',
};

/**
 * Aportes payment flow steps
 */
export const APORTES_PAYMENT_STEPS: Step[] = [
  { number: 1, label: 'Detalle' },
  { number: 2, label: 'Confirmacion' },
  { number: 3, label: 'SMS' },
  { number: 4, label: 'Finalizacion' },
];

/**
 * Mock SMS verification code (for testing)
 */
export const APORTES_MOCK_VALID_CODE = '123456';
