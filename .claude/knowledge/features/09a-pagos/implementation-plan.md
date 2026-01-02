# Feature 09a - Pagos: Pago Unificado Flow - Implementation Plan

**Feature**: Unified Payment Flow (Pago Unificado)
**Version**: 1.0
**Status**: Ready to Implement
**Last Updated**: 2025-12-30
**Estimated Duration**: 8-12 hours

---

## Table of Contents

1. [Overview](#overview)
2. [Pre-Implementation Checklist](#pre-implementation-checklist)
3. [Implementation Phases](#implementation-phases)
4. [Detailed Steps](#detailed-steps)
5. [Testing Checkpoints](#testing-checkpoints)
6. [Rollout Strategy](#rollout-strategy)
7. [Success Criteria](#success-criteria)

---

## Overview

This implementation plan provides step-by-step guidance for building the Pago Unificado (Unified Payment) feature. The feature consists of:

- **15 new components** (3 atoms, 4 molecules, 4 organisms, 4 pages)
- **2 type definition files**
- **1 mock data file**
- **1 utility functions file**
- **State management via sessionStorage** (simple approach for MVP)

### Implementation Strategy

The implementation follows the **Atomic Design** methodology, building components from the bottom up:

1. **Types & Foundation** → Define data structures
2. **Atoms** → Build basic UI elements
3. **Molecules** → Compose atoms into functional units
4. **Organisms** → Create complex sections
5. **Pages** → Assemble complete user flows
6. **Testing & Refinement** → Validate and polish

---

## Pre-Implementation Checklist

Before starting implementation, verify:

- [ ] Read and understand `references.md` (design specifications)
- [ ] Read and understand `spec.md` (technical specifications)
- [ ] Understand existing component patterns in the codebase
- [ ] Familiarize with Tailwind CSS v4 syntax
- [ ] Review existing atoms, molecules, and organisms
- [ ] Understand the App Router structure in Next.js 16
- [ ] Know how to use `useWelcomeBar` hook
- [ ] Understand `hideBalances` functionality from UIContext

---

## Implementation Phases

### Phase 1: Foundation (1-2 hours)
- Create type definitions
- Create mock data
- Set up file structure

### Phase 2: Atoms (1-2 hours)
- Build StepperCircle component
- Build StepperConnector component
- Build CodeInput component

### Phase 3: Molecules (2-3 hours)
- Build Stepper component
- Build PaymentSummaryRow component
- Build CodeInputGroup component
- Build TransactionDetailRow component

### Phase 4: Organisms (2-3 hours)
- Build PaymentDetailsCard component
- Build PaymentConfirmationCard component
- Build CodeInputCard component
- Build TransactionResultCard component

### Phase 5: Pages (2-3 hours)
- Create Step 1 page (Details)
- Create Step 2 page (Confirmation)
- Create Step 3 page (Code Input)
- Create Step 4 page (Result)

### Phase 6: Testing & Refinement (1-2 hours)
- Manual testing of complete flow
- Responsive testing
- Accessibility testing
- Edge case testing
- Bug fixes and polish

---

## Detailed Steps

## PHASE 1: Foundation

### Step 1.1: Create Type Definitions for Payment

**File**: `src/types/payment.ts`

**Task**: Create TypeScript interfaces for payment flow

**Implementation**:
```typescript
// Copy implementation from spec.md line 106-181
```

**Reference**: spec.md lines 104-181

**Acceptance Criteria**:
- [ ] File created at `src/types/payment.ts`
- [ ] All 7 interfaces defined:
  - PaymentAccount
  - PendingPayments
  - PaymentDetailsFormData
  - PaymentConfirmationData
  - CodeVerificationFormData
  - TransactionResult
  - PaymentFlowState
- [ ] All interfaces exported
- [ ] No TypeScript errors

---

### Step 1.2: Create Type Definitions for Stepper

**File**: `src/types/stepper.ts`

**Task**: Create TypeScript interfaces for stepper component

**Implementation**:
```typescript
// Copy implementation from spec.md line 186-223
```

**Reference**: spec.md lines 184-223

**Acceptance Criteria**:
- [ ] File created at `src/types/stepper.ts`
- [ ] All 4 types/interfaces defined:
  - Step interface
  - StepStatus type
  - StepperProps interface
  - StepperCircleProps interface
  - StepperConnectorProps interface
- [ ] All types/interfaces exported
- [ ] No TypeScript errors

---

### Step 1.3: Update Types Index

**File**: `src/types/index.ts`

**Task**: Export new type definitions

**Implementation**:
```typescript
// Add to existing exports:
export * from './payment';
export * from './stepper';
```

**Acceptance Criteria**:
- [ ] New exports added
- [ ] No duplicate exports
- [ ] No TypeScript errors

---

### Step 1.4: Create Mock Payment Data

**File**: `src/mocks/mockPaymentData.ts`

**Task**: Create mock data for development and testing

**Implementation**:
```typescript
// Copy implementation from spec.md line 1715-1802
```

**Reference**: spec.md lines 1713-1802

**Acceptance Criteria**:
- [ ] File created at `src/mocks/mockPaymentData.ts`
- [ ] All mock data objects created:
  - mockPaymentAccounts (array with 3 accounts)
  - mockPendingPayments (object with aportes, obligaciones, proteccion, total)
  - mockUserData (object with name, document)
  - mockTransactionResult (success case)
  - mockTransactionResultError (error case)
  - PAYMENT_STEPS (array with 4 steps)
  - MOCK_VALID_CODE (string)
- [ ] All exports are correct
- [ ] No TypeScript errors

---

### Step 1.5: Update Mocks Index

**File**: `src/mocks/index.ts`

**Task**: Export new mock data

**Implementation**:
```typescript
// Add to existing exports:
export * from './mockPaymentData';
```

**Acceptance Criteria**:
- [ ] New export added
- [ ] No duplicate exports
- [ ] No TypeScript errors

---

### Step 1.6: Create Utility Helpers (Optional for MVP)

**File**: `src/utils/paymentHelpers.ts`

**Task**: Create helper functions for payment logic

**Implementation**:
```typescript
// Copy implementation from spec.md line 1670-1706
```

**Reference**: spec.md lines 1668-1706

**Acceptance Criteria**:
- [ ] File created at `src/utils/paymentHelpers.ts`
- [ ] All 4 functions implemented:
  - hasInsufficientBalance
  - formatVerificationCode
  - generateMockSMSCode
  - calculateTotalPayment
- [ ] All functions exported
- [ ] No TypeScript errors

**Note**: This step is optional for MVP. These utilities can be added later if needed.

---

## PHASE 2: Atoms

### Step 2.1: Create StepperCircle Component

**File**: `src/atoms/StepperCircle.tsx`

**Task**: Build individual step indicator for the stepper

**Implementation**:
```typescript
// Copy implementation from spec.md line 246-308
```

**Reference**: spec.md lines 231-310

**Visual States**:
- **Pending**: Gray border, white background, gray number/label
- **Active**: Blue border, blue background, white number, blue bold label
- **Completed**: Blue border, blue background, white checkmark icon, blue label

**Acceptance Criteria**:
- [ ] Component created at `src/atoms/StepperCircle.tsx`
- [ ] Accepts props: stepNumber, label, status
- [ ] Renders circle with correct size (40px × 40px)
- [ ] Shows step number for pending/active states
- [ ] Shows checkmark SVG for completed state
- [ ] Label displays below circle
- [ ] All 3 states styled correctly
- [ ] Uses proper Tailwind classes
- [ ] Includes ARIA attributes (role="presentation")
- [ ] No TypeScript errors

---

### Step 2.2: Create StepperConnector Component

**File**: `src/atoms/StepperConnector.tsx`

**Task**: Build connecting line between stepper circles

**Implementation**:
```typescript
// Copy implementation from spec.md line 327-343
```

**Reference**: spec.md lines 314-345

**Acceptance Criteria**:
- [ ] Component created at `src/atoms/StepperConnector.tsx`
- [ ] Accepts prop: isActive (boolean)
- [ ] Renders horizontal line (height: 2px)
- [ ] Uses flex-1 for responsive width
- [ ] Active state: blue (#007FFF)
- [ ] Inactive state: gray (#E4E6EA)
- [ ] Includes ARIA attributes (role="presentation")
- [ ] No TypeScript errors

---

### Step 2.3: Create CodeInput Component

**File**: `src/atoms/CodeInput.tsx`

**Task**: Build single digit input field for SMS code

**Implementation**:
```typescript
// Copy implementation from spec.md line 368-424
```

**Reference**: spec.md lines 349-426

**Features**:
- Single digit numeric input
- Auto-advance on input
- Backspace navigation
- Focus state
- Error state
- Disabled state

**Acceptance Criteria**:
- [ ] Component created at `src/atoms/CodeInput.tsx`
- [ ] Accepts all required props (value, onChange, onKeyDown, onFocus, etc.)
- [ ] Input styled correctly (48px × 56px)
- [ ] Only accepts single numeric digit
- [ ] Shows error state (red border)
- [ ] Shows focus state (blue ring)
- [ ] Shows disabled state
- [ ] Centered text (24px font size)
- [ ] Includes ARIA label
- [ ] inputMode="numeric" for mobile keyboards
- [ ] No TypeScript errors

---

### Step 2.4: Update Atoms Index

**File**: `src/atoms/index.ts`

**Task**: Export new atom components

**Implementation**:
```typescript
// Add to existing exports:
export { StepperCircle } from './StepperCircle';
export { StepperConnector } from './StepperConnector';
export { CodeInput } from './CodeInput';
```

**Acceptance Criteria**:
- [ ] All 3 new components exported
- [ ] Exports are named exports
- [ ] No duplicate exports
- [ ] No TypeScript errors

---

## PHASE 3: Molecules

### Step 3.1: Create Stepper Component

**File**: `src/molecules/Stepper.tsx`

**Task**: Build multi-step progress indicator

**Implementation**:
```typescript
// Copy implementation from spec.md line 447-493
```

**Reference**: spec.md lines 432-495

**Features**:
- Displays 4 steps horizontally
- Shows current step as active
- Shows previous steps as completed
- Shows future steps as pending
- Responsive layout

**Acceptance Criteria**:
- [ ] Component created at `src/molecules/Stepper.tsx`
- [ ] Accepts props: currentStep, steps, className
- [ ] Imports StepperCircle and StepperConnector from atoms
- [ ] Maps through steps and renders StepperCircle for each
- [ ] Renders StepperConnector between steps
- [ ] Correctly determines step status based on currentStep
- [ ] Includes ARIA navigation attributes
- [ ] Horizontal flex layout
- [ ] Centered alignment
- [ ] No TypeScript errors

---

### Step 3.2: Create PaymentSummaryRow Component

**File**: `src/molecules/PaymentSummaryRow.tsx`

**Task**: Build payment breakdown row

**Implementation**:
```typescript
// Copy implementation from spec.md line 515-548
```

**Reference**: spec.md lines 499-550

**Variants**:
- **default**: Normal row with regular font
- **total**: Bold text with top border/margin

**Acceptance Criteria**:
- [ ] Component created at `src/molecules/PaymentSummaryRow.tsx`
- [ ] Accepts props: label, amount, variant, hideAmount
- [ ] Imports formatCurrency and maskCurrency from utils
- [ ] Default variant renders without border
- [ ] Total variant renders with top border and padding
- [ ] Respects hideAmount prop
- [ ] Text alignment: label left, amount right
- [ ] Proper spacing between rows
- [ ] No TypeScript errors

---

### Step 3.3: Create CodeInputGroup Component

**File**: `src/molecules/CodeInputGroup.tsx`

**Task**: Build 6-digit code input group

**Implementation**:
```typescript
// Copy implementation from spec.md line 570-661
```

**Reference**: spec.md lines 554-663

**Features**:
- 6 individual code inputs
- Auto-focus first input on mount
- Auto-advance on digit entry
- Auto-focus previous on backspace
- Arrow key navigation
- Paste support (distributes digits)

**Acceptance Criteria**:
- [ ] Component created at `src/molecules/CodeInputGroup.tsx`
- [ ] Accepts props: value, onChange, hasError, disabled
- [ ] Imports CodeInput from atoms
- [ ] Manages refs for 6 inputs using useRef
- [ ] Auto-focuses first input on mount (useEffect)
- [ ] Handles digit change with auto-advance
- [ ] Handles backspace navigation
- [ ] Handles arrow key navigation (left/right)
- [ ] Handles paste event (distributes digits)
- [ ] Selects input content on focus
- [ ] Passes error state to all inputs
- [ ] Horizontal flex layout with gap
- [ ] Includes ARIA group attributes
- [ ] No TypeScript errors

---

### Step 3.4: Create TransactionDetailRow Component

**File**: `src/molecules/TransactionDetailRow.tsx`

**Task**: Build key-value row for transaction details

**Implementation**:
```typescript
// Copy implementation from spec.md line 682-710
```

**Reference**: spec.md lines 667-712

**Features**:
- Label on left (gray)
- Value on right (black)
- Color variants for success/error

**Acceptance Criteria**:
- [ ] Component created at `src/molecules/TransactionDetailRow.tsx`
- [ ] Accepts props: label, value, valueColor
- [ ] Default value color is black
- [ ] Success value color is green (#82BC00)
- [ ] Error value color is red (#FF0D00)
- [ ] Bottom border on each row
- [ ] Last row has no border (last:border-0)
- [ ] Proper padding (py-3)
- [ ] No TypeScript errors

---

### Step 3.5: Update Molecules Index

**File**: `src/molecules/index.ts`

**Task**: Export new molecule components

**Implementation**:
```typescript
// Add to existing exports:
export { Stepper } from './Stepper';
export { PaymentSummaryRow } from './PaymentSummaryRow';
export { CodeInputGroup } from './CodeInputGroup';
export { TransactionDetailRow } from './TransactionDetailRow';
```

**Acceptance Criteria**:
- [ ] All 4 new components exported
- [ ] Exports are named exports
- [ ] No duplicate exports
- [ ] No TypeScript errors

---

## PHASE 4: Organisms

### Step 4.1: Create PaymentDetailsCard Component

**File**: `src/organisms/PaymentDetailsCard.tsx`

**Task**: Build main card for Step 1 (payment details)

**Implementation**:
```typescript
// Copy implementation from spec.md line 736-832
```

**Reference**: spec.md lines 718-834

**Features**:
- Card with title and description
- Account selector dropdown
- "¿Necesitas más saldo?" link
- Payment breakdown (3 rows + total)
- Hide balances support

**Acceptance Criteria**:
- [ ] Component created at `src/organisms/PaymentDetailsCard.tsx`
- [ ] Accepts all required props
- [ ] Imports Card from atoms
- [ ] Imports PaymentSummaryRow from molecules
- [ ] Imports types from src/types/payment
- [ ] Title: "Resumen de Pago Unificado"
- [ ] Description text included
- [ ] Account dropdown renders with options
- [ ] "¿Necesitas más saldo?" link on right
- [ ] 4 PaymentSummaryRow components (3 items + total)
- [ ] Total row uses variant="total"
- [ ] Respects hideBalances prop
- [ ] Proper spacing (space-y-6)
- [ ] No TypeScript errors

---

### Step 4.2: Create PaymentConfirmationCard Component

**File**: `src/organisms/PaymentConfirmationCard.tsx`

**Task**: Build main card for Step 2 (confirmation)

**Implementation**:
```typescript
// Copy implementation from spec.md line 852-940
```

**Reference**: spec.md lines 838-942

**Features**:
- Card with title and description
- User info section (titular, documento)
- Payment summary section
- Transaction detail rows

**Acceptance Criteria**:
- [ ] Component created at `src/organisms/PaymentConfirmationCard.tsx`
- [ ] Accepts props: confirmationData, hideBalances
- [ ] Imports Card from atoms
- [ ] Imports TransactionDetailRow from molecules
- [ ] Imports types and utils
- [ ] Title: "Confirmación de Pago"
- [ ] Description text included
- [ ] User info section (Titular, Documento)
- [ ] "Resumen del pago:" subsection
- [ ] 5 TransactionDetailRow components
- [ ] Respects hideBalances prop
- [ ] Proper spacing
- [ ] No TypeScript errors

---

### Step 4.3: Create CodeInputCard Component

**File**: `src/organisms/CodeInputCard.tsx`

**Task**: Build main card for Step 3 (SMS code input)

**Implementation**:
```typescript
// Copy implementation from spec.md line 965-1034
```

**Reference**: spec.md lines 946-1036

**Features**:
- Centered card with title
- CodeInputGroup
- Error message display
- Resend code link

**Acceptance Criteria**:
- [ ] Component created at `src/organisms/CodeInputCard.tsx`
- [ ] Accepts all required props
- [ ] Imports Card and ErrorMessage from atoms
- [ ] Imports CodeInputGroup from molecules
- [ ] Title: "Código Enviado a tu Teléfono"
- [ ] Description text included
- [ ] CodeInputGroup component rendered
- [ ] Error message shows when hasError is true
- [ ] Resend link renders with disabled state
- [ ] Centered layout (max-w-2xl mx-auto)
- [ ] Proper spacing
- [ ] No TypeScript errors

---

### Step 4.4: Create TransactionResultCard Component

**File**: `src/organisms/TransactionResultCard.tsx`

**Task**: Build main card for Step 4 (transaction result)

**Implementation**:
```typescript
// Copy implementation from spec.md line 1053-1139
```

**Reference**: spec.md lines 1040-1141

**Features**:
- Success/error icon
- Title based on status
- Transaction details

**Acceptance Criteria**:
- [ ] Component created at `src/organisms/TransactionResultCard.tsx`
- [ ] Accepts prop: result (TransactionResult)
- [ ] Imports Card from atoms
- [ ] Imports TransactionDetailRow from molecules
- [ ] Success: green checkmark icon (64px circle)
- [ ] Error: red X icon (64px circle)
- [ ] Title changes based on status
- [ ] 5 TransactionDetailRow components
- [ ] Description uses valueColor prop
- [ ] Centered layout (max-w-2xl mx-auto)
- [ ] Proper spacing
- [ ] No TypeScript errors

---

### Step 4.5: Update Organisms Index

**File**: `src/organisms/index.ts`

**Task**: Export new organism components

**Implementation**:
```typescript
// Add to existing exports:
export { PaymentDetailsCard } from './PaymentDetailsCard';
export { PaymentConfirmationCard } from './PaymentConfirmationCard';
export { CodeInputCard } from './CodeInputCard';
export { TransactionResultCard } from './TransactionResultCard';
```

**Acceptance Criteria**:
- [ ] All 4 new components exported
- [ ] Exports are named exports
- [ ] No duplicate exports
- [ ] No TypeScript errors

---

## PHASE 5: Pages

### Step 5.1: Create Directory Structure

**Task**: Create route folders for payment flow

**Directories to create**:
```
app/(authenticated)/pagos/pago-unificado/
app/(authenticated)/pagos/pago-unificado/confirmacion/
app/(authenticated)/pagos/pago-unificado/verificacion/
app/(authenticated)/pagos/pago-unificado/resultado/
```

**Acceptance Criteria**:
- [ ] All 4 directories created
- [ ] Nested correctly under `app/(authenticated)/pagos/`
- [ ] Directory names match specification

---

### Step 5.2: Create Step 1 Page (Details)

**File**: `app/(authenticated)/pagos/pago-unificado/page.tsx`

**Task**: Create payment details page

**Implementation**:
```typescript
// Copy implementation from spec.md line 1152-1243
```

**Reference**: spec.md lines 1147-1244

**Features**:
- Account selection
- Payment summary
- Balance validation
- Navigation to step 2

**Acceptance Criteria**:
- [ ] Page created at correct path
- [ ] 'use client' directive at top
- [ ] useWelcomeBar(false) called
- [ ] Imports all required components
- [ ] Imports mock data
- [ ] Breadcrumbs rendered with correct items
- [ ] Stepper shows currentStep={1}
- [ ] PaymentDetailsCard rendered
- [ ] Validation for account selection
- [ ] Validation for insufficient balance
- [ ] Error message display
- [ ] "Volver" button navigates to /pagos
- [ ] "Continuar" button navigates to /pagos/pago-unificado/confirmacion
- [ ] Stores accountId in sessionStorage
- [ ] No TypeScript errors
- [ ] No console errors

---

### Step 5.3: Create Step 2 Page (Confirmation)

**File**: `app/(authenticated)/pagos/pago-unificado/confirmacion/page.tsx`

**Task**: Create payment confirmation page

**Implementation**:
```typescript
// Copy implementation from spec.md line 1253-1357
```

**Reference**: spec.md lines 1248-1358

**Features**:
- Display confirmation data
- Read-only summary
- Navigation to step 3

**Acceptance Criteria**:
- [ ] Page created at correct path
- [ ] 'use client' directive at top
- [ ] useWelcomeBar(false) called
- [ ] Imports all required components
- [ ] Imports mock data and types
- [ ] useEffect checks for data from step 1
- [ ] Redirects to step 1 if no data
- [ ] Builds confirmationData from sessionStorage
- [ ] Breadcrumbs rendered
- [ ] Stepper shows currentStep={2}
- [ ] PaymentConfirmationCard rendered
- [ ] "Volver" button navigates to step 1
- [ ] "Confirmar Pago" button navigates to step 3
- [ ] Stores confirmationData in sessionStorage
- [ ] Loading state while checking data
- [ ] No TypeScript errors
- [ ] No console errors

---

### Step 5.4: Create Step 3 Page (Code Input)

**File**: `app/(authenticated)/pagos/pago-unificado/verificacion/page.tsx`

**Task**: Create SMS code verification page

**Implementation**:
```typescript
// Copy implementation from spec.md line 1367-1475
```

**Reference**: spec.md lines 1362-1476

**Features**:
- 6-digit code input
- Code validation
- Resend functionality
- Loading state
- Navigation to step 4

**Acceptance Criteria**:
- [ ] Page created at correct path
- [ ] 'use client' directive at top
- [ ] useWelcomeBar(false) called
- [ ] Imports all required components
- [ ] useEffect checks for confirmation data
- [ ] Redirects to step 1 if no data
- [ ] Code state management (useState)
- [ ] Error state management
- [ ] Resend disabled state with timeout
- [ ] Loading state during processing
- [ ] Breadcrumbs rendered
- [ ] Stepper shows currentStep={3}
- [ ] CodeInputCard rendered
- [ ] Validates code length (6 digits)
- [ ] Mock code validation (accepts "123456")
- [ ] Error handling for invalid code
- [ ] "Volver" button navigates to step 2
- [ ] "Pagar" button processes and navigates to step 4
- [ ] Buttons disabled during loading
- [ ] No TypeScript errors
- [ ] No console errors

---

### Step 5.5: Create Step 4 Page (Result)

**File**: `app/(authenticated)/pagos/pago-unificado/resultado/page.tsx`

**Task**: Create transaction result page

**Implementation**:
```typescript
// Copy implementation from spec.md line 1485-1558
```

**Reference**: spec.md lines 1480-1559

**Features**:
- Transaction result display
- Print/save functionality
- Clean up sessionStorage
- Navigate back to payments

**Acceptance Criteria**:
- [ ] Page created at correct path
- [ ] 'use client' directive at top
- [ ] useWelcomeBar(false) called
- [ ] Imports all required components
- [ ] useEffect loads transaction result
- [ ] useEffect cleanup removes sessionStorage
- [ ] Breadcrumbs rendered
- [ ] Stepper shows currentStep={4}
- [ ] TransactionResultCard rendered
- [ ] "Imprimir/Guardar" button calls window.print()
- [ ] "Finalizar" button clears storage and navigates
- [ ] Loading state while fetching result
- [ ] No TypeScript errors
- [ ] No console errors

---

## PHASE 6: Testing & Refinement

### Step 6.1: Flow Testing

**Task**: Test complete payment flow from start to finish

**Test Cases**:

#### Test Case 1: Happy Path
1. Navigate to `/pagos/pago-unificado`
2. Select account with sufficient balance
3. Click "Continuar"
4. Verify Step 2 shows correct data
5. Click "Confirmar Pago"
6. Enter code "123456"
7. Click "Pagar"
8. Verify success screen appears
9. Click "Finalizar"
10. Verify navigation to /pagos

**Acceptance Criteria**:
- [ ] Flow completes without errors
- [ ] Stepper updates correctly at each step
- [ ] Data persists between steps
- [ ] SessionStorage cleaned up at the end

#### Test Case 2: Insufficient Balance
1. Navigate to Step 1
2. Select account with balance < total payment
3. Click "Continuar"
4. Verify error message appears

**Acceptance Criteria**:
- [ ] Error message displays
- [ ] Navigation blocked
- [ ] User remains on Step 1

#### Test Case 3: Invalid Code
1. Complete Step 1 and Step 2
2. Enter incorrect code (not "123456")
3. Click "Pagar"
4. Verify error message appears

**Acceptance Criteria**:
- [ ] Error message displays
- [ ] Code inputs highlighted in red
- [ ] User remains on Step 3

#### Test Case 4: Back Navigation
1. Complete Step 1
2. Click "Volver" on Step 2
3. Verify return to Step 1 with data preserved
4. Complete Step 1 again
5. Complete Step 2
6. Click "Volver" on Step 3
7. Verify return to Step 2

**Acceptance Criteria**:
- [ ] Back navigation works
- [ ] Data preserved when going back
- [ ] Stepper updates correctly

#### Test Case 5: Direct URL Access
1. Directly navigate to `/pagos/pago-unificado/confirmacion`
2. Verify redirect to Step 1
3. Directly navigate to `/pagos/pago-unificado/verificacion`
4. Verify redirect to Step 1
5. Directly navigate to `/pagos/pago-unificado/resultado`
6. Verify appropriate handling

**Acceptance Criteria**:
- [ ] Protected routes redirect correctly
- [ ] No crashes on direct access
- [ ] User cannot skip steps

---

### Step 6.2: Component Visual Testing

**Task**: Verify visual appearance of all components

**Components to Test**:

#### Stepper Component
- [ ] All 4 steps render
- [ ] Pending state: gray circle, white bg, gray label
- [ ] Active state: blue circle, blue bg, white number, blue bold label
- [ ] Completed state: blue circle, blue bg, white checkmark, blue label
- [ ] Connectors show correct colors
- [ ] Horizontal layout centered
- [ ] Responsive on mobile

#### CodeInputGroup
- [ ] 6 inputs render
- [ ] First input auto-focuses
- [ ] Typing advances to next
- [ ] Backspace goes to previous
- [ ] Arrow keys navigate
- [ ] Paste distributes digits
- [ ] Error state shows red border
- [ ] Focus state shows blue ring

#### Payment Cards
- [ ] PaymentDetailsCard: title, description, dropdown, breakdown
- [ ] PaymentConfirmationCard: user info, payment summary
- [ ] CodeInputCard: title, inputs, resend link
- [ ] TransactionResultCard: icon, title, details

**Acceptance Criteria**:
- [ ] All components match Figma design
- [ ] Colors match design system
- [ ] Spacing matches specifications
- [ ] Typography correct (sizes, weights)
- [ ] Icons render correctly

---

### Step 6.3: Responsive Testing

**Task**: Test layout on different screen sizes

**Breakpoints**:
- Desktop: ≥1024px
- Tablet: 640px - 1023px
- Mobile: <640px

**Test Cases**:

#### Desktop (≥1024px)
- [ ] Full sidebar visible
- [ ] Stepper horizontal layout
- [ ] Cards max-width 800px, centered
- [ ] Buttons right-aligned
- [ ] Code inputs full size

#### Tablet (640px - 1023px)
- [ ] Collapsed sidebar
- [ ] Stepper horizontal (smaller spacing)
- [ ] Cards full width with padding
- [ ] Buttons adapt

#### Mobile (<640px)
- [ ] Mobile sidebar (toggle)
- [ ] Stepper remains horizontal (compact)
- [ ] Code inputs smaller (if needed)
- [ ] Buttons stack or reduce padding
- [ ] Touch targets adequate (min 44px)

**Acceptance Criteria**:
- [ ] Layout adapts correctly at all breakpoints
- [ ] No horizontal scroll
- [ ] All interactive elements accessible
- [ ] Text remains readable
- [ ] No overlapping content

---

### Step 6.4: Accessibility Testing

**Task**: Verify WCAG 2.1 AA compliance

**Tests**:

#### Keyboard Navigation
- [ ] Tab through all steps (visual only)
- [ ] Tab through form fields
- [ ] Tab through buttons
- [ ] Enter submits forms
- [ ] Arrow keys work in code inputs
- [ ] No keyboard traps

#### Focus States
- [ ] All interactive elements show focus
- [ ] Focus indicators visible (blue ring)
- [ ] Focus order logical
- [ ] Skip to content (if applicable)

#### Screen Reader
- [ ] Stepper announces current step
- [ ] Step labels read correctly
- [ ] Form fields have labels
- [ ] Errors announced
- [ ] Success/error result announced
- [ ] ARIA attributes present

#### Color Contrast
- [ ] Text meets 4.5:1 ratio
- [ ] Large text meets 3:1 ratio
- [ ] UI components meet 3:1 ratio
- [ ] Focus indicators meet 3:1 ratio

**Acceptance Criteria**:
- [ ] All tests pass
- [ ] No accessibility errors
- [ ] Keyboard navigation smooth
- [ ] Screen reader friendly

---

### Step 6.5: Hide Balances Testing

**Task**: Test hide balances functionality

**Test Cases**:

1. **Start with balances visible**
   - [ ] All amounts show formatted
   - [ ] Toggle hide balances
   - [ ] Verify all amounts masked

2. **Navigate with balances hidden**
   - [ ] Step 1: amounts masked
   - [ ] Step 2: amounts masked
   - [ ] Navigate to Step 3
   - [ ] Navigate to Step 4 (result should show)

3. **Toggle during flow**
   - [ ] Hide balances on Step 1
   - [ ] Navigate to Step 2
   - [ ] Verify still hidden
   - [ ] Toggle to show
   - [ ] Verify now visible

**Acceptance Criteria**:
- [ ] Hide balances state persists across steps
- [ ] Mask shows "$ ****" format
- [ ] Toggle works from TopBar
- [ ] No layout shift when toggling

---

### Step 6.6: Edge Cases & Error Handling

**Task**: Test error scenarios and edge cases

**Test Cases**:

#### Page Refresh
1. Start flow on Step 1
2. Select account, click Continue
3. On Step 2, refresh page
4. Verify data persists or redirects appropriately

**Expected**: Data should persist via sessionStorage

#### Session Timeout (Mock)
1. Complete Step 1
2. Clear sessionStorage manually
3. Try to continue to Step 2
4. Verify redirect to Step 1

**Expected**: Redirect to Step 1 with clean state

#### Invalid State
1. Manually set invalid accountId in sessionStorage
2. Navigate to Step 2
3. Verify graceful handling

**Expected**: Redirect to Step 1 or show error

#### Resend Code
1. Reach Step 3
2. Click "Reenviar"
3. Verify button disabled
4. Wait 60 seconds
5. Verify button enabled again

**Expected**: Countdown works, button re-enables

#### Code Auto-Submit
1. Type 6th digit in code input
2. Verify no auto-submit (user must click "Pagar")

**Expected**: User controls submission

**Acceptance Criteria**:
- [ ] All edge cases handled gracefully
- [ ] No crashes or white screens
- [ ] Appropriate error messages
- [ ] User can recover from errors

---

### Step 6.7: Bug Fixes & Polish

**Task**: Address any issues found during testing

**Checklist**:
- [ ] Fix visual inconsistencies
- [ ] Fix navigation bugs
- [ ] Fix validation issues
- [ ] Fix responsive layout issues
- [ ] Fix accessibility issues
- [ ] Optimize performance (if needed)
- [ ] Remove console.log statements
- [ ] Remove commented code
- [ ] Format code consistently
- [ ] Add any missing error handling

**Acceptance Criteria**:
- [ ] All identified bugs fixed
- [ ] Code is clean and well-formatted
- [ ] No console errors or warnings
- [ ] Performance is acceptable

---

## Testing Checkpoints

### Checkpoint 1: After Phase 2 (Atoms)

**Test Atoms in Isolation**:

Create a temporary test page or use Storybook (if available) to verify:

- [ ] StepperCircle renders in all 3 states
- [ ] StepperConnector renders in both states
- [ ] CodeInput accepts input and handles events

**How to Test**:
Create `app/(authenticated)/test-atoms/page.tsx` (temporary):

```typescript
'use client';

import { StepperCircle, StepperConnector, CodeInput } from '@/src/atoms';

export default function TestAtomsPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2>StepperCircle - Pending</h2>
        <StepperCircle stepNumber={1} label="Detalle" status="pending" />
      </div>
      <div>
        <h2>StepperCircle - Active</h2>
        <StepperCircle stepNumber={2} label="Confirmación" status="active" />
      </div>
      <div>
        <h2>StepperCircle - Completed</h2>
        <StepperCircle stepNumber={3} label="SMS" status="completed" />
      </div>
      <div>
        <h2>StepperConnector</h2>
        <div className="flex items-center gap-4 w-64">
          <StepperConnector isActive={false} />
          <StepperConnector isActive={true} />
        </div>
      </div>
      <div>
        <h2>CodeInput</h2>
        <CodeInput
          value=""
          onChange={(v) => console.log(v)}
          onKeyDown={(e) => console.log(e.key)}
          onFocus={() => console.log('focused')}
        />
      </div>
    </div>
  );
}
```

Delete this test page after verification.

---

### Checkpoint 2: After Phase 3 (Molecules)

**Test Molecules**:

- [ ] Stepper shows all 4 steps
- [ ] Stepper updates when currentStep changes
- [ ] PaymentSummaryRow displays correctly
- [ ] CodeInputGroup handles input flow
- [ ] TransactionDetailRow shows different states

**How to Test**:
Add to test page or create `app/(authenticated)/test-molecules/page.tsx`

Delete test page after verification.

---

### Checkpoint 3: After Phase 4 (Organisms)

**Test Organisms**:

- [ ] PaymentDetailsCard renders fully
- [ ] PaymentConfirmationCard renders fully
- [ ] CodeInputCard renders fully
- [ ] TransactionResultCard renders both states

**How to Test**:
Create test page with mock data to render each organism.

Delete test page after verification.

---

### Checkpoint 4: After Phase 5 (Pages)

**Test Complete Flow**:

- [ ] All 4 pages accessible
- [ ] Navigation works end-to-end
- [ ] Data flows between pages
- [ ] SessionStorage managed correctly

**How to Test**:
Manually test complete flow as described in Phase 6.

---

## Rollout Strategy

### Development Environment

1. **Implement in feature branch**:
   ```bash
   git checkout -b feature/09a-pagos-pago-unificado
   ```

2. **Commit frequently** with clear messages:
   ```bash
   git commit -m "feat(09a-pagos): add payment type definitions"
   git commit -m "feat(09a-pagos): add StepperCircle atom component"
   # etc.
   ```

3. **Test locally** after each phase

4. **Push to remote** when phase complete:
   ```bash
   git push origin feature/09a-pagos-pago-unificado
   ```

---

### Testing Environment

1. **Deploy to staging** (if available)
2. **Run manual tests** from Phase 6
3. **Share with team** for review
4. **Gather feedback**
5. **Fix any issues**

---

### Production Environment

1. **Create pull request** to main branch
2. **Request code review**
3. **Address review comments**
4. **Merge to main**
5. **Deploy to production**
6. **Monitor for errors**

---

## Success Criteria

### Feature Complete

The feature is considered complete when:

- [ ] All 15 components implemented
- [ ] All 4 pages functional
- [ ] Complete flow works end-to-end
- [ ] All validations working
- [ ] SessionStorage managed correctly
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] No accessibility errors
- [ ] Responsive on all breakpoints
- [ ] Hide balances integration works
- [ ] All tests pass

### Code Quality

Code meets quality standards:

- [ ] Follows Atomic Design pattern
- [ ] Uses TypeScript strictly (no `any`)
- [ ] Follows project coding standards
- [ ] Clean, readable code
- [ ] Proper component composition
- [ ] Reusable components
- [ ] Proper prop typing
- [ ] Consistent naming conventions
- [ ] No code duplication

### User Experience

Feature provides good UX:

- [ ] Intuitive flow
- [ ] Clear error messages
- [ ] Helpful validation feedback
- [ ] Responsive design
- [ ] Fast performance
- [ ] Accessible to all users
- [ ] Matches design specifications
- [ ] No visual bugs
- [ ] Smooth animations/transitions

---

## Troubleshooting Guide

### Common Issues

#### Issue: TypeScript errors with imports

**Solution**: Ensure all index.ts files are updated with new exports.

#### Issue: Stepper not updating

**Solution**: Check that `currentStep` prop is being passed correctly as a number (1-4).

#### Issue: CodeInputGroup not auto-advancing

**Solution**: Verify refs are being set correctly and focus logic is working.

#### Issue: sessionStorage data not persisting

**Solution**: Check that keys match exactly across all pages.

#### Issue: Navigation not working

**Solution**: Verify `useRouter` from `next/navigation` is imported correctly.

#### Issue: Hide balances not working

**Solution**: Ensure `useUIContext` is imported and `hideBalances` prop is passed down.

#### Issue: Components not styled correctly

**Solution**: Verify Tailwind classes are correct and CSS is compiling.

---

## Post-Implementation

### Future Enhancements

After MVP is complete, consider:

1. **API Integration**
   - Replace mock data with real API calls
   - Implement actual SMS sending
   - Implement code verification
   - Implement payment execution

2. **Enhanced State Management**
   - Migrate to PaymentFlowContext
   - Add better error handling
   - Add retry logic

3. **Additional Features**
   - PDF generation for receipts
   - Email confirmation
   - Payment history
   - Scheduled payments

4. **Testing**
   - Add unit tests for components
   - Add integration tests for flow
   - Add E2E tests with Playwright/Cypress

5. **Optimization**
   - Add loading skeletons
   - Add transition animations
   - Optimize bundle size
   - Add service worker for offline support

---

## Summary

This implementation plan provides a structured approach to building the Pago Unificado feature. Follow the phases sequentially, test at each checkpoint, and use the troubleshooting guide when needed.

**Total Estimated Time**: 8-12 hours
**Complexity**: Medium
**Dependencies**: None (uses existing infrastructure)

**Key Deliverables**:
- 15 new components
- 4 new pages
- Complete payment flow
- Type-safe implementation
- Accessible and responsive design

---

**Last Updated**: 2025-12-30
**Status**: Ready to Implement
**Next Step**: Begin Phase 1 - Foundation
