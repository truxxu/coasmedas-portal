# Feature 09 - Pagos - Implementation Plan

**Feature**: Pagos (Payments) - Pagar mis productos
**Version**: 1.0
**Status**: Ready for Implementation
**Estimated Effort**: 4-6 hours
**Complexity**: Medium

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Implementation Phases](#implementation-phases)
4. [Detailed Steps](#detailed-steps)
5. [Verification Steps](#verification-steps)
6. [Troubleshooting](#troubleshooting)
7. [Success Criteria](#success-criteria)

---

## Overview

This implementation plan provides a step-by-step guide to implement the Pagos feature, specifically the "Pagar mis productos" page. The plan is organized into logical phases to ensure systematic and efficient development.

### What We're Building

- **PaymentOptionCard** molecule component (featured and standard variants)
- **PaymentOptionsGrid** organism component
- **Pagar mis productos** page with header and payment options
- **Sidebar integration** with Pagos accordion menu
- **Type definitions** for payment options

### Key Deliverables

1. ✅ Two new components (PaymentOptionCard, PaymentOptionsGrid)
2. ✅ One new page (Pagar mis productos)
3. ✅ Updated Sidebar with Pagos accordion
4. ✅ Type definitions for payment options
5. ✅ Responsive design (mobile, tablet, desktop)
6. ✅ Accessible keyboard navigation
7. ✅ Placeholder routes for future payment flows

---

## Prerequisites

### Before You Start

- [ ] Ensure development environment is set up
- [ ] Verify all existing components are working
- [ ] Review design references in `.claude/knowledge/features/09-pagos/references.md`
- [ ] Review technical specs in `.claude/knowledge/features/09-pagos/spec.md`
- [ ] Check that Sidebar component exists and is functional
- [ ] Verify payment icon exists at `/public/icons/payments.svg`

### Knowledge Requirements

- Next.js 16 App Router
- React 19 functional components
- TypeScript
- Tailwind CSS v4
- Atomic Design pattern

---

## Implementation Phases

### Phase 1: Type Definitions (15 minutes)
Set up TypeScript types for payment options.

### Phase 2: PaymentOptionCard Component (45 minutes)
Create the reusable payment card molecule with two variants.

### Phase 3: PaymentOptionsGrid Component (30 minutes)
Build the grid container organism that arranges payment cards.

### Phase 4: Sidebar Integration (30 minutes)
Update Sidebar component to include Pagos accordion menu.

### Phase 5: Page Implementation (45 minutes)
Create the main Pagar mis productos page and redirect page.

### Phase 6: Testing & Polish (60-90 minutes)
Test functionality, accessibility, and responsive behavior.

**Total Estimated Time**: 4-6 hours

---

## Detailed Steps

---

## Phase 1: Type Definitions

**Estimated Time**: 15 minutes
**Files to Modify**: `src/types/index.ts`

### Step 1.1: Add Payment Option Types

**File**: `src/types/index.ts`

**Action**: Add the following type definitions at the end of the file:

```typescript
// ============================================================================
// Payment Option Types (Feature 09 - Pagos)
// ============================================================================

/**
 * Payment option identifier
 */
export type PaymentOptionId =
  | 'pago-unificado'
  | 'aportes'
  | 'obligaciones'
  | 'proteccion';

/**
 * Payment option configuration
 */
export interface PaymentOption {
  id: PaymentOptionId;
  title: string;
  description: string;
  variant: 'featured' | 'standard';
  route?: string; // Optional: Route to payment flow (TBD)
}
```

### Step 1.2: Verify Export

**Action**: Ensure the types are exported from the file. Since we're adding to `index.ts`, they're automatically exported.

### Verification

- [ ] File compiles without TypeScript errors
- [ ] Types are available for import in other files

---

## Phase 2: PaymentOptionCard Component

**Estimated Time**: 45 minutes
**Files to Create**: `src/molecules/PaymentOptionCard.tsx`
**Files to Modify**: `src/molecules/index.ts`

### Step 2.1: Create Component File

**File**: `src/molecules/PaymentOptionCard.tsx`

**Action**: Create the file with the following content:

```typescript
'use client';

interface PaymentOptionCardProps {
  title: string;
  description: string;
  variant?: 'featured' | 'standard';
  onClick: () => void;
  className?: string;
}

export function PaymentOptionCard({
  title,
  description,
  variant = 'standard',
  onClick,
  className = '',
}: PaymentOptionCardProps) {
  const isFeatured = variant === 'featured';

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left rounded-2xl p-6
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${
          isFeatured
            ? 'bg-brand-navy shadow-md hover:shadow-lg hover:scale-[1.02] active:shadow-sm'
            : 'bg-white border border-gray-200 shadow-md hover:border-brand-navy hover:bg-blue-50 hover:shadow-lg active:border-blue-500 active:bg-blue-100'
        }
        ${className}
      `}
      aria-label={`Pagar ${title}`}
    >
      <h3
        className={`
          text-xl font-medium mb-3
          ${isFeatured ? 'text-blue-400' : 'text-brand-navy'}
        `}
      >
        {title}
      </h3>
      <p
        className={`
          text-[15px] leading-relaxed
          ${isFeatured ? 'text-white' : 'text-gray-900'}
        `}
      >
        {description}
      </p>
    </button>
  );
}
```

### Step 2.2: Export from Index

**File**: `src/molecules/index.ts`

**Action**: Add export at the end of the file:

```typescript
export { PaymentOptionCard } from './PaymentOptionCard';
```

### Step 2.3: Test Component

**Action**: Create a simple test render to verify the component works.

**Temporary test code** (can be added to a test page or removed after verification):

```typescript
// Test featured variant
<PaymentOptionCard
  title="Test Card"
  description="This is a test description"
  variant="featured"
  onClick={() => console.log('Clicked!')}
/>

// Test standard variant
<PaymentOptionCard
  title="Test Card"
  description="This is a test description"
  variant="standard"
  onClick={() => console.log('Clicked!')}
/>
```

### Verification

- [ ] Component renders without errors
- [ ] Featured variant shows navy background
- [ ] Standard variant shows white background with border
- [ ] Hover states work correctly
- [ ] Click handler is triggered
- [ ] Focus states are visible
- [ ] Component is exported and importable

---

## Phase 3: PaymentOptionsGrid Component

**Estimated Time**: 30 minutes
**Files to Create**: `src/organisms/PaymentOptionsGrid.tsx`
**Files to Modify**: `src/organisms/index.ts`

### Step 3.1: Create Component File

**File**: `src/organisms/PaymentOptionsGrid.tsx`

**Action**: Create the file with the following content:

```typescript
'use client';

import { PaymentOptionCard } from '@/src/molecules';

interface PaymentOptionsGridProps {
  onOptionClick: (optionId: string) => void;
  className?: string;
}

const paymentOptions = [
  {
    id: 'pago-unificado',
    title: 'Pago Unificado',
    description:
      'Paga todos tus productos pendientes en una sola transacción y mantente al día fácilmente.',
    variant: 'featured' as const,
  },
  {
    id: 'aportes',
    title: 'Aportes',
    description: 'Paga tus aportes sociales y solidaridad.',
    variant: 'standard' as const,
  },
  {
    id: 'obligaciones',
    title: 'Obligaciones',
    description: 'Paga tus créditos, tarjetas y otros compromisos.',
    variant: 'standard' as const,
  },
  {
    id: 'proteccion',
    title: 'Protección',
    description: 'Paga tus seguros y pólizas para estar siempre cubierto.',
    variant: 'standard' as const,
  },
];

export function PaymentOptionsGrid({ onOptionClick, className = '' }: PaymentOptionsGridProps) {
  return (
    <div
      className={`
        grid grid-cols-1 md:grid-cols-2 gap-6
        ${className}
      `}
    >
      {paymentOptions.map((option) => (
        <PaymentOptionCard
          key={option.id}
          title={option.title}
          description={option.description}
          variant={option.variant}
          onClick={() => onOptionClick(option.id)}
        />
      ))}
    </div>
  );
}
```

### Step 3.2: Export from Index

**File**: `src/organisms/index.ts`

**Action**: Add export at the end of the file:

```typescript
export { PaymentOptionsGrid } from './PaymentOptionsGrid';
```

### Verification

- [ ] Component renders without errors
- [ ] All 4 cards are displayed
- [ ] Grid layout is responsive (1 column mobile, 2 columns desktop)
- [ ] Click handlers work for all cards
- [ ] Component is exported and importable

---

## Phase 4: Sidebar Integration

**Estimated Time**: 30 minutes
**Files to Modify**: `src/organisms/Sidebar.tsx`

### Step 4.1: Add Pagos Sub-Items Array

**File**: `src/organisms/Sidebar.tsx`

**Action**: Add the `pagosSubItems` array after the `productSubItems` array (around line 27):

```typescript
const productSubItems = [
  { label: 'Aportes', href: '/productos/aportes' },
  { label: 'Ahorros', href: '/productos/ahorros' },
  { label: 'Obligaciones', href: '/productos/obligaciones' },
  { label: 'Inversiones', href: '/productos/inversiones' },
  { label: 'Protección', href: '/productos/proteccion' },
  { label: 'Coaspocket', href: '/productos/coaspocket' },
];

// ADD THIS:
const pagosSubItems = [
  { label: 'Pagar mis productos', href: '/pagos/pagar-mis-productos' },
  { label: 'Pago a otros asociado', href: '/pagos/pago-otros-asociado' },
  { label: 'Pagar servicios públicos', href: '/pagos/pagar-servicios-publicos' },
];
```

### Step 4.2: Update Navigation Rendering

**File**: `src/organisms/Sidebar.tsx`

**Action**: Update the navigation section (around line 62-84) to include pagos sub-items:

**Find this section**:
```typescript
{item.id === 'productos' && productSubItems.map((subItem) => (
  <SidebarSubItem
    key={subItem.href}
    label={subItem.label}
    href={subItem.href}
    isActive={pathname === subItem.href}
    onClick={handleNavClick}
  />
))}
```

**Replace with**:
```typescript
{item.id === 'productos' && productSubItems.map((subItem) => (
  <SidebarSubItem
    key={subItem.href}
    label={subItem.label}
    href={subItem.href}
    isActive={pathname === subItem.href}
    onClick={handleNavClick}
  />
))}
{item.id === 'pagos' && pagosSubItems.map((subItem) => (
  <SidebarSubItem
    key={subItem.href}
    label={subItem.label}
    href={subItem.href}
    isActive={pathname === subItem.href}
    onClick={handleNavClick}
  />
))}
```

### Step 4.3: Verify Payment Icon Exists

**Action**: Check that `/public/icons/payments.svg` exists. If it doesn't exist, create a simple payment icon.

**Optional**: If icon doesn't exist, you can temporarily use an existing icon or create a simple SVG:

```svg
<!-- public/icons/payments.svg -->
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M17.5 5H2.5C1.67 5 1 5.67 1 6.5V13.5C1 14.33 1.67 15 2.5 15H17.5C18.33 15 19 14.33 19 13.5V6.5C19 5.67 18.33 5 17.5 5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M1 8.5H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
```

### Verification

- [ ] Sidebar renders without errors
- [ ] "Pagos" menu item is visible
- [ ] Clicking "Pagos" expands/collapses accordion
- [ ] Three sub-items are displayed when expanded:
  - Pagar mis productos
  - Pago a otros asociado
  - Pagar servicios públicos
- [ ] Chevron icon rotates on expand/collapse
- [ ] Payment icon is visible

---

## Phase 5: Page Implementation

**Estimated Time**: 45 minutes
**Files to Create**:
- `app/(authenticated)/pagos/page.tsx`
- `app/(authenticated)/pagos/pagar-mis-productos/page.tsx`

### Step 5.1: Create Directory Structure

**Action**: Create the following directories if they don't exist:

```bash
app/(authenticated)/pagos/
app/(authenticated)/pagos/pagar-mis-productos/
```

### Step 5.2: Create Redirect Page

**File**: `app/(authenticated)/pagos/page.tsx`

**Action**: Create the file with the following content:

```typescript
import { redirect } from 'next/navigation';

export default function PagosPage() {
  redirect('/pagos/pagar-mis-productos');
}
```

### Step 5.3: Create Main Page

**File**: `app/(authenticated)/pagos/pagar-mis-productos/page.tsx`

**Action**: Create the file with the following content:

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { BackButton, Breadcrumbs, HideBalancesToggle } from '@/src/molecules';
import { PaymentOptionsGrid } from '@/src/organisms';

export default function PagarMisProductosPage() {
  const router = useRouter();

  const breadcrumbs = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Pagar mis productos', href: '/pagos/pagar-mis-productos' },
  ];

  const handleOptionClick = (optionId: string) => {
    // TODO: Navigate to payment flow when routes are defined
    console.log(`Payment option selected: ${optionId}`);
    // Example: router.push(`/pagos/pagar-mis-productos/${optionId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          {/* Back Button + Page Title */}
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className="text-xl font-medium text-gray-900">
              Pagar mis productos
            </h1>
          </div>

          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* Hide Balances Toggle */}
        <HideBalancesToggle />
      </div>

      {/* Main Content Section */}
      <div className="space-y-8">
        {/* Section Heading */}
        <div className="space-y-3">
          <h2 className="text-[21px] font-bold text-brand-navy">
            Pago mis productos
          </h2>
          <p className="text-[15px] text-gray-900">
            ¿Qué producto deseas pagar hoy?
          </p>
        </div>

        {/* Payment Options Grid */}
        <PaymentOptionsGrid onOptionClick={handleOptionClick} />
      </div>
    </div>
  );
}
```

### Verification

- [ ] `/pagos` redirects to `/pagos/pagar-mis-productos`
- [ ] Page renders without errors
- [ ] All components display correctly:
  - Back button
  - Page title
  - Breadcrumbs
  - Hide balances toggle
  - Section heading and description
  - Payment options grid with 4 cards
- [ ] Layout matches Figma design
- [ ] Console logs payment option ID when cards are clicked

---

## Phase 6: Testing & Polish

**Estimated Time**: 60-90 minutes

### Step 6.1: Visual Testing

**Desktop (≥1024px)**:
- [ ] Navigate to `/pagos/pagar-mis-productos`
- [ ] Verify page layout matches design
- [ ] Check all 4 payment cards are visible in 2x2 grid
- [ ] Verify "Pago Unificado" has navy background
- [ ] Verify other cards have white background with border
- [ ] Check typography (fonts, sizes, colors)
- [ ] Verify spacing matches design specs

**Tablet (640px - 1023px)**:
- [ ] Resize browser to tablet width
- [ ] Verify cards maintain 2 column grid
- [ ] Check spacing is appropriate
- [ ] Verify sidebar behavior

**Mobile (<640px)**:
- [ ] Resize browser to mobile width
- [ ] Verify cards stack vertically (1 column)
- [ ] Check cards are full width
- [ ] Verify mobile sidebar works
- [ ] Check header elements stack appropriately

### Step 6.2: Interaction Testing

**Navigation**:
- [ ] Click "Pagos" in sidebar → accordion expands
- [ ] Click "Pagar mis productos" → navigates to page
- [ ] Verify "Pagar mis productos" is highlighted in sidebar
- [ ] Click back button → navigates to previous page
- [ ] Click breadcrumb links → navigate correctly

**Payment Cards**:
- [ ] Hover over each card → verify hover state
- [ ] Click each card → verify console log with correct ID
- [ ] Verify click feedback (active state)

**Hide Balances Toggle**:
- [ ] Click toggle → verify it works (if connected to UIContext)

### Step 6.3: Keyboard Accessibility Testing

**Tab Navigation**:
- [ ] Press Tab repeatedly from top of page
- [ ] Verify tab order:
  1. Back button
  2. Breadcrumb links
  3. Hide balances toggle
  4. Payment cards (Pago Unificado → Aportes → Obligaciones → Protección)
- [ ] Verify focus states are visible (blue outline)
- [ ] No keyboard traps

**Keyboard Activation**:
- [ ] Tab to a payment card
- [ ] Press Enter → verify card click event
- [ ] Tab to another card
- [ ] Press Space → verify card click event

**Screen Reader** (Optional):
- [ ] Enable screen reader
- [ ] Navigate through page
- [ ] Verify all content is announced
- [ ] Verify aria-labels are read correctly

### Step 6.4: Browser Testing

Test in multiple browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest) - if on macOS
- [ ] Edge (latest)
- [ ] Mobile Safari - if available
- [ ] Chrome Mobile - if available

### Step 6.5: Code Quality Checks

**TypeScript**:
- [ ] Run: Check for TypeScript errors (should compile cleanly)
- [ ] Verify all types are properly defined
- [ ] No `any` types used

**ESLint**:
- [ ] Run: `npm run lint`
- [ ] Fix any linting errors
- [ ] Verify no warnings

**Code Review**:
- [ ] Verify components follow Atomic Design pattern
- [ ] Check code follows project coding standards
- [ ] Verify proper exports in index files
- [ ] Check for unused imports
- [ ] Verify consistent formatting

### Step 6.6: Performance Testing

- [ ] Page loads quickly (< 1 second)
- [ ] No console errors or warnings
- [ ] No layout shifts (CLS = 0)
- [ ] Smooth animations and transitions
- [ ] Responsive layout adapts smoothly

---

## Verification Steps

After completing all phases, verify the following:

### Functional Verification

✅ **Page Rendering**
- [ ] Page `/pagos/pagar-mis-productos` loads without errors
- [ ] All components render correctly
- [ ] Layout matches Figma design
- [ ] No console errors

✅ **Navigation**
- [ ] Sidebar "Pagos" menu expands/collapses
- [ ] Sub-items are visible when expanded
- [ ] "Pagar mis productos" is highlighted as active
- [ ] Back button navigates correctly
- [ ] Breadcrumbs navigation works
- [ ] `/pagos` redirects to `/pagos/pagar-mis-productos`

✅ **Payment Cards**
- [ ] All 4 cards render correctly
- [ ] "Pago Unificado" uses featured variant (navy)
- [ ] Other cards use standard variant (white)
- [ ] Correct titles and descriptions
- [ ] Cards are clickable
- [ ] onClick handler triggers with correct ID
- [ ] Hover states work
- [ ] Active states work

✅ **Responsive Design**
- [ ] Mobile: Single column layout
- [ ] Tablet: 2 column layout
- [ ] Desktop: 2 column layout
- [ ] Smooth transitions between breakpoints

### Technical Verification

✅ **Code Quality**
- [ ] TypeScript compiles without errors
- [ ] ESLint passes without errors
- [ ] Components follow Atomic Design pattern
- [ ] Proper component exports
- [ ] Clean code with no unused imports

✅ **Accessibility**
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] ARIA labels present
- [ ] Logical tab order
- [ ] No keyboard traps

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Payment icon not found

**Error**: `Error: Could not find icon at /icons/payments.svg`

**Solution**:
1. Check if icon exists at `/public/icons/payments.svg`
2. If not, create a simple SVG icon (see Phase 4, Step 4.3)
3. Or temporarily use another icon: `icon: '/icons/config.svg'`

#### Issue 2: TypeScript errors with PaymentOptionCard

**Error**: `Property 'variant' does not exist on type...`

**Solution**:
1. Ensure types are defined in `src/types/index.ts`
2. Verify component props interface is correct
3. Check that imports are correct

#### Issue 3: Sidebar accordion not expanding

**Error**: Pagos menu doesn't expand when clicked

**Solution**:
1. Verify `expandable: true` is set for pagos menu item
2. Check that `useSidebar` hook is working
3. Verify sidebar state management
4. Check that `toggleSidebarItem` function is called with correct ID

#### Issue 4: Cards not responsive

**Error**: Cards don't stack on mobile

**Solution**:
1. Check Tailwind classes: `grid-cols-1 md:grid-cols-2`
2. Verify Tailwind is configured correctly
3. Check browser width is actually < 640px
4. Clear browser cache and rebuild

#### Issue 5: Import errors

**Error**: `Cannot find module '@/src/molecules'`

**Solution**:
1. Verify path alias is configured in `tsconfig.json`
2. Check component is exported from index file
3. Restart TypeScript server
4. Rebuild project

#### Issue 6: Hover states not working

**Error**: Card hover styles don't apply

**Solution**:
1. Verify Tailwind classes are correct
2. Check for conflicting styles
3. Ensure `transition-all` class is present
4. Try rebuilding Tailwind cache

---

## Success Criteria

### Definition of Done

The feature is considered complete when:

✅ **All Components Created**
- [ ] PaymentOptionCard component created and working
- [ ] PaymentOptionsGrid component created and working
- [ ] Both components exported and importable

✅ **Page Implementation Complete**
- [ ] Pagar mis productos page created
- [ ] Redirect page created
- [ ] Page layout matches design
- [ ] All sections render correctly

✅ **Sidebar Integration Complete**
- [ ] Pagos menu item expands/collapses
- [ ] Sub-items display correctly
- [ ] Active state works correctly
- [ ] Navigation works

✅ **Responsive Design Working**
- [ ] Mobile layout (1 column)
- [ ] Tablet layout (2 columns)
- [ ] Desktop layout (2 columns)
- [ ] Smooth transitions

✅ **Accessibility Implemented**
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] ARIA labels present
- [ ] Screen reader compatible

✅ **Code Quality Verified**
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Follows coding standards
- [ ] Proper documentation

✅ **Testing Complete**
- [ ] Manual testing passed
- [ ] Browser testing passed
- [ ] Accessibility testing passed
- [ ] Performance acceptable

---

## Next Steps

After completing this implementation:

### Immediate Follow-up
1. Create placeholder pages for:
   - Pago a otros asociado
   - Pagar servicios públicos
2. Update TODO comments with actual routes when available

### Future Phases
1. **Phase 2**: Implement payment flow for Pago Unificado
2. **Phase 3**: Implement payment flows for Aportes, Obligaciones, Protección
3. **Phase 4**: Implement remaining Pagos pages

### Documentation Updates
1. Update main CLAUDE.md with new components
2. Document any lessons learned
3. Update design system if new patterns emerged

---

## Additional Resources

### Reference Documentation
- **Visual References**: `.claude/knowledge/features/09-pagos/references.md`
- **Technical Spec**: `.claude/knowledge/features/09-pagos/spec.md`
- **Figma Design**: [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=618-2)
- **Design System**: `.claude/design-system.md`
- **Coding Standards**: `.claude/coding-standards.md`

### Related Components
- BackButton: `src/atoms/BackButton.tsx`
- Breadcrumbs: `src/molecules/Breadcrumbs.tsx`
- HideBalancesToggle: `src/molecules/HideBalancesToggle.tsx`
- SidebarNavItem: `src/molecules/SidebarNavItem.tsx`
- SidebarSubItem: `src/molecules/SidebarSubItem.tsx`
- Sidebar: `src/organisms/Sidebar.tsx`

### Existing Patterns to Follow
- Product pages pattern (see Aportes, Ahorros, etc.)
- Sidebar accordion pattern (see Productos)
- Card component patterns (see existing product cards)

---

## Implementation Checklist

Use this as a quick reference during implementation:

### Phase 1: Types ⏱️ 15 min
- [ ] Add PaymentOptionId type
- [ ] Add PaymentOption interface
- [ ] Verify TypeScript compiles

### Phase 2: PaymentOptionCard ⏱️ 45 min
- [ ] Create component file
- [ ] Implement featured variant
- [ ] Implement standard variant
- [ ] Add accessibility attributes
- [ ] Export from index
- [ ] Test rendering

### Phase 3: PaymentOptionsGrid ⏱️ 30 min
- [ ] Create component file
- [ ] Define payment options data
- [ ] Implement grid layout
- [ ] Map cards
- [ ] Export from index
- [ ] Test rendering

### Phase 4: Sidebar Integration ⏱️ 30 min
- [ ] Add pagosSubItems array
- [ ] Update navigation rendering
- [ ] Verify payment icon
- [ ] Test accordion

### Phase 5: Page Implementation ⏱️ 45 min
- [ ] Create directory structure
- [ ] Create redirect page
- [ ] Create main page
- [ ] Implement layout
- [ ] Test navigation

### Phase 6: Testing & Polish ⏱️ 60-90 min
- [ ] Visual testing (desktop, tablet, mobile)
- [ ] Interaction testing
- [ ] Keyboard accessibility testing
- [ ] Browser testing
- [ ] Code quality checks
- [ ] Performance testing

---

**Last Updated**: 2025-12-30
**Status**: Ready for Implementation
**Priority**: High
**Next Review**: After implementation complete
