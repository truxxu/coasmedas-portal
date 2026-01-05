# Feature 09c - Pagos: Pago de Obligaciones Flow - References

**Feature**: Obligaciones Payment Flow (Pago de Obligaciones)
**Figma References**:
- [Step 1 - Details](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=3353-3513)
- [Step 2 - Confirmation](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=621-3)
- [Step 3 - PSE Loading](existing PSE loading screen from 09a-pagos)
- [Step 4 - Response](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=621-366)

---

## Overview

The **Pago de Obligaciones** (Loan/Credit Payment) flow allows users to pay their loans and credit products (e.g., "Crédito de Inversión", "Tarjeta de Crédito") via PSE (external bank payment). This flow is nested within "Pagos > Pagar mis Productos" and is accessible by clicking the "Obligaciones" button on the Pagar mis Productos page. The flow consists of 4 sequential steps with visual progress feedback.

**Flow Type**: Multi-step wizard with stepper navigation
**Route Base**: `/pagos/pago-obligaciones`
**Parent Menu**: Pagos > Pagar mis Productos > Obligaciones

---

## Flow Structure

### 4-Step Payment Process

1. **Detalle (Details)** - Product selection and payment amount configuration
2. **Confirmación (Confirmation)** - Review payment details before submission
3. **Conectando a PSE (PSE Loading)** - Loading screen while connecting to PSE external site
4. **Finalización (Response)** - Transaction result display

### Common Elements Across All Steps

- **Sidebar Navigation**: "Pagos" menu item is active/expanded
- **Top Bar**: Back button + "Pago de Obligaciones" title + Breadcrumbs + "Ocultar saldos" toggle
- **Breadcrumbs**: `Inicio / Pagos / Pago de Obligaciones`
- **User Avatar**: Top right corner (e.g., "CC")
- **Stepper Component**: Progress indicator showing all 4 steps (reuse from 09a-pagos)
- **Session Footer**: Login times and IP address (bottom of page)
- **Action Buttons**: "Volver" (text link, navy) + Primary action button (bottom right)
- **Welcome Bar**: Should use `useWelcomeBar(false)` hook to hide the welcome bar

---

## Step 1: Details Page (Detalle)

**Route**: `/pagos/pago-obligaciones`
**File**: `app/(authenticated)/pagos/pago-obligaciones/page.tsx`
**Figma Node**: `3353:3513`

### Layout

```
<div className="space-y-6">
  {/* Stepper */}
  <Stepper currentStep={1} steps={steps} />

  {/* Main Content Card */}
  <Card>
    {/* Card Title */}
    <h2>"Pago de Obligaciones"</h2>

    {/* Payment Method Selector Section */}
    <label>"¿De cuál cuenta quiere pagar?"</label>
    <Select options={["PSE (Pagos con otras entidades)"]} />
    <Link>"¿Necesitas más saldo?"</Link>

    {/* Product Selection Section */}
    <label>"¿De cuál cuenta quiere pagar?"</label>
    <ProductCardsGrid>
      <ObligacionPaymentCard product={creditoInversion} selected={true} />
      <ObligacionPaymentCard product={tarjetaCredito} selected={false} />
    </ProductCardsGrid>

    {/* Payment Details Section */}
    <h3>"Detalle del Pago"</h3>
    <Divider />
    <DetailRow label="Pago Mínimo del Periodo:" value="$ 850.000" />
    <DetailRow label="Pago Total:" value="$ 12.500.000" />
    <Divider />
    <DetailRow label="Fecha Límite de Pago:" value="15 Nov 2024" />
    <DetailRow label="Costo de la Transacción:" value="$ 0" />

    {/* Payment Type Buttons */}
    <PaymentTypeButtons>
      <Button variant="gray">Pago Mínimo</Button>
      <Button variant="gray">Pago Total</Button>
    </PaymentTypeButtons>

    {/* Editable Value Input */}
    <div className="flex items-center justify-between">
      <span>"Valor a Pagar"</span>
      <CurrencyInput value={850000} prefix="$" />
    </div>

    <Divider />
    <DetailRow label="Total a Pagar" value="$ 850.000" bold />
  </Card>

  {/* Action Buttons */}
  <div className="flex justify-between">
    <Link href="/pagos/pagar-mis-productos">Volver</Link>
    <Button variant="primary">Continuar</Button>
  </div>
</div>
```

