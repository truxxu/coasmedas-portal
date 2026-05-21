"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { ProductSecurityResultCard } from "@/src/organisms";
import { useBrebPageHeader } from "@/src/hooks";
import type { ProductSecurityDraft } from "@/src/types";

const BASE_PATH = "/otros-servicios/seguridad/gestion-seguridad-productos";

export default function GestionSeguridadProductosResultadoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams?.get("status") === "error" ? "error" : "success";

  useBrebPageHeader("Gestión de Productos", BASE_PATH);

  const [draft] = useState<ProductSecurityDraft | undefined>(() => {
    if (typeof window === "undefined") return undefined;
    const raw = sessionStorage.getItem("seguridadProductoDraft");
    if (!raw) return undefined;
    try {
      return JSON.parse(raw) as ProductSecurityDraft;
    } catch {
      return undefined;
    }
  });

  const clearSession = () => {
    sessionStorage.removeItem("seguridadProductoDraft");
    sessionStorage.removeItem("seguridadProductoStatus");
  };

  const handleBackToList = () => {
    clearSession();
    router.push(BASE_PATH);
  };

  const handleBackToHome = () => {
    clearSession();
    router.push("/home");
  };

  const handleRetry = () => {
    clearSession();
    router.push(BASE_PATH);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={["Inicio", "Seguridad", "Gestión de Productos"]} />
      <ProductSecurityResultCard
        status={status}
        draft={draft}
        onBackToList={handleBackToList}
        onBackToHome={handleBackToHome}
        onRetry={handleRetry}
      />
    </div>
  );
}
