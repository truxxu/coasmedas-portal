import type {
  BrebAccountSubType,
  BrebAccountType,
  BrebKey,
  BrebKeyType as ApiBrebKeyType,
} from "@/types/api/breb";
import type {
  BrebKeyType as UiBrebKeyType,
  BrebRegisteredKey,
} from "@/src/types/brebKeyRegistration";
import { maskNumber } from "./formatCurrency";

/**
 * Mapping between API key type codes and the UI union.
 *
 * The UI doesn't currently model business codes (`B`); we surface those as
 * `aleatoria` so they remain visible/manageable until the UI grows a dedicated
 * label.
 */
const API_TYPE_TO_UI: Record<ApiBrebKeyType, UiBrebKeyType> = {
  E: "correo",
  M: "celular",
  NRIC: "documento",
  O: "aleatoria",
  B: "aleatoria",
};

const UI_TYPE_TO_API: Record<UiBrebKeyType, ApiBrebKeyType> = {
  correo: "E",
  celular: "M",
  documento: "NRIC",
  aleatoria: "O",
};

export function mapApiKeyTypeToUi(apiType: ApiBrebKeyType): UiBrebKeyType {
  return API_TYPE_TO_UI[apiType] ?? "aleatoria";
}

export function mapUiKeyTypeToApi(uiType: UiBrebKeyType): ApiBrebKeyType {
  return UI_TYPE_TO_API[uiType];
}

export function mapBrebKeyToUi(apiKey: BrebKey): BrebRegisteredKey {
  return {
    id: apiKey.idKeyCustomer,
    type: mapApiKeyTypeToUi(apiKey.typeKeyCustomer),
    value: apiKey.valueKeyCustomer,
    associatedAccountMasked: apiKey.numberAccount
      ? maskNumber(apiKey.numberAccount)
      : "",
    lastModified: formatBrebDate(apiKey.statusUpdateDateTime),
    status: apiKey.stateKeyCustomer === "ACTV" ? "activa" : "bloqueada",
  };
}

/**
 * BRE-B returns dates as `"DD/MM/YYYY hh:mm:ss a. m."`. Strip the time portion
 * for compact display in the keys list.
 */
function formatBrebDate(value: string | undefined): string {
  if (!value) return "";
  const datePart = value.split(" ")[0];
  return datePart || "";
}

const ACCOUNT_DESCRIPTIONS: Partial<
  Record<`${BrebAccountType}-${BrebAccountSubType}`, string>
> = {
  "AH-AV": "Cuenta de Ahorros",
  "AH-AH": "Cuenta de Ahorros",
  "CR-CR": "Cupo de Crédito",
};

/**
 * Build a human-readable description for a source account, used by mutation
 * requests (`sourceTypeAccountDescription`). The list endpoint doesn't return
 * one, so we synthesize from the type/subtype pair.
 */
export function describeBrebAccount(
  type: BrebAccountType,
  subtype: BrebAccountSubType,
): string {
  return ACCOUNT_DESCRIPTIONS[`${type}-${subtype}`] ?? "Cuenta";
}
