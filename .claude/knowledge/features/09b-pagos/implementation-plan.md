# Feature 09b - Pagos: Pago de Aportes - Implementation Plan

**Feature**: Aportes Payment Flow (Pago de Aportes)
**Version**: 1.0
**Status**: Ready for Implementation
**Last Updated**: 2026-01-05

---

## Overview

This plan outlines the step-by-step implementation of the **Pago de Aportes** feature, a 4-step payment flow for Aportes contributions. The implementation leverages existing components from 09a-pagos while creating new Aportes-specific components.

---

## Prerequisites

Before starting implementation, verify these components exist from 09a-pagos:

| Component | Type | Location | Status |
|-----------|------|----------|--------|
| `StepperCircle` | Atom | `src/atoms/StepperCircle.tsx` | Exists |
| `StepperConnector` | Atom | `src/atoms/StepperConnector.tsx` | Exists |
| `CodeInput` | Atom | `src/atoms/CodeInput.tsx` | Exists |
| `Stepper` | Molecule | `src/molecules/Stepper.tsx` | Exists |
| `CodeInputGroup` | Molecule | `src/molecules/CodeInputGroup.tsx` | Exists |
| `CodeInputCard` | Organism | `src/organisms/CodeInputCard.tsx` | Exists |
| `TransactionResultCard` | Organism | `src/organisms/TransactionResultCard.tsx` | Exists |
| Payment types | Types | `src/types/payment.ts` | Exists |
| Stepper types | Types | `src/types/stepper.ts` | Exists |

---

## Implementation Phases

### Phase 1: Types & Mock Data (Foundation)

#### Step 1.1: Create Aportes Payment Types

**File**: `src/types/aportes-payment.ts`

Create new type definitions for the Aportes payment flow:

```typescript
// Types to create:
- AportesPaymentBreakdown
- AportesPaymentDetailsData
- AportesConfirmationData
- AportesTransactionResult
- AportesPaymentFlowState
- AportesValueColor
```

**Key differences from 09a types**:
- `AportesPaymentBreakdown` includes detailed breakdown (vigentes, mora, fondo solidaridad)
- `AportesConfirmationData` is single-product focused
- `AportesTransactionResult` has aportes-specific fields (lineaCredito, numeroProducto, valorPagado)

#### Step 1.2: Update Types Index

**File**: `src/types/index.ts`

Add export for new aportes-payment types.

#### Step 1.3: Create Mock Data

**File**: `src/mocks/mockAportesPaymentData.ts`

Create mock data including:
- `mockPaymentAccounts` (can reuse from 09a or create specific)
- `mockUserData`
- `mockAportesPaymentBreakdown`
- `mockAportesTransactionResult`
- `mockAportesTransactionResultError`
- `APORTES_PAYMENT_STEPS`
- `MOCK_VALID_CODE`

#### Step 1.4: Update Mocks Index

**File**: `src/mocks/index.ts`

Add exports for new mock data.

---

### Phase 2: Atoms

#### Step 2.1: Create CurrencyInput Atom

**File**: `src/atoms/CurrencyInput.tsx`

An editable currency input field with:
- Peso prefix ("$")
- Thousand separator formatting (Colombian locale)
- Error state styling
- Disabled state
- Navy border color (`#1D4E8F`)

**Props**:
```typescript
interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  hasError?: boolean;
  disabled?: boolean;
  className?: string;
}
```

**Key implementation details**:
- Use `inputMode="numeric"` for mobile keyboards
- Format with `toLocaleString('es-CO')` for display
- Parse by removing separators on change
- Maintain proper formatting on blur

#### Step 2.2: Update Atoms Index

**File**: `src/atoms/index.ts`

Add export for `CurrencyInput`.

---

### Phase 3: Molecules

#### Step 3.1: Create AportesPaymentDetailRow Molecule

**File**: `src/molecules/AportesPaymentDetailRow.tsx`

A row component for displaying payment breakdown items with optional colored values:

**Props**:
```typescript
interface AportesPaymentDetailRowProps {
  label: string;
  value: string;
  valueColor?: 'default' | 'red' | 'navy' | 'green';
  hideValue?: boolean;
}
```

