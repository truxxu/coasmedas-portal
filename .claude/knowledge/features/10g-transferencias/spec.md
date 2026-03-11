# Feature 10g - Transferencias Externas: Cuentas de mi Red Coopcentral — Implementation Spec

## Summary

Implement the "Cuentas de mi Red Coopcentral" external transfer flow under `/transferencias/externas/red-coopcentral`. This is a 4-step flow (Details → Confirmation → SMS → Result) that mirrors the existing `otros-bancos` flow pattern. It also requires fixing typos in the existing `ExternasFlowGrid` and `externas/page.tsx`.

---

## Pre-implementation: Bug Fixes

### Fix 1: ExternasFlowGrid.tsx — Flow ID typo

**File**: `src/organisms/ExternasFlowGrid.tsx` (line 27)

```diff
- id: "red-copcentral",
+ id: "red-coopcentral",
```

### Fix 2: ExternasFlowGrid.tsx — Incorrect href

**File**: `src/organisms/ExternasFlowGrid.tsx` (line 30)

```diff
- href: "/transferencias/externas/desde-cupos-rotativos",
+ href: "/transferencias/externas/red-coopcentral",
```

### Fix 3: externas/page.tsx — Handler typo

**File**: `app/(authenticated)/transferencias/externas/page.tsx` (lines 26-27)

```diff
- } else if (flowId === "red-copcentral") {
-   router.push("/transferencias/externas/red-copcentral");
+ } else if (flowId === "red-coopcentral") {
+   router.push("/transferencias/externas/red-coopcentral");
```

---

## File Creation Plan

### New Files to Create (in order)

| # | File | Type | Description |
|---|------|------|-------------|
| 1 | `src/types/redCoopTransfer.ts` | Types | All TypeScript interfaces |
| 2 | `src/mocks/mockRedCoopTransferData.ts` | Mocks | Mock data and step constants |
| 3 | `src/organisms/RedCoopTransferDetailsCard.tsx` | Organism | Transfer details form |
| 4 | `src/organisms/RedCoopTransferConfirmationCard.tsx` | Organism | Confirmation summary |
| 5 | `src/organisms/RedCoopTransferResultCard.tsx` | Organism | Result display (success/error) |
| 6 | `app/(authenticated)/transferencias/externas/red-coopcentral/page.tsx` | Page | Step 1: Details |
| 7 | `app/(authenticated)/transferencias/externas/red-coopcentral/confirmacion/page.tsx` | Page | Step 2: Confirmation |
| 8 | `app/(authenticated)/transferencias/externas/red-coopcentral/sms/page.tsx` | Page | Step 3: SMS verification |
| 9 | `app/(authenticated)/transferencias/externas/red-coopcentral/resultado/page.tsx` | Page | Step 4: Result |

### Files to Modify

| File | Change |
|------|--------|
| `src/organisms/ExternasFlowGrid.tsx` | Fix typo + href (see Fix 1, Fix 2) |
| `app/(authenticated)/transferencias/externas/page.tsx` | Fix handler typo (see Fix 3) |
| `src/organisms/index.ts` | Export 3 new organism components |
| `src/mocks/index.ts` | Export new mock data |
| `src/types/index.ts` (if exists) | Export new types |

---

## Detailed Implementation

### 1. Types — `src/types/redCoopTransfer.ts`

Mirror the `externalTransfer.ts` structure. Key difference: destination bank is always "Coopcentral".

