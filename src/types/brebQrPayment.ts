export interface BrebQrDecodedPayload {
  destinationName: string;
  destinationKey: string;
  amount: number;
}

export interface BrebQrPaymentFormData {
  sourceAccountId: string;
  decoded: BrebQrDecodedPayload;
  amount: number;
}

export interface BrebQrPaymentConfirmationData {
  sourceProduct: string;
  destinationName: string;
  destinationKey: string;
  amount: number;
}

export interface BrebQrPaymentResult {
  status: "success" | "error";
  destinationName: string;
  destinationKey: string;
  amount: number;
  sourceAccount: string;
  transactionDate: string;
  transactionTime: string;
  referenceNumber: string;
  errorMessage?: string;
}
