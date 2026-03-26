# Feature 10c - Transferencias: Recargar con PSE

## Specification Document

**Version**: 1.0
**Status**: Ready for Implementation
**Related Feature**: 10-transferencias (parent)

---

## 1. Overview

This feature implements the "Recargar con PSE" (Recharge with PSE) transfer flow. Users can bring money from any external financial institution via PSE (Pagos Seguros en Línea) to their Coasmedas savings accounts through a 4-step flow: Details → Confirmation → PSE Redirect → Result.

### User Story

> As an associate, I want to recharge my Coasmedas savings accounts with funds from any external bank via PSE, so I can easily add money to my accounts without visiting a branch.

### Business Rules

1. Users can only recharge their own savings accounts (destination accounts)
2. Transfer amount must be greater than 0
3. PSE payment gateway handles the verification (no SMS verification in this flow)
4. Transaction cost is $0 for PSE recharges
5. The "SMS" step label is kept in the stepper for UI consistency, but actually performs PSE redirect

---

## 2. Route Structure

```
/transferencias/internas/recargar-pse              → Step 1: Details
/transferencias/internas/recargar-pse/confirmacion → Step 2: Confirmation
/transferencias/internas/recargar-pse/pse          → Step 3: PSE Loading/Redirect
/transferencias/internas/recargar-pse/resultado    → Step 4: Result
```

### Directory Structure

```
app/(authenticated)/transferencias/internas/recargar-pse/
├── page.tsx                 # Step 1: Details form
├── confirmacion/
│   └── page.tsx            # Step 2: Confirmation
├── pse/
│   └── page.tsx            # Step 3: PSE loading/redirect
└── resultado/
    └── page.tsx            # Step 4: Transaction result
```

---

## 3. Type Definitions

Create new types in `src/types/pseRecharge.ts`:

```typescript
/**
 * Destination account for PSE recharge
 */
export interface PSERechargeDestination {
  id: string;
  name: string; // e.g., "Cuenta de Ahorros"
  maskedNumber: string; // e.g., "***4428"
  balance: number; // Current balance
  accountType: string; // e.g., "Ahorros"
}

/**
 * Step 1: Recharge details form data
 */
export interface PSERechargeFormData {
  destinationAccountId: string;
  amount: number;
}

/**
 * Step 2: Confirmation display data
 */
export interface PSERechargeConfirmationData {
  holderName: string;
  documentNumber: string; // Masked: "CC 1.***.***234"
  productToRecharge: string; // e.g., "Cuenta de Ahorros (***4428)"
  amount: number;
  method: string; // "PSE"
}

/**
 * Step 4: Transaction result
 */
export interface PSERechargeResult {
  status: "success" | "error";
  productRecharged: string; // e.g., "Cuenta de Ahorros (****4428)"
  amountRecharged: number;
  method: string; // "PSE"
  transactionCost: number; // Typically 0
  transactionDate: string; // e.g., "1 de septiembre de 2025"
  transactionTime: string; // e.g., "7:21 pm"
  approvalNumber: string; // e.g., "150606"
  description: string; // e.g., "Recarga Exitosa" or error message
}

/**
 * Complete recharge flow state
 */
export interface PSERechargeFlowState {
  currentStep: 1 | 2 | 3 | 4;
  selectedDestination: PSERechargeDestination | null;
  formData: PSERechargeFormData | null;
  confirmationData: PSERechargeConfirmationData | null;
  transactionResult: PSERechargeResult | null;
  isLoading: boolean;
  error: string | null;
}
```

Update `src/types/index.ts` to export these types.

---

## 4. Mock Data

Create mock data in `src/mocks/mockPSERechargeData.ts`:

```typescript
import type {
  PSERechargeDestination,
  PSERechargeConfirmationData,
  PSERechargeResult,
} from "@/src/types/pseRecharge";

/**
 * Mock destination accounts with balance
 */
export const mockPSERechargeAccounts: PSERechargeDestination[] = [
  {
    id: "pse-dest-1",
    name: "Cuenta de Ahorros",
    maskedNumber: "***4428",
    balance: 8730500,
    accountType: "Ahorros",
  },
  {
    id: "pse-dest-2",
    name: "Cuenta de Ahorros",
    maskedNumber: "***5512",
    balance: 1250000,
    accountType: "Ahorros",
  },
];

/**
 * Mock user data for confirmation
 */
export const mockPSERechargeUserData = {
  holderName: "CAMILO ANDRES CRUZ",
  documentNumber: "CC 1.***.***234",
};

/**
 * Mock successful transaction result
 */
export const mockPSERechargeResultSuccess: PSERechargeResult = {
  status: "success",
  productRecharged: "Cuenta de Ahorros (****4428)",
  amountRecharged: 500000,
  method: "PSE",
  transactionCost: 0,
  transactionDate: "1 de septiembre de 2025",
  transactionTime: "7:21 pm",
  approvalNumber: "150606",
  description: "Recarga Exitosa",
};

/**
 * Mock error transaction result
 */
export const mockPSERechargeResultError: PSERechargeResult = {
  status: "error",
  productRecharged: "Cuenta de Ahorros (****4428)",
  amountRecharged: 0,
  method: "PSE",
  transactionCost: 0,
  transactionDate: "1 de septiembre de 2025",
  transactionTime: "7:22 pm",
  approvalNumber: "-",
  description: "Pago rechazado por el banco",
};
```

Update `src/mocks/index.ts` to export these mocks.

---

## 5. Components

### 5.1 New Organism: PSERechargeDetailsCard

Location: `src/organisms/PSERechargeDetailsCard.tsx`

The main form card for Step 1 containing destination account dropdown and amount input.

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

**Sections:**

1. **Header**
   - Title: "Recargar mis cuentas con PSE" (18px, Bold, navy `#1D4E8F`)
   - Description: "Trae dinero desde cualquier otra entidad financiera de forma facil y segura." (15px, Regular, black)

2. **Destination Account Selection**
   - Label: "A que producto quieres abonar?" (14px, Regular, black)
   - Select dropdown with account options
   - Format: "Cuenta de Ahorros (\*\*\*4428) - Saldo: $ 8.730.500"
   - Height: 44px, border radius: 6px, border: `#B1B1B1`

3. **Recharge Amount**
   - Label: "Que valor deseas recargar?" (14px, Regular, black)
   - Currency input with "$" prefix (21px, Bold, black)
   - Amount value right-aligned (21px, Bold, black)
   - Underline separator: `#B1B1B1`
   - Error display below (red, right-aligned)

### 5.2 New Organism: PSERechargeConfirmationCard

Location: `src/organisms/PSERechargeConfirmationCard.tsx`

Confirmation details card for Step 2.

```typescript
interface PSERechargeConfirmationCardProps {
  confirmationData: PSERechargeConfirmationData;
  hideBalances: boolean;
}
```

**Layout:**

- Header: "Confirmación de Pago" (18px, Bold, navy `#1D4E8F`)
- Description: "Por favor, verificar que los datos de la transaccion sean correctos antes de continuar." (15px, Light, black)
- Two-column label/value pairs:
  - Titular → CAMILO ANDRES CRUZ
  - Documento → CC 1.***.***234
  - ─────────────── (divider)
  - Producto a Recargar → Cuenta de Ahorros (\*\*\*4428)
  - Valor a Recargar → $ 500.000
  - Metodo → PSE (17px, Medium)

### 5.3 Reuse Organism: PSELoadingCard

Location: `src/organisms/PSELoadingCard.tsx` (existing)

Reuse the existing PSE loading card from the pagos feature for Step 3.

**Behavior:**

- Display message: "Redirigiendo al portal de PSE..."
- Show loading spinner
- Simulate PSE redirect (in development, auto-proceed after delay)

### 5.4 New Organism: PSERechargeResultCard

Location: `src/organisms/PSERechargeResultCard.tsx`

Transaction result card for Step 4.

```typescript
interface PSERechargeResultCardProps {
  result: PSERechargeResult;
  hideBalances: boolean;
  onPrint: () => void;
  onNewTransaction: () => void;
  onFinish: () => void;
}
```