```typescript
/**
 * Source account for Red Coopcentral transfer
 */
export interface RedCoopSourceAccount {
  id: string;
  type: string;              // e.g., "Cuenta de Ahorros"
  balance: number;
  maskedNumber: string;      // e.g., "****4428"
}

/**
 * Destination account (registered Coopcentral network account)
 */
export interface RedCoopDestinationAccount {
  id: string;
  holderName: string;        // e.g., "PEDRO PEREZ"
  bankName: string;          // Always "Coopcentral"
  accountType: "ahorros" | "corriente";
  accountNumber: string;     // e.g., "123-456789-01"
  alias?: string;
}

/**
 * Step 1: Transfer details form data
 */
export interface RedCoopTransferFormData {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  concept: string;
}

/**
 * Step 2: Confirmation display data
 */
export interface RedCoopTransferConfirmationData {
  // Holder (sender) info
  holderName: string;
  holderDocument: string;     // Masked: "CC 1.***.***. 231"
  sourceProduct: string;      // e.g., "Cuenta de Ahorros"

  // Destination info
  destinationHolder: string;  // e.g., "PEDRO PEREZ"
  destinationBank: string;    // Always "Coopcentral"
  destinationAccountType: string; // "Ahorros" | "Corriente"
  destinationAccountNumber: string;

  // Transfer details
  amount: number;
  concept: string;
}

/**
 * Step 4: Transaction result
 */
export interface RedCoopTransferResult {
  status: "success" | "error";

  // Transfer details
  sourceAccount: string;
  destinationBank: string;    // Always "Coopcentral"
  destinationAccountNumber: string;
  amountTransferred: number;
  concept: string;
  transactionCost: number;    // Always 0 per design

  // Transaction metadata
  transactionDate: string;    // e.g., "5 de Enero de 2025"
  transactionTime: string;    // e.g., "03:02 p.m."
  approvalNumber: string;     // 6-digit string
  description: string;        // "Transferencia Exitosa" or error

  // Error info
  errorMessage?: string;
}
```

---

### 2. Mock Data — `src/mocks/mockRedCoopTransferData.ts`

```typescript
import type {
  RedCoopSourceAccount,
  RedCoopDestinationAccount,
  RedCoopTransferConfirmationData,
  RedCoopTransferResult,
} from "@/src/types/redCoopTransfer";
import type { Step } from "@/src/types/stepper";

/**
 * Mock source accounts (user's savings accounts)
 */
export const mockRedCoopSourceAccounts: RedCoopSourceAccount[] = [
  {
    id: "savings-1",
    type: "Cuenta de Ahorros",
    balance: 8730500,
    maskedNumber: "****4428",
  },
];

/**
 * Mock destination accounts (registered Coopcentral network accounts)
 */
export const mockRedCoopDestinationAccounts: RedCoopDestinationAccount[] = [
  {
    id: "coop-1",
    holderName: "PEDRO PEREZ",
    bankName: "Coopcentral",
    accountType: "ahorros",
    accountNumber: "123-456789-01",
  },
  {
    id: "coop-2",
    holderName: "ANA MARIA LOPEZ",
    bankName: "Coopcentral",
    accountType: "corriente",
    accountNumber: "456-789012-34",
  },
];

/**
 * Mock user data for confirmation
 */
export const mockRedCoopUserData = {
  holderName: "CAMILO ANDRES CRUZ",
  holderDocument: "CC 1.***.***. 231",
};

/**
 * Mock confirmation data
 */
export const mockRedCoopConfirmation: RedCoopTransferConfirmationData = {
  holderName: "CAMILO ANDRES CRUZ",
  holderDocument: "CC 1.***.***. 231",
  sourceProduct: "Cuenta de Ahorros",
  destinationHolder: "PEDRO PEREZ",
  destinationBank: "Coopcentral",
  destinationAccountType: "Ahorros",
  destinationAccountNumber: "123-456789-01",
  amount: 200000,
  concept: "Clases mensuales",
};

/**
 * Mock successful result
 */
export const mockRedCoopResultSuccess: RedCoopTransferResult = {
  status: "success",
  sourceAccount: "Cuenta de Ahorros",
  destinationBank: "Coopcentral",
  destinationAccountNumber: "123-456789-01",
  amountTransferred: 200000,
  concept: "Clases mensuales",
  transactionCost: 0,
  transactionDate: "5 de Enero de 2025",
  transactionTime: "03:02 p.m.",
  approvalNumber: "251606",
  description: "Transferencia Exitosa",
};

/**
 * Mock error result
 */
export const mockRedCoopResultError: RedCoopTransferResult = {
  status: "error",
  sourceAccount: "Cuenta de Ahorros",
  destinationBank: "Coopcentral",
  destinationAccountNumber: "123-456789-01",
  amountTransferred: 0,
  concept: "Clases mensuales",
  transactionCost: 0,
  transactionDate: "5 de Enero de 2025",
  transactionTime: "03:03 p.m.",
  approvalNumber: "-",
  description: "Transaccion Fallida",
  errorMessage: "Fondos insuficientes",
};

/**
 * Valid SMS code for testing
 */
export const RED_COOP_MOCK_VALID_CODE = "123456";

/**
 * Red Coopcentral transfer flow steps
 */
export const RED_COOP_TRANSFER_STEPS: Step[] = [
  { number: 1, label: "Detalle" },
  { number: 2, label: "Confirmacion" },
  { number: 3, label: "SMS" },
  { number: 4, label: "Finalizacion" },
];
```