**Color mapping**:
- `default`: Black (`text-black`)
- `red`: Red (`text-[#E1172B]`) - for mora amounts
- `navy`: Navy (`text-[#1D4E8F]`) - for highlighted amounts
- `green`: Green (`text-[#00A44C]`) - for success states

#### Step 3.2: Update Molecules Index

**File**: `src/molecules/index.ts`

Add export for `AportesPaymentDetailRow`.

---

### Phase 4: Organisms

#### Step 4.1: Create AportesDetailsCard Organism

**File**: `src/organisms/AportesDetailsCard.tsx`

Main card for Step 1 containing:
- Title: "Pago de Aportes"
- Account selector dropdown
- "Necesitas mas saldo?" link
- Section subtitle: "Detalle del Pago - {planName}"
- Payment breakdown rows (6 rows)
- Editable value input (CurrencyInput)

**Props**:
```typescript
interface AportesDetailsCardProps {
  accounts: PaymentAccount[];
  paymentBreakdown: AportesPaymentBreakdown;
  selectedAccountId: string;
  valorAPagar: number;
  onAccountChange: (accountId: string) => void;
  onValorChange: (valor: number) => void;
  onNeedMoreBalance: () => void;
  hideBalances: boolean;
}
```

#### Step 4.2: Create AportesConfirmationCard Organism

**File**: `src/organisms/AportesConfirmationCard.tsx`

Confirmation card for Step 2 containing:
- Title: "Confirmacion de Pagos"
- Description text
- User info section (Titular, Documento)
- Divider
- Payment info section (Producto, Numero, Cuenta, Valor)

**Props**:
```typescript
interface AportesConfirmationCardProps {
  confirmationData: AportesConfirmationData;
  hideBalances: boolean;
}
```

#### Step 4.3: Create AportesTransactionResultCard Organism

**File**: `src/organisms/AportesTransactionResultCard.tsx`

Result card for Step 4 containing:
- Success/Error icon (centered)
- Title: "Transaccion Exitosa" / "Transaccion Fallida"
- Transaction details section 1:
  - Linea credito
  - Numero de producto
  - Valor pagado (navy, larger font)
  - Costo transaccion
- Divider
- Transaction details section 2:
  - Fecha de Transmision
  - Hora de Transaccion
  - Numero de Aprobacion
  - Descripcion (green/red based on status)

**Props**:
```typescript
interface AportesTransactionResultCardProps {
  result: AportesTransactionResult;
  hideBalances: boolean;
}
```

**Note**: This is a new organism (not reusing TransactionResultCard from 09a) because it has different fields specific to Aportes payments.

#### Step 4.4: Update Organisms Index

**File**: `src/organisms/index.ts`

Add exports for:
- `AportesDetailsCard`
- `AportesConfirmationCard`
- `AportesTransactionResultCard`

---

### Phase 5: Pages

#### Step 5.1: Create Step 1 Page (Details)

**File**: `app/(authenticated)/pagos/pago-aportes/page.tsx`

**Route**: `/pagos/pago-aportes`

Implementation:
- Use `useWelcomeBar(false)` to hide welcome bar
- State: `selectedAccountId`, `valorAPagar`, `error`
- Breadcrumbs: `Inicio / Pagos / Pago de Aportes`
- Stepper at step 1
- AportesDetailsCard organism
- Error display area
- Navigation: "Volver" link + "Continuar" button

**Validations**:
- Account must be selected
- Value must be > 0
- Selected account must have sufficient balance

**Data flow**:
- Store `selectedAccountId`, `valorAPagar`, `paymentBreakdown` in sessionStorage
- Navigate to `/pagos/pago-aportes/confirmacion`

#### Step 5.2: Create Step 2 Page (Confirmation)

**File**: `app/(authenticated)/pagos/pago-aportes/confirmacion/page.tsx`

**Route**: `/pagos/pago-aportes/confirmacion`

Implementation:
- Use `useWelcomeBar(false)`
- Read data from sessionStorage on mount
- Redirect to step 1 if no data found
- Build `confirmationData` from session + mock user data
- Stepper at step 2
- AportesConfirmationCard organism
- Navigation: "Volver" link + "Guardar Cambios" button

**Data flow**:
- Store `confirmationData` in sessionStorage
- Navigate to `/pagos/pago-aportes/verificacion`

