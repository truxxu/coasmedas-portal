# Feature 09g-pagos: Pago de Protección (Protection Payment)

## Overview

This feature implements the payment flow for protection products (insurance policies). It is a 4-step wizard flow nested within `pagos/pagar-mis-productos` that allows users to pay their insurance products like "Seguro de Vida" and "Póliza Exequial".

## Figma References

| Page | Description | Figma URL | Node ID |
|------|-------------|-----------|---------|
| Step 1 - Details | Product selection and source account | [Details](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=3469-1169) | `3469-1169` |
| Step 2 - Confirmation | Payment confirmation | [Confirmation](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=3469-1346) | `3469-1346` |
| Step 3 - SMS Code | OTP code input | (Similar to other payment flows) | - |
| Step 4 - Response | Transaction result | [Response](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=3469-1848) | `3469-1848` |

---

## Flow Structure

```
/pagos/pagar-mis-productos/proteccion/detalle       → Step 1: Payment Details
/pagos/pagar-mis-productos/proteccion/confirmacion  → Step 2: Confirmation
/pagos/pagar-mis-productos/proteccion/codigo-sms    → Step 3: SMS Code
/pagos/pagar-mis-productos/proteccion/respuesta     → Step 4: Response
```

---

## Step 1: Payment Details (Detalle)

### Page Header
- **Title**: "Pago de Protección"
- **Back Button**: Arrow left icon, navigates to pagar-mis-productos page
- **Breadcrumbs**: `Inicio / Pagos / Pagos de Protección`
- **Hide Balances Toggle**: Top right corner

### Stepper Component
- **Steps**: 4 steps (Detalle, Confirmación, SMS, Finalización)
- **Active Step**: 1 (blue circle with number)
- **Inactive Steps**: Gray circles with numbers
- **Progress Line**: Blue for completed, gray for pending

### Main Card Content
- **Card Title**: "Pago de Protección" (color: `#194E8D`, font: Ubuntu Bold 20px)
- **Card Background**: White with rounded corners and shadow

#### Source Account Section
- **Label**: "¿De cuál cuenta quiere pagar?"
- **Select Dropdown**: Shows account with balance (e.g., "Cuenta de Ahorros - Saldo: $ 8.730.500")
- **Help Link**: "¿Necesitas más saldo?" (color: `#1D4E8F`, font: Ubuntu Regular 12px, positioned right)

#### Product Selection Section
- **Label**: "¿De cuál cuenta quiere pagar?" (Note: should be product selection label)
- **Product Cards**: Horizontal layout with selectable protection product cards

##### Protection Product Card Structure
| Element | Style |
|---------|-------|
| Title | Ubuntu Medium 16px, black |
| Product Number | "Número: No******XX-X", Ubuntu Regular 14px |
| Payment Label | "Próximo Pago", Ubuntu Regular 14px |
| Payment Amount | Ubuntu Medium 19px, color: `#194E8D` |
| Status Badge | "Activo" in green (`#00A44C`), Ubuntu Regular 15px |
| Selected State | Blue border (`#007FFF`), white background |
| Unselected State | Gray border (`#E4E6EA`), white background |

##### Sample Product Cards
1. **Seguro de Vida Grupo Deudores**
   - Número: No******65-9
   - Próximo Pago: $ 150.000
   - Status: Activo

2. **Póliza Exequial Familiar**
   - Número: No******12-3
   - Próximo Pago: $ 55.000
   - Status: Activo

#### Helper Text
- **Text**: "Selecciona el producto que deseas pagar"
- **Style**: Ubuntu Regular 14px, color: `#636363`, centered

### Footer Actions
- **Back Link**: "Volver" (text link, color: `#1D4E8F`, font: Ubuntu Medium 14px)
- **Continue Button**: "Continuar" (primary blue button, gradient `#007FFF`)

---

## Step 2: Payment Confirmation (Confirmación)

### Page Header
- Same as Step 1

### Stepper Component
- **Active Steps**: 1 and 2 (both blue)
- **Inactive Steps**: 3 and 4 (gray)

### Main Card Content
- **Card Title**: "Confirmación de Pagos" (color: `#1D4E8F`, font: Ubuntu Bold 18px)
- **Subtitle**: "Por favor, verifica que los datos de la transacción sean correctos antes de continuar." (Ubuntu Regular 15px)

#### Confirmation Details Table

| Label | Value | Font |
|-------|-------|------|
| Titular | CAMILO ANDRÉS CRUZ | Ubuntu Medium 15px |
| Documento | CC 1.***.***234 | Ubuntu Medium 15px |
| (Divider) | | |
| Producto a Pagar | Seguro de Vida Grupo Deudores | Ubuntu Medium 15px |
| Numero de Póliza | No******65-9 | Ubuntu Medium 15px |
| Producto a Debitar | Cuenta de Ahorros | Ubuntu Medium 15px |
| Valor a Pagar | $ 150.000 | Ubuntu Medium 18px |

