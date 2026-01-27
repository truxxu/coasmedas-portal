# Feature 10e - Transferencias: A Otros Bancos

## Implementation Plan

**Feature**: External Bank Transfers (A Otros Bancos)
**Route**: `/transferencias/a-otros-bancos`
**Status**: Ready for Implementation

---

## Overview

This plan implements the "A Otros Bancos" (To Other Banks) transfer flow, enabling users to transfer money from their Coasmedas savings accounts to external bank accounts previously registered via the "Inscribir Cuentas" feature (10d).

**Flow**: Details → Confirmation → SMS Verification → Result (4 steps)

---

## Phase 1: Types and Mocks

### Task 1.1: Create Type Definitions

**File**: `src/types/externalTransfer.ts`

Create the following types following the existing `transfer.ts` pattern:

```typescript
// ExternalTransferSourceAccount - Source account for external transfer
// ExternalTransferDestinationAccount - Registered external account
// ExternalTransferFormData - Step 1 form data
// ExternalTransferConfirmationData - Step 2 confirmation display
// ExternalTransferResult - Step 4 transaction result
// ExternalTransferFlowState - Complete flow state
```

### Task 1.2: Update Types Index

**File**: `src/types/index.ts`

Export all new types from `externalTransfer.ts`.

### Task 1.3: Create Mock Data

**File**: `src/mocks/mockExternalTransferData.ts`

Create mock data following `mockTransferData.ts` pattern:

- `mockExternalTransferSourceAccounts` - User's savings accounts
- `mockExternalTransferDestinations` - Registered external accounts (3 accounts: Bancolombia, Davivienda, BBVA)
- `mockExternalTransferUserData` - User holder data
- `mockExternalTransferConfirmation` - Sample confirmation data
- `mockExternalTransferResultSuccess` - Success result
- `mockExternalTransferResultError` - Error result
- `EXTERNAL_TRANSFER_MOCK_VALID_CODE` - "123456"
- `EXTERNAL_TRANSFER_STEPS` - Stepper configuration

### Task 1.4: Update Mocks Index

**File**: `src/mocks/index.ts`

Export all new mocks from `mockExternalTransferData.ts`.

---

## Phase 2: Organisms

### Task 2.1: Create ExternalTransferDetailsCard

**File**: `src/organisms/ExternalTransferDetailsCard.tsx`

Main form card for Step 1 with:

**Props**:
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
  hideBalances: boolean;
  error?: string;
}
```

**Sections**:
1. Card header with title "Transferencias Externas" and description
2. Source account dropdown (shows type + balance)
3. Destination account dropdown (shows alias + bank name)
4. Currency amount input
5. Concept text input
6. Error message display

**Empty State**: When `destinationAccounts.length === 0`, show message with link to `/transferencias/inscribir-cuentas`

**Reference**: Follow `TransferDetailsCard.tsx` patterns

### Task 2.2: Create ExternalTransferConfirmationCard

**File**: `src/organisms/ExternalTransferConfirmationCard.tsx`

Confirmation summary for Step 2 with:

**Props**:
```typescript
interface ExternalTransferConfirmationCardProps {
  confirmationData: ExternalTransferConfirmationData;
  hideBalances: boolean;
}
```

**Sections**:
1. Card header with title "Confirmacion de Transferencia"
2. Holder section (name, document masked, source product)
3. Divider
4. Destination section (holder, bank, account type, account number)
5. Transfer details (amount in bold 18px, concept)

**Reference**: Follow `TransferConfirmationCard.tsx` patterns

### Task 2.3: Create ExternalTransferResultCard

**File**: `src/organisms/ExternalTransferResultCard.tsx`

Transaction result for Step 4 with success and error states:

**Props**:
```typescript
interface ExternalTransferResultCardProps {
  result: ExternalTransferResult;
  hideBalances: boolean;
  onPrint: () => void;
  onNewTransfer: () => void;
  onFinish: () => void;
}
```

**Success State**:
1. Green checkmark icon (60px circle)
2. Title "Transaccion Exitosa"
3. Transfer details rows
4. Divider
5. Transaction metadata (date, time, approval number, description in green)
6. Action buttons: "Imprimir/Guardar", "Realizar otra transaccion", "Finalizar"

**Error State**:
1. Red X icon
2. Title "Transaccion Fallida" (red)
3. Error message
4. Action buttons: "Reintentar", "Volver al inicio"

**Reference**: Follow `TransferResultCard.tsx` patterns

### Task 2.4: Update Organisms Index

**File**: `src/organisms/index.ts`

Add exports for all three new organisms.

---

## Phase 3: Pages

### Task 3.1: Create Step 1 - Details Page

**File**: `app/(authenticated)/transferencias/a-otros-bancos/page.tsx`

**Layout**:
```tsx
<div className="space-y-6">
  {/* Breadcrumbs */}
  <Breadcrumbs items={["Inicio", "Transferencias", "A Otros Bancos"]} />

  {/* Stepper - Step 1 active */}
  <div className="-mx-8 bg-white shadow-sm">
    <Stepper currentStep={1} steps={EXTERNAL_TRANSFER_STEPS} />
  </div>

  {/* Form Card */}
  <ExternalTransferDetailsCard ... />

  {/* Actions: Volver link + Confirmar button */}
  <div className="flex justify-between items-center">...</div>
