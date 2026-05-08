"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/src/molecules";
import {
  ProductSecurityCard,
  ProductSecurityConfirmModal,
  ProductSecurityResultModal,
  type ProductSecurityAction,
} from "@/src/organisms";
import { useBrebPageHeader } from "@/src/hooks";
import { mockProductSecurityItems } from "@/src/mocks";
import type { ProductSecurityItem } from "@/src/types";

interface PendingToggle {
  id: string;
  action: ProductSecurityAction;
}

export default function GestionSeguridadProductosPage() {
  useBrebPageHeader("Gestión de Productos", "/otros-servicios/seguridad");

  const [products, setProducts] = useState<ProductSecurityItem[]>(
    mockProductSecurityItems,
  );
  const [pending, setPending] = useState<PendingToggle | null>(null);
  const [resultAction, setResultAction] =
    useState<ProductSecurityAction | null>(null);

  const handleToggleRequest = useCallback(
    (id: string, nextChecked: boolean) => {
      setPending({ id, action: nextChecked ? "unblock" : "block" });
    },
    [],
  );

  const handleConfirm = () => {
    if (!pending) return;
    const today = new Date().toISOString().slice(0, 10);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === pending.id
          ? {
              ...p,
              status: pending.action === "block" ? "bloqueado" : "activo",
              lastUpdate: today,
            }
          : p,
      ),
    );
    setResultAction(pending.action);
    setPending(null);
  };

  const handleCancel = () => setPending(null);
  const handleResultClose = () => setResultAction(null);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={["Inicio", "Seguridad", "Gestión de Productos"]} />

      <ProductSecurityCard
        products={products}
        onToggleRequest={handleToggleRequest}
      />

      <div>
        <Link
          href="/otros-servicios/seguridad"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-navy hover:opacity-80"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Volver
        </Link>
      </div>

      <ProductSecurityConfirmModal
        isOpen={pending !== null}
        action={pending?.action ?? "block"}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      <ProductSecurityResultModal
        isOpen={resultAction !== null}
        action={resultAction ?? "block"}
        onClose={handleResultClose}
      />
    </div>
  );
}
