"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConfirmationPageShell,
  ProtectionPaymentConfirmationCard,
} from "@/src/organisms";
import { useUIContext, useUserContext } from "@/src/contexts";
import { PROTECTION_PAYMENT_STEPS } from "@/src/mocks";
import type {
  ProtectionPaymentDetailsFormData,
  ProtectionPaymentConfirmationData,
  ProtectionPaymentMethod,
} from "@/src/types";
import { maskNumber } from "@/src/utils";
import {
  buildAccountReference,
  buildProtectionTarget,
} from "@/lib/mappers/payments.mapper";
import { sendTransactionOtp } from "@/services/auth.service";
import type {
  SavingsAccountResponse,
  ProtectionAccountResponse,
} from "@/types/api/products";

export default function ProteccionConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { user } = useUserContext();

  const [paymentMethod] = useState<ProtectionPaymentMethod>(() => {
    if (typeof window === "undefined") return "account";
    const detailsStr = sessionStorage.getItem("protectionPaymentDetails");
    if (!detailsStr) return "account";
    const details: ProtectionPaymentDetailsFormData = JSON.parse(detailsStr);
    return details.paymentMethod;
  });

  const [confirmation] = useState<ProtectionPaymentConfirmationData | null>(
    () => {
      if (typeof window === "undefined") return null;

      const detailsStr = sessionStorage.getItem("protectionPaymentDetails");
      if (!detailsStr) return null;

      const details: ProtectionPaymentDetailsFormData = JSON.parse(detailsStr);

      const userName =
        user?.fullName ||
        `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
      const maskedDoc = user
        ? `${user.documentType} ${maskNumber(user.documentNumber)}`
        : "";

      const isPSE = details.paymentMethod === "pse";
      const productToDebit = isPSE
        ? "PSE (Pagos con otras entidades)"
        : details.sourceAccountDisplay.split(" - ")[0] || "Cuenta de Ahorros";

      return {
        holderName: userName,
        holderDocument: maskedDoc,
        productToPay: details.selectedProduct?.title || "",
        policyNumber: details.selectedProduct?.productNumber || "",
        productToDebit,
        amountToPay: details.selectedProduct?.nextPaymentAmount || 0,
      };
    },
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!confirmation) return;
    setIsLoading(true);

    try {
      sessionStorage.setItem(
        "protectionPaymentConfirmation",
        JSON.stringify(confirmation),
      );

      const sourceAccountStr = sessionStorage.getItem(
        "protectionSourceAccountApi",
      );
      const targetProductStr = sessionStorage.getItem(
        "protectionTargetProductApi",
      );
      const tipoProducto =
        sessionStorage.getItem("protectionTargetTipoProducto") || "";
      if (sourceAccountStr && targetProductStr) {
        const sourceAccount: SavingsAccountResponse =
          JSON.parse(sourceAccountStr);
        const targetProduct: ProtectionAccountResponse =
          JSON.parse(targetProductStr);
        const txRequest = {
          origen: buildAccountReference(sourceAccount),
          cuentas: [
            buildProtectionTarget(
              targetProduct,
              confirmation.amountToPay,
              tipoProducto,
            ),
          ],
          vlrPagoTotal: confirmation.amountToPay,
        };
        sessionStorage.setItem(
          "protectionTransactionRequest",
          JSON.stringify(txRequest),
        );
      }

      if (paymentMethod === "pse") {
        router.push("/pagos/pagar-mis-productos/proteccion/pse");
      } else {
        if (!sourceAccountStr || !targetProductStr) {
          router.push("/pagos/pagar-mis-productos/proteccion");
          setIsLoading(false);
          return;
        }
        const { documentType, documentNumber } = user ?? {};
        if (documentType && documentNumber) {
          await sendTransactionOtp({
            documentType,
            documentNumber,
            trnType: "PaymentInternal",
          });
        }
        router.push("/pagos/pagar-mis-productos/proteccion/codigo-sms");
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <ConfirmationPageShell
      breadcrumbs={["Inicio", "Pagos", "Pagos de Protección"]}
      welcomeBarTitle="Pago de Protección y Actividades"
      welcomeBarBackHref="/pagos/pagar-mis-productos/proteccion"
      fallbackPath="/pagos/pagar-mis-productos/proteccion"
      steps={PROTECTION_PAYMENT_STEPS}
      hasData={!!confirmation}
      isSubmitting={isLoading}
      submittingLabel="Procesando..."
      volverColorClass="text-brand-navy"
      onBack={() => router.push("/pagos/pagar-mis-productos/proteccion")}
      onConfirm={handleConfirm}
    >
      {confirmation && (
        <ProtectionPaymentConfirmationCard
          confirmation={confirmation}
          hideBalances={hideBalances}
        />
      )}
    </ConfirmationPageShell>
  );
}
