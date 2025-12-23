/**
 * Status of a protection/insurance product
 */
export type ProteccionStatus = 'activo' | 'inactivo' | 'cancelado';

/**
 * Protection/insurance product information for carousel display
 */
export interface ProteccionProduct {
  id: string;
  title: string;                    // "Póliza de Vida", "Seguro de Accidentes"
  productNumber: string;            // "65-9" (will be masked as No******65-9)
  status: ProteccionStatus;
  minimumPayment: number;           // Pago Mínimo
  paymentDeadline: string;          // Fecha Límite de Pago (ISO date)
  annualPayment: number;            // Pago Total Anual
}

/**
 * Callback type for protection product selection
 */
export type OnProteccionSelect = (product: ProteccionProduct) => void;
