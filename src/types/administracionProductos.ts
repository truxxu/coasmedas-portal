export type AdminProductType = "ahorros" | "cupo-rotativo" | "tarjeta-credito";

export interface ProductLimits {
  transactions: { daily: number; weekly: number; monthly: number };
  amounts: { daily: number; weekly: number; monthly: number };
}

export type AdminChannel =
  | "web"
  | "app"
  | "oficinas"
  | "cajeros"
  | "datafonos"
  | "pse"
  | "breb";

export interface AdminProduct {
  id: string;
  type: AdminProductType;
  displayName: string;
  alias: string;
  number: string;
  globalLimits: ProductLimits;
  channelLimits: Partial<Record<AdminChannel, ProductLimits>>;
  defaultGlobalLimits: ProductLimits;
  defaultChannelLimits: Partial<Record<AdminChannel, ProductLimits>>;
  lastUpdate: string;
}

export interface AdminProductFormData {
  alias: string;
  globalLimits: ProductLimits;
  channelLimits: Record<AdminChannel, ProductLimits>;
}

export const ADMIN_CHANNEL_LABELS: Record<AdminChannel, string> = {
  web: "Web",
  app: "App",
  oficinas: "Oficinas",
  cajeros: "Cajeros Automáticos",
  datafonos: "Datáfonos",
  pse: "Pagos por Pse",
  breb: "Bre-b",
};

export const ADMIN_CHANNELS: AdminChannel[] = [
  "web",
  "app",
  "oficinas",
  "cajeros",
  "datafonos",
  "pse",
  "breb",
];

export const ADMIN_PRODUCT_TYPE_LABELS: Record<AdminProductType, string> = {
  ahorros: "Cuentas de Ahorros",
  "cupo-rotativo": "Cupos Rotativos",
  "tarjeta-credito": "Tarjetas de Crédito",
};