**Sections:**

1. **Status Icon + Title** (centered)
   - Success: Green checkmark in teal circle (`#00AFA9`) + "Transaccion Exitosa" (22px, Bold, navy)
   - Error: Red X in red circle + "Transaccion Fallida"

2. **Recharge Details**
   - Producto Recargado → Cuenta de Ahorros (\*\*\*\*4428)
   - Valor Recargado → $ 500.000
   - Metodo → PSE (18px, Medium)
   - Costo de Transaccion → $ 0

3. **Transaction Metadata** (after divider)
   - Fecha de Transaccion → 1 de septiembre de 2025
   - Hora de Transaccion → 7:21 pm
   - Numero de Aprobacion → 150606
   - Descripcion → Recarga Exitosa (green `#00A44C` for success, red for error)

4. **Action Buttons** (3 buttons)
   - "Imprimir/Guardar" - Secondary outline button (left)
   - "Realizar otra transaccion" - Secondary outline button (center)
   - "Finalizar" - Primary blue button (right)

---

## 6. Page Implementations

### 6.1 Step 1: Details Page

Location: `app/(authenticated)/transferencias/internas/recargar-pse/page.tsx`

**Behavior:**

1. Set WelcomeBar with title "Recargar con PSE" and back href
2. Display breadcrumbs: Inicio / Transferencias / Recargar con PSE
3. Show Stepper at step 1 (labels: Detalle, Confirmación, SMS, Finalización)
4. Render `PSERechargeDetailsCard` form
5. Validate on submit:
   - Destination must be selected
   - Amount must be > 0
6. "Confirmar" button disabled until form is valid
   - Disabled state: background `#A6C4FF`
   - Enabled state: background `#007FFF`
7. Store selections in sessionStorage and navigate to confirmation

**Session Storage Keys:**

- `pseRechargeDestinationId`
- `pseRechargeAmount`

### 6.2 Step 2: Confirmation Page

Location: `app/(authenticated)/transferencias/internas/recargar-pse/confirmacion/page.tsx`

**Behavior:**

1. Read data from sessionStorage
2. If missing data, redirect back to step 1
3. Display breadcrumbs and Stepper at step 2
4. Render `PSERechargeConfirmationCard` with confirmation data
5. "Volver" link returns to step 1 (left-aligned, color `#004266`)
6. "Confirmar Pago" button navigates to PSE step (primary blue)

### 6.3 Step 3: PSE Loading Page

Location: `app/(authenticated)/transferencias/internas/recargar-pse/pse/page.tsx`

**Behavior:**

1. Read data from sessionStorage, redirect if missing
2. Display breadcrumbs and Stepper at step 3
3. Reuse existing `PSELoadingCard` organism
4. Display loading message: "Redirigiendo al portal de PSE..."
5. In development/mock mode:
   - Simulate delay (2-3 seconds)
   - Auto-navigate to result page with mock success/error
6. Store transaction result in sessionStorage
7. Navigate to result page

### 6.4 Step 4: Result Page

Location: `app/(authenticated)/transferencias/internas/recargar-pse/resultado/page.tsx`

**Behavior:**

1. Read transaction result from sessionStorage, redirect if missing
2. Display breadcrumbs and Stepper at step 4 (all complete)
3. Render `PSERechargeResultCard` with transaction result
4. Three action buttons:
   - "Imprimir/Guardar" (outline button) - print/download receipt
   - "Realizar otra transaccion" (outline button) - restart flow
   - "Finalizar" (primary button) - return to home
5. Clear sessionStorage on navigation away

---

## 7. Enable Flow Option

Update `src/organisms/InternasFlowGrid.tsx`:

Add or enable the "recargar-pse" option:

```typescript
{
  id: "recargar-pse",
  title: "Recargar con PSE",
  description: "Trae dinero desde cualquier otra entidad financiera.",
  href: "/transferencias/internas/recargar-pse",
  enabled: true,
},
```

---

## 8. Validation Rules

### Step 1: Details Form

