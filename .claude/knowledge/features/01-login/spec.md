# Feature: Login Page

**Status**: Planning
**Priority**: Must Have
**Feature Number**: 01 (User Authentication)
**Last Updated**: 2025-12-02

---

## Overview

The **Login Page** is the primary authentication interface for the Coasmedas Portal. It provides a clean, user-friendly form for users to access their accounts using their credentials.

**Key Purpose**:
- Secure user authentication entry point
- Professional, trustworthy visual design
- Mobile-responsive form interface
- Clear user guidance and error handling

---

## UI Design

**Figma Design**: [Login Page](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=1409-787&t=m9MCv7YKAd0nQVyS-0)

See [references.md](./references.md) for complete design specifications and visual details.

### Visual Structure (Top to Bottom)

1. **Full-Screen Navy Background** - `#1D4E8F`
2. **Centered White Card** - Contains all form elements
3. **Logo** - Coasmedas logo with tagline
4. **Header Section**:
   - Title: "Iniciar sesión"
   - Subtitle: "Por favor ingresa tus credenciales para continuar."
   - Required fields note: "* Campos obligatorios"
5. **Form Fields**:
   - Tipo de documento (dropdown)
   - Número de documento (text input)
   - Contraseña (password input)
6. **Terms & Conditions** - Acceptance text with link
7. **CAPTCHA Placeholder** - Gray validation area
8. **Submit Button** - "Ingresar"
9. **Forgot Password Link** - "¿Olvidaste tu contraseña?"
10. **Divider Line**
11. **App Promotion** - "Lleva a Coas en tu bolsillo" + app store badges
12. **Help Section** - "¿Necesitas ayuda?" + contact link

---

## User Stories

### US-01.1: Access Login Page
**As a** user
**I want** to access the login page from the prehome
**So that** I can authenticate and access my account

**Acceptance Criteria**:
- [ ] Page accessible at `/login` route
- [ ] Clicking "Iniciar Sesión" from prehome navigates to login page
- [ ] Page loads with all form elements visible
- [ ] Design matches Figma specifications
- [ ] Page is responsive (mobile, tablet, desktop)
- [ ] All text in Spanish

### US-01.2: View Form Elements
**As a** user
**I want** to see a clear, organized login form
**So that** I understand what information is required

**Acceptance Criteria**:
- [ ] Logo and branding clearly visible at top
- [ ] Page title "Iniciar sesión" prominently displayed
- [ ] Instructions text visible
- [ ] All form labels clearly readable
- [ ] Required field indicators (* asterisk) shown
- [ ] Submit button clearly visible
- [ ] Forgot password link visible
- [ ] All elements properly aligned and spaced

### US-01.3: Select Document Type
**As a** user
**I want** to select my document type from a dropdown
**So that** I can specify my identification type

**Acceptance Criteria**:
- [ ] Dropdown shows "Cédula de ciudadanía" as default/placeholder
- [ ] Clicking dropdown reveals all options:
  - Cédula de ciudadanía (CC)
  - Cédula de extranjería (CE)
  - Tarjeta de identidad (TI)
  - Pasaporte (PA)
- [ ] Selected option displays in dropdown
- [ ] Dropdown styled per design (border, radius, height)
- [ ] Keyboard accessible (arrow keys to navigate)
- [ ] Label "Tipo de documento *" displayed above

### US-01.4: Enter Document Number
**As a** user
**I want** to enter my document number
**So that** I can identify myself

**Acceptance Criteria**:
- [ ] Text input field for numeric entry
- [ ] Label "Número de documento *" displayed above
- [ ] Input accepts numeric characters only
- [ ] Input styled per design (border, radius, height ~44px)
- [ ] Focus state visually indicated
- [ ] Placeholder or empty state clear

### US-01.5: Enter Password
**As a** user
**I want** to enter my password securely
**So that** I can authenticate

**Acceptance Criteria**:
- [ ] Password input field (masked characters)
- [ ] Label "Contraseña *" displayed above
- [ ] Input styled per design (border, radius, height ~44px)
- [ ] Characters hidden by default
- [ ] Focus state visually indicated
- [ ] (Optional) Password visibility toggle icon

### US-01.6: View Terms & Conditions
**As a** user
**I want** to see and access the terms and conditions
**So that** I understand what I'm agreeing to

