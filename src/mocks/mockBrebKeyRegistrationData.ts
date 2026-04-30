import type {
  BrebKeyType,
  BrebRegisteredKey,
} from "@/src/types/brebKeyRegistration";
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

export const mockBrebRegistrationAccounts: {
  id: string;
  label: string;
  maskedNumber: string;
}[] = [
  {
    id: "savings-1",
    label: "Cuenta de Ahorros (***4428)",
    maskedNumber: "***4428",
  },
];

export const mockRegisteredKeys: BrebRegisteredKey[] = [
  {
    id: "key-1",
    type: "celular",
    value: "3001234547",
    associatedAccountMasked: "***4428",
    lastModified: "10 Oct 2025",
    status: "activa",
  },
  {
    id: "key-2",
    type: "correo",
    value: "c.cruz@example.com",
    associatedAccountMasked: "***4428",
    lastModified: "04 Sept 2025",
    status: "activa",
  },
  {
    id: "key-3",
    type: "documento",
    value: "1020304050",
    associatedAccountMasked: "***4428",
    lastModified: "01 Ago 2025",
    status: "bloqueada",
  },
];

export function generateRandomBrebKey(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 12; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}
