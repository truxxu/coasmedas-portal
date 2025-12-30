# Feature 09 - Pagos (Payments) - Technical Specification

**Feature**: Pagos (Payments) - Pagar mis productos
**Version**: 1.0
**Status**: Ready for Implementation
**Priority**: High
**Estimated Complexity**: Medium

---

## Table of Contents

1. [Overview](#overview)
2. [Technical Requirements](#technical-requirements)
3. [File Structure](#file-structure)
4. [Component Specifications](#component-specifications)
5. [Type Definitions](#type-definitions)
6. [Page Implementation](#page-implementation)
7. [Sidebar Updates](#sidebar-updates)
8. [Styling Specifications](#styling-specifications)
9. [State Management](#state-management)
10. [Navigation & Routing](#navigation--routing)
11. [Accessibility Requirements](#accessibility-requirements)
12. [Responsive Behavior](#responsive-behavior)
13. [Implementation Steps](#implementation-steps)
14. [Acceptance Criteria](#acceptance-criteria)
15. [Testing Checklist](#testing-checklist)
16. [Future Enhancements](#future-enhancements)

---

## Overview

The Pagos (Payments) feature provides a centralized interface for users to access payment functionality for their Coasmedas products and services. This specification covers the implementation of the **Pagar mis productos** page, which serves as the main entry point for product payments.

### Key Features

- Payment option selection interface with 4 clickable cards
- Sidebar navigation with expandable Pagos accordion
- Responsive design (desktop, tablet, mobile)
- Accessible keyboard navigation
- Visual feedback on interactions

### Scope

**In Scope**:
- Pagar mis productos page implementation
- PaymentOptionCard component (featured and standard variants)
- PaymentOptionsGrid organism
- Sidebar Pagos accordion menu
- Navigation structure (placeholders for payment flows)

**Out of Scope** (Future Implementation):
- Payment flow implementations (Pago Unificado, Aportes, Obligaciones, Protección)
- Pago a otros asociado page
- Pagar servicios públicos page
- Payment processing logic
- Backend API integration

---

## Technical Requirements

### Dependencies

**Existing Components**:
- `BackButton` (src/atoms)
- `Breadcrumbs` (src/molecules)
- `HideBalancesToggle` (src/molecules)
- `SidebarNavItem` (src/molecules)
- `SidebarSubItem` (src/molecules)
- `Sidebar` (src/organisms)
- `TopBar` (src/organisms)
- `SessionFooter` (src/organisms)

**New Components Required**:
- `PaymentOptionCard` (src/molecules) - NEW
- `PaymentOptionsGrid` (src/organisms) - NEW

**Frameworks & Libraries**:
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4

**No Additional Dependencies Needed**

---

## File Structure

```
app/
└── (authenticated)/
    └── pagos/
        ├── page.tsx                          # Placeholder/redirect
        └── pagar-mis-productos/
            └── page.tsx                      # Main page

src/
├── molecules/
│   ├── PaymentOptionCard.tsx                 # NEW - Payment option card
│   └── index.ts                              # UPDATE - Export PaymentOptionCard
│
├── organisms/
│   ├── PaymentOptionsGrid.tsx                # NEW - Grid container
│   ├── Sidebar.tsx                           # UPDATE - Add Pagos accordion
│   └── index.ts                              # UPDATE - Export PaymentOptionsGrid
│
└── types/
    └── index.ts                              # UPDATE - Add PaymentOption type
```

---

## Component Specifications

### 1. PaymentOptionCard (Molecule)

**File**: `src/molecules/PaymentOptionCard.tsx`

#### Purpose
Reusable card component for displaying payment options with two visual variants: featured (navy background) and standard (white background).

#### Props Interface

```typescript
interface PaymentOptionCardProps {
  title: string;
  description: string;
  variant?: 'featured' | 'standard';
  onClick: () => void;
  className?: string;
}
```

#### Component Structure

```tsx
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
        ${isFeatured
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

#### Styling Details

**Featured Variant**:
- Background: `#1D4E8F` (brand-navy)
- Title color: `#007FFF` or lighter blue
- Description color: `#FFFFFF` (white)
- Hover: Shadow increase + scale(1.02)
- Border: None

**Standard Variant**:
- Background: `#FFFFFF` (white)
- Border: `1px solid #E4E6EA`
- Title color: `#1D4E8F` (brand-navy)
- Description color: `#111827` (gray-900)
- Hover: Border color changes to brand-navy, background to blue-50
- Active: Border color blue-500, background blue-100

#### Accessibility
- `<button>` element for proper semantics
- `aria-label` with descriptive text
- Keyboard accessible (Tab, Enter, Space)
- Focus ring visible (2px blue outline with offset)
- Screen reader friendly

---

### 2. PaymentOptionsGrid (Organism)

**File**: `src/organisms/PaymentOptionsGrid.tsx`

#### Purpose
Container component that organizes payment option cards in a responsive grid layout.

#### Props Interface

```typescript
interface PaymentOptionsGridProps {
  onOptionClick: (option: string) => void;
  className?: string;
}
```

#### Component Structure

```tsx
import { PaymentOptionCard } from '@/src/molecules';

const paymentOptions = [
  {
    id: 'pago-unificado',
    title: 'Pago Unificado',
    description: 'Paga todos tus productos pendientes en una sola transacción y mantente al día fácilmente.',
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

#### Grid Layout
- **Mobile** (`<640px`): 1 column (stacked)
- **Tablet** (`640px - 1023px`): 2 columns
- **Desktop** (`≥1024px`): 2 columns
- **Gap**: `24px` / `1.5rem` (gap-6)

---

## Type Definitions

**File**: `src/types/index.ts`

Add the following type definitions:

```typescript
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

---

## Page Implementation

### Main Page: Pagar mis productos

**File**: `app/(authenticated)/pagos/pagar-mis-productos/page.tsx`

#### Implementation

```tsx
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

#### Key Points

1. **Client Component**: Uses `'use client'` directive for interactivity
2. **Routing**: Uses Next.js `useRouter` for navigation
3. **Layout**: Leverages authenticated layout (Sidebar + TopBar)
4. **Spacing**: Uses Tailwind `space-y-*` utilities for consistent spacing
5. **Typography**: Matches design specs exactly
6. **Placeholder Navigation**: TODO comments for future payment flow routes

---

### Placeholder Page: /pagos

**File**: `app/(authenticated)/pagos/page.tsx`

```tsx
import { redirect } from 'next/navigation';

export default function PagosPage() {
  redirect('/pagos/pagar-mis-productos');
}
```

This ensures `/pagos` redirects to the first available payment page.

---

## Sidebar Updates

### Update Sidebar Component

**File**: `src/organisms/Sidebar.tsx`

#### Add Pagos Navigation Item

Update the navigation items array to include the Pagos accordion:

```tsx
const navigationItems = [
  {
    id: 'inicio',
    label: 'Inicio',
    icon: HomeIcon, // Existing icon
    href: '/home',
  },
  {
    id: 'productos',
    label: 'Productos',
    icon: ProductsIcon, // Existing icon
    expandable: true,
    children: [
      // Existing product sub-items...
    ],
  },
  {
    id: 'pagos',
    label: 'Pagos',
    icon: PaymentIcon, // NEW - Need to add payment icon
    expandable: true,
    children: [
      {
        id: 'pagar-mis-productos',
        label: 'Pagar mis productos',
        href: '/pagos/pagar-mis-productos',
      },
      {
        id: 'pago-otros-asociado',
        label: 'Pago a otros asociado',
        href: '/pagos/pago-otros-asociado', // TODO: Implement later
      },
      {
        id: 'pagar-servicios-publicos',
        label: 'Pagar servicios públicos',
        href: '/pagos/pagar-servicios-publicos', // TODO: Implement later
      },
    ],
  },
  {
    id: 'transferencias',
    label: 'Transferencias',
    icon: TransferIcon, // Existing icon
    expandable: true,
    children: [
      // Existing transfer sub-items...
    ],
  },
  // ... other menu items
];
```

#### Payment Icon

Add a payment/wallet icon to the Sidebar. You can use an existing icon component or create a simple SVG:

```tsx
// Example payment icon (adjust as needed)
function PaymentIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.5 5H2.5C1.67 5 1 5.67 1 6.5V13.5C1 14.33 1.67 15 2.5 15H17.5C18.33 15 19 14.33 19 13.5V6.5C19 5.67 18.33 5 17.5 5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 8.5H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
```

---

## Styling Specifications

### Tailwind Classes Reference

#### Page Layout
```css
/* Main container */
.space-y-6         /* 24px vertical spacing between sections */

/* Header section */
.flex.items-start.justify-between  /* Flex layout with space between */
.space-y-4        /* 16px spacing between header elements */
.gap-4            /* 16px gap between back button and title */
```

#### Typography
```css
/* Page title */
.text-xl          /* 20px / 1.25rem */
.font-medium      /* Ubuntu Medium */
.text-gray-900    /* #111827 */

/* Section heading */
.text-[21px]      /* 21px custom size */
.font-bold        /* Ubuntu Bold */
.text-brand-navy  /* #1D4E8F */

/* Section description */
.text-[15px]      /* 15px custom size */
.text-gray-900    /* #111827 */

/* Card title */
.text-xl          /* 20px */
.font-medium      /* Ubuntu Medium */
.mb-3             /* 12px margin bottom */

/* Card description */
.text-[15px]      /* 15px custom size */
.leading-relaxed  /* line-height: 1.5 */
```

#### Cards
```css
/* Common card styles */
.w-full           /* 100% width */
.rounded-2xl      /* 16px border radius */
.p-6              /* 24px padding */
.shadow-md        /* Base shadow */

/* Featured card */
.bg-brand-navy    /* #1D4E8F */
.hover:shadow-lg  /* Larger shadow on hover */
.hover:scale-[1.02]  /* Subtle scale on hover */

/* Standard card */
.bg-white         /* #FFFFFF */
.border.border-gray-200  /* 1px solid #E4E6EA */
.hover:border-brand-navy /* Border changes on hover */
.hover:bg-blue-50 /* Background changes on hover */
```

#### Grid
```css
.grid             /* CSS Grid */
.grid-cols-1      /* 1 column on mobile */
.md:grid-cols-2   /* 2 columns on tablet/desktop */
.gap-6            /* 24px gap */
```

### Custom CSS Variables

Ensure these CSS variables are defined in `app/globals.css`:

```css
@layer base {
  :root {
    --brand-navy: #1D4E8F;
    --brand-primary: #007FFF;
    --light-blue: #F0F9FF;
    --border-gray: #E4E6EA;
  }
}
```

---

## State Management

### No Complex State Required

This feature uses minimal state:

1. **Navigation State**: Handled by Next.js router
2. **Sidebar Accordion State**: Handled by existing Sidebar component
3. **Hide Balances State**: Managed by UIContext (existing)

No additional state management needed for this feature.

---

## Navigation & Routing

### Route Structure

```
/pagos                                    → Redirects to /pagos/pagar-mis-productos
/pagos/pagar-mis-productos                → Main page (implemented)
/pagos/pago-otros-asociado                → TODO: Future implementation
/pagos/pagar-servicios-publicos           → TODO: Future implementation

Payment Flow Routes (TBD):
/pagos/pagar-mis-productos/pago-unificado     → TODO
/pagos/pagar-mis-productos/aportes            → TODO
/pagos/pagar-mis-productos/obligaciones       → TODO
/pagos/pagar-mis-productos/proteccion         → TODO
```

### Navigation Behavior

1. **From Sidebar**: Click "Pagar mis productos" → Navigate to page
2. **From Cards**: Click payment option card → Navigate to payment flow (TBD)
3. **From Breadcrumbs**: Click breadcrumb link → Navigate to respective page
4. **Back Button**: Navigate to previous page in history

---

## Accessibility Requirements

### Keyboard Navigation

1. **Tab Order**:
   - Back button
   - Breadcrumb links
   - Hide balances toggle
   - Payment option cards (order: Pago Unificado → Aportes → Obligaciones → Protección)

2. **Keyboard Shortcuts**:
   - `Tab`: Move to next interactive element
   - `Shift+Tab`: Move to previous interactive element
   - `Enter` or `Space`: Activate focused element

3. **Focus Indicators**:
   - Visible focus ring on all interactive elements
   - 2px blue outline with offset
   - No loss of focus during interactions

### ARIA Attributes

```tsx
// Payment option cards
<button
  aria-label="Pagar [option-name]"
  role="button"
>

// Breadcrumbs
<nav aria-label="Breadcrumb">
  <ol>
    <li>
      <a href="/home">Inicio</a>
    </li>
    <li aria-current="page">
      Pagar mis productos
    </li>
  </ol>
</nav>

// Sidebar accordion
<button
  aria-expanded={isExpanded}
  aria-controls="pagos-submenu"
>
  Pagos
</button>
<ul id="pagos-submenu">
  <li>
    <a href="/pagos/pagar-mis-productos" aria-current="page">
      Pagar mis productos
    </a>
  </li>
</ul>
```

### Screen Reader Support

- All interactive elements have descriptive labels
- Breadcrumb navigation properly structured
- Card descriptions announced on focus
- Sidebar accordion state announced (expanded/collapsed)

### Color Contrast

Ensure all text meets WCAG 2.1 AA standards:

- **Normal text** (15px): Minimum 4.5:1 contrast ratio
- **Large text** (20px+): Minimum 3:1 contrast ratio
- **Interactive elements**: Minimum 3:1 contrast ratio

---

## Responsive Behavior

### Breakpoints

```css
/* Mobile */
@media (max-width: 639px) {
  - Single column grid (grid-cols-1)
  - Full-width cards
  - Reduced padding (p-4 instead of p-6)
  - Mobile sidebar (drawer/overlay)
  - Stack header elements vertically
}

/* Tablet */
@media (min-width: 640px) and (max-width: 1023px) {
  - 2 column grid (md:grid-cols-2)
  - Collapsible sidebar
  - Standard card padding
}

/* Desktop */
@media (min-width: 1024px) {
  - 2 column grid
  - Full sidebar visible
  - Standard spacing
}
```

### Responsive Adjustments

1. **Header Section**:
   - Mobile: Stack back button, title, breadcrumbs, and toggle vertically
   - Desktop: Flex layout with space-between

2. **Payment Cards**:
   - Mobile: Full width, stacked vertically
   - Tablet/Desktop: 2 columns, side-by-side

3. **Typography**:
   - Mobile: May reduce font sizes slightly (optional)
   - Desktop: Standard sizes as specified

---

## Implementation Steps

### Step 1: Create Type Definitions
- [ ] Add `PaymentOptionId` type to `src/types/index.ts`
- [ ] Add `PaymentOption` interface to `src/types/index.ts`
- [ ] Export new types from `src/types/index.ts`

### Step 2: Create PaymentOptionCard Component
- [ ] Create `src/molecules/PaymentOptionCard.tsx`
- [ ] Implement component with featured/standard variants
- [ ] Add proper TypeScript interfaces
- [ ] Implement hover and active states
- [ ] Add accessibility attributes (aria-label, focus states)
- [ ] Export from `src/molecules/index.ts`

### Step 3: Create PaymentOptionsGrid Component
- [ ] Create `src/organisms/PaymentOptionsGrid.tsx`
- [ ] Define payment options data array
- [ ] Implement responsive grid layout
- [ ] Map payment options to PaymentOptionCard components
- [ ] Handle click events with callback
- [ ] Export from `src/organisms/index.ts`

### Step 4: Update Sidebar Component
- [ ] Add payment icon component (or use existing icon)
- [ ] Add Pagos navigation item to navigationItems array
- [ ] Configure expandable accordion with sub-items:
  - Pagar mis productos
  - Pago a otros asociado (placeholder)
  - Pagar servicios públicos (placeholder)
- [ ] Test accordion expand/collapse behavior

### Step 5: Create Page Structure
- [ ] Create `app/(authenticated)/pagos/page.tsx` (redirect)
- [ ] Create `app/(authenticated)/pagos/pagar-mis-productos/page.tsx`
- [ ] Implement page layout with header section
- [ ] Add breadcrumbs navigation
- [ ] Add hide balances toggle
- [ ] Integrate PaymentOptionsGrid component
- [ ] Implement handleOptionClick function (placeholder navigation)

### Step 6: Styling & Polish
- [ ] Verify all Tailwind classes match design specs
- [ ] Test hover states on all interactive elements
- [ ] Verify focus states are visible and accessible
- [ ] Check typography matches design (fonts, sizes, colors)
- [ ] Verify spacing matches design specs
- [ ] Test responsive layout on mobile, tablet, desktop

### Step 7: Accessibility Audit
- [ ] Test keyboard navigation (Tab, Enter, Space)
- [ ] Verify focus order is logical
- [ ] Add/verify all ARIA attributes
- [ ] Test with screen reader (optional but recommended)
- [ ] Verify color contrast meets WCAG AA standards
- [ ] Ensure all interactive elements have proper labels

### Step 8: Testing
- [ ] Test navigation from sidebar to page
- [ ] Test breadcrumb navigation
- [ ] Test back button functionality
- [ ] Test payment card click events
- [ ] Test hide balances toggle integration
- [ ] Test responsive behavior on different screen sizes
- [ ] Test sidebar accordion expand/collapse

---

## Acceptance Criteria

### Functional Requirements

- [x] **Page Rendering**
  - Page renders without errors
  - All components display correctly
  - Layout matches Figma design

- [x] **Navigation**
  - Sidebar "Pagos" menu item is expandable
  - "Pagar mis productos" sub-item navigates to correct page
  - "Pagar mis productos" is highlighted as active page
  - Back button navigates to previous page
  - Breadcrumbs display correct navigation path
  - Breadcrumb links are clickable and navigate correctly

- [x] **Payment Option Cards**
  - All 4 cards render correctly
  - Pago Unificado uses featured variant (navy background)
  - Aportes, Obligaciones, Protección use standard variant (white background)
  - Cards display correct titles and descriptions
  - Cards are clickable and trigger onClick handler
  - Hover states work as expected
  - Active states work as expected

- [x] **Responsive Design**
  - Mobile: Cards stack vertically (1 column)
  - Tablet: Cards display in 2 columns
  - Desktop: Cards display in 2 columns
  - Layout adapts smoothly between breakpoints

### Non-Functional Requirements

- [x] **Accessibility**
  - All interactive elements are keyboard accessible
  - Focus states are clearly visible
  - ARIA labels are present and descriptive
  - Tab order is logical
  - Screen reader can navigate and announce content

- [x] **Performance**
  - Page loads quickly (< 1 second)
  - No layout shifts (CLS = 0)
  - Smooth animations and transitions
  - No console errors or warnings

- [x] **Code Quality**
  - TypeScript types are properly defined
  - Components follow Atomic Design pattern
  - Code follows project coding standards
  - No ESLint errors or warnings
  - Proper component exports

---

## Testing Checklist

### Manual Testing

#### Desktop (≥1024px)
- [ ] Page loads correctly
- [ ] All 4 payment cards visible in 2x2 grid
- [ ] Sidebar "Pagos" menu is expandable
- [ ] "Pagar mis productos" is highlighted as active
- [ ] Back button works
- [ ] Breadcrumbs work
- [ ] Hide balances toggle works
- [ ] Card hover states work
- [ ] Card click events trigger correctly
- [ ] Focus states visible on Tab navigation
- [ ] Enter/Space keys activate focused elements

#### Tablet (640px - 1023px)
- [ ] Layout adapts correctly
- [ ] Cards maintain 2 column grid
- [ ] Spacing is appropriate
- [ ] Sidebar collapses/expands correctly
- [ ] All interactions work as on desktop

#### Mobile (<640px)
- [ ] Layout adapts correctly
- [ ] Cards stack vertically (1 column)
- [ ] Cards are full width
- [ ] Mobile sidebar works (drawer/overlay)
- [ ] Header elements stack appropriately
- [ ] Touch targets are large enough (min 44px)
- [ ] All interactions work on touch devices

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Accessibility Testing
- [ ] Keyboard navigation works (Tab, Shift+Tab, Enter, Space)
- [ ] Focus indicators are visible
- [ ] Screen reader announces content correctly (optional)
- [ ] Color contrast passes WCAG AA
- [ ] No keyboard traps

### Edge Cases
- [ ] Long card titles/descriptions don't break layout
- [ ] Rapid clicking doesn't cause issues
- [ ] Browser back button works correctly
- [ ] Direct URL access works (e.g., `/pagos/pagar-mis-productos`)
- [ ] 404 handling for invalid routes

---

## Future Enhancements

### Phase 2: Payment Flows
- Implement Pago Unificado flow
- Implement Aportes payment flow
- Implement Obligaciones payment flow
- Implement Protección payment flow

### Phase 3: Additional Pages
- Pago a otros asociado page
- Pagar servicios públicos page

### Phase 4: Enhanced Features
- Recent payments section
- Scheduled payments
- Payment history integration
- Quick access to frequently paid products
- Payment reminders/notifications
- Bulk payment options

### Technical Improvements
- Add loading states for async operations
- Implement error handling for failed navigations
- Add analytics tracking for card clicks
- Optimize images and assets
- Implement lazy loading for better performance

---

## Notes & Considerations

### Design Decisions

1. **Featured Card**: Pago Unificado is styled differently to highlight it as the recommended payment method
2. **Card Hierarchy**: All cards are equal size, but visual treatment creates hierarchy
3. **Navigation Placeholder**: Payment flow routes are placeholders (console.log) until flows are defined
4. **Sidebar Integration**: Pagos accordion follows same pattern as Productos accordion

### Technical Debt

- Payment flow routes are not yet defined (TBD)
- Payment processing logic not implemented (backend required)
- Future pages (pago a otros asociado, pagar servicios públicos) not implemented

### Dependencies on Future Work

- Backend API endpoints for payment processing
- Payment flow UI/UX designs
- Business logic for payment validation
- Integration with product accounts

---

## References

- **Visual References**: `.claude/knowledge/features/09-pagos/references.md`
- **Figma Design**: [Pagar mis productos](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=618-2)
- **Design System**: `.claude/design-system.md`
- **Coding Standards**: `.claude/coding-standards.md`
- **Workflows**: `.claude/workflows.md`

---

**Last Updated**: 2025-12-30
**Author**: Development Team
**Status**: Ready for Implementation
**Priority**: High
