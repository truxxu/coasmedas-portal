"use client";

import { useState, useMemo } from "react";
import { Card, Select } from "@/src/atoms";
import { AdminProductListItem } from "@/src/molecules";
import { useUserContext, useUIContext } from "@/src/contexts";
import {
  ADMIN_PRODUCT_TYPE_LABELS,
  type AdminProduct,
  type AdminProductType,
} from "@/src/types";

interface AdminProductsListCardProps {
  products: AdminProduct[];
  onManage: (product: AdminProduct) => void;
}

const SEGMENT_OPTIONS = [
  { value: "all", label: "Todos los productos" },
  { value: "ahorros", label: ADMIN_PRODUCT_TYPE_LABELS.ahorros },
  { value: "cupo-rotativo", label: ADMIN_PRODUCT_TYPE_LABELS["cupo-rotativo"] },
  {
    value: "tarjeta-credito",
    label: ADMIN_PRODUCT_TYPE_LABELS["tarjeta-credito"],
  },
];

export function AdminProductsListCard({
  products,
  onManage,
}: AdminProductsListCardProps) {
  const { user } = useUserContext();
  const { hideBalances } = useUIContext();
  const [segment, setSegment] = useState<"all" | AdminProductType>("all");

  const userName = useMemo(() => {
    if (!user) return "";
    return (
      user.fullName ?? `${user.firstName} ${user.lastName}`
    ).toUpperCase();
  }, [user]);

  const filtered = useMemo(() => {
    if (segment === "all") return products;
    return products.filter((p) => p.type === segment);
  }, [products, segment]);

  return (
    <Card className="p-6 md:p-8">
      <h2 className="text-[21px] font-bold text-brand-primary">
        Administración de Productos
      </h2>
      <p className="text-[14px] text-brand-text-secondary mt-2">
        {userName ? (
          <>
            Hola <span className="font-medium">{userName}</span>,{" "}
          </>
        ) : null}
        en este módulo puedes definir la cantidad de transacciones y el tope
        valores de tus productos.
      </p>

      <div className="mt-6 max-w-xs">
        <label className="block text-sm text-brand-text-secondary mb-1">
          Filtrar por segmento:
        </label>
        <Select
          options={SEGMENT_OPTIONS}
          value={segment}
          onChange={(e) => setSegment(e.target.value as typeof segment)}
        />
      </div>

      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <p className="text-sm text-brand-gray-medium text-center py-8">
            No hay productos en este segmento.
          </p>
        ) : (
          filtered.map((product) => (
            <AdminProductListItem
              key={product.id}
              product={product}
              onManage={onManage}
              hideBalances={hideBalances}
            />
          ))
        )}
      </div>
    </Card>
  );
}
