# Feature 10a - Transferencias: A Cuentas de mi Red - Implementation Plan

**Feature**: Internal Transfers - To My Network Accounts
**Version**: 1.0
**Status**: Ready for Implementation
**Created**: 2026-01-13

---

## Overview

This implementation plan outlines the step-by-step process to build the "A Cuentas de mi Red" transfer feature. This is a 4-step multi-page flow allowing users to transfer money to pre-registered network contacts.

---

## Prerequisites

Before starting implementation, ensure:
- [ ] Feature 10 (Entre mis cuentas) is complete - provides reusable components
- [ ] Feature 09a (Pagos) is complete - provides Stepper, CodeInputCard
- [ ] Design approval from stakeholders
- [ ] Access to Figma designs (see [references.md](./references.md))

---

## Existing Components to Reuse

### Already Available (No changes needed)
| Component | Type | Location |
|-----------|------|----------|
| `Stepper` | molecule | `src/molecules/Stepper.tsx` |
| `CodeInputGroup` | molecule | `src/molecules/CodeInputGroup.tsx` |
| `CodeInputCard` | organism | `src/organisms/CodeInputCard.tsx` |
| `BackButton` | atom | `src/atoms/BackButton.tsx` |
| `Button` | atom | `src/atoms/Button.tsx` |
| `Avatar` | atom | `src/atoms/Avatar.tsx` |
| `ChevronIcon` | atom | `src/atoms/ChevronIcon.tsx` |
| `Card` | atom | `src/atoms/Card.tsx` |
| `Divider` | atom | `src/atoms/Divider.tsx` |
| `Breadcrumbs` | molecule | `src/molecules/Breadcrumbs.tsx` |
| `HideBalancesToggle` | molecule | `src/molecules/HideBalancesToggle.tsx` |

### Utilities to Reuse
- `formatCurrency` - Format as Colombian Peso
- `maskCurrency` - Mask currency values
- `maskNumber` - Mask account numbers
- `generateInitials` - Get initials from name

---

## Implementation Phases

### Phase 1: Foundation (Types & Mock Data)
**Estimated items: 2 files**

#### Task 1.1: Create Type Definitions
**File**: `src/types/networkTransfer.ts`

Create types for:
- `RegisteredNetworkAccount` - Recipient contact info
- `NetworkProduct` - Recipient's account product
- `SourceAccount` - User's own account for transfer source
- `NetworkTransferFormData` - Step 2 form data
- `NetworkTransferResult` - Step 4 result data
- `NetworkTransferFlowState` - Complete flow state

#### Task 1.2: Update Type Exports
**File**: `src/types/index.ts`

Add export:
```typescript
export * from './networkTransfer';
```

#### Task 1.3: Create Mock Data
**File**: `src/mocks/mockNetworkTransferData.ts`

Create mock data for:
- `mockRegisteredAccounts` - 3 registered network contacts
- `mockSourceAccounts` - User's own accounts (3 accounts)
- `mockNetworkTransferResult` - Success result
- `mockNetworkTransferResultError` - Error result
- `NETWORK_TRANSFER_STEPS` - Stepper configuration
- `MOCK_VALID_CODE` - SMS code for testing ("123456")

#### Task 1.4: Update Mock Exports
**File**: `src/mocks/index.ts`

Add export:
```typescript
export * from './mockNetworkTransferData';
```

---

### Phase 2: Molecules
**Estimated items: 4 new components**

#### Task 2.1: Create RegisteredAccountItem
**File**: `src/molecules/RegisteredAccountItem.tsx`

A clickable list item showing:
- Avatar with initials (using existing Avatar atom)
- Recipient name (uppercase, navy blue)
- Product count text
- Right chevron icon
- Bottom border separator

Props:
- `name: string`
- `productCount: number`
- `onClick: () => void`
- `className?: string`

#### Task 2.2: Create DestinationProductCard
**File**: `src/molecules/DestinationProductCard.tsx`

A card displaying the selected destination product:
- Product name with type and masked number
- Selected/unselected visual states
- Optional click handler

Props:
- `productName: string`
- `maskedNumber: string`
- `productType: string`
- `isSelected?: boolean`
- `onClick?: () => void`
- `className?: string`

