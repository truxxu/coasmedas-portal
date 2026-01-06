# Feature 09e-pagos: Implementation Plan

## Public Utilities Payment - Registration Flow (Inscribir Servicios Publicos)

**Feature**: Pagar Servicios Publicos - Inscripcion
**Version**: 1.0
**Status**: Ready for Implementation

---

## Overview

This implementation plan details the step-by-step process to build the Public Utilities Registration feature. The feature allows users to register their utility services (electricity, water, gas, etc.) before making payments.

### Flow Summary
1. **Flow Selection Page**: Choose between "Inscribir Servicios" or "Pagar Servicios"
2. **Registration Form**: Enter city, utility provider, bill number, and alias
3. **Confirmation Page**: Review and confirm registration data
4. **Result Page**: Display registration success/failure

---

## Prerequisites

Before starting implementation, verify these existing components are available:

### Existing Components to Reuse
- `BackButton` (atom) - Back navigation
- `Button` (atom) - Primary/secondary buttons
- `Card` (atom) - Container cards
- `Input` (atom) - Text inputs
- `Select` (atom) - Dropdown selects
- `Breadcrumbs` (molecule) - Navigation trail
- `FormField` (molecule) - Label + Input combination
- `SelectField` (molecule) - Label + Select combination
- `ConfirmationRow` (molecule) - Label-value display rows (already exists from 09d)

---

## Implementation Steps

### Phase 1: Foundation (Types & Mock Data)

#### Step 1.1: Create Type Definitions
**File**: `src/types/utility-registration.ts`

Create the following types:
- `CityOption` - City dropdown option
- `ConvenioOption` - Utility provider dropdown option
- `UtilityRegistrationForm` - Form data structure
- `UtilityConfirmationData` - Confirmation display data
- `RegistrationStatus` - Status type ('Aceptada' | 'Rechazada' | 'Pendiente')
- `UtilityRegistrationResult` - Registration result structure
- `UtilityFlowType` - Flow selection type ('inscribir' | 'pagar')

**Update**: `src/types/index.ts` - Add export for new types

---

#### Step 1.2: Create Mock Data
**File**: `src/mocks/mockUtilityRegistrationData.ts`

Create mock data for:
- `mockCities` - Array of 5 Colombian cities (Cali, Bogota, Medellin, Barranquilla, Cartagena)
- `mockConvenios` - Array of utility providers filtered by city (18 convenios across cities)
- `mockRegistrationResultSuccess` - Success response mock
- `mockRegistrationResultError` - Error response mock

**Update**: `src/mocks/index.ts` - Add export for new mock data

---

### Phase 2: Atoms (New Icons)

#### Step 2.1: Create SuccessIcon
**File**: `src/atoms/SuccessIcon.tsx`

