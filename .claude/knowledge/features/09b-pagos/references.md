# Feature 09b - Pagos: Pago de Aportes Flow - References

**Feature**: Aportes Payment Flow (Pago de Aportes)
**Figma References**:
- [Step 1 - Details](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=3349-2724)
- [Step 2 - Confirmation](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=618-358)
- [Step 3 - Code Input](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=3349-2280)
- [Step 4 - Response](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=618-578)

---

## Overview

The **Pago de Aportes** (Aportes Payment) flow allows users to pay their pending aportes (contributions) to their specific plan (e.g., "Plan Senior"). This is a single-product payment flow within the "Pagar mis Productos" section, distinct from the unified payment flow. The flow consists of 4 sequential steps with visual progress feedback.

**Flow Type**: Multi-step wizard with stepper navigation
**Route Base**: `/pagos/pago-aportes`
**Parent Menu**: Pagos > Pagar mis Productos > Pago de Aportes

---

## Flow Structure

### 4-Step Payment Process

1. **Detalle (Details)** - Payment breakdown and amount input
2. **Confirmación (Confirmation)** - Review payment details before submission
3. **SMS (Code Input)** - Security code verification
4. **Finalización (Response)** - Transaction result display

### Common Elements Across All Steps

- **Sidebar Navigation**: "Pagos" menu item is active/expanded
- **Top Bar**: Back button + "Pago de Aportes" title + Breadcrumbs + "Ocultar saldos" toggle
- **Breadcrumbs**: `Inicio / Pagos / Pago de Aportes`
- **User Avatar**: Top right corner (e.g., "CC")
- **Stepper Component**: Progress indicator showing all 4 steps (reuse from 09a-pagos)
- **Session Footer**: Login times and IP address (bottom of page)
- **Action Buttons**: "Volver" (text link, navy) + Primary action button (bottom right)
- **Welcome Bar**: Should use `useWelcomeBar(false)` hook to hide the welcome bar

---

## Step 1: Details Page (Detalle)

**Route**: `/pagos/pago-aportes`
**File**: `app/(authenticated)/pagos/pago-aportes/page.tsx`
**Figma Node**: `3349:2724`

### Layout

```
<div className="space-y-6">
  {/* Stepper */}
  <Stepper currentStep={1} steps={steps} />

  {/* Main Content Card */}
  <Card>
    {/* Card Title */}
    <h2>"Pago de Aportes"</h2>

    {/* Account Selector Section */}
    <label>"¿De cuál cuenta quiere pagar?"</label>
    <Select options={accounts} />
    <Link>"¿Necesitas más saldo?"</Link>

    {/* Payment Breakdown Section */}
    <h3>"Detalle del Pago - Plan Senior"</h3>
    <Divider />

    {/* Payment Details List */}
    <DetailRow label="Aportes Vigentes:" value="$ 500.058" />
    <DetailRow label="Fondo de Solidaridad Vigente:" value="$ 390.000" />
    <DetailRow label="Aportes en Mora:" value="$ 0" valueColor="red" />
    <DetailRow label="Fondo de Solidaridad en Mora:" value="$ 0" valueColor="red" />
    <Divider />
    <DetailRow label="Fecha Límite de Pago:" value="15 Nov 2024" />
    <DetailRow label="Costo de la Transacción:" value="$ 0" />
    <Divider />

    {/* Editable Value Input */}
    <div className="flex items-center justify-between">
      <span>"Valor"</span>
      <CurrencyInput value={107058} prefix="$" />
    </div>
  </Card>

  {/* Action Buttons */}
  <div className="flex justify-between">
    <Link href="/pagos">Volver</Link>
    <Button variant="primary">Continuar</Button>
  </div>
</div>
```

### UI Elements

#### Account Selector
- **Type**: Select dropdown
- **Label**: "¿De cuál cuenta quiere pagar?"
- **Default**: "Cuenta de Ahorros - Saldo: $ 8.730.500"
- **Border**: `1px solid #B1B1B1`
- **Chevron**: Dropdown icon on right

#### "Need More Balance" Link
- **Text**: "¿Necesitas más saldo?"
- **Color**: `#1D4E8F` (Navy)
- **Font Size**: 12px
- **Position**: Right-aligned below account selector
- **Action**: Opens transfer/deposit flow (TBD)

