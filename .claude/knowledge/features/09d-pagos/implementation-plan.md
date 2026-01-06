# Feature 09d-pagos: Implementation Plan

## Pago a Otros Asociados (Payment to Other Associates)

**Created**: 2026-01-06
**Status**: Ready for Implementation
**Estimated Effort**: 6-8 hours

---

## Overview

This plan outlines the step-by-step implementation of the "Pago a Otros Asociados" feature, which allows users to make payments to registered beneficiaries (other Coasmedas associates). The flow consists of:

1. **Pre-step**: Beneficiary selection page
2. **Step 1**: Payment details (source account + product selection with amounts)
3. **Step 2**: Confirmation
4. **Step 3**: SMS verification
5. **Step 4**: Transaction result

---

## Prerequisites Check

### Existing Components to Reuse

| Component | Location | Status |
|-----------|----------|--------|
| `StepperCircle` | `src/atoms/StepperCircle.tsx` | ✅ Available |
| `StepperConnector` | `src/atoms/StepperConnector.tsx` | ✅ Available |
| `Stepper` | `src/molecules/Stepper.tsx` | ✅ Available |
| `CodeInput` | `src/atoms/CodeInput.tsx` | ✅ Available |
| `CodeInputGroup` | `src/molecules/CodeInputGroup.tsx` | ✅ Available |
| `CodeInputCard` | `src/organisms/CodeInputCard.tsx` | ✅ Available |
| `CurrencyInput` | `src/atoms/CurrencyInput.tsx` | ✅ Available |
| `BackButton` | `src/atoms/BackButton.tsx` | ✅ Available |
| `Breadcrumbs` | `src/molecules/Breadcrumbs.tsx` | ✅ Available |
| `HideBalancesToggle` | `src/molecules/HideBalancesToggle.tsx` | ✅ Available |
| `Card` | `src/atoms/Card.tsx` | ✅ Available |
| `Divider` | `src/atoms/Divider.tsx` | ✅ Available |
| `ChevronIcon` | `src/atoms/ChevronIcon.tsx` | ✅ Available |
| `Button` | `src/atoms/Button.tsx` | ✅ Available |

### Components to Create

| Component | Type | Priority |
|-----------|------|----------|
| `Checkbox` | Atom | Required |
| `BeneficiaryListItem` | Molecule | Required |
| `PayableProductCard` | Molecule | Required |
| `ConfirmationRow` | Molecule | Required |
| `BeneficiarySelectionCard` | Organism | Required |
| `OtrosAsociadosDetailsCard` | Organism | Required |
| `OtrosAsociadosConfirmationCard` | Organism | Required |
| `OtrosAsociadosResultCard` | Organism | Required |

---

## Implementation Phases

### Phase 1: Types & Mock Data (30 min)

#### Step 1.1: Create Type Definitions
**File**: `src/types/otros-asociados-payment.ts`

Create the following interfaces:
- `RegisteredBeneficiary` - Beneficiary info (id, fullName, alias, documentNumber)
- `PayableProduct` - Product with selection and amount (id, name, productNumber, minimumPayment, totalPayment, amountToPay, isSelected)
- `SourceAccount` - Source account for payment (id, type, balance, number)
- `OtrosAsociadosDetailsData` - Step 1 form data
- `OtrosAsociadosConfirmationData` - Step 2 confirmation data
- `OtrosAsociadosTransactionResult` - Step 4 result data
- `OtrosAsociadosPaymentFlowState` - Complete flow state

#### Step 1.2: Update Types Index
**File**: `src/types/index.ts`

Export all new types from `otros-asociados-payment.ts`

#### Step 1.3: Create Mock Data
**File**: `src/mocks/mockOtrosAsociadosPaymentData.ts`

Create mock data for:
- `mockRegisteredBeneficiaries` - 3 sample beneficiaries
- `mockSourceAccounts` - 2 sample accounts
- `mockPayableProducts` - 3 sample products with varied data
- `mockUserData` - Payer info (name, document)
- `mockOtrosAsociadosTransactionResult` - Success result
- `mockOtrosAsociadosTransactionResultError` - Error result
- `OTROS_ASOCIADOS_PAYMENT_STEPS` - Stepper steps array
- `MOCK_VALID_CODE` - Test SMS code ("123456")

#### Step 1.4: Update Mocks Index
**File**: `src/mocks/index.ts`

Export all mock data from `mockOtrosAsociadosPaymentData.ts`

---

### Phase 2: Atoms (15 min)

#### Step 2.1: Create Checkbox Atom
**File**: `src/atoms/Checkbox.tsx`

Props:
- `checked: boolean`
- `onChange: (checked: boolean) => void`
- `disabled?: boolean`
- `id?: string`
- `aria-label?: string`

