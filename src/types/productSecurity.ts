export type ProductSecurityStatus = "activo" | "bloqueado";

export type ProductSecurityAction = "block" | "unblock";

export interface ProductSecurityItem {
  id: string;
  title: string;
  productNumber: string;
  status: ProductSecurityStatus;
  lastUpdate: string;
}

export interface ProductSecurityDraft {
  productId: string;
  action: ProductSecurityAction;
  title: string;
  productNumber: string;
  newStatus: ProductSecurityStatus;
  lastUpdate: string;
}