#### Payment Breakdown Section
- **Title**: "Detalle del Pago - Plan Senior"
- **Title Color**: `#1D4E8F` (Navy)
- **Title Font Size**: 14px, Medium
- **Layout**: Two-column table (label left, amount right)
- **Dividers**: `1px solid #E4E6EA` between sections

#### Payment Detail Rows
| Label | Value | Value Color |
|-------|-------|-------------|
| Aportes Vigentes: | $ 500.058 | Black |
| Fondo de Solidaridad Vigente: | $ 390.000 | Black |
| Aportes en Mora: | $ 0 | Red `#E1172B` |
| Fondo de Solidaridad en Mora: | $ 0 | Red `#E1172B` |
| Fecha Límite de Pago: | 15 Nov 2024 | Black |
| Costo de la Transacción: | $ 0 | Black |

#### Value Input Field
- **Label**: "Valor" (Navy `#1D4E8F`, 14px)
- **Type**: Currency input
- **Prefix**: "$" (19px, Bold, Black)
- **Value**: Editable number (e.g., "107.058")
- **Border**: `1px solid #1D4E8F` (Navy)
- **Border Radius**: `6px`
- **Position**: Right-aligned in card footer area

### Data Required
- Available accounts with balances
- Aportes product details:
  - Plan name (e.g., "Plan Senior")
  - Aportes Vigentes amount
  - Fondo de Solidaridad Vigente amount
  - Aportes en Mora amount
  - Fondo de Solidaridad en Mora amount
  - Fecha Límite de Pago
  - Transaction cost
- Default payment value (calculated or user-entered)

### Interactions
- Account selector dropdown selection
- "¿Necesitas más saldo?" link navigation
- Value input editing (currency formatted)
- "Volver" link: Navigate back to Pagos menu
- "Continuar" button: Validate and navigate to Step 2

### Validations
- Account must be selected
- Selected account must have sufficient balance for entered value
- Value must be greater than 0
- Value must not exceed available balance

---

## Step 2: Confirmation Page (Confirmación)

**Route**: `/pagos/pago-aportes/confirmacion`
**File**: `app/(authenticated)/pagos/pago-aportes/confirmacion/page.tsx`
**Figma Node**: `618:358`

### Layout

```
<div className="space-y-6">
  {/* Stepper */}
  <Stepper currentStep={2} steps={steps} />

  {/* Main Content Card */}
  <Card>
    {/* Card Title */}
    <h2>"Confirmación de Pagos"</h2>

    {/* Description */}
    <p>"Por favor, verifica que los datos de la transacción sean correctos antes de continuar."</p>

    {/* User Info Section */}
    <DetailRow label="Titular:" value="CAMILO ANDRÉS CRUZ" />
    <DetailRow label="Documento:" value="CC 1.***.***234" />
    <Divider />

    {/* Payment Info Section */}
    <DetailRow label="Producto a Pagar:" value="Plan Senior" />
    <DetailRow label="Numero de Producto:" value="***5488" />
    <DetailRow label="Producto a Debitar:" value="Cuenta de Ahorros" />
    <DetailRow label="Valor a Pagar:" value="107.058" />
  </Card>

  {/* Action Buttons */}
  <div className="flex justify-between">
    <Link>Volver</Link>
    <Button variant="primary">Guardar Cambios</Button>
  </div>
</div>
```

### UI Elements

#### Card Title
- **Text**: "Confirmación de Pagos"
- **Color**: `#1D4E8F` (Navy)
- **Font Size**: 18px, Bold

#### Description Text
- **Text**: "Por favor, verifica que los datos de la transacción sean correctos antes de continuar."
- **Color**: Black
- **Font Size**: 15px, Regular

#### Confirmation Detail Rows
| Label | Value |
|-------|-------|
| Titular: | CAMILO ANDRÉS CRUZ |
| Documento: | CC 1.***.***234 |
| Producto a Pagar: | Plan Senior |
| Numero de Producto: | ***5488 |
| Producto a Debitar: | Cuenta de Ahorros |
| Valor a Pagar: | 107.058 |

