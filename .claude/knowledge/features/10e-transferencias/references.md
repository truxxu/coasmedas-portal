# Feature 10e - Transferencias: A Otros Bancos

## Overview

The "A Otros Bancos" (To Other Banks) transfer flow allows users to transfer money from their Coasmedas savings account to external bank accounts registered in the system. This is a 4-step flow: Details, Confirmation, SMS Verification, and Result.

**Route**: `/transferencias/otros-bancos`

## Figma Design References

| Screen                   | Node ID    | URL                                                                                     |
| ------------------------ | ---------- | --------------------------------------------------------------------------------------- |
| Step 1: Details          | 842-2      | [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=842-2) |
| Step 2: Confirmation     | 842-5      | [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=842-5) |
| Step 3: SMS Verification | (existing) | Uses existing OTP verification page                                                     |
| Step 4: Result           | 842-9      | [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=842-9) |

---

## Flow Steps

### Stepper Configuration

The flow uses a 4-step stepper with the following labels:

1. **Detalle** (Details)
2. **Confirmación** (Confirmation)
3. **SMS** (Verification)
4. **Finalización** (Result)

---

## Step 1: Details Page

### Page Layout

#### Header Section

- **Back Button**: Arrow left, navigates to previous page (transfers landing)
- **Page Title**: "A Otros Bancos" (20px, medium weight, black)
- **Breadcrumbs**: `Inicio / Transferencias / A Otros Bancos`
- **Hide Balances Toggle**: Top right corner

#### Stepper

- Position: Below header, full width
- Step 1 (Detalle): Active state (blue `#00B8ED`)
- Steps 2-4: Pending state (gray `#E4E6EA`)

#### Main Content Card

- **Card Title**: "Transferencias Externas" (18px, bold, navy `#005066`)
- **Description**: "Transfiere dinero a cuentas en otros bancos o entidades financieras."

### Form Fields

| Field          | Type            | Label                                     | Placeholder/Default                                                         |
| -------------- | --------------- | ----------------------------------------- | --------------------------------------------------------------------------- |
| Cuenta Origen  | Select/Dropdown | "¿De cuál cuenta quieres transferir?"     | Shows account with balance (e.g., "Cuenta de Ahorros - Saldo: $ 8.730.500") |
| Cuenta Destino | Select/Dropdown | "Cuenta destino"                          | "Selecciona una cuenta inscrita..."                                         |
| Monto          | Currency Input  | "¿Qué valor deseas transferir?"           | "$ 0"                                                                       |
| Concepto       | Text Input      | "¿Cuál es el concepto de la transacción?" | "Descripción de la transferencia"                                           |

### Form Layout Details

#### Source Account Select

- Dropdown showing user's available accounts
- Displays account type and current balance
- Format: "Cuenta de Ahorros - Saldo: $ X.XXX.XXX"

#### Destination Account Select

- Dropdown with previously registered external accounts
- Placeholder: "Selecciona una cuenta inscrita..."
- Accounts come from the "Inscribir Cuentas" feature

#### Amount Input

- Currency input with peso sign prefix
- Dollar sign on left: "$ "
- Value aligned right
- Numeric input with thousand separators

#### Concept Input

- Single line text input
- Placeholder text in gray `#727272`: "Descripción de la transferencia"

### Form Actions

- **Back Link**: "Volver" (navy `#004266`, bottom left)
- **Primary Button**: "Confirmar" (blue `#00B8ED`, disabled state `#8FE6FF`, bottom right)

### Card Styling

- Background: White `#FFFFFF`
- Border radius: `16px`
- Padding: `24px`
- Shadow: `0 2px 8px rgba(0,0,0,0.08)`

---

## Step 2: Confirmation Page

### Page Layout

#### Header Section

- Same as Step 1 (Back Button, Title, Breadcrumbs, Hide Balances Toggle)

#### Stepper

- Steps 1-2: Completed/Active state (blue `#00B8ED`)
- Steps 3-4: Pending state (gray `#E4E6EA`)

### Main Content Card

#### Card Title

