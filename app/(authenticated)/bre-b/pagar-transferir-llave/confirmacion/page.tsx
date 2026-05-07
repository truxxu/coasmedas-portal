"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { BrebKeyTransferConfirmationCard } from "@/src/organisms";
import { useUIContext } from "@/src/contexts";
import { useBrebPageHeader } from "@/src/hooks";
import { describeBrebAccount, maskNumber } from "@/src/utils";
import type {
  BrebKeyTransferConfirmationData,
  BrebResolvedDestination,
} from "@/src/types/brebKeyTransfer";
import type { BrebAccount } from "@/types/api/breb";
import { BREB_KEY_TRANSFER_STEPS } from "@/src/mocks";
import { BREB_SESSION_KEYS } from "@/src/constants/brebSessionKeys";

export default function BrebKeyTransferConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  useBrebPageHeader("Pagar con Llave", "/bre-b/pagar-transferir-llave");

  const [confirmationData] = useState<BrebKeyTransferConfirmationData | null>(
    () => {
      if (typeof window === "undefined") return null;

      const sourceAccountStr = sessionStorage.getItem(
        BREB_SESSION_KEYS.keyTransfer.sourceAccount,
      );
      const destinationKey = sessionStorage.getItem(
        BREB_SESSION_KEYS.keyTransfer.destinationKey,
      );
      const amount = sessionStorage.getItem(
        BREB_SESSION_KEYS.keyTransfer.amount,
      );
      const resolvedStr = sessionStorage.getItem(
        BREB_SESSION_KEYS.keyTransfer.resolvedKey,
      );

      if (!sourceAccountStr || !destinationKey || !amount || !resolvedStr) {
        return null;
      }

      let source: BrebAccount;
      let resolved: BrebResolvedDestination;
      try {
        source = JSON.parse(sourceAccountStr) as BrebAccount;
        resolved = JSON.parse(resolvedStr) as BrebResolvedDestination;
      } catch {
        return null;
      }

      const sourceLabel =
        source.nombreProducto?.trim() ||
        source.aliasCuenta?.trim() ||
        describeBrebAccount(source.tipoCuenta, source.subtipoCuenta);
      const sourceTypeAccountDescription =
        source.nombreProducto?.trim() ||
        describeBrebAccount(source.tipoCuenta, source.subtipoCuenta);

      const targetKey = resolved.key;

      return {
        sourceProduct: `${sourceLabel} (${maskNumber(source.numeroCuenta)})`,
        destinationHolder:
          `${resolved.firstName ?? ""} ${resolved.surname ?? ""}`.trim() ||
          "Destinatario",
        destinationKey,
        amount: Number(amount),
        sourceNumberAccount: source.numeroCuenta,
        sourceTypeAccount: source.tipoCuenta,
        sourceSubTypeAccount: source.subtipoCuenta,
        sourceTypeAccountDescription,
        targetNode: targetKey.receptorNode ?? "",
        targetResolutionId: targetKey.resolutionId ?? "",
        targetEntity: targetKey.entity ?? "",
        targetNumberAccount: targetKey.numberAccount,
        targetTypeAccount: targetKey.typeAccount,
        targetSubTypeAccount: targetKey.subTypeAccount,
        targetTypeAccountDescription:
          targetKey.accountDescription?.trim() ||
          describeBrebAccount(targetKey.typeAccount, targetKey.subTypeAccount),
        targetTypeKeyCustomer: targetKey.typeKeyCustomer,
        targetIdentification: resolved.identification,
        targetTypeIdentification: resolved.typeIdentification,
        targetFirstName: resolved.firstName,
        targetSurName: resolved.surname,
      };
    },
  );

  useEffect(() => {
    if (!confirmationData) {
      router.push("/bre-b/pagar-transferir-llave");
    }
  }, [confirmationData, router]);

  const handleConfirmPayment = () => {
    if (!confirmationData) return;
    sessionStorage.setItem(
      BREB_SESSION_KEYS.keyTransfer.confirmation,
      JSON.stringify(confirmationData),
    );
    router.push("/bre-b/pagar-transferir-llave/sms");
  };

  const handleBack = () => {
    router.push("/bre-b/pagar-transferir-llave");
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
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Bre-B", "Pagar con Llave"]} />
      </div>

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={2} steps={BREB_KEY_TRANSFER_STEPS} />
      </div>

      <BrebKeyTransferConfirmationCard
        confirmationData={confirmationData}
        hideBalances={hideBalances}
      />

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-brand-teal-dark hover:underline"
        >
          Volver
        </button>
        <Button variant="primary" onClick={handleConfirmPayment}>
          Confirmar Pago
        </Button>
      </div>
    </div>
  );
}
