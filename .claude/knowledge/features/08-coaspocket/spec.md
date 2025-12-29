# Feature: Coaspocket (08-coaspocket)

**Status**: Planning
**Priority**: Must Have
**Feature Number**: 08
**Last Updated**: 2025-12-23

---

## Overview

The **Coaspocket** (Digital Pockets/Bolsillos) feature provides authenticated users access to their digital savings pockets through a horizontally scrollable carousel. Users can view multiple pockets, create new pockets via an action card, select a pocket to see its transaction history, and download monthly statements. This feature also introduces an informational box component for displaying important messages.

**Key Purpose**:
- View all digital pockets (bolsillos) in a scrollable carousel
- Create new pockets via a special action card
- Select a pocket to see its details and transaction history
- View important informational messages about the pocket feature
- Filter and view transaction history for selected pocket
- Download monthly PDF reports/statements

**Key Differences from Other Product Pages**:
- **Action card in carousel**: Special "Crear Nuevo Bolsillo" card for creating new pockets
- **InfoBox component**: New informational message box displayed between transaction history and download reports
- **Simpler card design**: Only shows title, pocket number, balance, and status (no additional detail fields)
- **Status values**: activo/inactivo (similar to Protección but simpler)

---

## User Stories

### US-08.1: View Pockets Carousel
**As an** authenticated user
**I want** to see all my digital pockets in a carousel
**So that** I can quickly overview all my savings pockets