- Labels are left-aligned (Ubuntu Regular 15px), values are right-aligned (Ubuntu Medium 15px)
- Horizontal divider separates user info from transaction details (color: `#E4E6EA`)

### Footer Actions
- **Back Link**: "Volver" (text link, color: `#004266`)
- **Confirm Button**: "Confirmar Pago" (primary blue button)

---

## Step 3: SMS Code Input (Código SMS)

### Page Header
- Same as previous steps

### Stepper Component
- **Active Steps**: 1, 2, and 3 (all blue)
- **Inactive Step**: 4 (gray)

### Main Card Content
- **Card Title**: "Código Enviado a tu Teléfono" (color: `#1D4E8F`, font: Ubuntu Bold 17px, centered)
- **Instructions**: "Ingresa la clave de 6 dígitos enviada a tu dispositivo para autorizar la transacción" (Ubuntu Regular 15px, centered)

#### OTP Input Section
- **Input Fields**: 6 individual digit inputs
- Centered layout

#### Resend Code Section
- **Text**: "¿No recibiste la clave?"
- **Link**: "Reenviar" (color: `#1D4E8F`, font: Ubuntu Medium 15px)
- Underlined link style

### Footer Actions
- **Back Link**: "Volver" (text link, color: `#004266`)
- **Pay Button**: "Pagar" (primary blue button)

---

## Step 4: Transaction Response (Respuesta)

### Page Header
- Same as previous steps

### Stepper Component
- **All Steps Active**: 1, 2, 3, 4 (all blue - completed)
- **Note**: Step 3 label shows "Conectando a PSE" in this design

### Main Card Content

#### Success Header
- **Success Icon**: Green circle with checkmark (color: `#00A44C`, size: ~60px)
- **Title**: "Transacción Exitosa" (color: `#1D4E8F`, font: Ubuntu Bold 22px, centered)

#### Transaction Details Table

| Label | Value | Font |
|-------|-------|------|
| Línea crédito | Seguro de Vida Grupo Deudores | Ubuntu Medium 15px |
| Número de producto | No******65-9 | Ubuntu Medium 15px |
| **Valor pagado** | **$ 150.000** | Ubuntu Medium 18px |
| Costo Transacción | $ 0 | Ubuntu Medium 15px |
| (Divider) | | |
| Fecha de Transmisión | 3 de septiembre de 2025 | Ubuntu Medium 15px |
| Hora de Transacción | 10:21 pm | Ubuntu Medium 15px |
| Número de Aprobación | 463342 | Ubuntu Medium 15px |
| Descripción | Exitosa | Ubuntu Medium 15px, color: `#00A44C` |

- Horizontal dividers separate sections (color: `#E4E6EA`)
- Labels are left-aligned, values are right-aligned

### Footer Actions
- **Print/Save Button**: "Imprimir/Guardar" (secondary outline button, border: `#1D4E8F`, font: Ubuntu Bold 16px)
- **Finish Button**: "Finalizar" (primary blue button)

---

## Reusable Components

### Existing Components to Reuse

| Component | Location | Usage |
|-----------|----------|-------|
| `BackButton` | `src/atoms` | Back navigation arrow |
| `Breadcrumbs` | `src/molecules` | Navigation trail |
| `HideBalancesToggle` | `src/molecules` | Balance visibility toggle |
| `Button` | `src/atoms` | Primary, secondary, and text buttons |
| `Select` | `src/atoms` | Source account dropdown |
| `Card` | `src/atoms` | Main content card |
| `Divider` | `src/atoms` | Horizontal separators |
| `Stepper` | `src/molecules` | Progress stepper (reuse from other payment flows) |
| `PaymentDetailRow` | `src/molecules` | Label-value row (if exists from other flows) |
| `OtpInput` | `src/molecules` | 6-digit OTP code input (if exists) |
| `TransactionSuccessHeader` | `src/molecules` | Success icon with title (if exists) |

### New Components to Create

| Component | Type | Description |
|-----------|------|-------------|
| `ProtectionPaymentCard` | Molecule | Selectable protection product card for Step 1 |
| `ProtectionPaymentForm` | Organism | Step 1 form with account select and product cards |
| `ProtectionPaymentConfirmation` | Organism | Step 2 confirmation details |
| `ProtectionPaymentSmsCode` | Organism | Step 3 SMS code entry |
| `ProtectionPaymentResponse` | Organism | Step 4 transaction result |

---

## Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Primary Navy | `#1D4E8F` | Card titles, links, primary text |
| Primary Blue | `#007FFF` | Buttons, active stepper, selected card border |
| Text Dark | `#194E8D` | Section titles, payment amounts |
| Text Dark Alt | `#004266` | Back link text |
| Text Black | `#111827` | Body text |
| Text Gray | `#636363` | Helper text |
| Gray Line | `#E4E6EA` | Dividers, inactive stepper, unselected card border |
| Gray Medium | `#808284` | Inactive stepper numbers |
| Success Green | `#00A44C` | Success icon, success text, active status |
| Background Light | `#F0F9FF` | Main content background |
| White | `#FFFFFF` | Card background |

