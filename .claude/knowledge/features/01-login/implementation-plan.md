# Step-by-Step Implementation Plan: Login Feature

**Feature**: 01-login (Login Page)
**Total Estimated Time**: 3-4 days
**Created**: 2025-12-02
**Status**: Ready for Implementation

---

## Prerequisites

### Before You Start
- [x] Review Figma design
- [x] Read [spec.md](./spec.md) for full feature requirements
- [x] Read [references.md](./references.md) for design guidance
- [ ] Confirm development environment is running (`yarn dev`)
- [ ] Prehome feature (00-prehome) completed

### Current State
- ✅ Next.js 16 project initialized
- ✅ Tailwind CSS v4 configured
- ✅ TypeScript configured
- ✅ Atomic Design directories created
- ✅ Basic atoms exist (Button, Logo, Link)
- ⏳ Need to install form libraries
- ⏳ Need to create form-specific atoms
- ⏳ Need to create login components

---

## Phase 0: Dependencies Installation (0.5 hour)

### Step 0.1: Install Required Packages

**Packages to Install**:
```bash
yarn add react-hook-form yup @hookform/resolvers
```

**Purpose**:
- `react-hook-form` - Form state management
- `yup` - Schema validation
- `@hookform/resolvers` - Connect yup with react-hook-form

**Verify Installation**:
```bash
# Check package.json includes:
# "react-hook-form": "^7.x.x"
# "yup": "^1.x.x"
# "@hookform/resolvers": "^3.x.x"
```

---

## Phase 1: Validation Schema (0.5 hour)

### Step 1.1: Create Schemas Directory

**Directory**: `src/schemas/`

```bash
mkdir -p src/schemas
```

### Step 1.2: Create Login Validation Schema

**File**: `src/schemas/loginSchema.ts`

**Schema Definition**:
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

### Step 1.3: Create Document Type Options

**File**: `src/constants/documentTypes.ts`

```typescript
export const DOCUMENT_TYPES = [
  { value: 'CC', label: 'Cédula de ciudadanía' },
  { value: 'CE', label: 'Cédula de extranjería' },
  { value: 'TI', label: 'Tarjeta de identidad' },
  { value: 'PA', label: 'Pasaporte' },
] as const;

export type DocumentType = 'CC' | 'CE' | 'TI' | 'PA';
```

---

## Phase 2: Atoms - Form Elements (2-3 hours)

### Step 2.1: Create Input Component

**File**: `src/atoms/Input.tsx`

**Features**:
- Text, password, number types
- Error state styling
- Focus state styling
- 44px height (touch-friendly)
- Border radius 6px
- Integrates with react-hook-form

**Props**:
```typescript
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'password' | 'number';
  error?: string;
  className?: string;
}
```

**Styling**:
```css
/* Default */
h-11 px-3 rounded-[6px] border border-[#B1B1B1]
text-base font-normal

/* Focus */
border-2 border-brand-primary outline-none

/* Error */
border-2 border-red-600
```

### Step 2.2: Create Select Component

**File**: `src/atoms/Select.tsx`

**Features**:
- Dropdown with chevron icon
- Error state styling
- Focus state styling
- Matches input styling
- Keyboard accessible

**Props**:
```typescript
interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: readonly SelectOption[];
  error?: string;
  placeholder?: string;
  className?: string;
}
```

**Styling**:
- Same as Input component
- Chevron icon on right side
- Appearance: custom dropdown arrow

### Step 2.3: Create Label Component

**File**: `src/atoms/Label.tsx`

