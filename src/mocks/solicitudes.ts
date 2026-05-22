import type { SolicitudDocumento } from "@/src/types";

export const mockSolicitudes: SolicitudDocumento[] = [
  {
    id: "sol-1",
    title: "Extracto Tarjeta de Crédito Visa Clásica - Oct. 2025",
    requestedAt: "22/09/25, 4:50 p.m.",
    status: "solicitado",
  },
  {
    id: "sol-2",
    title: "Extracto Cuenta de Ahorros - Oct 2025",
    requestedAt: "21/09/25, 3:30 p. m.",
    status: "exitoso",
  },
  {
    id: "sol-3",
    title: "Certificado Retención en la fuente - 2024",
    requestedAt: "22/09/25, 10:30 a. m.",
    status: "en_proceso",
  },
  {
    id: "sol-4",
    title: "Certificado Crédito de Libre Inversión",
    requestedAt: "22/09/25, 3:00 p. m.",
    status: "solicitado",
  },
  {
    id: "sol-5",
    title: "Extracto Tarjeta de Crédito - Sep 2025",
    requestedAt: "19/09/25, 3:30 p. m.",
    status: "solicitado",
  },
];