---

## Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Page Title | Ubuntu | 20px | Medium |
| Card Title | Ubuntu | 20px | Bold |
| Section Title | Ubuntu | 18px | Bold |
| Body Text | Ubuntu | 15px | Regular |
| Label | Ubuntu | 15px | Regular |
| Value | Ubuntu | 15px | Medium |
| Amount (Large) | Ubuntu | 18-19px | Medium |
| Stepper Label | Ubuntu | 12px | Regular |
| Button | Ubuntu | 14px | Bold |
| Helper Text | Ubuntu | 14px | Regular |
| Small Link | Ubuntu | 12px | Regular |

---

## Form Validation

### Step 1 - Details
- **Cuenta Origen**: Required, must select a valid account
- **Producto de Protección**: Required, must select one product card

### Step 3 - SMS Code
- **OTP Code**: Required, exactly 6 digits
- **Resend**: Available after initial send, may have cooldown timer

---

## State Management

### Payment Flow State
```typescript
interface ProtectionPaymentState {
  // Step 1 - Details
  sourceAccount: string;
  selectedProduct: ProtectionProduct | null;

  // Step 2 - Confirmation (derived from step 1 + user data)
  holderName: string;
  holderDocument: string;
  productName: string;
  policyNumber: string;
  debitProduct: string;
  amountToPay: number;

  // Step 3 - SMS
  otpCode: string;
  otpSent: boolean;

  // Step 4 - Response
  transactionResult: ProtectionTransactionResult | null;
}

interface ProtectionProduct {
  id: string;
  title: string;
  productNumber: string;
  nextPaymentAmount: number;
  status: 'activo' | 'inactivo' | 'cancelado';
}

interface ProtectionTransactionResult {
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

---

## Navigation Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  [Pagar Mis Productos] → [Protección] → [Detalle] ───────────────► │
│                                              │                      │
│                                              ▼                      │
│                                      [Confirmación] ──────────────► │
│                                              │                      │
│                                              ▼                      │
│                                        [Código SMS] ──────────────► │
│                                              │                      │
│                                              ▼                      │
│                                         [Respuesta] ──► [Finalizar] │
│                                                              │      │
│                                                              ▼      │
│                                                           [Home]    │
└─────────────────────────────────────────────────────────────────────┘
```

### Back Navigation
- Step 1 → Pagar Mis Productos page
- Step 2 → Step 1 (preserves form data)
- Step 3 → Step 2 (preserves form data)
- Step 4 → No back (transaction completed)

---

## Mock Data

```typescript
// Protection products mock for Step 1
export const mockProtectionPaymentProducts: ProtectionProduct[] = [
  {
    id: '1',
    title: 'Seguro de Vida Grupo Deudores',
    productNumber: 'No******65-9',
    nextPaymentAmount: 150000,
    status: 'activo'
  },
  {
    id: '2',
    title: 'Póliza Exequial Familiar',
    productNumber: 'No******12-3',
    nextPaymentAmount: 55000,
    status: 'activo'
  }
];

// User accounts mock
export const mockUserAccounts = [
  {
    id: '1',
    type: 'Cuenta de Ahorros',
    balance: 8730500
  }
];

// Transaction response mock
export const mockProtectionTransactionResponse: ProtectionTransactionResult = {
  success: true,
  creditLine: 'Seguro de Vida Grupo Deudores',
  productNumber: 'No******65-9',
  amountPaid: 150000,
  transactionCost: 0,
  transmissionDate: '3 de septiembre de 2025',
  transactionTime: '10:21 pm',
  approvalNumber: '463342',
  description: 'Exitosa'
};
```

---

## Accessibility Considerations

- All form fields have associated labels
- Product cards are keyboard navigable and selectable
- Stepper has aria-current for active step
- OTP inputs are properly labeled for screen readers
- Success/error states have appropriate ARIA roles
- Focus management between steps
- Keyboard navigation support

---

## Error States

### Step 1 Errors
- No source account selected
- No protection product selected

### Step 3 Errors
- Invalid OTP code
- Expired OTP code
- Maximum retry attempts exceeded

### Step 4 Error Response
- Transaction failed
- Insufficient funds
- Service unavailable
- Network error

---

## Key Differences from Other Payment Flows

| Aspect | Other Flows (09b, 09c) | Protection Payment (09g) |
|--------|------------------------|--------------------------|
| Product Selection | Dropdown/table selection | Visual product cards |
| Card Display | Amount only | Title + Number + Amount + Status |
| Selected State | Row highlight | Blue border on card |
| Product Info | Basic fields | Insurance-specific fields (Póliza) |
| Confirmation Labels | Generic | "Producto a Pagar", "Numero de Póliza" |

---

## Related Features

- **09-pagos**: Main payments landing page
- **09a-pagos**: Payment types selection
- **09b-pagos**: My products payment (parent flow)
- **07-proteccion**: Protection products listing page
