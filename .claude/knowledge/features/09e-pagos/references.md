# Feature 09e-pagos: Pagar Servicios Públicos - Inscripción

## Overview

This feature implements the "Pagar Servicios Públicos" (Pay Public Utilities) flow, specifically the **registration sub-flow** that allows users to register their utility bills before making payments. The flow consists of 4 pages: flow selection, registration form, confirmation, and response.

## Figma References

| Page | Description | Node ID | URL |
|------|-------------|---------|-----|
| Flow Selection | Choose between register or pay utilities | 439-4 | [Figma](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=439-4) |
| Registration Form | Form to register a utility service | 668-202 | [Figma](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=668-202) |
| Confirmation | Review registration data before submitting | 668-305 | [Figma](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=668-305) |
| Response | Registration result/success | 668-404 | [Figma](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=668-404) |

---

## Page 1: Flow Selection

### Layout
- **Header**: Back button + Title "Pagar Servicios Públicos"
- **Breadcrumbs**: Inicio / Pagos / Pagar servicios públicos
- **Content Card**: White card with two selectable options

### Card Content
- **Title**: "Pago de Servicios Públicos" (blue #1D4E8F, 21px bold)
- **Subtitle**: "¿Qué deseas hacer hoy?" (black, 15px regular)

### Option Cards
Two side-by-side clickable cards with dashed borders:

#### Option 1: Inscribir Servicios (Left)
- **Title**: "Inscribir Servicios" (blue #1D4E8F, 20px medium)
- **Description**: "Inscribe tus facturas para pagarlas fácilemente." (black, 15px regular)
- **Border**: 1px dashed blue, rounded corners
- **Hover**: Cursor pointer, subtle highlight

#### Option 2: Pagar Servicios (Right)
- **Title**: "Pagar Servicios" (blue #1D4E8F, 20px medium)
- **Description**: "Realiza el pago de tus facturas inscritas." (black, 15px regular)
- **Border**: 1px dashed blue, rounded corners
- **Hover**: Cursor pointer, subtle highlight

### Card Styling
- Both cards have equal width
- Dashed blue border (#1D4E8F)
- White background
- Border radius ~8px
- Centered text
- Height ~176px

---

## Page 2: Registration Form

### Layout
- **Header**: Back button + Title "Pago de Servicios Públicos"
- **Breadcrumbs**: Inicio / Pagos / Inscribir Servicios Públicos
- **Content Card**: White card with registration form

### Section Header
- **Title**: "Inscripción de Servicios Públicos" (blue #1D4E8F, 18px bold)

### Form Fields

#### 1. Ciudad (City)
- **Label**: "Ciudad" (black, 15px regular)
- **Type**: Select/Dropdown
- **Placeholder**: User selects city
- **Example Value**: "Cali"
- **Border**: 1px solid #E4E6EA
- **Height**: ~40px

#### 2. Convenio (Agreement/Utility Provider)
- **Label**: "Convenio" (black, 15px regular)
- **Type**: Select/Dropdown
- **Placeholder**: User selects utility provider
- **Example Value**: "ENEL - Energía"
- **Border**: 1px solid #E4E6EA
- **Height**: ~40px

#### 3. Número de Factura o Referencia (Bill Number)
- **Label**: "Número de Factura o Referencia" (black, 15px regular)
- **Type**: Text Input
- **Placeholder**: Enter bill/reference number
- **Example Value**: "555"
- **Border**: 1px solid #E4E6EA
- **Height**: ~40px

#### 4. Alias
- **Label**: "Alias (ej. "Luz Apartamento")" (black, 15px regular)
- **Type**: Text Input
- **Placeholder**: User-friendly name for the service
- **Example Value**: "Luz casa"
- **Border**: 1px solid #E4E6EA
- **Height**: ~40px

### Form Layout
- Vertical stack of form fields
- Gap between fields: ~20px
- Form width: ~500px centered

### Footer Actions
- **Back Link**: "Volver" (blue #004266, 14px medium, left side)
- **Submit Button**: "Inscribir" (primary blue #007FFF button, right side)
  - Padding: 9px 28px
  - Border radius: 6px
  - Text: White, 14px bold

---

## Page 3: Confirmation

### Layout
- **Header**: Back button + Title "Pago de servicios públicos"
- **Breadcrumbs**: Inicio / Pagos / Inscribir Servicios Públicos
- **Content Card**: White card with confirmation details

### Section Header
- **Title**: "Confirmar Inscripción" (blue #1D4E8F, 18px bold)
- **Instruction**: "Verifica los datos del servicio que vas a inscribir." (black, 15px regular)

### Confirmation Details
Two-column layout (label left, value right):

| Label | Value | Value Style |
|-------|-------|-------------|
| Ciudad: | Cali | 15px medium, black |
| Convenio: | ENEL - Energía | 15px medium, black |
| Número de Factura: | 555 | 15px medium, black |
| Álias: | Luz casa | 15px medium, black |

### Details Layout
- Labels: Left-aligned, 15px regular, black
- Values: Right-aligned, 15px medium, black
- Row height: ~30px
- Gap between rows: ~10px

### Footer Actions
- **Back Link**: "Volver" (blue #004266, 14px medium, left side)
- **Confirm Button**: "Confirmar Inscripción" (primary blue #007FFF button, right side)
  - Padding: 9px 28px
  - Border radius: 6px
  - Text: White, 14px bold

---

## Page 4: Response (Success)

### Layout
- **Header**: Back button + Title "Pago de servicios públicos"
- **Breadcrumbs**: Inicio / Pagos / Inscribir Servicios Públicos
- **Content Card**: White card with result details

### Success State Content

#### 1. Success Icon
- **Icon**: Green checkmark in circle
- **Size**: ~60px diameter
- **Colors**:
  - Circle border: Green (#009900)
  - Checkmark: Green (#009900)
- **Position**: Centered

#### 2. Success Title
- **Text**: "Inscripción Aceptada" (blue #1D4E8F, 23px bold, centered)
- **Note**: Design shows "Incripción" (typo) - should be "Inscripción"

#### 3. Registration Details
Two-column layout with details:

| Label | Value | Value Style |
|-------|-------|-------------|
| Estado de Inscripción: | Aceptada | 15px medium, green #009900 |
| Álias: | Luz casa | 15px medium, black |
| Convenio: | ENEL - Energía | 15px medium, black |
| Ciudad: | Cali | 15px medium, black |
| Número de Factura: | 555 | 15px medium, black |

### Details Layout
- Labels: Left-aligned, 15px regular, black
- Values: Right-aligned, 15px medium
- "Aceptada" status is highlighted in green
- Row height: ~30px
- Gap between rows: ~10px

### No Footer Actions
- This is a final response page
- User can navigate via sidebar or back button

---

## Data Structures

### Form Data
```typescript
interface UtilityRegistrationForm {
  city: string;           // "Cali", "Bogotá", etc.
  convenio: string;       // "ENEL - Energía", "Vanti Gas", etc.
  billNumber: string;     // Invoice or reference number
  alias: string;          // User-friendly name
}
```

### City Options (Mock)
```typescript
interface CityOption {
  id: string;
  name: string;  // "Cali", "Bogotá", "Medellín", etc.
}

const mockCities: CityOption[] = [
  { id: '1', name: 'Cali' },
  { id: '2', name: 'Bogotá' },
  { id: '3', name: 'Medellín' },
  { id: '4', name: 'Barranquilla' },
];
```

### Convenio Options (Mock)
```typescript
interface ConvenioOption {
  id: string;
  name: string;       // Display name
  category: string;   // "Energía", "Gas", "Agua", "Telefonía"
  cityId: string;     // Available in which city
}

const mockConvenios: ConvenioOption[] = [
  { id: '1', name: 'ENEL - Energía', category: 'Energía', cityId: '1' },
  { id: '2', name: 'EMCALI - Agua', category: 'Agua', cityId: '1' },
  { id: '3', name: 'Gases de Occidente', category: 'Gas', cityId: '1' },
  { id: '4', name: 'Codensa - Energía', category: 'Energía', cityId: '2' },
  { id: '5', name: 'Vanti Gas', category: 'Gas', cityId: '2' },
];
```

### Registration Response
```typescript
interface RegistrationResult {
  success: boolean;
  status: 'Aceptada' | 'Rechazada' | 'Pendiente';
  registrationId?: string;
  alias: string;
  convenio: string;
  city: string;
  billNumber: string;
  errorMessage?: string;
}
```

---

## UI Components to Reuse

### Existing Components
- `BackButton` - Back navigation arrow
- `Breadcrumbs` - Navigation breadcrumbs
- `Button` - Primary button for "Inscribir" and "Confirmar Inscripción"
- `Card` - Container cards (white background)
- `Select` / `SelectField` - City and Convenio dropdowns
- `Input` / `FormField` - Bill number and Alias inputs
- `Link` - "Volver" back link

### Components to Create/Extend

#### 1. `FlowOptionCard` (Molecule)
Selectable card for flow choice:
```typescript
interface FlowOptionCardProps {
  title: string;
  description: string;
  onClick: () => void;
  icon?: React.ReactNode;
}
```

#### 2. `ConfirmationRow` (Molecule)
Label-value pair for confirmation display:
```typescript
interface ConfirmationRowProps {
  label: string;
  value: string;
  valueColor?: 'default' | 'success' | 'error';
}
```

#### 3. `SuccessIcon` (Atom)
Green checkmark success icon:
```typescript
interface SuccessIconProps {
  size?: 'sm' | 'md' | 'lg';  // default: 'md' (60px)
}
```

#### 4. `RegistrationResultCard` (Organism)
Complete result display with icon, title, and details:
```typescript
interface RegistrationResultCardProps {
  success: boolean;
  title: string;
  details: Array<{
    label: string;
    value: string;
    highlight?: boolean;
  }>;
}
```

---

## Routing Structure

```
app/(authenticated)/pagos/
├── servicios-publicos/
│   ├── page.tsx                    # Flow Selection (register vs pay)
│   ├── inscribir/
│   │   ├── page.tsx                # Registration Form
│   │   ├── confirmacion/page.tsx   # Confirmation
│   │   └── resultado/page.tsx      # Result
│   └── pagar/
│       └── page.tsx                # Payment flow (future feature)
```

Alternative (simpler) single-page approach:
```
app/(authenticated)/pagos/
├── servicios-publicos/
│   └── page.tsx                    # Multi-step wizard (all in one)
```

---

## State Management

### Registration Flow State
```typescript
interface UtilityRegistrationState {
  // Step tracking
  currentStep: 'selection' | 'form' | 'confirmation' | 'result';

  // Form data
  formData: UtilityRegistrationForm;

  // Options
  cities: CityOption[];
  convenios: ConvenioOption[];
  filteredConvenios: ConvenioOption[];  // Filtered by selected city

  // Validation
  errors: {
    city?: string;
    convenio?: string;
    billNumber?: string;
    alias?: string;
  };

  // Result
  result: RegistrationResult | null;

  // UI State
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
| Link Text | Dark Blue | #004266 |
| Success Text/Status | Green | #009900 |
| Card Background | White | #FFFFFF |
| Page Background | Light Blue | #F0F9FF |
| Input Border | Gray | #E4E6EA |
| Dashed Border (options) | Navy Blue | #1D4E8F |
| Body Text | Black | #000000 |

---

## Typography Reference

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Page Title | Ubuntu | 20px | Medium |
| Card Title | Ubuntu | 21px | Bold |
| Section Title | Ubuntu | 18px | Bold |
| Option Card Title | Ubuntu | 20px | Medium |
| Form Labels | Ubuntu | 15px | Regular |
| Body Text | Ubuntu | 15px | Regular |
| Confirmation Labels | Ubuntu | 15px | Regular |
| Confirmation Values | Ubuntu | 15px | Medium |
| Success Title | Ubuntu | 23px | Bold |
| Button Text | Ubuntu | 14px | Bold |
| Link Text | Ubuntu | 14px | Medium |

---

## Validation Rules

### Registration Form
- **City**: Required - must select a city
- **Convenio**: Required - must select a utility provider
- **Bill Number**: Required - cannot be empty
- **Alias**: Required - cannot be empty, max 50 characters

### Form Behavior
- Convenio dropdown should be filtered based on selected city
- If city changes, reset convenio selection
- Show inline error messages below invalid fields
- Disable "Inscribir" button until all fields are valid

---

## Error States

### Form Validation Errors
- Display error message below each invalid field
- Border color changes to red (#FF0D00)
- Error text in red, 14px

### Registration Failed
- Show error icon (red X) instead of success checkmark
- Title: "Inscripción Rechazada" or specific error message
- Show error details
- Provide option to try again

### Network/Server Errors
- Show generic error message
- Provide retry option
- Maintain form data for retry

---

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Flow Selection                              │
│  ┌─────────────────────┐    ┌─────────────────────┐            │
│  │  Inscribir          │    │  Pagar              │            │
│  │  Servicios          │    │  Servicios          │            │
│  └─────────────────────┘    └─────────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
            │                              │
            ▼                              ▼
┌───────────────────────┐      ┌───────────────────────┐
│  Registration Form    │      │  Payment Flow         │
│  (Ciudad, Convenio,   │      │  (Future Feature)     │
│   Factura, Alias)     │      │                       │
└───────────────────────┘      └───────────────────────┘
            │
            ▼
┌───────────────────────┐
│  Confirmation         │
│  (Review data)        │
└───────────────────────┘
            │
            ▼
┌───────────────────────┐
│  Result               │
│  (Success/Error)      │
└───────────────────────┘
```

---

## Accessibility Considerations

- All form inputs must have associated labels
- Form validation errors linked via aria-describedby
- Focus management when navigating between steps
- Success/error icons should have aria-label
- Keyboard navigation for flow selection cards
- Screen reader announcements for step changes and results