#### Step 5.3: Create Step 3 Page (Verification)

**File**: `app/(authenticated)/pagos/pago-aportes/verificacion/page.tsx`

**Route**: `/pagos/pago-aportes/verificacion`

Implementation:
- Use `useWelcomeBar(false)`
- Verify sessionStorage has required data, redirect if not
- State: `code`, `error`, `isResendDisabled`, `isLoading`
- Stepper at step 3
- Reuse `CodeInputCard` organism from 09a
- Navigation: "Volver" link + "Pagar" button

**Code validation**:
- Must be 6 digits
- Compare against `MOCK_VALID_CODE` (for mock implementation)
- Show error for invalid code

**Data flow**:
- On successful validation, navigate to `/pagos/pago-aportes/resultado`

#### Step 5.4: Create Step 4 Page (Result)

**File**: `app/(authenticated)/pagos/pago-aportes/resultado/page.tsx`

**Route**: `/pagos/pago-aportes/resultado`

Implementation:
- Use `useWelcomeBar(false)`
- Read session data and build result with mock transaction result
- Stepper at step 4 (all steps completed)
- AportesTransactionResultCard organism
- Action buttons: "Imprimir/Guardar" (outline) + "Finalizar" (primary)

**Cleanup**:
- Clear all sessionStorage keys on "Finalizar"
- Navigate to `/pagos`

---

### Phase 6: Validation Schemas (Optional)

#### Step 6.1: Create Validation Schemas

**File**: `src/schemas/aportesPaymentSchemas.ts`

Create yup schemas for:
- `aportesPaymentDetailsSchema` - Step 1 validation
- `codeVerificationSchema` - Step 3 validation (can reuse from 09a if exists)

---

## File Creation Checklist

### New Files to Create

| # | File | Phase | Type |
|---|------|-------|------|
| 1 | `src/types/aportes-payment.ts` | 1 | Types |
| 2 | `src/mocks/mockAportesPaymentData.ts` | 1 | Mocks |
| 3 | `src/atoms/CurrencyInput.tsx` | 2 | Atom |
| 4 | `src/molecules/AportesPaymentDetailRow.tsx` | 3 | Molecule |
| 5 | `src/organisms/AportesDetailsCard.tsx` | 4 | Organism |
| 6 | `src/organisms/AportesConfirmationCard.tsx` | 4 | Organism |
| 7 | `src/organisms/AportesTransactionResultCard.tsx` | 4 | Organism |
| 8 | `app/(authenticated)/pagos/pago-aportes/page.tsx` | 5 | Page |
| 9 | `app/(authenticated)/pagos/pago-aportes/confirmacion/page.tsx` | 5 | Page |
| 10 | `app/(authenticated)/pagos/pago-aportes/verificacion/page.tsx` | 5 | Page |
| 11 | `app/(authenticated)/pagos/pago-aportes/resultado/page.tsx` | 5 | Page |
| 12 | `src/schemas/aportesPaymentSchemas.ts` | 6 | Schema (Optional) |

### Files to Update

| # | File | Phase | Changes |
|---|------|-------|---------|
| 1 | `src/types/index.ts` | 1 | Add aportes-payment exports |
| 2 | `src/mocks/index.ts` | 1 | Add mock data exports |
| 3 | `src/atoms/index.ts` | 2 | Add CurrencyInput export |
| 4 | `src/molecules/index.ts` | 3 | Add AportesPaymentDetailRow export |
| 5 | `src/organisms/index.ts` | 4 | Add 3 organism exports |

---

## Implementation Order Summary

