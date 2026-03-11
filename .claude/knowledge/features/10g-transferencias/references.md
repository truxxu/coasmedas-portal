# Feature 10g - Transferencias Externas: Cuentas de mi Red Coopcentral

## Overview

The "Cuentas de mi Red Coopcentral" external transfer flow allows users to send money from their Coasmedas accounts to accounts within the Coopcentral cooperative network. This is a 4-step flow under the **Externas** section: Details → Confirmation → SMS Verification → Result.

**Route**: `/transferencias/externas/red-coopcentral`

> **Note**: This feature is accessed from the Externas flow grid (`ExternasFlowGrid`), which already has a "Cuentas de mi Red Coopcentral" option (flow id: `red-copcentral` — typo to fix). The existing `internas/cuentas-mi-red` flow was a prior implementation; this 10g feature builds the flow under the `externas/` route group following the same patterns as `externas/otros-bancos`.

---

## Figma Design References

| Screen               | Node ID  | URL                                                                                        |
| -------------------- | -------- | ------------------------------------------------------------------------------------------ |
| Step 1: Details      | 842:11   | [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=842-11)  |
| Step 2: Confirmation | 842:594  | [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=842-594) |
| Step 3: SMS          | —        | Uses existing OTP verification page (CodeInputCard)                                        |
| Step 4: Result       | 842:1052 | [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=842-1052)|

---

## Flow Steps & Stepper Configuration

4-step stepper labels:

1. **Detalle** (Details)
2. **Confirmación** (Confirmation)
3. **SMS** (Verification)
4. **Finalización** (Result)

---

## Step 1: Details Page (`/red-coopcentral/page.tsx`)

### Header

- **Page Title**: "Cuentas de mi Red Coopcentral" (20px, medium weight)
- **Breadcrumbs**: `Inicio / Transferencias / Cuentas de mi Red Coopcentral`
- **Hide Balances Toggle**: Top right
- **Stepper**: Step 1 active (blue `#00B8ED`), steps 2-4 pending (gray `#E4E6EA`)
- **Step indicator text**: "Paso 1 de 4: Detalle" (12px, white on blue)

### Main Content Card

- **Card Title**: "Transferencias a Cuentas de mi Red Coopcentral" (18px, bold, navy `#005066`)
- **Description**: "Envía dinero a otras cooperativas de la Red Coopcentral" (15px, regular)

### Form Fields

| Field          | Type            | Label                                 | Placeholder/Default                                                         |
| -------------- | --------------- | ------------------------------------- | --------------------------------------------------------------------------- |
| Cuenta Origen  | Select/Dropdown | "¿De cuál cuenta quieres transferir?" | Shows account with balance (e.g., "Cuenta de Ahorros - Saldo: $ 8.730.500") |
| Cuenta Destino | Select/Dropdown | "Cuenta destino / Código de producto" | "Selecciona una cuenta inscrita..."                                         |
| Monto          | Currency Input  | "¿Qué valor deseas transferir?"       | "$ 0" (peso sign prefix left, value right-aligned)                          |
| Concepto       | Text Input      | "Concepto (Opcional)"                 | "Descripción de la transferencia"                                           |

#### Source Account Select
- Displays account type and current balance
- Format: "Cuenta de Ahorros - Saldo: $ X.XXX.XXX"
- Chevron down icon on right

#### Destination Account Select
- Dropdown with registered Coopcentral network accounts
- Placeholder: "Selecciona una cuenta inscrita..."
- Chevron down icon on right

#### Amount Input
- Currency input with "$" prefix (21px, bold, gray `#666`)
- Value right-aligned, "0" as default
- Bottom border line style

#### Concept Input
- Single line text input, optional
- Placeholder: "Descripción de la transferencia" (gray `#B1B1B1`)
- Max 100 characters

### Actions

- **Back Link**: "Volver" (14px, medium, navy `#004266`, bottom left)
- **Primary Button**: "Confirmar" (disabled: `#8FE6FF`, enabled: `#00B8ED`, bottom right)

---

## Step 2: Confirmation Page (`/red-coopcentral/confirmacion/page.tsx`)

### Header

- **Page Title**: "Red Coopcentral" (20px, medium weight)
- **Breadcrumbs**: `Inicio / Transferencias / Red Coopcentral`
- **Stepper**: Steps 1-2 active/completed (blue), steps 3-4 pending (gray)

