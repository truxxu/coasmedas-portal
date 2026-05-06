import type { UserIdentification, DeviceInfo } from "./common";

// ─── Shared BRE-B Enums & Building Blocks ───

/**
 * Key types accepted by BRE-B.
 * - `E` Email
 * - `M` Mobile number
 * - `B` Business code
 * - `O` Alphanumeric
 * - `NRIC` Document ID
 */
export type BrebKeyType = "E" | "M" | "B" | "O" | "NRIC";

/** Key state per Visionamos BRE-B (`ACTV` = active). */
export type BrebKeyState = "ACTV" | "BLCK" | "INAC" | (string & {});

/** Account type used by BRE-B (`AH` savings, `CR` credit). */
export type BrebAccountType = "AH" | "CR";

/** Account subtype used by BRE-B (`AV` vista, `CR` credit, `AH` savings). */
export type BrebAccountSubType = "AV" | "CR" | "AH";

/**
 * BRE-B transaction state codes.
 * @see /docs/CONSOLIDATED_API_REFERENCE.md - POST /bre-b/txs/status
 */
export type BrebTxState =
  | "SCHD"
  | "PROC"
  | "ACPT"
  | "STTL"
  | "RTRN"
  | "CNCL"
  | "TIMEOUT";

/**
 * Common context sent to most BRE-B endpoints: user identification + display
 * name + device info collected from the client.
 */
export interface BrebDeviceContext extends UserIdentification, DeviceInfo {
  /** Full name of the authenticated user. */
  user: string;
}

// ─── Domain Objects ───

/**
 * BRE-B-eligible account returned by `/bre-b/accounts/list`.
 * `codigoProductoCobis` arrives as a number in actual responses.
 */
export interface BrebAccount {
  numeroCuenta: string;
  aliasCuenta: string;
  nombreProducto: string;
  tipoCuenta: BrebAccountType;
  subtipoCuenta: BrebAccountSubType;
  codigoProductoCobis: number;
  idCuentaAhorroPermanente: string;
}

/**
 * BRE-B key as returned by `/bre-b/keys/list` and `/bre-b/keys/resolve`.
 */
export interface BrebKey {
  idKeyCustomer: string;
  stateKeyCustomer: BrebKeyState;
  typeKeyCustomer: BrebKeyType;
  valueKeyCustomer: string;
  sourceNumberAccount: string;
  sourceTypeAccount: BrebAccountType;
  sourceSubTypeAccount: BrebAccountSubType;
}

// ─── Accounts ───

/**
 * Request for `/bre-b/accounts/list`.
 */
export interface ListBrebAccountsRequest extends UserIdentification {
  /** Pagination indicator (optional per mobile evidence). */
  indPag?: string;
}

export type ListBrebAccountsResponse = BrebAccount[];

// ─── Keys: List ───

export type ListBrebKeysRequest = BrebDeviceContext;

export interface ListBrebKeysResponse {
  keysCustomers: BrebKey[];
}

// ─── Keys: Resolve ───

export interface ResolveBrebKeyRequest extends BrebDeviceContext {
  valueKeyCustomer: string;
}

export interface ResolveBrebKeyResponse {
  firstName: string;
  surname: string;
  identification: string;
  typeIdentification: string;
  keysCustomers: BrebKey[];
}

// ─── Keys: Create / Update / Delete / Block / Unblock ───

/**
 * Request for `/bre-b/keys/create`.
 *
 * `update`, `delete`, `block`, and `unblock` use the same shape with an
 * additional `idKeyCustomer` field — see {@link KeyMutationRequest}.
 */
export interface CreateBrebKeyRequest extends BrebDeviceContext {
  typeKeyCustomer: BrebKeyType;
  valueKeyCustomer: string;
  sourceNumberAccount: string;
  sourceTypeAccount: BrebAccountType;
  sourceSubTypeAccount: BrebAccountSubType;
  sourceTypeAccountDescription: string;
  firstName: string;
  surName: string;
}

/**
 * Result from a successful key creation/mutation.
 * Returned shape is consistent across create/update/block/unblock.
 * Most fields are absent on early-rejection responses (e.g. `{ stateCode: "U119" }`).
 */