- **Label Font**: 15px, Regular, Black
- **Value Font**: 15px, Medium, Black
- **Layout**: Labels left-aligned, values right-aligned
- **Divider**: After Documento row

#### Primary Button
- **Text**: "Guardar Cambios" (Note: Should semantically be "Confirmar Pago")
- **Style**: Blue gradient `#007FFF`, white text
- **Border Radius**: `6px`
- **Shadow**: `0px 2px 4px rgba(0,0,0,0.1)`

### Data Required (from Step 1)
- Titular (user name)
- Documento (masked document number)
- Producto a Pagar (plan name)
- Numero de Producto (masked product number)
- Producto a Debitar (debit account name)
- Valor a Pagar (payment amount)

### Interactions
- "Volver" link: Navigate back to Step 1
- "Guardar Cambios" button: Submit confirmation, send SMS code, navigate to Step 3

---

## Step 3: Code Input Page (SMS)

**Route**: `/pagos/pago-aportes/verificacion`
**File**: `app/(authenticated)/pagos/pago-aportes/verificacion/page.tsx`
**Figma Node**: `3349:2280`

### Layout

```
<div className="space-y-6">
  {/* Stepper */}
  <Stepper currentStep={3} steps={steps} />

  {/* Main Content Card */}
  <Card className="text-center">
    {/* Card Title */}
    <h2>"Código Enviado a tu Teléfono"</h2>

    {/* Description */}
    <p>"Ingresa la clave de 6 dígitos enviada a tu dispositivo para autorizar la transacción"</p>

    {/* Code Input Group */}
    <CodeInputGroup digits={6} />

    {/* Resend Section */}
    <div>
      <span>"¿No recibiste la clave?"</span>
      <Link>"Reenviar"</Link>
    </div>
  </Card>

  {/* Action Buttons */}
  <div className="flex justify-between">
    <Link>Volver</Link>
    <Button variant="primary">Pagar</Button>
  </div>
</div>
```

### UI Elements

#### Card Title
- **Text**: "Código Enviado a tu Teléfono"
- **Color**: `#1D4E8F` (Navy)
- **Font Size**: 17px, Bold
- **Alignment**: Center

#### Description Text
- **Text**: "Ingresa la clave de 6 dígitos enviada a tu dispositivo para autorizar la transacción"
- **Color**: Black
- **Font Size**: 15px, Regular
- **Alignment**: Center
- **Max Width**: Contained within card

#### Code Input Group
- **Digits**: 6 individual input fields
- **Size**: Each input approximately `48px × 56px`
- **Border**: `1px solid #B1B1B1`
- **Border Radius**: `6px`
- **Font Size**: 24px, centered
- **Spacing**: Gap between inputs
- **Behavior**:
  - Auto-focus next input on digit entry
  - Auto-focus previous on backspace
  - Paste support (distribute digits)

#### Resend Section
- **Container**: Horizontal layout with underline
- **Question Text**: "¿No recibiste la clave?" (15px, Regular, Black)
- **Link Text**: "Reenviar" (15px, Medium, Navy `#1D4E8F`)
- **Underline**: Decorative line below both texts

#### Primary Button
- **Text**: "Pagar"
- **Style**: Blue gradient `#007FFF`, white text
- **Border Radius**: `6px`

### Data Required
- Transaction ID (from Step 2)
- Phone number hint (masked, optional display)

### Interactions
- 6-digit code input with auto-advance
- "Reenviar" link: Request new SMS code (with cooldown)
- "Volver" link: Navigate back to Step 2
- "Pagar" button: Validate code, process payment, navigate to Step 4

### Validations
- Code must be exactly 6 digits
- All inputs must be filled
- Code must match sent SMS (API validation)

### Error States
- Invalid code: Highlight inputs in red, show error message
- Expired code: Prompt to resend
- Max attempts exceeded: Show error, require new flow start

---

## Step 4: Response Page (Finalización)

**Route**: `/pagos/pago-aportes/resultado`
**File**: `app/(authenticated)/pagos/pago-aportes/resultado/page.tsx`
**Figma Node**: `618:578`

### Layout

