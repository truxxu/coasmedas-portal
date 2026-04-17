"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, Button } from "@/src/atoms";
import { Breadcrumbs } from "@/src/molecules";
import {
  AccountRegistrationForm,
  InscribedAccountsList,
  AccountSuccessModal,
  AccountDeleteConfirmModal,
} from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import {
  mockRegisteredAccounts,
  mockDocumentTypes,
  mockAccountTypes,
} from "@/src/mocks";
import { listBanks, listEntities } from "@/services/transfers.service";
import { isAuthError } from "@/lib/api/errors";
import type {
  AccountRegistrationFormData,
  AccountRegistrationPageState,
  RegisteredAccount,
  BankOption,
  CooperativaOption,
} from "@/src/types";

export default function InscribirCuentasPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const [banks, setBanks] = useState<BankOption[]>([]);
  const [cooperativas, setCooperativas] = useState<CooperativaOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [pageState, setPageState] = useState<AccountRegistrationPageState>({
    mode: "register",
    editingAccountId: null,
    registeredAccounts: mockRegisteredAccounts,
    showSuccessModal: false,
    showDeleteModal: false,
    accountToDelete: null,
    successModalType: "register",
  });

  useEffect(() => {
    setWelcomeBar({
      title: "Inscribir Cuentas",
      backHref: "/transferencias/externas",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Fetch banks and entities from API
  const fetchBanksAndEntities = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);

      const [banksRes, entitiesRes] = await Promise.all([
        listBanks(),
        listEntities(),
      ]);

      setBanks(banksRes.map((b) => ({ value: b.code, label: b.name })));
      setCooperativas(
        entitiesRes.map((e) => ({ value: e.code, label: e.name })),
      );
    } catch (err) {
      if (isAuthError(err)) {
        router.push("/login");
        return;
      }
      setLoadError("No fue posible cargar la informacion. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchBanksAndEntities();
  }, [fetchBanksAndEntities]);

  // Get initial data for edit mode
  const getEditingAccountData = (): AccountRegistrationFormData | undefined => {
    if (pageState.mode !== "edit" || !pageState.editingAccountId) {
      return undefined;
    }
    const account = pageState.registeredAccounts.find(
      (acc) => acc.id === pageState.editingAccountId,
    );
    return account?.fullData;
  };

  // Handle form submission (register or edit)
  const handleFormSubmit = (data: AccountRegistrationFormData) => {
    if (pageState.mode === "register") {
      // Create new account
      const bankName =
        data.accountBankType === "otro_banco"
          ? banks.find((b) => b.value === data.entidadFinanciera)?.label || ""
          : cooperativas.find((c) => c.value === data.cooperativa)?.label || "";

      const holderName =
        data.tipoTitular === "persona_natural"
          ? `${data.nombreTitular || ""} ${data.apellidosTitular || ""}`.toUpperCase()
          : (data.razonSocial || "").toUpperCase();

      const newAccount: RegisteredAccount = {
        id: String(Date.now()),
        alias: data.alias,
        bankName,
        bankType: data.accountBankType,
        accountType: data.tipoCuenta,
        accountNumberMasked: `****${data.numeroCuenta.slice(-4)}`,
        holderName,
        holderType: data.tipoTitular,
        fullData: data,
      };

      setPageState((prev) => ({
        ...prev,
        registeredAccounts: [...prev.registeredAccounts, newAccount],
        showSuccessModal: true,
        successModalType: "register",
      }));
    } else {
      // Update existing account
      const bankName =
        data.accountBankType === "otro_banco"
          ? banks.find((b) => b.value === data.entidadFinanciera)?.label || ""
          : cooperativas.find((c) => c.value === data.cooperativa)?.label || "";

      const holderName =
        data.tipoTitular === "persona_natural"
          ? `${data.nombreTitular || ""} ${data.apellidosTitular || ""}`.toUpperCase()
          : (data.razonSocial || "").toUpperCase();

      setPageState((prev) => ({
        ...prev,
        registeredAccounts: prev.registeredAccounts.map((acc) =>
          acc.id === prev.editingAccountId
            ? {
                ...acc,
                alias: data.alias,
                bankName,
                bankType: data.accountBankType,
                accountType: data.tipoCuenta,
                accountNumberMasked: `****${data.numeroCuenta.slice(-4)}`,
                holderName,
                holderType: data.tipoTitular,
                fullData: data,
              }
            : acc,
        ),
        mode: "register",
        editingAccountId: null,
        showSuccessModal: true,
        successModalType: "edit",
      }));
    }
  };

  // Handle edit button click
  const handleEdit = (accountId: string) => {
    setPageState((prev) => ({
      ...prev,
      mode: "edit",
      editingAccountId: accountId,
    }));
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setPageState((prev) => ({
      ...prev,
      mode: "register",
      editingAccountId: null,
    }));
  };

  // Handle delete button click
  const handleDeleteClick = (accountId: string) => {
    setPageState((prev) => ({
      ...prev,
      showDeleteModal: true,
      accountToDelete: accountId,
    }));
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    setPageState((prev) => ({
      ...prev,
      registeredAccounts: prev.registeredAccounts.filter(
        (acc) => acc.id !== prev.accountToDelete,
      ),
      showDeleteModal: false,
      accountToDelete: null,
    }));
  };

  // Handle delete cancel
  const handleDeleteCancel = () => {
    setPageState((prev) => ({
      ...prev,
      showDeleteModal: false,
      accountToDelete: null,
    }));
  };

  // Handle success modal primary action
  const handleSuccessModalPrimary = () => {
    if (pageState.successModalType === "register") {
      router.push("/home");
    } else {
      setPageState((prev) => ({
        ...prev,
        showSuccessModal: false,
      }));
    }
  };

  // Handle success modal secondary action (register only)
  const handleSuccessModalSecondary = () => {
    setPageState((prev) => ({
      ...prev,
      showSuccessModal: false,
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Breadcrumbs
            items={["Inicio", "Transferencias", "Inscribir Cuenta"]}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 md:p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-10 bg-gray-200 rounded w-full" />
              <div className="h-10 bg-gray-200 rounded w-full" />
              <div className="h-10 bg-gray-200 rounded w-full" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Breadcrumbs
            items={["Inicio", "Transferencias", "Inscribir Cuenta"]}
          />
        </div>
        <Card className="p-6 md:p-8 text-center">
          <p className="text-brand-error mb-4">{loadError}</p>
          <Button variant="primary" onClick={fetchBanksAndEntities}>
            Reintentar
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Transferencias", "Inscribir Cuenta"]} />
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Registration Form */}
        <AccountRegistrationForm
          mode={pageState.mode}
          initialData={getEditingAccountData()}
          banks={banks}
          cooperativas={cooperativas}
          documentTypes={mockDocumentTypes}
          accountTypes={mockAccountTypes}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelEdit}
        />

        {/* Section 2: Registered Accounts List */}
        <InscribedAccountsList
          accounts={pageState.registeredAccounts}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Modals */}
      <AccountSuccessModal
        isOpen={pageState.showSuccessModal}
        type={pageState.successModalType}
        onPrimaryAction={handleSuccessModalPrimary}
        onSecondaryAction={handleSuccessModalSecondary}
      />

      <AccountDeleteConfirmModal
        isOpen={pageState.showDeleteModal}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