**Features**:
- Associates with input via htmlFor
- Shows asterisk for required fields
- Ubuntu Medium font
- Gray color (#58585B)

**Props**:
```typescript
interface LabelProps {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
  className?: string;
}
```

**Styling**:
```css
font-medium text-[14.5px] text-brand-gray-high mb-1.5
```

### Step 2.4: Create ErrorMessage Component

**File**: `src/atoms/ErrorMessage.tsx`

**Features**:
- Displays validation error
- Red text color
- Small font size
- aria-live for screen readers

**Props**:
```typescript
interface ErrorMessageProps {
  message?: string;
  className?: string;
}
```

**Styling**:
```css
text-red-600 text-xs mt-1
```

### Step 2.5: Update Button Component

**File**: `src/atoms/Button.tsx` (modify existing)

**Add Disabled Variant**:
```typescript
// Add to variants
disabled: 'bg-[#A6C4FF] text-brand-navy cursor-not-allowed'

// Update component to handle disabled state
disabled?: boolean;
```

**Styling for Disabled**:
```css
bg-[#A6C4FF] text-brand-navy cursor-not-allowed
```

### Step 2.6: Update Atoms Index

**File**: `src/atoms/index.ts`

```typescript
export { Button } from './Button';
export { Logo } from './Logo';
export { Link } from './Link';
export { Card } from './Card';
export { SectionTitle } from './SectionTitle';
export { Input } from './Input';
export { Select } from './Select';
export { Label } from './Label';
export { ErrorMessage } from './ErrorMessage';
```

---

## Phase 3: Molecules - Form Fields (2-3 hours)

### Step 3.1: Create FormField Component

**File**: `src/molecules/FormField.tsx`

**Features**:
- Wraps Label + Input + ErrorMessage
- Consistent spacing
- Forwards ref for react-hook-form
- Error state handling

**Props**:
```typescript
interface FormFieldProps extends InputProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
}
```

**Structure**:
```tsx
<div className="flex flex-col gap-1.5">
  <Label htmlFor={name} required={required}>
    {label}
  </Label>
  <Input id={name} error={error} {...props} ref={ref} />
  {error && <ErrorMessage message={error} />}
</div>
```

### Step 3.2: Create SelectField Component

**File**: `src/molecules/SelectField.tsx`

**Features**:
- Wraps Label + Select + ErrorMessage
- Consistent with FormField
- Forwards ref for react-hook-form

**Props**:
```typescript
interface SelectFieldProps extends SelectProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
}
```

**Structure**:
- Same as FormField but uses Select component

### Step 3.3: Create PasswordField Component

**File**: `src/molecules/PasswordField.tsx`

**Features**:
- FormField variant for password
- Optional visibility toggle icon
- Eye icon to show/hide password

**Props**:
```typescript
interface PasswordFieldProps extends Omit<FormFieldProps, 'type'> {
  showToggle?: boolean;
}
```

**State**:
```typescript
const [showPassword, setShowPassword] = useState(false);
```

**Toggle Icon** (optional for MVP):
- Eye icon from SVG or icon library
- Positioned absolute right side of input

### Step 3.4: Create CaptchaPlaceholder Component

**File**: `src/molecules/CaptchaPlaceholder.tsx`

**Features**:
- Gray box with placeholder text
- Rounded corners
- Future: Integrate reCAPTCHA

**Props**:
```typescript
interface CaptchaPlaceholderProps {
  className?: string;
}
```

**Styling**:
```css
bg-[#E4E6EA] rounded-[6px] px-6 py-8 text-center
text-brand-gray-high font-medium
```

**Text**: "Espacio para validación Captcha"

### Step 3.5: Update Molecules Index

**File**: `src/molecules/index.ts`

```typescript
export { NavBar } from './NavBar';
export { HeroBanner } from './HeroBanner';
export { WelcomeSection } from './WelcomeSection';
export { ServiceCard } from './ServiceCard';
export { NewsCard } from './NewsCard';
export { InfoCard } from './InfoCard';
export { AppPromoSection } from './AppPromoSection';
export { Footer } from './Footer';
export { FormField } from './FormField';
export { SelectField } from './SelectField';
export { PasswordField } from './PasswordField';
export { CaptchaPlaceholder } from './CaptchaPlaceholder';
```

---

## Phase 4: Organisms - Login Components (3-4 hours)

### Step 4.1: Create LoginForm Component

**File**: `src/organisms/LoginForm.tsx`

**Features**:
- Complete form with all fields
- react-hook-form integration
- yup validation
- Form state management
- Submit handling

**Structure**:
```typescript
'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema, LoginFormData } from '@/src/schemas/loginSchema';
import { FormField, SelectField, PasswordField, CaptchaPlaceholder } from '@/src/molecules';
import { Button, Link } from '@/src/atoms';
import { DOCUMENT_TYPES } from '@/src/constants/documentTypes';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log('Form submitted:', data);
    // Future: API integration
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    alert('Login exitoso (demo)');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Required fields note */}
      <p className="text-xs text-gray-600">* Campos obligatorios</p>

      {/* Document Type */}
      <SelectField
        label="Tipo de documento"
        name="documentType"
        options={DOCUMENT_TYPES}
        placeholder="Selecciona un tipo"
        required
        error={errors.documentType?.message}
        {...register('documentType')}
      />

      {/* Document Number */}
      <FormField
        label="Número de documento"
        name="documentNumber"
        type="text"
        placeholder=""
        required
        error={errors.documentNumber?.message}
        {...register('documentNumber')}
      />

      {/* Password */}
      <PasswordField
        label="Contraseña"
        name="password"
        required
        error={errors.password?.message}
        {...register('password')}
      />

      {/* Terms & Conditions */}
      <p className="text-xs text-black">
        Al ingresar, aceptas nuestros{' '}
        <Link href="/terms" className="text-brand-navy font-medium">
          Términos y Condiciones
        </Link>
      </p>

      {/* CAPTCHA Placeholder */}
      <CaptchaPlaceholder />

      {/* Submit Button */}
      <Button
        type="submit"
        variant={isValid ? 'primary' : 'disabled'}
        disabled={!isValid || isSubmitting}
        size="md"
        className="w-full"
      >
        {isSubmitting ? 'Ingresando...' : 'Ingresar'}
      </Button>

      {/* Forgot Password */}
      <Link href="/forgot-password" className="text-brand-navy text-center">
        ¿Olvidaste tu contraseña?
      </Link>
    </form>
  );
}
```

### Step 4.2: Create LoginCard Component

**File**: `src/organisms/LoginCard.tsx`

**Features**:
- White card container
- Rounded corners (24px)
- Shadow
- Padding (60px vertical, 40px horizontal)
- Contains: Logo, Header, LoginForm, Footer sections

**Structure**:
```tsx
import { Logo, Link } from '@/src/atoms';
import { LoginForm } from './LoginForm';

export function LoginCard() {
  return (
    <div className="bg-white rounded-3xl shadow-lg w-full max-w-[360px] px-10 py-14 flex flex-col gap-6">
      {/* Logo */}
      <div className="flex justify-center">
        <Logo width={200} height={67} />
      </div>

      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-brand-text-black mb-2">
          Iniciar sesión
        </h1>
        <p className="text-sm text-brand-gray-high">
          Por favor ingresa tus credenciales para continuar.
        </p>
      </div>

      {/* Login Form */}
      <LoginForm />

      {/* Divider */}
      <hr className="border-t border-[#B1B1B1]" />

      {/* App Promotion */}
      <div className="text-center">
        <p className="text-sm text-[#004266] font-medium mb-4">
          Lleva a Coas en tu bolsillo
        </p>
        <div className="flex gap-4 justify-center">
          <a href="#" className="inline-flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              {/* Apple logo SVG path */}
            </svg>
            <span className="text-xs">App Store</span>
          </a>
          <a href="#" className="inline-flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              {/* Google Play logo SVG path */}
            </svg>
            <span className="text-xs">Google Play</span>
          </a>
        </div>
      </div>

      {/* Help Section */}
      <div className="text-center">
        <p className="text-xs text-gray-600 mb-2">¿Necesitas ayuda?</p>
        <Link href="/help" className="text-sm text-brand-navy">
          Consulta nuestros canales de atención
        </Link>
      </div>
    </div>
  );
}
```

### Step 4.3: Update Organisms Index

**File**: `src/organisms/index.ts`

```typescript
// Prehome organisms
export { PrehomeHeader } from './PrehomeHeader';
export { PrehomeHero } from './PrehomeHero';
export { PrehomeWelcome } from './PrehomeWelcome';
export { PrehomeServices } from './PrehomeServices';
export { PrehomeNews } from './PrehomeNews';
export { PrehomeInfo } from './PrehomeInfo';
export { PrehomeApp } from './PrehomeApp';
export { PrehomeFooter } from './PrehomeFooter';

// Login organisms
export { LoginForm } from './LoginForm';
export { LoginCard } from './LoginCard';
```

---

## Phase 5: Page - Login Route (1 hour)

### Step 5.1: Create Login Page Directory

**Directory**: `app/login/`

```bash
mkdir -p app/login
```

### Step 5.2: Create Login Page

**File**: `app/login/page.tsx`

**Features**:
- Navy blue background
- Centered LoginCard
- Full viewport height
- Metadata for SEO
- Responsive layout

**Structure**:
```tsx
import { Metadata } from 'next';
import { LoginCard } from '@/src/organisms';

export const metadata: Metadata = {
  title: 'Iniciar Sesión - Coasmedas',
  description: 'Accede a tu cuenta de Coasmedas Portal para gestionar tus finanzas de forma segura.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-brand-navy flex items-center justify-center p-5">
      <LoginCard />
    </main>
  );
}
```

---

## Phase 6: Responsive Design (1-2 hours)

### Step 6.1: Mobile Adjustments (<768px)

**LoginCard.tsx**:
```tsx
// Update padding for mobile
className="... px-8 py-12 md:px-10 md:py-14"
```

**LoginForm.tsx**:
```tsx
// Ensure full-width inputs on mobile
// All inputs already full-width by default

// App store badges stack on mobile
<div className="flex flex-col sm:flex-row gap-4 justify-center">
```

### Step 6.2: Tablet Adjustments (768px-1024px)

- Card maintains max-width 360px
- Centered layout
- All spacing proportional

### Step 6.3: Desktop Adjustments (>1024px)

- Card centered in viewport
- Hover states enabled on links and buttons
- Background covers full viewport

### Step 6.4: Test Responsive Breakpoints

**Test at**:
- 375px (mobile)
- 768px (tablet)
- 1280px (desktop)
- 1920px (large desktop)

---

## Phase 7: Form Validation & Error States (1-2 hours)

### Step 7.1: Test Validation Rules

**Document Type**:
- [ ] Empty field shows error on submit
- [ ] Invalid option rejected

**Document Number**:
- [ ] Empty field shows "Número de documento es requerido"
- [ ] Letters show "Solo números permitidos"
- [ ] Less than 6 digits shows "Mínimo 6 dígitos"
- [ ] More than 15 digits shows "Máximo 15 dígitos"
- [ ] Valid number removes error

**Password**:
- [ ] Empty field shows "Contraseña es requerida"
- [ ] Less than 8 characters shows "Mínimo 8 caracteres"
- [ ] 8+ characters removes error

### Step 7.2: Test Form States

**Initial State**:
- [ ] Button disabled (light blue)
- [ ] No error messages
- [ ] All fields empty

**Validation State**:
- [ ] Errors appear on blur
- [ ] Field borders turn red on error
- [ ] Error messages appear below fields

**Valid State**:
- [ ] Button enabled (primary blue)
- [ ] No error messages
- [ ] Button clickable

**Submitting State**:
- [ ] Button shows "Ingresando..."
- [ ] Button disabled during submit
- [ ] Fields remain filled

### Step 7.3: Implement Error Styling

**Input Error State**:
```css
border-2 border-red-600
```

**Error Message**:
```css
text-red-600 text-xs mt-1
```

---

## Phase 8: Accessibility (1-2 hours)

### Step 8.1: Semantic HTML

- [ ] Form element wraps inputs
- [ ] Labels have htmlFor matching input IDs
- [ ] Button has type="submit"
- [ ] h1 for page title
- [ ] Proper heading hierarchy

### Step 8.2: Keyboard Navigation

**Test**:
- [ ] Tab through all fields in order
- [ ] Dropdown navigable with arrow keys
- [ ] Enter submits form
- [ ] Focus indicators visible
- [ ] Focus ring has 2px width

### Step 8.3: Screen Reader Testing

**Add ARIA Attributes**:
```tsx
// Error messages
<div aria-live="polite" aria-atomic="true">
  {error && <ErrorMessage message={error} />}
</div>

// Required fields
aria-required="true"

// Button state
aria-disabled={!isValid || isSubmitting}
```

**Test with**:
- NVDA (Windows)
- VoiceOver (macOS)
- TalkBack (Android)

### Step 8.4: Color Contrast Audit

**Check**:
- [ ] Labels (#58585B on white): Pass WCAG AA
- [ ] Links (#1D4E8F on white): Pass WCAG AA
- [ ] Button text (white on #007FFF): Pass WCAG AA
- [ ] Error text (red on white): Pass WCAG AA

---

## Phase 9: Polish & Testing (1-2 hours)

### Step 9.1: Visual QA

**Compare with Figma**:
- [ ] Logo size and position
- [ ] Heading typography (20px, bold)
- [ ] Input heights (44px)
- [ ] Border radius (6px inputs, 24px card)
- [ ] Colors match exactly
- [ ] Spacing matches design
- [ ] Button states correct

### Step 9.2: Interaction Testing

**Test All Interactions**:
- [ ] Dropdown opens/closes
- [ ] Dropdown selection works
- [ ] Input accepts typing
- [ ] Password masks characters
- [ ] Button click submits form
- [ ] Links navigate correctly
- [ ] Form validation triggers
- [ ] Error messages appear/disappear

### Step 9.3: Browser Testing

**Test in**:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Step 9.4: Mobile Device Testing

**Test on**:
- [ ] iOS Safari (iPhone)
- [ ] Android Chrome (Android phone)
- [ ] iPad Safari (tablet)

### Step 9.5: Performance

**Run Lighthouse Audit**:
- [ ] Performance > 90
- [ ] Accessibility > 95
- [ ] Best Practices > 90
- [ ] SEO > 90

### Step 9.6: Code Quality

**Checks**:
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] yarn build succeeds
- [ ] No console errors
- [ ] No console warnings

---

## Phase 10: Integration with Prehome (0.5 hour)

### Step 10.1: Update Prehome Links

**Verify Navigation**:
- [ ] Navbar "Iniciar Sesión" navigates to `/login`
- [ ] Hero "Ingresar" button navigates to `/login`
- [ ] Back navigation works

**Files to Check**:
- `src/molecules/NavBar.tsx`
- `src/molecules/HeroBanner.tsx`

**Ensure href="/login"** is set correctly (already done in prehome implementation)

---

## Time Tracking

| Phase | Task | Estimated Time | Notes |
|-------|------|----------------|-------|
| Phase 0 | Dependencies | 0.5 hr | Install packages |
| Phase 1 | Validation Schema | 0.5 hr | Yup schema + types |
| Phase 2 | Atoms | 2-3 hrs | Input, Select, Label, ErrorMessage |
| Phase 3 | Molecules | 2-3 hrs | FormField, SelectField, PasswordField |
| Phase 4 | Organisms | 3-4 hrs | LoginForm, LoginCard |
| Phase 5 | Page | 1 hr | Login route |
| Phase 6 | Responsive | 1-2 hrs | Mobile/tablet/desktop |
| Phase 7 | Validation | 1-2 hrs | Error states, testing |
| Phase 8 | Accessibility | 1-2 hrs | A11y audit |
| Phase 9 | Polish | 1-2 hrs | Visual QA, testing |
| Phase 10 | Integration | 0.5 hr | Link from prehome |
| **Total** | | **15-21 hrs (2-3 days)** | |

---

## Component Checklist

### Atoms
- [ ] Input (with error state)
- [ ] Select (with chevron icon)
- [ ] Label (with required asterisk)
- [ ] ErrorMessage (red text)
- [ ] Button (disabled variant)

### Molecules
- [ ] FormField (Label + Input + Error)
- [ ] SelectField (Label + Select + Error)
- [ ] PasswordField (FormField variant)
- [ ] CaptchaPlaceholder (gray box)

### Organisms
- [ ] LoginForm (form + validation)
- [ ] LoginCard (card container)

### Page
- [ ] app/login/page.tsx (navy background + card)

### Schema
- [ ] src/schemas/loginSchema.ts (yup validation)

### Constants
- [ ] src/constants/documentTypes.ts (dropdown options)

---

## Files to Create/Modify

### New Files (14 files)

**Schemas**:
- `src/schemas/loginSchema.ts`

**Constants**:
- `src/constants/documentTypes.ts`

**Atoms**:
- `src/atoms/Input.tsx`
- `src/atoms/Select.tsx`
- `src/atoms/Label.tsx`
- `src/atoms/ErrorMessage.tsx`

**Molecules**:
- `src/molecules/FormField.tsx`
- `src/molecules/SelectField.tsx`
- `src/molecules/PasswordField.tsx`
- `src/molecules/CaptchaPlaceholder.tsx`

**Organisms**:
- `src/organisms/LoginForm.tsx`
- `src/organisms/LoginCard.tsx`

**Page**:
- `app/login/page.tsx`

### Modified Files (3 files)

**Atoms**:
- `src/atoms/Button.tsx` (add disabled variant)
- `src/atoms/index.ts` (export new atoms)

**Molecules**:
- `src/molecules/index.ts` (export new molecules)

**Organisms**:
- `src/organisms/index.ts` (export new organisms)

---

## Testing Checklist

### Functional Testing
- [ ] Form fields accept input
- [ ] Dropdown shows all options
- [ ] Document number accepts only numbers
- [ ] Password masks characters
- [ ] Validation triggers on blur
- [ ] Error messages display correctly
- [ ] Button disabled when form invalid
- [ ] Button enabled when form valid
- [ ] Form submits successfully
- [ ] Links navigate correctly

### Visual Testing
- [ ] Matches Figma design
- [ ] Colors correct
- [ ] Typography correct
- [ ] Spacing correct
- [ ] Responsive on all breakpoints
- [ ] Touch targets minimum 44px

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Focus indicators visible
- [ ] Color contrast passes WCAG AA
- [ ] Form labels associated
- [ ] Error messages announced

### Performance Testing
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] No ESLint warnings

---

## Known Issues / Future Enhancements

### Current Scope (MVP)
- Form validation (front-end only)
- Static form submission (console.log)
- CAPTCHA placeholder (no integration)
- No API integration

### Future (Out of Scope)
- API integration for login
- CAPTCHA integration (Google reCAPTCHA)
- Password visibility toggle icon
- Password strength indicator
- Remember me checkbox
- Loading spinner animation
- Success animation
- OTP verification step
- Social login options

---

## References

- **Feature Spec**: [spec.md](./spec.md)
- **Design Reference**: [references.md](./references.md)
- **Figma Design**: [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=1409-787)
- **Coding Standards**: `.claude/coding-standards.md`
- **Workflows**: `.claude/workflows.md`

---

## Key Implementation Notes

### React Hook Form Pattern
```typescript
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(loginSchema),
  mode: 'onBlur', // Validate on blur
});
```

### Form Field Pattern
```tsx
<FormField
  label="Document Number"
  name="documentNumber"
  error={errors.documentNumber?.message}
  {...register('documentNumber')}
/>
```

### Button Disabled State
```tsx
<Button
  disabled={!isValid || isSubmitting}
  variant={isValid ? 'primary' : 'disabled'}
>
  {isSubmitting ? 'Loading...' : 'Submit'}
</Button>
```

### Validation on Blur
- Use `mode: 'onBlur'` in useForm
- Validation triggers when user leaves field
- Immediate feedback on errors

---

**Ready to implement**: All phases defined with clear steps and deliverables.
