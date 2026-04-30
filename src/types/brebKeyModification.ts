import type { BrebKeyType } from "./brebKeyRegistration";

export interface BrebAvailableNewKey {
  id: string;
  type: BrebKeyType;
  value: string;
  displayLabel: string;
}

export interface BrebKeyInUseElsewhere {
  id: string;
  type: BrebKeyType;
  value: string;
  inUseAt: string;
}

export interface BrebKeyModificationFormData {
  currentKeyId: string;
  newKeyId: string;
  newKeyType: BrebKeyType;
  newKeyValue: string;
  accountId: string;
}

export interface BrebKeyModificationConfirmationData {
  currentKeyTypeLabel: string;
  currentKeyValue: string;
  newKeyTypeLabel: string;
  newKeyValue: string;
  accountLabel: string;
}

export interface BrebKeyModificationResult {
  success: boolean;
  newKeyTypeLabel: string;
  newKeyValue: string;
  accountLabel: string;
  message?: string;
}
