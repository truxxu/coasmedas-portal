/**
 * Status of an investment product (CDAT)
 */
export type InversionStatus = 'activo' | 'vencido';

/**
 * Investment/CDAT product information for carousel display
 */
export interface InversionProduct {
  id: string;
  title: string;
  productNumber: string;
  productPrefix?: string;           // e.g., "DTA-" for CDATs
  amount: number;                   // Monto del CDAT
  status: InversionStatus;
  interestRate: string;             // Tasa E.A. (e.g., "12.5% E.A")
  termDays: number;                 // Plazo in days (e.g., 180)
  creationDate: string;             // F. Creacion (ISO date)
  maturityDate: string;             // F. Vencimiento (ISO date)
}

/**
 * Callback type for investment product selection
 */
export type OnInversionSelect = (product: InversionProduct) => void;