</div>
```

**Behavior**:
1. Configure WelcomeBar with title "A Otros Bancos" and backHref "/transferencias/internas"
2. Load source accounts and destination accounts from mocks
3. Manage form state: sourceId, destinationId, amount, concept
4. Validate on submit:
   - Source account required
   - Destination account required
   - Amount > 0 and <= source balance
   - Concept required
5. Store in sessionStorage: `externalTransferSourceId`, `externalTransferDestinationId`, `externalTransferAmount`, `externalTransferConcept`
6. Navigate to `/transferencias/a-otros-bancos/confirmacion`

### Task 3.2: Create Step 2 - Confirmation Page

**File**: `app/(authenticated)/transferencias/a-otros-bancos/confirmacion/page.tsx`

**Layout**:
```tsx
<div className="space-y-6">
  {/* Breadcrumbs */}
  {/* Stepper - Step 2 active */}
  {/* ExternalTransferConfirmationCard */}
  {/* Actions: Volver link + Confirmar Pago button */}
</div>
```

**Behavior**:
1. Read transfer data from sessionStorage
2. If missing data, redirect to Step 1
3. Build confirmation data from stored values + mock user data
4. "Volver" returns to Step 1
5. "Confirmar Pago" navigates to `/transferencias/a-otros-bancos/sms`

### Task 3.3: Create Step 3 - SMS Verification Page

**File**: `app/(authenticated)/transferencias/a-otros-bancos/sms/page.tsx`

**Layout**:
```tsx
<div className="space-y-6">
  {/* Breadcrumbs */}
  {/* Stepper - Step 3 active */}
  {/* CodeInputCard (reuse existing) */}
</div>
```

**Behavior**:
1. Read transfer data from sessionStorage, redirect if missing
2. Reuse `CodeInputCard` organism for 6-digit code input
3. Validate code (mock: "123456")
4. On success: Generate result, store in sessionStorage as `externalTransferResult`
5. Navigate to `/transferencias/a-otros-bancos/resultado`
6. On error: Show error message, allow retry

### Task 3.4: Create Step 4 - Result Page

**File**: `app/(authenticated)/transferencias/a-otros-bancos/resultado/page.tsx`

**Layout**:
```tsx
<div className="space-y-6">
  {/* Breadcrumbs */}
  {/* Stepper - All steps completed */}
  {/* ExternalTransferResultCard */}
