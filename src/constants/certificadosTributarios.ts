import type { SelectOption } from "@/src/atoms";

export const CERTIFICADO_TRIBUTARIO_OPTIONS: SelectOption[] = [
  { value: "certificacion-hipotecaria", label: "Certificación Hipotecaria" },
  { value: "retencion-en-la-fuente", label: "Retención en la fuente" },
];

const CURRENT_YEAR = new Date().getFullYear();

export const CERTIFICADO_TRIBUTARIO_ANIOS: SelectOption[] = Array.from(
  { length: 5 },
  (_, i) => {
    const year = String(CURRENT_YEAR - i);
    return { value: year, label: year };
  },
);