```
<div className="space-y-6">
  {/* Stepper */}
  <Stepper currentStep={4} steps={steps} />

  {/* Main Content Card */}
  <Card>
    {/* Success Icon */}
    <SuccessIcon />

    {/* Result Title */}
    <h2>"Transacción Exitosa"</h2>

    {/* Transaction Details Section 1 */}
    <DetailRow label="Línea crédito:" value="Plan Senior" />
    <DetailRow label="Número de producto:" value="***5488" />
    <DetailRow label="Valor pagado:" value="$ 107.058" valueColor="navy" />
    <DetailRow label="Costo transacción:" value="$ 0" />

    <Divider />

    {/* Transaction Details Section 2 */}
    <DetailRow label="Fecha de Transmisión:" value="3 de septiembre de 2025" />
    <DetailRow label="Hora de Transacción:" value="10:21 pm" />
    <DetailRow label="Número de Aprobación:" value="463342" />
    <DetailRow label="Descripción:" value="Exitosa" valueColor="green" />
  </Card>

  {/* Action Buttons */}
  <div className="flex justify-end gap-4">
    <Button variant="outline">Imprimir/Guardar</Button>
    <Button variant="primary">Finalizar</Button>
  </div>
</div>
```

### UI Elements

#### Success Icon
- **Type**: Circle with checkmark
- **Size**: Large (approximately `60px × 60px`)
- **Circle**: Green border `#00A44C`
- **Checkmark**: Green `#00A44C`
- **Position**: Centered above title

#### Result Title
- **Text**: "Transacción Exitosa"
- **Color**: `#1D4E8F` (Navy)
- **Font Size**: 22px, Bold
- **Alignment**: Center

#### Transaction Detail Rows - Section 1
| Label | Value | Value Style |
|-------|-------|-------------|
| Línea crédito: | Plan Senior | Black |
| Número de producto: | ***5488 | Black |
| Valor pagado: | $ 107.058 | Navy `#1D4E8F`, 18px |
| Costo transacción: | $ 0 | Black |

#### Transaction Detail Rows - Section 2
| Label | Value | Value Style |
|-------|-------|-------------|
| Fecha de Transmisión: | 3 de septiembre de 2025 | Black |
| Hora de Transacción: | 10:21 pm | Black |
| Número de Aprobación: | 463342 | Black |
| Descripción: | Exitosa | Green `#00A44C` |

#### Action Buttons
- **"Imprimir/Guardar"**:
  - Variant: Outline
  - Border: `1px solid #1D4E8F`
  - Text: Navy `#1D4E8F`, 16px, Bold
  - Background: White
  - Border Radius: `6px`

- **"Finalizar"**:
  - Variant: Primary
  - Background: `#007FFF`
  - Text: White, 14px, Bold
  - Border Radius: `6px`

### Data Required (from API response)
- Transaction status (success/error)
- Línea crédito (plan name)
- Número de producto (masked)
- Valor pagado (amount paid)
- Costo transacción (transaction cost)
- Fecha de Transmisión (transmission date)
- Hora de Transacción (transaction time)
- Número de Aprobación (approval number)
- Descripción (status description)

### Interactions
- "Imprimir/Guardar" button: Generate PDF with transaction details
- "Finalizar" button: Navigate to Pagos menu or Home

### States
- **Success**: Green checkmark, "Transacción Exitosa", green description
- **Error**: Red X icon, "Transacción Fallida", red description

---

## Reusable Components (from 09a-pagos)

The following components should be reused from the Pago Unificado flow:

### Atoms
- `StepperCircle` - Individual step indicator
- `StepperConnector` - Line connecting circles
- `CodeInput` - Single digit input field

### Molecules
- `Stepper` - Multi-step progress indicator (4 steps)
- `CodeInputGroup` - Group of 6 CodeInput fields
- `TransactionDetailRow` - Key-value pair display

### Organisms (may need adaptation)
- `CodeInputCard` - Card for SMS verification step
- `TransactionResultCard` - Card for result display

---

## New Components for Pago de Aportes

### Molecules

#### `AportesPaymentDetailRow`
- **Purpose**: Display payment breakdown item with optional colored value
- **Layout**: Label (left) + Amount (right)
- **Props**:
  - `label: string`
  - `value: string`
  - `valueColor?: 'default' | 'red' | 'navy' | 'green'`

