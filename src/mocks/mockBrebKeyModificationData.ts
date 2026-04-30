import type {
  BrebAvailableNewKey,
  BrebKeyInUseElsewhere,
} from "@/src/types/brebKeyModification";
import type { Step } from "@/src/types/stepper";

export const BREB_KEY_MODIFICATION_STEPS: Step[] = [
  { number: 1, label: "Detalle" },
  { number: 2, label: "Confirmación" },
  { number: 3, label: "SMS" },
  { number: 4, label: "Finalización" },
];

export const mockBrebAvailableNewKeys: BrebAvailableNewKey[] = [
  {
    id: "new-key-1",
    type: "aleatoria",
    value: "@camilo.coas",
    displayLabel: "@camilo.coas",
  },
  {
    id: "new-key-2",
    type: "aleatoria",
    value: "@cacruz85",
    displayLabel: "@cacruz85",
  },
  {
    id: "new-key-3",
    type: "celular",
    value: "3001234567",
    displayLabel: "3001234567",
  },
];

export const mockBrebKeysInUseElsewhere: BrebKeyInUseElsewhere[] = [
  {
    id: "in-use-1",
    type: "correo",
    value: "c.cruz@example.com",
    inUseAt: "En uso en Coasmedas (Cta. ***1234)",
  },
  {
    id: "in-use-2",
    type: "documento",
    value: "1020304050",
    inUseAt: "En uso en Banco X",
  },
];