**Acceptance Criteria**:
- [ ] Page displays at `/productos/coaspocket`
- [ ] Carousel shows all user's pocket products
- [ ] First pocket is selected by default (white background, blue border)
- [ ] Unselected pockets have gray background (#E4E6EA)
- [ ] Special "Crear Nuevo Bolsillo" action card appears at the end of the carousel
- [ ] Navigation arrows appear on left and right sides
- [ ] Dot indicators show current position
- [ ] Horizontal scroll with snap-to-card behavior
- [ ] Responsive: 1 card on mobile, 2 on tablet, 3 on desktop

### US-08.2: Select Pocket
**As an** authenticated user
**I want** to select a pocket from the carousel
**So that** I can view its transaction history and details

**Acceptance Criteria**:
- [ ] Clicking a pocket card selects it (shows white background, blue border)
- [ ] Only one pocket can be selected at a time
- [ ] Previously selected pocket reverts to gray background
- [ ] Transaction history section updates with selected pocket's data
- [ ] Section title updates to show selected pocket number
- [ ] Selection persists during page session
- [ ] Action card ("Crear Nuevo Bolsillo") cannot be selected

### US-08.3: View Pocket Card Information
**As an** authenticated user
**I want** to see key information on each pocket card
**So that** I can quickly understand my pocket status

**Acceptance Criteria**:
- [ ] Card shows pocket title (e.g., "Bolsillo Vacaciones")
- [ ] Card shows masked pocket number (e.g., "***4428")
- [ ] Card shows balance (respects "Ocultar saldos" toggle)
- [ ] Card shows status: "Activo" (green) or "Inactivo" (gray)
- [ ] Card has simple design without additional detail section

### US-08.4: Create New Pocket Action
**As an** authenticated user
**I want** to see an option to create a new pocket in the carousel
**So that** I can easily access the pocket creation flow

**Acceptance Criteria**:
- [ ] "Crear Nuevo Bolsillo" card appears at the end of the carousel
- [ ] Card has distinct visual style (dashed border, plus icon)
- [ ] Clicking the card triggers pocket creation action (modal or navigation)
- [ ] Card cannot be selected as active pocket

### US-08.5: View Informational Message
**As an** authenticated user
**I want** to see important information about my pockets
**So that** I can stay informed about pocket features and policies

**Acceptance Criteria**:
- [ ] InfoBox displays below transaction history section
- [ ] InfoBox has light blue background (#F0F9FF)
- [ ] InfoBox has blue left border accent (#007FFF)
- [ ] InfoBox displays informational icon
- [ ] InfoBox shows informational text content

### US-08.6: Transaction History for Selected Pocket
**As an** authenticated user
**I want** to filter and view transaction history for my selected pocket
**So that** I can track my pocket activity

**Acceptance Criteria**:
- [ ] Transaction history updates when different pocket is selected
- [ ] Title dynamically shows selected pocket name and number
- [ ] Date range filter with start and end date inputs
- [ ] Maximum range limited to 3 months
- [ ] "Aplicar" button triggers filter
- [ ] Shows transactions matching filter
- [ ] Shows empty state when no transactions found

### US-08.7: Download Monthly Reports
**As an** authenticated user
**I want** to download monthly statements for my pockets
**So that** I can keep records of my pocket activity

**Acceptance Criteria**:
- [ ] Month dropdown shows available months (last 12 months)
- [ ] Selecting month triggers PDF download
- [ ] Clear description of functionality

---

## Technical Approach

### Routes

| Path | Description |
|------|-------------|
| `/productos/coaspocket` | Coaspocket (Digital Pockets) product page |

### File Structure

```
app/(authenticated)/productos/
├── coaspocket/
│   └── page.tsx                   # Coaspocket page

src/
├── atoms/
│   ├── InfoBox.tsx                # NEW: Informational message box
│   └── index.ts                   # Update exports
├── molecules/
│   ├── CoaspocketProductCard.tsx  # NEW: Pocket card for carousel
│   ├── CreatePocketCard.tsx       # NEW: Action card for creating pockets
│   └── index.ts                   # Update exports
├── organisms/
│   ├── CoaspocketCarousel.tsx     # NEW: Carousel for pocket products
│   └── index.ts                   # Update exports
├── types/
│   └── coaspocket.ts              # NEW: Coaspocket-related types
└── mocks/
    └── coaspocket.ts              # NEW: Mock data for Coaspocket
```

### Dependencies on Previous Features

The following components will be **reused** from previous features:

| Component | Source | Purpose |
|-----------|--------|---------|
| `TransactionHistoryCard` | 03-products | Transaction list with date filter |
| `DownloadReportsCard` | 03-products | Monthly report download |
| `Breadcrumbs` | 03-products | Breadcrumb navigation |
| `CarouselArrow` | 04-ahorros | Carousel navigation arrows |
| `CarouselDots` | 04-ahorros | Carousel pagination dots |
| Carousel utilities | 04-ahorros | `calculateTotalPages`, `getVisibleItems` |

### Sidebar Navigation

Coaspocket is already included in the Products accordion menu (no update required):

```typescript
const productSubItems = [
  { label: 'Aportes', href: '/productos/aportes' },
  { label: 'Ahorros', href: '/productos/ahorros' },
  { label: 'Obligaciones', href: '/productos/obligaciones' },
  { label: 'Inversiones', href: '/productos/inversiones' },
  { label: 'Protección', href: '/productos/proteccion' },
  { label: 'Coaspocket', href: '/productos/coaspocket' },  // Already exists
];
```

---

## Component Specifications

### Atoms

#### InfoBox
Informational message box with left border accent.

```typescript
interface InfoBoxProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}
```

**Layout**:
```
┌──────────────────────────────────────────────────────────────┐
│ ℹ️ Lorem ipsum dolor sit amet, consectetur adipiscing elit.  │
│    Sed do eiusmod tempor incididunt ut labore et dolore.     │
└──────────────────────────────────────────────────────────────┘
```

**Styling**:
- Background: `#F0F9FF` (light blue)
- Left border: `4px solid #007FFF` (blue)
- Border radius: `8px` (rounded corners, except left edge)
- Padding: `16px`
- Icon size: `20px` or inline with text
- Text color: `#111827` (dark gray/black)
- Font: Ubuntu Regular, 14px

**Tailwind Classes**:
```css
bg-[#F0F9FF] border-l-4 border-[#007FFF] rounded-r-lg p-4
flex items-start gap-3
```

---

### Molecules

#### CoaspocketProductCard
Individual pocket card for the carousel.

```typescript
interface CoaspocketProductCardProps {
  product: CoaspocketProduct;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

interface CoaspocketProduct {
  id: string;
  title: string;                    // "Bolsillo Vacaciones"
  pocketNumber: string;             // "4428" (will be masked as ***4428)
  balance: number;                  // 1500000
  status: CoaspocketStatus;         // 'activo' | 'inactivo'
}

type CoaspocketStatus = 'activo' | 'inactivo';
```

**Layout**:
```
┌─────────────────────────────────────────────────┐
│ Bolsillo Vacaciones                             │
│ Número de bolsillo: ***4428                     │
│                                                 │
│ $ 1.500.000                                     │
│ Activo                                          │
└─────────────────────────────────────────────────┘
```

**Styling**:
- Width: `250px` minimum (same as SavingsProductCard)
- Height: Auto (~150px - simpler design)
- Border radius: `16px`
- Padding: `20px`
- Cursor: `pointer`
- Transition: `all 0.2s ease`

**Selected State**:
- Background: `#FFFFFF` (white)
- Border: `2px solid #194E8D` (navy blue)

**Unselected State**:
- Background: `#E4E6EA` (light gray)
- Border: `1px solid #E4E6EA` (gray)
- Hover: Border `#B1B1B1`

**Typography**:
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Title | Ubuntu | 16px | Medium | Black |
| Pocket Number | Ubuntu | 14px | Regular | Black |
| Balance | Ubuntu | 21px | Bold | Navy #194E8D |
| Status "Activo" | Ubuntu | 15px | Regular | Green #00A44C |
| Status "Inactivo" | Ubuntu | 15px | Regular | Gray #808284 |

**Hide Balances Integration**:
```typescript
const { hideBalances } = useUIContext();

// Mask balance value
{hideBalances ? maskCurrency() : formatCurrency(product.balance)}
```

**Tailwind Classes**:
```css
/* Base card */
bg-[#E4E6EA] rounded-2xl p-5 cursor-pointer min-w-[250px]
transition-all duration-200
border border-[#E4E6EA]
hover:border-[#B1B1B1]

/* Selected state */
bg-white border-2 border-[#194E8D]
```

---

#### CreatePocketCard
Action card for creating new pockets.

```typescript
interface CreatePocketCardProps {
  onClick: () => void;
  className?: string;
}
```

**Layout**:
```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│                                                 │
│                     ＋                          │
│            Crear Nuevo Bolsillo                 │
│                                                 │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

**Styling**:
- Width: `250px` minimum (same as pocket cards)
- Height: Same as CoaspocketProductCard for visual consistency
- Border: `2px dashed #B1B1B1` (gray dashed border)
- Border radius: `16px`
- Background: `#F9FAFB` or `#FFFFFF` (very light gray or white)
- Cursor: `pointer`
- Hover: Border color `#194E8D`, background slight change

**Typography**:
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Plus icon | - | 32px | - | Gray #636363 |
| Text | Ubuntu | 16px | Medium | Gray #636363 |

**Hover State**:
- Border: `2px dashed #194E8D` (navy blue)
- Plus icon: Color `#194E8D`
- Text: Color `#194E8D`

**Tailwind Classes**:
```css
/* Base card */
min-w-[250px] rounded-2xl p-5 cursor-pointer
border-2 border-dashed border-[#B1B1B1]
bg-[#F9FAFB]
flex flex-col items-center justify-center
text-[#636363]
hover:border-[#194E8D] hover:text-[#194E8D]
transition-all duration-200
```

---

### Organisms

#### CoaspocketCarousel
Carousel component for pocket cards including the action card.

```typescript
interface CoaspocketCarouselProps {
  title: string;                                    // "Resumen de Bolsillos Digitales"
  products: CoaspocketProduct[];                    // Array of pocket products
  selectedProductId?: string;                       // ID of selected pocket
  onProductSelect: (product: CoaspocketProduct) => void;
  onCreatePocket: () => void;                       // Handler for create action
  className?: string;
}
```

**Implementation Notes**:
- Reuses `CarouselArrow` and `CarouselDots` atoms from 04-ahorros
- Reuses carousel utilities (`calculateTotalPages`, `getVisibleItems`)
- Renders `CoaspocketProductCard` for each pocket
- Renders `CreatePocketCard` at the end of the carousel
- Action card is NOT selectable (does not trigger onProductSelect)
- Same scroll behavior, responsive breakpoints, and accessibility features as other carousels

**Layout**:
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Resumen de Bolsillos Digitales                                              │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │                                                                         │ │
│ │  (←)  [Card 1]  [Card 2]  [Create Card]  (→)                           │ │
│ │       (selected) (unselected) (action)                                  │ │
│ │                                                                         │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│                              • • •                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Styling**:
- Container: `bg-white rounded-2xl p-6`
- Title: `text-[20px] font-bold text-[#194E8D] mb-4`
- Cards container: `flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide`
- Gap between cards: `20px` (gap-5)

**Responsive Behavior**:
| Breakpoint | Visible Cards | Card Width |
|------------|---------------|------------|
| Mobile (<640px) | 1 | 100% - padding |
| Tablet (640-1023px) | 2 | ~48% |
| Desktop (>=1024px) | 3 | ~32% |

---

## TypeScript Types

### File: `src/types/coaspocket.ts`

```typescript
/**
 * Status of a digital pocket (bolsillo)
 */
export type CoaspocketStatus = 'activo' | 'inactivo';

/**
 * Digital pocket product information for carousel display
 */
export interface CoaspocketProduct {
  id: string;
  title: string;
  pocketNumber: string;            // e.g., "4428" (will be masked as ***4428)
  balance: number;
  status: CoaspocketStatus;
}

/**
 * Callback type for pocket product selection
 */
export type OnCoaspocketSelect = (product: CoaspocketProduct) => void;

/**
 * Callback type for create pocket action
 */
export type OnCreatePocket = () => void;
```

### Update: `src/types/index.ts`

```typescript
// Add export
export * from './coaspocket';
```

---

## Mock Data

### File: `src/mocks/coaspocket.ts`

```typescript
import { CoaspocketProduct } from '@/src/types/coaspocket';
import { Transaction, MonthOption } from '@/src/types/products';
import { generateMonthOptions } from '@/src/utils/dates';

/**
 * Mock pocket products for carousel
 */
export const mockCoaspocketProducts: CoaspocketProduct[] = [
  {
    id: '1',
    title: 'Bolsillo Vacaciones',
    pocketNumber: '4428',
    balance: 1500000,
    status: 'activo',
  },
  {
    id: '2',
    title: 'Bolsillo Emergencias',
    pocketNumber: '5539',
    balance: 3200000,
    status: 'activo',
  },
  {
    id: '3',
    title: 'Bolsillo Navidad',
    pocketNumber: '6640',
    balance: 800000,
    status: 'inactivo',
  },
];

/**
 * Mock transactions for pocket accounts
 */
export const mockCoaspocketTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-11-15',
    description: 'Transferencia a bolsillo',
    amount: 200000,
    type: 'credit',
  },
  {
    id: '2',
    date: '2024-11-01',
    description: 'Transferencia a bolsillo',
    amount: 150000,
    type: 'credit',
  },
  {
    id: '3',
    date: '2024-10-20',
    description: 'Retiro de bolsillo',
    amount: 50000,
    type: 'DEBITO',
  },
];

/**
 * Available months for report download
 */
export const mockCoaspocketAvailableMonths: MonthOption[] = generateMonthOptions(12);

/**
 * Informational text for the InfoBox
 */
export const mockCoaspocketInfoText =
  'Los bolsillos digitales te permiten organizar tu dinero de forma inteligente. ' +
  'Crea diferentes bolsillos para tus metas de ahorro y mantén un control efectivo de tus finanzas.';
```

### Update: `src/mocks/index.ts`

```typescript
export * from './coaspocket';
// ... other exports
```

---

## Page Implementation

### File: `app/(authenticated)/productos/coaspocket/page.tsx`

```typescript
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Breadcrumbs } from '@/src/molecules';
import { InfoBox } from '@/src/atoms';
import {
  CoaspocketCarousel,
  TransactionHistoryCard,
  DownloadReportsCard,
} from '@/src/organisms';
import { useWelcomeBar } from '@/src/contexts';
import { CoaspocketProduct } from '@/src/types';
import {
  mockCoaspocketProducts,
  mockCoaspocketTransactions,
  mockCoaspocketAvailableMonths,
  mockCoaspocketInfoText,
} from '@/src/mocks';
import { maskNumber } from '@/src/utils';

export default function CoaspocketPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  // First product selected by default
  const [selectedProduct, setSelectedProduct] = useState<CoaspocketProduct>(
    mockCoaspocketProducts[0]
  );
  const [transactions] = useState(mockCoaspocketTransactions);
  const [selectedMonth, setSelectedMonth] = useState(
    mockCoaspocketAvailableMonths[0]?.value || ''
  );

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: 'Coaspocket',
      backHref: '/home',
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Dynamic transaction title based on selected product
  const transactionTitle = useMemo(() => {
    const maskedNumber = maskNumber(selectedProduct.pocketNumber);
    return `Consulta de Movimientos - ${selectedProduct.title} (${maskedNumber})`;
  }, [selectedProduct]);

  const handleProductSelect = (product: CoaspocketProduct) => {
    setSelectedProduct(product);
    // TODO: Fetch transactions for selected product from API
    console.log('Selected product:', product.id);
  };

  const handleCreatePocket = () => {
    // TODO: Open modal or navigate to pocket creation flow
    console.log('Create new pocket');
  };

  const handleFilter = (startDate: string, endDate: string) => {
    // TODO: Call API to filter transactions
    console.log('Filtering:', { startDate, endDate, productId: selectedProduct.id });
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    console.log('Selected month:', month);
  };

  const handleDownload = () => {
    // TODO: Trigger PDF download from API
    console.log('Downloading:', { month: selectedMonth, productId: selectedProduct.id });
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={['Inicio', 'Productos', 'Coaspocket']} />

      {/* Section 1: Product Carousel with Action Card */}
      <CoaspocketCarousel
        title="Resumen de Bolsillos Digitales"
        products={mockCoaspocketProducts}
        selectedProductId={selectedProduct.id}
        onProductSelect={handleProductSelect}
        onCreatePocket={handleCreatePocket}
      />

      {/* Section 2: Transaction History */}
      <TransactionHistoryCard
        title={transactionTitle}
        subtitle="Últimos movimientos registrados."
        transactions={transactions}
        onFilter={handleFilter}
      />

      {/* InfoBox with informational message */}
      <InfoBox>
        {mockCoaspocketInfoText}
      </InfoBox>

      {/* Section 3: Download Reports */}
      <DownloadReportsCard
        availableMonths={mockCoaspocketAvailableMonths}
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
        onDownload={handleDownload}
      />
    </div>
  );
}
```

---

## Responsive Design

### Carousel Responsive Behavior

| Breakpoint | Visible Cards | Arrow Position | Dots |
|------------|---------------|----------------|------|
| Mobile (<640px) | 1 | Hidden (swipe) | Show |
| Tablet (640-1023px) | 2 | Show | Show |
| Desktop (>=1024px) | 3 | Show | Show |

### Card Responsive Adjustments

- Cards maintain minimum width of `250px`
- Scroll snapping ensures cards don't get cut off
- Action card ("Crear Nuevo Bolsillo") has same dimensions as pocket cards

### Tailwind Responsive Classes

```css
/* Card wrapper within carousel */
.coaspocket-card-wrapper {
  /* Mobile: full width */
  @apply w-full;

  /* Tablet: 2 cards */
  @apply sm:w-[calc(50%-10px)];

  /* Desktop: 3 cards */
  @apply lg:w-[calc(33.333%-14px)];
}

/* Minimum width for readability */
.coaspocket-card {
  @apply min-w-[250px];
}
```

---

## Accessibility Requirements

### Carousel Accessibility

Follows same patterns as other carousel implementations:

- **Arrows**:
  - `aria-label="Ver productos anteriores"` (left)
  - `aria-label="Ver productos siguientes"` (right)
  - `aria-disabled` when cannot scroll further

- **Dots**:
  - `role="tablist"` on container
  - `role="tab"` on each dot
  - `aria-selected="true"` on active dot
  - `aria-label="Ir a página X"` on each dot

- **Pocket Cards**:
  - `role="option"` (within listbox)
  - `aria-selected="true"` on selected card
  - `tabindex="0"` for keyboard navigation
  - `aria-label` with pocket summary including status

- **Create Card**:
  - `role="button"`
  - `aria-label="Crear nuevo bolsillo"`
  - `tabindex="0"` for keyboard access

- **Keyboard Navigation**:
  - Arrow keys to navigate between cards
  - Enter/Space to select card or trigger create action
  - Tab to move to arrows

### InfoBox Accessibility

- `role="note"` or `role="region"` with `aria-label="Información importante"`
- Icon should have `aria-hidden="true"` if decorative
- Content should be readable by screen readers

### Status Announcements

For screen readers, the status should be clearly communicated:

```typescript
const statusAnnouncement = product.status === 'activo'
  ? 'Estado: Activo'
  : 'Estado: Inactivo';
```

### Color Contrast

All text colors meet WCAG AA standards:
- Green status (#00A44C) on white/gray background
- Gray status (#808284) on white/gray background
- Navy balance (#194E8D) on white/gray background
- Info text (#111827) on light blue background (#F0F9FF)

---

## Integration with Existing Context

### Hide Balances (UIContext)

```typescript
import { useUIContext } from '@/src/contexts';
import { formatCurrency, maskCurrency } from '@/src/utils';

// In CoaspocketProductCard
const { hideBalances } = useUIContext();

// Mask the balance value
<span className="text-[21px] font-bold text-[#194E8D]">
  {hideBalances ? maskCurrency() : formatCurrency(product.balance)}
</span>
```

### Sidebar Active State

The sidebar should highlight "Coaspocket" when on `/productos/coaspocket`:

```typescript
// In Sidebar.tsx - handled by pathname check
const pathname = usePathname();
const isCoaspocketActive = pathname === '/productos/coaspocket';
```

---

## Implementation Checklist

### Phase 1: Types
- [ ] Create `src/types/coaspocket.ts`
- [ ] Update `src/types/index.ts` exports

### Phase 2: Atoms and Molecules
- [ ] Create `src/atoms/InfoBox.tsx`
- [ ] Create `src/molecules/CoaspocketProductCard.tsx`
- [ ] Create `src/molecules/CreatePocketCard.tsx`
- [ ] Integrate with `useUIContext` for hideBalances (CoaspocketProductCard)
- [ ] Add status color logic (Activo/Inactivo)
- [ ] Update `src/atoms/index.ts` exports
- [ ] Update `src/molecules/index.ts` exports

### Phase 3: Organism - CoaspocketCarousel
- [ ] Create `src/organisms/CoaspocketCarousel.tsx`
- [ ] Reuse `CarouselArrow` and `CarouselDots` from atoms
- [ ] Reuse carousel utilities from `src/utils/carousel.ts`
- [ ] Implement scroll behavior (snap, smooth)
- [ ] Implement navigation arrows logic
- [ ] Implement dot pagination
- [ ] Handle action card (CreatePocketCard) rendering at end
- [ ] Add responsive breakpoint handling
- [ ] Update `src/organisms/index.ts` exports

### Phase 4: Mock Data
- [ ] Create `src/mocks/coaspocket.ts`
- [ ] Update `src/mocks/index.ts` exports

### Phase 5: Page Assembly
- [ ] Create `app/(authenticated)/productos/coaspocket/page.tsx`
- [ ] Wire up carousel with mock data
- [ ] Include InfoBox component with informational text
- [ ] Reuse `TransactionHistoryCard` from 03-products
- [ ] Reuse `DownloadReportsCard` from 03-products
- [ ] Connect selection logic to transaction history title

### Phase 6: Polish
- [ ] Add responsive styles for all breakpoints
- [ ] Add hover/focus states
- [ ] Add loading state for carousel
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Verify hideBalances integration

---

## Testing Checklist

### Functional Testing
- [ ] Page loads at `/productos/coaspocket`
- [ ] First pocket is selected by default (white bg, blue border)
- [ ] Unselected pockets have gray background (#E4E6EA)
- [ ] Clicking a pocket card selects it
- [ ] Only one pocket card selected at a time
- [ ] Transaction history title updates on selection
- [ ] "Crear Nuevo Bolsillo" card appears at end of carousel
- [ ] Clicking create card triggers creation handler
- [ ] Create card cannot be selected as active pocket
- [ ] Left arrow scrolls carousel left
- [ ] Right arrow scrolls carousel right
- [ ] Dots indicate current position
- [ ] Clicking dot navigates to page
- [ ] Arrows hide/disable at scroll boundaries
- [ ] InfoBox displays with correct styling
- [ ] Date filter works correctly
- [ ] Month dropdown shows 12 months
- [ ] "Ocultar saldos" masks balance values

### Visual Testing
- [ ] Selected card: White background, navy blue border (#194E8D)
- [ ] Unselected card: Gray background (#E4E6EA), gray border
- [ ] "Activo" status displays in green (#00A44C)
- [ ] "Inactivo" status displays in gray (#808284)
- [ ] Balance values in navy blue (#194E8D)
- [ ] Create card has dashed gray border
- [ ] Create card hover state changes to navy blue
- [ ] InfoBox has light blue background (#F0F9FF)
- [ ] InfoBox has blue left border (#007FFF)

### Responsive Testing
- [ ] Mobile: 1 card visible, swipe works
- [ ] Tablet: 2 cards visible, arrows work
- [ ] Desktop: 3 cards visible, arrows work
- [ ] Cards maintain minimum width (250px)
- [ ] Cards don't overflow container
- [ ] Gap between cards is consistent (20px)
- [ ] InfoBox is full width on all breakpoints

### Accessibility Testing
- [ ] Keyboard navigation through carousel
- [ ] Arrow keys move between cards
- [ ] Enter/Space selects pocket card
- [ ] Enter/Space on create card triggers action
- [ ] Tab moves to navigation arrows
- [ ] Screen reader announces card content including status
- [ ] Screen reader announces InfoBox content
- [ ] Focus states visible on all interactive elements
- [ ] Color contrast passes WCAG AA

### Integration Testing
- [ ] Page loads at `/productos/coaspocket`
- [ ] Sidebar shows "Coaspocket" as active
- [ ] Back button navigates to `/home`
- [ ] Breadcrumbs display correctly ("Inicio / Productos / Coaspocket")
- [ ] Reused components (TransactionHistoryCard, DownloadReportsCard) work correctly

---

## Performance Considerations

### Carousel Optimization

1. **Reuse Existing Carousel Logic**:
   - Leverage carousel utilities from 04-ahorros
   - Same scroll behavior and performance optimizations

2. **Card Rendering**:
   - Cards are simpler than other product cards (no detail section)
   - Action card is lightweight (just icon and text)
   - No images to lazy load
   - CSS transitions for smooth selection changes

3. **Hide Balances Performance**:
   - Only one monetary value per card needs masking
   - No complex calculations required

---

## API Integration (Future)

When connecting to the backend API:

| Endpoint | Purpose | When Called |
|----------|---------|-------------|
| `GET /balances?type=coaspocket` | Fetch pocket products | Page load |
| `GET /movements?productId={id}` | Fetch transactions | Pocket selection |
| `GET /reports/{productId}/{month}` | Download PDF | Month selection |
| `POST /coaspocket/create` | Create new pocket | Create button click |

See `.claude/knowledge/api/README.md` for full API documentation.

---

## Related Features

- **Feature 03-products**: Provides `TransactionHistoryCard`, `DownloadReportsCard`, `Breadcrumbs`
- **Feature 04-ahorros**: Provides `CarouselArrow`, `CarouselDots`, carousel utilities, `SavingsProductCard` (similar card design)
- **Feature 07-proteccion**: Similar status pattern (activo/inactivo)
- **Feature 02-home**: Uses shared authenticated layout

---

## Comparison with Other Product Cards

| Aspect | Ahorros | Coaspocket |
|--------|---------|------------|
| Card Component | `SavingsProductCard` | `CoaspocketProductCard` |
| Number Label | "Número de producto" | "Número de bolsillo" |
| Balance Label | "Saldo Total" | None (just amount) |
| Status Values | activo/bloqueado/inactivo | activo/inactivo |
| Has Action Card | No | Yes ("Crear Nuevo Bolsillo") |
| Has InfoBox | No | Yes |
| Detail Fields | Account type | None |
| Monetary Values | 1 (balance) | 1 (balance) |
| Card Min Width | 250px | 250px |
| Unselected BG | White | #E4E6EA |

---

## Unique Features

### 1. Action Card in Carousel

Unlike all other product pages, Coaspocket includes a special action card at the end of the carousel:

- "Crear Nuevo Bolsillo" with plus icon
- Dashed border styling
- Cannot be selected as active product
- Triggers pocket creation flow on click

### 2. InfoBox Component

New component introduced specifically for Coaspocket:

- Light blue background with blue left border accent
- Displays informational text about the feature
- Can include icon
- Positioned between transaction history and download reports

### 3. Simpler Card Design

Coaspocket cards are simpler than other product cards:

- No additional detail section (like Obligaciones/Inversiones)
- No divider
- Just: Title, Number, Balance, Status

---

## References

- [references.md](./references.md) - Design analysis and Figma links
- [Design System](/.claude/design-system.md) - Color palette, typography
- [Coding Standards](/.claude/coding-standards.md) - Code style guidelines
- [Feature 03-products](../03-products/spec.md) - Reusable components
- [Feature 04-ahorros](../04-ahorros/spec.md) - Carousel components and utilities

---

**Feature Owner**: Development Team
**Design Reference**: [Figma - Productos Coaspocket](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=365-3)
**Estimated Effort**: 1.5-2 days
**Dependencies**: Feature 03-products, Feature 04-ahorros
