# Feature 10b - Transferencias: Desde Cupos Rotativos

## Specification Document

**Version**: 1.0
**Status**: Ready for Implementation
**Related Feature**: 10-transferencias (parent)

---

## 1. Overview

This feature implements the "Desde Cupos Rotativos" (From Revolving Credit Lines) transfer flow. Users can transfer money from their revolving credit lines to their active savings accounts through a 4-step flow: Details → Confirmation → SMS Verification → Result.

### User Story

> As an associate with revolving credit lines, I want to transfer funds from my cupo rotativo to my savings accounts, so I can access credit when needed without visiting a branch.

### Business Rules

1. Users can only transfer to their own savings accounts (no third-party transfers)
2. Transfer amount cannot exceed the available credit on the selected cupo rotativo
3. All transfers require SMS verification for security
4. Transaction cost is $0 for internal transfers

---

## 2. Route Structure

```
/transferencias/internas/desde-cupos-rotativos              → Step 1: Details
/transferencias/internas/desde-cupos-rotativos/confirmacion → Step 2: Confirmation
/transferencias/internas/desde-cupos-rotativos/sms          → Step 3: SMS Verification
/transferencias/internas/desde-cupos-rotativos/resultado    → Step 4: Result
```

### Directory Structure

```
app/(authenticated)/transferencias/internas/desde-cupos-rotativos/
├── page.tsx                 # Step 1: Details form
├── confirmacion/
│   └── page.tsx            # Step 2: Confirmation
├── sms/
│   └── page.tsx            # Step 3: SMS verification
└── resultado/
    └── page.tsx            # Step 4: Transaction result
```

---

## 3. Type Definitions

Create new types in `src/types/cupoRotativoTransfer.ts`:

```typescript
/**
 * Cupo Rotativo (Revolving Credit Line) product
 */
export interface CupoRotativo {
  id: string;
  name: string;              // e.g., "Cupo Rotativo Personal"
  availableAmount: number;   // Available credit amount
  totalAmount: number;       // Total credit limit
}

/**
 * Destination account for cupo rotativo transfer
 */
export interface CupoRotativoDestination {
  id: string;
  name: string;              // e.g., "Cuenta de Ahorros"
  maskedNumber: string;      // e.g., "***4428"
  accountType: string;       // e.g., "Ahorros"
}

/**
 * Step 1: Transfer details form data
 */
export interface CupoRotativoTransferFormData {
  cupoRotativoId: string;
  destinationAccountId: string;
  amount: number;
}

/**
 * Step 2: Confirmation display data
 */
export interface CupoRotativoConfirmationData {
  holderName: string;
  documentNumber: string;     // Masked: "CC 1.***.***234"
  cupoOrigen: string;         // Selected cupo name
  cuentaDestino: string;      // Destination account display
  amount: number;
}

/**
 * Step 4: Transaction result
 */
export interface CupoRotativoTransferResult {
  status: "success" | "error";
  sourceAccount: string;
  destinationAccount: string;
  amountTransferred: number;
  transactionCost: number;
  transactionDate: string;
  transactionTime: string;
  approvalNumber: string;
  description: string;
}

/**
 * Complete transfer flow state
 */
export interface CupoRotativoTransferFlowState {
  currentStep: 1 | 2 | 3 | 4;
  selectedCupo: CupoRotativo | null;
  selectedDestination: CupoRotativoDestination | null;
  formData: CupoRotativoTransferFormData | null;
  confirmationData: CupoRotativoConfirmationData | null;
  verificationCode: string;
  transactionResult: CupoRotativoTransferResult | null;
  isLoading: boolean;
  error: string | null;
}
```

Update `src/types/index.ts` to export these types.

---

## 4. Mock Data

Create mock data in `src/mocks/mockCupoRotativoData.ts`:

