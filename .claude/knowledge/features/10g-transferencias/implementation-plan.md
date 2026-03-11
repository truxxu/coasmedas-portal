# Feature 10g - Transferencias Externas: Red Coopcentral — Implementation Plan

## Overview

Implement the "Cuentas de mi Red Coopcentral" 4-step external transfer flow (`/transferencias/externas/red-coopcentral`), mirroring the existing `otros-bancos` pattern. Includes 3 pre-implementation bug fixes, 9 new files, and 4 file modifications.

---

## Step 1: Fix Existing Bugs (3 fixes)

Before creating any new files, fix typos in the existing externas flow that prevent navigation to the Red Coopcentral feature.

### 1a. Fix flow ID typo in ExternasFlowGrid

**File**: `src/organisms/ExternasFlowGrid.tsx` (line 27)

```diff
- id: "red-copcentral",
+ id: "red-coopcentral",
```

### 1b. Fix incorrect href in ExternasFlowGrid

**File**: `src/organisms/ExternasFlowGrid.tsx` (line 30)

```diff
- href: "/transferencias/externas/desde-cupos-rotativos",
+ href: "/transferencias/externas/red-coopcentral",
```

### 1c. Fix handler typo in externas page

**File**: `app/(authenticated)/transferencias/externas/page.tsx` (lines 26-27)

```diff
- } else if (flowId === "red-copcentral") {
-   router.push("/transferencias/externas/red-copcentral");
+ } else if (flowId === "red-coopcentral") {
+   router.push("/transferencias/externas/red-coopcentral");
```

---

## Step 2: Create TypeScript Types

**Create**: `src/types/redCoopTransfer.ts`

Define 5 interfaces:
- `RedCoopSourceAccount` — id, type, balance, maskedNumber
- `RedCoopDestinationAccount` — id, holderName, bankName (always "Coopcentral"), accountType, accountNumber, alias?
- `RedCoopTransferFormData` — sourceAccountId, destinationAccountId, amount, concept
- `RedCoopTransferConfirmationData` — holder info + destination info + amount/concept
- `RedCoopTransferResult` — status, transfer details, transaction metadata, errorMessage?

**Reference**: Copy structure from `src/types/externalTransfer.ts`, adapting field names per spec.

**Update**: `src/types/index.ts` (if exists) — add `export * from "./redCoopTransfer"`

---

## Step 3: Create Mock Data

**Create**: `src/mocks/mockRedCoopTransferData.ts`

Contents:
- `mockRedCoopSourceAccounts` — 1 savings account (balance: 8,730,500)
- `mockRedCoopDestinationAccounts` — 2 Coopcentral network accounts
- `mockRedCoopUserData` — holder name + masked document
- `mockRedCoopConfirmation` — sample confirmation data
- `mockRedCoopResultSuccess` — successful transfer result
- `mockRedCoopResultError` — failed transfer result
- `RED_COOP_MOCK_VALID_CODE` — "123456"
- `RED_COOP_TRANSFER_STEPS` — 4-step stepper config (Detalle, Confirmacion, SMS, Finalizacion)

**Reference**: Mirror `src/mocks/mockExternalTransferData.ts` structure.

---

## Step 4: Update Mock Index Exports

**Modify**: `src/mocks/index.ts`

Add exports for all mock data and constants from Step 3:
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

## Step 5: Create Organism — RedCoopTransferDetailsCard

**Create**: `src/organisms/RedCoopTransferDetailsCard.tsx`

**Clone from**: `src/organisms/ExternalTransferDetailsCard.tsx`

**Key differences from ExternalTransferDetailsCard**:

| Aspect | ExternalTransferDetailsCard | RedCoopTransferDetailsCard |
|--------|----------------------------|---------------------------|
| Card title | "Transferencias Externas" | "Transferencias a Cuentas de mi Red Coopcentral" |
| Card description | "Transfiere dinero a cuentas en otros bancos..." | "Envia dinero a otras cooperativas de la Red Coopcentral" |
| Source label | "De cual cuenta quieres transferir?" | "¿De cual cuenta quieres transferir?" |
| Destination label | "Cuenta destino" | "Cuenta destino / Codigo de producto" |
| Destination format | `${account.alias} (${account.bankName})` | `${account.holderName} - ${account.accountNumber}` |
| No-destination link | `/transferencias/inscribir-cuentas` | `/transferencias/externas/inscribir-cuentas` |
| Types | `ExternalTransfer*` | `RedCoop*` |

**Props**: sourceAccounts, destinationAccounts, selectedSourceId, selectedDestinationId, amount, concept, onChange handlers, hideBalances, error?

---

