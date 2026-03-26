# Feature 10e - Transferencias: A Otros Bancos

## Specification Document

**Version**: 1.0
**Status**: Ready for Implementation
**Related Feature**: 10-transferencias (parent), 10d-transferencias (account registration)

---

## 1. Overview

This feature implements the "A Otros Bancos" (To Other Banks) transfer flow. Users can transfer money from their Coasmedas savings account to external bank accounts that have been previously registered through the "Inscribir Cuentas" feature (10d). This is a 4-step flow: Details → Confirmation → SMS Verification → Result.

### User Story

> As an associate, I want to transfer funds from my Coasmedas savings account to external bank accounts I've previously registered, so I can send money to family, pay rent, or manage funds across different financial institutions without visiting a branch.

### Business Rules

1. Users can only transfer from their Coasmedas savings accounts (source)
2. Users can only transfer to previously registered external accounts (destination)
3. Transfer amount cannot exceed the source account balance
4. Transfer amount must be greater than zero
5. All transfers require SMS verification for security
6. A transfer concept/description is required
7. If no external accounts are registered, prompt user to register accounts first
8. Transaction cost is displayed (currently $0)

---

## 2. Route Structure

```
/transferencias/otros-bancos              → Step 1: Details
/transferencias/otros-bancos/confirmacion → Step 2: Confirmation
/transferencias/otros-bancos/sms          → Step 3: SMS Verification
/transferencias/otros-bancos/resultado    → Step 4: Result
```

### Directory Structure

```
app/(authenticated)/transferencias/otros-bancos/
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

Create new types in `src/types/externalTransfer.ts`:

```typescript
/**
 * Source account for external transfer
 */
export interface ExternalTransferSourceAccount {
  id: string;
  type: string; // e.g., "Cuenta de Ahorros"
  balance: number; // Available balance
  maskedNumber: string; // e.g., "****4428"
}

/**
 * Destination account (from registered external accounts)
 */
export interface ExternalTransferDestinationAccount {
  id: string;
  alias: string; // User-defined alias e.g., "Cuenta Mama"
  bankName: string; // e.g., "Bancolombia"
  accountType: "ahorros" | "corriente";
  accountNumber: string; // e.g., "123-456789-01"
  holderName: string; // e.g., "MARIA GONZALEZ"
}

/**
 * Step 1: Transfer details form data
 */
export interface ExternalTransferFormData {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  concept: string;
}

/**
 * Step 2: Confirmation display data
 */
export interface ExternalTransferConfirmationData {
  // Holder (user) info
  holderName: string;
  holderDocument: string; // Masked: "CC 1.***.***. 231"
  sourceProduct: string; // e.g., "Cuenta de Ahorros"

  // Destination info
  destinationHolder: string; // e.g., "MARIA GONZALEZ"
  destinationBank: string; // e.g., "Bancolombia"
  destinationAccountType: string; // e.g., "Ahorros"
  destinationAccountNumber: string; // e.g., "123.-456789-01"

  // Transfer details
  amount: number;
  concept: string;
}

/**
 * Step 4: Transaction result
 */
export interface ExternalTransferResult {
  status: "success" | "error";

  // Transfer details
  sourceAccount: string;
  destinationBank: string;
  destinationAccountNumber: string;
  amountTransferred: number;
  concept: string;
  transactionCost: number;

  // Transaction metadata
  transactionDate: string; // e.g., "5 de Enero de 2025"
  transactionTime: string; // e.g., "03:02 p.m."
  approvalNumber: string; // e.g., "256606"
  description: string; // e.g., "Transferencia Exitosa"

  // Error info (if failed)
  errorMessage?: string;
}

/**
 * Complete transfer flow state
 */
export interface ExternalTransferFlowState {
  currentStep: 1 | 2 | 3 | 4;
  selectedSourceAccount: ExternalTransferSourceAccount | null;
  selectedDestinationAccount: ExternalTransferDestinationAccount | null;
  formData: ExternalTransferFormData | null;
  confirmationData: ExternalTransferConfirmationData | null;
  verificationCode: string;
  transactionResult: ExternalTransferResult | null;
  isLoading: boolean;
  error: string | null;
}
```

Update `src/types/index.ts` to export these types.

---

## 4. Mock Data

Create mock data in `src/mocks/mockExternalTransferData.ts`:

```typescript
import type {
  ExternalTransferSourceAccount,
  ExternalTransferDestinationAccount,
  ExternalTransferConfirmationData,
  ExternalTransferResult,
} from "@/src/types/externalTransfer";

