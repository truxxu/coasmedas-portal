"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/src/atoms";
import { useWelcomeBar } from "@/src/contexts";
import { usePSERedirect } from "@/src/hooks";

export default function PSEPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const router = useRouter();
  const [isPSEMethodValid, setIsPSEMethodValid] = useState(false);

  // Configure WelcomeBar on mount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago Unificado",
      backHref: "/pagos/pagar-mis-productos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Check if PSE payment method was selected
  useEffect(() => {
    const paymentMethod = sessionStorage.getItem("paymentMethod");
    if (paymentMethod === "pse") {
      setIsPSEMethodValid(true);
    } else {
      router.push("/pagos/pagar-mis-productos/pago-unificado");
    }
  }, [router]);

  const handleBeforeRedirect = () => {
    sessionStorage.setItem("paymentStatus", "success");
  };

  const { message, isSessionValid } = usePSERedirect({
    sessionKey: "paymentConfirmationData",
    fallbackPath: "/pagos/pagar-mis-productos/pago-unificado",
    successPath: "/pagos/pagar-mis-productos/pago-unificado/resultado",
    phases: [
      { message: "Conectando a PSE", duration: 3000 },
      { message: "Procesando pago", duration: 5000 },
    ],
    onBeforeRedirect: handleBeforeRedirect,
  });

  if (!isSessionValid || !isPSEMethodValid) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-brand-gray-high">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="p-8 md:p-12 text-center max-w-md w-full">
        {/* Spinner */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-brand-border border-t-brand-primary rounded-full animate-spin" />
        </div>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-bold text-brand-navy mb-2">
          {message}
        </h2>

        {/* Description */}
        <p className="text-sm md:text-base text-brand-gray-high">
          Estamos preparando tu solicitud con la plataforma de pagos segura.
        </p>
      </Card>
    </div>
  );
}