```typescript
import type {
  CupoRotativo,
  CupoRotativoDestination,
  CupoRotativoConfirmationData,
  CupoRotativoTransferResult,
} from "@/src/types/cupoRotativoTransfer";

/**
 * Mock cupos rotativos
 */
export const mockCuposRotativos: CupoRotativo[] = [
  {
    id: "cr-1",
    name: "Cupo Rotativo Personal",
    availableAmount: 2000000,
    totalAmount: 5000000,
  },
  {
    id: "cr-2",
    name: "Cupo Rotativo Personal",
    availableAmount: 2000000,
    totalAmount: 5000000,
  },
];

/**
 * Mock destination accounts
 */
export const mockCupoRotativoDestinations: CupoRotativoDestination[] = [
  {
    id: "dest-1",
    name: "Cuenta de Ahorros",
    maskedNumber: "***4428",
    accountType: "Ahorros",
  },
  {
    id: "dest-2",
    name: "Cuenta de Ahorros",
    maskedNumber: "***7891",
    accountType: "Ahorros",
  },
];

/**
 * Mock user data for confirmation
 */
export const mockCupoRotativoUserData = {
  holderName: "CAMILO ANDRÉS CRUZ",
  documentNumber: "CC 1.***.***234",
};

/**
 * Mock successful transaction result
 */
export const mockCupoRotativoResultSuccess: CupoRotativoTransferResult = {
  status: "success",
  sourceAccount: "Cuenta de Ahorros",
  destinationAccount: "Cuenta de Ahorros (****4522)",
  amountTransferred: 1000000,
  transactionCost: 0,
  transactionDate: "1 de septiembre de 2025",
  transactionTime: "7:21 pm",
  approvalNumber: "250606",
  description: "Transferencia Exitosa",
};

/**
 * Mock error transaction result
 */
export const mockCupoRotativoResultError: CupoRotativoTransferResult = {
  status: "error",
  sourceAccount: "Cuenta de Ahorros",
  destinationAccount: "Cuenta de Ahorros (****4522)",
  amountTransferred: 0,
  transactionCost: 0,
  transactionDate: "1 de septiembre de 2025",
  transactionTime: "7:22 pm",
  approvalNumber: "-",
  description: "Cupo no disponible",
};

/**
 * Valid SMS code for testing
 */
export const CUPO_ROTATIVO_MOCK_VALID_CODE = "123456";
```

Update `src/mocks/index.ts` to export these mocks.

---

## 5. Components

### 5.1 New Molecule: CupoRotativoCard

Location: `src/molecules/CupoRotativoCard.tsx`

A selectable card component for cupo rotativo options with radio button styling.

```typescript
interface CupoRotativoCardProps {
  cupo: CupoRotativo;
  isSelected: boolean;
  onSelect: (id: string) => void;
  hideBalances: boolean;
}
```

**Visual Specification:**
- Container: White background, light gray border (`#E4E6EA`), 8px border-radius
- Padding: 16px
- Layout: Horizontal flex with radio button on left
- Radio button: 20px circle, blue (`#007FFF`) when selected, gray border when unselected
- Product name: 18px, Ubuntu Bold, navy (`#1D4E8F`)
- Available amount text: 14px, Ubuntu Regular, black
- Format: "Disponible: $ 2.000.000 de $ 5.000.000"

### 5.2 New Organism: CupoRotativoDetailsCard

Location: `src/organisms/CupoRotativoDetailsCard.tsx`

The main form card for Step 1 containing cupo selection, destination dropdown, amount input, and captcha placeholder.

```typescript
interface CupoRotativoDetailsCardProps {
  cupos: CupoRotativo[];
  destinations: CupoRotativoDestination[];
  selectedCupoId: string;
  selectedDestinationId: string;
  amount: string;
  onCupoChange: (cupoId: string) => void;
  onDestinationChange: (accountId: string) => void;
  onAmountChange: (amount: string) => void;
  hideBalances: boolean;
  error?: string;
}
```

