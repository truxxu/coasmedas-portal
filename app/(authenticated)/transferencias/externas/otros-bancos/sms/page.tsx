"use client";

import { useUserContext } from "@/src/contexts";
import { TransferSmsCodePage } from "@/src/organisms";
import { EXTERNAL_TRANSFER_STEPS } from "@/src/mocks";
import { createExternalBankTransfer } from "@/services/transfers.service";
import { mapExternalBankTransferResult } from "@/lib/mappers/externalTransfers.mapper";

export default function SMSVerificationPage() {
  const { user } = useUserContext();
  const { documentType, documentNumber } = user ?? {};

  return (
    <TransferSmsCodePage
      sessionKey="externalTransferConfirmation"
      fallbackPath="/transferencias/externas/otros-bancos"
      successPath="/transferencias/externas/otros-bancos/resultado"
      confirmationPath="/transferencias/externas/otros-bancos/confirmacion"
      breadcrumbs={["Inicio", "Transferencias", "A Otros Bancos"]}
      welcomeBarTitle="A Otros Bancos"
      steps={EXTERNAL_TRANSFER_STEPS}
      submitLabel="Transferir"
      resendTrnType="TransferExternalBanks"
      onSubmit={async (otp) => {
        if (!documentType || !documentNumber)
          throw new Error("Sesion no valida");

        const txRequestStr = sessionStorage.getItem(
          "externalTransferTxRequest",
        );
        if (!txRequestStr)
          throw new Error("Datos de transaccion no encontrados");

        const txRequest = JSON.parse(txRequestStr);
        const result = await createExternalBankTransfer({
          documentType,
          documentNumber,
          otp,
          ...txRequest,
        });

        const sourceName =
          sessionStorage.getItem("externalTransferSourceName") || "";
        const destBank =
          sessionStorage.getItem("externalTransferDestBank") || "";
        const destAccNum =
          sessionStorage.getItem("externalTransferDestAccNum") || "";
        const concept = sessionStorage.getItem("externalTransferConcept") || "";

        const mappedResult = mapExternalBankTransferResult(result, {
          sourceAccount: sourceName,
          destinationBank: destBank,
          destinationAccountNumber: destAccNum,
          concept,
        });
        sessionStorage.setItem(
          "externalTransferResult",
          JSON.stringify(mappedResult),
        );
      }}
    />
  );
}
