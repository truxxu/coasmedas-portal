"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConfirmationPageShell,
  ExternalTransferConfirmationCard,
} from "@/src/organisms";
import { useUIContext, useUserContext } from "@/src/contexts";
import type { ExternalTransferConfirmationData } from "@/src/types/externalTransfer";
import {
  mockExternalTransferDestinations,
  EXTERNAL_TRANSFER_STEPS,
} from "@/src/mocks";
import { maskNumber } from "@/src/utils";
import { sendTransactionOtp } from "@/services/auth.service";
import { getExternalSourceInfo } from "@/lib/mappers/externalTransfers.mapper";
import type {
  SavingsAccountResponse,
  CreditAccountResponse,
} from "@/types/api/products";

export default function ConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { user } = useUserContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [confirmationData] = useState<ExternalTransferConfirmationData | null>(
    () => {
      if (typeof window === "undefined") return null;

      const sourceId = sessionStorage.getItem("externalTransferSourceId");
      const destinationId = sessionStorage.getItem(
        "externalTransferDestinationId",
      );
      const amount = sessionStorage.getItem("externalTransferAmount");
      const concept = sessionStorage.getItem("externalTransferConcept");

      if (!sourceId || !destinationId || !amount) return null;

      const savingsApiStr = sessionStorage.getItem(
        "externalTransferSavingsApi",
      );
      const creditsApiStr = sessionStorage.getItem(
        "externalTransferCreditsApi",
      );
      if (!savingsApiStr || !creditsApiStr) return null;

      const savingsData: SavingsAccountResponse[] = JSON.parse(savingsApiStr);
      const creditsData: CreditAccountResponse[] = JSON.parse(creditsApiStr);

      const sourceInfo = getExternalSourceInfo(
        savingsData,
        creditsData,
        sourceId,
      );
      if (!sourceInfo) return null;

      const destination = mockExternalTransferDestinations.find(
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
        "externalTransferTxRequest",
        JSON.stringify(txRequest),
      );

      sessionStorage.setItem("externalTransferSourceName", sourceInfo.name);
      sessionStorage.setItem("externalTransferDestBank", destination.bankName);
      sessionStorage.setItem(
        "externalTransferDestAccNum",
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
        "externalTransferConfirmation",
        JSON.stringify(confirmationData),
      );

      const { documentType, documentNumber } = user ?? {};
      if (documentType && documentNumber) {
        await sendTransactionOtp({
          documentType,
          documentNumber,
          trnType: "TransferExternalBanks",
        });
      }

      router.push("/transferencias/externas/otros-bancos/sms");
    } catch {
      router.push("/transferencias/externas/otros-bancos/sms");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ConfirmationPageShell
      breadcrumbs={["Inicio", "Transferencias", "A Otros Bancos"]}
      welcomeBarTitle="A Otros Bancos"
      welcomeBarBackHref="/transferencias/externas/otros-bancos"
      fallbackPath="/transferencias/externas/otros-bancos"
      steps={EXTERNAL_TRANSFER_STEPS}
      hasData={!!confirmationData}
      isSubmitting={isSubmitting}
      onBack={() => router.push("/transferencias/externas/otros-bancos")}
      onConfirm={handleConfirmPayment}
    >
      {confirmationData && (
        <ExternalTransferConfirmationCard
          confirmationData={confirmationData}
          hideBalances={hideBalances}
        />
      )}
    </ConfirmationPageShell>
  );
}
