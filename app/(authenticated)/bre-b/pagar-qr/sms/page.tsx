"use client";

import { TarjetaSmsCodePage } from "@/src/organisms/TarjetaSmsCodePage";
import {
  BREB_QR_PAYMENT_STEPS,
  mockBrebQrPaymentResultSuccess,
} from "@/src/mocks";
import type {
  BrebQrPaymentConfirmationData,
  BrebQrPaymentResult,
} from "@/src/types/brebQrPayment";
import { BREB_SESSION_KEYS } from "@/src/constants/brebSessionKeys";

export default function BrebQrPaymentSmsPage() {
  return (
    <TarjetaSmsCodePage<BrebQrPaymentConfirmationData, BrebQrPaymentResult>
      sessionKey={BREB_SESSION_KEYS.qrPayment.confirmation}
      resultKey={BREB_SESSION_KEYS.qrPayment.result}
      fallbackPath="/bre-b/pagar-qr"
      successPath="/bre-b/pagar-qr/resultado"
      confirmationPath="/bre-b/pagar-qr/confirmacion"
      breadcrumbs={["Inicio", "Bre-B", "Pagar con QR"]}
      welcomeBarTitle="Pagar con QR"
      steps={BREB_QR_PAYMENT_STEPS}
      submitLabel="Continuar"
      buildResult={(confirmation, meta) => ({
        ...mockBrebQrPaymentResultSuccess,
        sourceAccount: confirmation.sourceProduct,
        destinationName: confirmation.destinationName,
        destinationKey: confirmation.destinationKey,
        amount: confirmation.amount,
        transactionDate: meta.fechaTransaccion,
        transactionTime: meta.horaTransaccion,
      })}
    />
  );
}
