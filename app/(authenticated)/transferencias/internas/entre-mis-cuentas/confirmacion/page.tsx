"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { TransferConfirmationCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar, useUserContext } from "@/src/contexts";
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
import type { SavingsAccountResponse, CreditAccountResponse } from "@/types/api/products";
import type {
  TransferTargetSavings,
  TransferTargetCredits,
  TransferTargetInvestments,
} from "@/types/api/transfers";

export default function ConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const { user } = useUserContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [confirmationData] =
    useState<TransferConfirmationData | null>(() => {
      if (typeof window === "undefined") return null;

      const sourceId = sessionStorage.getItem("transferSourceId");
      const destinationId = sessionStorage.getItem("transferDestinationId");
      const amount = sessionStorage.getItem("transferAmount");

      if (!sourceId || !destinationId || !amount) return null;

      // Read raw API data
      const savingsApiStr = sessionStorage.getItem("transferSourcesSavingsApi");
      const creditsApiStr = sessionStorage.getItem("transferSourcesCreditsApi");
      const targetSavingsStr = sessionStorage.getItem("transferTargetSavingsApi");
      const targetCreditsStr = sessionStorage.getItem("transferTargetCreditsApi");
      const targetInvestmentsStr = sessionStorage.getItem("transferTargetInvestmentsApi");

      if (!savingsApiStr || !creditsApiStr || !targetSavingsStr || !targetCreditsStr || !targetInvestmentsStr) {
        return null;
      }

      const savingsData: SavingsAccountResponse[] = JSON.parse(savingsApiStr);
      const creditsData: CreditAccountResponse[] = JSON.parse(creditsApiStr);
      const targetSavings: TransferTargetSavings[] = JSON.parse(targetSavingsStr);
      const targetCredits: TransferTargetCredits[] = JSON.parse(targetCreditsStr);
      const targetInvestments: TransferTargetInvestments[] = JSON.parse(targetInvestmentsStr);

      const sourceInfo = getSourceDisplayName(savingsData, creditsData, sourceId);
      const destinationName = getDestinationDisplayName(
        targetSavings, targetCredits, targetInvestments, destinationId
      );

      if (!sourceInfo || !destinationName) return null;

      // Build origin/destination AccountReferences for createTransaction
      let origen;
      if (sourceInfo.type === "savings") {
        const savingsAccount = savingsData.find((a) => String(a.idCuenta) === String(sourceId))!;
        origen = buildTransferSourceReference(savingsAccount);
      } else {
        const creditAccount = creditsData.find((a) => String(a.idCuenta) === String(sourceId))!;
        origen = buildTransferCreditSourceReference(creditAccount);
      }

      let destino;
      const targetSav = targetSavings.find((a) => String(a.idCuenta) === String(destinationId));
      const targetCred = targetCredits.find((a) => String(a.idCuenta) === String(destinationId));
      const targetInv = targetInvestments.find((a) => String(a.idCuenta) === String(destinationId));

      if (targetSav) {
        destino = buildTargetSavingsReference(targetSav);
      } else if (targetCred) {
        destino = buildTargetCreditsReference(targetCred);
      } else if (targetInv) {
        // Investments use same structure as savings targets
        destino = buildTargetSavingsReference(targetInv);
      } else {
        return null;
      }

      // Store transaction request for SMS step
      const txRequest = {
        origen,
        destino,
        valorTransferencia: Number(amount),
      };
      sessionStorage.setItem("transferTransactionRequest", JSON.stringify(txRequest));

      // Store context for result mapping
      sessionStorage.setItem("transferSourceName", sourceInfo.name);
      sessionStorage.setItem("transferDestinationName", destinationName);

      const userName = user?.fullName || `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
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

  useEffect(() => {
    setWelcomeBar({
      title: "Entre mis Cuentas",
      backHref: "/transferencias/internas/entre-mis-cuentas",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!confirmationData) {
      router.push("/transferencias/internas/entre-mis-cuentas");
    }
  }, [confirmationData, router]);

  const handleConfirmPayment = async () => {
    if (!confirmationData) return;

    setIsSubmitting(true);
    try {
      sessionStorage.setItem(
        "transferConfirmation",
        JSON.stringify(confirmationData)
      );

      // Send OTP before navigating to SMS step
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
      // If OTP fails, still navigate — the SMS page can handle resend
      router.push("/transferencias/internas/entre-mis-cuentas/sms");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push("/transferencias/internas/entre-mis-cuentas");
  };

  if (!confirmationData) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-brand-gray-medium">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={["Inicio", "Transferencias", "Entre mis Cuentas"]}
        />
      </div>

      {/* Stepper */}
      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={2} steps={TRANSFER_STEPS} />
      </div>

      {/* Confirmation Card */}
      <TransferConfirmationCard
        confirmationData={confirmationData}
        hideBalances={hideBalances}
      />

      {/* Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={isSubmitting}
          className="text-sm font-medium text-brand-teal-dark hover:underline disabled:opacity-50"
        >
          Volver
        </button>
        <Button
          variant="primary"
          onClick={handleConfirmPayment}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Confirmar Pago"}
        </Button>
      </div>
    </div>
  );
}
