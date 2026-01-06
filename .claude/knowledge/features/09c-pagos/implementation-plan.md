# Feature 09c - Pagos: Pago de Obligaciones - Implementation Plan

**Feature**: Obligaciones Payment Flow (Pago de Obligaciones)
**Version**: 1.0
**Status**: Ready for Implementation
**Last Updated**: 2026-01-05

---

## Overview

This plan outlines the step-by-step implementation of the **Pago de Obligaciones** feature, which allows users to pay their loans and credit products via PSE. The implementation follows the Atomic Design pattern and reuses existing components from 09a-pagos and 09b-pagos.

---

## Prerequisites

Before starting implementation, ensure the following exist:
- [x] `Stepper` molecule (from 09a-pagos) - `src/molecules/Stepper.tsx`
- [x] `CurrencyInput` atom (from 09b-pagos) - `src/atoms/CurrencyInput.tsx`
- [x] `TransactionResultCard` organism - `src/organisms/TransactionResultCard.tsx`
- [x] Payment types base structure - `src/types/payment.ts`
- [x] Pagar mis Productos page - `app/(authenticated)/pagos/pagar-mis-productos/page.tsx`

---

## Implementation Phases

### Phase 1: Types & Mock Data

#### Step 1.1: Create Obligacion Payment Types

**File**: `src/types/obligacion-payment.ts`

Create the following types:
- `ObligacionPaymentProduct` - Loan/credit product for payment selection
- `ObligacionPaymentDetailsData` - Step 1 form data
- `ObligacionConfirmationData` - Step 2 confirmation data
- `ObligacionTransactionResult` - Step 4 transaction result
- `ObligacionPaymentFlowState` - Complete flow state
- `PaymentType` - Quick payment type ('minimum' | 'total')

**Estimated Lines**: ~70 lines

#### Step 1.2: Update Types Index

**File**: `src/types/index.ts`

Add export for `obligacion-payment.ts`:
```typescript
export * from './obligacion-payment';
```

#### Step 1.3: Create Mock Data

**File**: `src/mocks/mockObligacionPaymentData.ts`

Create mock data:
- `mockObligacionProducts` - Array of 2 loan products (Crédito de Inversión, Tarjeta de Crédito)
- `mockUserData` - User name and masked document
- `mockObligacionTransactionResult` - Success result
- `mockObligacionTransactionResultError` - Error result
- `OBLIGACION_PAYMENT_STEPS` - Stepper step definitions

**Estimated Lines**: ~80 lines

#### Step 1.4: Update Mocks Index

**File**: `src/mocks/index.ts`

Add exports for new mock data.

---

### Phase 2: Molecules

#### Step 2.1: Create ObligacionPaymentCard

**File**: `src/molecules/ObligacionPaymentCard.tsx`

A selectable card displaying loan/credit product information:
- Product name (e.g., "Crédito de Inversión")
- Product number (masked)
- Total balance
- Status ("Al día" / "En mora")
- Selected state with blue border

**Props**:
```typescript
interface ObligacionPaymentCardProps {
  product: ObligacionPaymentProduct;
  selected: boolean;
  onClick: () => void;
  hideBalances: boolean;
}
```

**Design Notes**:
- Selected: `border-2 border-[#007FFF]` (blue)
- Unselected: `border border-[#E4E6EA]` (gray)
- Status colors: Green `#00A44C` for "Al día", Red `#E1172B` for "En mora"

**Estimated Lines**: ~60 lines

#### Step 2.2: Create PaymentTypeButton

**File**: `src/molecules/PaymentTypeButton.tsx`

A small button for quick payment selection:
- "Pago Mínimo" - Sets value to minimum payment
- "Pago Total" - Sets value to total balance

**Props**:
```typescript
interface PaymentTypeButtonProps {
  label: string;
  onClick: () => void;
  active?: boolean;
}
```

**Design Notes**:
- Default: `bg-[#E4E6EA]` (gray)
- Active: `bg-[#007FFF]` (blue) with white text
- Font size: 10px
- Border radius: 9px

**Estimated Lines**: ~30 lines

#### Step 2.3: Update Molecules Index

**File**: `src/molecules/index.ts`

Add exports:
```typescript
export { ObligacionPaymentCard } from './ObligacionPaymentCard';
export { PaymentTypeButton } from './PaymentTypeButton';
```

