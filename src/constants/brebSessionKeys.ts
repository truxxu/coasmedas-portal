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
    destinationKey: "brebKeyTransferDestinationKey",
    amount: "brebKeyTransferAmount",
    confirmation: "brebKeyTransferConfirmation",
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

export type BrebFlowName = keyof typeof BREB_SESSION_KEYS;

export function clearBrebFlow(flow: BrebFlowName): void {
  if (typeof window === "undefined") return;
  for (const key of Object.values(BREB_SESSION_KEYS[flow])) {
    sessionStorage.removeItem(key);
  }
}
