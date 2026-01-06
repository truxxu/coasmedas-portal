# Feature 09d-pagos: Pago a Otros Asociados

## Overview

This feature implements the "Pago a Otros Asociados" (Payment to Other Associates) flow, allowing users to make payments to registered beneficiaries (other Coasmedas associates). The flow consists of a beneficiary selection page followed by a 4-step payment wizard.

## Figma References

| Page | Description | Node ID | URL |
|------|-------------|---------|-----|
| Beneficiary Selection | Select registered associate | 648-2 | [Figma](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=648-2) |
| Step 1: Details | Select source account and products to pay | 648-652 | [Figma](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=648-652) |
| Step 2: Confirmation | Review and confirm payment details | 648-790 | [Figma](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=648-790) |
| Step 3: SMS Code | Enter 6-digit verification code | 648-1181 | [Figma](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=648-1181) |
| Step 4: Response | Transaction result/success | 648-1293 | [Figma](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=648-1293) |

---

## Page 1: Beneficiary Selection (Pre-Step)

### Layout
- **Header**: Back button + Title "Pago a otros asociados"
- **Breadcrumbs**: Inicio / Pagos / Pago a otros asociados
- **Section Title**: "Asociados inscritos" (blue, 18px, bold)
- **Beneficiary List**: Vertical list of registered associates

