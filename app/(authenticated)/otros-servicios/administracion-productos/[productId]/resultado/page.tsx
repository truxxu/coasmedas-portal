"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useParams,
  useRouter,
  useSearchParams,
  notFound,
} from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { AdminProductResultCard } from "@/src/organisms";
import { useBrebPageHeader } from "@/src/hooks";
import { mockAdminProducts } from "@/src/mocks";
import type { AdminProductoFormValues } from "@/src/schemas/adminProductoSchema";

const LIST_PATH = "/otros-servicios/administracion-productos";

export default function AdminProductoResultadoPage() {
  const router = useRouter();
  const params = useParams<{ productId: string }>();
  const searchParams = useSearchParams();
  const productId = params?.productId ?? "";
  const status = searchParams?.get("status") === "error" ? "error" : "success";

  const product = useMemo(
    () => mockAdminProducts.find((p) => p.id === productId),
    [productId],
  );

  useBrebPageHeader(
    product
      ? `Editando ${product.displayName.split(" (")[0]}`
      : "Administración de Productos",
  );

  const [data, setData] = useState<AdminProductoFormValues | undefined>();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = sessionStorage.getItem(`adminProductoDraft:${productId}`);
    if (raw) {
      try {
        setData(JSON.parse(raw) as AdminProductoFormValues);
      } catch {
        // ignore parse errors
      }
    }
  }, [productId]);

  if (!product) {
    notFound();
  }

  const clearSession = () => {
    sessionStorage.removeItem(`adminProductoDraft:${productId}`);
    sessionStorage.removeItem(`adminProductoStatus:${productId}`);
  };

  const handleBackToList = () => {
    clearSession();
    router.push(LIST_PATH);
  };

  const handleBackToHome = () => {
    clearSession();
    router.push("/home");
  };

  const handleRetry = () => {
    router.push(`${LIST_PATH}/${productId}`);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          "Inicio",
          "Administración de Productos",
          `Editando ${product.displayName.split(" (")[0]}`,
        ]}
      />
      <AdminProductResultCard
        status={status}
        product={product}
        data={data}
        onBackToList={handleBackToList}
        onBackToHome={handleBackToHome}
        onRetry={handleRetry}
      />
    </div>
  );
}
