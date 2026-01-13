# Feature 10 - Transferencias: Implementation Plan

**Feature**: Internal Transfers - Between My Accounts (Entre mis Cuentas)
**Version**: 1.0
**Created**: 2026-01-13
**Status**: Ready for Implementation

---

## Overview

This document outlines the step-by-step implementation plan for the "Transferencias Internas - Entre mis Cuentas" feature. The feature allows users to transfer money between their own financial products within Coasmedas through a 4-step flow with SMS verification.

---

## Prerequisites

Before starting implementation, verify these existing components are available:

### From 09a-pagos (Already Implemented)

| Component | Location | Purpose |
|-----------|----------|---------|
| `StepperCircle` | `src/atoms/StepperCircle.tsx` | Individual step circle |
| `StepperConnector` | `src/atoms/StepperConnector.tsx` | Line between steps |
| `Stepper` | `src/molecules/Stepper.tsx` | Complete stepper component |
| `CodeInput` | `src/atoms/CodeInput.tsx` | Single digit input |
| `CodeInputGroup` | `src/molecules/CodeInputGroup.tsx` | Group of 6 inputs |
| `CodeInputCard` | `src/organisms/CodeInputCard.tsx` | SMS verification card |
| `Step` | `src/types/stepper.ts` | Step type definition |

### General Components (Already Available)

- `Card`, `Button`, `BackButton`, `Divider` (atoms)
- `Breadcrumbs`, `HideBalancesToggle` (molecules)
- `formatCurrency`, `maskCurrency`, `maskNumber` (utils)
- `UIContext`, `useWelcomeBar` (contexts/hooks)

---

## Implementation Phases

### Phase 1: Type Definitions & Mock Data

**Objective**: Establish data structures and mock data for development.

#### Step 1.1: Create Transfer Type Definitions

**File**: `src/types/transfer.ts`

```typescript
// Types to create:
- TransferAccount          // User account for source selection
- DestinationProduct       // Destination product for transfer
- TransferDetailsFormData  // Step 1 form data
- TransferConfirmationData // Step 2 confirmation display
- SMSVerificationFormData  // Step 3 SMS code
- TransferResult           // Step 4 transaction result
- TransferFlowState        // Complete flow state
- InternalTransferOption   // Flow selection card data
```

**Acceptance Criteria**:
- [ ] All interfaces defined with proper TypeScript types
- [ ] Export added to `src/types/index.ts`

---

#### Step 1.2: Create Mock Data

**File**: `src/mocks/mockTransferData.ts`

**Mock Data to Create**:
```typescript
- mockTransferAccounts: TransferAccount[]     // 3 source accounts
- mockDestinationProducts: DestinationProduct[] // 4 destination products
- mockUserData: { name, document }            // User info for confirmation
- mockTransferResult: TransferResult          // Success result
- mockTransferResultError: TransferResult     // Error result
- TRANSFER_STEPS: Step[]                      // 4 stepper steps
- MOCK_VALID_CODE: string                     // "123456" for testing
```

**Acceptance Criteria**:
- [ ] All mock data created with realistic values
- [ ] Export added to `src/mocks/index.ts`

---

### Phase 2: Molecules

**Objective**: Create reusable flow selection card component.

#### Step 2.1: Create FlowOptionCard

**File**: `src/molecules/FlowOptionCard.tsx`

**Component Specification**:
```typescript
interface FlowOptionCardProps {
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}
```

**Styling**:
- Border: `1px dashed #B1B1B1`
- Border radius: `8px`
- Padding: `20px`
- Hover: `bg-[#F0F9FF]`, `border-[#1D4E8F]`
- Disabled: 50% opacity, not-allowed cursor

**Acceptance Criteria**:
- [ ] Component renders with title and description
- [ ] Hover state changes background and border
- [ ] Disabled state prevents click and shows visual feedback
- [ ] Export added to `src/molecules/index.ts`

---

### Phase 3: Organisms

**Objective**: Create main content cards for each step.

#### Step 3.1: Create InternasFlowGrid

**File**: `src/organisms/InternasFlowGrid.tsx`

**Purpose**: Grid of 4 internal transfer flow options.

```typescript
interface InternasFlowGridProps {
  onSelectFlow: (flowId: string) => void;
  className?: string;
}
```

**Layout**:
- Card container with header and description
- 2x2 grid of `FlowOptionCard` components
- Only "Entre mis cuentas" enabled; others disabled

**Acceptance Criteria**:
- [ ] Displays 4 flow options in responsive grid
- [ ] "Entre mis cuentas" is clickable
- [ ] Other options show disabled state
- [ ] Export added to `src/organisms/index.ts`

