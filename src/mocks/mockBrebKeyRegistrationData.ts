import type { BrebKeyType } from "@/src/types/brebKeyRegistration";
import type { Step } from "@/src/types/stepper";

export const BREB_KEY_REGISTRATION_STEPS: Step[] = [
  { number: 1, label: "Detalle" },
  { number: 2, label: "Confirmación" },
  { number: 3, label: "SMS" },
  { number: 4, label: "Finalización" },
];

export const BREB_KEY_TYPE_LABELS: Record<BrebKeyType, string> = {
  celular: "Celular",
  correo: "Correo Electrónico",
  documento: "Documento",
  aleatoria: "Llave Aleatoria",
};

export const mockBrebKeyTypeOptions: { value: BrebKeyType; label: string }[] = [
  { value: "celular", label: "Celular" },
  { value: "correo", label: "Correo Electrónico" },
  { value: "documento", label: "Documento" },
  { value: "aleatoria", label: "Llave Aleatoria" },
];

export const mockBrebKeyRegistrationDefaults: Record<
  Exclude<BrebKeyType, "aleatoria">,
  string
> = {
  celular: "3456789012",
  correo: "c.cruz@example.com",
  documento: "1020304050",
};

export function generateRandomBrebKey(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 12; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}
