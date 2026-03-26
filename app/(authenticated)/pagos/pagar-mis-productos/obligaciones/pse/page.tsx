"use client";

import React, { useEffect } from "react";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { PSELoadingCard } from "@/src/organisms";
import { useWelcomeBar, useUserContext } from "@/src/contexts";
import { usePSERedirect } from "@/src/hooks";
import { OBLIGACION_PAYMENT_STEPS } from "@/src/mocks/mockObligacionPaymentData";
import { createPayzenTransaction } from "@/services/payments.service";
import { buildCreditTarget } from "@/lib/mappers/payments.mapper";
import type { CreditAccountResponse } from "@/types/api/products";

export default function PSEPage() {
  const { clearWelcomeBar, setWelcomeBar } = useWelcomeBar();
  const { user } = useUserContext();
  const { documentType, documentNumber } = user ?? {};

  const { message } = usePSERedirect({
    sessionKey: "obligacionPaymentConfirmation",
    fallbackPath: "/pagos/pagar-mis-productos/obligaciones",
    successPath: "/pagos/pagar-mis-productos/obligaciones/resultado",
    errorPath: "/pagos/pagar-mis-productos/obligaciones/resultado",
    phases: [
      { message: "Conectando con PSE...", duration: 2000 },
      { message: "Procesando pago...", duration: 2000 },
    ],
    onCreateTransaction: async () => {
      if (!documentType || !documentNumber || !user) {
        throw new Error("Sesion no valida");
      }
      const valor = sessionStorage.getItem("obligacionPaymentValor");
      const targetProductStr = sessionStorage.getItem(
        "obligacionTargetProductApi",
      );
      const tipoProducto =
        sessionStorage.getItem("obligacionTargetTipoProducto") || "";
      if (!valor || !targetProductStr)
        throw new Error("Datos de pago no encontrados");

      const targetProduct: CreditAccountResponse = JSON.parse(targetProductStr);
      const vlrPagoTotal = parseInt(valor, 10);

      const result = await createPayzenTransaction({
        documentType,
        documentNumber,
        vlrPagoTotal,
        pagador: {
          documentType,
          documentNumber,
          names: user.firstName,
          lastNames: user.lastName,
          email: user.email,
          mobile: user.mobile ?? "",
        },
        merchantComment: "Pago de Obligaciones",
        cuentas: [buildCreditTarget(targetProduct, vlrPagoTotal, tipoProducto)],
      });
      return result.paymentUrl;
    },
  });

  const breadcrumbItems = [
    "Inicio",
    "Pagos",
    "Pagar mis productos",
    "Pago de Obligaciones",
  ];

  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Obligaciones",
      backHref: "/pagos/pagar-mis-productos/obligaciones",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={3} steps={OBLIGACION_PAYMENT_STEPS} />
      </div>
      <PSELoadingCard message={message} />
    </div>
  );
}
