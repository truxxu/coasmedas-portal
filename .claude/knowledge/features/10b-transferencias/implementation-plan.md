# Feature 10b - Transferencias: Desde Cupos Rotativos

## Implementation Plan

**Version**: 1.0
**Status**: Ready for Implementation
**Estimated Files**: 10 new files, 4 file updates

---

## Phase 1: Types and Mocks

### Step 1.1: Create Type Definitions

**File**: `src/types/cupoRotativoTransfer.ts`

Create new type definitions for the cupo rotativo transfer flow:
- `CupoRotativo` - Revolving credit line product interface
- `CupoRotativoDestination` - Destination account interface
- `CupoRotativoTransferFormData` - Form data for step 1
- `CupoRotativoConfirmationData` - Confirmation display data
- `CupoRotativoTransferResult` - Transaction result (success/error)
- `CupoRotativoTransferFlowState` - Complete flow state

### Step 1.2: Export Types

**File**: `src/types/index.ts` (update)

Add export for the new types file:
```typescript
export * from './cupoRotativoTransfer';
```

### Step 1.3: Create Mock Data

**File**: `src/mocks/mockCupoRotativoData.ts`

Create mock data including:
- `mockCuposRotativos` - Array of cupo rotativo products
- `mockCupoRotativoDestinations` - Array of destination accounts
- `mockCupoRotativoUserData` - User holder name and masked document
- `mockCupoRotativoResultSuccess` - Successful transaction result
- `mockCupoRotativoResultError` - Failed transaction result
- `CUPO_ROTATIVO_MOCK_VALID_CODE` - Valid SMS code for testing ("123456")

### Step 1.4: Export Mocks

**File**: `src/mocks/index.ts` (update)

Add export for the new mocks file:
```typescript
export * from './mockCupoRotativoData';
```

---

## Phase 2: Molecule Component

### Step 2.1: Create CupoRotativoCard Molecule

**File**: `src/molecules/CupoRotativoCard.tsx`

Selectable card component with radio button styling for cupo selection.

**Props**:
- `cupo: CupoRotativo` - The cupo data
- `isSelected: boolean` - Whether this card is selected
- `onSelect: (id: string) => void` - Selection callback
- `hideBalances: boolean` - Whether to mask amounts

**Visual Elements**:
- Radio button indicator (left side)
- Product name: "Cupo Rotativo Personal" (bold, navy)
- Available amount: "Disponible: $ 2.000.000 de $ 5.000.000"
- Light gray border container with padding

### Step 2.2: Export Molecule

**File**: `src/molecules/index.ts` (update)

Add export:
```typescript
export { CupoRotativoCard } from "./CupoRotativoCard";
```

---

## Phase 3: Organism Components

### Step 3.1: Create CupoRotativoDetailsCard Organism

**File**: `src/organisms/CupoRotativoDetailsCard.tsx`

Main form card for Step 1 (Details).

**Props**:
- `cupos: CupoRotativo[]` - Available cupos
- `destinations: CupoRotativoDestination[]` - Destination accounts
- `selectedCupoId: string` - Currently selected cupo
- `selectedDestinationId: string` - Currently selected destination
- `amount: string` - Transfer amount
- `onCupoChange: (cupoId: string) => void`
- `onDestinationChange: (accountId: string) => void`
- `onAmountChange: (amount: string) => void`
- `hideBalances: boolean`
- `error?: string` - Validation error message

**Sections**:
1. Header with title and description
2. Cupo selection using `CupoRotativoCard` components
3. Destination account dropdown (`Select` atom)
4. Transfer amount input (`CurrencyInput` atom)
5. Captcha placeholder (`CaptchaPlaceholder` molecule)

### Step 3.2: Create CupoRotativoConfirmationCard Organism

**File**: `src/organisms/CupoRotativoConfirmationCard.tsx`

Confirmation details card for Step 2.

**Props**:
- `confirmationData: CupoRotativoConfirmationData`
- `hideBalances: boolean`

**Layout**:
- Header: "Confirmacion de Pago" with description
- Label/value pairs using `ConfirmationRow` or similar pattern:
  - Titular
  - Documento (masked)
  - Divider
  - Cupo Origen
  - Cuenta Destino
  - Divider
  - Valor a Transferir (larger font)

