import type { SelectOption } from "@/src/atoms";
import type {
  BrebTransaction,
  BrebTransactionStatus,
} from "@/src/types/brebTransactionHistory";

export const mockBrebTransactions: BrebTransaction[] = [
  {
    id: "COA5-TRX-112233",
    title: "Envío con Llave a ANA SOFIA PEREZ",
    type: "envio_llave",
    date: "2025-09-15T15:45:00",
    amount: 50000,
    sign: "debit",
    status: "exitosa",
    keyUsed: "3009876543 (Celular)",
    sourceProduct: "Ahorros ****4428",
    destinationProduct: "Entidad Externa",
  },
  {
    id: "COA5-TRX-112234",
    title: "Recepción por QR a COMERCIO XYZ SAS",
    type: "recepcion_qr",
    date: "2025-09-15T15:45:00",
    amount: 125000,
    sign: "credit",
    status: "exitosa",
    keyUsed: "QR Dinámico",
    sourceProduct: "Entidad Externa",
    destinationProduct: "Ahorros ****4428",
  },
  {
    id: "COA5-TRX-112235",
    title: "Envío con Llave a PEDRO RAMIREZ",
    type: "envio_llave",
    date: "2025-09-15T15:45:00",
    amount: 20000,
    sign: "debit",
    status: "fallida",
    keyUsed: "pedro@example.com (Email)",
    sourceProduct: "Ahorros ****4428",
    destinationProduct: "Entidad Externa",
  },
  {
    id: "COA5-TRX-112236",
    title: "Devolución de Pago a MARKETPLACE ABC",
    type: "devolucion_pago",
    date: "2025-09-15T15:45:00",
    amount: 89900,
    sign: "debit",
    status: "exitosa",
    keyUsed: "900123456 (NIT)",
    sourceProduct: "Ahorros ****4428",
    destinationProduct: "Entidad Externa",
  },
  {
    id: "COA5-TRX-112237",
    title: "Envío con Llave a LUISA FERNANDA CARREÑO",
    type: "envio_llave",
    date: "2025-09-15T15:45:00",
    amount: 25900,
    sign: "debit",
    status: "revision_en_curso",
    keyUsed: "1023456789 (Cédula)",
    sourceProduct: "Ahorros ****4428",
    destinationProduct: "Entidad Externa",
  },
];

export const BREB_TRANSACTION_DATE_OPTIONS: readonly SelectOption[] = [
  { value: "ultimos_30", label: "Últimos 30 días" },
  { value: "ultimos_60", label: "Últimos 60 días" },
  { value: "ultimos_90", label: "Últimos 90 días" },
  { value: "todos", label: "Todos" },
];

export const BREB_TRANSACTION_TYPE_OPTIONS: readonly SelectOption[] = [
  { value: "todos", label: "Todos" },
  { value: "envio_llave", label: "Envío con Llave" },
  { value: "recepcion_llave", label: "Recepción con Llave" },
  { value: "envio_qr", label: "Envío por QR" },
  { value: "recepcion_qr", label: "Recepción por QR" },
  { value: "devolucion_pago", label: "Devolución de Pago" },
];

export const BREB_TRANSACTION_STATUS_OPTIONS: readonly SelectOption[] = [
  { value: "todos", label: "Todos" },
  { value: "exitosa", label: "Exitosa" },
  { value: "fallida", label: "Fallida" },
  { value: "revision_en_curso", label: "Revisión en curso" },
];

export const BREB_TRANSACTION_STATUS_LABELS: Record<
  BrebTransactionStatus,
  string
> = {
  exitosa: "Exitosa",
  fallida: "Fallida",
  revision_en_curso: "Revisión en curso",
};

export function markBrebTransactionUnderReview(id: string): void {
  const tx = mockBrebTransactions.find((t) => t.id === id);
  if (tx) tx.status = "revision_en_curso";
}
