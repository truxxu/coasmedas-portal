# Feature 10 - Transferencias: Design References

**Version**: 1.0
**Last Updated**: 2026-01-13
**Status**: In Development

---

## Overview

The Transferencias (Transfers) feature enables users to move money between their own accounts, to other associates' accounts, from credit lines, and from external banks via PSE. This document focuses on the **"Entre mis cuentas"** (Between my accounts) flow within the **Internas** (Internal) category.

### Sidebar Navigation Structure

When "Transferencias" is clicked in the sidebar, an accordion expands showing:

- **Internas** (Internal transfers)
- Inscribir cuentas (Register accounts)
- A otros bancos (To other banks)
- Cuentas de mi red Coopcentral (My Coopcentral network accounts)
- Programar transferencias (Schedule transfers)

### Internas Sub-flows

The "Internas" category contains 4 different flows:

1. **Entre mis cuentas** - Transfer between user's own accounts (THIS DOCUMENT)
2. A cuentas de mi red - Transfer to previously registered associate accounts
3. Desde cupos rotativos - Transfer from credit lines to accounts
4. Recargar con PSE - Bring money from other banks via PSE

---

## Figma References

| Screen               | Figma URL                                                                                  | Node ID    |
| -------------------- | ------------------------------------------------------------------------------------------ | ---------- |
| Flow Selection       | [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=772-1203) | `772:1203` |
| Step 1: Details      | [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=789-2)    | `789:2`    |
| Step 2: Confirmation | [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=789-222)  | `789:222`  |
| Step 3: SMS Code     | [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=789-333)  | `789:333`  |
| Step 4: Response     | [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=789-441)  | `789:441`  |

---

## Screen 1: Flow Selection (Internas Landing)

**Route**: `/transferencias/internas`

### Layout

- Standard authenticated layout with Sidebar and TopBar
- Page title: "Internas" with back button (arrow left)
- Breadcrumbs: `Inicio / Transferencias / Internas`
- Hide balances toggle in top right

### Content Card

- Background: White (`#FFFFFF`)
- Border radius: `16px`
- Padding: `24px`
- Shadow: Standard card shadow

### Header Section

- Title: "Transferencias Internas"
  - Font: Ubuntu Bold, 21px
  - Color: `#1D4E8F` (Primary Navy)
- Description: "Transfiere entre tus productos financieros, a otros asociados de la cooperativa o trae dinero desde otros bancos de manera rápida y sencilla."
  - Font: Ubuntu Regular, 15px
  - Color: `#000000` (Black)

### Flow Option Cards (2x2 Grid)

Each option card:

- Border: `1px dashed #B1B1B1`
- Border radius: `8px`
- Padding: `20px`
- Hover: Clickable cursor
- Layout: Centered text

#### Card 1: Entre mis cuentas

- Title: "Entre mis cuentas"
  - Font: Ubuntu Medium, 20px
  - Color: `#1D4E8F`
- Description: "Mueve dinero entre tus cuentas de ahorro, bolsillos y más."
  - Font: Ubuntu Regular, 15px
  - Color: `#000000`

#### Card 2: A cuentas de mi red

- Title: "A cuentas de mi red"
  - Font: Ubuntu Medium, 20px
  - Color: `#1D4E8F`
- Description: "Transfiere a cuentas de asociador previamente inscritos."
  - Font: Ubuntu Regular, 15px
  - Color: `#000000`

#### Card 3: Desde cupos rotativos

- Title: "Desde cupos rotativos"
  - Font: Ubuntu Medium, 20px
  - Color: `#1D4E8F`
- Description: "Utiliza tus cupos de crédito para transferir a tus cuentas."
  - Font: Ubuntu Regular, 15px
  - Color: `#000000`

#### Card 4: Recargar con PSE

- Title: "Recargar con PSE"
  - Font: Ubuntu Medium, 20px
  - Color: `#1D4E8F`
