# Feature 10c - Transferencias: Recargar con PSE

## Implementation Plan

**Version**: 1.0
**Status**: Ready for Implementation
**Estimated Steps**: 15

---

## Phase 1: Types and Mocks (Foundation)

### Step 1: Create Type Definitions

**File**: `src/types/pseRecharge.ts`

Create TypeScript interfaces for the PSE recharge flow:

```typescript
// Types to create:
// - PSERechargeDestination (destination account with balance)
// - PSERechargeFormData (form data for step 1)
// - PSERechargeConfirmationData (confirmation display data)
// - PSERechargeResult (transaction result)
// - PSERechargeFlowState (complete flow state)
```

**Details**:

- Follow existing pattern from `src/types/transfer.ts`
- PSERechargeDestination: id, name, maskedNumber, balance, accountType
- PSERechargeResult: status, productRecharged, amountRecharged, method ("PSE"), transactionCost, transactionDate, transactionTime, approvalNumber, description

---

### Step 2: Update Types Index Export

**File**: `src/types/index.ts`

Add export for the new types:

```typescript
export type {
  PSERechargeDestination,
  PSERechargeFormData,
  PSERechargeConfirmationData,
  PSERechargeResult,
  PSERechargeFlowState,
} from "./pseRecharge";
```

---

### Step 3: Create Mock Data

**File**: `src/mocks/mockPSERechargeData.ts`

Create mock data following existing pattern from `mockTransferData.ts`:

```typescript
// Mocks to create:
// - mockPSERechargeAccounts (array of destination accounts)
// - mockPSERechargeUserData (holder name and masked document)
// - mockPSERechargeResultSuccess (successful transaction)
// - mockPSERechargeResultError (failed transaction)
```

**Mock Data**:

- 2 savings accounts with balances (***4428, ***5512)
- User: "CAMILO ANDRES CRUZ", document "CC 1.***.***234"
- Success result: approvalNumber "150606", description "Recarga Exitosa"
- Error result: description "Pago rechazado por el banco"

---

### Step 4: Update Mocks Index Export

**File**: `src/mocks/index.ts`

Add export for new mocks:

```typescript
export {
  mockPSERechargeAccounts,
  mockPSERechargeUserData,
  mockPSERechargeResultSuccess,
  mockPSERechargeResultError,
} from "./mockPSERechargeData";
```

---

## Phase 2: Organisms (Components)

### Step 5: Create PSERechargeDetailsCard

**File**: `src/organisms/PSERechargeDetailsCard.tsx`

Main form card for Step 1 - destination account dropdown and amount input.

**Props Interface**:

```typescript
interface PSERechargeDetailsCardProps {
  destinations: PSERechargeDestination[];
  selectedDestinationId: string;
  amount: string;
  onDestinationChange: (accountId: string) => void;
  onAmountChange: (amount: string) => void;
  hideBalances: boolean;
  error?: string;
}
```

**Layout**:

1. Title: "Recargar mis cuentas con PSE" (18px, Bold, navy)
2. Description: "Trae dinero desde cualquier otra entidad financiera de forma facil y segura."
3. Destination select: "A que producto quieres abonar?" + dropdown
   - Format: "Cuenta de Ahorros (\*\*\*4428) - Saldo: $ 8.730.500"
4. Amount input: "Que valor deseas recargar?" + currency input
   - "$" prefix left-aligned, amount right-aligned
   - Underline border style (not full border)
5. Error display at bottom

**Styling**:

- Card with p-8 padding
- Select: h-11, border-brand-footer-text, rounded-md
- Amount: text-[19px] font-medium, underline border

---

### Step 6: Create PSERechargeConfirmationCard

**File**: `src/organisms/PSERechargeConfirmationCard.tsx`

Confirmation details card for Step 2.

**Props Interface**:

```typescript
interface PSERechargeConfirmationCardProps {
  confirmationData: PSERechargeConfirmationData;
  hideBalances: boolean;
}
```

**Layout**:

1. Title: "Confirmación de Pago" (18px, Bold, navy)
2. Description: "Por favor, verificar que los datos de la transaccion sean correctos antes de continuar."
3. Two-column label/value pairs:
   - Titular → [holder name]
   - Documento → [masked document]
   - [Divider]
   - Producto a Recargar → [account name (***number)]
   - Valor a Recargar → [formatted amount]
   - Metodo → PSE (17px, Medium)

**Reuse**:

- `Card` atom for container
- `Divider` atom for separator

---

### Step 7: Create PSERechargeResultCard

**File**: `src/organisms/PSERechargeResultCard.tsx`

Transaction result card for Step 4.

**Props Interface**:

```typescript
interface PSERechargeResultCardProps {
  result: PSERechargeResult;
  hideBalances: boolean;
  onPrint: () => void;
  onNewTransaction: () => void;
  onFinish: () => void;
}
```

**Layout**:

