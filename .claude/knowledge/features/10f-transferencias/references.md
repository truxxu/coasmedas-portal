# Feature 10f - Transferencias: Cuentas de mi Red Coopcentral (Transfer Flow)

## Overview

The "Cuentas de mi Red Coopcentral" transfer flow allows users to transfer money from their Coasmedas savings account to accounts within the Coopcentral cooperative network. This is a 4-step flow: Details, Confirmation, SMS Verification, and Result.

**Route**: `/transferencias/internas/cuentas-mi-red`

> **Note**: This feature extends the existing cuentas-mi-red pages which already have account selection. This documentation focuses on the full transfer flow (details, confirmation, result).

## Figma Design References

| Screen                   | Node ID   | URL                                                                                           |
| ------------------------ | --------- | --------------------------------------------------------------------------------------------- |
| Step 1: Details          | 842-11    | [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=842-11)      |
| Step 2: Confirmation     | 842-594   | [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=842-594)     |
| Step 3: SMS Verification | (existing)| Uses existing OTP verification page                                                           |
| Step 4: Result           | 842-1052  | [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=842-1052)    |

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
- **Page Title**: "Cuentas de mi Red Coopcentral" (20px, medium weight, black)
- **Breadcrumbs**: `Inicio / Transferencias / Cuentas de mi Red Coopcentral`
- **Hide Balances Toggle**: Top right corner

#### Stepper

- Position: Below header, full width with white background and shadow
- Step 1 (Detalle): Active state (blue `#00B8ED`)
- Steps 2-4: Pending state (gray `#E4E6EA`)
- Step indicator text: "Paso 1 de 4: Detalle" (white text on blue banner, 12px)

#### Main Content Card

- **Card Title**: "Transferencias a Cuentas de mi Red Coopcentral" (18px, bold, navy `#005066`)
- **Description**: "Envía dinero a otras cooperativas de la Red Coopcentral" (15px, regular)

### Form Fields

| Field          | Type            | Label                                 | Placeholder/Default                                                         |
| -------------- | --------------- | ------------------------------------- | --------------------------------------------------------------------------- |
| Cuenta Origen  | Select/Dropdown | "¿De cuál cuenta quieres transferir?" | Shows account with balance (e.g., "Cuenta de Ahorros - Saldo: $ 8.730.500") |
| Cuenta Destino | Select/Dropdown | "Cuenta destino"                      | "Selecciona una cuenta inscrita..."                                         |
| Monto          | Currency Input  | "¿Qué valor deseas transferir?"       | "$ 0" (with dollar sign prefix)                                             |
| Concepto       | Text Input      | "Concepto (Opcional)"                 | "Descripción de la transferencia"                                           |

### Form Layout Details

#### Source Account Select

- Dropdown showing user's available accounts
- Displays account type and current balance
- Format: "Cuenta de Ahorros - Saldo: $ X.XXX.XXX"
- Chevron down icon on right side

#### Destination Account Select

- Dropdown with previously registered Coopcentral network accounts
- Placeholder: "Selecciona una cuenta inscrita..."
- Accounts come from registered network accounts
- Chevron down icon on right side

#### Amount Input

- Label: "¿Qué valor deseas transferir?" (15px, regular)
- Currency input with peso sign prefix on left: "$"
- Value aligned right, showing "0" as default
- Font: 21px, bold, gray `#666`
- Bottom border line for input

#### Concept Input

- Label: "Concepto (Opcional)" (14px, regular)
- Single line text input
- Placeholder text in gray `#B1B1B1`: "Descripción de la transferencia"
- Border: `1px solid #B1B1B1`
- Border radius: `6px`

### Form Actions

- **Back Link**: "Volver" (14px, medium weight, navy `#004266`, bottom left)
- **Primary Button**: "Confirmar" (disabled state `#8FE6FF` until form is valid, enabled `#00B8ED`, bottom right)

### Card Styling

- Background: White `#FFFFFF`
- Border radius: `16px`
- Padding: `24px`
- Shadow: `0 2px 8px rgba(0,0,0,0.08)`

---

## Step 2: Confirmation Page

### Page Layout

#### Header Section