---

### 3. Organism — `RedCoopTransferDetailsCard.tsx`

Clone the `ExternalTransferDetailsCard` pattern with these differences:

| Aspect | ExternalTransferDetailsCard | RedCoopTransferDetailsCard |
|--------|-----------------------------|----------------------------|
| Card title | "Transferencias Externas" | "Transferencias a Cuentas de mi Red Coopcentral" |
| Card description | "Transfiere dinero a cuentas en otros bancos o entidades financieras." | "Envia dinero a otras cooperativas de la Red Coopcentral" |
| Source label | "De cual cuenta quieres transferir?" | "¿De cual cuenta quieres transferir?" |
| Destination label | "Cuenta destino" | "Cuenta destino / Codigo de producto" |
| Destination placeholder | "Selecciona una cuenta inscrita..." | "Selecciona una cuenta inscrita..." |
| Destination format | `${account.alias} (${account.bankName})` | `${account.holderName} - ${account.accountNumber}` |
| Amount label | "Que valor deseas transferir?" | "¿Que valor deseas transferir?" |
| Concept label | "Cual es el concepto de la transaccion? (opcional)" | "Concepto (Opcional)" |
| No-destination link | `/transferencias/inscribir-cuentas` | `/transferencias/externas/inscribir-cuentas` |
| Types imported | `ExternalTransferSourceAccount`, `ExternalTransferDestinationAccount` | `RedCoopSourceAccount`, `RedCoopDestinationAccount` |

**Props interface:**

```typescript
interface RedCoopTransferDetailsCardProps {
  sourceAccounts: RedCoopSourceAccount[];
  destinationAccounts: RedCoopDestinationAccount[];
  selectedSourceId: string;
  selectedDestinationId: string;
  amount: string;
  concept: string;
  onSourceChange: (accountId: string) => void;
  onDestinationChange: (accountId: string) => void;
  onAmountChange: (amount: string) => void;
  onConceptChange: (concept: string) => void;
  hideBalances: boolean;
  error?: string;
}
```

**Implementation**: Follow `ExternalTransferDetailsCard.tsx` exactly (lines 1-182) with the text/type changes listed above. Same structure: Card wrapping, `space-y-6`, then `space-y-5` for form fields, same select/input styling, same amount input with `$` prefix and bottom border, same error display.

---

### 4. Organism — `RedCoopTransferConfirmationCard.tsx`

Clone `ExternalTransferConfirmationCard` with these differences:

| Aspect | External | RedCoop |
|--------|----------|---------|
| Card title | "Confirmacion de Transferencia" | "Confirmacion de Pago" |
| Card description | Same text | Same text |
| Types | `ExternalTransferConfirmationData` | `RedCoopTransferConfirmationData` |

**Props interface:**

```typescript
interface RedCoopTransferConfirmationCardProps {
  confirmationData: RedCoopTransferConfirmationData;
  hideBalances: boolean;
}
```

**Layout**: Identical to `ExternalTransferConfirmationCard.tsx` (lines 1-117). Three sections separated by `<Divider />`:
1. Holder info: Nombre Titular, Documento Titular, Producto a Debitar
2. Destination info: Titular Destino, Banco Destino (always "Coopcentral"), Tipo de Cuenta, Cuenta Destino
3. Transfer details: Valor a Transferir (18px), Concepto (conditional)

Same row styling: `flex justify-between items-center py-2`, label `text-[15px] text-brand-text-black`, value `text-[15px] font-medium text-brand-text-black`.

---

### 5. Organism — `RedCoopTransferResultCard.tsx`

Clone `ExternalTransferResultCard` with these differences:

| Aspect | External | RedCoop |
|--------|----------|---------|
| Types | `ExternalTransferResult` | `RedCoopTransferResult` |

**Props interface:**