### UI Elements

#### Payment Method Selector
- **Type**: Select dropdown
- **Label**: "¿De cuál cuenta quiere pagar?"
- **Default Option**: "PSE (Pagos con otras entidades)"
- **Border**: `1px solid #B1B1B1`
- **Chevron**: Dropdown icon on right

#### "Need More Balance" Link
- **Text**: "¿Necesitas más saldo?"
- **Color**: `#1D4E8F` (Navy)
- **Font Size**: 12px
- **Position**: Right-aligned below payment method selector
- **Action**: Opens transfer/deposit flow (TBD)

#### Product Selection Cards
Two selectable cards displaying loan/credit products side by side:

##### Card 1: Crédito de Inversión (Selected State)
- **Border**: `2px solid #007FFF` (Blue) when selected
- **Background**: White
- **Title**: "Crédito de Inversión" (19px, Medium, Black)
- **Product Number**: "Número de producto: ***5678" (15px, Regular, Black)
- **Label**: "Saldo Total" (15px, Regular, Black)
- **Amount**: "$ 12.500.000" (25px, Bold, Black)
- **Status**: "Al día" (15px, Medium, Green `#00A44C`)

##### Card 2: Tarjeta de Crédito (Unselected State)
- **Border**: `1px solid #E4E6EA` (Gray)
- **Background**: White
- **Title**: "Tarjeta de Crédito" (19px, Medium, Black)
- **Product Number**: "Número de producto: ***1111" (15px, Regular, Black)
- **Label**: "Saldo Total" (15px, Regular, Black)
- **Amount**: "$ 1.800.000" (25px, Bold, Black)
- **Status**: "Al día" (15px, Medium, Green `#00A44C`)

#### Payment Details Section
- **Title**: "Detalle del Pago"
- **Title Color**: `#1D4E8F` (Navy)
- **Title Font Size**: 14px, Medium
- **Layout**: Two-column table (label left, amount right)
- **Dividers**: `1px solid #E4E6EA` between sections

#### Payment Detail Rows
| Label | Value | Notes |
|-------|-------|-------|
| Pago Mínimo del Periodo: | $ 850.000 | Black |
| Pago Total: | $ 12.500.000 | Black |
| Fecha Límite de Pago: | 15 Nov 2024 | Black |
| Costo de la Transacción: | $ 0 | Black |

#### Payment Type Buttons
- **Layout**: Two horizontal buttons side by side
- **Button 1**: "Pago Mínimo"
  - Background: `#E4E6EA` (Gray)
  - Text: 10px, Medium
  - Border Radius: `9px`
  - Shadow: `0px 2px 4px rgba(0,0,0,0.1)`
- **Button 2**: "Pago Total"
  - Background: `#E4E6EA` (Gray)
  - Text: 10px, Medium
  - Border Radius: `9px`
  - Shadow: `0px 2px 4px rgba(0,0,0,0.1)`
- **Purpose**: Quick select to fill value input with min/total amount

#### Value Input Field
- **Label**: "Valor a Pagar" (Navy `#1D4E8F`, 16px, Bold)
- **Type**: Currency input
- **Prefix**: "$" (19px, Bold, Black)
- **Value**: Editable number (e.g., "850.000")
- **Border Bottom**: `1px solid #1D4E8F` (Navy)
- **Position**: Right-aligned in card

#### Total Display
- **Label**: "Total a Pagar" (16px, Bold, Black)
- **Value**: "$ 850.000" (18px, Medium, Black)