1. Status icon (centered): green checkmark for success, red X for error
2. Title: "Transaccion Exitosa" / "Transaccion Fallida"
3. Section 1 - Recharge info:
   - Producto Recargado → [account]
   - Valor Recargado → [amount]
   - Metodo → PSE (18px Medium)
   - Costo de Transaccion → $ 0
4. [Divider]
5. Section 2 - Transaction metadata:
   - Fecha de Transaccion → [date]
   - Hora de Transaccion → [time]
   - Numero de Aprobacion → [number]
   - Descripcion → [text] (green #00A44C for success)
6. Three action buttons (flex justify-between):
   - "Imprimir/Guardar" - Secondary outline
   - "Realizar otra transaccion" - Secondary outline
   - "Finalizar" - Primary blue

**Reference**: Similar structure to existing `TransferResultCard.tsx` but with PSE-specific fields

---

### Step 8: Update Organisms Index Export

**File**: `src/organisms/index.ts`

Add exports for new organisms:

```typescript
export { PSERechargeDetailsCard } from "./PSERechargeDetailsCard";
export { PSERechargeConfirmationCard } from "./PSERechargeConfirmationCard";
export { PSERechargeResultCard } from "./PSERechargeResultCard";
```

---

## Phase 3: Pages (Routes)

### Step 9: Create Step 1 Page (Details)

**File**: `app/(authenticated)/transferencias/internas/recargar-pse/page.tsx`

**Pattern**: Follow existing `entre-mis-cuentas/page.tsx`

**Behavior**:

1. Set WelcomeBar: title "Recargar con PSE", backHref "/transferencias/internas"
2. Breadcrumbs: "Inicio / Transferencias / Recargar con PSE"
3. Stepper at step 1 (reuse `TRANSFER_STEPS` from mocks)
4. Render `PSERechargeDetailsCard`
5. State: selectedDestinationId, amount, error
6. Validation:
   - Destination required
   - Amount > 0
7. Actions:
   - "Volver" link → /transferencias/internas
   - "Confirmar" button (disabled until valid) → save to sessionStorage → navigate to confirmation

**Session Storage Keys**:

- `pseRechargeDestinationId`
- `pseRechargeAmount`

---

### Step 10: Create Step 2 Page (Confirmation)

**File**: `app/(authenticated)/transferencias/internas/recargar-pse/confirmacion/page.tsx`

**Pattern**: Follow existing `entre-mis-cuentas/confirmacion/page.tsx`

**Behavior**:

1. Read from sessionStorage (redirect to step 1 if missing)
2. Set WelcomeBar: same as step 1
3. Breadcrumbs: same as step 1
4. Stepper at step 2
5. Build confirmationData from sessionStorage + mock user data
6. Render `PSERechargeConfirmationCard`
7. Actions:
   - "Volver" link → back to step 1
   - "Confirmar Pago" button → navigate to PSE step

---

### Step 11: Create Step 3 Page (PSE Loading)

**File**: `app/(authenticated)/transferencias/internas/recargar-pse/pse/page.tsx`

**Pattern**: Similar to existing PSE flows in pagos feature

**Behavior**:

1. Read from sessionStorage (redirect if missing)
2. Set WelcomeBar
3. Breadcrumbs
4. Stepper at step 3
5. Reuse existing `PSELoadingCard` with message "Redirigiendo al portal de PSE..."
6. Simulation (mock mode):
   - useEffect with setTimeout (2-3 seconds)
   - Generate mock result (success or error based on flag/random)
   - Store result in sessionStorage key `pseRechargeTransactionResult`
   - Navigate to result page

**Note**: In production, this would redirect to actual PSE gateway and handle callback

---

### Step 12: Create Step 4 Page (Result)

**File**: `app/(authenticated)/transferencias/internas/recargar-pse/resultado/page.tsx`

**Pattern**: Follow existing `entre-mis-cuentas/resultado/page.tsx`

**Behavior**:

1. Read transaction result from sessionStorage (redirect if missing)
2. Set WelcomeBar
3. Breadcrumbs
4. Stepper at step 4 (all complete)
5. Render `PSERechargeResultCard`
6. Button handlers:
   - "Imprimir/Guardar" → window.print() or download receipt
   - "Realizar otra transaccion" → clear sessionStorage → navigate to step 1
   - "Finalizar" → clear sessionStorage → navigate to /home

**Cleanup**: Clear PSE recharge sessionStorage keys on unmount or navigation

---

## Phase 4: Enable Flow

### Step 13: Enable Flow in InternasFlowGrid

**File**: `src/organisms/InternasFlowGrid.tsx`

Update the "recargar-pse" option to enable it:

```typescript
{
  id: "recargar-pse",
  title: "Recargar con PSE",
  description: "Trae dinero desde otros bancos a tus cuentas Coasmedas.",
  href: "/transferencias/internas/recargar-pse",
  enabled: true,  // Change from false to true
},
```

---

### Step 14: Add Flow Handler (if needed)

**File**: `app/(authenticated)/transferencias/internas/page.tsx`

Verify the `handleSelectFlow` function routes correctly to the new flow. The existing pattern should work since `FlowOptionCard` uses `onSelectFlow(flow.id)` and navigation is handled via `router.push(flow.href)`.

If direct routing is needed, ensure:

```typescript
else if (flowId === "recargar-pse") {
  router.push("/transferencias/internas/recargar-pse");
}
```

---

## Phase 5: Testing & Verification

### Step 15: Manual Testing Checklist

**Happy Path**:

1. [ ] Navigate to /transferencias/internas
2. [ ] Click "Recargar con PSE" card
3. [ ] Select destination account from dropdown
4. [ ] Enter amount (e.g., 500000)
5. [ ] Click "Confirmar" button
6. [ ] Verify confirmation page displays correct data
7. [ ] Click "Confirmar Pago" button
8. [ ] Verify PSE loading screen appears
9. [ ] Wait for redirect to result page
10. [ ] Verify success result displays correctly
11. [ ] Test "Finalizar" button → navigates to home
12. [ ] Test "Realizar otra transaccion" → navigates to step 1

**Validation**:

1. [ ] Button disabled when no account selected
2. [ ] Button disabled when amount is 0 or empty
3. [ ] Error displays when validation fails

**Edge Cases**:

1. [ ] Direct navigation to step 2/3/4 without data → redirects to step 1
2. [ ] Hide balances toggle masks amounts correctly
3. [ ] Back button navigation works correctly

**Error State**:

1. [ ] Test with mock error result
2. [ ] Verify error icon and message display

---

## Directory Structure Summary

After implementation, the following files will exist:

```
src/
├── types/
│   ├── pseRecharge.ts            # NEW
│   └── index.ts                  # UPDATED
├── mocks/
│   ├── mockPSERechargeData.ts    # NEW
│   └── index.ts                  # UPDATED
└── organisms/
    ├── PSERechargeDetailsCard.tsx       # NEW
    ├── PSERechargeConfirmationCard.tsx  # NEW
    ├── PSERechargeResultCard.tsx        # NEW
    ├── InternasFlowGrid.tsx             # UPDATED (enable flag)
    └── index.ts                         # UPDATED

app/(authenticated)/transferencias/internas/
├── page.tsx                     # EXISTING (verify routing)
└── recargar-pse/                # NEW directory
    ├── page.tsx                 # Step 1: Details
    ├── confirmacion/
    │   └── page.tsx            # Step 2: Confirmation
    ├── pse/
    │   └── page.tsx            # Step 3: PSE Loading
    └── resultado/
        └── page.tsx            # Step 4: Result
```

---

## Components Reused

| Component          | Source    | Usage                     |
| ------------------ | --------- | ------------------------- |
| Card               | atoms     | Container cards           |
| Button             | atoms     | Primary/secondary buttons |
| Divider            | atoms     | Horizontal separators     |
| Breadcrumbs        | molecules | Navigation trail          |
| Stepper            | molecules | 4-step progress           |
| HideBalancesToggle | molecules | Balance visibility        |
| PSELoadingCard     | organisms | PSE redirect loading      |
| TRANSFER_STEPS     | mocks     | Stepper labels            |

---

## Session Storage Keys

| Key                            | Type   | Step | Description                     |
| ------------------------------ | ------ | ---- | ------------------------------- |
| `pseRechargeDestinationId`     | string | 1→2  | Selected destination account ID |
| `pseRechargeAmount`            | string | 1→2  | Recharge amount                 |
| `pseRechargeTransactionResult` | JSON   | 3→4  | Transaction result object       |

---

## Key Differences from Other Flows

| Aspect           | Entre mis cuentas (10)         | Recargar PSE (10c)                  |
| ---------------- | ------------------------------ | ----------------------------------- |
| Source selection | Yes (own accounts)             | No (external via PSE)               |
| Destination      | Products                       | Savings accounts only               |
| Step 3           | SMS verification               | PSE redirect                        |
| Method label     | N/A                            | "PSE"                               |
| Result labels    | Linea credito, Numero producto | Producto Recargado, Valor Recargado |

---

## Implementation Order

Execute steps in order (1-15). Each phase builds on the previous:

1. **Phase 1** (Steps 1-4): Foundation - types and mocks
2. **Phase 2** (Steps 5-8): Components - organisms
3. **Phase 3** (Steps 9-12): Pages - route implementation
4. **Phase 4** (Steps 13-14): Integration - enable flow
5. **Phase 5** (Step 15): Verification - testing

---

## Notes

- All text content in Spanish
- Follow existing patterns from `entre-mis-cuentas` flow
- Reuse `TRANSFER_STEPS` for stepper labels (SMS label kept for consistency)
- PSE step simulates redirect in development mode
- Transaction cost is always $0 for PSE recharges