```typescript
interface RedCoopTransferResultCardProps {
  result: RedCoopTransferResult;
  hideBalances: boolean;
}
```

**Layout**: Identical to `ExternalTransferResultCard.tsx` (lines 1-173). Same icon SVGs, same success/error states, same detail rows.

Success rows:
1. Cuenta Origen
2. Banco Destino (always "Coopcentral")
3. Cuenta Destino
4. --- Divider ---
5. Valor Transferido (18px)
6. Concepto (conditional)
7. Costo Transaccion (always $0)
8. --- Divider ---
9. Fecha de Transaccion
10. Hora de Transaccion
11. Numero de Aprobacion
12. Descripcion (green text `text-brand-success-icon`)

---

### 6. Page — Step 1: Details (`red-coopcentral/page.tsx`)

Clone `otros-bancos/page.tsx` with these changes:

| Aspect | otros-bancos | red-coopcentral |
|--------|--------------|-----------------|
| Component name | `AOtrosBancosPage` | `RedCoopcentalPage` |
| WelcomeBar title | `"A Otros Bancos"` | `"Cuentas de mi Red Coopcentral"` |
| WelcomeBar backHref | `"/transferencias/externas"` | `"/transferencias/externas"` |
| Breadcrumbs | `["Inicio", "Transferencias", "A Otros Bancos"]` | `["Inicio", "Transferencias", "Red Coopcentral"]` |
| Organism used | `ExternalTransferDetailsCard` | `RedCoopTransferDetailsCard` |
| Mock data imports | `mockExternalTransferSourceAccounts`, `mockExternalTransferDestinations` | `mockRedCoopSourceAccounts`, `mockRedCoopDestinationAccounts` |
| Steps import | `EXTERNAL_TRANSFER_STEPS` | `RED_COOP_TRANSFER_STEPS` |
| SessionStorage prefix | `externalTransfer*` | `redCoopTransfer*` |
| Confirm route | `"/transferencias/externas/otros-bancos/confirmacion"` | `"/transferencias/externas/red-coopcentral/confirmacion"` |
| Back route | `"/transferencias/externas"` | `"/transferencias/externas"` |

**SessionStorage keys:**
- `redCoopTransferSourceId`
- `redCoopTransferDestinationId`
- `redCoopTransferAmount`
- `redCoopTransferConcept`

**Validation logic**: Same as `otros-bancos/page.tsx` (lines 34-62):
1. Required source account
2. Required destination account
3. Amount > 0
4. Amount ≤ source balance
5. Concept max 100 chars

**Layout**: Identical structure — Breadcrumbs, Stepper (currentStep={1}), DetailsCard, Volver/Confirmar buttons.

---

### 7. Page — Step 2: Confirmation (`red-coopcentral/confirmacion/page.tsx`)

Clone `otros-bancos/confirmacion/page.tsx` with these changes:

| Aspect | otros-bancos | red-coopcentral |
|--------|--------------|-----------------|
| Component name | `ConfirmacionPage` | `RedCoopConfirmacionPage` |
| WelcomeBar title | `"A Otros Bancos"` | `"Cuentas de mi Red Coopcentral"` |
| WelcomeBar backHref | `"/transferencias/externas/otros-bancos"` | `"/transferencias/externas/red-coopcentral"` |
| Breadcrumbs | `["Inicio", "Transferencias", "A Otros Bancos"]` | `["Inicio", "Transferencias", "Red Coopcentral"]` |
| Organism | `ExternalTransferConfirmationCard` | `RedCoopTransferConfirmationCard` |
| Types | `ExternalTransferConfirmationData` | `RedCoopTransferConfirmationData` |
| Mock imports | `mockExternalTransferSourceAccounts`, `mockExternalTransferDestinations`, `mockExternalTransferUserData` | `mockRedCoopSourceAccounts`, `mockRedCoopDestinationAccounts`, `mockRedCoopUserData` |
| Steps | `EXTERNAL_TRANSFER_STEPS` | `RED_COOP_TRANSFER_STEPS` |
| SessionStorage prefix | `externalTransfer*` | `redCoopTransfer*` |
| Redirect route | `"/transferencias/externas/otros-bancos"` | `"/transferencias/externas/red-coopcentral"` |
| Next route | `"/transferencias/externas/otros-bancos/sms"` | `"/transferencias/externas/red-coopcentral/sms"` |
| Back route | `"/transferencias/externas/otros-bancos"` | `"/transferencias/externas/red-coopcentral"` |