### Data Required
- Available loan/credit products with:
  - Product name (e.g., "Crédito de Inversión", "Tarjeta de Crédito")
  - Product number (masked)
  - Total balance (Saldo Total)
  - Status (Al día / En mora)
  - Minimum payment amount
  - Total payment amount
  - Payment deadline date
- Transaction cost
- User payment value (user-entered or selected)

### Interactions
- Payment method dropdown selection
- "¿Necesitas más saldo?" link navigation
- Product card selection (click to select different product)
- "Pago Mínimo" button: Sets value to minimum payment amount
- "Pago Total" button: Sets value to total balance
- Value input editing (currency formatted)
- "Volver" link: Navigate back to Pagar mis Productos
- "Continuar" button: Validate and navigate to Step 2

### Validations
- A product must be selected
- Value must be greater than 0
- Value must be at least the minimum payment amount
- Value must not exceed total balance

---

## Step 2: Confirmation Page (Confirmación)

**Route**: `/pagos/pago-obligaciones/confirmacion`
**File**: `app/(authenticated)/pagos/pago-obligaciones/confirmacion/page.tsx`
**Figma Node**: `621:3`

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
    <DetailRow label="Producto a Pagar:" value="Crédito Libre inversión" />
    <DetailRow label="Numero de Producto:" value="***5488" />
    <DetailRow label="Producto a Debitar:" value="PSE (Pagos con otras entidades)" />
    <DetailRow label="Valor a Pagar:" value="$ 850.000" />
  </Card>

  {/* Action Buttons */}
  <div className="flex justify-between">
    <Link>Volver</Link>
    <Button variant="primary">Confirmar Pago</Button>
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
| Producto a Pagar: | Crédito Libre inversión |
| Numero de Producto: | ***5488 |
| Producto a Debitar: | PSE (Pagos con otras entidades) |
| Valor a Pagar: | $ 850.000 |

- **Label Font**: 15px, Regular, Black
- **Value Font**: 15px, Medium, Black
- **Layout**: Labels left-aligned, values right-aligned
- **Divider**: After Documento row

#### Primary Button
- **Text**: "Confirmar Pago"
- **Style**: Blue gradient `#007FFF`, white text
- **Border Radius**: `6px`
- **Shadow**: `0px 2px 4px rgba(0,0,0,0.1)`

### Data Required (from Step 1)
- Titular (user name)
- Documento (masked document number)
- Producto a Pagar (credit/loan product name)
- Numero de Producto (masked product number)
- Producto a Debitar (payment method - PSE)
- Valor a Pagar (payment amount)

### Interactions
- "Volver" link: Navigate back to Step 1
- "Confirmar Pago" button: Submit confirmation, navigate to Step 3 (PSE Loading)

---

## Step 3: PSE Loading Page (Conectando a PSE)

**Route**: `/pagos/pago-obligaciones/pse`
**File**: `app/(authenticated)/pagos/pago-obligaciones/pse/page.tsx`
**Figma Node**: Reuse existing PSE loading screen from 09a-pagos

### Description

This step reuses the existing PSE loading screen component from the Pago Unificado flow (09a-pagos). It displays a loading animation while the system connects to the PSE external payment gateway.

### UI Elements
- **Stepper**: Step 3 active ("Conectando a PSE")
- **Loading Indicator**: Animated spinner or progress
- **Message**: "Conectando con PSE..." or similar
- **Info Text**: Instructions about redirecting to external bank site

### Behavior
- Display loading state
- Simulate connection to PSE (mock)
- Auto-navigate to Step 4 after completion/timeout
- Handle PSE callback (in real implementation)

---

## Step 4: Response Page (Finalización)