**Sections:**
1. **Header**
   - Title: "Transferencias de cupos rotativos a mis cuentas" (18px, Bold, navy)
   - Description: "Utiliza tus cupos rotativos para transferir a tus cuentas activas." (15px, Regular)

2. **Cupo Selection**
   - Label: "Selecciona el cupo rotativo:"
   - Radio button list using `CupoRotativoCard` components

3. **Destination Account**
   - Label: "¿A qué cuenta quieres abonar?"
   - Select dropdown with masked account numbers

4. **Transfer Amount**
   - Label: "¿Qué valor deseas transferir?"
   - Currency input with "$ " prefix and formatted number
   - Validation error display below (red, right-aligned)

5. **Captcha Section**
   - Reuse existing `CaptchaPlaceholder` component

### 5.3 New Organism: CupoRotativoConfirmationCard

Location: `src/organisms/CupoRotativoConfirmationCard.tsx`

Confirmation details card for Step 2.

```typescript
interface CupoRotativoConfirmationCardProps {
  confirmationData: CupoRotativoConfirmationData;
  hideBalances: boolean;
}
```

**Layout:**
- Header: "Confirmación de Pago" (18px, Bold, navy)
- Description text below header
- Two-column label/value pairs:
  - Titular → CAMILO ANDRÉS CRUZ
  - Documento → CC 1.***.***234
  - ─────────────── (divider)
  - Cupo Origen → Cupo Rotativo Personal
  - Cuenta Destino → Cuenta de Ahorros (***4428)
  - ─────────────── (divider)
  - Valor a Transferir → $ 1.000.000 (larger font, 17px)

### 5.4 New Organism: CupoRotativoResultCard

Location: `src/organisms/CupoRotativoResultCard.tsx`

Transaction result card for Step 4. Can extend or adapt the existing `TransferResultCard` pattern.

```typescript
interface CupoRotativoResultCardProps {
  result: CupoRotativoTransferResult;
  hideBalances: boolean;
}
```

**Sections:**
1. **Status Icon + Title** (centered)
   - Success: Green checkmark in teal circle + "Transacción Exitosa"
   - Error: Red X in red circle + "Transacción Fallida"

2. **Transfer Details**
   - Cuenta Origen → value
   - Cuenta Destino → value
   - Valor Transferido → value (larger font)
   - Costo Transacción → $ 0

3. **Transaction Metadata** (after divider)
   - Fecha de Transacción → value
   - Hora de Transacción → value
   - Número de Aprobación → value
   - Descripción → value (green for success, red for error)

---

## 6. Page Implementations

### 6.1 Step 1: Details Page

Location: `app/(authenticated)/transferencias/internas/desde-cupos-rotativos/page.tsx`

**Behavior:**
1. Set WelcomeBar with title "Desde Cupos Rotativos" and back href
2. Display breadcrumbs: Inicio / Transferencias / Desde Cupos Rotativos
3. Show Stepper at step 1
4. Render `CupoRotativoDetailsCard` form
5. Validate on submit:
   - Cupo must be selected
   - Destination must be selected
   - Amount must be > 0
   - Amount must not exceed selected cupo's availableAmount
6. Store selections in sessionStorage and navigate to confirmation

**Session Storage Keys:**
- `cupoRotativoSelectedCupoId`
- `cupoRotativoDestinationId`
- `cupoRotativoAmount`

### 6.2 Step 2: Confirmation Page

Location: `app/(authenticated)/transferencias/internas/desde-cupos-rotativos/confirmacion/page.tsx`

**Behavior:**
1. Read data from sessionStorage
2. If missing data, redirect back to step 1
3. Display breadcrumbs and Stepper at step 2
4. Render `CupoRotativoConfirmationCard` with confirmation data
5. "Volver" link returns to step 1
6. "Confirmar Pago" button navigates to SMS step

### 6.3 Step 3: SMS Verification Page