/**
 * Mock source accounts (user's savings accounts)
 */
export const mockExternalTransferSourceAccounts: ExternalTransferSourceAccount[] =
  [
    {
      id: "savings-1",
      type: "Cuenta de Ahorros",
      balance: 8730500,
      maskedNumber: "****4428",
    },
  ];

/**
 * Mock destination accounts (from Inscribir Cuentas feature)
 */
export const mockExternalTransferDestinations: ExternalTransferDestinationAccount[] =
  [
    {
      id: "dest-1",
      alias: "Cuenta Mama",
      bankName: "Bancolombia",
      accountType: "ahorros",
      accountNumber: "123-456789-01",
      holderName: "MARIA GONZALEZ",
    },
    {
      id: "dest-2",
      alias: "Cuenta Arriendo",
      bankName: "Davivienda",
      accountType: "ahorros",
      accountNumber: "987-654321-00",
      holderName: "INMOBILIARIA XYZ",
    },
    {
      id: "dest-3",
      alias: "Restaurante Almuerzos",
      bankName: "BBVA",
      accountType: "corriente",
      accountNumber: "456-789012-34",
      holderName: "DANIELA ALVARADO",
    },
  ];

/**
 * Mock user data for confirmation
 */
export const mockExternalTransferUserData = {
  holderName: "CAMILO ANDRES CRUZ",
  holderDocument: "CC 1.***.***. 231",
};

/**
 * Mock confirmation data
 */
export const mockExternalTransferConfirmation: ExternalTransferConfirmationData =
  {
    holderName: "CAMILO ANDRES CRUZ",
    holderDocument: "CC 1.***.***. 231",
    sourceProduct: "Cuenta de Ahorros",
    destinationHolder: "MARIA GONZALEZ",
    destinationBank: "Bancolombia",
    destinationAccountType: "Ahorros",
    destinationAccountNumber: "123.-456789-01",
    amount: 500000,
    concept: "Vacaciones",
  };

/**
 * Mock successful transaction result
 */
export const mockExternalTransferResultSuccess: ExternalTransferResult = {
  status: "success",
  sourceAccount: "Cuenta de Ahorros",
  destinationBank: "Bancolombia",
  destinationAccountNumber: "123-456789-01",
  amountTransferred: 500000,
  concept: "Vacaciones",
  transactionCost: 0,
  transactionDate: "5 de Enero de 2025",
  transactionTime: "03:02 p.m.",
  approvalNumber: "256606",
  description: "Transferencia Exitosa",
};

/**
 * Mock error transaction result
 */