### Main Content Card

- **Card Title**: "Confirmación de Pago" (18px, bold, navy `#005066`)
- **Description**: "Por favor, verifica que los datos de la transacción sean correctos antes de continuar." (15px)

### Transfer Details Summary

| Label               | Value Example      | Notes                    |
| ------------------- | ------------------ | ------------------------ |
| Nombre Titular:     | CAMILO ANDRÉS CRUZ | Sender name              |
| Documento Titular:  | CC 1.***.***. 231  | Masked document          |
| Producto a Debitar: | Cuenta de Ahorros  | Source account type       |
| — divider —         |                    | `1px solid #E4E6EA`      |
| Titular Destino:    | PEDRO PEREZ        | Recipient name           |
| Banco Destino:      | Coopcentral        | Always "Coopcentral"     |
| Tipo de Cuenta:     | Ahorros            | Destination account type |
| Cuenta Destino:     | 123.-456789-01     | Destination number       |
| Valor a Transferir: | $ 200.000          | Bold, 18px               |
| — divider —         |                    | `1px solid #E4E6EA`      |
| Concepto:           | Clases mensuales   | Optional                 |

### Row Styling
- Label: 14px, regular, gray `#232323`, left-aligned
- Value: 14px, regular, black, right-aligned
- Amount: 18px, medium weight
- Divider lines separate sections

### Actions

- **Back Link**: "Volver" (14px, navy `#004266`, bottom left)
- **Primary Button**: "Confirmar Pago" (blue `#00B8ED`, white text, bottom right)

---

## Step 3: SMS Verification Page (`/red-coopcentral/sms/page.tsx`)

Uses the existing OTP verification component pattern (`CodeInputCard`).

- **Stepper**: Steps 1-3 completed/active, step 4 pending
- **Content**: 6-digit code input, resend functionality, timer countdown
- **Reuse** the same pattern from `externas/otros-bancos/sms/page.tsx`

---

## Step 4: Result Page (`/red-coopcentral/resultado/page.tsx`)

### Header

- **Page Title**: "Red Coopcentral" (20px, medium weight)
- **Breadcrumbs**: `Inicio / Transferencias / Red Coopcentral`
- **Stepper**: All 4 steps completed (blue `#00B8ED`)

### Success State

#### Success Icon & Title
- **Icon**: Large green checkmark circle (~60px diameter, green `#00A44C` border, white checkmark)
- **Title**: "Transacción Exitosa" (22px, bold, navy `#005066`)
- Centered above details

### Transaction Details Summary

| Label                 | Value Example          | Notes                              |
| --------------------- | ---------------------- | ---------------------------------- |
| Cuenta Origen:        | Cuenta de Ahorros      | Source account type                |
| Banco Destino:        | Coopcentral            | Always "Coopcentral"              |
| Cuenta Destino:       | 123-456789-01          | Destination number                 |
| Valor Transferido:    | $200.000               | Bold, 18px                         |
| Concepto:             | Clases mensuales       | Optional                           |
| Costo Transacción:    | $ 0                    | Transaction fee                    |
| — divider —           |                        | `1px solid #E4E6EA`               |
| Fecha de Transacción: | 5 de Enero de 2025     | Spanish locale date                |
| Hora de Transacción:  | 03:02 p.m.             | Spanish locale time                |
| Número de Aprobación: | 251606                 | Random 6-digit approval            |
| Descripción:          | Transferencia Exitosa  | Green `#00A44C`, medium weight     |

### Action Buttons (3 horizontal)

- **"Imprimir/Guardar"**: Secondary (white bg, `#005066` border, navy text)
- **"Realizar otra transacción"**: Secondary (same styling)
- **"Finalizar"**: Primary (`#00B8ED` bg, white text)
- All: `6px` radius, `padding: 9px 28px`, `shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]`

---

## Route Structure

```
app/(authenticated)/transferencias/externas/
└── red-coopcentral/
    ├── page.tsx                    # Step 1: Details form
    ├── confirmacion/
    │   └── page.tsx                # Step 2: Confirmation
    ├── sms/
    │   └── page.tsx                # Step 3: SMS verification
    └── resultado/
        └── page.tsx                # Step 4: Result
```

