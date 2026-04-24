import { CoaspocketProduct } from "@/src/types/coaspocket";
import { MonthOption } from "@/src/types/products";
import { generateMonthOptions } from "@/src/utils/dates";

/**
 * Mock Coaspocket (digital pocket) products for carousel
 */
export const mockCoaspocketProducts: CoaspocketProduct[] = [
  {
    id: "1",
    title: "Vacaciones",
    pocketNumber: "1234",
    balance: 1500000,
    status: "activo",
  },
  {
    id: "2",
    title: "Fondo de Emergencia",
    pocketNumber: "5678",
    balance: 3200000,
    status: "activo",
  },
];

/**
 * Available months for report download
 */
export const mockCoaspocketAvailableMonths: MonthOption[] =
  generateMonthOptions(12);

/**
 * Informational text for the InfoBox
 */
export const mockCoaspocketInfoText =
  'Sugerencia: Para agregar o retirar dinero de tus bolsillos, ve a la sección de Transferencias Internas y selecciona "Entre mis cuentas".';
