"use client";

import { useUserContext } from "@/src/contexts";
import { TransferSmsCodePage } from "@/src/organisms";
import { TRANSFER_STEPS } from "@/src/mocks";
import { createInternalTransfer } from "@/services/transfers.service";
import { mapTransferResult } from "@/lib/mappers/transfers.mapper";

export default function SMSVerificationPage() {
  const { user } = useUserContext();
  const { documentType, documentNumber } = user ?? {};

  return (
    <TransferSmsCodePage
      sessionKey="transferConfirmation"
      fallbackPath="/transferencias/internas/entre-mis-cuentas"
      successPath="/transferencias/internas/entre-mis-cuentas/resultado"
      confirmationPath="/transferencias/internas/entre-mis-cuentas/confirmacion"
      breadcrumbs={["Inicio", "Transferencias", "Entre mis Cuentas"]}
      welcomeBarTitle="Entre mis Cuentas"
      steps={TRANSFER_STEPS}
      submitLabel="Pagar"
      resendTrnType="TransferInternal"
      onSubmit={async (otp) => {
        if (!documentType || !documentNumber)
          throw new Error("Sesion no valida");

        const txRequestStr = sessionStorage.getItem(
          "transferTransactionRequest",
        );
        if (!txRequestStr)
          throw new Error("Datos de transaccion no encontrados");

        const txRequest = JSON.parse(txRequestStr);
        const result = await createInternalTransfer({
          documentType,
          documentNumber,
          otp,
          ...txRequest,
        });

        const sourceName = sessionStorage.getItem("transferSourceName") || "";
        const destinationName =
          sessionStorage.getItem("transferDestinationName") || "";
        const mappedResult = mapTransferResult(result, {
          sourceType: sourceName,
          productNumber: destinationName,
        });
        sessionStorage.setItem("transferResult", JSON.stringify(mappedResult));
      }}
    />
  );
}
