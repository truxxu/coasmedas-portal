export type ProductSecurityStatus = "activo" | "bloqueado";

export interface ProductSecurityItem {
  id: string;
  title: string;
  productNumber: string;
  status: ProductSecurityStatus;
  lastUpdate: string;
}