#### `CurrencyInput`
- **Purpose**: Editable currency input field with peso prefix
- **Layout**: "$" prefix + editable input
- **Border**: Navy `#1D4E8F` when focused
- **Props**:
  - `value: number`
  - `onChange: (value: number) => void`
  - `prefix?: string` (default: "$")

### Organisms

#### `AportesDetailsCard`
- **Purpose**: Main card for Step 1 - Payment details
- **Components**:
  - Card container (white, rounded-2xl)
  - Section title: "Pago de Aportes"
  - Account selector (SelectField)
  - Link: "¿Necesitas más saldo?"
  - Section subtitle: "Detalle del Pago - {planName}"
  - Payment breakdown rows (AportesPaymentDetailRow × 6)
  - Value input section (CurrencyInput)

#### `AportesConfirmationCard`
- **Purpose**: Main card for Step 2 - Confirmation
- **Components**:
  - Card container
  - Section title: "Confirmación de Pagos"
  - Description text
  - User info section (Titular, Documento)
  - Payment info section (Producto, Numero, Cuenta, Valor)

---

## Form Data Structures

### Step 1 Data (Details)
```typescript
interface AportesPaymentDetailsData {
  selectedAccountId: string;
  planName: string;
  productNumber: string; // masked
  aportesVigentes: number;
  fondoSolidaridadVigente: number;
  aportesEnMora: number;
  fondoSolidaridadEnMora: number;
  fechaLimitePago: string;
  costoTransaccion: number;
  valorAPagar: number; // user-entered amount
}
```

### Step 2 Data (Confirmation)
```typescript
interface AportesConfirmationData {
  titular: string;
  documento: string; // masked
  productoAPagar: string; // plan name
  numeroProducto: string; // masked
  productoADebitar: string; // account name
  valorAPagar: number;
}
```

### Step 3 Data (Verification)
```typescript
interface CodeVerificationData {
  code: string; // 6 digits
  transactionId: string;
}
```

### Step 4 Data (Result)
```typescript
interface AportesTransactionResult {
  status: 'success' | 'error';
  lineaCredito: string;
  numeroProducto: string;
  valorPagado: number;
  costoTransaccion: number;
  fechaTransmision: string;
  horaTransaccion: string;
  numeroAprobacion: string;
  descripcion: string;
}
```

---

## State Management

### Flow State
```typescript
interface AportesPaymentFlowState {
  currentStep: 1 | 2 | 3 | 4;
  paymentDetails: AportesPaymentDetailsData | null;
  confirmationData: AportesConfirmationData | null;
  verificationCode: string;
  transactionResult: AportesTransactionResult | null;
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
- **Primary Blue**: `#007FFF` (stepper active, primary buttons)
- **Navy**: `#1D4E8F` (text, labels, titles, value input border)
- **Text Black**: `#111827` (primary text)
- **Red/Error**: `#E1172B` (mora amounts, error states)
- **Success Green**: `#00A44C` (success icon, success description)
- **Gray Border**: `#B1B1B1` (input borders)
- **Gray Divider**: `#E4E6EA` (dividers, inactive stepper)
- **Gray Medium**: `#808284` (pending stepper state)
- **Background**: `#F0F9FF` (page background)
- **White**: `#FFFFFF` (cards)

### Typography
- **Page Title**: 20px, Medium, Black
- **Card Title**: 18px, Bold, Navy
- **Section Subtitle**: 14px, Medium, Navy
- **Description**: 15px, Regular, Black
- **Labels**: 15px, Regular, Black
- **Values**: 15px, Medium, Black
- **Large Amount**: 18px, Medium, Navy
- **Link Text**: 12-14px, Medium, Navy
- **Button Text**: 14-16px, Bold

### Spacing
- Card padding: `24px` (p-6)
- Section spacing: `24px` (space-y-6)
- Row spacing: `16px` (space-y-4)
- Button gap: `16px` (gap-4)

### Border Radius
- Cards: `16px` (rounded-2xl)
- Inputs: `6px` (rounded-md)
- Buttons: `6px` (rounded-md)
- Stepper circles: `50%` (rounded-full)

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

