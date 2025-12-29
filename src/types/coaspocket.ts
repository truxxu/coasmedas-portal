/**
 * Status of a Coaspocket (digital pocket) product
 */
export type CoaspocketStatus = 'activo' | 'inactivo';

/**
 * Coaspocket (digital pocket) product information for carousel display
 */
export interface CoaspocketProduct {
  id: string;
  title: string;
  pocketNumber: string;           // e.g., "1234" (will be masked as No.***1234)
  balance: number;                // Saldo del bolsillo
  status: CoaspocketStatus;
}

/**
 * Callback type for coaspocket product selection
 */
export type OnCoaspocketSelect = (product: CoaspocketProduct) => void;

/**
 * Callback type for creating a new pocket
 */
export type OnCreatePocket = () => void;