### Step 3.3: Create CupoRotativoResultCard Organism

**File**: `src/organisms/CupoRotativoResultCard.tsx`

Transaction result card for Step 4.

**Props**:
- `result: CupoRotativoTransferResult`
- `hideBalances: boolean`

**Sections**:
1. Status icon (success checkmark or error X)
2. Title: "Transaccion Exitosa" / "Transaccion Fallida"
3. Transfer details (source, destination, amount, cost)
4. Divider
5. Transaction metadata (date, time, approval number, description)

### Step 3.4: Export Organisms

**File**: `src/organisms/index.ts` (update)

Add exports:
```typescript
export { CupoRotativoDetailsCard } from "./CupoRotativoDetailsCard";
export { CupoRotativoConfirmationCard } from "./CupoRotativoConfirmationCard";
export { CupoRotativoResultCard } from "./CupoRotativoResultCard";
```

---

## Phase 4: Page Implementations

### Step 4.1: Create Step 1 Page (Details)

**File**: `app/(authenticated)/transferencias/internas/desde-cupos-rotativos/page.tsx`

**Behavior**:
1. Set WelcomeBar with title "Desde Cupos Rotativos" and backHref
2. Local state for: selectedCupoId, selectedDestinationId, amount, error
3. Display Breadcrumbs and Stepper at step 1
4. Render `CupoRotativoDetailsCard` with form handling
5. Validate on "Confirmar" click:
   - Cupo required
   - Destination required
   - Amount > 0
   - Amount <= selected cupo's availableAmount
6. Store in sessionStorage and navigate to confirmacion

**Session Storage Keys**:
- `cupoRotativoSelectedCupoId`
- `cupoRotativoDestinationId`
- `cupoRotativoAmount`

### Step 4.2: Create Step 2 Page (Confirmation)

**File**: `app/(authenticated)/transferencias/internas/desde-cupos-rotativos/confirmacion/page.tsx`

**Behavior**:
1. Read data from sessionStorage; redirect to step 1 if missing
2. Set WelcomeBar
3. Display Breadcrumbs and Stepper at step 2
4. Build confirmationData from stored values + mock user data
5. Render `CupoRotativoConfirmationCard`
6. "Volver" link returns to step 1
7. "Confirmar Pago" button navigates to sms step

### Step 4.3: Create Step 3 Page (SMS Verification)

**File**: `app/(authenticated)/transferencias/internas/desde-cupos-rotativos/sms/page.tsx`

**Behavior**:
1. Read data from sessionStorage; redirect if missing
2. Set WelcomeBar
3. Display Breadcrumbs and Stepper at step 3
4. Reuse existing `CodeInputCard` organism
5. Local state for code entry and error handling
6. Validate code on submit (mock valid code: "123456")
7. On success: generate result, store in sessionStorage, navigate to resultado
8. On error: display error message

### Step 4.4: Create Step 4 Page (Result)

**File**: `app/(authenticated)/transferencias/internas/desde-cupos-rotativos/resultado/page.tsx`

**Behavior**:
1. Read result from sessionStorage; redirect if missing
2. Set WelcomeBar
3. Display Breadcrumbs and Stepper at step 4 (all complete)
4. Render `CupoRotativoResultCard`
5. Three action buttons:
   - "Imprimir/Guardar" - Print/download (outline button)
   - "Realizar otra transaccion" - Clear storage, restart flow (outline)
   - "Finalizar" - Clear storage, navigate to home (primary)

---

## Phase 5: Enable Flow

### Step 5.1: Update InternasFlowGrid

**File**: `src/organisms/InternasFlowGrid.tsx` (update)

Change the "desde-cupos-rotativos" option from `enabled: false` to `enabled: true`:

```typescript
{
  id: "desde-cupos-rotativos",
  title: "Desde cupos rotativos",
  description: "Utiliza tus cupos de credito para transferir a tus cuentas.",
  href: "/transferencias/internas/desde-cupos-rotativos",
  enabled: true,  // Changed from false
},
```

---

## File Summary