```
Phase 1: Foundation
  1.1 Create src/types/aportes-payment.ts
  1.2 Update src/types/index.ts
  1.3 Create src/mocks/mockAportesPaymentData.ts
  1.4 Update src/mocks/index.ts

Phase 2: Atoms
  2.1 Create src/atoms/CurrencyInput.tsx
  2.2 Update src/atoms/index.ts

Phase 3: Molecules
  3.1 Create src/molecules/AportesPaymentDetailRow.tsx
  3.2 Update src/molecules/index.ts

Phase 4: Organisms
  4.1 Create src/organisms/AportesDetailsCard.tsx
  4.2 Create src/organisms/AportesConfirmationCard.tsx
  4.3 Create src/organisms/AportesTransactionResultCard.tsx
  4.4 Update src/organisms/index.ts

Phase 5: Pages
  5.1 Create app/(authenticated)/pagos/pago-aportes/page.tsx
  5.2 Create app/(authenticated)/pagos/pago-aportes/confirmacion/page.tsx
  5.3 Create app/(authenticated)/pagos/pago-aportes/verificacion/page.tsx
  5.4 Create app/(authenticated)/pagos/pago-aportes/resultado/page.tsx

Phase 6: Validation (Optional)
  6.1 Create src/schemas/aportesPaymentSchemas.ts
```

---

## Key Implementation Notes

### Session Storage Keys

Use distinct keys from 09a to avoid conflicts:
- `aportesPaymentAccountId`
- `aportesPaymentValor`
- `aportesPaymentBreakdown`
- `aportesPaymentConfirmation`

### Component Reuse Strategy

| Component | Source | Usage in 09b |
|-----------|--------|--------------|
| `Stepper` | 09a | Step indicator on all pages |
| `CodeInput` | 09a | Individual digit input |
| `CodeInputGroup` | 09a | 6-digit code input |
| `CodeInputCard` | 09a | Step 3 main card |
| `Breadcrumbs` | Existing | Navigation trail |
| `Button` | Existing | Action buttons |
| `Card` | Existing | Card containers |
| `Divider` | Existing | Section separators |

### Styling Considerations

- Mora amounts always in red (`#E1172B`) even when value is 0
- "Valor pagado" in result page uses larger font (18px) and navy color
- Currency input border should be navy (`#1D4E8F`) when focused
- Use brand colors from design system for consistency

### Hide Balances Support

All monetary values must respect the `hideBalances` toggle from UIContext:
- Account balances in selector
- Payment breakdown amounts
- Valor a pagar in confirmation
- Valor pagado in result

---

## Testing Checklist

### Step 1: Details Page
- [ ] Page renders with stepper at step 1
- [ ] Account dropdown shows available accounts
- [ ] Balance hidden when hideBalances is true
- [ ] Payment breakdown displays correctly
- [ ] Mora amounts show in red
- [ ] Value input is editable
- [ ] Value formats with thousand separators
- [ ] Validation prevents continue without account
- [ ] Validation prevents continue with 0 value
- [ ] Validation prevents continue with insufficient balance
- [ ] "Volver" navigates to /pagos
- [ ] "Continuar" saves data and navigates to step 2

### Step 2: Confirmation Page
- [ ] Page renders with stepper at step 2
- [ ] Redirects to step 1 if no session data
- [ ] User info displays correctly
- [ ] Payment info displays correctly
- [ ] Balance hidden when hideBalances is true
- [ ] "Volver" navigates back to step 1
- [ ] "Guardar Cambios" saves data and navigates to step 3

### Step 3: Verification Page
- [ ] Page renders with stepper at step 3
- [ ] Redirects if no session data
- [ ] 6 code inputs work correctly
- [ ] Auto-focus and auto-advance work
- [ ] "Reenviar" has cooldown behavior
- [ ] Invalid code shows error
- [ ] Valid code navigates to step 4
- [ ] "Volver" navigates back to step 2

### Step 4: Result Page
- [ ] Page renders with stepper at step 4 (completed)
- [ ] Success icon shows for successful transaction
- [ ] All transaction details display correctly
- [ ] "Valor pagado" shows in navy color
- [ ] "Descripcion" shows in green for success
- [ ] "Imprimir/Guardar" triggers print dialog
- [ ] "Finalizar" clears session and navigates to /pagos

### Responsive Testing
- [ ] Desktop layout correct
- [ ] Tablet layout adapts
- [ ] Mobile layout stacks properly
- [ ] Currency input usable on mobile

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Form fields have proper labels
- [ ] Error messages announced to screen readers

---

## Dependencies

### NPM Packages (Already Installed)
- `react-hook-form` - Form handling (if using in components)
- `yup` - Validation schemas

### No New Dependencies Required

This feature uses only existing project dependencies.

---

**Last Updated**: 2026-01-05
**Author**: Claude Code
**Status**: Ready for Implementation
