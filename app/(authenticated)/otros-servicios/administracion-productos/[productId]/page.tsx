"use client";

import { useMemo } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { AdminProductEditForm } from "@/src/organisms";
import { useBrebPageHeader } from "@/src/hooks";
import { mockAdminProducts } from "@/src/mocks";
import type { AdminProductoFormValues } from "@/src/schemas/adminProductoSchema";

const LIST_PATH = "/otros-servicios/administracion-productos";

export default function EditAdminProductPage() {
  const router = useRouter();
  const params = useParams<{ productId: string }>();
  const productId = params?.productId;

  const product = useMemo(
    () => mockAdminProducts.find((p) => p.id === productId),
    [productId],
  );

  useBrebPageHeader(
    product
      ? `Editando ${product.displayName.split(" (")[0]}`
      : "Administración de Productos",
    LIST_PATH,
  );

  if (!product) {
    notFound();
  }

  const handleSubmit = (data: AdminProductoFormValues) => {
    sessionStorage.setItem(
      `adminProductoDraft:${product.id}`,
      JSON.stringify(data),
    );
    router.push(`${LIST_PATH}/${product.id}/codigo-sms`);
  };

  const handleCancel = () => {
    router.push(LIST_PATH);
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
      <AdminProductEditForm
        product={product}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