Location: `app/(authenticated)/transferencias/internas/desde-cupos-rotativos/sms/page.tsx`

**Behavior:**
1. Read data from sessionStorage, redirect if missing
2. Display breadcrumbs and Stepper at step 3
3. Reuse existing `CodeInputCard` organism
4. 6-digit code input
5. Resend code functionality with countdown
6. Validate code on submit (mock: "123456")
7. On success, navigate to result page
8. On error, show error message

### 6.4 Step 4: Result Page

Location: `app/(authenticated)/transferencias/internas/desde-cupos-rotativos/resultado/page.tsx`

**Behavior:**
1. Read data from sessionStorage, redirect if missing
2. Display breadcrumbs and Stepper at step 4 (all complete)
3. Render `CupoRotativoResultCard` with transaction result
4. Three action buttons:
   - "Imprimir/Guardar" (outline button) - print/download receipt
   - "Realizar otra transacción" (outline button) - restart flow
   - "Finalizar" (primary button) - return to home
5. Clear sessionStorage on "Finalizar"

---

## 7. Enable Flow Option

Update `src/organisms/InternasFlowGrid.tsx`:

Change the "desde-cupos-rotativos" option from `enabled: false` to `enabled: true`:

```typescript
{
  id: "desde-cupos-rotativos",
  title: "Desde cupos rotativos",
  description: "Utiliza tus cupos de crédito para transferir a tus cuentas.",
  href: "/transferencias/internas/desde-cupos-rotativos",
  enabled: true,  // Changed from false
},
```

---

## 8. Validation Rules

### Step 1: Details Form

| Field | Rule | Error Message |
|-------|------|---------------|
| Cupo Rotativo | Required | "Por favor selecciona un cupo rotativo." |
| Destination Account | Required | "Por favor selecciona una cuenta destino." |
| Amount | Required, > 0 | "Por favor ingresa un valor válido." |
| Amount | ≤ available | "El valor supera el cupo disponible." |
| Captcha | Required (future) | "Por favor completa el captcha." |

### Step 3: SMS Verification

| Field | Rule | Error Message |
|-------|------|---------------|
| Code | Required, 6 digits | "Por favor ingresa el código completo." |
| Code | Valid code | "El código ingresado es incorrecto." |

---

## 9. State Management

### Session Storage Keys

All prefixed with `cupoRotativo` to avoid conflicts:

| Key | Type | Description |
|-----|------|-------------|
| `cupoRotativoSelectedCupoId` | string | Selected cupo rotativo ID |
| `cupoRotativoDestinationId` | string | Selected destination account ID |
| `cupoRotativoAmount` | string | Transfer amount (as string) |
| `cupoRotativoTransferResult` | JSON | Transaction result object |

### Flow Navigation

```
Step 1 → [Validate] → Store in sessionStorage → Step 2
Step 2 → [Confirm] → Step 3
Step 3 → [Verify SMS] → Generate result → Store result → Step 4
Step 4 → [Finalizar] → Clear sessionStorage → /home
       → [Otra transacción] → Clear sessionStorage → Step 1
```

---

## 10. Component Exports

### New Components to Export

**Molecules** (`src/molecules/index.ts`):
```typescript
export { CupoRotativoCard } from "./CupoRotativoCard";
```

**Organisms** (`src/organisms/index.ts`):
```typescript
export { CupoRotativoDetailsCard } from "./CupoRotativoDetailsCard";
export { CupoRotativoConfirmationCard } from "./CupoRotativoConfirmationCard";
export { CupoRotativoResultCard } from "./CupoRotativoResultCard";
```

**Types** (`src/types/index.ts`):
```typescript
export type {
  CupoRotativo,
  CupoRotativoDestination,
  CupoRotativoTransferFormData,
  CupoRotativoConfirmationData,
  CupoRotativoTransferResult,
  CupoRotativoTransferFlowState,
} from "./cupoRotativoTransfer";
```

