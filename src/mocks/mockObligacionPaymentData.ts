import { Step } from '@/src/types/stepper';
import {
  ObligacionPaymentProduct,
  ObligacionTransactionResult,
} from '@/src/types/obligacion-payment';

/**
 * Mock obligacion products for payment
 */
export const mockObligacionProducts: ObligacionPaymentProduct[] = [
  {
    id: '1',
    name: 'Crédito de Inversión',
    productNumber: '***5678',
    totalBalance: 12500000,
    minimumPayment: 850000,
    paymentDeadline: '15 Nov 2024',
    status: 'al_dia',
  },
  {
    id: '2',
    name: 'Tarjeta de Crédito',
    productNumber: '***1111',
    totalBalance: 1800000,
    minimumPayment: 180000,
    paymentDeadline: '20 Nov 2024',
    status: 'al_dia',
  },
];

/**
 * Mock user data
 */
export const mockObligacionUserData = {
  name: 'CAMILO ANDRÉS CRUZ',
  document: 'CC 1.***.***234',
};

/**
 * Mock obligacion transaction result (success)
 */
export const mockObligacionTransactionResult: ObligacionTransactionResult = {
  status: 'success',
  lineaCredito: 'Crédito Libre Inversión',
  numeroProducto: '***5488',
  valorPagado: 850000,
  costoTransaccion: 0,
  abonoExcedente: 'Reducción de Cuota',
  fechaTransmision: '3 de septiembre de 2025',
  horaTransaccion: '10:21 pm',
  numeroAprobacion: '463342',
  descripcion: 'Exitosa',
};

/**
 * Mock obligacion transaction result (error)
 */
export const mockObligacionTransactionResultError: ObligacionTransactionResult = {
  status: 'error',
  lineaCredito: 'Crédito Libre Inversión',
  numeroProducto: '***5488',
  valorPagado: 0,
  costoTransaccion: 0,
  abonoExcedente: '-',
  fechaTransmision: '3 de septiembre de 2025',
  horaTransaccion: '10:21 pm',
  numeroAprobacion: '-',
  descripcion: 'Error en la conexión con PSE',
};

/**
 * Obligacion payment flow steps
 */
export const OBLIGACION_PAYMENT_STEPS: Step[] = [
  { number: 1, label: 'Detalle' },
  { number: 2, label: 'Confirmación' },
  { number: 3, label: 'Conectando a PSE' },
  { number: 4, label: 'Finalización' },
];
