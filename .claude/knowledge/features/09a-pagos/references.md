# Feature 09a - Pagos: Pago Unificado Flow - References

**Feature**: Unified Payment Flow (Pago Unificado)
**Figma References**:
- [Step 1 - Details](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=3349-1360)
- [Step 2 - Confirmation](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=3349-1520)
- [Step 3 - Code Input](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=3349-1843)
- [Step 4 - Response](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=3349-1683)

---

## Overview

The **Pago Unificado** (Unified Payment) flow allows users to pay all their pending minimum payments across multiple products (Aportes, Obligaciones, Protección) in a single transaction. The flow consists of 4 sequential steps with visual progress feedback.

**Flow Type**: Multi-step wizard with stepper navigation
**Route Base**: `/pagos/pago-unificado`

---

## Flow Structure

### 4-Step Payment Process

1. **Detalle (Details)** - Payment summary and account selection
2. **Confirmación (Confirmation)** - Review payment details before submission
3. **SMS (Code Input)** - Security code verification
4. **Finalización (Response)** - Transaction result display

### Common Elements Across All Steps

- **Sidebar Navigation**: "Pagos" menu item is active/expanded
- **Top Bar**: Back button + "Pago Unificado" title + Breadcrumbs + "Ocultar saldos" toggle
- **Breadcrumbs**: `Inicio / Pagos / Pago Unificado`
- **User Avatar**: Top right corner (e.g., "CC")
- **Stepper Component**: Progress indicator showing all 4 steps
- **Session Footer**: Login times and IP address (bottom of page)
- **Action Buttons**: "Volver" (secondary) + Primary action button (bottom right)
- **Welcome Bar**: Should use `useWelcomeBar(false)` hook to hide the welcome bar

---

## New Components Required

### Atoms

#### `StepperCircle`
- **Purpose**: Individual step indicator in the stepper
- **Variants**:
  - `pending`: Gray circle with white background
  - `active`: Blue circle with white number
  - `completed`: Blue circle with white checkmark
- **Size**: `40px × 40px`
- **Border**: `2px solid #E4E6EA` (inactive), `2px solid #007FFF` (active/completed)
- **Background**:
  - Pending: `#FFFFFF`
  - Active: `#007FFF`
  - Completed: `#007FFF`
- **Content**:
  - Pending/Active: White number
  - Completed: White checkmark icon
- **Label**: Step name below circle (14px)

#### `StepperConnector`
- **Purpose**: Line connecting stepper circles
- **Width**: Variable (responsive)
- **Height**: `2px`
- **Colors**:
  - Inactive: `#E4E6EA` (gray)
  - Active/Completed: `#007FFF` (blue)

#### `CodeInput`
- **Purpose**: Single digit input field for security code
- **Size**: `48px × 56px` (approx)
- **Border**: `1px solid #B1B1B1`
- **Border Radius**: `6px`
- **Font Size**: `24px`
- **Text Align**: Center
- **States**: Default, Focus, Filled, Error
- **Behavior**: Auto-focus next input on digit entry

### Molecules

#### `Stepper`
- **Purpose**: Multi-step progress indicator
- **Layout**: Horizontal flex layout
- **Elements**: StepperCircle + StepperConnector + StepperCircle...
- **Steps**:
  1. "Detalle"
  2. "Confirmación"
  3. "SMS"
  4. "Finalización"
- **Props**:
  - `currentStep: number` (1-4)
  - `steps: Array<{label: string, number: number}>`

#### `PaymentSummaryRow`
- **Purpose**: Single row in payment breakdown list
- **Layout**: Label (left) + Amount (right)
- **Font Size**: 16px
- **Colors**:
  - Label: `#111827` (black)
  - Amount: `#111827` (black)
- **Variants**:
  - `default`: Normal row
  - `total`: Bold text, larger spacing, divider above

#### `CodeInputGroup`
- **Purpose**: Group of 6 CodeInput fields for SMS verification
- **Layout**: Horizontal flex with gap
- **Inputs**: 6 individual CodeInput components
- **Behavior**:
  - Auto-focus next on digit entry
  - Auto-focus previous on backspace
  - Paste support (auto-distribute digits)

#### `TransactionDetailRow`
- **Purpose**: Key-value pair for transaction result display
- **Layout**: Label (left) + Value (right)
- **Font Size**: 16px
- **Colors**:
  - Label: `#58585B` (gray)
  - Value: `#111827` (black)
- **Special Cases**:
  - Success description in green `#82BC00`

### Organisms

#### `PaymentDetailsCard`
- **Purpose**: Main card for Step 1 - Payment details
- **Components**:
  - Card container (white, rounded-2xl)
  - Section title: "Resumen de Pago Unificado"
  - Description text
  - Account selector dropdown (SelectField)
  - Link: "¿Necesitas más saldo?" (text-link, right-aligned)
  - Payment breakdown (PaymentSummaryRow × 3)
  - Total to pay (PaymentSummaryRow variant="total")

