/**
 * Account type options for registration
 */
export type AccountBankType = "otro_banco" | "red_coopcentral";

/**
 * Account holder type options
 */
export type HolderType = "persona_natural" | "persona_juridica";

/**
 * Account type (savings/checking)
 */
export type AccountType = "ahorros" | "corriente";

/**
 * Document type options
 */
export type DocumentType = "cc" | "nit" | "ce" | "pasaporte";

/**
 * Bank option for dropdown
 */
export interface BankOption {
  value: string;
  label: string;
}

/**
 * Cooperativa option for dropdown
 */
export interface CooperativaOption {
  value: string;
  label: string;
}

/**
 * Document type option for dropdown
 */
export interface DocumentTypeOption {
  value: DocumentType;
  label: string;
}

/**
 * Account type option for dropdown
 */
export interface AccountTypeOption {
  value: AccountType;
  label: string;
}

/**
 * Registration form data
 */
export interface AccountRegistrationFormData {
  // Account type selection
  accountBankType: AccountBankType;
  // For Otro Banco (ACH)
  entidadFinanciera?: string;
  // For Red Coopcentral
  cooperativa?: string;
  // Common fields
  tipoCuenta: AccountType;
  numeroCuenta: string;
  // Holder type selection
  tipoTitular: HolderType;
  // For Persona Natural
  nombreTitular?: string;
  apellidosTitular?: string;
  // For Persona Juridica
  razonSocial?: string;
  // Document fields
  tipoDocumento: DocumentType;
  documentoTitular: string;
  alias: string;
}

/**
 * Registered account data
 */
export interface RegisteredAccount {
  id: string;
  alias: string;
  bankName: string;
  bankType: AccountBankType;
  accountType: AccountType;
  accountNumberMasked: string;
  holderName: string;
  holderType: HolderType;
  // Full data for edit mode
  fullData?: AccountRegistrationFormData;
}

/**
 * Page state management
 */
export interface AccountRegistrationPageState {
  mode: "register" | "edit";
  editingAccountId: string | null;
  registeredAccounts: RegisteredAccount[];
  showSuccessModal: boolean;
  showDeleteModal: boolean;
  accountToDelete: string | null;
  successModalType: "register" | "edit";
}