| Field               | Rule                   | Error Message                              |
| ------------------- | ---------------------- | ------------------------------------------ |
| Destination Account | Required               | "Por favor selecciona una cuenta destino." |
| Amount              | Required, > 0          | "Por favor ingresa un valor valido."       |
| Amount              | Minimum limit (if any) | "El valor minimo de recarga es $ X."       |
| Amount              | Maximum limit (if any) | "El valor maximo de recarga es $ X."       |

### Button States

| Condition                         | Confirmar Button     |
| --------------------------------- | -------------------- |
| No account selected OR amount = 0 | Disabled (`#A6C4FF`) |
| Account selected AND amount > 0   | Enabled (`#007FFF`)  |

---

## 9. State Management

### Session Storage Keys

All prefixed with `pseRecharge` to avoid conflicts:

| Key                            | Type   | Description                     |
| ------------------------------ | ------ | ------------------------------- |
| `pseRechargeDestinationId`     | string | Selected destination account ID |
| `pseRechargeAmount`            | string | Recharge amount (as string)     |
| `pseRechargeTransactionResult` | JSON   | Transaction result object       |

### Flow Navigation

```
Step 1 → [Validate] → Store in sessionStorage → Step 2
Step 2 → [Confirm] → Step 3
Step 3 → [PSE Redirect/Simulate] → Generate result → Store result → Step 4
Step 4 → [Finalizar] → Clear sessionStorage → /home
       → [Otra transaccion] → Clear sessionStorage → Step 1
```

---

## 10. Component Exports

### New Components to Export

**Organisms** (`src/organisms/index.ts`):

```typescript
export { PSERechargeDetailsCard } from "./PSERechargeDetailsCard";
export { PSERechargeConfirmationCard } from "./PSERechargeConfirmationCard";
export { PSERechargeResultCard } from "./PSERechargeResultCard";
```

**Types** (`src/types/index.ts`):

```typescript
export type {
  PSERechargeDestination,
  PSERechargeFormData,
  PSERechargeConfirmationData,
  PSERechargeResult,
  PSERechargeFlowState,
} from "./pseRecharge";
```

**Mocks** (`src/mocks/index.ts`):

```typescript
export {
  mockPSERechargeAccounts,
  mockPSERechargeUserData,
  mockPSERechargeResultSuccess,
  mockPSERechargeResultError,
} from "./mockPSERechargeData";
```

---

## 11. Reusable Components

The following existing components should be reused:

| Component            | Location  | Usage                          |
| -------------------- | --------- | ------------------------------ |
| `Breadcrumbs`        | molecules | Page navigation trail          |
| `Stepper`            | molecules | 4-step progress indicator      |
| `HideBalancesToggle` | molecules | Balance visibility toggle      |
| `BackButton`         | atoms     | Back navigation arrow          |
| `PSELoadingCard`     | organisms | PSE redirect loading (Step 3)  |
| `Button`             | atoms     | Primary and secondary buttons  |
| `Card`               | atoms     | Container cards                |
| `Select`             | atoms     | Dropdown for account selection |
| `CurrencyInput`      | atoms     | Currency formatted input       |
| `Divider`            | atoms     | Horizontal separators          |
| `SuccessIcon`        | atoms     | Green checkmark icon           |
| `ErrorIcon`          | atoms     | Red X icon                     |

Reuse `TRANSFER_STEPS` from `mockTransferData.ts` as the stepper labels are identical (Detalle, Confirmación, SMS, Finalización).

---

## 12. Accessibility Requirements

1. **Form Labels**: All inputs must have associated labels with `htmlFor`/`id` attributes
2. **Select Input**: Must have proper `aria-label` and keyboard navigation
3. **Error Messages**: Associate with inputs via `aria-describedby`
4. **Focus Management**: Move focus to first error on validation failure
5. **Status Announcements**: Use `aria-live="polite"` for success/error states
6. **Keyboard Navigation**: All interactive elements must be keyboard accessible
7. **Loading State**: Announce "Redirigiendo al portal de PSE" to screen readers
8. **Disabled Buttons**: Use `aria-disabled` attribute when button is disabled

