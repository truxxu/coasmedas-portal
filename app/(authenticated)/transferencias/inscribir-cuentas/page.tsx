"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  mockBanks,
  mockCooperativas,
  mockDocumentTypes,
  mockAccountTypes,
} from "@/src/mocks";
import type {
  AccountRegistrationFormData,
  AccountRegistrationPageState,
  RegisteredAccount,
} from "@/src/types";

export default function InscribirCuentasPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

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
      backHref: "/transferencias/internas",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

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
          ? mockBanks.find((b) => b.value === data.entidadFinanciera)?.label ||
            ""
          : mockCooperativas.find((c) => c.value === data.cooperativa)?.label ||
            "";

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
          ? mockBanks.find((b) => b.value === data.entidadFinanciera)?.label ||
            ""
          : mockCooperativas.find((c) => c.value === data.cooperativa)?.label ||
            "";

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
          banks={mockBanks}
          cooperativas={mockCooperativas}
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