#### `PaymentConfirmationCard`
- **Purpose**: Main card for Step 2 - Confirmation
- **Components**:
  - Card container
  - Section title: "Confirmación de Pago"
  - Description text
  - User info section:
    - Titular (user name)
    - Documento (masked ID)
  - Payment summary section: "Resumen del pago:"
    - Product breakdown (Aportes, Obligaciones, Protección)
    - Debit account
    - Total amount

#### `CodeInputCard`
- **Purpose**: Main card for Step 3 - SMS code verification
- **Components**:
  - Card container (centered, smaller width)
  - Section title: "Código Enviado a tu Teléfono"
  - Description text
  - CodeInputGroup (6 digits)
  - Resend link: "¿No recibiste la clave? Reenviar"

#### `TransactionResultCard`
- **Purpose**: Main card for Step 4 - Transaction result
- **Components**:
  - Card container
  - Success icon (large green checkmark in circle)
  - Section title: "Transacción Exitosa" (or error state)
  - Transaction details list (TransactionDetailRow):
    - Costo Transacción
    - Fecha de Transacción
    - Hora de Transacción
    - Número Aprobación
    - Descripción (colored based on status)

---

## Page Routes

### Step 1: Details Page
**Route**: `/pagos/pago-unificado/detalle` or `/pagos/pago-unificado`
**File**: `app/(authenticated)/pagos/pago-unificado/page.tsx`

**Layout**:
```
<div className="space-y-6">
  {/* Top Bar with Stepper */}
  <div className="space-y-4">
    <Breadcrumbs items={[...]} />
    <Stepper currentStep={1} steps={steps} />
  </div>

  {/* Main Content */}
  <PaymentDetailsCard />

  {/* Action Buttons */}
  <div className="flex justify-between">
    <Button variant="text">Volver</Button>
    <Button variant="primary">Continuar</Button>
  </div>
</div>
```

**Data Required**:
- Available accounts with balances
- Pending payment amounts:
  - Total Aportes
  - Total Obligaciones (minimum payment)
  - Total Protección
  - Total to Pay

**Interactions**:
- Account selector dropdown
- "¿Necesitas más saldo?" link (opens modal or navigates)
- "Volver" button: Navigate back to Pagos menu
- "Continuar" button: Validate and navigate to Step 2

---

### Step 2: Confirmation Page
**Route**: `/pagos/pago-unificado/confirmacion`
**File**: `app/(authenticated)/pagos/pago-unificado/confirmacion/page.tsx`

**Layout**:
```
<div className="space-y-6">
  <div className="space-y-4">
    <Breadcrumbs items={[...]} />
    <Stepper currentStep={2} steps={steps} />
  </div>

  <PaymentConfirmationCard />

  <div className="flex justify-between">
    <Button variant="text">Volver</Button>
    <Button variant="primary">Confirmar Pago</Button>
  </div>
</div>
```

**Data Required**:
- User name (Titular)
- User document number (masked)
- Payment breakdown by product
- Selected debit account
- Total amount

**Interactions**:
- "Volver" button: Navigate back to Step 1
- "Confirmar Pago" button: Submit payment, send SMS code, navigate to Step 3

---

### Step 3: Code Input Page
**Route**: `/pagos/pago-unificado/verificacion`
**File**: `app/(authenticated)/pagos/pago-unificado/verificacion/page.tsx`

**Layout**:
```
<div className="space-y-6">
  <div className="space-y-4">
    <Breadcrumbs items={[...]} />
    <Stepper currentStep={3} steps={steps} />
  </div>

  <CodeInputCard />

  <div className="flex justify-between">
    <Button variant="text">Volver</Button>
    <Button variant="primary">Pagar</Button>
  </div>
</div>
```

**Data Required**:
- SMS code sent to user's phone
- Timer/cooldown for resend link

**Interactions**:
- 6-digit code input (auto-focus, auto-advance)
- "Reenviar" link: Request new SMS code
- "Volver" button: Navigate back to Step 2
- "Pagar" button: Validate code, process payment, navigate to Step 4

**Validations**:
- Code must be exactly 6 digits
- Code must match sent SMS
- Handle error states (invalid code, expired code)

---

### Step 4: Response Page
**Route**: `/pagos/pago-unificado/resultado`
**File**: `app/(authenticated)/pagos/pago-unificado/resultado/page.tsx`

**Layout**:
```
<div className="space-y-6">
  <div className="space-y-4">
    <Breadcrumbs items={[...]} />
    <Stepper currentStep={4} steps={steps} />
  </div>

  <TransactionResultCard />

  <div className="flex justify-end gap-4">
    <Button variant="outline">Imprimir/Guardar</Button>
    <Button variant="primary">Finalizar</Button>
  </div>
</div>
```