### Mock Aportes Data
```typescript
const mockAportesPaymentData = {
  planName: 'Plan Senior',
  productNumber: '***5488',
  aportesVigentes: 500058,
  fondoSolidaridadVigente: 390000,
  aportesEnMora: 0,
  fondoSolidaridadEnMora: 0,
  fechaLimitePago: '15 Nov 2024',
  costoTransaccion: 0,
  valorAPagar: 107058
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
const mockAportesTransactionResult = {
  status: 'success',
  lineaCredito: 'Plan Senior',
  numeroProducto: '***5488',
  valorPagado: 107058,
  costoTransaccion: 0,
  fechaTransmision: '3 de septiembre de 2025',
  horaTransaccion: '10:21 pm',
  numeroAprobacion: '463342',
  descripcion: 'Exitosa'
};
```

---

## Routes Summary

| Step | Route | Purpose |
|------|-------|---------|
| 1 | `/pagos/pago-aportes` | Payment details & amount input |
| 2 | `/pagos/pago-aportes/confirmacion` | Review and confirm |
| 3 | `/pagos/pago-aportes/verificacion` | SMS code verification |
| 4 | `/pagos/pago-aportes/resultado` | Transaction result |

---

## Component Hierarchy

```
PagoAportesPage
├── Breadcrumbs
├── Stepper (reused from 09a-pagos)
├── AportesDetailsCard (Step 1)
│   ├── SelectField (account selector)
│   ├── Link ("¿Necesitas más saldo?")
│   ├── AportesPaymentDetailRow × 6
│   └── CurrencyInput (valor)
├── AportesConfirmationCard (Step 2)
│   └── TransactionDetailRow × 6
├── CodeInputCard (Step 3, reused)
│   ├── CodeInputGroup
│   │   └── CodeInput × 6
│   └── Link ("Reenviar")
├── TransactionResultCard (Step 4, adapted)
│   ├── SuccessIcon
│   └── TransactionDetailRow × 8
└── ActionButtons
    ├── Link/Button (Volver)
    └── Button (Primary action)
```

---

## Differences from Pago Unificado (09a-pagos)

| Aspect | Pago Unificado | Pago de Aportes |
|--------|----------------|-----------------|
| Payment Scope | All products combined | Single Aportes product |
| Step 1 Display | Summary totals only | Full breakdown with mora details |
| Step 1 Input | No editable amount | Editable value input field |
| Confirmation Details | Multiple products | Single product details |
| Result Details | Generic transaction info | Aportes-specific fields |
| Route | `/pagos/pago-unificado` | `/pagos/pago-aportes` |

---

## API Integration Points (Future)

- `GET /api/payments/aportes/details` - Get aportes payment details
- `POST /api/payments/aportes/calculate` - Calculate payment breakdown
- `POST /api/payments/aportes/initiate` - Start payment, send SMS
- `POST /api/payments/aportes/verify` - Verify SMS code
- `POST /api/payments/aportes/execute` - Execute payment
- `GET /api/payments/aportes/:transactionId` - Get transaction result

---

## Accessibility

- **Keyboard Navigation**: Tab through all interactive elements
- **Screen Readers**: Announce step changes, form labels, error messages
- **Focus States**: Visible focus indicators on inputs and buttons
- **Error Announcements**: Live regions for validation errors
- **Color Contrast**: Ensure red/green values meet WCAG standards

---

## Notes

- **Welcome Bar**: Use `useWelcomeBar(false)` to hide on all payment flow pages
- **Session Footer**: Display login times and IP on all pages
- **Back Navigation**: "Volver" navigates to previous step or Pagos menu (Step 1)
- **Breadcrumbs**: Always show `Inicio / Pagos / Pago de Aportes`
- **Hide Balances**: Respect global hideBalances state for monetary amounts
- **Mora Amounts**: Display in red (`#E1172B`) to highlight overdue amounts
- **Value Input**: Should allow editing with proper currency formatting
- **Stepper Reuse**: Reuse the Stepper component from 09a-pagos
- **Print/Save**: Step 4 should generate a PDF with transaction details

---

**Last Updated**: 2026-01-05
**Status**: Ready for Implementation
