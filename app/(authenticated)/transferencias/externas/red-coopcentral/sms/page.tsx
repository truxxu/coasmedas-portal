"use client";

import { useUserContext } from "@/src/contexts";
import { TransferSmsCodePage } from "@/src/organisms";
import { RED_COOP_TRANSFER_STEPS } from "@/src/mocks";
import { createExternalEntityTransfer } from "@/services/transfers.service";
import { mapExternalEntityTransferResult } from "@/lib/mappers/externalTransfers.mapper";

export default function RedCoopSMSPage() {
  const { user } = useUserContext();
  const { documentType, documentNumber } = user ?? {};

  return (
    <TransferSmsCodePage
      sessionKey="redCoopTransferConfirmation"
      fallbackPath="/transferencias/externas/red-coopcentral"
      successPath="/transferencias/externas/red-coopcentral/resultado"
      confirmationPath="/transferencias/externas/red-coopcentral/confirmacion"
      breadcrumbs={["Inicio", "Transferencias", "Red Coopcentral"]}
      welcomeBarTitle="Cuentas de mi Red Coopcentral"
      steps={RED_COOP_TRANSFER_STEPS}
      submitLabel="Transferir"
      resendTrnType="TransferExternalEntities"
      onSubmit={async (otp) => {
        if (!documentType || !documentNumber)
          throw new Error("Sesion no valida");

        const txRequestStr = sessionStorage.getItem("redCoopTransferTxRequest");
        if (!txRequestStr)
          throw new Error("Datos de transaccion no encontrados");

        const txRequest = JSON.parse(txRequestStr);
        const result = await createExternalEntityTransfer({
          documentType,
          documentNumber,
          otp,
          ...txRequest,
        });

        const sourceName =
          sessionStorage.getItem("redCoopTransferSourceName") || "";
        const destBank =
          sessionStorage.getItem("redCoopTransferDestBank") || "";
        const destAccNum =
          sessionStorage.getItem("redCoopTransferDestAccNum") || "";
        const concept = sessionStorage.getItem("redCoopTransferConcept") || "";

        const mappedResult = mapExternalEntityTransferResult(result, {
          sourceAccount: sourceName,
          destinationBank: destBank,
          destinationAccountNumber: destAccNum,
          concept,
        });
        sessionStorage.setItem(
          "redCoopTransferResult",
          JSON.stringify(mappedResult),
        );
      }}
    />
  );
}