**Data Required**:
- Transaction result (success/error)
- Transaction cost
- Transaction date and time
- Approval number
- Transaction description/status

**Interactions**:
- "Imprimir/Guardar" button: Generate PDF or print transaction details
- "Finalizar" button: Navigate back to Pagos menu or Home

**States**:
- **Success**: Green checkmark icon, "Transacción Exitosa" title, success description
- **Error**: Red X icon, "Transacción Fallida" title, error description

---

## Stepper Component Specification

### Visual Design

**Step States**:

1. **Pending** (not yet reached):
   - Circle: Gray border `#E4E6EA`, white background
   - Number: Gray `#808284`
   - Label: Gray `#808284`
   - Connector: Gray `#E4E6EA`

2. **Active** (current step):
   - Circle: Blue border `#007FFF`, blue background `#007FFF`
   - Number: White
   - Label: Blue `#007FFF`, bold
   - Connector before: Blue `#007FFF`
   - Connector after: Gray `#E4E6EA`

3. **Completed** (passed):
   - Circle: Blue border `#007FFF`, blue background `#007FFF`
   - Icon: White checkmark
   - Label: Blue `#007FFF`
   - Connector: Blue `#007FFF`

### Step Labels
1. "Detalle"
2. "Confirmación"
3. "SMS"
4. "Finalización"

### Layout
- Horizontal layout
- Evenly spaced across width
- Responsive: Stack vertically on mobile (optional)

---

## Form Data Structure

### Step 1 Data
```typescript
interface PaymentDetailsFormData {
  selectedAccountId: string;
  totalAportes: number;
  totalObligaciones: number;
  totalProteccion: number;
  totalAmount: number;
}
```

### Step 2 Data (Confirmation)
```typescript
interface PaymentConfirmationData {
  titular: string;
  documento: string; // masked
  aportes: number;
  obligaciones: number;
  proteccion: number;
  debitAccount: string;
  totalAmount: number;
}
```

### Step 3 Data (Code Input)
```typescript
interface CodeVerificationData {
  code: string; // 6 digits
}
```

### Step 4 Data (Result)
```typescript
interface TransactionResult {
  status: 'success' | 'error';
  transactionCost: number;
  transactionDate: string;
  transactionTime: string;
  approvalNumber: string;
  description: string;
}
```

---

## State Management

### Flow State
```typescript
interface PaymentFlowState {
  currentStep: 1 | 2 | 3 | 4;
  paymentDetails: PaymentDetailsFormData | null;
  confirmationData: PaymentConfirmationData | null;
  verificationCode: string;
  transactionResult: TransactionResult | null;
}
```

### Navigation Between Steps
- Use Next.js routing for each step
- Store form data in Context or URL state
- Prevent direct access to later steps without completing previous steps
- Allow "Volver" to go back with data preserved

---

## Design System Values

### Colors
- **Primary Blue**: `#007FFF` (stepper active, buttons)
- **Navy**: `#1D4E8F` (text, labels)
- **Text Black**: `#111827` (primary text)
- **Gray High**: `#58585B` (secondary text)
- **Gray Medium**: `#808284` (disabled, pending state)
- **Gray Low**: `#D1D2D4` (borders)
- **Border Gray**: `#B1B1B1` (input borders)
- **Success Green**: `#82BC00` (success icon, description)
- **Error Red**: `#FF0D00` (error states)
- **Background**: `#F0F9FF` (page background)
- **White**: `#FFFFFF` (cards)

### Typography
- **Section Title**: 24px (1.5rem), Bold
- **Description**: 16px (1rem), Regular
- **Labels**: 16px (1rem), Medium
- **Amounts**: 16px (1rem), Regular (totals may be bold)
- **Small Text**: 14px (0.875rem), Regular

### Spacing
- Card padding: `24px` (p-6)
- Section spacing: `24px` (space-y-6)
- Row spacing: `16px` (space-y-4)
- Button gap: `16px` (gap-4)

### Border Radius
- Cards: `16px` (rounded-2xl)
- Inputs: `6px` (rounded-md)
- Stepper circles: `50%` (rounded-full)

---

## Interactions & Validations

### Step 1 - Details
- **Validation**:
  - Account must be selected
  - Selected account must have sufficient balance
- **Error Handling**:
  - Show error message if insufficient balance
  - Highlight account selector in red

### Step 2 - Confirmation
- **Validation**:
  - All data must be present from Step 1
- **Behavior**:
  - Display summary in read-only format
  - Allow user to go back and change account

### Step 3 - Code Input
- **Validation**:
  - Code must be exactly 6 digits
  - All inputs must be filled
  - Code must match sent SMS
