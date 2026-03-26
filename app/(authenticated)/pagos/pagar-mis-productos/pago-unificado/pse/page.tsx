"use client";

import React, { useEffect } from "react";
import { PSELoadingCard } from "@/src/organisms";
import { useWelcomeBar, useUserContext } from "@/src/contexts";
import { usePSERedirect } from "@/src/hooks";
import { createPayzenTransaction } from "@/services/payments.service";
import { buildUnifiedTargets } from "@/lib/mappers/payments.mapper";
import type { PaymentProduct } from "@/types/api/payments";

export default function PSEPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const { user } = useUserContext();
  const { documentType, documentNumber } = user ?? {};

  const { message } = usePSERedirect({
    sessionKey: "paymentConfirmationData",
    fallbackPath: "/pagos/pagar-mis-productos/pago-unificado",
    successPath: "/pagos/pagar-mis-productos/pago-unificado/resultado",
    errorPath: "/pagos/pagar-mis-productos/pago-unificado/resultado",
    phases: [
      { message: "Conectando con PSE...", duration: 2000 },
      { message: "Procesando pago...", duration: 2000 },
    ],
    onCreateTransaction: async () => {
      if (!documentType || !documentNumber || !user) {
        throw new Error("Sesion no valida");
      }
      const confirmationStr = sessionStorage.getItem("paymentConfirmationData");
      const productsStr = sessionStorage.getItem("unifiedPaymentProducts");
      if (!confirmationStr || !productsStr)
        throw new Error("Datos de pago no encontrados");

      const confirmation = JSON.parse(confirmationStr);
      const products: PaymentProduct[] = JSON.parse(productsStr);
      const vlrPagoTotal = confirmation.totalAmount;

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
        merchantComment: "Pago Unificado",
        cuentas: buildUnifiedTargets(products),
      });
      return result.paymentUrl;
    },
  });

  useEffect(() => {
    setWelcomeBar({
      title: "Pago Unificado",
      backHref: "/pagos/pagar-mis-productos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  return (
    <div className="space-y-6">
      <PSELoadingCard message={message} />
    </div>
  );
}