Implementation:
- Green circle border (#009900)
- White checkmark icon inside
- Size variants: sm (40px), md (60px), lg (80px)
- Default size: md
- Proper aria-label for accessibility

---

#### Step 2.2: Create ErrorIcon
**File**: `src/atoms/ErrorIcon.tsx`

Implementation:
- Red circle border (#FF0D00)
- X icon inside
- Size variants: sm (40px), md (60px), lg (80px)
- Default size: md
- Proper aria-label for accessibility

---

#### Step 2.3: Update Atoms Index
**File**: `src/atoms/index.ts`

Add exports:
```typescript
export { SuccessIcon } from './SuccessIcon';
export { ErrorIcon } from './ErrorIcon';
```

---

### Phase 3: Molecules (New Components)

#### Step 3.1: Create FlowOptionCard
**File**: `src/molecules/FlowOptionCard.tsx`

Implementation:
- Clickable card for flow selection
- Props: title, description, onClick, optional icon
- Styling:
  - Dashed blue border (#1D4E8F)
  - White background
  - Height: 176px
  - Border radius: 8px
  - Hover: solid border, light blue background
  - Focus: ring outline for accessibility
- Centered content layout

---

#### Step 3.2: Update Molecules Index
**File**: `src/molecules/index.ts`

Add export:
```typescript
export { FlowOptionCard } from './FlowOptionCard';
```

Note: `ConfirmationRow` already exists - no need to create.

---

### Phase 4: Organisms (Feature Components)

#### Step 4.1: Create FlowSelectionCard
**File**: `src/organisms/FlowSelectionCard.tsx`

Implementation:
- Card container with header and options grid
- Header:
  - Title: "Pago de Servicios Publicos" (21px bold, navy)
  - Subtitle: "Que deseas hacer hoy?" (15px, black)
- Content: Grid of two `FlowOptionCard` components
  - "Inscribir Servicios" - Register utilities
  - "Pagar Servicios" - Pay utilities
- Responsive: 2 columns on desktop, 1 column on mobile
- Props: onSelectInscribir, onSelectPagar callbacks

---

#### Step 4.2: Create UtilityRegistrationForm
**File**: `src/organisms/UtilityRegistrationForm.tsx`

Implementation:
- Form card with 4 fields:
  1. **Ciudad** - Select dropdown (cities)
  2. **Convenio** - Select dropdown (filtered by city, disabled until city selected)
  3. **Numero de Factura** - Text input
  4. **Alias** - Text input (max 50 chars)
- Form validation with inline error messages
- Footer: "Volver" link + "Inscribir" button
- Props:
  - cities, convenios (options)
  - formData, errors (state)
  - onChange handlers for each field
  - onSubmit, onBack callbacks
  - isLoading state

---

#### Step 4.3: Create UtilityConfirmationCard
**File**: `src/organisms/UtilityConfirmationCard.tsx`

Implementation:
- Card with confirmation details display
- Header:
  - Title: "Confirmar Inscripcion"
  - Instruction text
- Content: List of `ConfirmationRow` components showing:
  - Ciudad
  - Convenio
  - Numero de Factura
  - Alias
- Footer: "Volver" link + "Confirmar Inscripcion" button
- Props: confirmationData, onConfirm, onBack, isLoading

---

#### Step 4.4: Create UtilityRegistrationResultCard
**File**: `src/organisms/UtilityRegistrationResultCard.tsx`

Implementation:
- Result display card
- Success state:
  - Green SuccessIcon
  - Title: "Inscripcion Aceptada"
  - Status in green
- Error state:
  - Red ErrorIcon
  - Title: "Inscripcion Rechazada"
  - Status in red
  - Error message box
- Content: `ConfirmationRow` components for all details
- Props: result (UtilityRegistrationResult)

---

#### Step 4.5: Update Organisms Index
**File**: `src/organisms/index.ts`

Add exports:
```typescript
export { FlowSelectionCard } from './FlowSelectionCard';
export { UtilityRegistrationForm } from './UtilityRegistrationForm';
export { UtilityConfirmationCard } from './UtilityConfirmationCard';
export { UtilityRegistrationResultCard } from './UtilityRegistrationResultCard';
```

---

### Phase 5: Pages (Route Implementation)

#### Step 5.1: Create Flow Selection Page
**File**: `app/(authenticated)/pagos/servicios-publicos/page.tsx`

Implementation:
- Use `useWelcomeBar(false)` hook
- Header: BackButton + "Pagar Servicios Publicos" title
- Breadcrumbs: Inicio / Pagos / Pagar servicios publicos
- Content: `FlowSelectionCard` component
- Navigation handlers:
  - "Inscribir" -> `/pagos/servicios-publicos/inscribir`
  - "Pagar" -> `/pagos/servicios-publicos/pagar` (future)
  - Back -> `/pagos`

---

#### Step 5.2: Create Registration Form Page
**File**: `app/(authenticated)/pagos/servicios-publicos/inscribir/page.tsx`

Implementation:
- State management:
  - formData state with initial empty values
  - errors state for validation
  - isLoading state
- Filter convenios based on selected city (useMemo)
- Reset convenio when city changes
- Form validation on submit
- Store formData in sessionStorage on successful validation
- Navigate to confirmation page
- Header: BackButton + title
- Breadcrumbs: Inicio / Pagos / Inscribir Servicios Publicos

---

#### Step 5.3: Create Confirmation Page
**File**: `app/(authenticated)/pagos/servicios-publicos/inscribir/confirmacion/page.tsx`

Implementation:
- Load formData from sessionStorage (useEffect)
- Redirect to form if no data
- Transform formData to confirmationData
- Mock API call on confirm (1.5s delay)
- Store result in sessionStorage
- Navigate to result page
- Header: BackButton + title
- Breadcrumbs

---

#### Step 5.4: Create Result Page
**File**: `app/(authenticated)/pagos/servicios-publicos/inscribir/resultado/page.tsx`

Implementation:
- Load result from sessionStorage (useEffect)
- Redirect to form if no data
- Display `UtilityRegistrationResultCard`
- Action buttons:
  - "Inscribir otro servicio" -> clear storage, go to form
  - "Ir a Pagos" -> clear storage, go to /pagos
- Cleanup sessionStorage on unmount
- Header: BackButton + title
- Breadcrumbs

---

### Phase 6: Validation Schema (Optional)

#### Step 6.1: Create Validation Schema
**File**: `src/schemas/utilityRegistrationSchemas.ts`

Implementation:
- Yup schema for form validation
- Fields:
  - cityId: required
  - cityName: required
  - convenioId: required
  - convenioName: required
  - billNumber: required, trimmed
  - alias: required, max 50 chars, trimmed
- Export inferred TypeScript type

Note: The pages already implement manual validation. This schema is optional for future refactoring to use react-hook-form with yupResolver.

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Create `src/types/utility-registration.ts`
- [ ] Update `src/types/index.ts`
- [ ] Create `src/mocks/mockUtilityRegistrationData.ts`
- [ ] Update `src/mocks/index.ts`

### Phase 2: Atoms
- [ ] Create `src/atoms/SuccessIcon.tsx`
- [ ] Create `src/atoms/ErrorIcon.tsx`
- [ ] Update `src/atoms/index.ts`

### Phase 3: Molecules
- [ ] Create `src/molecules/FlowOptionCard.tsx`
- [ ] Update `src/molecules/index.ts`

### Phase 4: Organisms
- [ ] Create `src/organisms/FlowSelectionCard.tsx`
- [ ] Create `src/organisms/UtilityRegistrationForm.tsx`
- [ ] Create `src/organisms/UtilityConfirmationCard.tsx`
- [ ] Create `src/organisms/UtilityRegistrationResultCard.tsx`
- [ ] Update `src/organisms/index.ts`

### Phase 5: Pages
- [ ] Create `app/(authenticated)/pagos/servicios-publicos/page.tsx`
- [ ] Create `app/(authenticated)/pagos/servicios-publicos/inscribir/page.tsx`
- [ ] Create `app/(authenticated)/pagos/servicios-publicos/inscribir/confirmacion/page.tsx`
- [ ] Create `app/(authenticated)/pagos/servicios-publicos/inscribir/resultado/page.tsx`

### Phase 6: Optional
- [ ] Create `src/schemas/utilityRegistrationSchemas.ts`

---

## File Creation Order

For optimal development flow, create files in this order:

1. `src/types/utility-registration.ts`
2. `src/types/index.ts` (update)
3. `src/mocks/mockUtilityRegistrationData.ts`
4. `src/mocks/index.ts` (update)
5. `src/atoms/SuccessIcon.tsx`
6. `src/atoms/ErrorIcon.tsx`
7. `src/atoms/index.ts` (update)
8. `src/molecules/FlowOptionCard.tsx`
9. `src/molecules/index.ts` (update)
10. `src/organisms/FlowSelectionCard.tsx`
11. `src/organisms/UtilityRegistrationForm.tsx`
12. `src/organisms/UtilityConfirmationCard.tsx`
13. `src/organisms/UtilityRegistrationResultCard.tsx`
14. `src/organisms/index.ts` (update)
15. `app/(authenticated)/pagos/servicios-publicos/page.tsx`
16. `app/(authenticated)/pagos/servicios-publicos/inscribir/page.tsx`
17. `app/(authenticated)/pagos/servicios-publicos/inscribir/confirmacion/page.tsx`
18. `app/(authenticated)/pagos/servicios-publicos/inscribir/resultado/page.tsx`

---

## Testing Strategy

### Manual Testing Flow

1. **Navigate to Flow Selection**
   - Go to `/pagos/servicios-publicos`
   - Verify two option cards display
   - Click "Inscribir Servicios"

2. **Test Registration Form**
   - Verify city dropdown populates
   - Select city, verify convenio dropdown enables
   - Change city, verify convenio resets
   - Submit empty form, verify validation errors
   - Fill valid data, submit

3. **Test Confirmation**
   - Verify all data displays correctly
   - Click back, verify form retains data
   - Click confirm, verify loading state

4. **Test Result**
   - Verify success icon and status
   - Test "Inscribir otro servicio" button
   - Test "Ir a Pagos" button
   - Verify sessionStorage is cleared

### Edge Cases to Test
- Direct navigation to confirmation without form data
- Direct navigation to result without result data
- Long alias (>50 characters)
- Empty convenios for a city
- Network error simulation

### Responsive Testing
- Desktop: 2-column option cards
- Mobile: Stacked option cards
- Form layout on all screen sizes

---

## Dependencies Summary

### New Files (18 total)
| File | Type | Location |
|------|------|----------|
| utility-registration.ts | Types | src/types/ |
| mockUtilityRegistrationData.ts | Mocks | src/mocks/ |
| SuccessIcon.tsx | Atom | src/atoms/ |
| ErrorIcon.tsx | Atom | src/atoms/ |
| FlowOptionCard.tsx | Molecule | src/molecules/ |
| FlowSelectionCard.tsx | Organism | src/organisms/ |
| UtilityRegistrationForm.tsx | Organism | src/organisms/ |
| UtilityConfirmationCard.tsx | Organism | src/organisms/ |
| UtilityRegistrationResultCard.tsx | Organism | src/organisms/ |
| page.tsx (selection) | Page | app/.../servicios-publicos/ |
| page.tsx (form) | Page | app/.../inscribir/ |
| page.tsx (confirmation) | Page | app/.../confirmacion/ |
| page.tsx (result) | Page | app/.../resultado/ |

### Index Updates (4 files)
- src/types/index.ts
- src/mocks/index.ts
- src/atoms/index.ts
- src/molecules/index.ts
- src/organisms/index.ts

### Existing Components Used
- BackButton, Button, Card (atoms)
- Breadcrumbs, ConfirmationRow (molecules)
- useWelcomeBar (hook)

---

## Notes

### SessionStorage Keys
- `utilityRegistrationData` - Form data between form and confirmation
- `utilityRegistrationResult` - Result data between confirmation and result

### Navigation Flow
```
/pagos/servicios-publicos (Selection)
    |
    +-> /pagos/servicios-publicos/inscribir (Form)
            |
            +-> /pagos/servicios-publicos/inscribir/confirmacion (Confirmation)
                    |
                    +-> /pagos/servicios-publicos/inscribir/resultado (Result)
                            |
                            +-> /pagos (Done)
```

### Future Features
- Payment flow (`/pagos/servicios-publicos/pagar`)
- List of registered services
- Edit/delete registered services

---

**Last Updated**: 2026-01-06
**Status**: Ready for Implementation