- **Error Handling**:
  - Show error message below inputs if code is invalid
  - Highlight inputs in red
  - Allow resend after cooldown period
- **Behavior**:
  - Auto-focus next input on digit entry
  - Auto-focus previous on backspace
  - Support paste (distribute digits across inputs)

### Step 4 - Result
- **Behavior**:
  - Display transaction details
  - No validation needed
  - Allow print/save PDF
  - "Finalizar" returns to Pagos menu

---

## Accessibility

- **Keyboard Navigation**:
  - Tab through stepper (visual only, not interactive)
  - Tab through form fields
  - Enter to submit forms
  - Arrow keys for code inputs

- **Screen Readers**:
  - Announce current step
  - Read step labels
  - Announce validation errors
  - Announce success/error result

- **Focus States**:
  - Visible focus indicators on all interactive elements
  - Code inputs show focus border `#007FFF`

---

## Responsive Behavior

### Desktop (≥1024px)
- Full sidebar visible
- Stepper horizontal layout
- Cards max-width `800px`, centered
- Buttons right-aligned

### Tablet (640px - 1023px)
- Collapsed sidebar
- Stepper horizontal (smaller spacing)
- Cards full width with padding

### Mobile (<640px)
- Mobile sidebar (toggle)
- Stepper: Consider vertical or compact horizontal
- Code inputs: Smaller size
- Buttons: Stack or reduce padding

---

## Mock Data Requirements

### Mock Accounts
```typescript
const mockAccounts = [
  {
    id: '1',
    name: 'Cuenta de Ahorros',
    balance: 8730500,
    number: '****4428'
  },
  {
    id: '2',
    name: 'Cuenta Corriente',
    balance: 5200000,
    number: '****7891'
  }
];
```

### Mock Pending Payments
```typescript
const mockPendingPayments = {
  aportes: 170058,
  obligaciones: 1100000,
  proteccion: 205000,
  total: 1475058 // sum of above
};
```

### Mock User Data
```typescript
const mockUser = {
  name: 'CAMILO ANDRÉS CRUZ',
  document: 'CC 1.***.***234'
};
```

### Mock Transaction Result
```typescript
const mockTransactionResult = {
  status: 'success',
  transactionCost: 0,
  transactionDate: '19 de diciembre de 2025',
  transactionTime: '11:04 a.m',
  approvalNumber: '102450',
  description: 'Exitosa'
};
```

---

## Routes Summary

| Step | Route                                  | Purpose                     |
|------|----------------------------------------|-----------------------------|
| 1    | `/pagos/pago-unificado`                | Payment details & selection |
| 2    | `/pagos/pago-unificado/confirmacion`   | Review and confirm          |
| 3    | `/pagos/pago-unificado/verificacion`   | SMS code verification       |
| 4    | `/pagos/pago-unificado/resultado`      | Transaction result          |

---

## Component Hierarchy

```
PagoUnificadoPage
├── Breadcrumbs
├── Stepper
├── PaymentDetailsCard (Step 1)
│   ├── SelectField (account selector)
│   ├── Link ("¿Necesitas más saldo?")
│   └── PaymentSummaryRow × 4
├── PaymentConfirmationCard (Step 2)
│   └── TransactionDetailRow × 6
├── CodeInputCard (Step 3)
│   ├── CodeInputGroup
│   │   └── CodeInput × 6
│   └── Link ("Reenviar")
├── TransactionResultCard (Step 4)
│   └── TransactionDetailRow × 5
└── ActionButtons
    ├── Button (Volver)
    └── Button (Primary action)
```

---

## API Integration Points (Future)

- `POST /api/payments/unified/calculate` - Calculate total pending payments
- `POST /api/payments/unified/initiate` - Start payment process, send SMS
- `POST /api/payments/unified/verify` - Verify SMS code
- `POST /api/payments/unified/execute` - Execute payment
- `GET /api/payments/unified/:transactionId` - Get transaction result

---

## Notes

- **Welcome Bar**: Use `useWelcomeBar(false)` to hide the welcome bar on all payment flow pages
- **Session Footer**: Display login times and IP on all pages (reuse existing component)
- **Back Navigation**: Top bar back button should navigate to `/pagos` (Pagos menu)
- **Breadcrumbs**: Always show `Inicio / Pagos / Pago Unificado`
- **Hide Balances**: Respect global hideBalances state for monetary amounts
- **Progress Persistence**: Store flow state to allow users to continue if they navigate away
- **Error Handling**: Each step should handle API errors gracefully with user-friendly messages
- **Loading States**: Show loading spinners during API calls
- **Success Animation**: Consider adding subtle animation to success checkmark
- **Print/Save**: Step 4 should generate a PDF with transaction details

---

**Last Updated**: 2025-12-30
**Status**: Ready for Implementation