**Mocks** (`src/mocks/index.ts`):
```typescript
export {
  mockCuposRotativos,
  mockCupoRotativoDestinations,
  mockCupoRotativoUserData,
  mockCupoRotativoResultSuccess,
  mockCupoRotativoResultError,
  CUPO_ROTATIVO_MOCK_VALID_CODE,
} from "./mockCupoRotativoData";
```

---

## 11. Reusable Components

The following existing components should be reused:

| Component | Location | Usage |
|-----------|----------|-------|
| `Breadcrumbs` | molecules | Page navigation trail |
| `Stepper` | molecules | 4-step progress indicator |
| `HideBalancesToggle` | molecules | Balance visibility toggle |
| `CodeInputCard` | organisms | SMS verification (Step 3) |
| `CaptchaPlaceholder` | molecules | Captcha placeholder |
| `Button` | atoms | Primary and secondary buttons |
| `Card` | atoms | Container cards |
| `Divider` | atoms | Horizontal separators |

Reuse `TRANSFER_STEPS` from `mockTransferData.ts` as the stepper labels are identical.

---

## 12. Accessibility Requirements

1. **Form Labels**: All inputs must have associated labels with `htmlFor`/`id` attributes
2. **Radio Group**: Use `role="radiogroup"` and `aria-labelledby` for cupo selection
3. **Error Messages**: Associate with inputs via `aria-describedby`
4. **Focus Management**: Move focus to first error on validation failure
5. **Status Announcements**: Use `aria-live="polite"` for success/error states
6. **Keyboard Navigation**: All interactive elements must be keyboard accessible

---

## 13. Implementation Checklist

### Phase 1: Types and Mocks
- [ ] Create `src/types/cupoRotativoTransfer.ts`
- [ ] Update `src/types/index.ts`
- [ ] Create `src/mocks/mockCupoRotativoData.ts`
- [ ] Update `src/mocks/index.ts`

### Phase 2: Molecules
- [ ] Create `CupoRotativoCard` molecule
- [ ] Update `src/molecules/index.ts`

### Phase 3: Organisms
- [ ] Create `CupoRotativoDetailsCard` organism
- [ ] Create `CupoRotativoConfirmationCard` organism
- [ ] Create `CupoRotativoResultCard` organism
- [ ] Update `src/organisms/index.ts`

### Phase 4: Pages
- [ ] Create Step 1 page: `desde-cupos-rotativos/page.tsx`
- [ ] Create Step 2 page: `desde-cupos-rotativos/confirmacion/page.tsx`
- [ ] Create Step 3 page: `desde-cupos-rotativos/sms/page.tsx`
- [ ] Create Step 4 page: `desde-cupos-rotativos/resultado/page.tsx`

### Phase 5: Enable Flow
- [ ] Update `InternasFlowGrid.tsx` to enable the flow option

---

## 14. Testing Scenarios

### Happy Path
1. Select cupo rotativo
2. Select destination account
3. Enter valid amount (within available)
4. Complete captcha (placeholder)
5. Confirm details
6. Enter valid SMS code (123456)
7. View success result
8. Click "Finalizar" to return to home

### Validation Errors
1. No cupo selected → Error message
2. No destination selected → Error message
3. Amount = 0 → Error message
4. Amount exceeds available → "El valor supera el cupo disponible."
5. Invalid SMS code → "El código ingresado es incorrecto."

### Edge Cases
1. Navigate directly to step 2/3/4 without data → Redirect to step 1
2. Session timeout during flow → Handle gracefully
3. Multiple cupos with same name → Distinguish by ID
4. Balance hidden mode → Mask all currency values

---

## 15. Design References

| Step | Figma Node | Description |
|------|------------|-------------|
| 1 | `810-128` | Details/Selection form |
| 2 | `810-126` | Confirmation card |
| 3 | `810-709` | SMS code input |
| 4 | `810-950` | Success/error result |

Base URL: `https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=`
