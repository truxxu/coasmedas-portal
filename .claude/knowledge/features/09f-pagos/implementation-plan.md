# Feature 09f-pagos: Implementation Plan

**Feature**: Pago Servicios Publicos Inscritos (Registered Utilities Payment)
**Version**: 1.0
**Status**: Ready for Implementation
**Last Updated**: 2026-01-07

---

## Overview

This implementation plan outlines the step-by-step approach to build the 4-step payment wizard for registered public utilities.

**Flow Summary:**
```
Step 1: Detalle (Payment Details) → Select account, service, enter amount
Step 2: Confirmacion (Confirmation) → Review payment details
Step 3: Codigo SMS (SMS Code) → Enter 6-digit OTP
Step 4: Respuesta (Response) → View transaction result
```

---

## Existing Components Analysis

### Components to REUSE (No Changes Needed)

| Component | Type | Location | Usage |
|-----------|------|----------|-------|
| `BackButton` | Atom | `src/atoms/BackButton.tsx` | Page navigation |
| `Button` | Atom | `src/atoms/Button.tsx` | Primary/secondary actions |
| `Card` | Atom | `src/atoms/Card.tsx` | Main content container |
| `Divider` | Atom | `src/atoms/Divider.tsx` | Section separators |
| `CurrencyInput` | Atom | `src/atoms/CurrencyInput.tsx` | Amount input field |
| `Select` | Atom | `src/atoms/Select.tsx` | Dropdown selects |
| `SuccessIcon` | Atom | `src/atoms/SuccessIcon.tsx` | Success header |
| `ErrorIcon` | Atom | `src/atoms/ErrorIcon.tsx` | Error header |
| `Breadcrumbs` | Molecule | `src/molecules/Breadcrumbs.tsx` | Navigation trail |
| `Stepper` | Molecule | `src/molecules/Stepper.tsx` | 4-step progress indicator |
| `HideBalancesToggle` | Molecule | `src/molecules/HideBalancesToggle.tsx` | Balance visibility |
| `CaptchaPlaceholder` | Molecule | `src/molecules/CaptchaPlaceholder.tsx` | Captcha placeholder |
| `ConfirmationRow` | Molecule | `src/molecules/ConfirmationRow.tsx` | Label-value rows |
| `CodeInputGroup` | Molecule | `src/molecules/CodeInputGroup.tsx` | 6-digit OTP input |
| `CodeInputCard` | Organism | `src/organisms/CodeInputCard.tsx` | Complete SMS code card |

### Components to CREATE

| Component | Type | Description |
|-----------|------|-------------|
| `UtilityPaymentDetailsForm` | Organism | Step 1 form with account/service/amount |
| `UtilityPaymentConfirmationCard` | Organism | Step 2 confirmation details |
| `UtilityPaymentResultCard` | Organism | Step 4 transaction result |

### Types to CREATE

| Type | File | Description |
|------|------|-------------|
| `SourceAccount` | `utility-payment.ts` | Source account for payment |
| `RegisteredService` | `utility-payment.ts` | Registered utility service |
| `UtilityPaymentDetails` | `utility-payment.ts` | Step 1 form data |
| `UtilityPaymentConfirmation` | `utility-payment.ts` | Step 2 confirmation data |
| `UtilityPaymentResult` | `utility-payment.ts` | Step 4 transaction result |

### Mock Data to CREATE

| Export | File | Description |
|--------|------|-------------|
| `mockSourceAccounts` | `mockUtilityPaymentData.ts` | Source account options |
| `mockRegisteredServices` | `mockUtilityPaymentData.ts` | Registered services list |
| `mockUtilityPaymentResult` | `mockUtilityPaymentData.ts` | Transaction result mock |
| `UTILITY_PAYMENT_STEPS` | `mockUtilityPaymentData.ts` | Stepper configuration |
| `MOCK_VALID_CODE` | `mockUtilityPaymentData.ts` | Valid OTP code for testing |

---

## Implementation Phases

### Phase 1: Types Definition

**Files to create:**
- `src/types/utility-payment.ts`

**Implementation:**