export const mockExternalTransferResultError: ExternalTransferResult = {
  status: "error",
  sourceAccount: "Cuenta de Ahorros",
  destinationBank: "Bancolombia",
  destinationAccountNumber: "123-456789-01",
  amountTransferred: 0,
  concept: "Vacaciones",
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
export const EXTERNAL_TRANSFER_MOCK_VALID_CODE = "123456";
```

Update `src/mocks/index.ts` to export these mocks.

---

## 5. Components

### 5.1 New Organism: ExternalTransferDetailsCard

Location: `src/organisms/ExternalTransferDetailsCard.tsx`

The main form card for Step 1 containing source account dropdown, destination account dropdown, amount input, and concept input.

```typescript
interface ExternalTransferDetailsCardProps {
  sourceAccounts: ExternalTransferSourceAccount[];
  destinationAccounts: ExternalTransferDestinationAccount[];
  selectedSourceId: string;
  selectedDestinationId: string;
  amount: string;
  concept: string;
  onSourceChange: (accountId: string) => void;
  onDestinationChange: (accountId: string) => void;
  onAmountChange: (amount: string) => void;
  onConceptChange: (concept: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  hideBalances: boolean;
  errors?: {
    sourceAccount?: string;
    destinationAccount?: string;
    amount?: string;
    concept?: string;
  };
  isValid: boolean;
}
```

**Sections:**

1. **Card Header**
   - Title: "Transferencias Externas" (18px, Bold, navy `#005066`)
   - Description: "Transfiere dinero a cuentas en otros bancos o entidades financieras." (14px, Regular, `#58585B`)

2. **Source Account Selection**
   - Label: "¿De cual cuenta quieres transferir?" (14px, Medium, `#111827`)
   - Select dropdown showing account type and balance
   - Format in dropdown: "Cuenta de Ahorros - Saldo: $ 8.730.500"

3. **Destination Account Selection**
   - Label: "Cuenta destino" (14px, Medium, `#111827`)
   - Select dropdown with registered external accounts
   - Placeholder: "Selecciona una cuenta inscrita..."
   - Options show alias with bank name: "Cuenta Mama (Bancolombia)"

4. **Transfer Amount**
   - Label: "¿Que valor deseas transferir?" (14px, Medium, `#111827`)
   - CurrencyInput with "$ " prefix
   - Right-aligned value with thousand separators
   - Validation error display below (red)

5. **Transfer Concept**
   - Label: "¿Cual es el concepto de la transaccion?" (14px, Medium, `#111827`)
   - Text input
   - Placeholder: "Descripcion de la transferencia" (gray `#727272`)

6. **Form Actions**
   - Back Link: "Volver" (navy `#004266`, left side)
   - Primary Button: "Confirmar" (blue `#00B8ED`, right side)
     - Disabled state: `#8FE6FF` (light blue)
     - Disabled when form is invalid

**Empty Destinations State:**
When no external accounts are registered, show:

- Message: "No tienes cuentas inscritas. Registra una cuenta para realizar transferencias."
- Link: "Inscribir cuenta" (links to `/transferencias/inscribir-cuentas`)

**Card Styling:**

- Background: White `#FFFFFF`
- Border radius: `16px`
- Padding: `24px`
- Shadow: `0 2px 8px rgba(0,0,0,0.08)`

### 5.2 New Organism: ExternalTransferConfirmationCard

Location: `src/organisms/ExternalTransferConfirmationCard.tsx`

Confirmation details card for Step 2.

```typescript
interface ExternalTransferConfirmationCardProps {
  confirmationData: ExternalTransferConfirmationData;
  hideBalances: boolean;
  onConfirm: () => void;
  onBack: () => void;
}
```

**Layout:**

1. **Card Header**
   - Title: "Confirmación de Transferencia" (18px, Bold, navy `#005066`)
   - Description: "Por favor, verifica que los datos de la transaccion sean correctos antes de continuar." (14px, Regular, `#58585B`)

2. **Holder Section** (rows with label/value)
   - Nombre Titular: → CAMILO ANDRES CRUZ
   - Documento Titular: → CC 1.**_._**. 231 (masked)
   - Producto a Debitar: → Cuenta de Ahorros
   - ─────────────── (divider)

3. **Destination Section**
   - Titular Destino: → MARIA GONZALEZ
   - Banco Destino: → Bancolombia
   - Tipo de Cuenta: → Ahorros
   - Cuenta Destino: → 123.-456789-01
   - ─────────────── (divider)

4. **Transfer Details Section**
   - Valor a Transferir: → $ 500.000 (larger font, 18px, bold)
   - Concepto: → Vacaciones

5. **Form Actions**
   - Back Link: "Volver" (navy `#004266`, left)
   - Primary Button: "Confirmar Pago" (blue `#00B8ED`, right)

**Row Styling:**

- Label: Light weight (`Ubuntu Light`), gray `#232323`, left aligned
- Value: Regular weight, black `#111827`, right aligned
- Amount value: Medium weight, 18px
- Divider lines: `1px solid #E4E6EA`
- Row spacing: `12px` vertical gap

### 5.3 New Organism: ExternalTransferResultCard

Location: `src/organisms/ExternalTransferResultCard.tsx`

Transaction result card for Step 4. Supports both success and error states.

```typescript
interface ExternalTransferResultCardProps {
  result: ExternalTransferResult;
  hideBalances: boolean;
  onPrint: () => void;
  onNewTransfer: () => void;
  onFinish: () => void;
}
```

**Success State Layout:**

1. **Status Header** (centered)
   - Success Icon: Large green checkmark in circle
     - Circle diameter: ~60px
     - Border: Green `#00A44C`
     - Checkmark: White on green background
   - Title: "Transaccion Exitosa" (22px, Bold, navy `#005066`)

2. **Transfer Details Section**
   - Cuenta Origen: → Cuenta de Ahorros
   - Banco Destino: → Bancolombia
   - Cuenta Destino: → 123-456789-01
   - Valor Transferido: → $ 500.000 (larger font, 18px, bold)
   - Concepto: → Vacaciones
   - Costo Transaccion: → $ 0
   - ─────────────── (divider)

3. **Transaction Metadata Section**
   - Fecha de Transaccion: → 5 de Enero de 2025
   - Hora de Transaccion: → 03:02 p.m.
   - Numero de Aprobacion: → 256606
   - Descripcion: → Transferencia Exitosa (green `#00A44C`, medium weight)

4. **Action Buttons** (horizontal layout)
   - Secondary: "Imprimir/Guardar" (outline, navy border `#005066`)
   - Secondary: "Realizar otra transaccion" (outline, navy border `#005066`)
   - Primary: "Finalizar" (blue `#00B8ED`)

**Error State Layout:**

1. **Status Header** (centered)
   - Error Icon: Red X in red circle
     - Circle diameter: ~60px
     - Color: Red `#FF0D00`
   - Title: "Transaccion Fallida" (22px, Bold, red `#FF0D00`)

2. **Error Message**
   - Display: `result.errorMessage`

3. **Action Buttons**
   - Secondary: "Reintentar" (outline)
   - Primary: "Volver al inicio" (blue)

**Button Styling:**

- Secondary buttons: White background, `1px solid #005066` border, navy text
- Primary button: `#00B8ED` background, white text
- All buttons: `6px` border radius, `shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]`
- Padding: `9px 28px`

---

## 6. Page Implementations

### 6.1 Step 1: Details Page

Location: `app/(authenticated)/transferencias/otros-bancos/page.tsx`

**Layout:**

```tsx
<div className="space-y-6">
  {/* Header Section */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <BackButton onClick={handleBack} />
      <h1 className="text-xl font-medium text-gray-800">A Otros Bancos</h1>
    </div>
    <Breadcrumbs items={breadcrumbItems} />
  </div>

  {/* Hide Balances Toggle */}
  <div className="flex justify-end">
    <HideBalancesToggle />
  </div>

  {/* Stepper */}
  <Stepper steps={EXTERNAL_TRANSFER_STEPS} currentStep={1} />

  {/* Details Form Card */}
  <ExternalTransferDetailsCard
    sourceAccounts={sourceAccounts}
    destinationAccounts={destinationAccounts}
    selectedSourceId={formState.sourceAccountId}
    selectedDestinationId={formState.destinationAccountId}
    amount={formState.amount}
    concept={formState.concept}
    onSourceChange={handleSourceChange}
    onDestinationChange={handleDestinationChange}
    onAmountChange={handleAmountChange}
    onConceptChange={handleConceptChange}
    onSubmit={handleSubmit}
    onBack={handleBack}
    hideBalances={hideBalances}
    errors={errors}
    isValid={isFormValid}
  />
</div>
```

**Breadcrumbs:**

```typescript
const breadcrumbItems = [
  { label: "Inicio", href: "/home" },
  { label: "Transferencias", href: "/transferencias/internas" },
  { label: "A Otros Bancos" },
];
```

**Stepper Configuration:**

```typescript
const EXTERNAL_TRANSFER_STEPS: StepperStep[] = [
  { id: 1, label: "Detalle" },
  { id: 2, label: "Confirmación" },
  { id: 3, label: "SMS" },
  { id: 4, label: "Finalización" },
];
```

**WelcomeBar Configuration:**

```typescript
useEffect(() => {
  setWelcomeBarConfig({
    title: "A Otros Bancos",
    backHref: "/transferencias/internas",
  });
}, []);
```

**Behavior:**

1. Load source accounts (user's savings accounts)
2. Load destination accounts (from registered external accounts)
3. If no destination accounts, show empty state with link to register
4. Validate form on change
5. On submit: Store data in sessionStorage, navigate to confirmation

**Session Storage Keys:**

- `externalTransferSourceId`
- `externalTransferDestinationId`
- `externalTransferAmount`
- `externalTransferConcept`

### 6.2 Step 2: Confirmation Page

Location: `app/(authenticated)/transferencias/otros-bancos/confirmacion/page.tsx`

**Behavior:**

1. Read data from sessionStorage
2. If missing data, redirect back to step 1
3. Build confirmation data from stored values
4. Display breadcrumbs and Stepper at step 2
5. Render `ExternalTransferConfirmationCard`
6. "Volver" link returns to step 1
7. "Confirmar Pago" button navigates to SMS step

### 6.3 Step 3: SMS Verification Page

Location: `app/(authenticated)/transferencias/otros-bancos/sms/page.tsx`

**Behavior:**

1. Read data from sessionStorage, redirect if missing
2. Display breadcrumbs and Stepper at step 3
3. Reuse existing `CodeInputCard` organism
4. 6-digit code input
5. Resend code functionality with countdown timer
6. Validate code on submit (mock: "123456")
7. On success: Generate result, store in sessionStorage, navigate to result page
8. On error: Show error message, allow retry

### 6.4 Step 4: Result Page

Location: `app/(authenticated)/transferencias/otros-bancos/resultado/page.tsx`

**Behavior:**

1. Read result data from sessionStorage, redirect if missing
2. Display breadcrumbs and Stepper at step 4 (all complete)
3. Render `ExternalTransferResultCard` with transaction result
4. Action buttons:
   - "Imprimir/Guardar" - Print or download PDF receipt
   - "Realizar otra transaccion" - Clear sessionStorage, navigate to step 1
   - "Finalizar" - Clear sessionStorage, navigate to home
5. Clear sessionStorage when leaving the page

---

## 7. Validation Rules

### Step 1: Details Form

| Field               | Rule             | Error Message                                        |
| ------------------- | ---------------- | ---------------------------------------------------- |
| Source Account      | Required         | "Por favor selecciona una cuenta origen."            |
| Destination Account | Required         | "Por favor selecciona una cuenta destino."           |
| Amount              | Required         | "Por favor ingresa un valor."                        |
| Amount              | > 0              | "El valor debe ser mayor a cero."                    |
| Amount              | ≤ source balance | "El valor supera el saldo disponible."               |
| Concept             | Required         | "Por favor ingresa el concepto de la transferencia." |
| Concept             | Max 100 chars    | "El concepto no puede exceder 100 caracteres."       |

### Step 3: SMS Verification

| Field | Rule               | Error Message                           |
| ----- | ------------------ | --------------------------------------- |
| Code  | Required, 6 digits | "Por favor ingresa el codigo completo." |
| Code  | Valid code         | "El codigo ingresado es incorrecto."    |

### Yup Validation Schema

```typescript
import * as yup from "yup";

export const externalTransferSchema = yup.object({
  sourceAccountId: yup
    .string()
    .required("Por favor selecciona una cuenta origen."),

  destinationAccountId: yup
    .string()
    .required("Por favor selecciona una cuenta destino."),

  amount: yup
    .number()
    .typeError("Por favor ingresa un valor valido.")
    .required("Por favor ingresa un valor.")
    .positive("El valor debe ser mayor a cero.")
    .test(
      "max-balance",
      "El valor supera el saldo disponible.",
      function (value) {
        const { sourceBalance } = this.options.context as {
          sourceBalance: number;
        };
        return value <= sourceBalance;
      },
    ),

  concept: yup
    .string()
    .required("Por favor ingresa el concepto de la transferencia.")
    .max(100, "El concepto no puede exceder 100 caracteres."),
});

export type ExternalTransferFormData = yup.InferType<
  typeof externalTransferSchema
>;
```

---

## 8. State Management

### Session Storage Keys

All prefixed with `externalTransfer` to avoid conflicts:

| Key                             | Type   | Description                                  |
| ------------------------------- | ------ | -------------------------------------------- |
| `externalTransferSourceId`      | string | Selected source account ID                   |
| `externalTransferDestinationId` | string | Selected destination account ID              |
| `externalTransferAmount`        | string | Transfer amount (as string for preservation) |
| `externalTransferConcept`       | string | Transfer concept/description                 |
| `externalTransferResult`        | JSON   | Transaction result object                    |

### Flow Navigation

```
Step 1 → [Validate] → Store in sessionStorage → Step 2
Step 2 → [Confirm] → Step 3
Step 3 → [Verify SMS] → Generate result → Store result → Step 4
Step 4 → [Finalizar] → Clear sessionStorage → /home
       → [Otra transaccion] → Clear sessionStorage → Step 1
```

---

## 9. Component Exports

### New Components to Export

**Organisms** (`src/organisms/index.ts`):

```typescript
export { ExternalTransferDetailsCard } from "./ExternalTransferDetailsCard";
export { ExternalTransferConfirmationCard } from "./ExternalTransferConfirmationCard";
export { ExternalTransferResultCard } from "./ExternalTransferResultCard";
```

**Types** (`src/types/index.ts`):

```typescript
export type {
  ExternalTransferSourceAccount,
  ExternalTransferDestinationAccount,
  ExternalTransferFormData,
  ExternalTransferConfirmationData,
  ExternalTransferResult,
  ExternalTransferFlowState,
} from "./externalTransfer";
```

**Mocks** (`src/mocks/index.ts`):

```typescript
export {
  mockExternalTransferSourceAccounts,
  mockExternalTransferDestinations,
  mockExternalTransferUserData,
  mockExternalTransferConfirmation,
  mockExternalTransferResultSuccess,
  mockExternalTransferResultError,
  EXTERNAL_TRANSFER_MOCK_VALID_CODE,
} from "./mockExternalTransferData";
```

---

## 10. Reusable Components

The following existing components should be reused:

| Component                | Location        | Usage                         |
| ------------------------ | --------------- | ----------------------------- |
| `BackButton`             | atoms           | Back navigation arrow         |
| `Breadcrumbs`            | molecules       | Page navigation trail         |
| `HideBalancesToggle`     | molecules       | Balance visibility toggle     |
| `Stepper`                | molecules       | 4-step progress indicator     |
| `CodeInputCard`          | organisms       | SMS verification (Step 3)     |
| `Card`                   | atoms           | Container cards               |
| `Button`                 | atoms           | Primary and secondary buttons |
| `Select` / `SelectField` | atoms/molecules | Dropdown selects              |
| `CurrencyInput`          | atoms           | Amount input                  |
| `Input`                  | atoms           | Text input for concept        |
| `Label`                  | atoms           | Form labels                   |
| `ErrorMessage`           | atoms           | Form validation errors        |
| `SuccessIcon`            | atoms           | Green checkmark icon          |
| `ErrorIcon`              | atoms           | Red X icon                    |
| `ConfirmationRow`        | molecules       | Label/value rows              |
| `Divider`                | atoms           | Horizontal separators         |

---

## 11. Accessibility Requirements

1. **Form Labels**: All inputs must have associated labels with `htmlFor`/`id` attributes
2. **Stepper**: Steps have proper `aria-current` for active step
3. **Error Messages**: Associate with inputs via `aria-describedby`
4. **Focus Management**: Move focus to first error on validation failure
5. **Status Announcements**: Use `aria-live="polite"` for success/error states
6. **Keyboard Navigation**: All interactive elements must be keyboard accessible
7. **Color Contrast**: Ensure text meets WCAG AA standards
8. **Status Icons**: Color not used as sole indicator (icons + text)

---

## 12. Implementation Checklist

### Phase 1: Types and Mocks

- [ ] Create `src/types/externalTransfer.ts`
- [ ] Update `src/types/index.ts`
- [ ] Create `src/mocks/mockExternalTransferData.ts`
- [ ] Update `src/mocks/index.ts`

### Phase 2: Organisms

- [ ] Create `ExternalTransferDetailsCard` organism
- [ ] Create `ExternalTransferConfirmationCard` organism
- [ ] Create `ExternalTransferResultCard` organism
- [ ] Update `src/organisms/index.ts`

### Phase 3: Pages

- [ ] Create Step 1 page: `otros-bancos/page.tsx`
- [ ] Create Step 2 page: `otros-bancos/confirmacion/page.tsx`
- [ ] Create Step 3 page: `otros-bancos/sms/page.tsx`
- [ ] Create Step 4 page: `otros-bancos/resultado/page.tsx`

### Phase 4: Navigation Integration

- [ ] Add menu item to sidebar (if needed)
- [ ] Add option to transfers landing page grid

---

## 13. Testing Scenarios

### Happy Path

1. Navigate to `/transferencias/otros-bancos`
2. Select source account (savings)
3. Select destination account (registered external account)
4. Enter valid amount within balance
5. Enter transfer concept
6. Click "Confirmar"
7. Review confirmation details
8. Click "Confirmar Pago"
9. Enter valid SMS code (123456)
10. View success result
11. Click "Finalizar" to return to home

### Validation Errors

1. No source account selected → Error message
2. No destination account selected → Error message
3. Amount = 0 → "El valor debe ser mayor a cero."
4. Amount exceeds balance → "El valor supera el saldo disponible."
5. Empty concept → Error message
6. Invalid SMS code → "El codigo ingresado es incorrecto."

### Edge Cases

1. No registered accounts → Show empty state with link to register
2. Navigate directly to step 2/3/4 without data → Redirect to step 1
3. Session timeout during flow → Handle gracefully
4. Balance hidden mode → Mask all currency values
5. Multiple source accounts → All shown in dropdown
6. "Realizar otra transaccion" → Resets form, returns to step 1

### Error States

1. SMS verification fails multiple times → Allow retry
2. Transfer fails → Show error result with retry option

---

## 14. Design References

| Step | Figma Node | Description                                    |
| ---- | ---------- | ---------------------------------------------- |
| 1    | `842-2`    | Details form with source/destination selection |
| 2    | `842-5`    | Confirmation card with transfer summary        |
| 3    | (existing) | SMS verification (reuse existing)              |
| 4    | `842-9`    | Success/error result card                      |

Base URL: `https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=`

---

## 15. Color Reference

| Color Name       | Hex Code  | Usage                           |
| ---------------- | --------- | ------------------------------- |
| Primary Navy     | `#005066` | Card titles, section titles     |
| Dark Navy        | `#004266` | "Volver" link text              |
| Primary Blue     | `#00B8ED` | Primary buttons, active stepper |
| Disabled Blue    | `#8FE6FF` | Disabled button state           |
| Text Black       | `#111827` | Primary text, values            |
| Gray High        | `#58585B` | Secondary text, descriptions    |
| Gray Label       | `#232323` | Confirmation row labels         |
| Gray Placeholder | `#727272` | Input placeholders              |
| Gray Border      | `#B1B1B1` | Input borders                   |
| Gray Divider     | `#E4E6EA` | Divider lines, pending stepper  |
| Success Green    | `#00A44C` | Success icon, description       |
| Error Red        | `#FF0D00` | Error icon, error messages      |
| White            | `#FFFFFF` | Backgrounds, button text        |

---

## 16. Related Features

- **10-transferencias**: Parent feature - Transfers main menu
- **10d-transferencias**: Account registration - Required for destination accounts
- **10a-transferencias**: Internal transfers flow selection
- **10b-transferencias**: Between my accounts transfer (Cupos Rotativos)
- **10c-transferencias**: Network transfers (Coopcentral)

The destination accounts for this feature come from the "Inscribir Cuentas" feature (10d). Users must have registered external accounts before they can use this transfer flow.

---

## 17. Notes

- **Dependency on 10d**: This feature requires the "Inscribir Cuentas" (10d) feature to be implemented first, as destination accounts come from registered external accounts
- **Empty State**: If user has no registered accounts, show helpful message with link to registration page
- **Transaction Cost**: Currently displayed as $0, but the field should be present for future changes
- **Print/Save**: Should generate a PDF receipt with transaction details
- **"Realizar otra transaccion"**: Clears form and returns to step 1, ready for new transfer
- **"Finalizar"**: Clears session data and navigates to home dashboard
- **Balance Masking**: When hideBalances is true, all currency amounts should show "$ \*\*\*\*"
- **Responsive Design**: Cards should stack vertically on mobile screens
- **Destination Dropdown**: Show both alias and bank name for clarity (e.g., "Cuenta Mama (Bancolombia)")