- Description: "Trae dinero desde otros bancos a tus cuentas Coasmedas."
  - Font: Ubuntu Regular, 15px
  - Color: `#000000`

---

## Screen 2: Step 1 - Details (Entre mis Cuentas)

**Route**: `/transferencias/internas/entre-mis-cuentas`

### Page Header

- Back button (arrow left icon)
- Title: "Entre mis Cuentas"
  - Font: Ubuntu Medium, 20px
  - Color: `#000000`
- Breadcrumbs: `Inicio / Transferencias / Entre mis Cuentas`

### Stepper Component (4 Steps)

Horizontal stepper positioned below breadcrumbs:

- Background: White with shadow
- Height: `76px`
- Steps connected by lines

#### Step States

- **Active/Completed**:
  - Circle: `40px` diameter, background `#007FFF`
  - Number: Ubuntu Bold, 16px, White
  - Label: Ubuntu Regular, 12px, `#4B5563`
  - Connecting line: `#007FFF`, 4px height

- **Pending**:
  - Circle: `40px` diameter, background `#E4E6EA`
  - Number: Ubuntu Bold, 16px, `#808284`
  - Label: Ubuntu Regular, 12px, `#6B7280`
  - Connecting line: `#E4E6EA`, 4px height

#### Step Labels

1. "Detalle" (Detail)
2. "Confirmación" (Confirmation)
3. "SMS"
4. "Finalización" (Completion)

### Form Card

- Background: White (`#FFFFFF`)
- Border radius: `16px`
- Padding: `24px`

#### Card Title

- Text: "Transferencias entre mis productos"
- Font: Ubuntu Bold, 18px
- Color: `#1D4E8F`

#### Card Description

- Text: "Mueve dinero entre tus cuentas de ahorro, bolsillos, inversiones y más."
- Font: Ubuntu Regular, 15px
- Color: `#000000`

### Form Fields

#### Field 1: Source Account

- Label: "¿De cuál cuenta quieres transferir?"
  - Font: Ubuntu Regular, 15px
  - Color: `#000000`
- Input: Select/Dropdown
  - Border: `1px solid #B1B1B1`
  - Border radius: `6px`
  - Height: `44px`
  - Placeholder example: "Cuenta de Ahorros (\*\*\*4428) - Saldo: $ 8.730.500"
  - Chevron icon on right

#### Field 2: Destination Product

- Label: "¿A qué producto quieres abonar?"
  - Font: Ubuntu Regular, 15px
  - Color: `#000000`
- Input: Select/Dropdown
  - Border: `1px solid #B1B1B1`
  - Border radius: `6px`
  - Height: `44px`
  - Placeholder example: "Ahorro Programado (\*\*\*1234)"
  - Chevron icon on right

#### Field 3: Amount

- Label: "¿Qué valor deseas transferir?"
  - Font: Ubuntu Regular, 15px
  - Color: `#000000`
- Input: Currency input
  - Prefix: "$" (Ubuntu Medium, 19px, `#595959`)
  - Value aligned right
  - Border bottom: `1px solid #B1B1B1`
  - Default value: "0"

### Action Buttons

#### Back Link

- Text: "Volver"
- Font: Ubuntu Medium, 14px
- Color: `#004266`
- Position: Bottom left

#### Confirm Button

- Text: "Confirmar"
- Font: Ubuntu Bold, 14px
- Background: `#A6C4FF` (disabled state) / `#007FFF` (enabled)
- Text color: White
- Border radius: `6px`
- Padding: `9px 28px`
- Shadow: `0px 2px 4px rgba(0,0,0,0.1)`
- Position: Bottom right

---

## Screen 3: Step 2 - Confirmation

**Route**: `/transferencias/internas/entre-mis-cuentas/confirmacion`

### Page Header

Same as Step 1 with stepper showing Step 2 active

### Confirmation Card

