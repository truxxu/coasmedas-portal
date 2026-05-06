"use client";

import { TarjetaSmsCodePage } from "@/src/organisms/TarjetaSmsCodePage";
import { useUserContext } from "@/src/contexts";
import { initBrebTx } from "@/services";
import { buildBrebDeviceContext } from "@/src/utils";
import { ApiError } from "@/lib/api/errors";
import { BREB_KEY_TRANSFER_STEPS } from "@/src/mocks";
import type {
  BrebKeyTransferConfirmationData,
  BrebKeyTransferResult,
} from "@/src/types/brebKeyTransfer";
import type { InitBrebTxRequest } from "@/types/api/breb";
import { BREB_SESSION_KEYS } from "@/src/constants/brebSessionKeys";

export default function BrebKeyTransferSmsPage() {
  const { user } = useUserContext();

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
      onVerify={async (confirmation) => {
        if (!user) {
          throw new Error("Sesión no válida. Inicie sesión nuevamente.");
        }
        const ctx = buildBrebDeviceContext(user);
        const req: InitBrebTxRequest = {
          ...ctx,
          sourceFirstName: user.firstName,
          sourceSurName: user.lastName,
          sourceNumberAccount: confirmation.sourceNumberAccount,
          sourceTypeAccount: confirmation.sourceTypeAccount,
          sourceTypeAccountDescription:
            confirmation.sourceTypeAccountDescription,
          targetNode: confirmation.targetNode,
          targetResolutionId: confirmation.targetResolutionId,
          targetValueKeyCustomer: confirmation.destinationKey,
          targetTypeKeyCustomer: confirmation.targetTypeKeyCustomer,
          targetEntity: confirmation.targetEntity,
          targetNumberAccount: confirmation.targetNumberAccount,
          targetTypeAccount: confirmation.targetTypeAccount,
          targetTypeAccountDescription:
            confirmation.targetTypeAccountDescription,
          targetIdentification: confirmation.targetIdentification,
          targetTypeIdentification: confirmation.targetTypeIdentification,
          targetFirstName: confirmation.targetFirstName,
          targetSurName: confirmation.targetSurName,
          amount: confirmation.amount,
        };
        // Rotating credit (CR) source accounts must not carry a subtype.
        if (confirmation.sourceTypeAccount !== "CR") {
          req.sourceSubTypeAccount = confirmation.sourceSubTypeAccount;
        }
        // Some destination keys come back without an associated subtype.
        if (confirmation.targetSubTypeAccount) {
          req.targetSubTypeAccount = confirmation.targetSubTypeAccount;
        }
        const res = await initBrebTx(req);
        if (!res.paymentId) {
          throw new ApiError(-1, "No se pudo iniciar la transacción.");
        }
        sessionStorage.setItem(
          BREB_SESSION_KEYS.keyTransfer.paymentId,
          res.paymentId,
        );
        sessionStorage.removeItem(BREB_SESSION_KEYS.keyTransfer.result);
      }}
      buildResult={(confirmation, meta) => ({
        status: "success",
        sourceAccount: confirmation.sourceProduct,
        destinationHolder: confirmation.destinationHolder,
        destinationKey: confirmation.destinationKey,
        amount: confirmation.amount,
        transactionDate: meta.fechaTransaccion,
        transactionTime: meta.horaTransaccion,
        referenceNumber: meta.numeroAprobacion,
      })}
    />
  );
}