**Key difference in confirmation data building**: Destination bank is always `"Coopcentral"` (hardcoded from mock data). The `destinationAccountType` capitalization logic remains: `"ahorros" → "Ahorros"`, `"corriente" → "Corriente"`.

**Destination format**: Since `RedCoopDestinationAccount` doesn't have `alias`, the destination lookup uses `holderName` instead.

---

### 8. Page — Step 3: SMS (`red-coopcentral/sms/page.tsx`)

Clone `otros-bancos/sms/page.tsx` with these changes:

| Aspect | otros-bancos | red-coopcentral |
|--------|--------------|-----------------|
| Component name | `SMSVerificationPage` | `RedCoopSMSPage` |
| WelcomeBar title | `"A Otros Bancos"` | `"Cuentas de mi Red Coopcentral"` |
| WelcomeBar backHref | `"/transferencias/externas/otros-bancos/confirmacion"` | `"/transferencias/externas/red-coopcentral/confirmacion"` |
| Breadcrumbs | `["Inicio", "Transferencias", "A Otros Bancos"]` | `["Inicio", "Transferencias", "Red Coopcentral"]` |
| Steps | `EXTERNAL_TRANSFER_STEPS` | `RED_COOP_TRANSFER_STEPS` |
| Valid code | `EXTERNAL_TRANSFER_MOCK_VALID_CODE` | `RED_COOP_MOCK_VALID_CODE` |
| Mock imports | `mockExternalTransferSourceAccounts`, `mockExternalTransferDestinations` | `mockRedCoopSourceAccounts`, `mockRedCoopDestinationAccounts` |
| Result type | `ExternalTransferResult` | `RedCoopTransferResult` |
| SessionStorage prefix | `externalTransfer*` | `redCoopTransfer*` |
| Confirmation check key | `"externalTransferConfirmation"` | `"redCoopTransferConfirmation"` |
| Redirect route | `"/transferencias/externas/otros-bancos"` | `"/transferencias/externas/red-coopcentral"` |
| Success route | `"/transferencias/externas/otros-bancos/resultado"` | `"/transferencias/externas/red-coopcentral/resultado"` |
| Back route | `"/transferencias/externas/otros-bancos/confirmacion"` | `"/transferencias/externas/red-coopcentral/confirmacion"` |

**`generateTransactionResult` function**: Same logic (lines 70-129 of otros-bancos sms page), but:
- Uses `mockRedCoopSourceAccounts` and `mockRedCoopDestinationAccounts` for lookups
- Returns `RedCoopTransferResult` type
- `destinationBank` always comes from mock (always "Coopcentral")

---

### 9. Page — Step 4: Result (`red-coopcentral/resultado/page.tsx`)

Clone `otros-bancos/resultado/page.tsx` with these changes:

| Aspect | otros-bancos | red-coopcentral |
|--------|--------------|-----------------|
| Component name | `ResultadoPage` | `RedCoopResultadoPage` |
| WelcomeBar title | `"A Otros Bancos"` | `"Cuentas de mi Red Coopcentral"` |
| Breadcrumbs | `["Inicio", "Transferencias", "A Otros Bancos"]` | `["Inicio", "Transferencias", "Red Coopcentral"]` |
| Organism | `ExternalTransferResultCard` | `RedCoopTransferResultCard` |
| Result type | `ExternalTransferResult` | `RedCoopTransferResult` |
| Steps | `EXTERNAL_TRANSFER_STEPS` | `RED_COOP_TRANSFER_STEPS` |
| SessionStorage result key | `"externalTransferResult"` | `"redCoopTransferResult"` |
| Redirect route | `"/transferencias/externas/otros-bancos"` | `"/transferencias/externas/red-coopcentral"` |
| New transaction route | `"/transferencias/externas/otros-bancos"` | `"/transferencias/externas/red-coopcentral"` |
| Finish route | `"/home"` | `"/home"` |

**`clearSessionStorage` function** removes all 6 keys:
- `redCoopTransferSourceId`
- `redCoopTransferDestinationId`
- `redCoopTransferAmount`
- `redCoopTransferConcept`
- `redCoopTransferConfirmation`
- `redCoopTransferResult`

