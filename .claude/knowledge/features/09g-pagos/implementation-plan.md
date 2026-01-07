# Feature 09g-pagos: Implementation Plan

## Overview

Implementation plan for the **Pago de Proteccion** (Protection Payment) feature - a 4-step wizard flow for paying insurance products like "Seguro de Vida" and "Poliza Exequial".

**Route Structure:**
```
/pagos/pagar-mis-productos/proteccion/detalle       → Step 1
/pagos/pagar-mis-productos/proteccion/confirmacion  → Step 2
/pagos/pagar-mis-productos/proteccion/codigo-sms    → Step 3
/pagos/pagar-mis-productos/proteccion/respuesta     → Step 4
```

---

## Reusable Components (Already Exist)

The following components can be reused from previous implementations:

| Component | Location | Usage |
|-----------|----------|-------|
| `CodeInputCard` | `src/organisms` | Step 3 SMS code entry |
| `CodeInputGroup` | `src/molecules` | 6-digit OTP input |
| `ConfirmationRow` | `src/molecules` | Label-value rows in confirmation/result |
| `Stepper` | `src/molecules` | 4-step progress indicator |
| `Breadcrumbs` | `src/molecules` | Navigation trail |
| `HideBalancesToggle` | `src/molecules` | Balance visibility |
| `Button` | `src/atoms` | Primary/secondary buttons |
| `Card` | `src/atoms` | Content cards |
| `Divider` | `src/atoms` | Section separators |
| `SuccessIcon` | `src/atoms` | Success checkmark icon |

---

## Implementation Steps

### Phase 1: Types (1 file)

#### Step 1.1: Create Protection Payment Types

**File:** `src/types/protection-payment.ts`

```typescript
/**
 * Source account for protection payment
 */
export interface ProtectionPaymentSourceAccount {
  id: string;
  type: 'ahorros' | 'corriente';
  accountNumber: string;
  maskedNumber: string;
  balance: number;
  displayName: string;
}

/**
 * Protection product status for payment
 */
export type ProtectionPaymentProductStatus = 'activo' | 'inactivo' | 'cancelado';

/**
 * Protection product for payment selection
 */
export interface ProtectionPaymentProduct {
  id: string;
  title: string;
  productNumber: string;     // "No******65-9"
  nextPaymentAmount: number;
  status: ProtectionPaymentProductStatus;
}

/**
 * Step 1 - Payment details form data
 */
export interface ProtectionPaymentDetailsFormData {
  sourceAccountId: string;
  sourceAccountDisplay: string;
  selectedProduct: ProtectionPaymentProduct | null;
}

/**
 * Step 2 - Confirmation data
 */
export interface ProtectionPaymentConfirmationData {
  holderName: string;
  holderDocument: string;
  productToPay: string;
  policyNumber: string;
  productToDebit: string;
  amountToPay: number;
}

/**
 * Step 4 - Transaction result
 */
export interface ProtectionPaymentResultData {
  success: boolean;
  creditLine: string;
  productNumber: string;
  amountPaid: number;
  transactionCost: number;
  transmissionDate: string;
  transactionTime: string;
  approvalNumber: string;
  description: string;
}
```

#### Step 1.2: Update Types Index

**File:** `src/types/index.ts`

Add export:
```typescript
export * from './protection-payment';
```

---

### Phase 2: Mock Data (1 file)

#### Step 2.1: Create Protection Payment Mock Data

**File:** `src/mocks/mockProtectionPaymentData.ts`

