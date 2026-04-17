"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConfirmationPageShell,
  TransferConfirmationCard,
} from "@/src/organisms";
import { useUIContext, useUserContext } from "@/src/contexts";
import type { TransferConfirmationData } from "@/src/types/transfer";
import { TRANSFER_STEPS } from "@/src/mocks";
import { maskNumber } from "@/src/utils";
import { sendTransactionOtp } from "@/services/auth.service";
import {
  getSourceDisplayName,
  getDestinationDisplayName,
  buildTransferSourceReference,
  buildTransferCreditSourceReference,
  buildTargetSavingsReference,
  buildTargetCreditsReference,
} from "@/lib/mappers/transfers.mapper";
import type {
  SavingsAccountResponse,
  CreditAccountResponse,
} from "@/types/api/products";
import type {
  TransferTargetSavings,
  TransferTargetCredits,
  TransferTargetInvestments,
} from "@/types/api/transfers";

export default function ConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { user } = useUserContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [confirmationData] = useState<TransferConfirmationData | null>(() => {
    if (typeof window === "undefined") return null;

    const sourceId = sessionStorage.getItem("transferSourceId");
    const destinationId = sessionStorage.getItem("transferDestinationId");
    const amount = sessionStorage.getItem("transferAmount");

    if (!sourceId || !destinationId || !amount) return null;

    const savingsApiStr = sessionStorage.getItem("transferSourcesSavingsApi");
    const creditsApiStr = sessionStorage.getItem("transferSourcesCreditsApi");
    const category = sessionStorage.getItem("transferSourceCategory");
    const targetApiStr = sessionStorage.getItem("transferTargetApiData");

    if (!savingsApiStr || !creditsApiStr || !category || !targetApiStr) {
      return null;
    }

    const savingsData: SavingsAccountResponse[] = JSON.parse(savingsApiStr);
    const creditsData: CreditAccountResponse[] = JSON.parse(creditsApiStr);

    const targetSavings: TransferTargetSavings[] =
      category === "savings" ? JSON.parse(targetApiStr) : [];
    const targetCredits: TransferTargetCredits[] =
      category === "credits" ? JSON.parse(targetApiStr) : [];
    const targetInvestments: TransferTargetInvestments[] =
      category === "investments" ? JSON.parse(targetApiStr) : [];

    const sourceInfo = getSourceDisplayName(savingsData, creditsData, sourceId);
    const destinationName = getDestinationDisplayName(
      targetSavings,
      targetCredits,
      targetInvestments,
      destinationId,
    );

    if (!sourceInfo || !destinationName) return null;

    let origen;
    if (sourceInfo.type === "savings") {
      const savingsAccount = savingsData.find(
        (a) => String(a.idCuenta) === String(sourceId),
      )!;
      origen = buildTransferSourceReference(savingsAccount);
    } else {
      const creditAccount = creditsData.find(
        (a) => String(a.idCuenta) === String(sourceId),
      )!;
      origen = buildTransferCreditSourceReference(creditAccount);
    }

    let destino;
    const targetSav = targetSavings.find(
      (a) => String(a.idCuenta) === String(destinationId),
    );
    const targetCred = targetCredits.find(
      (a) => String(a.idCuenta) === String(destinationId),
    );
    const targetInv = targetInvestments.find(
      (a) => String(a.idCuenta) === String(destinationId),
    );

    if (targetSav) {
      destino = buildTargetSavingsReference(targetSav);
    } else if (targetCred) {
      destino = buildTargetCreditsReference(targetCred);
    } else if (targetInv) {
      destino = buildTargetSavingsReference(targetInv);
    } else {
      return null;
    }

    const txRequest = {
      origen,
      destino,
      valorTransferencia: Number(amount),
    };
    sessionStorage.setItem(
      "transferTransactionRequest",
      JSON.stringify(txRequest),
    );

    sessionStorage.setItem("transferSourceName", sourceInfo.name);
    sessionStorage.setItem("transferDestinationName", destinationName);

    const userName =
      user?.fullName ||
      `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
    const maskedDoc = user
      ? `${user.documentType} ${maskNumber(user.documentNumber)}`
      : "";

    return {
      holderName: userName,
      documentNumber: maskedDoc,
      sourceAccount: sourceInfo.name,
      destinationProduct: destinationName,
      amount: Number(amount),
      transactionCost: 0,
    };
  });

  const handleConfirmPayment = async () => {
    if (!confirmationData) return;

    setIsSubmitting(true);
    try {
      sessionStorage.setItem(
        "transferConfirmation",
        JSON.stringify(confirmationData),
      );

      const { documentType, documentNumber } = user ?? {};
      if (documentType && documentNumber) {
        await sendTransactionOtp({
          documentType,
          documentNumber,
          trnType: "TransferInternal",
        });
      }

      router.push("/transferencias/internas/entre-mis-cuentas/sms");
    } catch {
      router.push("/transferencias/internas/entre-mis-cuentas/sms");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ConfirmationPageShell
      breadcrumbs={["Inicio", "Transferencias", "Entre mis Cuentas"]}
      welcomeBarTitle="Entre mis Cuentas"
      welcomeBarBackHref="/transferencias/internas/entre-mis-cuentas"
      fallbackPath="/transferencias/internas/entre-mis-cuentas"
      steps={TRANSFER_STEPS}
      hasData={!!confirmationData}
      isSubmitting={isSubmitting}
      onBack={() => router.push("/transferencias/internas/entre-mis-cuentas")}
      onConfirm={handleConfirmPayment}
    >
      {confirmationData && (
        <TransferConfirmationCard
          confirmationData={confirmationData}
          hideBalances={hideBalances}
        />
      )}
    </ConfirmationPageShell>
  );
}