---

### Phase 3: Organisms

#### Step 3.1: Create ObligacionDetailsCard

**File**: `src/organisms/ObligacionDetailsCard.tsx`

Main card for Step 1 containing:
1. Title: "Pago de Obligaciones"
2. Payment method selector (PSE dropdown, disabled)
3. "¿Necesitas más saldo?" link
4. Product selection section with `ObligacionPaymentCard` components
5. Payment details section (when product selected):
   - Pago Mínimo del Periodo
   - Pago Total
   - Fecha Límite de Pago
   - Costo de la Transacción
6. Payment type buttons (Pago Mínimo / Pago Total)
7. Editable value input using `CurrencyInput`
8. Total a Pagar display

**Props**:
```typescript
interface ObligacionDetailsCardProps {
  products: ObligacionPaymentProduct[];
  selectedProductId: string;
  valorAPagar: number;
  activePaymentType: PaymentType | null;
  onProductSelect: (productId: string) => void;
  onValorChange: (valor: number) => void;
  onPaymentTypeSelect: (type: PaymentType) => void;
  onNeedMoreBalance: () => void;
  hideBalances: boolean;
}
```

**Estimated Lines**: ~150 lines

#### Step 3.2: Create ObligacionConfirmationCard

**File**: `src/organisms/ObligacionConfirmationCard.tsx`

Confirmation card for Step 2 displaying:
1. Title: "Confirmación de Pagos"
2. Description text
3. User info section:
   - Titular
   - Documento (masked)
4. Payment info section:
   - Producto a Pagar
   - Numero de Producto
   - Producto a Debitar
   - Valor a Pagar

**Props**:
```typescript
interface ObligacionConfirmationCardProps {
  confirmationData: ObligacionConfirmationData;
  hideBalances: boolean;
}
```

**Estimated Lines**: ~80 lines

#### Step 3.3: Create ObligacionResultCard

**File**: `src/organisms/ObligacionResultCard.tsx`

Result card for Step 4 displaying:
1. Success/Error icon (centered)
2. Result title ("Transacción Exitosa" / "Transacción Fallida")
3. Transaction details:
   - Línea crédito
   - Número de producto
   - Valor pagado
   - Costo Transacción
   - Abono Excedente
   - Fecha de Transmisión
   - Hora de Transacción
   - Número de Aprobación
   - Descripción (green for success, red for error)

**Props**:
```typescript
interface ObligacionResultCardProps {
  result: ObligacionTransactionResult;
  hideBalances: boolean;
}
```

**Estimated Lines**: ~120 lines

#### Step 3.4: Update Organisms Index

**File**: `src/organisms/index.ts`

Add exports:
```typescript
export { ObligacionDetailsCard } from './ObligacionDetailsCard';
export { ObligacionConfirmationCard } from './ObligacionConfirmationCard';
export { ObligacionResultCard } from './ObligacionResultCard';
```

---

### Phase 4: Pages

#### Step 4.1: Create Step 1 Page (Details)

**File**: `app/(authenticated)/pagos/pago-obligaciones/page.tsx`

Main details page with:
1. Header with BackButton, title, HideBalancesToggle
2. Breadcrumbs
3. Stepper (currentStep=1)
4. ObligacionDetailsCard
5. Error display area
6. Action buttons (Volver / Continuar)

**State Management**:
- `selectedProductId` - Currently selected product
- `valorAPagar` - Payment amount
- `activePaymentType` - Which quick button is active
- `error` - Validation error message

**Validations**:
- Product must be selected
- Value must be > 0
- Value must be >= minimum payment
- Value must be <= total balance

**Navigation**:
- "Volver" -> `/pagos/pagar-mis-productos`
- "Continuar" -> `/pagos/pago-obligaciones/confirmacion`

**SessionStorage Keys**:
- `obligacionPaymentProductId`
- `obligacionPaymentValor`
- `obligacionPaymentProduct`

**Estimated Lines**: ~120 lines

#### Step 4.2: Create Step 2 Page (Confirmation)

**File**: `app/(authenticated)/pagos/pago-obligaciones/confirmacion/page.tsx`

Confirmation page with:
1. Header with BackButton, title, HideBalancesToggle
2. Breadcrumbs
3. Stepper (currentStep=2)
4. ObligacionConfirmationCard
5. Action buttons (Volver / Confirmar Pago)