```typescript
import {
  ProtectionPaymentSourceAccount,
  ProtectionPaymentProduct,
  ProtectionPaymentResultData,
} from '@/src/types/protection-payment';

export const PROTECTION_PAYMENT_STEPS = [
  { number: 1, label: 'Detalle' },
  { number: 2, label: 'Confirmacion' },
  { number: 3, label: 'SMS' },
  { number: 4, label: 'Finalizacion' },
];

export const mockProtectionSourceAccounts: ProtectionPaymentSourceAccount[] = [
  {
    id: '1',
    type: 'ahorros',
    accountNumber: '12345678',
    maskedNumber: '***5678',
    balance: 8730500,
    displayName: 'Cuenta de Ahorros - Saldo: $ 8.730.500',
  },
  {
    id: '2',
    type: 'corriente',
    accountNumber: '87654321',
    maskedNumber: '***4321',
    balance: 2500000,
    displayName: 'Cuenta Corriente - Saldo: $ 2.500.000',
  },
];

export const mockProtectionPaymentProducts: ProtectionPaymentProduct[] = [
  {
    id: '1',
    title: 'Seguro de Vida Grupo Deudores',
    productNumber: 'No******65-9',
    nextPaymentAmount: 150000,
    status: 'activo',
  },
  {
    id: '2',
    title: 'Poliza Exequial Familiar',
    productNumber: 'No******12-3',
    nextPaymentAmount: 55000,
    status: 'activo',
  },
];

export const mockProtectionPaymentResult: ProtectionPaymentResultData = {
  success: true,
  creditLine: 'Seguro de Vida Grupo Deudores',
  productNumber: 'No******65-9',
  amountPaid: 150000,
  transactionCost: 0,
  transmissionDate: '3 de septiembre de 2025',
  transactionTime: '10:21 pm',
  approvalNumber: '463342',
  description: 'Exitosa',
};

export const mockProtectionPaymentResultError: ProtectionPaymentResultData = {
  success: false,
  creditLine: 'Seguro de Vida Grupo Deudores',
  productNumber: 'No******65-9',
  amountPaid: 0,
  transactionCost: 0,
  transmissionDate: '3 de septiembre de 2025',
  transactionTime: '10:21 pm',
  approvalNumber: '',
  description: 'Fondos insuficientes',
};

export const MOCK_PROTECTION_VALID_CODE = '123456';
```

#### Step 2.2: Update Mocks Index

**File:** `src/mocks/index.ts`

Add export:
```typescript
export * from './mockProtectionPaymentData';
```

---

### Phase 3: Molecules (1 new component)

#### Step 3.1: Create ProtectionPaymentCard

**File:** `src/molecules/ProtectionPaymentCard.tsx`

A selectable product card for Step 1 product selection. Key features:
- Shows product title, masked number, next payment amount, status
- Blue border (`#007FFF`) when selected, gray border (`#E4E6EA`) when not
- Payment amount in navy blue (`#194E8D`)
- Status colors: activo (green), inactivo (gray), cancelado (red)
- Clickable/selectable with keyboard support
- Supports `hideBalances` prop to mask amounts

**Props:**
```typescript
interface ProtectionPaymentCardProps {
  product: ProtectionPaymentProduct;
  isSelected: boolean;
  onSelect: (product: ProtectionPaymentProduct) => void;
  hideBalances?: boolean;
}
```

**Layout:**
```
┌─────────────────────────────────────┐
│ Seguro de Vida Grupo Deudores       │
│ Numero: No******65-9                │
│                                     │
│ Proximo Pago                        │
│ $ 150.000                           │
│                                     │
│ Activo                              │
└─────────────────────────────────────┘
```

#### Step 3.2: Update Molecules Index

**File:** `src/molecules/index.ts`

Add export:
```typescript
export { ProtectionPaymentCard } from './ProtectionPaymentCard';
```

---

### Phase 4: Organisms (3 new components)

#### Step 4.1: Create ProtectionPaymentDetailsCard

**File:** `src/organisms/ProtectionPaymentDetailsCard.tsx`

Step 1 form card with source account selection and product cards. Key features:
- Card title "Pago de Proteccion" in navy blue (`#194E8D`)
- Source account dropdown with "Necesitas mas saldo?" link
- Horizontal scrollable list of `ProtectionPaymentCard` components
- Helper text "Selecciona el producto que deseas pagar"
- "Volver" link and "Continuar" button

