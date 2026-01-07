# Feature 09f-pagos: Pago Servicios Públicos Inscritos (Registered Utilities Payment)

## Overview

This feature implements the payment flow for registered public utilities. It is a 4-step wizard flow that allows users to pay their previously registered utility services.

## Figma References

| Page | Description | Figma URL | Node ID |
|------|-------------|-----------|---------|
| Step 1 - Details | Payment details form | [Details](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=772-389) | `772-389` |
| Step 2 - Confirmation | Payment confirmation | [Confirmation](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=772-698) | `772-698` |
| Step 3 - SMS Code | OTP code input | [SMS Code](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=772-1020) | `772-1020` |
| Step 4 - Response | Transaction result | [Response](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=772-1129) | `772-1129` |

---

## Flow Structure

```
/pagos/servicios-publicos/detalle     → Step 1: Payment Details
/pagos/servicios-publicos/confirmacion → Step 2: Confirmation
/pagos/servicios-publicos/codigo-sms   → Step 3: SMS Code
/pagos/servicios-publicos/respuesta    → Step 4: Response
```

---

## Step 1: Payment Details (Detalle)

### Page Header
- **Title**: "Pagar Servicio Público"
- **Back Button**: Arrow left icon, navigates to previous page
- **Breadcrumbs**: `Inicio / Pagos / Pago Servicio Público`
- **Hide Balances Toggle**: Top right corner

### Stepper Component
- **Steps**: 4 steps (Detalle, Confirmación, SMS, Finalización)
- **Active Step**: 1 (blue circle with number)
- **Inactive Steps**: Gray circles with numbers
- **Progress Line**: Blue for completed, gray for pending

### Main Card Content
- **Card Title**: "Pago de Servicios Públicos" (color: `#004266`, font: Ubuntu Bold 18px)
- **Card Background**: White with rounded corners and shadow

#### Form Fields

| Field | Type | Label | Example Value |
|-------|------|-------|---------------|
| Cuenta Origen | Select | "Cuenta Origen" | "Cuenta de Ahorros - Saldo: $ 8.730.500" |
| Servicio a Pagar | Select | "Servicio a Pagar" | "Luz Apartamento (ENEL - Energía)" |
| Tipo Servicio | Select | "Servicio a Pagar" | "Energía" |
| Valor a Pagar | Currency Input | "Valor a Pagar" | "$ 125.500" |

#### Captcha Section
- Gray placeholder box with text: `[ Espacio para validación Captcha ]`
- Background: `#E4E6EA`

### Footer Actions
- **Back Link**: "Volver" (text link, color: `#004266`, font: Ubuntu Medium 14px)
- **Continue Button**: "Continuar" (primary blue button, gradient `#007FFF`)

---

## Step 2: Payment Confirmation (Confirmación)

### Page Header
- Same as Step 1

### Stepper Component
- **Active Steps**: 1 and 2 (both blue)
- **Inactive Steps**: 3 and 4 (gray)

### Main Card Content
- **Card Title**: "Confirmación de Pago" (color: `#004266`, font: Ubuntu Bold 18px)
- **Subtitle**: "Por favor, verifica que los datos de la transacción sean correctos antes de continuar."

#### Confirmation Details Table

| Label | Value | Font |
|-------|-------|------|
| Nombre del Titular | CAMILO ANDRÉS CRUZ | Ubuntu Medium 15px |
| Documento Titular | CC 1.***.***234 | Ubuntu Medium 15px |
| Servicio a Pagar | ENEL - Energía | Ubuntu Medium 15px |
| Referencia (Factura) | 123456789 | Ubuntu Medium 15px |
| Producto a Debitar | Cuenta de Ahorros | Ubuntu Medium 15px |
| **Valor Total** | **$ 125.500** | Ubuntu Medium 18px |

- Labels are left-aligned, values are right-aligned
- Horizontal dividers separate sections (color: `#E4E6EA`)

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
- **Input Fields**: 6 individual digit inputs (not visible in design, but implied)
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

### Main Card Content

#### Success Header
- **Success Icon**: Green circle with checkmark (color: `#00A44C`)
- **Title**: "Transacción Exitosa" (color: `#1D4E8F`, font: Ubuntu Bold 22px, centered)

#### Transaction Details Table

| Label | Value | Font |
|-------|-------|------|
| Línea crédito | Cambio de palabras | Ubuntu Medium 15px |
| Número de producto | ***5678 | Ubuntu Medium 15px |
| **Valor pagado** | **$ 850.000** | Ubuntu Medium 18px |
| Costo transacción | $ 0 | Ubuntu Medium 15px |
| Fecha de Transmisión | 1 de septiembre de 2025 | Ubuntu Medium 15px |
| Hora de Transacción | 10:21 pm | Ubuntu Medium 15px |
| Número de Aprobación | 950606 | Ubuntu Medium 15px |
| Descripción | Exitosa | Ubuntu Medium 15px, color: `#00A44C` |

- Horizontal dividers separate sections (color: `#E4E6EA`)
- Labels are left-aligned, values are right-aligned

### Footer Actions
- **Print/Save Button**: "Imprimir/Guardar" (secondary outline button, border: `#1D4E8F`)
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
| `Select` | `src/atoms` | Dropdown selects |
| `Input` | `src/atoms` | Currency input field |
| `Card` | `src/atoms` | Main content card |
| `Divider` | `src/atoms` | Horizontal separators |
| `Stepper` | `src/molecules` | Progress stepper (already exists from other payment flows) |