---

## 13. Implementation Checklist

### Phase 1: Types and Mocks

- [ ] Create `src/types/pseRecharge.ts`
- [ ] Update `src/types/index.ts`
- [ ] Create `src/mocks/mockPSERechargeData.ts`
- [ ] Update `src/mocks/index.ts`

### Phase 2: Organisms

- [ ] Create `PSERechargeDetailsCard` organism
- [ ] Create `PSERechargeConfirmationCard` organism
- [ ] Create `PSERechargeResultCard` organism
- [ ] Update `src/organisms/index.ts`

### Phase 3: Pages

- [ ] Create Step 1 page: `recargar-pse/page.tsx`
- [ ] Create Step 2 page: `recargar-pse/confirmacion/page.tsx`
- [ ] Create Step 3 page: `recargar-pse/pse/page.tsx`
- [ ] Create Step 4 page: `recargar-pse/resultado/page.tsx`

### Phase 4: Enable Flow

- [ ] Update `InternasFlowGrid.tsx` to add/enable the flow option

---

## 14. Testing Scenarios

### Happy Path

1. Select destination account from dropdown
2. Enter valid amount (> 0)
3. Click "Confirmar" button
4. Review confirmation details
5. Click "Confirmar Pago" button
6. Wait for PSE loading screen
7. View success result
8. Click "Finalizar" to return to home

### Validation Errors

1. No destination selected → Button disabled
2. Amount = 0 or empty → Button disabled
3. Amount below minimum (if applicable) → Error message
4. Amount above maximum (if applicable) → Error message

### PSE Flow Errors

1. PSE timeout → Display error message and allow retry
2. PSE payment declined → Show error result screen with reason
3. PSE connection error → Display error and option to retry

### Edge Cases

1. Navigate directly to step 2/3/4 without data → Redirect to step 1
2. Session timeout during PSE redirect → Handle gracefully
3. Balance hidden mode → Mask all currency values
4. User presses back during PSE loading → Should not break flow

---

## 15. Design References

| Step | Figma Node | Description                    |
| ---- | ---------- | ------------------------------ |
| 1    | `810-1074` | Recharge details form          |
| 2    | `810-1076` | Payment confirmation           |
| 3    | N/A        | Reuses existing PSELoadingCard |
| 4    | `810-1078` | Transaction result             |

Base URL: `https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=`

---

## 16. Key Differences from Other Transfer Flows

| Aspect              | Other Flows (10, 10a, 10b)   | PSE Recharge (10c)                  |
| ------------------- | ---------------------------- | ----------------------------------- |
| Verification        | SMS code verification        | PSE external redirect               |
| Source              | Internal accounts/cupos      | External bank via PSE               |
| Method shown        | N/A or internal              | "PSE"                               |
| Step 3 behavior     | Enter SMS code               | Loading + PSE redirect              |
| Source balance      | Debited from internal source | N/A (external source)               |
| Result labels       | Cuenta Origen/Destino        | Producto Recargado, Valor Recargado |
| New molecule needed | Varies                       | None (reuse existing)               |

---

## 17. Color Reference

| Color Name          | Hex Code  | Usage                                       |
| ------------------- | --------- | ------------------------------------------- |
| Primary Navy        | `#1D4E8F` | Section titles, outline buttons border/text |
| Primary Blue        | `#007FFF` | Primary buttons, stepper active             |
| Disabled Blue       | `#A6C4FF` | Disabled button background                  |
| Success Green       | `#00A44C` | Success message text (Recarga Exitosa)      |
| Teal (Success Icon) | `#00AFA9` | Success checkmark circle                    |
| Text Black          | `#111827` | Primary text                                |
| Gray Medium         | `#808284` | Inactive stepper numbers                    |
| Gray Lines          | `#E4E6EA` | Borders, dividers, inactive stepper         |
| Gray Border         | `#B1B1B1` | Input borders, underlines                   |
| Light Blue BG       | `#F0F9FF` | Main content area background                |
| Link Dark           | `#004266` | "Volver" link                               |