**Props:**
```typescript
interface ProtectionPaymentDetailsCardProps {
  sourceAccounts: ProtectionPaymentSourceAccount[];
  products: ProtectionPaymentProduct[];
  selectedAccountId: string;
  selectedProduct: ProtectionPaymentProduct | null;
  onAccountChange: (accountId: string) => void;
  onProductSelect: (product: ProtectionPaymentProduct) => void;
  onBack: () => void;
  onContinue: () => void;
  errors?: {
    sourceAccount?: string;
    product?: string;
  };
  isLoading?: boolean;
  hideBalances?: boolean;
}
```

#### Step 4.2: Create ProtectionPaymentConfirmationCard

**File:** `src/organisms/ProtectionPaymentConfirmationCard.tsx`

Step 2 confirmation card. Key features:
- Card title "Confirmacion de Pagos"
- Subtitle explaining verification
- Uses `ConfirmationRow` molecule for each field
- Divider separating user info from product info
- Fields: Titular, Documento, Producto a Pagar, Numero de Poliza, Producto a Debitar, Valor a Pagar
- "Volver" link and "Confirmar Pago" button

**Props:**
```typescript
interface ProtectionPaymentConfirmationCardProps {
  confirmation: ProtectionPaymentConfirmationData;
  onBack: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  hideBalances?: boolean;
}
```

#### Step 4.3: Create ProtectionPaymentResultCard

**File:** `src/organisms/ProtectionPaymentResultCard.tsx`

Step 4 transaction result card. Key features:
- Success/error icon (green checkmark or red X)
- Title "Transaccion Exitosa" or "Transaccion Fallida"
- Uses `ConfirmationRow` for transaction details
- Fields: Linea credito, Numero de producto, Valor pagado, Costo Transaccion, Fecha, Hora, Numero Aprobacion, Descripcion
- "Imprimir/Guardar" button and "Finalizar" button

**Props:**
```typescript
interface ProtectionPaymentResultCardProps {
  result: ProtectionPaymentResultData;
  onPrint: () => void;
  onFinish: () => void;
  hideBalances?: boolean;
}
```

#### Step 4.4: Update Organisms Index

**File:** `src/organisms/index.ts`

Add exports:
```typescript
export { ProtectionPaymentDetailsCard } from './ProtectionPaymentDetailsCard';
export { ProtectionPaymentConfirmationCard } from './ProtectionPaymentConfirmationCard';
export { ProtectionPaymentResultCard } from './ProtectionPaymentResultCard';
```

---

### Phase 5: Pages (4 pages)

#### Step 5.1: Create Step 1 Page (Detalle)

**File:** `app/(authenticated)/pagos/pagar-mis-productos/proteccion/detalle/page.tsx`

Payment details page with:
- WelcomeBar configuration
- Breadcrumbs: "Inicio / Pagos / Pagos de Proteccion"
- Stepper showing step 1 active
- `ProtectionPaymentDetailsCard` organism
- Form state management
- Validation (account + product required)
- sessionStorage to persist data
- Navigation to step 2 on success

**Key Logic:**
```typescript
// Validation
const validateForm = () => {
  const errors = {};
  if (!selectedAccountId) errors.sourceAccount = 'Selecciona una cuenta';
  if (!selectedProduct) errors.product = 'Selecciona un producto';
  return Object.keys(errors).length === 0;
};

// On continue
const handleContinue = () => {
  if (!validateForm()) return;
  sessionStorage.setItem('protectionPaymentDetails', JSON.stringify({
    sourceAccountId,
    sourceAccountDisplay,
    selectedProduct,
  }));
  router.push('/pagos/pagar-mis-productos/proteccion/confirmacion');
};
```

#### Step 5.2: Create Step 2 Page (Confirmacion)

**File:** `app/(authenticated)/pagos/pagar-mis-productos/proteccion/confirmacion/page.tsx`