- **Title**: "Confirmación de Transferencia" (18px, bold, navy `#005066`)
- **Description**: "Por favor, verifica que los datos de la transacción sean correctos antes de continuar."

### Transfer Details Summary

| Label               | Value Example      | Alignment          |
| ------------------- | ------------------ | ------------------ |
| Nombre Titular:     | CAMILO ANDRÉS CRUZ | Right              |
| Documento Titular:  | CC 1.**_._**. 231  | Right (masked)     |
| Producto a Debitar: | Cuenta de Ahorros  | Right              |
| ---                 | --- (divider line) | ---                |
| Titular Destino:    | MARÍA GONZALEZ     | Right              |
| Banco Destino:      | Bancolombia        | Right              |
| Tipo de Cuenta:     | Ahorros            | Right              |
| Cuenta Destino:     | 123.-456789-01     | Right              |
| Valor a Transferir: | $ 500.000          | Right (bold, 18px) |
| Concepto:           | Vacaciones         | Right              |

### Summary Row Styling

- Label: Light weight (`Ubuntu Light`), gray `#232323`, left aligned
- Value: Regular weight, black, right aligned
- Amount value: Medium weight, larger font (18px)
- Divider lines between sections: `1px solid #E4E6EA`

### Actions

- **Back Link**: "Volver" (navy `#004266`, bottom left)
- **Primary Button**: "Confirmar Pago" (blue `#00B8ED`, bottom right)

---

## Step 3: SMS Verification Page

Uses the existing OTP verification component (`CodeInputCard`).

### Stepper

- Steps 1-3: Completed/Active state (blue `#00B8ED`)
- Step 4: Pending state (gray `#E4E6EA`)

### Content

- Reuse existing SMS verification flow from other transfer/payment features
- 6-digit code input
- Resend code functionality
- Timer countdown

---

## Step 4: Result Page

### Page Layout

#### Header Section

- Same as previous steps

#### Stepper

- All 4 steps: Completed state (blue `#00B8ED`)

### Success State Content

#### Success Icon and Title

- **Icon**: Large green checkmark circle (success icon)
  - Circle: Green border `#00A44C` or similar
  - Checkmark: White on green background
  - Size: ~60px diameter
- **Title**: "Transacción Exitosa" (22px, bold, navy `#005066`)
- Centered above the details card

### Transaction Details Summary

| Label                 | Value Example         | Alignment               |
| --------------------- | --------------------- | ----------------------- |
| Cuenta Origen:        | Cuenta de Ahorros     | Right                   |
| Banco Destino:        | Bancolombia           | Right                   |
| Cuenta Destino:       | 123-456789-01         | Right                   |
| Valor Transferido:    | $ 500.000             | Right (bold, 18px)      |
| Concepto:             | Vacaciones            | Right                   |
| Costo Transacción:    | $ 0                   | Right                   |
| ---                   | --- (divider line)    | ---                     |
| Fecha de Transacción: | 5 de Enero de 2025    | Right                   |
| Hora de Transacción:  | 03:02 p.m.            | Right                   |
| Número de Aprobación: | 256606                | Right                   |
| Descripción:          | Transferencia Exitosa | Right (green `#00A44C`) |

### Summary Row Styling

- Label: Light weight (`Ubuntu Light`), black, left aligned
- Value: Regular weight, black, right aligned
- Amount value: Medium weight, larger font (18px)
- Status description: Medium weight, green `#00A44C`
- Divider line between transfer details and transaction metadata

### Action Buttons

- **Secondary Button**: "Imprimir/Guardar" (outlined, navy border `#005066`, left)
- **Secondary Button**: "Realizar otra transacción" (outlined, navy border `#005066`, center)
- **Primary Button**: "Finalizar" (blue `#00B8ED`, right)

### Button Styling

- Secondary buttons: White background, `1px solid #005066` border, navy text
- Primary button: `#00B8ED` background, white text
- All buttons: `6px` border radius, `shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]`

---

## Component Breakdown

### New Components to Create

#### Organisms

