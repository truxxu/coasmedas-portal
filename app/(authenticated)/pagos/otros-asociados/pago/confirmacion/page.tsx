"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConfirmationPageShell,
  OtrosAsociadosConfirmationCard,
} from "@/src/organisms";
import { useUIContext } from "@/src/contexts";
import {
  mockOtrosAsociadosUserData,
  mockOtrosAsociadosSourceAccounts,
  OTROS_ASOCIADOS_PAYMENT_STEPS,
  OTROS_ASOCIADOS_PAYMENT_STEPS_PSE,
} from "@/src/mocks";
import {
  RegisteredBeneficiary,
  PayableProduct,
  OtrosAsociadosConfirmationData,
  FundingSourceType,
} from "@/src/types";

export default function OtrosAsociadosConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();

  const [sourceType] = useState<FundingSourceType>(() => {
    if (typeof window === "undefined") return "cuenta";
    const stored = sessionStorage.getItem(
      "otrosAsociadosSourceType",
    ) as FundingSourceType | null;
    return stored || "cuenta";
  });

  const [confirmationData] = useState<OtrosAsociadosConfirmationData | null>(
    () => {
      if (typeof window === "undefined") return null;
      const beneficiaryStr = sessionStorage.getItem(
        "otrosAsociadosBeneficiary",
      );
      const accountId = sessionStorage.getItem("otrosAsociadosAccountId");
      const productsStr = sessionStorage.getItem("otrosAsociadosProducts");
      const totalAmount = sessionStorage.getItem("otrosAsociadosTotalAmount");

      if (!beneficiaryStr || !accountId || !productsStr || !totalAmount) {
        return null;
      }

      const beneficiary: RegisteredBeneficiary = JSON.parse(beneficiaryStr);
      const products: PayableProduct[] = JSON.parse(productsStr);
      const account = mockOtrosAsociadosSourceAccounts.find(
        (a) => a.id === accountId,
      );
      if (!account) return null;

      return {
        titular: mockOtrosAsociadosUserData.name,
        documento: mockOtrosAsociadosUserData.document,
        productoADebitar: account.type,
        beneficiaryName: beneficiary.fullName,
        products: products.map((p) => ({
          name: p.name,
          amount: p.amountToPay,
        })),
        totalAmount: parseInt(totalAmount, 10),
      };
    },
  );

  const paymentSteps =
    sourceType === "pse"
      ? OTROS_ASOCIADOS_PAYMENT_STEPS_PSE
      : OTROS_ASOCIADOS_PAYMENT_STEPS;

  const handleConfirm = () => {
    if (confirmationData) {
      sessionStorage.setItem(
        "otrosAsociadosConfirmation",
        JSON.stringify(confirmationData),
      );
    }
    const storedSourceType = sessionStorage.getItem("otrosAsociadosSourceType");
    if (storedSourceType === "cuenta") {
      router.push("/pagos/otros-asociados/pago/sms");
    } else {
      router.push("/pagos/otros-asociados/pago/pse");
    }
  };

  return (
    <ConfirmationPageShell
      breadcrumbs={["Inicio", "Pagos", "Pago a otros asociados"]}
      welcomeBarTitle="Pago a otros asociados"
      welcomeBarBackHref="/pagos/otros-asociados/pago"
      fallbackPath="/pagos/otros-asociados/pago"
      steps={paymentSteps}
      hasData={!!confirmationData}
      onBack={() => router.push("/pagos/otros-asociados/pago")}
      onConfirm={handleConfirm}
    >
      {confirmationData && (
        <OtrosAsociadosConfirmationCard
          confirmationData={confirmationData}
          hideBalances={hideBalances}
        />
      )}
    </ConfirmationPageShell>
  );
}