Confirmation page with:
- WelcomeBar configuration
- Breadcrumbs
- Stepper showing steps 1-2 active
- `ProtectionPaymentConfirmationCard` organism
- Load data from sessionStorage
- Build confirmation data from details + mock user data
- Navigate to step 3 on confirm

**Key Logic:**
```typescript
// On mount - build confirmation from stored details
useEffect(() => {
  const detailsStr = sessionStorage.getItem('protectionPaymentDetails');
  if (!detailsStr) {
    router.push('/pagos/pagar-mis-productos/proteccion/detalle');
    return;
  }
  const details = JSON.parse(detailsStr);
  setConfirmation({
    holderName: 'CAMILO ANDRES CRUZ',
    holderDocument: 'CC 1.***.***234',
    productToPay: details.selectedProduct.title,
    policyNumber: details.selectedProduct.productNumber,
    productToDebit: details.sourceAccountDisplay.split(' - ')[0],
    amountToPay: details.selectedProduct.nextPaymentAmount,
  });
}, []);
```

#### Step 5.3: Create Step 3 Page (Codigo SMS)

**File:** `app/(authenticated)/pagos/pagar-mis-productos/proteccion/codigo-sms/page.tsx`

SMS code entry page with:
- WelcomeBar configuration
- Breadcrumbs
- Stepper showing steps 1-3 active
- **Reuse existing `CodeInputCard` organism**
- Resend functionality with cooldown timer
- Code validation (6 digits)
- Navigate to step 4 on valid code

**Key Logic:**
```typescript
// Reuse CodeInputCard
<CodeInputCard
  code={code}
  onCodeChange={handleCodeChange}
  hasError={!!error}
  errorMessage={error}
  onResend={handleResend}
  resendDisabled={isResendDisabled}
  resendCountdown={resendCountdown}
  disabled={isLoading}
/>

// Validate code
const handlePay = async () => {
  if (code.length !== 6) {
    setError('Ingresa el codigo de 6 digitos');
    return;
  }
  // Simulate API call
  if (code === MOCK_PROTECTION_VALID_CODE) {
    sessionStorage.setItem('protectionPaymentResult', JSON.stringify(mockProtectionPaymentResult));
    router.push('/pagos/pagar-mis-productos/proteccion/respuesta');
  } else {
    setError('Codigo incorrecto');
  }
};
```

#### Step 5.4: Create Step 4 Page (Respuesta)

**File:** `app/(authenticated)/pagos/pagar-mis-productos/proteccion/respuesta/page.tsx`

Transaction result page with:
- WelcomeBar configuration
- Breadcrumbs
- Stepper showing all 4 steps completed
- `ProtectionPaymentResultCard` organism
- Load result from sessionStorage
- Print functionality (window.print)
- Clear sessionStorage on finish
- Navigate to home on finish

**Key Logic:**
```typescript
// On finish - clear all session data
const handleFinish = () => {
  sessionStorage.removeItem('protectionPaymentDetails');
  sessionStorage.removeItem('protectionPaymentConfirmation');
  sessionStorage.removeItem('protectionPaymentResult');
  router.push('/home');
};

// Print
const handlePrint = () => {
  window.print();
};
```

---

## File Creation Order

Execute in this order to ensure dependencies are available:

| # | Phase | File | Action |
|---|-------|------|--------|
| 1 | Types | `src/types/protection-payment.ts` | CREATE |
| 2 | Types | `src/types/index.ts` | UPDATE (add export) |
| 3 | Mocks | `src/mocks/mockProtectionPaymentData.ts` | CREATE |
| 4 | Mocks | `src/mocks/index.ts` | UPDATE (add export) |
| 5 | Molecules | `src/molecules/ProtectionPaymentCard.tsx` | CREATE |
| 6 | Molecules | `src/molecules/index.ts` | UPDATE (add export) |
| 7 | Organisms | `src/organisms/ProtectionPaymentDetailsCard.tsx` | CREATE |
| 8 | Organisms | `src/organisms/ProtectionPaymentConfirmationCard.tsx` | CREATE |
| 9 | Organisms | `src/organisms/ProtectionPaymentResultCard.tsx` | CREATE |
| 10 | Organisms | `src/organisms/index.ts` | UPDATE (add exports) |
| 11 | Pages | `app/(authenticated)/pagos/pagar-mis-productos/proteccion/detalle/page.tsx` | CREATE |
| 12 | Pages | `app/(authenticated)/pagos/pagar-mis-productos/proteccion/confirmacion/page.tsx` | CREATE |
| 13 | Pages | `app/(authenticated)/pagos/pagar-mis-productos/proteccion/codigo-sms/page.tsx` | CREATE |
| 14 | Pages | `app/(authenticated)/pagos/pagar-mis-productos/proteccion/respuesta/page.tsx` | CREATE |

---

## Session Storage Keys

| Key | Content | Created | Cleared |
|-----|---------|---------|---------|
| `protectionPaymentDetails` | Form data from Step 1 | Step 1 | Step 4 |
| `protectionPaymentConfirmation` | Confirmation data | Step 2 | Step 4 |
| `protectionPaymentResult` | Transaction result | Step 3 | Step 4 |

---

## Navigation Flow

```
/pagos/pagar-mis-productos
    ↓ (user selects "Proteccion")
/pagos/pagar-mis-productos/proteccion/detalle (Step 1)
    ↓ Continuar (validates + stores data)
/pagos/pagar-mis-productos/proteccion/confirmacion (Step 2)
    ↓ Confirmar Pago (triggers SMS + stores confirmation)
/pagos/pagar-mis-productos/proteccion/codigo-sms (Step 3)
    ↓ Pagar (validates code + stores result)
/pagos/pagar-mis-productos/proteccion/respuesta (Step 4)
    ↓ Finalizar (clears storage)
/home
```

**Back Navigation:**
- Step 1 → `/pagos/pagar-mis-productos`
- Step 2 → Step 1 (preserves data)
- Step 3 → Step 2 (preserves data)
- Step 4 → No back (transaction completed) → Finalizar goes to `/home`

---

## Key Implementation Notes

### 1. Product Card Selection
Unlike utility payments (dropdowns), protection payment uses visual product cards:
- Only one card can be selected at a time
- Blue border indicates selection
- Cards are horizontally scrollable on mobile

### 2. Reuse Existing Components
- **Step 3 reuses `CodeInputCard`** - No need to create new SMS component
- **Confirmation rows reuse `ConfirmationRow`** - For consistent styling

### 3. Hide Balances Support
All monetary values should support the `hideBalances` toggle:
- Source account balance in dropdown
- Product next payment amount
- Confirmation "Valor a Pagar"
- Result "Valor pagado"

### 4. Validation
- Step 1: Both account and product must be selected
- Step 3: Code must be exactly 6 digits

### 5. Error Handling
- Missing sessionStorage data → Redirect to Step 1
- Invalid SMS code → Show error, allow retry
- Network errors → Show error message

---

## Testing Checklist

After implementation, verify:

- [ ] Step 1 renders with account dropdown and product cards
- [ ] Product cards are selectable (only one at a time)
- [ ] Selected card has blue border
- [ ] Validation errors show for empty fields
- [ ] Data persists through navigation
- [ ] Step 2 shows correct confirmation data
- [ ] Step 3 reuses `CodeInputCard` correctly
- [ ] Resend code functionality works with timer
- [ ] Valid code navigates to Step 4
- [ ] Invalid code shows error
- [ ] Step 4 shows success/failure appropriately
- [ ] Print button works
- [ ] Finish clears all session data
- [ ] Back navigation works correctly
- [ ] Hide balances toggle works on all pages
- [ ] Responsive design works on mobile

---

**Created:** 2026-01-07
**Status:** Ready for Implementation