Styling:
- Size: 16x16px
- Border: 1px solid #B1B1B1
- Checked: Blue #007FFF background, white checkmark
- Focus: Blue ring

#### Step 2.2: Update Atoms Index
**File**: `src/atoms/index.ts`

Add export for `Checkbox`

---

### Phase 3: Molecules (45 min)

#### Step 3.1: Create BeneficiaryListItem
**File**: `src/molecules/BeneficiaryListItem.tsx`

Props:
- `name: string` - Beneficiary full name (uppercase)
- `alias: string` - Alias/nickname
- `maskedDocument: string` - Masked document number
- `onClick: () => void` - Click handler

Layout:
- Full-width button with flex row
- Left: Name (blue, 18px, medium) + Subtitle (alias + doc)
- Right: ChevronIcon (right direction)
- Border: 1px solid #E4E6EA, rounded-lg
- Hover: Blue border, light blue background

#### Step 3.2: Create PayableProductCard
**File**: `src/molecules/PayableProductCard.tsx`

Props:
- `product: PayableProduct`
- `onSelectionChange: (selected: boolean) => void`
- `onAmountChange: (amount: number) => void`
- `hideBalances: boolean`

Layout:
- Checkbox on left (top-aligned)
- Product info section:
  - Title: Product name + masked number (blue, bold)
  - Payment info row: Pago Mínimo + Pago Total (small text)
  - Amount input (only visible when selected): "Valor a Pagar:" + CurrencyInput
- Bottom border separator

Dependencies: `Checkbox`, `CurrencyInput`, `formatCurrency`, `maskCurrency`

#### Step 3.3: Create ConfirmationRow
**File**: `src/molecules/ConfirmationRow.tsx`

Props:
- `label: string`
- `value: string`
- `valueColor?: 'default' | 'success' | 'error'`
- `className?: string`