export interface CreateBrebKeyResponse {
  idKeyCustomer?: string;
  stateKeyCustomer?: BrebKeyState;
  creationDateTime?: string;
  statusUpdateDateTime?: string;
  sourceTypeAccount?: BrebAccountType;
  sourceSubTypeAccount?: BrebAccountSubType;
  sourceNumberAccount?: string;
  firstName?: string;
  surName?: string;
  sourceIdentification?: string;
  sourceTypeIdentification?: string;
  sourceTypePerson?: string;
  valueKeyCustomer?: string;
  typeKeyCustomer?: BrebKeyType;
  sourceEntityIdentification?: string;
  sourceEntityName?: string;
  stateCode: string;
  stateDescriptionSystem?: string;
}

/** Shared shape for update/delete/block/unblock — adds `idKeyCustomer`. */
export interface KeyMutationRequest extends CreateBrebKeyRequest {
  idKeyCustomer: string;
}

export type UpdateBrebKeyRequest = KeyMutationRequest;
export type DeleteBrebKeyRequest = KeyMutationRequest;
export type BlockBrebKeyRequest = KeyMutationRequest;
export type UnblockBrebKeyRequest = KeyMutationRequest;

export type UpdateBrebKeyResponse = CreateBrebKeyResponse;
export type DeleteBrebKeyResponse = CreateBrebKeyResponse;
export type BlockBrebKeyResponse = CreateBrebKeyResponse;
export type UnblockBrebKeyResponse = CreateBrebKeyResponse;

// ─── Terms ───

/**
 * Request for `/bre-b/terms/accept`.
 * Only `ip` from the device info block is used here per backend doc.
 */
export interface AcceptBrebTermsRequest extends UserIdentification {
  user: string;
  ip: string;
}

export interface AcceptBrebTermsResponse {
  code: number;
  message: string;
  response: {
    approved: boolean;
  };
}

// ─── Transactions: Init ───

export interface InitBrebTxRequest extends BrebDeviceContext {
  sourceFirstName: string;
  sourceSurName: string;
  sourceNumberAccount: string;
  sourceTypeAccount: BrebAccountType;
  sourceSubTypeAccount: BrebAccountSubType;
  sourceTypeAccountDescription: string;
  targetNode: string;
  targetResolutionId: string;
  targetValueKeyCustomer: string;
  targetTypeKeyCustomer: BrebKeyType;
  targetEntity: string;
  targetNumberAccount: string;
  targetTypeAccount: BrebAccountType;
  targetSubTypeAccount: BrebAccountSubType;
  targetTypeAccountDescription: string;
  targetIdentification: string;
  targetTypeIdentification: string;
  targetFirstName: string;
  targetSurName: string;
  amount: number;
}

export interface InitBrebTxResponse {
  paymentId: string;
  sequence: string;
}

// ─── Transactions: Status ───

export interface BrebTxStatusRequest extends BrebDeviceContext {
  paymentId: string;
}

export interface BrebTxStatusResponse {
  stateCodePayment: BrebTxState;
  statePaymentDescription: string;
  stateDescriptionCustomer: string;
}

// ─── Transactions: List ───

/**
 * Request for `/bre-b/txs/list`.
 *
 * Per backend spec, dates are sent as numeric `YYYYMMDD` and hours as
 * zero-padded string `HHMMSS`. Mobile sends dates as strings, but backend
 * is the source of truth.
 */
export interface ListBrebTxsRequest extends UserIdentification {
  /** Inclusive start date as YYYYMMDD (e.g. 20240101). */
  initialDate: number;
  /** Start hour as HHMMSS (e.g. "000000"). */
  initialHour: string;
  /** Inclusive end date as YYYYMMDD. */
  finalDate: number;
  /** End hour as HHMMSS (e.g. "235959"). */
  finalHour: string;
}

/**
 * Single movement entry. Backend doc shows `movements: [...]` without
 * specifying item shape — kept loose until backend confirms.
 */
export interface BrebTxMovement {
  [key: string]: unknown;
}

export interface ListBrebTxsResponse {
  movements: BrebTxMovement[];
}
