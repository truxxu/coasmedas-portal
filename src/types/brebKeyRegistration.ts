import type { BrebAccountSubType, BrebAccountType } from "@/types/api/breb";

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
  sourceNumberAccount: string;
  sourceTypeAccount: BrebAccountType;
  sourceSubTypeAccount: BrebAccountSubType;
  sourceTypeAccountDescription: string;
}

export interface BrebKeyRegistrationConfirmationData {
  keyType: BrebKeyType;
  keyTypeLabel: string;
  keyValue: string;
  accountLabel: string;
  sourceNumberAccount: string;
  sourceTypeAccount: BrebAccountType;
  sourceSubTypeAccount: BrebAccountSubType;
  sourceTypeAccountDescription: string;
}

export interface BrebKeyRegistrationResult {
  success: boolean;
  keyValue: string;
  keyTypeLabel: string;
  accountLabel: string;
  message?: string;
  errorCode?: string;
}