- **Back Button**: Arrow left, navigates back to details
- **Page Title**: "Red Coopcentral" (20px, medium weight, black)
- **Breadcrumbs**: `Inicio / Transferencias / Red Coopcentral`
- **Hide Balances Toggle**: Top right corner

#### Stepper

- Steps 1-2: Completed/Active state (blue `#00B8ED`)
- Steps 3-4: Pending state (gray `#E4E6EA`)

### Main Content Card

#### Card Title

- **Title**: "Confirmación de Pago" (18px, bold, navy `#005066`)
- **Description**: "Por favor, verifica que los datos de la transacción sean correctos antes de continuar." (15px, light weight)

### Transfer Details Summary

| Label               | Value Example          | Styling                           |
| ------------------- | ---------------------- | --------------------------------- |
| Nombre Titular:     | CAMILO ANDRÉS CRUZ     | Right aligned, regular            |
| Documento Titular:  | CC 1.***.***. 231      | Right aligned, masked             |
| Producto a Debitar: | Cuenta de Ahorros      | Right aligned, regular            |
| --- (divider)       | ---                    | Line separator `#E4E6EA`          |
| Titular Destino:    | PEDRO PEREZ            | Right aligned, regular            |
| Banco Destino:      | Coopcentral            | Right aligned, regular            |
| Tipo de Cuenta:     | Ahorros                | Right aligned, regular            |
| Cuenta Destino:     | 123.-456789-01         | Right aligned, regular            |
| Valor a Transferir: | $ 200.000              | Right aligned, bold, 18px         |
| --- (divider)       | ---                    | Line separator `#E4E6EA`          |
| Concepto:           | Clases mensuales       | Right aligned, regular            |

### Summary Row Styling

- Label: Light weight (`Ubuntu Light`), gray `#232323`, left aligned, 14px
- Value: Regular weight, black, right aligned, 14px
- Amount value: Medium weight, black, 18px
- Divider lines between sections: `1px solid #E4E6EA`

### Actions

- **Back Link**: "Volver" (14px, medium weight, navy `#004266`, bottom left)
- **Primary Button**: "Confirmar Pago" (blue `#00B8ED`, white text, bottom right)

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

- **Back Button**: Not shown on result page (no navigation back)
- **Page Title**: "Red Coopcentral" (20px, medium weight, black)
- **Breadcrumbs**: `Inicio / Transferencias / Red Coopcentral`
- **Hide Balances Toggle**: Top right corner

#### Stepper

- All 4 steps: Completed state (blue `#00B8ED`)

### Success State Content

#### Success Icon and Title

- **Icon**: Large green checkmark circle (success icon)
  - Circle: Green border/background `#00A44C`
  - Checkmark: White on green background
  - Size: ~60px diameter
- **Title**: "Transacción Exitosa" (22px, bold, navy `#005066`)
- Centered above the details card

### Transaction Details Summary

| Label                 | Value Example            | Styling                           |
| --------------------- | ------------------------ | --------------------------------- |
| Cuenta Origen:        | Cuenta de Ahorros        | Right aligned, regular            |
| Banco Destino:        | Coopcentral              | Right aligned, regular            |
| Cuenta Destino:       | 123-456789-01            | Right aligned, regular            |
| Valor Transferido:    | $200.000                 | Right aligned, bold, 18px         |
| Concepto:             | Clases mensuales         | Right aligned, regular            |
| Costo Transacción:    | $ 0                      | Right aligned, regular            |
| --- (divider)         | ---                      | Line separator `#E4E6EA`          |
| Fecha de Transacción: | 5 de Enero de 2025       | Right aligned, regular            |
| Hora de Transacción:  | 03:02 p.m.               | Right aligned, regular            |
| Número de Aprobación: | 251606                   | Right aligned, regular            |
| Descripción:          | Transferencia Exitosa    | Right aligned, green `#00A44C`    |

### Summary Row Styling

- Label: Light weight (`Ubuntu Light`), black, left aligned, 15px
- Value: Regular weight, black, right aligned, 15px
- Amount value: Medium weight, 18px
- Status description: Medium weight, green `#00A44C`
- Divider line between transfer details and transaction metadata

### Action Buttons

Three buttons aligned horizontally at the bottom:

- **Secondary Button**: "Imprimir/Guardar" (outlined, white background, navy border `#005066`, navy text, left)
- **Secondary Button**: "Realizar otra transacción" (outlined, white background, navy border `#005066`, navy text, center)
- **Primary Button**: "Finalizar" (blue `#00B8ED`, white text, right)

### Button Styling

- Secondary buttons: White background, `1px solid #005066` border, navy `#005066` text
- Primary button: `#00B8ED` background, white text
- All buttons: `6px` border radius, `shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]`, `padding: 9px 28px`

---

## Component Breakdown

### Components to Update/Enhance

The existing flow already has components. Review and update as needed:

#### Existing Pages to Review

- `/cuentas-mi-red/page.tsx` - Account selection (existing)
- `/cuentas-mi-red/detalle/page.tsx` - Details form (review against Figma)
- `/cuentas-mi-red/verificacion/page.tsx` - SMS verification (existing)
- `/cuentas-mi-red/resultado/page.tsx` - Result page (review against Figma)

#### New/Updated Organisms Needed

- `NetworkTransferDetailsCard` - Transfer details form (update if needed)
- `NetworkTransferConfirmationCard` - Confirmation summary card (**NEW** if not exists)
- `NetworkTransferResultCard` - Result card with success/error states (review)

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

### Network Transfer Data Type

```typescript
interface NetworkTransferData {
  // Source
  sourceAccountId: string;
  sourceAccountType: string;
  sourceAccountBalance: number;

  // Destination (from registered Coopcentral accounts)
  destinationAccountId: string;
  destinationBankName: string; // "Coopcentral"
  destinationAccountType: "ahorros" | "corriente";
  destinationAccountNumber: string;
  destinationHolderName: string;

  // Transfer details
  amount: number;
  concept?: string; // Optional
}
```

### Network Transfer Confirmation Type

```typescript
interface NetworkTransferConfirmation {
  // Holder info (sender)
  holderName: string;
  holderDocument: string; // masked (e.g., "CC 1.***.***. 231")
  sourceProduct: string;

  // Destination info
  destinationHolder: string;
  destinationBank: string;
  destinationAccountType: string;
  destinationAccountNumber: string;

  // Transfer details
  amount: number;
  concept?: string;
}
```

### Network Transfer Result Type

```typescript
interface NetworkTransferResult {
  success: boolean;

  // Transfer details
  sourceAccount: string;
  destinationBank: string;
  destinationAccountNumber: string;
  amountTransferred: number;
  concept?: string;
  transactionCost: number;

  // Transaction metadata
  transactionDate: string;
  transactionTime: string;
  approvalNumber: string;
  description: string; // e.g., "Transferencia Exitosa"

  // Error info (if failed)
  errorMessage?: string;
}
```

---

## State Management

### Page State

```typescript
interface NetworkTransferPageState {
  currentStep: 1 | 2 | 3 | 4;
  transferData: NetworkTransferData | null;
  confirmationData: NetworkTransferConfirmation | null;
  resultData: NetworkTransferResult | null;
  isLoading: boolean;
  error: string | null;
}
```

---

## User Flows

### Happy Path

1. User navigates to "Cuentas de mi Red Coopcentral" from transfers menu
2. User selects registered recipient account (if not pre-selected)
3. User selects source account (savings)
4. User selects destination account (registered Coopcentral account)
5. User enters amount to transfer
6. User optionally enters transfer concept
7. User clicks "Confirmar"
8. User reviews transfer details on confirmation page
9. User clicks "Confirmar Pago"
10. User enters SMS verification code
11. User sees success result with transaction details
12. User can print/save, make another transaction, or finalize

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
  - Optional
  - Max 100 characters if provided
  - Alphanumeric with basic punctuation

---

## Styling Notes

### Card Container

- Background: White `#FFFFFF`
- Border radius: `16px`
- Padding: `24px`
- Shadow: `0 2px 8px rgba(0,0,0,0.08)`

### Form Fields

- Label: 14-15px, regular weight, black
- Input height: `44px`
- Input border: `1px solid #B1B1B1`
- Input border radius: `6px`
- Focus border: `2px solid #00B8ED`
- Placeholder color: `#B1B1B1`

### Summary Rows

- Label: Light weight (`Ubuntu Light`), gray `#232323`, 14-15px
- Value: Regular weight, black
- Amount: Medium weight, 18px
- Row spacing: `12px` vertical gap
- Divider: `1px solid #E4E6EA`

