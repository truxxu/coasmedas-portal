"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { RedCoopTransferConfirmationCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar, useUserContext } from "@/src/contexts";
import type { RedCoopTransferConfirmationData } from "@/src/types/redCoopTransfer";
import {
  mockRedCoopDestinationAccounts,
  RED_COOP_TRANSFER_STEPS,
} from "@/src/mocks";
import { maskNumber } from "@/src/utils";
import { sendTransactionOtp } from "@/services/auth.service";
import { getExternalSourceInfo } from "@/lib/mappers/externalTransfers.mapper";
import type { SavingsAccountResponse, CreditAccountResponse } from "@/types/api/products";

export default function RedCoopConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
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

      if (!sourceId || !destinationId || !amount) {
        return null;
      }

      // Read raw API data for source lookup
      const savingsApiStr = sessionStorage.getItem("redCoopTransferSavingsApi");
      const creditsApiStr = sessionStorage.getItem("redCoopTransferCreditsApi");

      if (!savingsApiStr || !creditsApiStr) {
        return null;
      }

      const savingsData: SavingsAccountResponse[] = JSON.parse(savingsApiStr);
      const creditsData: CreditAccountResponse[] = JSON.parse(creditsApiStr);

      const sourceInfo = getExternalSourceInfo(savingsData, creditsData, sourceId);
      if (!sourceInfo) return null;

      // Destination still uses mock data (inscribed accounts API missing)
      const destination = mockRedCoopDestinationAccounts.find(
        (acc) => acc.id === destinationId,
      );
      if (!destination) return null;

      // Build and store transaction request for SMS step
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
      sessionStorage.setItem("redCoopTransferTxRequest", JSON.stringify(txRequest));

      // Store context for result mapping
      sessionStorage.setItem("redCoopTransferSourceName", sourceInfo.name);
      sessionStorage.setItem("redCoopTransferDestBank", destination.bankName);
      sessionStorage.setItem("redCoopTransferDestAccNum", destination.accountNumber);

      const userName = user?.fullName || `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
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

  useEffect(() => {
    setWelcomeBar({
      title: "Cuentas de mi Red Coopcentral",
      backHref: "/transferencias/externas/red-coopcentral",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!confirmationData) {
      router.push("/transferencias/externas/red-coopcentral");
    }
  }, [confirmationData, router]);

  const handleConfirmPayment = async () => {
    if (!confirmationData) return;

    setIsSubmitting(true);
    try {
      sessionStorage.setItem(
        "redCoopTransferConfirmation",
        JSON.stringify(confirmationData),
      );

      // Send OTP before navigating to SMS step
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
      // If OTP fails, still navigate — the SMS page can handle resend
      router.push("/transferencias/externas/red-coopcentral/sms");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push("/transferencias/externas/red-coopcentral");
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
        <Breadcrumbs items={["Inicio", "Transferencias", "Red Coopcentral"]} />
      </div>

      {/* Stepper */}
      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={2} steps={RED_COOP_TRANSFER_STEPS} />
      </div>

      {/* Confirmation Card */}
      <RedCoopTransferConfirmationCard
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
