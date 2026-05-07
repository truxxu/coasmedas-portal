import type { SelectOption } from "@/src/atoms";
import { mockSavingsProducts } from "./ahorros";
import { mockObligacionProducts } from "./obligaciones";
import { mockTarjetaCreditoProducts } from "./tarjetaCredito";

export const mockExtractoProducts: SelectOption[] = [
  ...mockTarjetaCreditoProducts.map((p) => ({
    value: `tarjeta-${p.id}`,
    label: `${p.title} (****${p.last4})`,
  })),
  ...mockSavingsProducts.map((p) => ({
    value: `ahorro-${p.id}`,
    label: `${p.title} (****${p.productNumber})`,
  })),
  ...mockObligacionProducts.map((p) => ({
    value: `obligacion-${p.id}`,
    label: `${p.title} (****${p.productNumber})`,
  })),
];
