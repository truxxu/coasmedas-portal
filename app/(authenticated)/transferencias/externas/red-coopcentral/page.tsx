"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { RedCoopTransferDetailsCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar, useUserContext } from "@/src/contexts";
import {
  mockRedCoopDestinationAccounts,
  RED_COOP_TRANSFER_STEPS,
} from "@/src/mocks";
import {
  getExternalSourcesSavings,
  getExternalSourcesCredits,
} from "@/services/transfers.service";
import { isAuthError } from "@/lib/api/errors";
import {
  mapSavingsToRedCoopSource,
  mapCreditsToRedCoopSource,
} from "@/lib/mappers/externalTransfers.mapper";
import type { RedCoopSourceAccount } from "@/src/types/redCoopTransfer";
import type {
  SavingsAccountResponse,
  CreditAccountResponse,
} from "@/types/api/products";

export default function RedCoopcentalPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const { user } = useUserContext();

  const [sourceAccounts, setSourceAccounts] = useState<RedCoopSourceAccount[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [selectedDestinationId, setSelectedDestinationId] = useState("");
  const [amount, setAmount] = useState("");
  const [concept, setConcept] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Raw API data for building transaction request later
  const [savingsApiData, setSavingsApiData] = useState<SavingsAccountResponse[]>([]);
  const [creditsApiData, setCreditsApiData] = useState<CreditAccountResponse[]>([]);

  useEffect(() => {
    setWelcomeBar({
      title: "Cuentas de mi Red Coopcentral",
      backHref: "/transferencias/externas",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const { documentType, documentNumber } = user ?? {};

  const fetchData = useCallback(async () => {
    if (!documentType || !documentNumber) return;

    try {
      setLoading(true);
      setLoadError(null);

      const params = { documentType, documentNumber };
      const [savingsRes, creditsRes] = await Promise.all([
        getExternalSourcesSavings(params),
        getExternalSourcesCredits(params),
      ]);

      // Store raw API data
      setSavingsApiData(savingsRes);
      setCreditsApiData(creditsRes);

      // Map to UI types
      const mapped = [
        ...savingsRes.map(mapSavingsToRedCoopSource),
        ...creditsRes.map(mapCreditsToRedCoopSource),
      ];
      setSourceAccounts(mapped);
    } catch (err) {
      if (isAuthError(err)) {
        router.push("/login");
        return;
      }
      setLoadError("No fue posible cargar la informacion. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [documentType, documentNumber, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleConfirm = () => {
    setError("");

    if (!selectedSourceId) {
      setError("Por favor selecciona una cuenta origen");
      return;
    }
    if (!selectedDestinationId) {
      setError("Por favor selecciona una cuenta destino");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Por favor ingresa un valor a transferir");
      return;
    }

    const sourceAccount = sourceAccounts.find(
      (acc) => acc.id === selectedSourceId,
    );

    if (sourceAccount && Number(amount) > sourceAccount.balance) {
      setError("El valor supera el saldo disponible");
      return;
    }

    if (concept.length > 100) {
      setError("El concepto no puede exceder 100 caracteres");
      return;
    }

    // Store data for next step
    sessionStorage.setItem("redCoopTransferSourceId", selectedSourceId);
    sessionStorage.setItem(
      "redCoopTransferDestinationId",
      selectedDestinationId,
    );
    sessionStorage.setItem("redCoopTransferAmount", amount);
    sessionStorage.setItem("redCoopTransferConcept", concept);

    // Store raw API data for building transaction request
    sessionStorage.setItem("redCoopTransferSavingsApi", JSON.stringify(savingsApiData));
    sessionStorage.setItem("redCoopTransferCreditsApi", JSON.stringify(creditsApiData));

    router.push("/transferencias/externas/red-coopcentral/confirmacion");
  };

  const handleBack = () => {
    router.push("/transferencias/externas");
  };

  const isFormValid =
    selectedSourceId && selectedDestinationId && amount && Number(amount) > 0;

  if (loadError) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={["Inicio", "Transferencias", "Red Coopcentral"]} />
        <div className="bg-white rounded-2xl p-6 text-center">
          <p className="text-red-600 mb-4">{loadError}</p>
          <button
            onClick={fetchData}
            className="text-sm font-medium text-white bg-brand-navy px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={["Inicio", "Transferencias", "Red Coopcentral"]} />
        <div className="bg-white rounded-2xl p-6 animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-32 w-full bg-gray-200 rounded" />
          <div className="h-32 w-full bg-gray-200 rounded" />
        </div>
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
        <Stepper currentStep={1} steps={RED_COOP_TRANSFER_STEPS} />
      </div>

      {/* Form Card */}
      <RedCoopTransferDetailsCard
        sourceAccounts={sourceAccounts}
        destinationAccounts={mockRedCoopDestinationAccounts}
        selectedSourceId={selectedSourceId}
        selectedDestinationId={selectedDestinationId}
        amount={amount}
        concept={concept}
        onSourceChange={setSelectedSourceId}
        onDestinationChange={setSelectedDestinationId}
        onAmountChange={setAmount}
        onConceptChange={setConcept}
        hideBalances={hideBalances}
        error={error}
      />

      {/* Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-brand-teal-dark hover:underline"
        >
          Volver
        </button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={!isFormValid}
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
}
