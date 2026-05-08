"use client";

import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { AdminProductsListCard } from "@/src/organisms";
import { useBrebPageHeader } from "@/src/hooks";
import { mockAdminProducts } from "@/src/mocks";
import type { AdminProduct } from "@/src/types";

export default function AdministracionProductosPage() {
  useBrebPageHeader("Administración de Productos", "/otros-servicios");
  const router = useRouter();

  const handleManage = (product: AdminProduct) => {
    router.push(`/otros-servicios/administracion-productos/${product.id}`);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={["Inicio", "Otros Servicios", "Administración de Productos"]}
      />
      <AdminProductsListCard
        products={mockAdminProducts}
        onManage={handleManage}
      />
    </div>
  );
}