- Background: White (`#FFFFFF`)
- Border radius: `16px`
- Padding: `24px`

#### Card Title

- Text: "Confirmación de Pago"
- Font: Ubuntu Bold, 18px
- Color: `#004266`

#### Card Description

- Text: "Por favor, verifica que los datos de la transacción sean correctos antes de continuar."
- Font: Ubuntu Regular, 15px
- Color: `#000000`

### Transaction Details

Two-column layout with labels on left, values on right:

| Label               | Value Style                    |
| ------------------- | ------------------------------ |
| Nombre del Titular: | Ubuntu Medium, 15px, `#000000` |
| Documento Titular:  | Ubuntu Medium, 15px, `#000000` |
| Cuenta Origen:      | Ubuntu Medium, 15px, `#000000` |
| Cuenta Destino:     | Ubuntu Medium, 15px, `#000000` |
| Valor a Transferir: | Ubuntu Medium, 18px, `#000000` |

Labels:

- Font: Ubuntu Regular, 15px
- Color: `#000000`

Divider lines:

- Color: `#E4E6EA`
- Between sections (after Documento, after Cuenta Destino)

#### Example Values

- Nombre del Titular: "CAMILO ANDRÉS CRUZ"
- Documento Titular: "CC 1.***.***234"
- Cuenta Origen: "Cuenta de Ahorros (\*\*\*4428)"
- Cuenta Destino: "Ahorro Programado (\*\*\*1234)"
- Valor a Transferir: "$ 50.000"

### Action Buttons

#### Back Link

- Text: "Volver"
- Font: Ubuntu Medium, 14px
- Color: `#004266`

#### Confirm Button

- Text: "Confirmar Pago"
- Font: Ubuntu Bold, 14px
- Background: Gradient `#007FFF` to `#007FFF`
- Text color: White
- Border radius: `6px`
- Padding: `9px 28px`
- Shadow: `0px 2px 4px rgba(0,0,0,0.1)`

---

## Screen 4: Step 3 - SMS Code Input

**Route**: `/transferencias/internas/entre-mis-cuentas/sms`

### Page Header

Same as previous steps with stepper showing Step 3 active

### SMS Verification Card

- Background: White (`#FFFFFF`)
- Border radius: `16px`
- Padding: `24px`
- Centered content

#### Card Title

- Text: "Código Enviado a tu Teléfono"
- Font: Ubuntu Bold, 17px
- Color: `#1D4E8F`
- Text align: Center

#### Card Description

- Text: "Ingresa la clave de 6 dígitos enviada a tu dispositivo para autorizar la transacción"
- Font: Ubuntu Regular, 15px
- Color: `#000000`
- Text align: Center

### OTP Input

- 6 individual digit input boxes (not shown in detail, implied by description)
- Centered layout

### Resend Code Section

- Text: "¿No recibiste la clave?"
  - Font: Ubuntu Regular, 15px
  - Color: `#000000`
- Link: "Reenviar"
  - Font: Ubuntu Medium, 15px
  - Color: `#1D4E8F`
  - Underline on hover

### Action Buttons

#### Back Link

- Text: "Volver"
- Font: Ubuntu Medium, 14px
- Color: `#004266`

#### Submit Button

- Text: "Pagar"
- Font: Ubuntu Bold, 14px
- Background: `#007FFF`
- Text color: White
- Border radius: `6px`
- Padding: `9px 28px`
- Shadow: `0px 2px 4px rgba(0,0,0,0.1)`

---

## Screen 5: Step 4 - Transaction Result (Success)

**Route**: `/transferencias/internas/entre-mis-cuentas/resultado`

### Page Header

Same as previous steps with stepper showing all 4 steps completed (all blue)

### Result Card

- Background: White (`#FFFFFF`)
- Border radius: `16px`
- Padding: `24px`

### Success Icon