#### Task 2.3: Create TransferAmountInput
**File**: `src/molecules/TransferAmountInput.tsx`

Currency input field with:
- "$" prefix symbol
- Right-aligned numeric value
- Colombian number formatting (dots as thousand separators)
- Underline border style
- Error message display

Props:
- `value: string`
- `onChange: (value: string) => void`
- `label?: string`
- `error?: string`
- `disabled?: boolean`
- `className?: string`

#### Task 2.4: Create InfoNoteBox
**File**: `src/molecules/InfoNoteBox.tsx`

Info note component with:
- Light blue background (`#F0F9FF`)
- Blue left border (`#007FFF`)
- Navy text color

Props:
- `children: React.ReactNode`
- `className?: string`

#### Task 2.5: Update Molecules Index
**File**: `src/molecules/index.ts`

Add exports:
```typescript
export { RegisteredAccountItem } from './RegisteredAccountItem';
export { DestinationProductCard } from './DestinationProductCard';
export { TransferAmountInput } from './TransferAmountInput';
export { InfoNoteBox } from './InfoNoteBox';
```

---

### Phase 3: Organisms
**Estimated items: 3 new components**

#### Task 3.1: Create RegisteredAccountsList
**File**: `src/organisms/RegisteredAccountsList.tsx`

List container organism with:
- Section title and description
- Border container for list items
- Map of `RegisteredAccountItem` components
- Empty state when no accounts
- `InfoNoteBox` with registration instructions

Props:
- `accounts: RegisteredNetworkAccount[]`
- `onSelectAccount: (account: RegisteredNetworkAccount) => void`
- `className?: string`

#### Task 3.2: Create NetworkTransferForm
**File**: `src/organisms/NetworkTransferForm.tsx`

Transfer details form with:
- Title showing recipient name
- Source account dropdown (showing balances)
- Destination product card (pre-selected)
- Transfer amount input
- Captcha placeholder section
- Error message display

Props:
- `recipientName: string`
- `sourceAccounts: SourceAccount[]`
- `destinationProduct: NetworkProduct`
- `selectedSourceId: string`
- `amount: string`
- `onSourceChange: (accountId: string) => void`
- `onAmountChange: (amount: string) => void`
- `hideBalances: boolean`
- `error?: string`

#### Task 3.3: Create NetworkTransferResultCard
**File**: `src/organisms/NetworkTransferResultCard.tsx`