### New Components to Create

| Component | Type | Description |
|-----------|------|-------------|
| `PaymentDetailRow` | Molecule | Label-value row for confirmation/response |
| `OtpInput` | Molecule | 6-digit OTP code input (if not already exists) |
| `TransactionSuccessHeader` | Molecule | Success icon with title |
| `UtilityPaymentForm` | Organism | Step 1 form with selects and amount |
| `UtilityPaymentConfirmation` | Organism | Step 2 confirmation details |
| `UtilityPaymentSmsCode` | Organism | Step 3 SMS code entry |
| `UtilityPaymentResponse` | Organism | Step 4 transaction result |

---

## Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Primary Navy | `#1D4E8F` | Card titles, links, primary text |
| Primary Blue | `#007FFF` | Buttons, active stepper |
| Text Dark | `#004266` | Section titles |
| Text Black | `#111827` | Body text |
| Gray Line | `#E4E6EA` | Dividers, inactive stepper |
| Gray Medium | `#808284` | Inactive stepper numbers |
| Success Green | `#00A44C` | Success icon, success text |
| Background Light | `#F0F9FF` | Main content background |
| White | `#FFFFFF` | Card background |

---

## Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Page Title | Ubuntu | 20px | Medium |
| Card Title | Ubuntu | 18px | Bold |
| Section Title | Ubuntu | 17px | Bold |
| Body Text | Ubuntu | 15px | Regular |
| Label | Ubuntu | 15px | Regular |
| Value | Ubuntu | 15px | Medium |
| Amount (Large) | Ubuntu | 18px | Medium |
| Stepper Label | Ubuntu | 12px | Regular |
| Button | Ubuntu | 14px | Bold |

---

## Form Validation

### Step 1 - Details
- **Cuenta Origen**: Required, must select a valid account
- **Servicio a Pagar**: Required, must select from registered services
- **Tipo Servicio**: Auto-populated based on service selection
- **Valor a Pagar**: Required, must be greater than 0, numeric only
- **Captcha**: Required validation

### Step 3 - SMS Code
- **OTP Code**: Required, exactly 6 digits
- **Resend**: Available after initial send, may have cooldown timer

---

## State Management

### Payment Flow State
```typescript
interface UtilityPaymentState {
  // Step 1 - Details
  sourceAccount: string;
  selectedService: RegisteredService | null;
  serviceType: string;
  amount: number;

  // Step 2 - Confirmation (derived from step 1)
  holderName: string;
  holderDocument: string;
  serviceProvider: string;
  invoiceReference: string;
  debitProduct: string;
  totalAmount: number;

  // Step 3 - SMS
  otpCode: string;
  otpSent: boolean;

  // Step 4 - Response
  transactionResult: TransactionResult | null;
}

interface RegisteredService {
  id: string;
  alias: string;
  provider: string;
  serviceType: string;
  reference: string;
}

interface TransactionResult {
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
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [Pagos] → [Servicios Públicos] → [Detalle] ─────────────────► │
│                                        │                        │
│                                        ▼                        │
│                               [Confirmación] ────────────────►  │
│                                        │                        │
│                                        ▼                        │
│                                 [Código SMS] ────────────────►  │
│                                        │                        │
│                                        ▼                        │
│                                  [Respuesta] ────►  [Finalizar] │
│                                                          │      │
│                                                          ▼      │
│                                                       [Home]    │
└─────────────────────────────────────────────────────────────────┘
```

### Back Navigation
- Step 1 → Previous page (service selection or payments home)
- Step 2 → Step 1 (preserves form data)
- Step 3 → Step 2 (preserves form data)
- Step 4 → No back (transaction completed)

---

## Mock Data

```typescript
// Registered services mock
export const mockRegisteredServices: RegisteredService[] = [
  {
    id: '1',
    alias: 'Luz Apartamento',
    provider: 'ENEL',
    serviceType: 'Energía',
    reference: '123456789'
  },
  {
    id: '2',
    alias: 'Gas Casa',
    provider: 'Vanti',
    serviceType: 'Gas',
    reference: '987654321'
  },
  {
    id: '3',
    alias: 'Agua Oficina',
    provider: 'EAAB',
    serviceType: 'Agua',
    reference: '456789123'
  }
];

// Transaction response mock
export const mockTransactionResponse: TransactionResult = {
  success: true,
  creditLine: 'Cambio de palabras',
  productNumber: '***5678',
  amountPaid: 850000,
  transactionCost: 0,
  transmissionDate: '1 de septiembre de 2025',
  transactionTime: '10:21 pm',
  approvalNumber: '950606',
  description: 'Exitosa'
};
```

---

## Accessibility Considerations

- All form fields have associated labels
- Stepper has aria-current for active step
- OTP inputs are properly labeled for screen readers
- Success/error states have appropriate ARIA roles
- Focus management between steps
- Keyboard navigation support

---

## Error States

### Step 1 Errors
- Empty required fields
- Invalid amount (zero or negative)
- Captcha validation failure

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

## Related Features

- **09a-pagos**: Payment types selection
- **09b-pagos**: My products payment
- **09c-pagos**: Payment to other associates
- **09d-pagos**: New utility registration
- **09e-pagos**: Registered utilities list