**Acceptance Criteria**:
- [ ] Text: "Al ingresar, aceptas nuestros Términos y Condiciones"
- [ ] "Términos y Condiciones" is a clickable link
- [ ] Link styled in navy blue (#1D4E8F)
- [ ] Link navigates to terms page or opens modal
- [ ] Text properly formatted (mixed regular and medium weights)

### US-01.7: Complete CAPTCHA
**As a** user
**I want** to complete CAPTCHA validation
**So that** I can verify I'm human

**Acceptance Criteria**:
- [ ] CAPTCHA placeholder area displayed
- [ ] Gray background (#E4E6EA)
- [ ] Text: "Espacio para validación Captcha" (temporary)
- [ ] Rounded corners (6px radius)
- [ ] Appropriate height (~8% of card)
- [ ] (Future) Integrate actual CAPTCHA widget (Google reCAPTCHA)

### US-01.8: Submit Login Form
**As a** user
**I want** to submit my login credentials
**So that** I can access my account

**Acceptance Criteria**:
- [ ] "Ingresar" button displays below form
- [ ] Button full-width within card margins
- [ ] Button shows disabled state (light blue #A6C4FF) when form invalid
- [ ] Button shows active state (primary blue #007FFF) when form valid
- [ ] Button text: "Ingresar" in Ubuntu Bold, 14px
- [ ] Clicking valid button triggers form submission
- [ ] Loading state shown during submission

### US-01.9: Access Forgot Password
**As a** user
**I want** to access password recovery
**So that** I can reset my password if forgotten

**Acceptance Criteria**:
- [ ] Link: "¿Olvidaste tu contraseña?" displayed below submit button
- [ ] Link styled in navy blue (#1D4E8F)
- [ ] Link underlines on hover
- [ ] Clicking navigates to forgot password page
- [ ] Centered alignment

### US-01.10: View App Promotion
**As a** user
**I want** to see mobile app promotion
**So that** I can download the app if interested

**Acceptance Criteria**:
- [ ] Section separated by horizontal line
- [ ] Heading: "Lleva a Coas en tu bolsillo"
- [ ] Apple App Store badge displayed
- [ ] Google Play badge displayed
- [ ] Badges clickable (link to respective stores)
- [ ] Badges side by side with spacing
- [ ] Section styled per design

### US-01.11: Access Help/Support
**As a** user
**I want** to access help and support
**So that** I can get assistance if needed

**Acceptance Criteria**:
- [ ] Question: "¿Necesitas ayuda?" displayed
- [ ] Link: "Consulta nuestros canales de atención"
- [ ] Link styled in navy blue (#1D4E8F)
- [ ] Link navigates to help/contact page
- [ ] Centered alignment at bottom of card

---

## Technical Approach

### Route
- **Path**: `/login`
- **File**: `app/login/page.tsx`
- **Type**: Public route (no authentication required)

### Component Architecture (Atomic Design)

#### Atoms (Reusable)
- `Input` - Text input component
  - Variants: text, password, number
  - Props: label, type, error, placeholder, required
  - Styles: Border, radius, height from design

- `Select` - Dropdown/select component
  - Props: label, options, value, onChange, error, required
  - Styles: Matches input styling
  - Chevron icon included

- `Label` - Form label component
  - Props: text, htmlFor, required
  - Asterisk for required fields

- `Button` - Already exists, may need disabled variant
  - Variant: disabled with light blue background

- `Link` - Already exists
  - Use for tertiary actions

#### Molecules
- `FormField` - Label + Input + Error message wrapper
  - Consistent spacing
  - Error state handling

- `SelectField` - Label + Select + Error message wrapper
  - Consistent with FormField

- `PasswordField` - FormField variant with password toggle
  - Eye icon for show/hide (optional)

- `CaptchaPlaceholder` - CAPTCHA container
  - Gray box with placeholder text
  - Future: Integrate reCAPTCHA

#### Organisms
- `LoginForm` - Complete login form
  - Contains all form fields
  - Form validation logic
  - Submit handling

- `LoginCard` - Form card container
  - White background
  - Rounded corners
  - Shadow
  - Padding
  - Contains: Logo, LoginForm, Footer links

#### Page
- `app/login/page.tsx` - Login page
  - Navy background
  - Centered LoginCard
  - Full viewport height
  - Metadata/SEO

---

## Form Validation (Front-End Only)

### Validation Schema (Yup)

**Location**: `src/schemas/loginSchema.ts`

```typescript
import * as yup from 'yup';

export const loginSchema = yup.object({
  documentType: yup
    .string()
    .required('Selecciona un tipo de documento')
    .oneOf(['CC', 'CE', 'TI', 'PA'], 'Tipo de documento inválido'),

  documentNumber: yup
    .string()
    .required('Número de documento es requerido')
    .matches(/^[0-9]+$/, 'Solo números permitidos')
    .min(6, 'Mínimo 6 dígitos')
    .max(15, 'Máximo 15 dígitos'),

  password: yup
    .string()
    .required('Contraseña es requerida')
    .min(8, 'Mínimo 8 caracteres'),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
```

### Validation Rules

**Document Type**:
- Required field
- Must be one of: CC, CE, TI, PA
- Error: "Selecciona un tipo de documento"

**Document Number**:
- Required field
- Numeric only (no letters or special characters)
- Minimum 6 digits
- Maximum 15 digits
- Validation on blur
- Errors:
  - Empty: "Número de documento es requerido"
  - Invalid format: "Solo números permitidos"
  - Too short: "Mínimo 6 dígitos"
  - Too long: "Máximo 15 dígitos"

**Password**:
- Required field
- Minimum 8 characters
- No maximum (reasonable limit ~128)
- Validation on blur
- Errors:
  - Empty: "Contraseña es requerida"
  - Too short: "Mínimo 8 caracteres"

**CAPTCHA** (future):
- Required validation token
- Error: "Por favor completa la validación"

### Form States

**Initial State**:
- All fields empty
- Submit button disabled (light blue background)
- No error messages

**Typing State**:
- Fields accept input
- No validation yet
- Submit button remains disabled

**Blur/Validation State**:
- Field validates on blur
- Error message appears below field if invalid
- Field border turns red if error
- Submit button enables only when all fields valid

**Valid State**:
- All fields have valid values
- No error messages
- Submit button enabled (primary blue background)
- Submit button clickable

**Submitting State**:
- Submit button shows loading spinner
- Submit button disabled
- Fields disabled
- "Ingresando..." or loading indicator

**Error State** (submission error):
- Form remains enabled
- Error message displayed (e.g., above form or as toast)
- User can retry

---

## Styling Specifications

### Layout
```css
/* Background */
background: #1D4E8F;
min-height: 100vh;
display: flex;
justify-content: center;
align-items: center;

/* Card */
background: #FFFFFF;
max-width: 360px;
padding: 60px 40px;
border-radius: 24px;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
```

### Form Elements
```css
/* Input Fields */
height: 44px;
border: 1px solid #B1B1B1;
border-radius: 6px;
padding: 10px 12px;
font: Ubuntu Regular 16px;
color: #000000;

/* Focus State */
border: 2px solid #007FFF;
outline: none;

/* Error State */
border: 2px solid #DC2626;

/* Label */
font: Ubuntu Medium 14.5px;
color: #58585B;
margin-bottom: 6px;

/* Button (Active) */
background: #007FFF;
color: #FFFFFF;
font: Ubuntu Bold 14px;
border-radius: 6px;
height: 40px;
width: 100%;
padding: 9px 28px;

/* Button (Disabled) */
background: #A6C4FF;
color: #1D4E8F;
cursor: not-allowed;

/* Links */
font: Ubuntu Medium 14px;
color: #1D4E8F;
text-decoration: none;

/* Links (Hover) */
text-decoration: underline;
```

---

## Responsive Design

### Mobile (<768px)
- Card full-width with 20px margins on sides
- Padding reduced to 40px horizontal, 50px vertical
- All elements stack vertically
- Font sizes remain consistent (min 16px for inputs)
- App store badges stack vertically if needed
- Touch-friendly targets (min 44px)

### Tablet (768px-1024px)
- Card centered with max-width 360px
- Spacing proportional
- App store badges side by side

### Desktop (>1024px)
- Card centered in viewport
- Max-width 360px maintained
- Background covers full viewport
- Hover states enabled

---

## Accessibility Requirements

### Semantic HTML
- Form element wraps all inputs
- Label elements with `htmlFor` attributes
- Button type="submit"
- Heading hierarchy (h1 for "Iniciar sesión")

### Keyboard Navigation
- Tab order follows visual order
- All interactive elements focusable
- Enter key submits form
- Escape key clears focus (optional)
- Dropdown navigable with arrow keys

### Screen Readers
- All labels associated with inputs
- Required fields announced
- Error messages announced (aria-live)
- Button state announced (disabled/enabled)
- Focus management on validation errors

### Focus Indicators
- Visible focus ring on all interactive elements
- Minimum 2px focus indicator
- Sufficient color contrast
- Focus ring color: Primary blue or custom

### Color Contrast
- Text on white background: WCAG AA compliant
- Label text (#58585B on white): Pass
- Link text (#1D4E8F on white): Pass
- Button text (white on #007FFF): Pass
- Error messages (red on white): Pass

### Form Accessibility
- Required fields clearly marked
- Error messages descriptive and actionable
- Field hints/instructions provided
- Auto-focus on first error (optional)

---

## Error Handling

### Client-Side Validation Errors

**Display Pattern**:
- Error text appears below invalid field
- Red text color (#DC2626)
- Font: Ubuntu Regular, 12px
- Icon: Small error icon (optional)
- Field border turns red

**Error Messages**:
- "Selecciona un tipo de documento"
- "Número de documento es requerido"
- "Solo números permitidos"
- "Mínimo 6 dígitos"
- "Máximo 15 dígitos"
- "Contraseña es requerida"
- "Mínimo 8 caracteres"
- "Por favor completa la validación" (CAPTCHA)

### Form-Level Errors

**Generic Error** (future integration):
```
"No pudimos iniciar sesión. Por favor verifica tus credenciales e intenta nuevamente."
```

**Display**: Toast notification or alert box above form

---

## Navigation Flow

### Entry Points
1. From prehome "Iniciar Sesión" button → `/login`
2. From prehome navbar "Iniciar Sesión" → `/login`
3. Direct URL access → `/login`

### Exit Points
1. Successful login → Redirect to `/dashboard` (future)
2. "¿Olvidaste tu contraseña?" → `/forgot-password` (future)
3. "Términos y Condiciones" → `/terms` (future) or modal
4. "Consulta nuestros canales de atención" → `/help` or `/contact` (future)
5. App Store badge → External link
6. Google Play badge → External link

---

## Future Enhancements (Out of Scope)

- API integration for authentication
- OTP verification step
- Password strength indicator
- Remember me checkbox
- Social login options (Google, Facebook)
- Biometric login (mobile)
- Session timeout handling
- Multi-factor authentication
- Account lockout after failed attempts
- Password visibility toggle animation
- Animated loading states
- Success animation before redirect

---

## Acceptance Criteria Summary

### Visual Design
- [ ] Matches Figma design exactly
- [ ] Navy blue background (#1D4E8F)
- [ ] White card centered on page
- [ ] Logo displayed at top
- [ ] All spacing matches design specs
- [ ] Typography follows Ubuntu font system
- [ ] Colors match brand palette

### Functionality
- [ ] Form fields accept correct input types
- [ ] Dropdown shows all document types
- [ ] Document number accepts only numbers
- [ ] Password field masks characters
- [ ] Required field validation works
- [ ] Format validation works (numeric, length)
- [ ] Submit button disabled when form invalid
- [ ] Submit button enabled when form valid
- [ ] Error messages display correctly
- [ ] Links navigate correctly

### Responsive Design
- [ ] Works on mobile (375px)
- [ ] Works on tablet (768px)
- [ ] Works on desktop (1280px+)
- [ ] Touch targets minimum 44px
- [ ] Text remains readable at all sizes
- [ ] Card layout adapts appropriately

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] WCAG AA color contrast
- [ ] Focus indicators visible
- [ ] Form labels properly associated
- [ ] Error messages announced

### Code Quality
- [ ] Uses react-hook-form
- [ ] Uses yup validation schemas
- [ ] Follows Atomic Design pattern
- [ ] TypeScript types defined
- [ ] No ESLint errors
- [ ] Passes build process

---

## Related Features

- **Prehome** (00-prehome) - Contains navigation to login
- **Dashboard** (future) - Destination after login
- **Registration** (future) - Alternative auth flow
- **Forgot Password** (future) - Password recovery

---

## References

See [references.md](./references.md) for:
- Figma design link and analysis
- Complete color palette
- Typography specifications
- Component specifications
- Design assets

---

**Feature Owner**: Development Team
**Design Reference**: Figma (see references.md)
**Estimated Effort**: 3-4 days
**Dependencies**: Prehome (00-prehome) completed
