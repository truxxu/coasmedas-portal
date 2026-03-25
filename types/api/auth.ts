import type { DocumentType, UserIdentification } from "./common";

// ─── /get-salt ───

export type GetSaltRequest = UserIdentification;

export interface GetSaltResponse {
  salt: string;
}

// ─── /send-otp ───

export type SendOtpRequest = UserIdentification;

export interface SendOtpResponse {
  mobile: string;
  email?: string;
}

// ─── /login ───

export interface LoginRequest extends UserIdentification {
  password: string;
  otp: string;
}

export interface LoginResponse {
  address: string;
  city: string;
  documentType: DocumentType;
  documentNumber: string | number;
  email: string;
  mobile: string | number;
  fullName: string;
  phone: string | number;
  state: string;
  token: string;
}

// ─── /send-otp/transaction ───

export interface SendTransactionOtpRequest extends UserIdentification {
  trnType:
    | "PaymentInternal"
    | "TransferInternal"
    | "TransferExternalBanks"
    | "TransferExternalEntities";
}

export interface SendTransactionOtpResponse {
  mobile: string;
  email?: string;
}

// ─── /userValidation ───

export type UserValidationRequest = UserIdentification;

// No payload in response - confirmation only

// ─── /register ───

export interface RegisterRequest extends UserIdentification {
  password: string;
  salt: string;
  otp: string;
}

export interface RegisterResponse {
  address: string;
  city: string;
  documentType: DocumentType;
  documentNumber: string | number;
  email: string;
  mobile: string | number;
  fullName: string;
  phone: string | number;
  state: string;
  token: string;
}

// ─── /update-password ───

export interface UpdatePasswordRequest extends UserIdentification {
  password: string;
  salt: string;
  otp: string;
}

export interface UpdatePasswordResponse {
  address: string;
  city: string;
  documentType: DocumentType;
  documentNumber: string | number;
  email: string;
  mobile: string | number;
  fullName: string;
  phone: string | number;
  state: string;
}