### Success Icon

- Size: ~60px diameter
- Circle background: Green `#00A44C`
- Checkmark: White
- Margin bottom: `16px` before title

### Action Buttons

- Primary: `#00B8ED` background, white text, `6px` radius
- Secondary: White background, `#005066` border, navy text
- Disabled: `#8FE6FF` background (light blue)
- All: `padding: 9px 28px`, `shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]`

---

## File Structure (Current)

```
app/(authenticated)/transferencias/internas/
└── cuentas-mi-red/
    ├── page.tsx                    # Account selection (existing)
    ├── detalle/
    │   └── page.tsx                # Details step (review)
    ├── verificacion/
    │   └── page.tsx                # SMS verification step (existing)
    └── resultado/
        └── page.tsx                # Result step (review)

src/
├── organisms/
│   ├── RegisteredAccountsList.tsx  # Existing
│   ├── NetworkTransferForm.tsx     # Review/update
│   ├── NetworkTransferResultCard.tsx # Review/update
│   └── index.ts (update exports)
├── types/
│   └── networkTransfer.ts          # Review/update
└── mocks/
    └── mockNetworkTransferData.ts  # Review/update
```

### Proposed Updates

If a confirmation page component doesn't exist, create:

```
src/organisms/
└── NetworkTransferConfirmationCard.tsx  # NEW - Confirmation summary card
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

// Registered Coopcentral network accounts
const mockDestinationAccounts = [
  {
    id: "coopcentral-1",
    alias: "Pedro Trabajo",
    bankName: "Coopcentral",
    accountType: "ahorros",
    accountNumber: "123-456789-01",
    holderName: "PEDRO PEREZ",
  },
];

// Mock transfer data for testing
const mockNetworkTransferData: NetworkTransferData = {
  sourceAccountId: "savings-1",
  sourceAccountType: "Cuenta de Ahorros",
  sourceAccountBalance: 8730500,
  destinationAccountId: "coopcentral-1",
  destinationBankName: "Coopcentral",
  destinationAccountType: "ahorros",
  destinationAccountNumber: "123-456789-01",
  destinationHolderName: "PEDRO PEREZ",
  amount: 200000,
  concept: "Clases mensuales",
};

// Mock confirmation data
const mockNetworkTransferConfirmation: NetworkTransferConfirmation = {
  holderName: "CAMILO ANDRÉS CRUZ",
  holderDocument: "CC 1.***.***. 231",
  sourceProduct: "Cuenta de Ahorros",
  destinationHolder: "PEDRO PEREZ",
  destinationBank: "Coopcentral",
  destinationAccountType: "Ahorros",
  destinationAccountNumber: "123.-456789-01",
  amount: 200000,
  concept: "Clases mensuales",
};

// Mock result data
const mockNetworkTransferResult: NetworkTransferResult = {
  success: true,
  sourceAccount: "Cuenta de Ahorros",
  destinationBank: "Coopcentral",
  destinationAccountNumber: "123-456789-01",
  amountTransferred: 200000,
  concept: "Clases mensuales",
  transactionCost: 0,
  transactionDate: "5 de Enero de 2025",
  transactionTime: "03:02 p.m.",
  approvalNumber: "251606",
  description: "Transferencia Exitosa",
};
```

---

## Related Features

- **10 - Transferencias Index**: `/transferencias/internas` - Transfer type selection
- **10a - Entre Mis Cuentas**: `/transferencias/internas/entre-mis-cuentas` - Internal transfers between own accounts
- **10d - Inscribir Cuentas**: `/transferencias/inscribir-cuentas` - Register accounts for transfers
- **10e - A Otros Bancos**: `/transferencias/otros-bancos` - External bank transfers

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

- Destination accounts come from registered Coopcentral network accounts
- If no accounts registered, show message prompting user to register accounts
- Transaction cost is displayed (currently $0 in design)
- Print/Save functionality should generate PDF receipt
- "Realizar otra transacción" returns to step 1 with form reset
- "Finalizar" navigates to transfers landing or home
- Concept field is optional (unlike some other transfer flows)
- **Ignore Captcha placeholder** - not part of this implementation
