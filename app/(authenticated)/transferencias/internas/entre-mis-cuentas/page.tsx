"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { TransferDetailsCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar, useUserContext } from "@/src/contexts";
import { TRANSFER_STEPS } from "@/src/mocks";
import {
  getTransferSourcesSavings,
  getTransferSourcesCredits,
  getTransferTargetsSavings,
  getTransferTargetsCredits,
  getTransferTargetsInvestments,
} from "@/services/transfers.service";
import { isAuthError } from "@/lib/api/errors";
import {
  mapSavingsToTransferAccount,
  mapCreditsToTransferAccount,
  mapTargetSavingsToDestination,
  mapTargetCreditsToDestination,
  mapTargetInvestmentsToDestination,
} from "@/lib/mappers/transfers.mapper";
import type { TransferAccount, DestinationProduct } from "@/src/types/transfer";
import type {
  SavingsAccountResponse,
  CreditAccountResponse,
} from "@/types/api/products";
import type {
  TransferTargetSavings,
  TransferTargetCredits,
  TransferTargetInvestments,
} from "@/types/api/transfers";

export default function EntreMisCuentasPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const { user } = useUserContext();

  const [accounts, setAccounts] = useState<TransferAccount[]>([]);
  const [destinations, setDestinations] = useState<DestinationProduct[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [selectedDestinationId, setSelectedDestinationId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Raw API data for building transaction request later
  const [savingsApiData, setSavingsApiData] = useState<
    SavingsAccountResponse[]
  >([]);
  const [creditsApiData, setCreditsApiData] = useState<CreditAccountResponse[]>(
    [],
  );
  const [targetSavingsApiData, setTargetSavingsApiData] = useState<
    TransferTargetSavings[]
  >([]);
  const [targetCreditsApiData, setTargetCreditsApiData] = useState<
    TransferTargetCredits[]
  >([]);
  const [targetInvestmentsApiData, setTargetInvestmentsApiData] = useState<
    TransferTargetInvestments[]
  >([]);

  useEffect(() => {
    setWelcomeBar({
      title: "Entre mis Cuentas",
      backHref: "/transferencias/internas",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const { documentType, documentNumber } = user ?? {};

  const fetchSources = useCallback(async () => {
    if (!documentType || !documentNumber) return;

    try {
      setLoading(true);
      setLoadError(null);

      const params = { documentType, documentNumber };
      const [
        savingsRes,
        creditsRes,
        targetSavingsRes,
        targetCreditsRes,
        targetInvestmentsRes,
      ] = await Promise.all([
        getTransferSourcesSavings(params),
        getTransferSourcesCredits(params),
        getTransferTargetsSavings(params),
        getTransferTargetsCredits(params),
        getTransferTargetsInvestments(params),
      ]);

      setSavingsApiData(savingsRes);
      setCreditsApiData(creditsRes);
      setTargetSavingsApiData(targetSavingsRes);
      setTargetCreditsApiData(targetCreditsRes);
      setTargetInvestmentsApiData(targetInvestmentsRes);

      setAccounts([
        ...savingsRes.map(mapSavingsToTransferAccount),
        ...creditsRes.map(mapCreditsToTransferAccount),
      ]);
      setDestinations([
        ...targetSavingsRes.map(mapTargetSavingsToDestination),
        ...targetCreditsRes.map(mapTargetCreditsToDestination),
        ...targetInvestmentsRes.map(mapTargetInvestmentsToDestination),
      ]);
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
    fetchSources();
  }, [fetchSources]);

  const handleSourceChange = (accountId: string) => {
    setSelectedSourceId(accountId);
    setSelectedDestinationId("");
  };

  const handleConfirm = () => {
    setError("");

    if (!selectedSourceId) {
      setError("Por favor selecciona una cuenta origen");
      return;
    }
    if (!selectedDestinationId) {
      setError("Por favor selecciona un producto destino");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Por favor ingresa un valor a transferir");
      return;
    }

    const sourceAccount = accounts.find(
      (acc) => String(acc.id) === selectedSourceId,
    );

    if (sourceAccount && Number(amount) > sourceAccount.balance) {
      setError("Saldo insuficiente en la cuenta seleccionada");
      return;
    }

    // Store data for next step
    sessionStorage.setItem("transferSourceId", selectedSourceId);
    sessionStorage.setItem("transferDestinationId", selectedDestinationId);
    sessionStorage.setItem("transferAmount", amount);

    // Store raw API data for building transaction request
    sessionStorage.setItem(
      "transferSourcesSavingsApi",
      JSON.stringify(savingsApiData),
    );
    sessionStorage.setItem(
      "transferSourcesCreditsApi",
      JSON.stringify(creditsApiData),
    );
    sessionStorage.setItem(
      "transferTargetSavingsApi",
      JSON.stringify(targetSavingsApiData),
    );
    sessionStorage.setItem(
      "transferTargetCreditsApi",
      JSON.stringify(targetCreditsApiData),
    );
    sessionStorage.setItem(
      "transferTargetInvestmentsApi",
      JSON.stringify(targetInvestmentsApiData),
    );

    router.push("/transferencias/internas/entre-mis-cuentas/confirmacion");
  };

  const handleBack = () => {
    router.push("/transferencias/internas");
  };

  if (loadError) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={["Inicio", "Transferencias", "Entre mis Cuentas"]}
        />
        <div className="bg-white rounded-2xl p-6 text-center">
          <p className="text-red-600 mb-4">{loadError}</p>
          <button
            onClick={fetchSources}
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
        <Breadcrumbs
          items={["Inicio", "Transferencias", "Entre mis Cuentas"]}
        />
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
      {/* Header with Hide Balances Toggle */}
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={["Inicio", "Transferencias", "Entre mis Cuentas"]}
        />
      </div>

      {/* Stepper */}
      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={1} steps={TRANSFER_STEPS} />
      </div>

      {/* Form Card */}
      <TransferDetailsCard
        accounts={accounts}
        destinations={destinations}
        selectedSourceId={selectedSourceId}
        selectedDestinationId={selectedDestinationId}
        amount={amount}
        onSourceChange={handleSourceChange}
        onDestinationChange={setSelectedDestinationId}
        onAmountChange={setAmount}
        hideBalances={hideBalances}
        error={error}
        loadingDestinations={false}
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
          disabled={!selectedSourceId || !selectedDestinationId || !amount}
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
}
