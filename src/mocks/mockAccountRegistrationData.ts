import type {
  RegisteredAccount,
  BankOption,
  CooperativaOption,
  DocumentTypeOption,
  AccountTypeOption,
} from "@/src/types/accountRegistration";

/**
 * Mock registered accounts
 */
export const mockRegisteredAccounts: RegisteredAccount[] = [
  {
    id: "1",
    alias: "Cuenta Mama",
    bankName: "Bancolombia",
    bankType: "otro_banco",
    accountType: "ahorros",
    accountNumberMasked: "****9-01",
    holderName: "MARIA GONZALEZ",
    holderType: "persona_natural",
    fullData: {
      accountBankType: "otro_banco",
      entidadFinanciera: "bancolombia",
      tipoCuenta: "ahorros",
      numeroCuenta: "123456789-01",
      tipoTitular: "persona_natural",
      nombreTitular: "Maria",
      apellidosTitular: "Gonzalez",
      tipoDocumento: "cc",
      documentoTitular: "1234567890",
      alias: "Cuenta Mama",
    },
  },
  {
    id: "2",
    alias: "Cuenta Arriendo",
    bankName: "Davivienda",
    bankType: "otro_banco",
    accountType: "ahorros",
    accountNumberMasked: "****2-10",
    holderName: "INMOBILIARIA XYZ",
    holderType: "persona_juridica",
    fullData: {
      accountBankType: "otro_banco",
      entidadFinanciera: "davivienda",
      tipoCuenta: "ahorros",
      numeroCuenta: "987654322-10",
      tipoTitular: "persona_juridica",
      razonSocial: "Inmobiliaria XYZ",
      tipoDocumento: "nit",
      documentoTitular: "900123456",
      alias: "Cuenta Arriendo",
    },
  },
  {
    id: "3",
    alias: "Coopcentral Pedro",
    bankName: "Coopcentral",
    bankType: "red_coopcentral",
    accountType: "ahorros",
    accountNumberMasked: "****5-55",
    holderName: "PEDRO PEREZ",
    holderType: "persona_natural",
    fullData: {
      accountBankType: "red_coopcentral",
      cooperativa: "coopcentral",
      tipoCuenta: "ahorros",
      numeroCuenta: "555555555-55",
      tipoTitular: "persona_natural",
      nombreTitular: "Pedro",
      apellidosTitular: "Perez",
      tipoDocumento: "cc",
      documentoTitular: "9876543210",
      alias: "Coopcentral Pedro",
    },
  },
  {
    id: "4",
    alias: "Restaurante Almuerzos",
    bankName: "Bancolombia",
    bankType: "otro_banco",
    accountType: "ahorros",
    accountNumberMasked: "****3-45",
    holderName: "DANIELA ALVARADO",
    holderType: "persona_natural",
    fullData: {
      accountBankType: "otro_banco",
      entidadFinanciera: "bancolombia",
      tipoCuenta: "ahorros",
      numeroCuenta: "111222333-45",
      tipoTitular: "persona_natural",
      nombreTitular: "Daniela",
      apellidosTitular: "Alvarado",
      tipoDocumento: "cc",
      documentoTitular: "1122334455",
      alias: "Restaurante Almuerzos",
    },
  },
];

/**
 * Mock bank options for Otro Banco (ACH)
 */
export const mockBanks: BankOption[] = [
  { value: "bancolombia", label: "Bancolombia" },
  { value: "davivienda", label: "Davivienda" },
  { value: "bbva", label: "BBVA" },
  { value: "banco_bogota", label: "Banco de Bogota" },
  { value: "banco_occidente", label: "Banco de Occidente" },
  { value: "banco_popular", label: "Banco Popular" },
  { value: "banco_av_villas", label: "Banco AV Villas" },
  { value: "scotiabank_colpatria", label: "Scotiabank Colpatria" },
];

/**
 * Mock cooperativa options for Red Coopcentral
 */
export const mockCooperativas: CooperativaOption[] = [
  { value: "coopetraban", label: "Coopetraban" },
  { value: "coopcentral", label: "Coopcentral" },
  { value: "confiar", label: "Confiar" },
  { value: "coofinep", label: "Coofinep" },
  { value: "cotrafa", label: "Cotrafa" },
];

/**
 * Mock document type options
 */
export const mockDocumentTypes: DocumentTypeOption[] = [
  { value: "cc", label: "Cedula de Ciudadania" },
  { value: "nit", label: "NIT" },
  { value: "ce", label: "Cedula de Extranjeria" },
  { value: "pasaporte", label: "Pasaporte" },
];

/**
 * Mock account type options
 */
export const mockAccountTypes: AccountTypeOption[] = [
  { value: "ahorros", label: "Ahorros" },
  { value: "corriente", label: "Corriente" },
];