---

## Components to Create

### New Organisms

| Component                              | Purpose                                         |
| -------------------------------------- | ----------------------------------------------- |
| `RedCoopTransferDetailsCard`           | Transfer details form (source, destination, amount, concept) |
| `RedCoopTransferConfirmationCard`      | Confirmation summary with holder/destination info |
| `RedCoopTransferResultCard`            | Result card with success/error states            |

### Existing Components to Reuse

| Component              | Usage                                    |
| ---------------------- | ---------------------------------------- |
| `Breadcrumbs`          | Navigation trail                         |
| `Stepper`              | 4-step progress indicator                |
| `Select` / `SelectField` | Source and destination dropdowns       |
| `CurrencyInput`        | Amount input with formatting             |
| `Input`                | Concept text field                       |
| `Button`               | Primary/secondary action buttons         |
| `ConfirmationRow`      | Label + value rows in confirmation       |
| `SuccessIcon`          | Green checkmark for result               |
| `ErrorIcon`            | Red X for error result                   |
| `CodeInputCard`        | SMS verification (Step 3)                |
| `Divider`              | Section separators                       |
| `Card`                 | Container card                           |

---

## Types

### RedCoopTransferFormData

```typescript
interface RedCoopTransferFormData {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: string;
  concept?: string;
}
```

### RedCoopTransferConfirmationData

```typescript
interface RedCoopTransferConfirmationData {
  // Sender info
  holderName: string;
  holderDocument: string; // masked: "CC 1.***.***. 231"
  sourceProduct: string;

  // Destination info
  destinationHolder: string;
  destinationBank: string; // "Coopcentral"
  destinationAccountType: string; // "Ahorros" | "Corriente"
  destinationAccountNumber: string;

  // Transfer
  amount: number;
  concept?: string;
}
```

### RedCoopTransferResult

```typescript
interface RedCoopTransferResult {
  success: boolean;

  // Transfer details
  sourceAccount: string;
  destinationBank: string;
  destinationAccountNumber: string;
  amountTransferred: number;
  concept?: string;
  transactionCost: number;

  // Metadata
  transactionDate: string;
  transactionTime: string;
  approvalNumber: string;
  description: string; // "Transferencia Exitosa" or error message

  // Error
  errorMessage?: string;
}
```

### Source/Destination Account Types

```typescript
interface RedCoopSourceAccount {
  id: string;
  name: string;
  accountType: string;
  balance: number;
}

interface RedCoopDestinationAccount {
  id: string;
  holderName: string;
  bankName: string; // "Coopcentral"
  accountType: "ahorros" | "corriente";
  accountNumber: string;
  alias?: string;
}
```

---

## State Management

### SessionStorage Keys (same pattern as otros-bancos)

| Key                            | Purpose                     |
| ------------------------------ | --------------------------- |
| `redCoopTransferSourceId`      | Selected source account ID  |
| `redCoopTransferDestinationId` | Selected destination ID     |
| `redCoopTransferAmount`        | Transfer amount             |
| `redCoopTransferConcept`       | Optional concept text       |

### Stepper Steps Constant

```typescript
const RED_COOP_TRANSFER_STEPS = [
  { number: 1, label: "Detalle" },
  { number: 2, label: "Confirmación" },
  { number: 3, label: "SMS" },
  { number: 4, label: "Finalización" },
];
```

---

## Validation Rules

| Field              | Rule                                    |
| ------------------ | --------------------------------------- |
| Source Account     | Required                                |
| Destination Account| Required                                |
| Amount             | Required, > 0, ≤ source balance         |
| Concept            | Optional, max 100 characters            |

---

## Reference Pattern: `externas/otros-bancos`

This flow follows the **same structure** as the existing `otros-bancos` external transfer flow:

