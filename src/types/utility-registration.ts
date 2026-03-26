/**
 * Utility Registration Types
 * Types for the Public Utilities Registration feature (Pagar Servicios Públicos)
 */

/**
 * Category dropdown option
 */
export interface CategoryOption {
  id: string;
  name: string;
}

/**
 * Utility provider (convenio) dropdown option
 */
export interface ConvenioOption {
  id: string;
  name: string;
  category: string;
  categoryId: string;
}

/**
 * Form data for utility registration
 */
export interface UtilityRegistrationForm {
  categoryId: string;
  categoryName: string;
  convenioId: string;
  convenioName: string;
  billNumber: string;
  alias: string;
}

/**
 * Data structure for confirmation display
 */
export interface UtilityConfirmationData {
  category: string;
  convenio: string;
  billNumber: string;
  alias: string;
}

/**
 * Registration status type
 */
export type RegistrationStatus = "Aceptada" | "Rechazada" | "Pendiente";

/**
 * Registration result structure
 */
export interface UtilityRegistrationResult {
  success: boolean;
  status: RegistrationStatus;
  registrationId?: string;
  alias: string;
  convenio: string;
  category: string;
  billNumber: string;
  errorMessage?: string;
}

/**
 * Flow selection type
 */
export type UtilityFlowType = "inscribir" | "pagar";

/**
 * Form validation errors
 */
export interface UtilityRegistrationErrors {
  categoryId?: string;
  convenioId?: string;
  billNumber?: string;
  alias?: string;
}