**Button layout**: Same 3 buttons for success (Imprimir/Guardar, Realizar otra transaccion, Finalizar), 2 for error (Reintentar, Volver al inicio). Same `flex flex-wrap justify-end gap-3` layout.

---

## Index Export Updates

### `src/organisms/index.ts`

Add these exports:

```typescript
export { RedCoopTransferDetailsCard } from "./RedCoopTransferDetailsCard";
export { RedCoopTransferConfirmationCard } from "./RedCoopTransferConfirmationCard";
export { RedCoopTransferResultCard } from "./RedCoopTransferResultCard";
```

### `src/mocks/index.ts`

Add these exports:

```typescript
export {
  mockRedCoopSourceAccounts,
  mockRedCoopDestinationAccounts,
  mockRedCoopUserData,
  mockRedCoopConfirmation,
  mockRedCoopResultSuccess,
  mockRedCoopResultError,
  RED_COOP_MOCK_VALID_CODE,
  RED_COOP_TRANSFER_STEPS,
} from "./mockRedCoopTransferData";
```

---

## SessionStorage Keys Reference

| Key | Set In | Read In | Cleared In |
|-----|--------|---------|------------|
| `redCoopTransferSourceId` | Step 1 | Steps 2, 3 | Step 4 |
| `redCoopTransferDestinationId` | Step 1 | Steps 2, 3 | Step 4 |
| `redCoopTransferAmount` | Step 1 | Steps 2, 3 | Step 4 |
| `redCoopTransferConcept` | Step 1 | Steps 2, 3 | Step 4 |
| `redCoopTransferConfirmation` | Step 2 | Step 3 | Step 4 |
| `redCoopTransferResult` | Step 3 | Step 4 | Step 4 |

---

## Route Structure

```
app/(authenticated)/transferencias/externas/
├── page.tsx                           # Flow selection (MODIFY: fix typo)
├── otros-bancos/                      # Existing — reference pattern
│   ├── page.tsx
│   ├── confirmacion/page.tsx
│   ├── sms/page.tsx
│   └── resultado/page.tsx
└── red-coopcentral/                   # NEW
    ├── page.tsx                       # Step 1: Details form
    ├── confirmacion/
    │   └── page.tsx                   # Step 2: Confirmation
    ├── sms/
    │   └── page.tsx                   # Step 3: SMS verification
    └── resultado/
        └── page.tsx                   # Step 4: Result
```

---

## Implementation Order

1. **Fix bugs** in `ExternasFlowGrid.tsx` and `externas/page.tsx`
2. **Create types** `src/types/redCoopTransfer.ts`
3. **Create mocks** `src/mocks/mockRedCoopTransferData.ts`
4. **Update mock index** `src/mocks/index.ts`
5. **Create organisms** (3 files) + update `src/organisms/index.ts`
6. **Create pages** (4 route files) in order: page → confirmacion → sms → resultado

---

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Source Account | Required | "Por favor selecciona una cuenta origen" |
| Destination Account | Required | "Por favor selecciona una cuenta destino" |
| Amount | Required, > 0 | "Por favor ingresa un valor a transferir" |
| Amount | ≤ source balance | "El valor supera el saldo disponible" |
| Concept | Optional, max 100 chars | "El concepto no puede exceder 100 caracteres" |
| SMS Code | Exactly 6 digits | "Por favor ingresa el codigo de 6 digitos" |

---

## Key Patterns to Follow

- All pages are `"use client"` components
- Use `useWelcomeBar()` context to set/clear welcome bar title on mount/unmount
- Use `useUIContext()` for `hideBalances` state
- Use `useState` with initializer function for SSR-safe sessionStorage reads (`typeof window === "undefined"` guard)
- Use `useEffect` for redirect guards when required data is missing
- Stepper uses `currentStep={5}` on result page to show all steps completed
- Back buttons use plain `<button>` with `text-sm font-medium text-brand-teal-dark hover:underline` class
- Primary actions use `<Button variant="primary">` from atoms
- All cards use `<Card className="space-y-6 p-8">`
- Amount input uses bottom border style, not boxed input
- Loading state shows "Cargando..." centered text