Transaction result card with:
- Success/error icon (teal checkmark or red X)
- Status title
- Transfer details section (source, recipient, destination, amount, cost)
- Divider
- Transaction metadata section (date, time, approval #, description)

Props:
- `result: NetworkTransferResult`
- `hideBalances: boolean`

#### Task 3.4: Update Organisms Index
**File**: `src/organisms/index.ts`

Add exports:
```typescript
export { RegisteredAccountsList } from './RegisteredAccountsList';
export { NetworkTransferForm } from './NetworkTransferForm';
export { NetworkTransferResultCard } from './NetworkTransferResultCard';
```

---

### Phase 4: Utility Functions (Optional)
**Estimated items: 1 file**

#### Task 4.1: Create Network Transfer Helpers
**File**: `src/utils/networkTransferHelpers.ts`

Create utility functions:
- `clearNetworkTransferFlowData()` - Clear all sessionStorage data
- `hasRequiredDataForStep(step)` - Validate step prerequisites
- `hasInsufficientBalance(account, amount)` - Balance validation

#### Task 4.2: Update Utils Index
**File**: `src/utils/index.ts`

Add export if file created:
```typescript
export * from './networkTransferHelpers';
```

---

### Phase 5: Pages
**Estimated items: 4 pages**

#### Task 5.1: Create Step 1 - Recipient Selection Page
**File**: `app/(authenticated)/transferencias/internas/cuentas-mi-red/page.tsx`

Features:
- Page header with BackButton, title, HideBalancesToggle
- Breadcrumbs navigation
- Stepper showing step 1 active
- `RegisteredAccountsList` organism
- "Volver" link to internal transfers selection
- Store selected recipient in sessionStorage on selection
- Navigate to `/detalle` on account click

#### Task 5.2: Create Step 2 - Transfer Details Page
**File**: `app/(authenticated)/transferencias/internas/cuentas-mi-red/detalle/page.tsx`

Features:
- Same header pattern as Step 1
- Stepper showing step 2 active, step 1 completed
- `NetworkTransferForm` organism
- Form validation (source required, amount > 0, sufficient balance)
- "Volver" link to Step 1
- "Confirmar" button to Step 3
- Read recipient from sessionStorage
- Store source account ID and amount in sessionStorage
- Redirect to Step 1 if no session data

#### Task 5.3: Create Step 3 - SMS Verification Page
**File**: `app/(authenticated)/transferencias/internas/cuentas-mi-red/verificacion/page.tsx`

Features:
- Same header pattern
- Stepper showing step 3 active, steps 1-2 completed
- Reuse existing `CodeInputCard` organism
- 6-digit code input with auto-advance
- "Reenviar" resend functionality
- "Volver" link to Step 2
- "Pagar" button to verify and proceed
- Loading state during verification
- Error display for invalid code
- Valid code ("123456") navigates to result
- Redirect to Step 1 if no session data

#### Task 5.4: Create Step 4 - Result Page
**File**: `app/(authenticated)/transferencias/internas/cuentas-mi-red/resultado/page.tsx`

Features:
- Same header pattern (BackButton disabled)
- Stepper showing all 4 steps completed
- `NetworkTransferResultCard` organism
- Construct result from sessionStorage data
- Three action buttons:
  - "Imprimir/Guardar" - window.print()
  - "Realizar otra transacción" - return to Step 1
  - "Finalizar" - navigate to home
- Clear sessionStorage on exit
- Redirect to Step 1 if no session data

---

### Phase 6: Integration
**Estimated items: 1 update**

#### Task 6.1: Update InternasFlowGrid
**File**: `src/organisms/InternasFlowGrid.tsx`

Enable the "A cuentas de mi red" option:
- Update the flow option to be clickable
- Set href to `/transferencias/internas/cuentas-mi-red`
- Remove any disabled state if present

---

### Phase 7: Testing & Refinement
**Manual testing required**

#### Task 7.1: Happy Path Testing
- [ ] Complete full flow from recipient selection to result
- [ ] Verify all data persists correctly between steps
- [ ] Verify stepper progress updates correctly
- [ ] Verify result displays all transaction details

#### Task 7.2: Navigation Testing
- [ ] Test "Volver" links at each step
- [ ] Test browser back button behavior
- [ ] Test direct URL access to each step (should redirect appropriately)
- [ ] Test page refresh at each step

#### Task 7.3: Validation Testing
- [ ] Empty source account selection
- [ ] Zero amount
- [ ] Amount exceeding balance
- [ ] Incomplete SMS code
- [ ] Invalid SMS code (not "123456")

#### Task 7.4: UI/UX Testing
- [ ] Test `hideBalances` toggle at each step
- [ ] Verify balance masking works correctly
- [ ] Test empty registered accounts list
- [ ] Verify loading states

#### Task 7.5: Responsive Testing
- [ ] Desktop (≥1024px)
- [ ] Tablet (640-1023px)
- [ ] Mobile (<640px)

#### Task 7.6: Accessibility Testing
- [ ] Keyboard navigation through all elements
- [ ] Focus states visible
- [ ] Form labels and aria attributes
- [ ] Error message associations

---

## File Checklist

### New Files to Create

| # | Phase | File Path | Status |
|---|-------|-----------|--------|
| 1 | 1 | `src/types/networkTransfer.ts` | ⬜ |
| 2 | 1 | `src/mocks/mockNetworkTransferData.ts` | ⬜ |
| 3 | 2 | `src/molecules/RegisteredAccountItem.tsx` | ⬜ |
| 4 | 2 | `src/molecules/DestinationProductCard.tsx` | ⬜ |
| 5 | 2 | `src/molecules/TransferAmountInput.tsx` | ⬜ |
| 6 | 2 | `src/molecules/InfoNoteBox.tsx` | ⬜ |
| 7 | 3 | `src/organisms/RegisteredAccountsList.tsx` | ⬜ |
| 8 | 3 | `src/organisms/NetworkTransferForm.tsx` | ⬜ |
| 9 | 3 | `src/organisms/NetworkTransferResultCard.tsx` | ⬜ |
| 10 | 4 | `src/utils/networkTransferHelpers.ts` (optional) | ⬜ |
| 11 | 5 | `app/(authenticated)/transferencias/internas/cuentas-mi-red/page.tsx` | ⬜ |
| 12 | 5 | `app/(authenticated)/transferencias/internas/cuentas-mi-red/detalle/page.tsx` | ⬜ |
| 13 | 5 | `app/(authenticated)/transferencias/internas/cuentas-mi-red/verificacion/page.tsx` | ⬜ |
| 14 | 5 | `app/(authenticated)/transferencias/internas/cuentas-mi-red/resultado/page.tsx` | ⬜ |

### Files to Update

| # | Phase | File Path | Change |
|---|-------|-----------|--------|
| 1 | 1 | `src/types/index.ts` | Add export |
| 2 | 1 | `src/mocks/index.ts` | Add export |
| 3 | 2 | `src/molecules/index.ts` | Add 4 exports |
| 4 | 3 | `src/organisms/index.ts` | Add 3 exports |
| 5 | 4 | `src/utils/index.ts` | Add export (if helpers created) |
| 6 | 6 | `src/organisms/InternasFlowGrid.tsx` | Enable option |

---

## Implementation Order Summary

```
Phase 1: Foundation
├── 1.1 Create src/types/networkTransfer.ts
├── 1.2 Update src/types/index.ts
├── 1.3 Create src/mocks/mockNetworkTransferData.ts
└── 1.4 Update src/mocks/index.ts

Phase 2: Molecules
├── 2.1 Create RegisteredAccountItem.tsx
├── 2.2 Create DestinationProductCard.tsx
├── 2.3 Create TransferAmountInput.tsx
├── 2.4 Create InfoNoteBox.tsx
└── 2.5 Update src/molecules/index.ts

Phase 3: Organisms
├── 3.1 Create RegisteredAccountsList.tsx
├── 3.2 Create NetworkTransferForm.tsx
├── 3.3 Create NetworkTransferResultCard.tsx
└── 3.4 Update src/organisms/index.ts

Phase 4: Utilities (Optional)
├── 4.1 Create networkTransferHelpers.ts
└── 4.2 Update src/utils/index.ts

Phase 5: Pages
├── 5.1 Create Step 1 page (cuentas-mi-red/page.tsx)
├── 5.2 Create Step 2 page (detalle/page.tsx)
├── 5.3 Create Step 3 page (verificacion/page.tsx)
└── 5.4 Create Step 4 page (resultado/page.tsx)

Phase 6: Integration
└── 6.1 Update InternasFlowGrid.tsx

Phase 7: Testing
├── 7.1 Happy path testing
├── 7.2 Navigation testing
├── 7.3 Validation testing
├── 7.4 UI/UX testing
├── 7.5 Responsive testing
└── 7.6 Accessibility testing
```

---

## Key Differences from "Entre mis cuentas"

| Aspect | Entre mis cuentas | A Cuentas de mi Red |
|--------|-------------------|---------------------|
| Step 1 | Form (source/dest/amount) | Recipient list selection |
| Step 2 | Confirmation review | Form (source/dest/amount) + Captcha |
| Recipients | Own accounts only | Pre-registered network contacts |
| Destination | User's own products | Recipient's products |
| New Components | Uses existing | 4 molecules + 3 organisms |

---

## Notes

- Use sessionStorage for state persistence between steps (consistent with existing transfer flows)
- The SMS code "123456" is the mock valid code for testing
- Captcha section is a placeholder for now (will be integrated later)
- All monetary values should respect the `hideBalances` toggle
- Product numbers should always be masked (e.g., "****4522")
- Recipient names should be displayed in uppercase

---

## References

- [spec.md](./spec.md) - Full technical specification with code examples
- [references.md](./references.md) - Design analysis and Figma links
- [Feature 10 spec](../10-transferencias/spec.md) - Entre mis cuentas flow
- [Feature 09a spec](../09a-pagos/spec.md) - Stepper and OTP components
- [Design System](/.claude/design-system.md) - Color palette, typography