---

#### Step 3.2: Create TransferDetailsCard

**File**: `src/organisms/TransferDetailsCard.tsx`

**Purpose**: Step 1 form with source, destination, and amount fields.

```typescript
interface TransferDetailsCardProps {
  accounts: TransferAccount[];
  destinations: DestinationProduct[];
  selectedSourceId: string;
  selectedDestinationId: string;
  amount: string;
  onSourceChange: (accountId: string) => void;
  onDestinationChange: (productId: string) => void;
  onAmountChange: (amount: string) => void;
  hideBalances: boolean;
  error?: string;
}
```

**Form Fields**:
1. Source account dropdown (shows balance)
2. Destination product dropdown (excludes selected source)
3. Amount input with currency formatting

**Acceptance Criteria**:
- [ ] Source dropdown shows accounts with masked numbers and balances
- [ ] Destination dropdown excludes selected source account
- [ ] Amount field formats with Colombian peso separators
- [ ] Balance respects hideBalances setting
- [ ] Error message displays when provided
- [ ] Export added to `src/organisms/index.ts`

---

#### Step 3.3: Create TransferConfirmationCard

**File**: `src/organisms/TransferConfirmationCard.tsx`

**Purpose**: Step 2 summary of transaction details.

```typescript
interface TransferConfirmationCardProps {
  confirmationData: TransferConfirmationData;
  hideBalances: boolean;
}
```

**Display Fields**:
- Holder name
- Masked document number
- Source account (with masked number)
- Destination product (with masked number)
- Transfer amount (respects hideBalances)

**Acceptance Criteria**:
- [ ] All transaction details display correctly
- [ ] Divider lines separate sections
- [ ] Amount respects hideBalances setting
- [ ] Export added to `src/organisms/index.ts`

---

#### Step 3.4: Create TransferResultCard

**File**: `src/organisms/TransferResultCard.tsx`

**Purpose**: Step 4 transaction result display.

```typescript
interface TransferResultCardProps {
  result: TransferResult;
  hideBalances: boolean;
}
```

**Display Elements**:
- Success/error icon (checkmark or X)
- Title: "Transaccion Exitosa" or "Transaccion Fallida"
- Transaction details table
- Color-coded description (green for success, red for error)

**Acceptance Criteria**:
- [ ] Success state shows teal checkmark icon
- [ ] Error state shows red X icon
- [ ] All transaction details display correctly
- [ ] Description color matches transaction status
- [ ] Export added to `src/organisms/index.ts`

---

### Phase 4: Utility Functions

**Objective**: Create helper functions for transfer flow.

#### Step 4.1: Create Transfer Helpers

**File**: `src/utils/transferHelpers.ts`

**Functions to Create**:
```typescript
- hasInsufficientBalance(account, amount): boolean
- isValidTransferAmount(amount, min?, max?): boolean
- formatAccountOption(account, hideBalance, ...): string
- clearTransferFlowData(): void
- hasRequiredDataForStep(step): boolean
```

**Acceptance Criteria**:
- [ ] All utility functions implemented
- [ ] Functions handle edge cases
- [ ] Export added to `src/utils/index.ts`

---

### Phase 5: Page Implementation

**Objective**: Create all pages in the transfer flow.

#### Step 5.1: Flow Selection Page

**File**: `app/(authenticated)/transferencias/internas/page.tsx`

**Route**: `/transferencias/internas`

**Page Structure**:
1. Header: BackButton + "Internas" title + HideBalancesToggle
2. Breadcrumbs: Inicio / Transferencias / Internas
3. InternasFlowGrid component

**Behavior**:
- Back button navigates to `/home`
- "Entre mis cuentas" navigates to step 1
- Other options are disabled

**Acceptance Criteria**:
- [ ] Page renders with correct layout
- [ ] Breadcrumbs display correctly
- [ ] Flow selection navigates to step 1
- [ ] useWelcomeBar(false) hides welcome bar

---

#### Step 5.2: Step 1 - Details Page

**File**: `app/(authenticated)/transferencias/internas/entre-mis-cuentas/page.tsx`

**Route**: `/transferencias/internas/entre-mis-cuentas`

**Page Structure**:
1. Header: BackButton + "Entre mis Cuentas" title + HideBalancesToggle
2. Breadcrumbs: Inicio / Transferencias / Entre mis Cuentas
3. Stepper (step 1 active)
4. TransferDetailsCard
5. Actions: "Volver" link + "Confirmar" button

