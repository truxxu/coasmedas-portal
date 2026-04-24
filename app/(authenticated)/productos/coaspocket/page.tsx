"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, SavingsAccountSelectorRow } from "@/src/molecules";
import { useWelcomeBar, useUserContext } from "@/src/contexts";
import { SavingsProduct } from "@/src/types";
import { mapSavingsProducts } from "@/src/utils";
import { getProductsSavings } from "@/services/products.service";
import { isAuthError } from "@/lib/api/errors";

export default function CoaspocketPage() {
  const { user } = useUserContext();
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [products, setProducts] = useState<SavingsProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setWelcomeBar({ title: "Coaspocket", backHref: "/home" });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const { documentType, documentNumber } = user ?? {};

  const fetchData = useCallback(async () => {
    if (!documentType || !documentNumber) return;

    try {
      setLoading(true);
      setError(null);

      const apiProducts = await getProductsSavings({
        documentType,
        documentNumber,
      });
      setProducts(mapSavingsProducts(apiProducts));
    } catch (err) {
      if (isAuthError(err)) {
        router.push("/login");
        return;
      }
      setError("No fue posible cargar la información. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [documentType, documentNumber, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelect = (product: SavingsProduct) => {
    const query = new URLSearchParams({
      name: product.title,
      number: product.productNumber,
    }).toString();
    router.push(
      `/productos/coaspocket/${encodeURIComponent(product.id)}?${query}`,
    );
  };

  if (error) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={["Inicio", "Productos", "Coaspocket"]} />
        <div className="bg-white rounded-2xl p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="text-sm font-medium text-white bg-brand-navy px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={["Inicio", "Productos", "Coaspocket"]} />
        <div className="bg-white rounded-2xl p-6 animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-16 w-full bg-gray-200 rounded" />
          <div className="h-16 w-full bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={["Inicio", "Productos", "Coaspocket"]} />

      <div className="bg-white rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="text-[21px] font-bold text-brand-navy">
            Gestión de Bolsillos
          </h2>
          <p className="text-[14px] text-brand-gray-high mt-1">
            Selecciona la cuenta de ahorros para ver y gestionar sus bolsillos.
          </p>
        </div>

        {products.length === 0 ? (
          <p className="text-sm text-brand-gray-high py-6 text-center">
            No tienes cuentas de ahorro disponibles.
          </p>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <SavingsAccountSelectorRow
                key={product.id}
                title={product.title}
                productNumber={product.productNumber}
                balance={product.balance}
                onClick={() => handleSelect(product)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