</div>
```

**Behavior**:
1. Read result from sessionStorage, redirect if missing
2. Display ExternalTransferResultCard
3. Action handlers:
   - "Imprimir/Guardar": Trigger print dialog (or PDF generation)
   - "Realizar otra transaccion": Clear sessionStorage, navigate to Step 1
   - "Finalizar": Clear sessionStorage, navigate to `/home`
4. Clear sessionStorage on component unmount

---

## Phase 4: Navigation Integration (Optional)

### Task 4.1: Add to Transfers Landing Grid

**File**: `app/(authenticated)/transferencias/internas/page.tsx` (if applicable)

Add "A Otros Bancos" option to the transfer type selection grid if not already present.

---

## Session Storage Keys

| Key | Type | Description |
|-----|------|-------------|
| `externalTransferSourceId` | string | Selected source account ID |
| `externalTransferDestinationId` | string | Selected destination account ID |
| `externalTransferAmount` | string | Transfer amount |
| `externalTransferConcept` | string | Transfer concept/description |
| `externalTransferResult` | JSON | Transaction result object |

---

## File Creation Summary

### New Files to Create

| Phase | File | Type |
|-------|------|------|
| 1.1 | `src/types/externalTransfer.ts` | Types |
| 1.3 | `src/mocks/mockExternalTransferData.ts` | Mocks |
| 2.1 | `src/organisms/ExternalTransferDetailsCard.tsx` | Organism |
| 2.2 | `src/organisms/ExternalTransferConfirmationCard.tsx` | Organism |
| 2.3 | `src/organisms/ExternalTransferResultCard.tsx` | Organism |
| 3.1 | `app/(authenticated)/transferencias/a-otros-bancos/page.tsx` | Page |
| 3.2 | `app/(authenticated)/transferencias/a-otros-bancos/confirmacion/page.tsx` | Page |
| 3.3 | `app/(authenticated)/transferencias/a-otros-bancos/sms/page.tsx` | Page |
| 3.4 | `app/(authenticated)/transferencias/a-otros-bancos/resultado/page.tsx` | Page |

### Files to Update

| Phase | File | Change |
|-------|------|--------|
| 1.2 | `src/types/index.ts` | Add exports |
| 1.4 | `src/mocks/index.ts` | Add exports |
| 2.4 | `src/organisms/index.ts` | Add exports |

---

## Implementation Order

Execute tasks in this order to ensure dependencies are met:

1. **Phase 1: Types and Mocks** (Tasks 1.1 → 1.2 → 1.3 → 1.4)
2. **Phase 2: Organisms** (Tasks 2.1 → 2.2 → 2.3 → 2.4)
3. **Phase 3: Pages** (Tasks 3.1 → 3.2 → 3.3 → 3.4)
4. **Phase 4: Integration** (Task 4.1 - if needed)

---

## Reusable Components

| Component | Location | Usage |
|-----------|----------|-------|
| `Card` | atoms | Card containers |
| `Button` | atoms | Primary/secondary buttons |
| `Breadcrumbs` | molecules | Navigation trail |
| `Stepper` | molecules | 4-step progress indicator |
| `HideBalancesToggle` | molecules | Balance visibility |
| `CodeInputCard` | organisms | SMS verification (Step 3) |
| `SuccessIcon` | atoms | Green checkmark |
| `ErrorIcon` | atoms | Red X |

---

## Validation Summary

### Step 1: Details Form
- Source account: Required
- Destination account: Required
- Amount: Required, > 0, <= source balance
- Concept: Required, max 100 chars

### Step 3: SMS Verification
- Code: Required, 6 digits, valid code

---

## Testing Checklist

### Happy Path
- [ ] Navigate to `/transferencias/a-otros-bancos`
- [ ] Select source account
- [ ] Select registered external account
- [ ] Enter valid amount within balance
- [ ] Enter transfer concept
- [ ] Click "Confirmar" → Confirmation page
- [ ] Review details, click "Confirmar Pago" → SMS page
- [ ] Enter "123456" → Success result
- [ ] "Finalizar" returns to home

### Validation Errors
- [ ] Empty source → Error
- [ ] Empty destination → Error
- [ ] Amount = 0 → Error
- [ ] Amount > balance → Error
- [ ] Empty concept → Error
- [ ] Invalid SMS code → Error

### Edge Cases
- [ ] No registered accounts → Empty state with link
- [ ] Direct navigation to step 2/3/4 → Redirect to step 1
- [ ] Hide balances mode → All amounts masked
- [ ] "Realizar otra transaccion" → Clears form, returns to step 1

---

## Design Reference

| Step | Figma Node | Description |
|------|------------|-------------|
| 1 | 842-2 | Details form |
| 2 | 842-5 | Confirmation card |
| 3 | (existing) | SMS verification |
| 4 | 842-9 | Result card |

Base URL: `https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=`

---

## Notes

- **Dependency**: This feature requires registered external accounts from feature 10d (Inscribir Cuentas)
- **Empty State**: If no accounts registered, show helpful message with link to registration
- **Transaction Cost**: Display as $0 (field present for future changes)
- **Print/Save**: Should generate PDF receipt
- **Balance Masking**: Respect `hideBalances` context throughout flow