**State Management**:
- Local state for form fields
- Validation on "Confirmar" click
- Store data in sessionStorage on success

**Validation Rules**:
- Source account required
- Destination product required (different from source)
- Amount > 0
- Amount <= source account balance

**Acceptance Criteria**:
- [ ] Stepper shows step 1 as active
- [ ] Form fields work correctly
- [ ] Validation errors display
- [ ] "Volver" navigates to flow selection
- [ ] "Confirmar" validates and navigates to step 2
- [ ] Data stored in sessionStorage

---

#### Step 5.3: Step 2 - Confirmation Page

**File**: `app/(authenticated)/transferencias/internas/entre-mis-cuentas/confirmacion/page.tsx`

**Route**: `/transferencias/internas/entre-mis-cuentas/confirmacion`

**Page Structure**:
1. Header (same as step 1)
2. Breadcrumbs
3. Stepper (step 2 active, step 1 completed)
4. TransferConfirmationCard
5. Actions: "Volver" link + "Confirmar Pago" button

**Behavior**:
- Load data from sessionStorage on mount
- Redirect to step 1 if no data
- Store confirmation data on "Confirmar Pago"
- Navigate to step 3

**Acceptance Criteria**:
- [ ] Stepper shows step 2 active, step 1 completed
- [ ] Confirmation data displays correctly
- [ ] Redirects to step 1 if no session data
- [ ] "Volver" navigates to step 1
- [ ] "Confirmar Pago" navigates to step 3

---

#### Step 5.4: Step 3 - SMS Verification Page

**File**: `app/(authenticated)/transferencias/internas/entre-mis-cuentas/sms/page.tsx`

**Route**: `/transferencias/internas/entre-mis-cuentas/sms`

**Page Structure**:
1. Header (same as previous)
2. Breadcrumbs
3. Stepper (step 3 active, steps 1-2 completed)
4. CodeInputCard (reused from 09a-pagos)
5. Actions: "Volver" link + "Pagar" button

**Behavior**:
- 6-digit OTP input with auto-advance
- Resend code functionality
- Validate code on "Pagar" (mock: "123456" is valid)
- Loading state during verification
- Navigate to step 4 on success
- Show error on invalid code

**Acceptance Criteria**:
- [ ] Stepper shows step 3 active
- [ ] OTP input works with auto-advance
- [ ] Resend link functions (with cooldown)
- [ ] Valid code ("123456") navigates to result
- [ ] Invalid code shows error message
- [ ] Loading state during verification
- [ ] "Volver" navigates to step 2

---

#### Step 5.5: Step 4 - Result Page

**File**: `app/(authenticated)/transferencias/internas/entre-mis-cuentas/resultado/page.tsx`

**Route**: `/transferencias/internas/entre-mis-cuentas/resultado`

**Page Structure**:
1. Header (back button disabled)
2. Breadcrumbs
3. Stepper (all 4 steps completed)
4. TransferResultCard
5. Actions: "Imprimir/Guardar" + "Realizar otra transaccion" + "Finalizar"

**Behavior**:
- Display mock success result
- "Imprimir/Guardar" triggers window.print()
- "Realizar otra transaccion" clears data, navigates to step 1
- "Finalizar" clears data, navigates to home
- Clean sessionStorage on unmount

**Acceptance Criteria**:
- [ ] Stepper shows all steps completed
- [ ] Result card displays correctly
- [ ] Print button works
- [ ] New transaction resets flow
- [ ] Finish navigates to home
- [ ] Session data cleared properly

---

### Phase 6: Integration & Testing

**Objective**: Verify complete flow and fix issues.

#### Step 6.1: Full Flow Testing

**Test Scenarios**:

1. **Happy Path**:
   - [ ] Navigate from flow selection to result
   - [ ] Verify data persistence between steps
   - [ ] Verify stepper state at each step
   - [ ] Verify success result display

2. **Validation**:
   - [ ] Empty source account shows error
   - [ ] Empty destination shows error
   - [ ] Zero amount shows error
   - [ ] Insufficient balance shows error
   - [ ] Invalid SMS code shows error

3. **Navigation**:
   - [ ] Back button at each step works
   - [ ] Direct URL access to later steps redirects
   - [ ] Browser back button behavior

4. **State Management**:
   - [ ] Data persists on page refresh (within step)
   - [ ] Data cleared on "Finalizar"
   - [ ] Data cleared on new transaction

---

#### Step 6.2: Responsive Testing

**Breakpoints to Test**:

| Breakpoint | Width | Checks |
|------------|-------|--------|
| Mobile | <640px | Single column layout, readable stepper |
| Tablet | 640-1023px | Adaptive layout |
| Desktop | >=1024px | Full 2-column grid where applicable |

**Critical Elements**:
- [ ] Flow grid responsive (2x2 on desktop, 1 column on mobile)
- [ ] Stepper readable on all sizes
- [ ] Form fields usable on mobile
- [ ] OTP inputs sized for touch

---

#### Step 6.3: Accessibility Testing

**WCAG 2.1 AA Checks**:
- [ ] Keyboard navigation through all elements
- [ ] Focus states visible on all interactive elements
- [ ] Form fields have proper labels
- [ ] Error messages linked to inputs
- [ ] Stepper announces current step
- [ ] Color contrast meets requirements

---

## File Checklist

### New Files to Create

| File | Phase | Priority |
|------|-------|----------|
| `src/types/transfer.ts` | 1.1 | High |
| `src/mocks/mockTransferData.ts` | 1.2 | High |
| `src/molecules/FlowOptionCard.tsx` | 2.1 | High |
| `src/organisms/InternasFlowGrid.tsx` | 3.1 | High |
| `src/organisms/TransferDetailsCard.tsx` | 3.2 | High |
| `src/organisms/TransferConfirmationCard.tsx` | 3.3 | High |
| `src/organisms/TransferResultCard.tsx` | 3.4 | High |
| `src/utils/transferHelpers.ts` | 4.1 | Medium |
| `app/(authenticated)/transferencias/internas/page.tsx` | 5.1 | High |
| `app/(authenticated)/transferencias/internas/entre-mis-cuentas/page.tsx` | 5.2 | High |
| `app/(authenticated)/transferencias/internas/entre-mis-cuentas/confirmacion/page.tsx` | 5.3 | High |
| `app/(authenticated)/transferencias/internas/entre-mis-cuentas/sms/page.tsx` | 5.4 | High |
| `app/(authenticated)/transferencias/internas/entre-mis-cuentas/resultado/page.tsx` | 5.5 | High |

### Files to Update

| File | Change |
|------|--------|
| `src/types/index.ts` | Add transfer exports |
| `src/mocks/index.ts` | Add mock data exports |
| `src/molecules/index.ts` | Add FlowOptionCard export |
| `src/organisms/index.ts` | Add organism exports |
| `src/utils/index.ts` | Add helper exports |

---

## Implementation Order Summary

```
Phase 1: Foundation
  1.1 Create src/types/transfer.ts
  1.2 Create src/mocks/mockTransferData.ts

Phase 2: Molecules
  2.1 Create src/molecules/FlowOptionCard.tsx

Phase 3: Organisms
  3.1 Create src/organisms/InternasFlowGrid.tsx
  3.2 Create src/organisms/TransferDetailsCard.tsx
  3.3 Create src/organisms/TransferConfirmationCard.tsx
  3.4 Create src/organisms/TransferResultCard.tsx

Phase 4: Utilities
  4.1 Create src/utils/transferHelpers.ts

Phase 5: Pages
  5.1 Create flow selection page
  5.2 Create step 1 page
  5.3 Create step 2 page
  5.4 Create step 3 page
  5.5 Create step 4 page

Phase 6: Testing
  6.1 Full flow testing
  6.2 Responsive testing
  6.3 Accessibility testing
```

---

## Dependencies

### NPM Packages (Already Installed)
- react-hook-form (optional for this feature)
- yup (optional for validation)

### Internal Dependencies
- Components from 09a-pagos (Stepper, CodeInputCard)
- UIContext for hideBalances
- Existing utility functions

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Stepper component not found | Verify 09a-pagos implementation exists |
| CodeInputCard missing | Check organisms exports |
| Session data loss on refresh | Use sessionStorage (browser native) |
| Validation inconsistencies | Create centralized validation utils |

---

## Success Criteria

1. **Functional**: Complete transfer flow works end-to-end
2. **Visual**: Matches Figma designs exactly
3. **Responsive**: Works on mobile, tablet, and desktop
4. **Accessible**: Keyboard navigable, screen reader friendly
5. **Maintainable**: Follows Atomic Design, TypeScript strict mode

---

## References

- [spec.md](./spec.md) - Full technical specification
- [references.md](./references.md) - Design analysis and Figma links
- [Design System](/.claude/design-system.md) - Colors, typography, spacing
- [Coding Standards](/.claude/coding-standards.md) - Code style guidelines

---

**Author**: Claude Code
**Last Updated**: 2026-01-13
