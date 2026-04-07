import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";
import { Transaction } from "@/src/types/transaction";
import { MonthOption } from "@/src/types/products";
import { generateMonthOptions } from "@/src/utils/dates";

export const mockTarjetaCreditoProducts: TarjetaCreditoProduct[] = [
  {
    id: "1",
    title: "Tarjeta de Crédito Visa Clásica",
    maskedNumber: "*** *** *** 1111",
    last4: "1111",
    status: "activa",
    deudaTotal: 1800000,
    cupoTotal: 5000000,
    cupoUtilizado: 1800000,
    cupoDisponible: 3200000,
    pagoMinimo: 300000,
    fechaLimitePago: "2025-11-15",
  },
  {
    id: "2",
    title: "Tarjeta de Crédito Mastercard Gold",
    maskedNumber: "*** *** *** 2222",
    last4: "2222",
    status: "pendiente_activacion",
    deudaTotal: 0,
    cupoTotal: 0,
    cupoUtilizado: 0,
    cupoDisponible: 0,
    pagoMinimo: 0,
    fechaLimitePago: "",
  },
  {
    id: "3",
    title: "Tarjeta de Crédito Visa Platinum",
    maskedNumber: "*** *** *** 3333",
    last4: "3333",
    status: "bloqueada",
    deudaTotal: 0,
    cupoTotal: 0,
    cupoUtilizado: 0,
    cupoDisponible: 0,
    pagoMinimo: 0,
    fechaLimitePago: "",
  },
];

export const mockTarjetaCreditoTransactions: Transaction[] = [
  {
    id: "1",
    date: "2025-08-25",
    description: "Compra en supermercado",
    amount: 250000,
    type: "DEBITO",
  },
  {
    id: "2",
    date: "2025-08-15",
    description: "Pago mínimo",
    amount: 300000,
    type: "CREDITO",
  },
  {
    id: "3",
    date: "2025-08-10",
    description: "Avance en efectivo",
    amount: 500000,
    type: "DEBITO",
  },
  {
    id: "4",
    date: "2025-08-05",
    description: "Compra online",
    amount: 150000,
    type: "DEBITO",
  },
];

export const mockTarjetaCreditoAvailableMonths: MonthOption[] =
  generateMonthOptions(12);
