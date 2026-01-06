/**
 * Utility Registration Types
 * Types for the Public Utilities Registration feature (Pagar Servicios Publicos)
 */

/**
 * City dropdown option
 */
export interface CityOption {
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
  cityId: string;
}

/**
 * Form data for utility registration
 */
export interface UtilityRegistrationForm {
  cityId: string;
  cityName: string;
  convenioId: string;
  convenioName: string;
  billNumber: string;
  alias: string;
}

/**
 * Data structure for confirmation display
 */
export interface UtilityConfirmationData {
  city: string;
  convenio: string;
  billNumber: string;
  alias: string;
}

/**
 * Registration status type
 */
export type RegistrationStatus = 'Aceptada' | 'Rechazada' | 'Pendiente';

/**
 * Registration result structure
 */
export interface UtilityRegistrationResult {
  success: boolean;
  status: RegistrationStatus;
  registrationId?: string;
  alias: string;
  convenio: string;
  city: string;
  billNumber: string;
  errorMessage?: string;
}

/**
 * Flow selection type
 */
export type UtilityFlowType = 'inscribir' | 'pagar';

/**
 * Form validation errors
 */
export interface UtilityRegistrationErrors {
  cityId?: string;
  convenioId?: string;
  billNumber?: string;
  alias?: string;
}