## Step 6: Create Organism — RedCoopTransferConfirmationCard

**Create**: `src/organisms/RedCoopTransferConfirmationCard.tsx`

**Clone from**: `src/organisms/ExternalTransferConfirmationCard.tsx`

**Key differences**:
- Card title: "Confirmacion de Pago" (vs "Confirmacion de Transferencia")
- Uses `RedCoopTransferConfirmationData` type

**Layout**: 3 sections separated by `<Divider />`:
1. Sender: Nombre Titular, Documento Titular, Producto a Debitar
2. Destination: Titular Destino, Banco Destino ("Coopcentral"), Tipo de Cuenta, Cuenta Destino
3. Transfer: Valor a Transferir (18px bold), Concepto (conditional)

**Props**: confirmationData, hideBalances

---

## Step 7: Create Organism — RedCoopTransferResultCard

**Create**: `src/organisms/RedCoopTransferResultCard.tsx`

**Clone from**: `src/organisms/ExternalTransferResultCard.tsx`

**Key differences**: Uses `RedCoopTransferResult` type only.

**Layout**: Same success/error states with icon SVGs, same detail rows:
- Success: 12 detail rows (Cuenta Origen, Banco Destino, Cuenta Destino, Valor, Concepto, Costo, divider, Fecha, Hora, Aprobacion, Descripcion)
- Error: Error icon + message + retry option

**Props**: result, hideBalances

---

## Step 8: Update Organism Index Exports

**Modify**: `src/organisms/index.ts`

Add 3 new exports:
```typescript
export { RedCoopTransferDetailsCard } from "./RedCoopTransferDetailsCard";
export { RedCoopTransferConfirmationCard } from "./RedCoopTransferConfirmationCard";
export { RedCoopTransferResultCard } from "./RedCoopTransferResultCard";
```

---

## Step 9: Create Page — Step 1 Details

**Create**: `app/(authenticated)/transferencias/externas/red-coopcentral/page.tsx`

**Clone from**: `app/(authenticated)/transferencias/externas/otros-bancos/page.tsx`

**Key changes**:
- Component name: `RedCoopcentalPage`
- WelcomeBar title: `"Cuentas de mi Red Coopcentral"`
- Breadcrumbs: `["Inicio", "Transferencias", "Red Coopcentral"]`
- Organism: `RedCoopTransferDetailsCard`
- Mock imports: `mockRedCoopSourceAccounts`, `mockRedCoopDestinationAccounts`
- Steps: `RED_COOP_TRANSFER_STEPS`
- SessionStorage prefix: `redCoopTransfer*`
- Confirm route: `/transferencias/externas/red-coopcentral/confirmacion`
- Back route: `/transferencias/externas`

**Validation**:
1. Source account required
2. Destination account required
3. Amount > 0
4. Amount ≤ source balance
5. Concept max 100 chars (optional)

**SessionStorage keys set**: `redCoopTransferSourceId`, `redCoopTransferDestinationId`, `redCoopTransferAmount`, `redCoopTransferConcept`

---

## Step 10: Create Page — Step 2 Confirmation

**Create**: `app/(authenticated)/transferencias/externas/red-coopcentral/confirmacion/page.tsx`

**Clone from**: `app/(authenticated)/transferencias/externas/otros-bancos/confirmacion/page.tsx`

**Key changes**:
- Component name: `RedCoopConfirmacionPage`
- WelcomeBar title: `"Cuentas de mi Red Coopcentral"`
- WelcomeBar backHref: `/transferencias/externas/red-coopcentral`
- Breadcrumbs: `["Inicio", "Transferencias", "Red Coopcentral"]`
- Organism: `RedCoopTransferConfirmationCard`
- Types: `RedCoopTransferConfirmationData`
- Mock imports: `mockRedCoopSourceAccounts`, `mockRedCoopDestinationAccounts`, `mockRedCoopUserData`
- Steps: `RED_COOP_TRANSFER_STEPS`
- SessionStorage prefix: `redCoopTransfer*`
- Next route: `/transferencias/externas/red-coopcentral/sms`
- Back route: `/transferencias/externas/red-coopcentral`
- Redirect (missing data): `/transferencias/externas/red-coopcentral`

**Note**: Destination bank always "Coopcentral". Destination lookup uses `holderName` (not `alias`). AccountType capitalized: `"ahorros" → "Ahorros"`.

**SessionStorage key set**: `redCoopTransferConfirmation` (stringified confirmation data)

---

## Step 11: Create Page — Step 3 SMS Verification

**Create**: `app/(authenticated)/transferencias/externas/red-coopcentral/sms/page.tsx`

