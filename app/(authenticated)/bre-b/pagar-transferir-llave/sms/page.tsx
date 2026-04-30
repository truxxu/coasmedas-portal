"use client";

import { TarjetaSmsCodePage } from "@/src/organisms/TarjetaSmsCodePage";
import {
  BREB_KEY_TRANSFER_STEPS,
  mockBrebKeyTransferResultSuccess,
} from "@/src/mocks";
import type {
  BrebKeyTransferConfirmationData,
  BrebKeyTransferResult,
} from "@/src/types/brebKeyTransfer";
import { BREB_SESSION_KEYS } from "@/src/constants/brebSessionKeys";

export default function BrebKeyTransferSmsPage() {
  return (
    <TarjetaSmsCodePage<BrebKeyTransferConfirmationData, BrebKeyTransferResult>
      sessionKey={BREB_SESSION_KEYS.keyTransfer.confirmation}
      resultKey={BREB_SESSION_KEYS.keyTransfer.result}
      fallbackPath="/bre-b/pagar-transferir-llave"
      successPath="/bre-b/pagar-transferir-llave/resultado"
      confirmationPath="/bre-b/pagar-transferir-llave/confirmacion"
      breadcrumbs={["Inicio", "Bre-B", "Pagar con Llave"]}
      welcomeBarTitle="Pagar con Llave"
      steps={BREB_KEY_TRANSFER_STEPS}
      submitLabel="Continuar"
      buildResult={(confirmation, meta) => ({
        ...mockBrebKeyTransferResultSuccess,
        sourceAccount: confirmation.sourceProduct,
        destinationHolder: confirmation.destinationHolder,
        destinationKey: confirmation.destinationKey,
        amount: confirmation.amount,
        transactionDate: meta.fechaTransaccion,
        transactionTime: meta.horaTransaccion,
      })}
    />
  );
}