| Aspect               | otros-bancos                               | red-coopcentral (this feature)                  |
| -------------------- | ------------------------------------------ | ----------------------------------------------- |
| Base route           | `/transferencias/externas/otros-bancos`    | `/transferencias/externas/red-coopcentral`      |
| Details page         | `page.tsx` with `ExternalTransferDetailsCard` | `page.tsx` with `RedCoopTransferDetailsCard`  |
| Confirmation page    | `confirmacion/page.tsx`                    | `confirmacion/page.tsx`                         |
| SMS page             | `sms/page.tsx`                             | `sms/page.tsx`                                  |
| Result page          | `resultado/page.tsx`                       | `resultado/page.tsx`                            |
| WelcomeBar title     | "A Otros Bancos"                           | "Cuentas de mi Red Coopcentral"                 |
| WelcomeBar backHref  | `/transferencias/externas`                 | `/transferencias/externas`                      |
| SessionStorage prefix| `externalTransfer*`                        | `redCoopTransfer*`                              |
| Steps constant       | `EXTERNAL_TRANSFER_STEPS`                  | `RED_COOP_TRANSFER_STEPS`                       |
| Destination bank     | Varies per destination                     | Always "Coopcentral"                            |

---

## Existing Code Fixes Needed

1. **ExternasFlowGrid.tsx**: Fix typo `red-copcentral` → `red-coopcentral` in flow id
2. **ExternasFlowGrid.tsx**: Fix incorrect href `/transferencias/externas/desde-cupos-rotativos` → `/transferencias/externas/red-coopcentral`
3. **externas/page.tsx**: Fix typo in handler `red-copcentral` → `red-coopcentral`

---

## Mock Data to Create

```typescript
// Source accounts (reuse same pattern as otros-bancos)
export const mockRedCoopSourceAccounts: RedCoopSourceAccount[] = [
  {
    id: "savings-1",
    name: "Cuenta de Ahorros",
    accountType: "Cuenta de Ahorros",
    balance: 8730500,
  },
];

// Registered Coopcentral destination accounts
export const mockRedCoopDestinationAccounts: RedCoopDestinationAccount[] = [
  {
    id: "coop-1",
    holderName: "PEDRO PEREZ",
    bankName: "Coopcentral",
    accountType: "ahorros",
    accountNumber: "123-456789-01",
  },
];

// User data for confirmation
export const mockRedCoopUserData = {
  holderName: "CAMILO ANDRÉS CRUZ",
  holderDocument: "CC 1.***.***. 231",
};

// Steps
export const RED_COOP_TRANSFER_STEPS = [
  { number: 1, label: "Detalle" },
  { number: 2, label: "Confirmación" },
  { number: 3, label: "SMS" },
  { number: 4, label: "Finalización" },
];

// Mock valid SMS code
export const RED_COOP_MOCK_VALID_CODE = "123456";
```

---

## User Flow

### Happy Path

1. User navigates to Transferencias → Externas → "Cuentas de mi Red Coopcentral"
2. **Details**: Selects source account, selects registered destination, enters amount, optionally enters concept
3. Clicks "Confirmar" → data stored in sessionStorage
4. **Confirmation**: Reviews transfer summary, clicks "Confirmar Pago"
5. **SMS**: Enters 6-digit verification code
6. **Result**: Sees "Transacción Exitosa" with details
7. Can "Imprimir/Guardar", "Realizar otra transacción", or "Finalizar"

### Error Cases

- Insufficient balance → validation error on amount
- No registered destination accounts → prompt to register
- SMS code invalid → error message, allow retry
- Transfer failed → error result card

---

## Related Features

- **10f - Cuentas de mi Red (internas)**: Prior implementation under `/internas/cuentas-mi-red` — existing components (`NetworkTransferForm`, `NetworkTransferConfirmationCard`, `NetworkTransferResultCard`) can be referenced but new components should be created for this `externas` flow
- **10e - A Otros Bancos**: `/externas/otros-bancos` — **primary pattern reference** for this implementation
- **10d - Inscribir Cuentas**: `/externas/inscribir-cuentas` — account registration

---

## Accessibility

- All form fields have associated labels
- Stepper has aria labels per step
- Success/error states use both icon + text (not color alone)
- Focus management between steps
- Keyboard navigation for all interactive elements

---

## Notes

- **Ignore Captcha placeholder** — not part of this implementation
- Destination bank is always "Coopcentral" (unlike otros-bancos which varies)
- Transaction cost displayed as $0 in design
- "Realizar otra transacción" returns to step 1 with form reset
- "Finalizar" navigates to home
- The flow lives under `externas/` not `internas/` — this is the correct placement per sidebar navigation and ExternasFlowGrid