- Large checkmark in circle
- Circle: Border `#00AFA9` (Teal)
- Checkmark: `#00AFA9` (Teal)
- Size: ~60px diameter
- Centered at top

### Success Title

- Text: "Transacción Exitosa"
- Font: Ubuntu Bold, 22px
- Color: `#1D4E8F`
- Text align: Center

### Transaction Summary

Two-column layout with divider lines:

#### Section 1: Account Info

| Label               | Value             |
| ------------------- | ----------------- |
| Línea crédito:      | Cuenta de Ahorros |
| Número de producto: | Ahorro Programado |

#### Section 2: Amount Info

| Label              | Value    |
| ------------------ | -------- |
| Valor pagado:      | $ 50.000 |
| Costo transacción: | $ 0      |

Divider: `#E4E6EA`

#### Section 3: Transaction Details

| Label                 | Value                                   |
| --------------------- | --------------------------------------- |
| Fecha de Transmisión: | 1 de septiembre de 2025                 |
| Hora de Transacción:  | 7:21 pm                                 |
| Número de Aprobación: | 950606                                  |
| Descripción:          | Transferencia Exitosa (green `#00A44C`) |

### Action Buttons (3 buttons)

#### Print/Save Button (Secondary)

- Text: "Imprimir/Guardar"
- Font: Ubuntu Bold, 16px
- Background: White
- Border: `1px solid #1D4E8F`
- Text color: `#1D4E8F`
- Border radius: `6px`
- Padding: `9px 28px`
- Shadow: `0px 2px 4px rgba(0,0,0,0.1)`

#### New Transaction Button (Secondary)

- Text: "Realizar otra transacción"
- Font: Ubuntu Bold, 16px
- Background: White
- Border: `1px solid #1D4E8F`
- Text color: `#1D4E8F`
- Border radius: `6px`
- Padding: `9px 28px`
- Shadow: `0px 2px 4px rgba(0,0,0,0.1)`

#### Finish Button (Primary)

- Text: "Finalizar"
- Font: Ubuntu Bold, 14px
- Background: `#007FFF`
- Text color: White
- Border radius: `6px`
- Padding: `9px 28px`
- Shadow: `0px 2px 4px rgba(0,0,0,0.1)`

---

## Component Specifications

### Stepper Component (New)

A reusable 4-step horizontal stepper:

```typescript
interface StepperProps {
  currentStep: 1 | 2 | 3 | 4;
  steps: Array<{
    number: number;
    label: string;
  }>;
}
```

#### Step States

- `completed`: Blue circle, white number, blue connecting line
- `active`: Blue circle, white number
- `pending`: Gray circle, gray number, gray connecting line

#### Default Steps for Transfers

```typescript
const transferSteps = [
  { number: 1, label: "Detalle" },
  { number: 2, label: "Confirmación" },
  { number: 3, label: "SMS" },
  { number: 4, label: "Finalización" },
];
```

### Flow Selection Card (New)

A clickable card for flow selection:

```typescript
interface FlowOptionCardProps {
  title: string;
  description: string;
  onClick: () => void;
}
```

#### Styling

- Border: `1px dashed #B1B1B1`
- Border radius: `8px`
- Padding: `20px`
- Hover: Cursor pointer, slight background change
- Title color: `#1D4E8F`

### Transfer Confirmation Card (New)

A summary card showing transaction details:

```typescript
interface TransferConfirmationProps {
  holderName: string;
  documentNumber: string; // Masked
  sourceAccount: string;
  destinationAccount: string;
  amount: number;
}
```

### SMS Code Input (New)

OTP input component for 6-digit codes:

```typescript
interface OTPInputProps {
  length: 6;
  onComplete: (code: string) => void;
  onResend: () => void;
}
```

### Transaction Result Card (New)

Success/Error result display:

```typescript
interface TransactionResultProps {
  status: "success" | "error";
  title: string;
  details: {
    sourceType: string;
    productNumber: string;
    amountPaid: number;
    transactionCost: number;
    transmissionDate: string;
    transactionTime: string;
    approvalNumber: string;
    description: string;
  };
  onPrint: () => void;
  onNewTransaction: () => void;
  onFinish: () => void;
}
```

---

## Reusable Patterns

### Page Header Pattern

All transfer pages use consistent header:

- Back button (arrow left)
- Page title (Ubuntu Medium, 20px)
- Breadcrumbs below
- Hide balances toggle (top right)

### Card Container Pattern

All content cards use:

- Background: White
- Border radius: `16px`
- Padding: `24px`
- Shadow: Standard card shadow

### Button Layout Pattern

Footer actions:

- "Volver" link on bottom left
- Primary action button on bottom right
- Multiple buttons: Right-aligned with gap

---

## Colors Used

| Usage           | Color                 | Hex                   |
| --------------- | --------------------- | --------------------- |
| Primary Navy    | Titles, buttons       | `#1D4E8F`             |
| Primary Blue    | Active steps, buttons | `#007FFF`             |
| Disabled Button | Confirm disabled      | `#A6C4FF`             |
| Link Text       | Volver link           | `#004266`             |
| Success Green   | Checkmark, status     | `#00A44C` / `#00AFA9` |
| Gray Text       | Step labels           | `#6B7280` / `#808284` |
| Gray Lines      | Dividers, step lines  | `#E4E6EA`             |
| Border Gray     | Input borders         | `#B1B1B1`             |
| Black           | Body text             | `#000000`             |
| White           | Backgrounds           | `#FFFFFF`             |

---

## Typography Summary

| Element          | Font   | Size      | Weight         |
| ---------------- | ------ | --------- | -------------- |
| Page Title       | Ubuntu | 20px      | Medium         |
| Card Title       | Ubuntu | 18-21px   | Bold           |
| Card Description | Ubuntu | 15px      | Regular        |
| Form Labels      | Ubuntu | 15px      | Regular        |
| Form Values      | Ubuntu | 15px-18px | Medium         |
| Step Labels      | Ubuntu | 12px      | Regular        |
| Step Numbers     | Ubuntu | 16px      | Bold           |
| Button Text      | Ubuntu | 14-16px   | Bold           |
| Link Text        | Ubuntu | 14px      | Medium         |
| Breadcrumbs      | Ubuntu | 15px      | Regular/Medium |

---

## Routes Summary

| Route                                                     | Description              |
| --------------------------------------------------------- | ------------------------ |
| `/transferencias/internas`                                | Flow selection page      |
| `/transferencias/internas/entre-mis-cuentas`              | Step 1: Details form     |
| `/transferencias/internas/entre-mis-cuentas/confirmacion` | Step 2: Confirmation     |
| `/transferencias/internas/entre-mis-cuentas/sms`          | Step 3: SMS verification |
| `/transferencias/internas/entre-mis-cuentas/resultado`    | Step 4: Result           |

---

## State Management Considerations

### Transfer Form State

```typescript
interface TransferFormState {
  sourceAccountId: string;
  destinationProductId: string;
  amount: number;
}
```

### Transfer Flow State

```typescript
interface TransferFlowState {
  currentStep: 1 | 2 | 3 | 4;
  formData: TransferFormState;
  confirmationData?: TransferConfirmationData;
  smsCode?: string;
  result?: TransactionResult;
}
```

---

## Validation Rules

### Amount Field

- Must be greater than 0
- Must not exceed source account balance
- Format: Colombian peso format ($ X.XXX.XXX)

### SMS Code

- Must be exactly 6 digits
- Must be numeric only
- Resend available after timeout

---

## Accessibility Notes

- All form fields must have proper labels
- Stepper must indicate current step to screen readers
- Success/error states must be announced
- Focus management between steps
- Keyboard navigation for OTP input

---

**Last Reviewed**: 2026-01-13
**Status**: Ready for Implementation
