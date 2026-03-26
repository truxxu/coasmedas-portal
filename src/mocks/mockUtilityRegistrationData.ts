import type {
  CategoryOption,
  ConvenioOption,
  UtilityRegistrationResult,
} from "@/src/types";

/**
 * Mock categories for utility registration
 */
export const mockCategories: CategoryOption[] = [
  { id: "1", name: "Energía" },
  { id: "2", name: "Agua" },
  { id: "3", name: "Gas" },
  { id: "4", name: "Telefonía" },
];

/**
 * Mock utility providers (convenios) filtered by category
 */
export const mockConvenios: ConvenioOption[] = [
  // Energía (categoryId: 1)
  { id: "1", name: "ENEL - Energia", category: "Energia", categoryId: "1" },
  { id: "5", name: "Codensa - Energia", category: "Energia", categoryId: "1" },
  { id: "9", name: "EPM Energia", category: "Energia", categoryId: "1" },
  { id: "13", name: "Electricaribe", category: "Energia", categoryId: "1" },
  { id: "16", name: "Afinia - Energia", category: "Energia", categoryId: "1" },

  // Agua (categoryId: 2)
  { id: "2", name: "EMCALI - Agua", category: "Agua", categoryId: "2" },
  { id: "7", name: "Acueducto de Bogota", category: "Agua", categoryId: "2" },
  { id: "10", name: "EPM Agua", category: "Agua", categoryId: "2" },
  { id: "14", name: "Triple A - Agua", category: "Agua", categoryId: "2" },
  { id: "17", name: "Acuacar - Agua", category: "Agua", categoryId: "2" },

  // Gas (categoryId: 3)
  { id: "3", name: "Gases de Occidente", category: "Gas", categoryId: "3" },
  { id: "6", name: "Vanti Gas", category: "Gas", categoryId: "3" },
  { id: "11", name: "EPM Gas", category: "Gas", categoryId: "3" },
  { id: "15", name: "Gases del Caribe", category: "Gas", categoryId: "3" },
  { id: "18", name: "Surtigas", category: "Gas", categoryId: "3" },

  // Telefonía (categoryId: 4)
  { id: "4", name: "Claro Telefonia", category: "Telefonia", categoryId: "4" },
  { id: "8", name: "ETB Telefonia", category: "Telefonia", categoryId: "4" },
  { id: "12", name: "UNE Telefonia", category: "Telefonia", categoryId: "4" },
];

/**
 * Mock successful registration result
 */
export const mockRegistrationResultSuccess: UtilityRegistrationResult = {
  success: true,
  status: "Aceptada",
  registrationId: "REG-2024-001234",
  alias: "Luz casa",
  convenio: "ENEL - Energia",
  category: "Energía",
  billNumber: "555",
};

/**
 * Mock failed registration result
 */
export const mockRegistrationResultError: UtilityRegistrationResult = {
  success: false,
  status: "Rechazada",
  alias: "Luz casa",
  convenio: "ENEL - Energia",
  category: "Energía",
  billNumber: "555",
  errorMessage: "El número de factura ya se encuentra registrado.",
};