- `ExternalTransferDetailsCard` - Transfer details form for external bank transfers
- `ExternalTransferConfirmationCard` - Confirmation summary card
- `ExternalTransferResultCard` - Result card with success/error states

### Existing Components to Reuse

#### Layout & Navigation

- `BackButton` - Back navigation arrow
- `Breadcrumbs` - Navigation breadcrumbs
- `HideBalancesToggle` - Balance visibility toggle
- `Stepper` - Multi-step progress indicator
- `Card` - Container card

#### Form Components

- `Select` / `SelectField` - Dropdown for account selection
- `CurrencyInput` - Amount input with formatting
- `Input` - Text input for concept
- `Label` - Form labels

#### Display Components

- `ConfirmationRow` - Row for confirmation screens (label + value)
- `SuccessIcon` - Green checkmark icon

#### Actions

- `Button` - Primary and secondary buttons
- `Link` - Back link

---

## Types

### Transfer Data Type

```typescript
interface ExternalTransferData {
  // Source
  sourceAccountId: string;
  sourceAccountType: string;
  sourceAccountBalance: number;

  // Destination (from registered accounts)
  destinationAccountId: string;
  destinationBankName: string;
  destinationAccountType: "ahorros" | "corriente";
  destinationAccountNumber: string;
  destinationHolderName: string;

  // Transfer details
  amount: number;
  concept: string;
}
```

### Transfer Confirmation Type

```typescript
interface ExternalTransferConfirmation {
  // Holder info
  holderName: string;
  holderDocument: string; // masked
  sourceProduct: string;

  // Destination info
  destinationHolder: string;
  destinationBank: string;
  destinationAccountType: string;
  destinationAccountNumber: string;

  // Transfer details
  amount: number;
  concept: string;
}
```

### Transfer Result Type

```typescript
interface ExternalTransferResult {
  success: boolean;

  // Transfer details
  sourceAccount: string;
  destinationBank: string;
  destinationAccountNumber: string;
  amountTransferred: number;
  concept: string;
  transactionCost: number;

  // Transaction metadata
  transactionDate: string;
  transactionTime: string;
  approvalNumber: string;
  description: string;

  // Error info (if failed)
  errorMessage?: string;
}
```

---

## State Management

### Page State

```typescript
interface ExternalTransferPageState {
  currentStep: 1 | 2 | 3 | 4;
  transferData: ExternalTransferData | null;
  confirmationData: ExternalTransferConfirmation | null;
  resultData: ExternalTransferResult | null;
  isLoading: boolean;
  error: string | null;
}
```

---

## User Flows

### Happy Path

1. User navigates to "A Otros Bancos" from transfers menu
2. User selects source account (savings)
3. User selects destination account (registered external account)
4. User enters amount to transfer
5. User enters transfer concept
6. User clicks "Confirmar"
7. User reviews transfer details on confirmation page
8. User clicks "Confirmar Pago"
9. User enters SMS verification code
10. User sees success result with transaction details
11. User can print/save, make another transaction, or finalize

### Error Handling

- Insufficient balance: Show validation error on amount field
- Invalid destination: Show error message
- SMS verification failed: Show error and allow retry
- Transfer failed: Show error result card with retry option

---

## Validation Rules

### Details Form

- **Source Account**: Required
- **Destination Account**: Required
- **Amount**:
  - Required
  - Must be greater than 0
  - Must not exceed source account balance
  - Numeric only with decimal support
- **Concept**:
  - Required
  - Max 100 characters
  - Alphanumeric with basic punctuation

---

## Styling Notes

### Card Container

- Background: White `#FFFFFF`
- Border radius: `16px`
- Padding: `24px`
- Shadow: `0 2px 8px rgba(0,0,0,0.08)`

### Form Fields

- Label: 14px, regular weight, black
- Input height: `44px`
- Input border: `1px solid #B1B1B1`
- Input border radius: `6px`
- Focus border: `2px solid #00B8ED`

### Summary Rows

- Label: Light weight, gray `#232323`
- Value: Regular weight, black
- Amount: Medium weight, 18px
- Row spacing: `12px` vertical gap
- Divider: `1px solid #E4E6EA`