```typescript
// src/types/utility-payment.ts

/**
 * Source account for utility payment
 */
export interface SourceAccount {
  id: string;
  type: 'ahorros' | 'corriente';
  accountNumber: string;
  maskedNumber: string;
  balance: number;
  displayName: string;
}

/**
 * Registered utility service (from 09e registration)
 */
export interface RegisteredService {
  id: string;
  alias: string;
  provider: string;
  serviceType: string;
  reference: string;
  displayName: string;
}

/**
 * Step 1 - Payment details form data
 */
export interface UtilityPaymentDetails {
  sourceAccountId: string;
  sourceAccountDisplay: string;
  serviceId: string;
  serviceDisplay: string;
  serviceType: string;
  amount: number;
}

/**
 * Step 2 - Confirmation data (derived from step 1 + user context)
 */
export interface UtilityPaymentConfirmation {
  holderName: string;
  holderDocument: string;
  serviceToPay: string;
  invoiceReference: string;
  productToDebit: string;
  totalAmount: number;
}

/**
 * Step 4 - Transaction result
 */
export interface UtilityPaymentResult {
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

**Files to update:**
- `src/types/index.ts` - Add export

---

### Phase 2: Mock Data

**Files to create:**
- `src/mocks/mockUtilityPaymentData.ts`

**Implementation:**

```typescript
// src/mocks/mockUtilityPaymentData.ts
import {
  SourceAccount,
  RegisteredService,
  UtilityPaymentResult,
} from '@/src/types';
import { StepperStep } from '@/src/types';

export const UTILITY_PAYMENT_STEPS: StepperStep[] = [
  { number: 1, label: 'Detalle' },
  { number: 2, label: 'Confirmacion' },
  { number: 3, label: 'SMS' },
  { number: 4, label: 'Finalizacion' },
];

export const MOCK_VALID_CODE = '123456';