**Route**: `/pagos/pago-obligaciones/resultado`
**File**: `app/(authenticated)/pagos/pago-obligaciones/resultado/page.tsx`
**Figma Node**: `621:366`

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

    {/* Divider */}
    <Divider />

    {/* Transaction Details Section 1 */}
    <DetailRow label="Línea crédito:" value="Crédito Libre Inversión" />
    <DetailRow label="Número de producto:" value="***5488" />
    <DetailRow label="Valor pagado:" value="$ 850.000" valueSize="18px" />

    {/* Transaction Details Section 2 */}
    <DetailRow label="Costo Transacción:" value="$ 0" />
    <DetailRow label="Abono Excedente:" value="Reducción de Cuota" />

    <Divider />

    {/* Transaction Details Section 3 */}
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
- **Circle**: Green/teal border `#00AFA9`
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
| Línea crédito: | Crédito Libre Inversión | Black |
| Número de producto: | ***5488 | Black |
| Valor pagado: | $ 850.000 | Black, 18px |

#### Transaction Detail Rows - Section 2
| Label | Value | Value Style |
|-------|-------|-------------|
| Costo Transacción: | $ 0 | Black |
| Abono Excedente: | Reducción de Cuota | Black |

#### Transaction Detail Rows - Section 3
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
- Línea crédito (credit/loan product name)
- Número de producto (masked)
- Valor pagado (amount paid)
- Costo transacción (transaction cost)
- Abono Excedente (excess payment application: "Reducción de Cuota", etc.)
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

## Reusable Components (from 09a-pagos and 09b-pagos)

The following components should be reused from previous payment flows:

### Atoms
- `StepperCircle` - Individual step indicator
- `StepperConnector` - Line connecting circles
- `Divider` - Horizontal separator

### Molecules
- `Stepper` - Multi-step progress indicator (4 steps)
- `TransactionDetailRow` - Key-value pair display
- `CurrencyInput` - Editable currency input field (from 09b-pagos)

### Organisms
- `PSELoadingCard` - Loading card for PSE connection (from 09a-pagos)
- `TransactionResultCard` - Card for result display (adapted)

---

## New Components for Pago de Obligaciones

### Molecules

#### `ObligacionPaymentCard`
- **Purpose**: Selectable card for loan/credit product display in payment flow
- **Layout**: Card with product info, balance, and status
- **Props**:
  - `product: ObligacionProduct`
  - `selected: boolean`
  - `onClick: () => void`
- **States**:
  - Selected: Blue border `#007FFF`, white background
  - Unselected: Gray border `#E4E6EA`, white background

#### `PaymentTypeButton`
- **Purpose**: Quick action button to select payment type (Min/Total)
- **Layout**: Small gray button
- **Props**:
  - `label: string` ("Pago Mínimo" | "Pago Total")
  - `onClick: () => void`
  - `active?: boolean`

### Organisms

#### `ObligacionDetailsCard`
- **Purpose**: Main card for Step 1 - Product selection and payment details
- **Components**:
  - Card container (white, rounded-2xl)
  - Section title: "Pago de Obligaciones"
  - Payment method selector (SelectField)
  - Link: "¿Necesitas más saldo?"
  - Product cards grid (ObligacionPaymentCard × n)
  - Payment details section title: "Detalle del Pago"
  - Payment breakdown rows (DetailRow × 4)
  - Payment type buttons (PaymentTypeButton × 2)
  - Value input section (CurrencyInput)
  - Total display row

#### `ObligacionConfirmationCard`
- **Purpose**: Main card for Step 2 - Confirmation
- **Components**:
  - Card container
  - Section title: "Confirmación de Pagos"
  - Description text
  - User info section (Titular, Documento)
  - Payment info section (Producto, Numero, Método, Valor)

---

## Form Data Structures

### Step 1 Data (Details)
```typescript
interface ObligacionPaymentDetailsData {
  paymentMethod: 'PSE';
  selectedProductId: string;
  selectedProduct: {
    id: string;
    name: string; // e.g., "Crédito de Inversión"
    productNumber: string; // masked, e.g., "***5678"
    totalBalance: number;
    status: 'al_dia' | 'en_mora';
  };
  pagoMinimoPeriodo: number;
  pagoTotal: number;
  fechaLimitePago: string;
  costoTransaccion: number;
  valorAPagar: number; // user-entered/selected amount
}
```

