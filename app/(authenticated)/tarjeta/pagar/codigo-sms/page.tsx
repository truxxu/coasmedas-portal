"use client";

import React from "react";
import { TarjetaSmsCodePage } from "@/src/organisms";
import {
  TarjetaPaymentConfirmationData,
  TarjetaPaymentResult,
} from "@/src/types/tarjeta-payment";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";
import { TARJETA_PAYMENT_STEPS } from "@/src/mocks";

export default function PagarTarjetaCodigoSmsPage() {
  return (
    <TarjetaSmsCodePage<TarjetaPaymentConfirmationData, TarjetaPaymentResult>
      sessionKey="tarjetaPaymentConfirmation"
      resultKey="tarjetaPaymentResult"
      fallbackPath="/tarjeta/pagar"
      successPath="/tarjeta/pagar/resultado"
      confirmationPath="/tarjeta/pagar/confirmacion"
      breadcrumbs={["Inicio", "Tarjeta de Crédito", "Pagar Tarjeta"]}
      welcomeBarTitle="Pagar Tarjeta"
      steps={TARJETA_PAYMENT_STEPS}
      submitLabel="Pagar"
      buildResult={(confirmation, meta) => {
        const productStr = sessionStorage.getItem("tarjetaPaymentProduct");
        if (!productStr) {
          throw new Error("Datos de transacción no encontrados");
        }
        const product: TarjetaCreditoProduct = JSON.parse(productStr);
        return {
          status: "success",
          tarjetaDisplay: `${product.title} (****${product.last4})`,
          valorPagado: confirmation.valorAPagar,
          newEstimatedBalance: confirmation.newEstimatedBalance,
          ...meta,
        };
      }}
    />
  );
}
