export type BrebKeyType = "celular" | "correo" | "documento" | "aleatoria";

export type BrebKeyStatus = "activa" | "bloqueada";

export interface BrebRegisteredKey {
  id: string;
  type: BrebKeyType;
  value: string;
  associatedAccountMasked: string;
  lastModified: string;
  status: BrebKeyStatus;
}

export interface BrebKeyRegistrationFormData {
  keyType: BrebKeyType | "";
  keyValue: string;
  accountId: string;
}

export interface BrebKeyRegistrationConfirmationData {
  keyType: BrebKeyType;
  keyTypeLabel: string;
  keyValue: string;
  accountLabel: string;
}

export interface BrebKeyRegistrationResult {
  success: boolean;
  keyValue: string;
  keyTypeLabel: string;
  accountLabel: string;
  message?: string;
}