### Step 2 Data (Confirmation)
```typescript
interface ObligacionConfirmationData {
  titular: string;
  documento: string; // masked
  productoAPagar: string; // credit/loan name
  numeroProducto: string; // masked
  productoADebitar: string; // "PSE (Pagos con otras entidades)"
  valorAPagar: number;
}
```

### Step 4 Data (Result)
```typescript
interface ObligacionTransactionResult {
  status: 'success' | 'error';
  lineaCredito: string;
  numeroProducto: string;
  valorPagado: number;
  costoTransaccion: number;
  abonoExcedente: string; // e.g., "Reducción de Cuota"
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
interface ObligacionPaymentFlowState {
  currentStep: 1 | 2 | 3 | 4;
  paymentDetails: ObligacionPaymentDetailsData | null;
  confirmationData: ObligacionConfirmationData | null;
  transactionResult: ObligacionTransactionResult | null;
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
- **Primary Blue**: `#007FFF` (stepper active, primary buttons, selected card border)
- **Navy**: `#1D4E8F` (text, labels, titles)
- **Text Black**: `#111827` (primary text)
- **Success Green**: `#00A44C` (status "Al día", success icon, success description)
- **Error Red**: `#E1172B` (status "En mora", error states)
- **Gray Border**: `#B1B1B1` (input borders)
- **Gray Divider**: `#E4E6EA` (dividers, inactive stepper, unselected card border)
- **Gray Button**: `#E4E6EA` (payment type buttons background)
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
- **Product Card Title**: 19px, Medium, Black
- **Product Card Amount**: 25px, Bold, Black
- **Product Status**: 15px, Medium, Green/Red
- **Large Amount**: 18px, Medium, Black
- **Payment Type Button**: 10px, Medium
- **Link Text**: 12-14px, Medium, Navy
- **Button Text**: 14-16px, Bold

### Spacing
- Card padding: `24px` (p-6)
- Section spacing: `24px` (space-y-6)
- Row spacing: `16px` (space-y-4)
- Button gap: `16px` (gap-4)
- Product cards gap: `16px` (gap-4)

### Border Radius
- Cards: `16px` (rounded-2xl)
- Product cards: `8px` (rounded-lg)
- Inputs: `6px` (rounded-md)
- Buttons: `6px` (rounded-md)
- Payment type buttons: `9px`
- Stepper circles: `50%` (rounded-full)

---

## Mock Data Requirements

### Mock Obligacion Products
```typescript
const mockObligacionProducts = [
  {
    id: '1',
    name: 'Crédito de Inversión',
    productNumber: '***5678',
    totalBalance: 12500000,
    status: 'al_dia',
    pagoMinimo: 850000,
    fechaLimitePago: '15 Nov 2024'
  },
  {
    id: '2',
    name: 'Tarjeta de Crédito',
    productNumber: '***1111',
    totalBalance: 1800000,
    status: 'al_dia',
    pagoMinimo: 180000,
    fechaLimitePago: '20 Nov 2024'
  }
];
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
const mockObligacionTransactionResult = {
  status: 'success',
  lineaCredito: 'Crédito Libre Inversión',
  numeroProducto: '***5488',
  valorPagado: 850000,
  costoTransaccion: 0,
  abonoExcedente: 'Reducción de Cuota',
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
| 1 | `/pagos/pago-obligaciones` | Product selection & payment configuration |
| 2 | `/pagos/pago-obligaciones/confirmacion` | Review and confirm |
| 3 | `/pagos/pago-obligaciones/pse` | PSE loading/connection |
| 4 | `/pagos/pago-obligaciones/resultado` | Transaction result |

---

## Component Hierarchy

```
PagoObligacionesPage
├── Breadcrumbs
├── Stepper (reused from 09a-pagos)
├── ObligacionDetailsCard (Step 1)
│   ├── SelectField (payment method selector)
│   ├── Link ("¿Necesitas más saldo?")
│   ├── ObligacionPaymentCard × n (product selection)
│   ├── TransactionDetailRow × 4 (payment details)
│   ├── PaymentTypeButton × 2 (Pago Mínimo / Pago Total)
│   └── CurrencyInput (valor)
├── ObligacionConfirmationCard (Step 2)
│   └── TransactionDetailRow × 6
├── PSELoadingCard (Step 3, reused from 09a-pagos)
├── TransactionResultCard (Step 4, adapted)
│   ├── SuccessIcon
│   └── TransactionDetailRow × 9
└── ActionButtons
    ├── Link/Button (Volver)
    └── Button (Primary action)