### Success Icon

- Size: ~60px diameter
- Circle border: Green `#00A44C`
- Checkmark: White on green circle
- Margin bottom: `16px` before title

### Action Buttons

- Primary: `#00B8ED` background, white text, `6px` radius
- Secondary: White background, `#005066` border, navy text
- Disabled: `#8FE6FF` background (light blue)
- All: `padding: 9px 28px`, `shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]`

---

## File Structure (Proposed)

```
app/(authenticated)/transferencias/
└── otros-bancos/
    ├── page.tsx                    # Details step
    ├── confirmacion/
    │   └── page.tsx                # Confirmation step
    ├── sms/
    │   └── page.tsx                # SMS verification step
    └── resultado/
        └── page.tsx                # Result step

src/
├── organisms/
│   ├── ExternalTransferDetailsCard.tsx
│   ├── ExternalTransferConfirmationCard.tsx
│   ├── ExternalTransferResultCard.tsx
│   └── index.ts (update exports)
├── types/
│   └── external-transfer.ts
└── mocks/
    └── external-transfer.ts
```

---

## Mock Data

```typescript
// Source accounts available for transfer
const mockSourceAccounts = [
  {
    id: "savings-1",
    type: "Cuenta de Ahorros",
    balance: 8730500,
    number: "****4428",
  },
];

// Registered external accounts (from Inscribir Cuentas feature)
const mockDestinationAccounts = [
  {
    id: "dest-1",
    alias: "Cuenta Mamá",
    bankName: "Bancolombia",
    accountType: "ahorros",
    accountNumber: "123-456789-01",
    holderName: "MARÍA GONZALEZ",
  },
  {
    id: "dest-2",
    alias: "Cuenta Arriendo",
    bankName: "Davivienda",
    accountType: "ahorros",
    accountNumber: "987-654321-00",
    holderName: "INMOBILIARIA XYZ",
  },
];

// Mock transfer data for testing
const mockExternalTransferData: ExternalTransferData = {
  sourceAccountId: "savings-1",
  sourceAccountType: "Cuenta de Ahorros",
  sourceAccountBalance: 8730500,
  destinationAccountId: "dest-1",
  destinationBankName: "Bancolombia",
  destinationAccountType: "ahorros",
  destinationAccountNumber: "123-456789-01",
  destinationHolderName: "MARÍA GONZALEZ",
  amount: 500000,
  concept: "Vacaciones",
};

// Mock result data
const mockExternalTransferResult: ExternalTransferResult = {
  success: true,
  sourceAccount: "Cuenta de Ahorros",
  destinationBank: "Bancolombia",
  destinationAccountNumber: "123-456789-01",
  amountTransferred: 500000,
  concept: "Vacaciones",
  transactionCost: 0,
  transactionDate: "5 de Enero de 2025",
  transactionTime: "03:02 p.m.",
  approvalNumber: "256606",
  description: "Transferencia Exitosa",
};
```

---

## Related Features

- **10d - Inscribir Cuentas**: `/transferencias/inscribir-cuentas` - Register external bank accounts for transfers
- **10 - Transferencias Index**: `/transferencias/internas` - Transfer type selection
- **10b - Entre Mis Cuentas**: `/transferencias/internas/entre-mis-cuentas` - Internal transfers
- **10c - Cuentas Mi Red**: `/transferencias/internas/cuentas-mi-red` - Coopcentral network transfers

---

## Accessibility

- All form fields have associated labels
- Stepper steps have proper aria labels
- Success/error states announced to screen readers
- Focus management between steps
- Keyboard navigation for all interactive elements
- Color not used as sole indicator (icons + text for status)

---

## Notes

- Destination accounts come from the "Inscribir Cuentas" feature - user must have registered accounts first
- If no accounts registered, show message prompting user to register accounts
- Transaction cost is displayed (currently $0 in design)
- Print/Save functionality should generate PDF receipt
- "Realizar otra transacción" returns to step 1 with form reset
- "Finalizar" navigates to transfers landing or home