**Data Loading**:
- Load from sessionStorage on mount
- Redirect to Step 1 if data missing

**Navigation**:
- "Volver" -> `/pagos/pago-obligaciones`
- "Confirmar Pago" -> `/pagos/pago-obligaciones/pse`

**SessionStorage Keys**:
- Read: `obligacionPaymentProduct`, `obligacionPaymentValor`
- Write: `obligacionPaymentConfirmation`

**Estimated Lines**: ~100 lines

#### Step 4.3: Create Step 3 Page (PSE Loading)

**File**: `app/(authenticated)/pagos/pago-obligaciones/pse/page.tsx`

PSE loading page with:
1. Header with title
2. Breadcrumbs
3. Stepper (currentStep=3)
4. Loading card with:
   - Animated spinner
   - "Conectando con PSE..." message
   - Instruction text

**Behavior**:
- Check for sessionStorage data on mount
- Redirect to Step 1 if data missing
- Auto-navigate to Step 4 after 3 second delay (simulating PSE connection)

**Navigation**:
- Auto -> `/pagos/pago-obligaciones/resultado`

**Estimated Lines**: ~70 lines

#### Step 4.4: Create Step 4 Page (Result)

**File**: `app/(authenticated)/pagos/pago-obligaciones/resultado/page.tsx`

Result page with:
1. Header with title, HideBalancesToggle
2. Breadcrumbs
3. Stepper (currentStep=4)
4. ObligacionResultCard
5. Action buttons (Imprimir/Guardar / Finalizar)

**Data Loading**:
- Load from sessionStorage on mount
- Build result from stored data + mock result

**Actions**:
- "Imprimir/Guardar" -> `window.print()`
- "Finalizar" -> Clear sessionStorage, navigate to `/pagos`

**Cleanup**:
- Clear all obligacion sessionStorage keys on unmount or finish

**Estimated Lines**: ~100 lines

---

### Phase 5: Validation Schemas (Optional)

#### Step 5.1: Create Validation Schemas

**File**: `src/schemas/obligacionPaymentSchemas.ts`

Create yup schemas:
- `obligacionPaymentDetailsSchema` - Step 1 validation
- `validatePaymentAmount()` - Custom amount validation function

**Estimated Lines**: ~40 lines

---

## File Summary

### New Files (10 files)

| File | Type | Lines (Est.) |
|------|------|--------------|
| `src/types/obligacion-payment.ts` | Types | ~70 |
| `src/mocks/mockObligacionPaymentData.ts` | Mock Data | ~80 |
| `src/molecules/ObligacionPaymentCard.tsx` | Molecule | ~60 |
| `src/molecules/PaymentTypeButton.tsx` | Molecule | ~30 |
| `src/organisms/ObligacionDetailsCard.tsx` | Organism | ~150 |
| `src/organisms/ObligacionConfirmationCard.tsx` | Organism | ~80 |
| `src/organisms/ObligacionResultCard.tsx` | Organism | ~120 |
| `app/(authenticated)/pagos/pago-obligaciones/page.tsx` | Page | ~120 |
| `app/(authenticated)/pagos/pago-obligaciones/confirmacion/page.tsx` | Page | ~100 |
| `app/(authenticated)/pagos/pago-obligaciones/pse/page.tsx` | Page | ~70 |
| `app/(authenticated)/pagos/pago-obligaciones/resultado/page.tsx` | Page | ~100 |
| `src/schemas/obligacionPaymentSchemas.ts` | Schema | ~40 |

**Total Estimated Lines**: ~1020 lines

### Files to Update (4 files)

| File | Changes |
|------|---------|
| `src/types/index.ts` | Add export for obligacion-payment |
| `src/mocks/index.ts` | Add exports for mock data |
| `src/molecules/index.ts` | Add 2 new component exports |
| `src/organisms/index.ts` | Add 3 new component exports |

---

## Implementation Order (Recommended)

Execute in this order to ensure dependencies are available:

