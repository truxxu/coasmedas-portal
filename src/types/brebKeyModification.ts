import type { BrebAccountSubType, BrebAccountType } from "@/types/api/breb";
import type { BrebKeyType } from "./brebKeyRegistration";

export interface BrebKeyModificationFormData {
  idKeyCustomer: string;
  currentKeyType: BrebKeyType;
  currentKeyValue: string;
  newKeyType: BrebKeyType;
  newKeyValue: string;
  accountId: string;
  accountLabel: string;
  sourceNumberAccount: string;
  sourceTypeAccount: BrebAccountType;
  sourceSubTypeAccount: BrebAccountSubType;
  sourceTypeAccountDescription: string;
}

export interface BrebKeyModificationConfirmationData {
  idKeyCustomer: string;
  currentKeyTypeLabel: string;
  currentKeyValue: string;
  newKeyType: BrebKeyType;
  newKeyTypeLabel: string;
  newKeyValue: string;
  accountLabel: string;
  sourceNumberAccount: string;
  sourceTypeAccount: BrebAccountType;
  sourceSubTypeAccount: BrebAccountSubType;
  sourceTypeAccountDescription: string;
}

export interface BrebKeyModificationResult {
  success: boolean;
  newKeyTypeLabel: string;
  newKeyValue: string;
  accountLabel: string;
  message?: string;
}
