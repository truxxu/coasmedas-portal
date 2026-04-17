"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConfirmationPageShell,
  RedCoopTransferConfirmationCard,
} from "@/src/organisms";
import { useUIContext, useUserContext } from "@/src/contexts";
import type { RedCoopTransferConfirmationData } from "@/src/types/redCoopTransfer";
import {
  mockRedCoopDestinationAccounts,
  RED_COOP_TRANSFER_STEPS,
} from "@/src/mocks";
import { maskNumber } from "@/src/utils";
import { sendTransactionOtp } from "@/services/auth.service";
import { getExternalSourceInfo } from "@/lib/mappers/externalTransfers.mapper";
import type {
  SavingsAccountResponse,
  CreditAccountResponse,
} from "@/types/api/products";

export default function RedCoopConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { user } = useUserContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [confirmationData] = useState<RedCoopTransferConfirmationData | null>(
    () => {
      if (typeof window === "undefined") return null;

      const sourceId = sessionStorage.getItem("redCoopTransferSourceId");
      const destinationId = sessionStorage.getItem(
        "redCoopTransferDestinationId",
      );
      const amount = sessionStorage.getItem("redCoopTransferAmount");
      const concept = sessionStorage.getItem("redCoopTransferConcept");

      if (!sourceId || !destinationId || !amount) return null;

      const savingsApiStr = sessionStorage.getItem("redCoopTransferSavingsApi");
      const creditsApiStr = sessionStorage.getItem("redCoopTransferCreditsApi");
      if (!savingsApiStr || !creditsApiStr) return null;

      const savingsData: SavingsAccountResponse[] = JSON.parse(savingsApiStr);
      const creditsData: CreditAccountResponse[] = JSON.parse(creditsApiStr);

      const sourceInfo = getExternalSourceInfo(
        savingsData,
        creditsData,
        sourceId,
      );
      if (!sourceInfo) return null;

      const destination = mockRedCoopDestinationAccounts.find(
        (acc) => acc.id === destinationId,
      );
      if (!destination) return null;

      const txRequest = {
        origen: sourceInfo.sourceRef,
        destino: {
          name: destination.holderName,
          documentType: "CC",
          documentNumber: "",
          accountNumber: destination.accountNumber,
          accountType: destination.accountType === "ahorros" ? "01" : "02",
          entityCode: "",
        },
        valorTransferencia: Number(amount),
      };
      sessionStorage.setItem(
        "redCoopTransferTxRequest",
        JSON.stringify(txRequest),
      );

      sessionStorage.setItem("redCoopTransferSourceName", sourceInfo.name);
      sessionStorage.setItem("redCoopTransferDestBank", destination.bankName);
      sessionStorage.setItem(
        "redCoopTransferDestAccNum",
        destination.accountNumber,
      );

      const userName =
        user?.fullName ||
        `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
      const maskedDoc = user
        ? `${user.documentType} ${maskNumber(user.documentNumber)}`
        : "";

      return {
        holderName: userName,
        holderDocument: maskedDoc,
        sourceProduct: sourceInfo.name,
        destinationHolder: destination.holderName,
        destinationBank: destination.bankName,
        destinationAccountType:
          destination.accountType === "ahorros" ? "Ahorros" : "Corriente",
        destinationAccountNumber: destination.accountNumber,
        amount: Number(amount),
        concept: concept || "",
      };
    },
  );

  const handleConfirmPayment = async () => {
    if (!confirmationData) return;
    setIsSubmitting(true);
    try {
      sessionStorage.setItem(
        "redCoopTransferConfirmation",
        JSON.stringify(confirmationData),
      );

      const { documentType, documentNumber } = user ?? {};
      if (documentType && documentNumber) {
        await sendTransactionOtp({
          documentType,
          documentNumber,
          trnType: "TransferExternalEntities",
        });
      }

      router.push("/transferencias/externas/red-coopcentral/sms");
    } catch {
      router.push("/transferencias/externas/red-coopcentral/sms");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ConfirmationPageShell
      breadcrumbs={["Inicio", "Transferencias", "Red Coopcentral"]}
      welcomeBarTitle="Cuentas de mi Red Coopcentral"
      welcomeBarBackHref="/transferencias/externas/red-coopcentral"
      fallbackPath="/transferencias/externas/red-coopcentral"
      steps={RED_COOP_TRANSFER_STEPS}
      hasData={!!confirmationData}
      isSubmitting={isSubmitting}
      onBack={() => router.push("/transferencias/externas/red-coopcentral")}
      onConfirm={handleConfirmPayment}
    >
      {confirmationData && (
        <RedCoopTransferConfirmationCard
          confirmationData={confirmationData}
          hideBalances={hideBalances}
        />
      )}
    </ConfirmationPageShell>
  );
}