### New Files (10)

| File | Type | Phase |
|------|------|-------|
| `src/types/cupoRotativoTransfer.ts` | Types | 1 |
| `src/mocks/mockCupoRotativoData.ts` | Mocks | 1 |
| `src/molecules/CupoRotativoCard.tsx` | Molecule | 2 |
| `src/organisms/CupoRotativoDetailsCard.tsx` | Organism | 3 |
| `src/organisms/CupoRotativoConfirmationCard.tsx` | Organism | 3 |
| `src/organisms/CupoRotativoResultCard.tsx` | Organism | 3 |
| `app/.../desde-cupos-rotativos/page.tsx` | Page | 4 |
| `app/.../desde-cupos-rotativos/confirmacion/page.tsx` | Page | 4 |
| `app/.../desde-cupos-rotativos/sms/page.tsx` | Page | 4 |
| `app/.../desde-cupos-rotativos/resultado/page.tsx` | Page | 4 |

### Updated Files (4)

| File | Change | Phase |
|------|--------|-------|
| `src/types/index.ts` | Add export | 1 |
| `src/mocks/index.ts` | Add export | 1 |
| `src/molecules/index.ts` | Add export | 2 |
| `src/organisms/index.ts` | Add exports | 3 |

---

## Reusable Components

### From Atoms
- `Button` - Primary/outline variants
- `Card` - Container cards
- `Select` - Dropdown for destination
- `CurrencyInput` - Amount input
- `Divider` - Horizontal separators
- `SuccessIcon` / `ErrorIcon` - Result status icons

### From Molecules
- `Breadcrumbs` - Navigation trail
- `Stepper` - Progress indicator (reuse `TRANSFER_STEPS`)
- `HideBalancesToggle` - Balance visibility
- `CaptchaPlaceholder` - Captcha placeholder
- `ConfirmationRow` - Label/value pairs

### From Organisms
- `CodeInputCard` - SMS verification (Step 3)

---

## Validation Rules

### Step 1: Details Form
| Field | Validation | Error Message |
|-------|------------|---------------|
| Cupo Rotativo | Required | "Por favor selecciona un cupo rotativo." |
| Destination | Required | "Por favor selecciona una cuenta destino." |
| Amount | Required, > 0 | "Por favor ingresa un valor valido." |
| Amount | <= available | "El valor supera el cupo disponible." |

### Step 3: SMS Verification
| Field | Validation | Error Message |
|-------|------------|---------------|
| Code | 6 digits required | "Por favor ingresa el codigo completo." |
| Code | Must match valid code | "El codigo ingresado es incorrecto." |

---

## Session Storage Keys

| Key | Type | Description |
|-----|------|-------------|
| `cupoRotativoSelectedCupoId` | string | Selected cupo rotativo ID |
| `cupoRotativoDestinationId` | string | Selected destination account ID |
| `cupoRotativoAmount` | string | Transfer amount (string format) |
| `cupoRotativoTransferResult` | JSON | Transaction result object |

---

## Testing Checklist

### Happy Path
- [ ] Select cupo rotativo
- [ ] Select destination account
- [ ] Enter valid amount (within available)
- [ ] Confirm details on step 2
- [ ] Enter valid SMS code (123456)
- [ ] View success result
- [ ] Click "Finalizar" returns to home

### Validation
- [ ] No cupo selected shows error
- [ ] No destination selected shows error
- [ ] Amount = 0 shows error
- [ ] Amount exceeds available shows "El valor supera el cupo disponible."
- [ ] Invalid SMS code shows error

### Navigation
- [ ] Direct navigation to step 2/3/4 without data redirects to step 1
- [ ] "Volver" links work correctly
- [ ] "Realizar otra transaccion" clears storage and restarts

### Balance Hiding
- [ ] Toggle hideBalances masks all currency values

---

## Design References

| Step | Figma Node | URL |
|------|------------|-----|
| 1 - Details | `810-128` | [View](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=810-128) |
| 2 - Confirmation | `810-126` | [View](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=810-126) |
| 3 - SMS | `810-709` | [View](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=810-709) |
| 4 - Result | `810-950` | [View](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=810-950) |