export const mockSourceAccounts: SourceAccount[] = [
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

export const mockRegisteredServices: RegisteredService[] = [
  {
    id: '1',
    alias: 'Luz Apartamento',
    provider: 'ENEL',
    serviceType: 'Energia',
    reference: '123456789',
    displayName: 'Luz Apartamento (ENEL - Energia)',
  },
  {
    id: '2',
    alias: 'Gas Casa',
    provider: 'Vanti',
    serviceType: 'Gas',
    reference: '987654321',
    displayName: 'Gas Casa (Vanti - Gas)',
  },
  {
    id: '3',
    alias: 'Agua Oficina',
    provider: 'EAAB',
    serviceType: 'Agua',
    reference: '456789123',
    displayName: 'Agua Oficina (EAAB - Agua)',
  },
];

export const mockUtilityPaymentResult: UtilityPaymentResult = {
  success: true,
  creditLine: 'Cambio de palabras',
  productNumber: '***5678',
  amountPaid: 850000,
  transactionCost: 0,
  transmissionDate: '1 de septiembre de 2025',
  transactionTime: '10:21 pm',
  approvalNumber: '950606',
  description: 'Exitosa',
};

export const mockUtilityPaymentResultError: UtilityPaymentResult = {
  success: false,
  creditLine: 'Cambio de palabras',
  productNumber: '***5678',
  amountPaid: 0,
  transactionCost: 0,
  transmissionDate: '1 de septiembre de 2025',
  transactionTime: '10:21 pm',
  approvalNumber: '',
  description: 'Fondos insuficientes',
};
```

**Files to update:**
- `src/mocks/index.ts` - Add export

---

### Phase 3: Organisms

#### 3.1 UtilityPaymentDetailsForm (Step 1)

**File:** `src/organisms/UtilityPaymentDetailsForm.tsx`

**Pattern Reference:** Similar to `UtilityRegistrationForm.tsx`

**Props Interface:**
```typescript
interface UtilityPaymentDetailsFormProps {
  sourceAccounts: SourceAccount[];
  registeredServices: RegisteredService[];
  formData: UtilityPaymentDetails;
  errors: {
    sourceAccount?: string;
    service?: string;
    amount?: string;
  };
  onSourceAccountChange: (accountId: string) => void;
  onServiceChange: (serviceId: string) => void;
  onAmountChange: (amount: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading?: boolean;
}
```

**Structure:**
- Card container
- Title: "Pago de Servicios Publicos" (color: `#004266`)
- Form fields (max-width: 500px):
  - Cuenta Origen (Select)
  - Servicio a Pagar (Select)
  - Tipo de Servicio (Read-only input, auto-populated)
  - Valor a Pagar (CurrencyInput)
- CaptchaPlaceholder
- Footer: "Volver" link + "Continuar" button

---

#### 3.2 UtilityPaymentConfirmationCard (Step 2)

**File:** `src/organisms/UtilityPaymentConfirmationCard.tsx`

**Pattern Reference:** Similar to `OtrosAsociadosConfirmationCard.tsx`

**Props Interface:**
```typescript
interface UtilityPaymentConfirmationCardProps {
  confirmation: UtilityPaymentConfirmation;
  onConfirm: () => void;
  onBack: () => void;
  isLoading?: boolean;
}
```

**Structure:**
- Card container
- Title: "Confirmacion de Pago"
- Subtitle: "Por favor, verifica que los datos..."
- Confirmation rows using `ConfirmationRow`:
  - Nombre del Titular
  - Documento Titular (masked)
  - Servicio a Pagar
  - Referencia (Factura)
  - Producto a Debitar
  - Valor Total (larger text)
- Footer: "Volver" link + "Confirmar Pago" button

---

#### 3.3 UtilityPaymentResultCard (Step 4)

**File:** `src/organisms/UtilityPaymentResultCard.tsx`

**Pattern Reference:** Similar to `OtrosAsociadosResultCard.tsx`

**Props Interface:**
```typescript
interface UtilityPaymentResultCardProps {
  result: UtilityPaymentResult;
  onPrint: () => void;
  onFinish: () => void;
}
```

**Structure:**
- Card container
- Success/Error Header:
  - SuccessIcon or ErrorIcon
  - Title: "Transaccion Exitosa" / "Transaccion Fallida"
- Result rows using `ConfirmationRow`:
  - Linea credito
  - Numero de producto
  - Valor pagado (larger text)
  - Costo transaccion
  - Fecha de Transmision
  - Hora de Transaccion
  - Numero de Aprobacion
  - Descripcion (green/red based on success)
- Footer: "Imprimir/Guardar" (outline) + "Finalizar" (primary)

**Files to update:**
- `src/organisms/index.ts` - Add exports for all 3 organisms

---

### Phase 4: Pages

#### 4.1 Step 1 - Payment Details Page

**File:** `app/(authenticated)/pagos/servicios-publicos/pagar/detalle/page.tsx`

**Pattern Reference:** See `app/(authenticated)/pagos/otros-asociados/pago/page.tsx`

**Implementation Notes:**
- Use `useWelcomeBar` hook to configure header
- Load accounts and services from mock data
- Store form data in `sessionStorage` key: `utilityPaymentDetails`
- Validate all fields before navigation
- Navigate to `/pagos/servicios-publicos/pagar/confirmacion`

---

#### 4.2 Step 2 - Confirmation Page

**File:** `app/(authenticated)/pagos/servicios-publicos/pagar/confirmacion/page.tsx`

**Pattern Reference:** See `app/(authenticated)/pagos/otros-asociados/pago/confirmacion/page.tsx`

**Implementation Notes:**
- Check `sessionStorage` for `utilityPaymentDetails`, redirect if missing
- Build confirmation data from details + mock user context
- Store confirmation in `sessionStorage` key: `utilityPaymentConfirmation`
- On confirm, navigate to `/pagos/servicios-publicos/pagar/codigo-sms`

---

#### 4.3 Step 3 - SMS Code Page

**File:** `app/(authenticated)/pagos/servicios-publicos/pagar/codigo-sms/page.tsx`

**Pattern Reference:** See `app/(authenticated)/pagos/otros-asociados/pago/sms/page.tsx`

**Implementation Notes:**
- Check `sessionStorage` for `utilityPaymentConfirmation`, redirect if missing
- REUSE `CodeInputCard` organism directly (already has all needed functionality)
- Implement resend cooldown (60 seconds)
- Validate code against `MOCK_VALID_CODE`
- Store result in `sessionStorage` key: `utilityPaymentResult`
- Navigate to `/pagos/servicios-publicos/pagar/respuesta`

---

#### 4.4 Step 4 - Response Page

**File:** `app/(authenticated)/pagos/servicios-publicos/pagar/respuesta/page.tsx`

**Pattern Reference:** See `app/(authenticated)/pagos/otros-asociados/pago/resultado/page.tsx`

**Implementation Notes:**
- Check `sessionStorage` for `utilityPaymentResult`, redirect if missing
- Display result using `UtilityPaymentResultCard`
- On print: `window.print()`
- On finish: clear all sessionStorage keys, navigate to `/home`
- Clean up sessionStorage on unmount

---

### Phase 5: Integration

**File to update:** `app/(authenticated)/pagos/servicios-publicos/page.tsx`

The `handleSelectPagar` function already points to `/pagos/servicios-publicos/pagar`. Update the route to:
```typescript
const handleSelectPagar = () => {
  router.push('/pagos/servicios-publicos/pagar/detalle');
};
```

---

## File Structure Summary

```
src/
├── types/
│   ├── utility-payment.ts                    # NEW
│   └── index.ts                              # UPDATE
│
├── mocks/
│   ├── mockUtilityPaymentData.ts             # NEW
│   └── index.ts                              # UPDATE
│
└── organisms/
    ├── UtilityPaymentDetailsForm.tsx         # NEW
    ├── UtilityPaymentConfirmationCard.tsx    # NEW
    ├── UtilityPaymentResultCard.tsx          # NEW
    └── index.ts                              # UPDATE

app/(authenticated)/pagos/
└── servicios-publicos/
    ├── page.tsx                              # UPDATE (change pagar route)
    └── pagar/
        ├── detalle/
        │   └── page.tsx                      # NEW - Step 1
        ├── confirmacion/
        │   └── page.tsx                      # NEW - Step 2
        ├── codigo-sms/
        │   └── page.tsx                      # NEW - Step 3
        └── respuesta/
            └── page.tsx                      # NEW - Step 4
```

---

## SessionStorage Keys

| Key | Type | Description | Created In | Used In |
|-----|------|-------------|-----------|---------|
| `utilityPaymentDetails` | `UtilityPaymentDetails` | Step 1 form data | Step 1 | Steps 2, 3, 4 |
| `utilityPaymentConfirmation` | `UtilityPaymentConfirmation` | Step 2 confirmation | Step 2 | Steps 3, 4 |
| `utilityPaymentResult` | `UtilityPaymentResult` | Transaction result | Step 3 | Step 4 |

---

## Implementation Checklist

### Phase 1: Types
- [ ] Create `src/types/utility-payment.ts`
- [ ] Update `src/types/index.ts` to export new types

### Phase 2: Mock Data
- [ ] Create `src/mocks/mockUtilityPaymentData.ts`
- [ ] Update `src/mocks/index.ts` to export mock data

### Phase 3: Organisms
- [ ] Create `src/organisms/UtilityPaymentDetailsForm.tsx`
- [ ] Create `src/organisms/UtilityPaymentConfirmationCard.tsx`
- [ ] Create `src/organisms/UtilityPaymentResultCard.tsx`
- [ ] Update `src/organisms/index.ts` to export new organisms

### Phase 4: Pages
- [ ] Create `app/(authenticated)/pagos/servicios-publicos/pagar/detalle/page.tsx`
- [ ] Create `app/(authenticated)/pagos/servicios-publicos/pagar/confirmacion/page.tsx`
- [ ] Create `app/(authenticated)/pagos/servicios-publicos/pagar/codigo-sms/page.tsx`
- [ ] Create `app/(authenticated)/pagos/servicios-publicos/pagar/respuesta/page.tsx`

### Phase 5: Integration
- [ ] Update `app/(authenticated)/pagos/servicios-publicos/page.tsx` to correct route

---

## Testing Checklist

### Navigation Flow
- [ ] Step 1 → Step 2 (valid form)
- [ ] Step 2 → Step 3 (confirm button)
- [ ] Step 3 → Step 4 (valid code)
- [ ] Step 4 → Home (finish button)
- [ ] Back navigation preserves data

### Form Validation (Step 1)
- [ ] Empty account shows error
- [ ] Empty service shows error
- [ ] Zero/empty amount shows error
- [ ] All valid → proceeds to Step 2

### SMS Validation (Step 3)
- [ ] Incomplete code (< 6 digits) shows error
- [ ] Invalid code shows error
- [ ] Valid code proceeds to Step 4
- [ ] Resend button works with cooldown

### Result Display (Step 4)
- [ ] Success shows green icon and "Exitosa"
- [ ] Error shows red icon and error message
- [ ] Print button triggers `window.print()`
- [ ] Finish clears sessionStorage

### Responsive Design
- [ ] Desktop (>=1024px)
- [ ] Tablet (640-1023px)
- [ ] Mobile (<640px)

---

## Dependencies

This feature depends on:
- Feature 09e-pagos (FlowSelectionCard, route structure)
- Core atoms: `Button`, `Card`, `Select`, `CurrencyInput`, `SuccessIcon`, `ErrorIcon`
- Core molecules: `Breadcrumbs`, `Stepper`, `ConfirmationRow`, `CodeInputGroup`, `HideBalancesToggle`
- Core organisms: `CodeInputCard`
- Contexts: `useWelcomeBar`, `useUIContext`

---

## Notes

1. **Code Reuse**: The SMS verification step (Step 3) reuses the existing `CodeInputCard` organism from the otros-asociados flow, ensuring consistency across payment flows.

2. **Pattern Consistency**: All pages follow the established pattern:
   - WelcomeBar configuration on mount
   - SessionStorage for state persistence between steps
   - Breadcrumbs + Stepper for navigation context
   - Card-based content with consistent footer actions

3. **No New Atoms/Molecules Needed**: The spec originally suggested creating `OtpDigitInput` and `OtpInput`, but the existing `CodeInputGroup` and `CodeInputCard` components already provide this functionality.

4. **Amount Formatting**: Use the existing `formatCurrency` utility for displaying monetary values, and `CurrencyInput` atom for amount entry.

---

**Last Updated**: 2026-01-07
**Status**: Ready for Implementation