```

---

## Differences from Pago de Aportes (09b-pagos)

| Aspect | Pago de Aportes | Pago de Obligaciones |
|--------|-----------------|----------------------|
| Payment Scope | Single Aportes product | Multiple loan/credit products |
| Step 1 Selection | No product selection | Product card selection |
| Payment Method | Account selection | PSE only |
| Step 1 Details | Aportes breakdown (vigentes, mora) | Min/Total payment amounts |
| Payment Type | Value input only | Quick buttons (Min/Total) + Value input |
| Step 3 | SMS Code verification | PSE loading screen |
| Result Fields | Plan-specific fields | Credit/loan-specific fields |
| Route | `/pagos/pago-aportes` | `/pagos/pago-obligaciones` |

---

## Differences from Pago Unificado (09a-pagos)

| Aspect | Pago Unificado | Pago de Obligaciones |
|--------|----------------|----------------------|
| Payment Scope | All products combined | Single selected loan/credit |
| Step 1 Display | Summary totals | Product cards + payment options |
| Product Selection | None (all included) | Select from available products |
| Payment Options | Fixed total | Min/Total quick buttons |
| Confirmation | Combined totals | Single product details |
| Route | `/pagos/pago-unificado` | `/pagos/pago-obligaciones` |

---

## API Integration Points (Future)

- `GET /api/payments/obligaciones/products` - Get user's loan/credit products
- `GET /api/payments/obligaciones/:productId/details` - Get payment details for product
- `POST /api/payments/obligaciones/initiate` - Start PSE payment flow
- `GET /api/payments/obligaciones/:transactionId/status` - Check PSE transaction status
- `GET /api/payments/obligaciones/:transactionId` - Get transaction result

---

## Accessibility

- **Keyboard Navigation**: Tab through all interactive elements, product cards
- **Screen Readers**: Announce step changes, form labels, selected product
- **Focus States**: Visible focus indicators on inputs, buttons, and cards
- **Error Announcements**: Live regions for validation errors
- **Color Contrast**: Ensure green/red status values meet WCAG standards

---

## Notes

- **Welcome Bar**: Use `useWelcomeBar(false)` to hide on all payment flow pages
- **Session Footer**: Display login times and IP on all pages
- **Back Navigation**: "Volver" navigates to previous step or Pagar mis Productos (Step 1)
- **Breadcrumbs**: Always show `Inicio / Pagos / Pago de Obligaciones`
- **Hide Balances**: Respect global hideBalances state for monetary amounts
- **Product Status**: Display "Al día" in green, "En mora" in red
- **Payment Type Buttons**: Quick way to populate value field
- **PSE Integration**: Step 3 simulates PSE connection (mock for now)
- **Stepper Reuse**: Reuse the Stepper component from 09a-pagos
- **Print/Save**: Step 4 should generate a PDF with transaction details
- **Abono Excedente**: Shows how excess payment is applied (e.g., "Reducción de Cuota")

---

**Last Updated**: 2026-01-05
**Status**: Ready for Implementation
