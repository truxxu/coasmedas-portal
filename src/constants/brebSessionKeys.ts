export const BREB_SESSION_KEYS = {
  qrPayment: {
    decoded: "brebQrDecoded",
    sourceId: "brebQrSourceId",
    amount: "brebQrAmount",
    confirmation: "brebQrConfirmation",
    result: "brebQrResult",
  },
  keyTransfer: {
    sourceId: "brebKeyTransferSourceId",
    sourceAccount: "brebKeyTransferSourceAccount",
    destinationKey: "brebKeyTransferDestinationKey",
    amount: "brebKeyTransferAmount",
    resolvedKey: "brebKeyTransferResolvedKey",
    confirmation: "brebKeyTransferConfirmation",
    paymentId: "brebKeyTransferPaymentId",
    result: "brebKeyTransferResult",
  },
  keyRegistration: {
    form: "brebKeyRegistrationForm",
    confirmation: "brebKeyRegistrationConfirmation",
    result: "brebKeyRegistrationResult",
  },
  keyModification: {
    form: "brebKeyModificationForm",
    confirmation: "brebKeyModificationConfirmation",
    result: "brebKeyModificationResult",
  },
} as const;

export const BREB_HISTORIAL_CACHE_KEY = "breb:historial";

/**
 * Backend success code returned in `stateCode` for key mutation endpoints
 * (`/bre-b/keys/register`, `/bre-b/keys/update`, `/bre-b/keys/delete`,
 * `/bre-b/keys/block`, `/bre-b/keys/unblock`).
 */
export const BREB_KEY_SUCCESS_STATE_CODE = "U000";

export type BrebFlowName = keyof typeof BREB_SESSION_KEYS;

export function clearBrebFlow(flow: BrebFlowName): void {
  if (typeof window === "undefined") return;
  for (const key of Object.values(BREB_SESSION_KEYS[flow])) {
    sessionStorage.removeItem(key);
  }
}