### Beneficiary List Item
Each item is a clickable card with:
- **Name**: Uppercase, blue (#1D4E8F), 18px medium (e.g., "MARÍA FERNANDA GONZALEZ")
- **Subtitle**: "Alias: {alias} - Doc: {maskedDoc}" (black, 14px regular)
- **Chevron**: Right arrow icon on the right side
- **Border**: 1px solid border, rounded corners
- **Hover State**: Pointer cursor, subtle highlight

### Mock Data Structure
```typescript
interface RegisteredBeneficiary {
  id: string;
  fullName: string;        // "MARÍA FERNANDA GONZALEZ"
  alias: string;           // "Mamá"
  documentNumber: string;  // masked: "***3040"
}
```

---

## Page 2: Step 1 - Details (Detalle)

### Layout
- **Header**: Back button + Title + Breadcrumbs
- **Stepper**: 4-step progress indicator (Step 1 active)
- **Content Card**: White card with payment form

### Stepper Component
- **Steps**: Detalle (1) → Confirmación (2) → SMS (3) → Finalización (4)
- **Active Step**: Blue circle (#007FFF) with white number
- **Inactive Step**: Gray circle (#E4E6EA) with gray number (#808284)
- **Completed Steps**: Blue circle with white number
- **Connector Lines**: Blue (#007FFF) for completed, Gray (#E4E6EA) for pending
- **Step Labels**: 12px, centered below circles

### Content Sections

#### 1. Section Header
- **Title**: "Pago de {BENEFICIARY_NAME}" (blue, 18px bold)

#### 2. Source Account Selection
- **Label**: "¿De cuál cuenta quiere pagar?" (15px regular)
- **Dropdown**: Select with account info (e.g., "Cuenta de Ahorros - Saldo: $ 8.730.500")
- **Link**: "¿Necesitas más saldo?" (blue, 12px, right-aligned)

#### 3. Products to Pay
- **Label**: "Selecciona el/los producto(s) a pagar:" (15px regular)
- **Product Cards**: List of selectable product items

### Product Card Item
Each product is a bordered card with:
- **Checkbox**: Left side, for multi-selection
- **Product Title**: Blue (#1D4E8F), 18px bold (e.g., "Plan Senior (***5488)")
- **Pago Mínimo**: Label + Value (e.g., "$ N/A" or "$ 850.000") - 12px light
- **Pago Total**: Label + Value (e.g., "$ Indefinido" or "$ 12.500.000") - 12px light
- **Valor a Pagar**:
  - Label: "Valor a Pagar:" (14px regular)
  - Input: Currency input with "$ " prefix (21px)
- **Divider**: Bottom border separating products

### Payment Summary Section
- **Section Title**: "Resumen del Pago" (blue, 18px bold)
- **Divider**: Gray line above
- **Total Label**: "Total a Pagar:" (blue, 20px bold)
- **Total Value**: "$ {amount}" (21px medium, right-aligned)

### Footer Actions
- **Back Link**: "Volver" (blue #004266, 14px medium, left)
- **Continue Button**: "Continuar" (primary blue button, right)

### Data Structure
```typescript
interface PayableProduct {
  id: string;
  name: string;              // "Plan Senior", "Crédito de Libre Inversión"
  productNumber: string;     // masked: "***5488"
  minimumPayment: number | null;  // null = "N/A"
  totalPayment: number | null;    // null = "Indefinido"
  amountToPay: number;       // user input
  isSelected: boolean;
}

interface SourceAccount {
  id: string;
  type: string;              // "Cuenta de Ahorros"
  balance: number;           // 8730500
}
```

---

## Page 3: Step 2 - Confirmation (Confirmación)

### Layout
- **Header**: Back button + Title + Breadcrumbs
- **Stepper**: Steps 1-2 active (blue), Steps 3-4 inactive
- **Content Card**: White card with confirmation details

### Content Sections

#### 1. Section Header
- **Title**: "Confirmación de Pago" (blue, 18px bold)
- **Instruction**: "Por favor, verifica que los datos de la transacción sean correctos antes de continuar." (15px regular)

#### 2. Payer Information
Two-column layout (label left, value right):
| Label | Value |
|-------|-------|
| Nombre del Titular: | CAMILO ANDRÉS CRUZ |
| Documento: | CC 1.***.***. 234 |
| Producto a Debitar: | Cuenta de Ahorro |

#### 3. Products to Pay Section
- **Section Title**: "Productos a pagar para {BENEFICIARY_NAME}" (blue #1D4E8F, 16px medium)
- **Divider**: Gray line below

For each product:
| Label | Value |
|-------|-------|
| {Product Type}: | ${amount} |

Example: "Crédito de Libre Inversión:" → "$850.000"

#### 4. Total Section
- **Divider**: Gray line above
- **Label**: "Valor Total:" (15px regular)
- **Value**: "850.000" (18px medium, right-aligned)

### Footer Actions
- **Back Link**: "Volver" (blue #004266, 14px medium, left)
- **Confirm Button**: "Confirmar Pago" (primary blue button, right)

---

## Page 4: Step 3 - SMS Code Input

### Layout
- **Header**: Back button + Title + Breadcrumbs
- **Stepper**: Steps 1-3 active (blue), Step 4 inactive
- **Content Card**: White card with code input form

### Content Sections

#### 1. Section Header
- **Title**: "Código Enviado a tu Teléfono" (blue #1D4E8F, 17px bold, centered)

#### 2. Instructions
- **Text**: "Ingresa la clave de 6 dígitos enviada a tu dispositivo para autorizar la transacción" (15px regular, centered)

#### 3. Code Input
- **Input Fields**: 6 individual digit inputs (OTP-style)
- **Style**: Each input is a bordered box for single digit

#### 4. Resend Section
- **Text**: "¿No recibiste la clave?" (15px regular)
- **Link**: "Reenviar" (blue #1D4E8F, 15px medium, underlined)

### Footer Actions
- **Back Link**: "Volver" (blue #004266, 14px medium, left)
- **Pay Button**: "Pagar" (primary blue button, right)

---

## Page 5: Step 4 - Response/Success (Finalización)

### Layout
- **Header**: Back button + Title + Breadcrumbs
- **Stepper**: All 4 steps active (blue)
- **Content Card**: White card with transaction result

### Success State Content

#### 1. Success Icon
- **Icon**: Green checkmark in circle
- **Size**: ~60px diameter
- **Color**: Green (#00A44C) checkmark, green border

#### 2. Success Title
- **Text**: "Transacción Exitosa" (blue #1D4E8F, 22px bold, centered)

#### 3. Transaction Details
Two-column layout with dividers:

| Label | Value |
|-------|-------|
| Línea crédito: | Crédito de Libre Inversión |
| Número de producto: | ***5678 |
| Valor pagado: | $ 850.000 |
| **Divider** | |
| Costo transacción: | $ 0 |
| **Divider** | |
| Fecha de Transmisión: | 1 de septiembre de 2025 |
| Hora de Transacción: | 10:21 pm |
| Número de Aprobación: | 950606 |
| Descripción: | Exitosa (green #00A44C) |

### Footer Actions
- **Print/Save Button**: "Imprimir/Guardar" (secondary outlined button, navy border)
- **Finish Button**: "Finalizar" (primary blue button)

### Data Structure
```typescript
interface TransactionResult {
  success: boolean;
  creditLine: string;
  productNumber: string;
  amountPaid: number;
  transactionCost: number;
  transmissionDate: string;
  transactionTime: string;
  approvalNumber: string;
  description: 'Exitosa' | 'Fallida' | 'Pendiente';
}
```

---

## UI Components to Reuse

### Existing Components
- `BackButton` - Back navigation arrow
- `Breadcrumbs` - Navigation breadcrumbs
- `Button` - Primary and secondary variants
- `Card` - Container cards
- `Checkbox` - Product selection (from existing or needs creation)
- `Select` / `SelectField` - Account dropdown
- `Input` - Currency input for payment amount
- `Link` - "Volver" and "Reenviar" links

### Components to Create/Extend

#### 1. `PaymentStepper` (Molecule)
Reusable 4-step progress stepper:
```typescript
interface PaymentStepperProps {
  currentStep: 1 | 2 | 3 | 4;
  steps: Array<{
    number: number;
    label: string;
  }>;
}
```

#### 2. `BeneficiaryListItem` (Molecule)
Selectable beneficiary card:
```typescript
interface BeneficiaryListItemProps {
  name: string;
  alias: string;
  maskedDocument: string;
  onClick: () => void;
}
```

#### 3. `PayableProductCard` (Molecule)
Product selection card with payment input:
```typescript
interface PayableProductCardProps {
  product: PayableProduct;
  isSelected: boolean;
  onSelectionChange: (selected: boolean) => void;
  onAmountChange: (amount: number) => void;
}
```

#### 4. `PaymentConfirmationRow` (Molecule)
Label-value pair row for confirmation:
```typescript
interface PaymentConfirmationRowProps {
  label: string;
  value: string;
  valueColor?: 'default' | 'success' | 'error';
}
```

#### 5. `OtpInput` (Molecule)
6-digit code input:
```typescript
interface OtpInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
}
```

#### 6. `TransactionSuccessCard` (Organism)
Success result display with icon and details:
```typescript
interface TransactionSuccessCardProps {
  title: string;
  details: Array<{
    label: string;
    value: string;
    highlight?: boolean;
  }>;
  onPrint?: () => void;
  onFinish: () => void;
}
```

---

## Routing Structure

```
app/(authenticated)/pagos/
├── otros-asociados/
│   ├── page.tsx                    # Beneficiary selection
│   └── [beneficiaryId]/
│       ├── page.tsx                # Redirects to detalle
│       ├── detalle/page.tsx        # Step 1: Details
│       ├── confirmacion/page.tsx   # Step 2: Confirmation
│       ├── sms/page.tsx            # Step 3: SMS Code
│       └── resultado/page.tsx      # Step 4: Result
```

Alternative (simpler) single-page approach with state:
```
app/(authenticated)/pagos/
├── otros-asociados/
│   └── page.tsx                    # Multi-step wizard (all in one)
```

---

## State Management

### Payment Flow State
```typescript
interface PaymentOtrosAsociadosState {
  // Step 0: Beneficiary Selection
  selectedBeneficiary: RegisteredBeneficiary | null;

  // Step 1: Details
  sourceAccount: SourceAccount | null;
  selectedProducts: PayableProduct[];
  totalAmount: number;

  // Step 2: Confirmation (derived from above)

  // Step 3: SMS
  otpCode: string;
  otpError: string | null;
  isResending: boolean;

  // Step 4: Result
  transactionResult: TransactionResult | null;

  // Navigation
  currentStep: 0 | 1 | 2 | 3 | 4;
  isLoading: boolean;
  error: string | null;
}
```

---

## Colors Reference

| Element | Color | Hex |
|---------|-------|-----|
| Primary Text (titles) | Navy Blue | #1D4E8F |
| Primary Button | Blue | #007FFF |
| Secondary Button Border | Navy | #1D4E8F |
| Link Text | Dark Blue | #004266 |
| Success Text/Icon | Green | #00A44C |
| Inactive Step | Gray | #E4E6EA |
| Inactive Step Text | Gray | #808284 |
| Card Background | White | #FFFFFF |
| Page Background | Light Blue | #F0F9FF |
| Divider Lines | Gray | #E4E6EA, #B1B1B1 |

---

## Typography Reference

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Page Title | Ubuntu | 20px | Medium |
| Section Title | Ubuntu | 18px | Bold |
| Subsection Title | Ubuntu | 16-17px | Medium/Bold |
| Body Text | Ubuntu | 15px | Regular |
| Small Text | Ubuntu | 14px | Regular |
| Labels (light) | Ubuntu | 12px | Light |
| Stepper Labels | Ubuntu | 12px | Regular |
| Currency Values | Ubuntu | 21px | Regular/Medium |
| Button Text | Ubuntu | 14-16px | Bold |

---

## Validation Rules

### Step 1: Details
- At least one product must be selected
- Payment amount must be > 0 for selected products
- Payment amount cannot exceed source account balance
- Total payment must be <= source account balance

### Step 3: SMS Code
- Code must be exactly 6 digits
- Code expires after certain time (show countdown)
- Limited resend attempts

---

## Error States

### Insufficient Balance
- Show warning when total exceeds available balance
- Disable "Continuar" button
- Link to "¿Necesitas más saldo?"

### Invalid OTP
- Show error message below input
- Allow retry
- After X attempts, redirect to failure page

### Transaction Failed
- Show error icon (red X) instead of success checkmark
- Title: "Transacción Fallida" or error message
- Show error details
- Provide retry option

---

## Accessibility Considerations

- All form inputs must have associated labels
- Focus management between OTP inputs
- Keyboard navigation for beneficiary selection
- Screen reader announcements for step changes
- Error messages linked to inputs via aria-describedby