Layout:
- Flex row with justify-between
- Label: 15px, black
- Value: 15px, medium weight
- Color variants: default (#000), success (#00A44C), error (#FF0D00)

#### Step 3.4: Update Molecules Index
**File**: `src/molecules/index.ts`

Add exports for: `BeneficiaryListItem`, `PayableProductCard`, `ConfirmationRow`

---

### Phase 4: Organisms (1.5 hours)

#### Step 4.1: Create BeneficiarySelectionCard
**File**: `src/organisms/BeneficiarySelectionCard.tsx`

Props:
- `beneficiaries: RegisteredBeneficiary[]`
- `onSelect: (beneficiary: RegisteredBeneficiary) => void`

Layout:
- Card wrapper
- Title: "Asociados inscritos" (blue, bold)
- List of BeneficiaryListItem components
- Empty state message when no beneficiaries

Dependencies: `Card`, `BeneficiaryListItem`

#### Step 4.2: Create OtrosAsociadosDetailsCard
**File**: `src/organisms/OtrosAsociadosDetailsCard.tsx`

Props:
- `beneficiaryName: string`
- `accounts: SourceAccount[]`
- `selectedAccountId: string`
- `products: PayableProduct[]`
- `totalAmount: number`
- `onAccountChange: (accountId: string) => void`
- `onProductSelectionChange: (productId: string, selected: boolean) => void`
- `onProductAmountChange: (productId: string, amount: number) => void`
- `onNeedMoreBalance: () => void`
- `hideBalances: boolean`

Layout:
- Card wrapper
- Title: "Pago de {beneficiaryName}"
- Account dropdown with balance display + "¿Necesitas más saldo?" link
- Products section with PayableProductCard list
- Summary section: "Resumen del Pago" + Total amount

Dependencies: `Card`, `Divider`, `PayableProductCard`, `formatCurrency`, `maskCurrency`

#### Step 4.3: Create OtrosAsociadosConfirmationCard
**File**: `src/organisms/OtrosAsociadosConfirmationCard.tsx`

Props:
- `confirmationData: OtrosAsociadosConfirmationData`
- `hideBalances: boolean`

Layout:
- Card wrapper
- Title: "Confirmación de Pago"
- Instruction text
- Payer info section (Titular, Documento, Producto a Debitar)
- Products section with beneficiary name subtitle
- Each product with ConfirmationRow
- Total section

Dependencies: `Card`, `Divider`, `ConfirmationRow`, `formatCurrency`, `maskCurrency`

#### Step 4.4: Create OtrosAsociadosResultCard
**File**: `src/organisms/OtrosAsociadosResultCard.tsx`

Props:
- `result: OtrosAsociadosTransactionResult`
- `hideBalances: boolean`

Layout:
- Card wrapper
- Success/Error icon (green checkmark or red X)
- Title: "Transacción Exitosa" or "Transacción Fallida"
- Transaction details with ConfirmationRow components
- Dividers between sections
- Description with color (success=green, error=red)

Dependencies: `Card`, `Divider`, `ConfirmationRow`, `formatCurrency`, `maskCurrency`

#### Step 4.5: Update Organisms Index
**File**: `src/organisms/index.ts`

Add exports for: `BeneficiarySelectionCard`, `OtrosAsociadosDetailsCard`, `OtrosAsociadosConfirmationCard`, `OtrosAsociadosResultCard`

---

### Phase 5: Pages (2 hours)

#### Step 5.1: Create Beneficiary Selection Page (Pre-step)
**File**: `app/(authenticated)/pagos/otros-asociados/page.tsx`

Features:
- Header with BackButton and title
- Breadcrumbs: Inicio / Pagos / Pago a otros asociados
- BeneficiarySelectionCard component
- Store selected beneficiary in sessionStorage
- Navigate to `/pagos/otros-asociados/pago` on selection
- useWelcomeBar(false) to hide welcome bar

#### Step 5.2: Create Details Page (Step 1)
**File**: `app/(authenticated)/pagos/otros-asociados/pago/page.tsx`

Features:
- Header with BackButton, title, and HideBalancesToggle
- Breadcrumbs
- Stepper (step 1 active)
- OtrosAsociadosDetailsCard
- Error message display
- Footer with "Volver" link and "Continuar" button
- Validation:
  - Account must be selected
  - At least one product selected
  - All selected products must have amount > 0
  - Total must not exceed account balance
- Store data in sessionStorage
- Redirect to beneficiary selection if no beneficiary in session

#### Step 5.3: Create Confirmation Page (Step 2)
**File**: `app/(authenticated)/pagos/otros-asociados/pago/confirmacion/page.tsx`

Features:
- Header with BackButton, title, and HideBalancesToggle
- Breadcrumbs
- Stepper (steps 1-2 active)
- OtrosAsociadosConfirmationCard
- Footer with "Volver" link and "Confirmar Pago" button
- Build confirmation data from sessionStorage
- Store confirmation in sessionStorage
- Redirect to step 1 if missing data

#### Step 5.4: Create SMS Page (Step 3)
**File**: `app/(authenticated)/pagos/otros-asociados/pago/sms/page.tsx`

Features:
- Header with BackButton and title (no balance toggle)
- Breadcrumbs
- Stepper (steps 1-3 active)
- CodeInputCard component (reused from 09a)
- Footer with "Volver" link and "Pagar" button
- Code validation (6 digits, test code: "123456")
- Loading state during verification
- Resend code functionality with 60s cooldown
- Redirect to step 1 if missing confirmation data

#### Step 5.5: Create Result Page (Step 4)
**File**: `app/(authenticated)/pagos/otros-asociados/pago/resultado/page.tsx`

Features:
- Header with title and HideBalancesToggle (no back button)
- Breadcrumbs
- Stepper (all steps completed)
- OtrosAsociadosResultCard
- Footer with "Imprimir/Guardar" and "Finalizar" buttons
- Build result from sessionStorage data
- Clear sessionStorage on finish
- Navigate to /pagos on finish

---

### Phase 6: Validation Schemas (Optional - 15 min)

#### Step 6.1: Create Validation Schemas
**File**: `src/schemas/otrosAsociadosPaymentSchemas.ts`

Create:
- `otrosAsociadosDetailsSchema` - yup schema for step 1
- `validatePaymentAmounts()` - Helper for amount validation
- `validateSufficientBalance()` - Helper for balance validation

---

## File Creation Order

Execute in this order to manage dependencies correctly:

```
1. src/types/otros-asociados-payment.ts
2. src/types/index.ts (update)
3. src/mocks/mockOtrosAsociadosPaymentData.ts
4. src/mocks/index.ts (update)
5. src/atoms/Checkbox.tsx
6. src/atoms/index.ts (update)
7. src/molecules/BeneficiaryListItem.tsx
8. src/molecules/PayableProductCard.tsx
9. src/molecules/ConfirmationRow.tsx
10. src/molecules/index.ts (update)
11. src/organisms/BeneficiarySelectionCard.tsx
12. src/organisms/OtrosAsociadosDetailsCard.tsx
13. src/organisms/OtrosAsociadosConfirmationCard.tsx
14. src/organisms/OtrosAsociadosResultCard.tsx
15. src/organisms/index.ts (update)
16. app/(authenticated)/pagos/otros-asociados/page.tsx
17. app/(authenticated)/pagos/otros-asociados/pago/page.tsx
18. app/(authenticated)/pagos/otros-asociados/pago/confirmacion/page.tsx
19. app/(authenticated)/pagos/otros-asociados/pago/sms/page.tsx
20. app/(authenticated)/pagos/otros-asociados/pago/resultado/page.tsx
21. src/schemas/otrosAsociadosPaymentSchemas.ts (optional)
```

---

## Directory Structure After Implementation

```
src/
├── atoms/
│   ├── Checkbox.tsx                           # NEW
│   └── index.ts                               # UPDATED
├── molecules/
│   ├── BeneficiaryListItem.tsx                # NEW
│   ├── PayableProductCard.tsx                 # NEW
│   ├── ConfirmationRow.tsx                    # NEW
│   └── index.ts                               # UPDATED
├── organisms/
│   ├── BeneficiarySelectionCard.tsx           # NEW
│   ├── OtrosAsociadosDetailsCard.tsx          # NEW
│   ├── OtrosAsociadosConfirmationCard.tsx     # NEW
│   ├── OtrosAsociadosResultCard.tsx           # NEW
│   └── index.ts                               # UPDATED
├── types/
│   ├── otros-asociados-payment.ts             # NEW
│   └── index.ts                               # UPDATED
├── mocks/
│   ├── mockOtrosAsociadosPaymentData.ts       # NEW
│   └── index.ts                               # UPDATED
└── schemas/
    └── otrosAsociadosPaymentSchemas.ts        # NEW (optional)

app/(authenticated)/pagos/otros-asociados/
├── page.tsx                                   # NEW - Beneficiary selection
└── pago/
    ├── page.tsx                               # NEW - Step 1: Details
    ├── confirmacion/
    │   └── page.tsx                           # NEW - Step 2: Confirmation
    ├── sms/
    │   └── page.tsx                           # NEW - Step 3: SMS
    └── resultado/
        └── page.tsx                           # NEW - Step 4: Result
```

---

## SessionStorage Keys

| Key | Purpose | Type |
|-----|---------|------|
| `otrosAsociadosBeneficiary` | Selected beneficiary | JSON (RegisteredBeneficiary) |
| `otrosAsociadosAccountId` | Selected source account ID | string |
| `otrosAsociadosProducts` | Selected products with amounts | JSON (PayableProduct[]) |
| `otrosAsociadosTotalAmount` | Total payment amount | string (number) |
| `otrosAsociadosConfirmation` | Confirmation data | JSON (OtrosAsociadosConfirmationData) |

---

## Testing Checklist

### Pre-step: Beneficiary Selection
- [ ] Page renders with header and breadcrumbs
- [ ] Beneficiary list displays all mock data
- [ ] Each item shows name, alias, and masked document
- [ ] Clicking item stores data and navigates to step 1
- [ ] Back button navigates to /pagos
- [ ] Empty state displays when no beneficiaries

### Step 1: Details
- [ ] Stepper shows step 1 active
- [ ] Beneficiary name displays in card title
- [ ] Account dropdown shows options with balances
- [ ] Products list with checkboxes
- [ ] Amount input appears when product selected
- [ ] Total updates dynamically
- [ ] hideBalances toggle works
- [ ] Validation errors display
- [ ] Navigation works correctly

### Step 2: Confirmation
- [ ] Stepper shows steps 1-2 active
- [ ] All payer and product info displays
- [ ] hideBalances toggle works
- [ ] Navigation works correctly

### Step 3: SMS
- [ ] Stepper shows steps 1-3 active
- [ ] 6-digit code input works
- [ ] Resend link with cooldown
- [ ] Code validation (test: "123456")
- [ ] Loading state during verification
- [ ] Error messages display

### Step 4: Result
- [ ] Stepper shows all steps complete
- [ ] Success/error icon displays correctly
- [ ] Transaction details display
- [ ] hideBalances toggle works
- [ ] Print/Save triggers print dialog
- [ ] Finish clears session and navigates

---

## Key Implementation Notes

1. **Reuse CodeInputCard**: The SMS step should reuse the existing `CodeInputCard` organism from feature 09a.

2. **Session Management**: All flow data is stored in sessionStorage to persist across page navigation. Clean up on flow completion or abandonment.

3. **Validation Strategy**: Use inline validation in pages rather than complex schemas for simplicity. The optional yup schemas are for potential future react-hook-form integration.

4. **Mock Data**: Test SMS code is "123456". Any other code returns an error.

5. **Currency Formatting**: Use existing `formatCurrency` and `maskCurrency` utilities from `src/utils`.

6. **hideBalances Pattern**: Apply consistently across all monetary displays using `useUIContext()`.

7. **Product Selection Logic**:
   - Checkbox toggles `isSelected`
   - Amount input only shows when selected
   - Default amount can be minimumPayment or 0
   - Total = sum of all selected product amounts

---

## Dependencies Summary

### npm Packages (Already Installed)
- `react-hook-form` - Form handling (optional use)
- `yup` - Validation schemas (optional use)

### Internal Dependencies
- UIContext for hideBalances state
- useWelcomeBar hook for welcome bar visibility
- Existing payment flow components (Stepper, CodeInputCard, etc.)

---

**Status**: Ready for Implementation
**Next Step**: Begin Phase 1 (Types & Mock Data)
