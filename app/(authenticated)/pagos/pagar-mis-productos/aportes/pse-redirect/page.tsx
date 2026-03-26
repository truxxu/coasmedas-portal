"use client";

import React, { useEffect } from "react";
import { PSELoadingCard } from "@/src/organisms";
import { useWelcomeBar, useUserContext } from "@/src/contexts";
import { usePSERedirect } from "@/src/hooks";
import { createPayzenTransaction } from "@/services/payments.service";
import type { ContributionsResponse } from "@/types/api/products";
import { buildAportesTarget } from "@/lib/mappers/payments.mapper";

export default function PSERedirectPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const { user } = useUserContext();
  const { documentType, documentNumber } = user ?? {};

  const { message } = usePSERedirect({
    sessionKey: "aportesPaymentConfirmation",
    fallbackPath: "/pagos/pagar-mis-productos/aportes",
    successPath: "/pagos/pagar-mis-productos/aportes/resultado",
    errorPath: "/pagos/pagar-mis-productos/aportes/resultado",
    phases: [
      { message: "Conectando con PSE...", duration: 2000 },
      { message: "Procesando pago...", duration: 2000 },
    ],
    onCreateTransaction: async () => {
      if (!documentType || !documentNumber || !user) {
        throw new Error("Sesion no valida");
      }
      const valor = sessionStorage.getItem("aportesPaymentValor");
      const contributionsStr = sessionStorage.getItem("aportesContributions");
      const tipoProducto =
        sessionStorage.getItem("aportesTargetTipoProducto") || "";
      if (!valor || !contributionsStr)
        throw new Error("Datos de pago no encontrados");

      const contributions: ContributionsResponse = JSON.parse(contributionsStr);
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
        merchantComment: "Pago de Aportes",
        cuentas: [
          buildAportesTarget(contributions, vlrPagoTotal, tipoProducto),
        ],
      });
      return result.paymentUrl;
    },
  });

  // Set welcome bar on mount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Aportes",
      backHref: "/pagos/pagar-mis-productos/aportes/confirmacion",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  return (
    <div className="space-y-6">
      <PSELoadingCard message={message} />
    </div>
  );
}