**Clone from**: `app/(authenticated)/transferencias/externas/otros-bancos/sms/page.tsx`

**Key changes**:
- Component name: `RedCoopSMSPage`
- WelcomeBar title: `"Cuentas de mi Red Coopcentral"`
- WelcomeBar backHref: `/transferencias/externas/red-coopcentral/confirmacion`
- Breadcrumbs: `["Inicio", "Transferencias", "Red Coopcentral"]`
- Steps: `RED_COOP_TRANSFER_STEPS`
- Valid code: `RED_COOP_MOCK_VALID_CODE`
- Mock imports: `mockRedCoopSourceAccounts`, `mockRedCoopDestinationAccounts`
- Result type: `RedCoopTransferResult`
- SessionStorage prefix: `redCoopTransfer*`
- Confirmation check key: `redCoopTransferConfirmation`
- Success route: `/transferencias/externas/red-coopcentral/resultado`
- Back route: `/transferencias/externas/red-coopcentral/confirmacion`
- Redirect (missing data): `/transferencias/externas/red-coopcentral`

**`generateTransactionResult` function**: Same logic as otros-bancos but returns `RedCoopTransferResult`, uses RedCoop mock accounts, `destinationBank` always from mock (always "Coopcentral").

**SessionStorage key set**: `redCoopTransferResult` (stringified result data)

---

## Step 12: Create Page — Step 4 Result

**Create**: `app/(authenticated)/transferencias/externas/red-coopcentral/resultado/page.tsx`

**Clone from**: `app/(authenticated)/transferencias/externas/otros-bancos/resultado/page.tsx`

**Key changes**:
- Component name: `RedCoopResultadoPage`
- WelcomeBar title: `"Cuentas de mi Red Coopcentral"`
- Breadcrumbs: `["Inicio", "Transferencias", "Red Coopcentral"]`
- Organism: `RedCoopTransferResultCard`
- Result type: `RedCoopTransferResult`
- Steps: `RED_COOP_TRANSFER_STEPS`
- SessionStorage result key: `redCoopTransferResult`
- New transaction route: `/transferencias/externas/red-coopcentral`
- Finish route: `/home`
- Redirect (missing data): `/transferencias/externas/red-coopcentral`
- Stepper: `currentStep={5}` (all steps completed)

**`clearSessionStorage` function** removes 6 keys:
- `redCoopTransferSourceId`
- `redCoopTransferDestinationId`
- `redCoopTransferAmount`
- `redCoopTransferConcept`
- `redCoopTransferConfirmation`
- `redCoopTransferResult`

**Buttons**:
- Success: 3 buttons (Imprimir/Guardar, Realizar otra transaccion, Finalizar)
- Error: 2 buttons (Reintentar, Volver al inicio)

---

## Summary Checklist

| Step | Action | Files |
|------|--------|-------|
| 1 | Fix bugs | Modify 2 existing files (3 changes) |
| 2 | Create types | Create `src/types/redCoopTransfer.ts` |
| 3 | Create mocks | Create `src/mocks/mockRedCoopTransferData.ts` |
| 4 | Update mock index | Modify `src/mocks/index.ts` |
| 5 | Create details organism | Create `src/organisms/RedCoopTransferDetailsCard.tsx` |
| 6 | Create confirmation organism | Create `src/organisms/RedCoopTransferConfirmationCard.tsx` |
| 7 | Create result organism | Create `src/organisms/RedCoopTransferResultCard.tsx` |
| 8 | Update organism index | Modify `src/organisms/index.ts` |
| 9 | Create Step 1 page | Create `app/.../red-coopcentral/page.tsx` |
| 10 | Create Step 2 page | Create `app/.../red-coopcentral/confirmacion/page.tsx` |
| 11 | Create Step 3 page | Create `app/.../red-coopcentral/sms/page.tsx` |
| 12 | Create Step 4 page | Create `app/.../red-coopcentral/resultado/page.tsx` |

**Total**: 9 new files created, 4 existing files modified (3 bug fixes + 2 index updates)

---

## Key Patterns to Follow

- All pages are `"use client"` components
- `useWelcomeBar()` sets/clears welcome bar title on mount/unmount
- `useUIContext()` provides `hideBalances` state
- `useState` with initializer function for SSR-safe sessionStorage reads
- `useEffect` for redirect guards when required data is missing
- Stepper uses `currentStep={5}` on result page (all completed)
- Back buttons: `<button>` with `text-sm font-medium text-brand-teal-dark hover:underline`
- Primary actions: `<Button variant="primary">`
- Cards: `<Card className="space-y-6 p-8">`
- Amount input: bottom border style (not boxed)
