"use client";

import React, { useEffect } from "react";
import { PSELoadingCard } from "@/src/organisms";
import { useWelcomeBar, useUserContext } from "@/src/contexts";
import { usePSERedirect } from "@/src/hooks";
import { createPayzenTransaction } from "@/services/payments.service";
import { buildProtectionTarget } from "@/lib/mappers/payments.mapper";
import type { ProtectionAccountResponse } from "@/types/api/products";

export default function ProteccionPSEPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const { user } = useUserContext();
  const { documentType, documentNumber } = user ?? {};

  const { message } = usePSERedirect({
    sessionKey: "protectionPaymentConfirmation",
    fallbackPath: "/pagos/pagar-mis-productos/proteccion",
    successPath: "/pagos/pagar-mis-productos/proteccion/respuesta",
    errorPath: "/pagos/pagar-mis-productos/proteccion/respuesta",
    phases: [
      { message: "Conectando con PSE...", duration: 2000 },
      { message: "Procesando pago...", duration: 2000 },
    ],
    onCreateTransaction: async () => {
      if (!documentType || !documentNumber || !user) {
        throw new Error("Sesion no valida");
      }
      const confirmationStr = sessionStorage.getItem(
        "protectionPaymentConfirmation",
      );
      const targetProductStr = sessionStorage.getItem(
        "protectionTargetProductApi",
      );
      const tipoProducto =
        sessionStorage.getItem("protectionTargetTipoProducto") || "";
      if (!confirmationStr || !targetProductStr)
        throw new Error("Datos de pago no encontrados");

      const confirmation = JSON.parse(confirmationStr);
      const targetProduct: ProtectionAccountResponse =
        JSON.parse(targetProductStr);
      const vlrPagoTotal = confirmation.amountToPay;

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
        merchantComment: "Pago de Protección y Actividades",
        cuentas: [
          buildProtectionTarget(targetProduct, vlrPagoTotal, tipoProducto),
        ],
      });
      return result.paymentUrl;
    },
  });

  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Protección y Actividades",
      backHref: "/pagos/pagar-mis-productos/proteccion/confirmacion",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  return (
    <div className="space-y-6">
      <PSELoadingCard message={message} />
    </div>
  );
}
