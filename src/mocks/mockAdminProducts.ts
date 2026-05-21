import type { AdminProduct, ProductLimits } from "@/src/types";

const ahorrosGlobal: ProductLimits = {
  transactions: { daily: 10, weekly: 50, monthly: 200 },
  amounts: { daily: 5_000_000, weekly: 20_000_000, monthly: 50_000_000 },
};

const ahorrosWeb: ProductLimits = {
  transactions: { daily: 5, weekly: 25, monthly: 100 },
  amounts: { daily: 2_000_000, weekly: 10_000_000, monthly: 25_000_000 },
};

const cupoGlobal: ProductLimits = {
  transactions: { daily: 5, weekly: 20, monthly: 60 },
  amounts: { daily: 10_000_000, weekly: 30_000_000, monthly: 80_000_000 },
};

const cupoWeb: ProductLimits = {
  transactions: { daily: 3, weekly: 12, monthly: 30 },
  amounts: { daily: 5_000_000, weekly: 15_000_000, monthly: 40_000_000 },
};

const tarjetaGlobal: ProductLimits = {
  transactions: { daily: 8, weekly: 30, monthly: 100 },
  amounts: { daily: 1_000_000, weekly: 4_000_000, monthly: 12_000_000 },
};

const tarjetaWeb: ProductLimits = {
  transactions: { daily: 4, weekly: 15, monthly: 50 },
  amounts: { daily: 500_000, weekly: 2_000_000, monthly: 6_000_000 },
};

export const mockAdminProducts: AdminProduct[] = [
  {
    id: "cuenta-ahorros-4428",
    type: "ahorros",
    displayName: "Cuenta de Ahorros (***4428)",
    alias: "Cuenta de Ahorros",
    number: "***4428",
    globalLimits: ahorrosGlobal,
    channelLimits: { web: ahorrosWeb },
    defaultGlobalLimits: ahorrosGlobal,
    defaultChannelLimits: { web: ahorrosWeb },
    lastUpdate: "2025-10-10",
  },
  {
    id: "cupo-rotativo-1010",
    type: "cupo-rotativo",
    displayName: "Cupo Rotativo Personal (CR-***1010)",
    alias: "Cupo Rotativo Personal",
    number: "CR-***1010",
    globalLimits: cupoGlobal,
    channelLimits: { web: cupoWeb },
    defaultGlobalLimits: cupoGlobal,
    defaultChannelLimits: { web: cupoWeb },
    lastUpdate: "2025-10-10",
  },
  {
    id: "tarjeta-credito-1111",
    type: "tarjeta-credito",
    displayName: "Tarjeta de Crédito Visa Clásica (***1111)",
    alias: "Tarjeta Visa Clásica",
    number: "***1111",
    globalLimits: tarjetaGlobal,
    channelLimits: { web: tarjetaWeb },
    defaultGlobalLimits: tarjetaGlobal,
    defaultChannelLimits: { web: tarjetaWeb },
    lastUpdate: "2025-10-10",
  },
];