```
1. src/types/obligacion-payment.ts
2. src/types/index.ts (update)
3. src/mocks/mockObligacionPaymentData.ts
4. src/mocks/index.ts (update)
5. src/molecules/ObligacionPaymentCard.tsx
6. src/molecules/PaymentTypeButton.tsx
7. src/molecules/index.ts (update)
8. src/organisms/ObligacionDetailsCard.tsx
9. src/organisms/ObligacionConfirmationCard.tsx
10. src/organisms/ObligacionResultCard.tsx
11. src/organisms/index.ts (update)
12. app/(authenticated)/pagos/pago-obligaciones/page.tsx
13. app/(authenticated)/pagos/pago-obligaciones/confirmacion/page.tsx
14. app/(authenticated)/pagos/pago-obligaciones/pse/page.tsx
15. app/(authenticated)/pagos/pago-obligaciones/resultado/page.tsx
16. src/schemas/obligacionPaymentSchemas.ts (optional)
```

---

## Component Dependencies

```
ObligacionDetailsCard
├── Card (atom)
├── Divider (atom)
├── CurrencyInput (atom) - from 09b-pagos
├── ObligacionPaymentCard (molecule)
├── PaymentTypeButton (molecule)
└── formatCurrency, maskCurrency (utils)

ObligacionConfirmationCard
├── Card (atom)
├── Divider (atom)
└── formatCurrency, maskCurrency (utils)

ObligacionResultCard
├── Card (atom)
├── Divider (atom)
└── formatCurrency, maskCurrency (utils)

Pages
├── BackButton (atom)
├── Button (atom)
├── Breadcrumbs (molecule)
├── Stepper (molecule) - from 09a-pagos
├── HideBalancesToggle (molecule)
├── useUIContext (context)
├── useWelcomeBar (hook)
└── Organisms (as listed above)
```

---

## Session Storage Schema

```typescript
// Keys for Pago de Obligaciones flow
const STORAGE_KEYS = {
  productId: 'obligacionPaymentProductId',      // string
  valor: 'obligacionPaymentValor',              // string (number as string)
  product: 'obligacionPaymentProduct',          // JSON string
  confirmation: 'obligacionPaymentConfirmation' // JSON string
};
```

---

## Testing Checklist

### Step 1: Details Page
- [ ] Stepper shows step 1 as active
- [ ] PSE dropdown shows and is disabled
- [ ] Product cards render correctly (2 cards)
- [ ] Product selection updates border style
- [ ] Payment details section shows when product selected
- [ ] "Pago Mínimo" button sets correct value
- [ ] "Pago Total" button sets correct value
- [ ] Value input is editable
- [ ] hideBalances toggle works
- [ ] Validation errors display correctly
- [ ] "Volver" navigates to pagar-mis-productos
- [ ] "Continuar" navigates to confirmation with valid data

### Step 2: Confirmation Page
- [ ] Stepper shows step 2 active, step 1 completed
- [ ] User info displays correctly
- [ ] Payment info displays correctly
- [ ] hideBalances toggle works
- [ ] "Volver" navigates back to step 1
- [ ] "Confirmar Pago" navigates to PSE
- [ ] Redirects to step 1 if no sessionStorage data

### Step 3: PSE Loading Page
- [ ] Stepper shows step 3 active
- [ ] Loading spinner animates
- [ ] Message displays correctly
- [ ] Auto-navigates to result after delay
- [ ] Redirects to step 1 if no sessionStorage data

### Step 4: Result Page
- [ ] Stepper shows all steps completed
- [ ] Success icon displays for success
- [ ] Transaction details display correctly
- [ ] hideBalances toggle works
- [ ] "Imprimir/Guardar" triggers print
- [ ] "Finalizar" clears session and navigates to /pagos

### Responsive Testing
- [ ] Desktop layout correct
- [ ] Tablet layout adapts
- [ ] Mobile layout stacks properly

---

## Notes

1. **Reuse Patterns**: Follow the same patterns established in 09a-pagos for:
   - Session storage management
   - Welcome bar configuration
   - Stepper integration
   - Navigation between steps

2. **PSE Integration**: Currently mock/simulated. Real PSE integration would require:
   - API endpoint to initiate PSE transaction
   - Callback URL handling
   - Transaction status polling

3. **No New Atoms**: This feature uses existing atoms (Card, Button, Divider, CurrencyInput)

4. **Status Colors**: Use consistent colors:
   - "Al día" / Success: `#00A44C` (green)
   - "En mora" / Error: `#E1172B` (red)

5. **Amount Formatting**: Use existing `formatCurrency` and `maskCurrency` utilities

---

**Last Updated**: 2026-01-05
**Status**: Ready for Implementation
