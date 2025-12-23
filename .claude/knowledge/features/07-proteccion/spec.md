# Feature: Protección (07-proteccion)

**Status**: Planning
**Priority**: Must Have
**Feature Number**: 07
**Last Updated**: 2025-12-22

---

## Overview

The **Protección** (Protection/Insurance) feature provides authenticated users access to their insurance policies and protection products through a horizontally scrollable carousel. Unlike other product pages, the Protección cards do NOT display a main balance field but instead show payment-related information.

**Key Purpose**:
- View all insurance/protection products in a scrollable carousel
- See detailed payment information (minimum payment, payment deadline, annual payment)
- Select a product to see its transaction history
- Filter and view transaction history for selected product
- Download monthly PDF reports/statements

**Key Differences from Other Product Pages**:
- **No main balance field** - Unlike Ahorros, Obligaciones, and Inversiones
- **Unique product number format** - Uses "No" prefix (e.g., `No******65-9`)
- **Different status values** - activo/inactivo/cancelado
- **Section title** - "Resumen de Pólizas y Seguros" (unique naming)
- **Monetary values use Navy blue** (#194E8D) not darker blue

---

## User Stories

### US-07.1: View Protection Products Carousel
**As an** authenticated user
**I want** to see all my insurance/protection products in a carousel
**So that** I can quickly overview all my policies

**Acceptance Criteria**:
- [ ] Page displays at `/productos/proteccion`
- [ ] Carousel shows all user's protection/insurance products
- [ ] First product is selected by default (white background, blue border)
- [ ] Unselected products have gray background (#E4E6EA)
- [ ] Navigation arrows appear on left and right sides
- [ ] Dot indicators show current position
- [ ] Horizontal scroll with snap-to-card behavior
- [ ] Responsive: 1 card on mobile, 2 on tablet, 3 on desktop

### US-07.2: Select Protection Product
**As an** authenticated user
**I want** to select a protection product from the carousel
**So that** I can view its transaction history and details

**Acceptance Criteria**:
- [ ] Clicking a card selects it (shows white background, blue border)
- [ ] Only one card can be selected at a time
- [ ] Previously selected card reverts to gray background
- [ ] Transaction history section updates with selected product's data
- [ ] Section title updates to show selected product number
- [ ] Selection persists during page session

### US-07.3: View Protection Product Card Information
**As an** authenticated user
**I want** to see detailed information on each protection product card
**So that** I can understand my policy status and payment requirements

**Acceptance Criteria**:
- [ ] Card shows product title (e.g., "Seguro de Vida Grupo Deudores")
- [ ] Card shows masked product number with "No" prefix (e.g., "No******65-9")
- [ ] Card shows status: "Activo" (green), "Inactivo" (red), or "Cancelado" (red)
- [ ] Card shows horizontal divider separating main info from details
- [ ] Card shows "Pago Mínimo" (minimum payment) in navy blue
- [ ] Card shows "Fecha Límite de Pago" (payment deadline) in black
- [ ] Card shows "Pago Total Anual" (annual payment) in navy blue
- [ ] All monetary values respect "Ocultar saldos" toggle

### US-07.4: Transaction History for Selected Product
**As an** authenticated user
**I want** to filter and view transaction history for my selected protection product
**So that** I can track my payment activity

**Acceptance Criteria**:
- [ ] Transaction history updates when different product is selected
- [ ] Title dynamically shows selected product name and number
- [ ] Date range filter with start and end date inputs
- [ ] Maximum range limited to 3 months
- [ ] "Aplicar" button triggers filter
- [ ] Shows transactions matching filter
- [ ] Shows empty state when no transactions found

### US-07.5: Download Monthly Reports
**As an** authenticated user
**I want** to download monthly statements for my protection products
**So that** I can keep records of my payment activity

**Acceptance Criteria**:
- [ ] Month dropdown shows available months (last 12 months)
- [ ] Selecting month triggers PDF download
- [ ] Clear description of functionality

---

## Technical Approach

### Routes

| Path | Description |
|------|-------------|
| `/productos/proteccion` | Protección (Insurance/Protection) product page |

### File Structure

```
app/(authenticated)/productos/
├── proteccion/
│   └── page.tsx                   # Protección page

src/
├── molecules/
│   ├── ProteccionProductCard.tsx  # NEW: Protection card for carousel
│   └── index.ts                   # Update exports
├── organisms/
│   ├── ProteccionCarousel.tsx     # NEW: Carousel for protection products
│   └── index.ts                   # Update exports
├── types/
│   └── proteccion.ts              # NEW: Protection-related types
├── utils/
│   └── formatCurrency.ts          # UPDATE: Add maskProteccionNumber
└── mocks/
    └── proteccion.ts              # NEW: Mock data for Protección
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

Protección is already included in the Products accordion menu (no update required):

```typescript
const productSubItems = [
  { label: 'Aportes', href: '/productos/aportes' },
  { label: 'Ahorros', href: '/productos/ahorros' },
  { label: 'Obligaciones', href: '/productos/obligaciones' },
  { label: 'Inversiones', href: '/productos/inversiones' },
  { label: 'Protección', href: '/productos/proteccion' },  // Already exists
  { label: 'Coaspocket', href: '/productos/coaspocket' },
];
```

---

## Component Specifications

### Molecules

#### ProteccionProductCard
Individual protection/insurance card for the carousel.

```typescript
interface ProteccionProductCardProps {
  product: ProteccionProduct;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

interface ProteccionProduct {
  id: string;
  title: string;                    // "Seguro de Vida Grupo Deudores"
  productNumber: string;            // "65-9" (will be masked as No******65-9)
  status: ProteccionStatus;         // 'activo' | 'inactivo' | 'cancelado'
  minimumPayment: number;           // 150000 (Pago Mínimo)
  paymentDeadline: string;          // "2025-11-30" ISO date (Fecha Límite de Pago)
  annualPayment: number;            // 1800000 (Pago Total Anual)
}

type ProteccionStatus = 'activo' | 'inactivo' | 'cancelado';
```

**Layout** (NO main balance field):
```
┌─────────────────────────────────────────────────┐
│ Seguro de Vida Grupo Deudores                   │
│ Número de producto: No******65-9                │
│ Activo                                          │
│ ─────────────────────────────────────────────── │
│ Pago Mínimo:              $ 150.000             │
│ Fecha Límite de Pago:     30 Nov 2025           │
│ Pago Total Anual:         $ 1.800.000           │
└─────────────────────────────────────────────────┘
```

**Styling**:
- Width: `280px` minimum
- Height: Auto (~200px due to no balance field)
- Border radius: `16px`
- Padding: `20px`
- Cursor: `pointer`
- Transition: `all 0.2s ease`

**Selected State**:
- Background: `#FFFFFF` (white)
- Border: `2px solid #194E8D` (navy blue)

**Unselected State**:
- Background: `#E4E6EA` (gray - same as Inversiones)
- Border: `1px solid #E4E6EA` (gray)
- Hover: Border `#B1B1B1`

**Internal Divider**:
- Position: Between status and additional info
- Style: `1px solid #E4E6EA` (selected) or `1px solid #B1B1B1` (unselected)
- Margin: `12px 0`

**Typography**:
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Title | Ubuntu | 16px | Medium | Black |
| Product Number | Ubuntu | 14px | Regular | Black |
| Status "Activo" | Ubuntu | 15px | Regular | Green #00A44C |
| Status "Inactivo" | Ubuntu | 15px | Regular | Red #FF0000 |
| Status "Cancelado" | Ubuntu | 15px | Regular | Red #FF0000 |
| Detail Label | Ubuntu | 14px | Regular | Gray #636363 |
| Detail Value (money) | Ubuntu | 14px | Medium | Navy #194E8D |
| Detail Value (date) | Ubuntu | 14px | Medium | Black |

**Hide Balances Integration**:
```typescript
const { hideBalances } = useUIContext();

// Mask monetary values only (not the date)
{hideBalances ? maskCurrency() : formatCurrency(product.minimumPayment)}
{hideBalances ? maskCurrency() : formatCurrency(product.annualPayment)}
```

**Tailwind Classes**:
```css
/* Base card */
bg-[#E4E6EA] rounded-2xl p-5 cursor-pointer min-w-[280px]
transition-all duration-200
border border-[#E4E6EA]
hover:border-[#B1B1B1]

/* Selected state */
bg-white border-2 border-[#194E8D]

/* Divider - selected */
border-t border-[#E4E6EA] my-3

/* Divider - unselected */
border-t border-[#B1B1B1] my-3

/* Detail row */
flex justify-between mb-1

/* Detail label */
text-[14px] text-[#636363]

/* Detail value - money */
text-[14px] font-medium text-[#194E8D]

/* Detail value - date */
text-[14px] font-medium text-black
```

---

### Organisms

#### ProteccionCarousel
Carousel component specifically for protection/insurance product cards.

```typescript
interface ProteccionCarouselProps {
  title: string;                                    // "Resumen de Pólizas y Seguros"
  products: ProteccionProduct[];                    // Array of protection products
  selectedProductId?: string;                       // ID of selected product
  onProductSelect: (product: ProteccionProduct) => void;
  className?: string;
}
```

**Implementation Notes**:
- Reuses `CarouselArrow` and `CarouselDots` atoms from 04-ahorros
- Reuses carousel utilities (`calculateTotalPages`, `getVisibleItems`)
- Uses `ProteccionProductCard` for card rendering
- Same scroll behavior, responsive breakpoints, and accessibility features as other carousels

**Layout**:
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Resumen de Pólizas y Seguros                                                │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │                                                                         │ │
│ │  (←)  [Card 1 - selected]  [Card 2 - unselected]  (→)                  │ │
│ │       (white bg)           (gray bg)                                    │ │
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

### File: `src/types/proteccion.ts`

```typescript
/**
 * Status of a protection/insurance product
 */
export type ProteccionStatus = 'activo' | 'inactivo' | 'cancelado';

/**
 * Protection/insurance product information for carousel display
 */
export interface ProteccionProduct {
  id: string;
  title: string;
  productNumber: string;           // e.g., "65-9" (will be masked as No******65-9)
  status: ProteccionStatus;
  minimumPayment: number;          // Pago Mínimo
  paymentDeadline: string;         // Fecha Límite de Pago (ISO date)
  annualPayment: number;           // Pago Total Anual
}

/**
 * Callback type for protection product selection
 */
export type OnProteccionSelect = (product: ProteccionProduct) => void;
```

### Update: `src/types/index.ts`

```typescript
// Add export
export * from './proteccion';
```

---

## Utility Functions

### Update: `src/utils/formatCurrency.ts`

Add the new masking function for protection product numbers:

```typescript
/**
 * Mask protection product number with "No" prefix
 * @example maskProteccionNumber("65-9") => "No******65-9"
 */
export function maskProteccionNumber(number: string): string {
  return `No******${number}`;
}
```

### Update: `src/utils/index.ts`

Ensure the function is exported if it's in a separate file, or verify the formatCurrency.ts exports are correct.

---

## Mock Data

### File: `src/mocks/proteccion.ts`

```typescript
import { ProteccionProduct } from '@/src/types/proteccion';
import { Transaction, MonthOption } from '@/src/types/products';
import { generateMonthOptions } from '@/src/utils/dates';

/**
 * Mock protection/insurance products for carousel
 */
export const mockProteccionProducts: ProteccionProduct[] = [
  {
    id: '1',
    title: 'Seguro de Vida Grupo Deudores',
    productNumber: '65-9',
    status: 'activo',
    minimumPayment: 150000,
    paymentDeadline: '2025-11-30',
    annualPayment: 1800000,
  },
  {
    id: '2',
    title: 'Póliza Exequial Familiar',
    productNumber: '12-3',
    status: 'activo',
    minimumPayment: 55000,
    paymentDeadline: '2025-11-25',
    annualPayment: 660000,
  },
  {
    id: '3',
    title: 'Seguro de Accidentes Personales',
    productNumber: '78-4',
    status: 'inactivo',
    minimumPayment: 85000,
    paymentDeadline: '2025-10-15',
    annualPayment: 1020000,
  },
];

/**
 * Mock transactions for protection accounts
 */
export const mockProteccionTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-11-20',
    description: 'Pago prima mensual',
    amount: 150000,
    type: 'debit',
  },
  {
    id: '2',
    date: '2024-10-20',
    description: 'Pago prima mensual',
    amount: 150000,
    type: 'debit',
  },
  {
    id: '3',
    date: '2024-09-20',
    description: 'Pago prima mensual',
    amount: 150000,
    type: 'debit',
  },
];

/**
 * Available months for report download
 */
export const mockProteccionAvailableMonths: MonthOption[] = generateMonthOptions(12);
```

### Update: `src/mocks/index.ts`

```typescript
export * from './proteccion';
// ... other exports
```

---

## Page Implementation

### File: `app/(authenticated)/productos/proteccion/page.tsx`

```typescript
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Breadcrumbs } from '@/src/molecules';
import {
  ProteccionCarousel,
  TransactionHistoryCard,
  DownloadReportsCard,
} from '@/src/organisms';
import { useWelcomeBar } from '@/src/contexts';
import { ProteccionProduct } from '@/src/types';
import {
  mockProteccionProducts,
  mockProteccionTransactions,
  mockProteccionAvailableMonths,
} from '@/src/mocks';
import { maskProteccionNumber } from '@/src/utils';

export default function ProteccionPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  // First product selected by default
  const [selectedProduct, setSelectedProduct] = useState<ProteccionProduct>(
    mockProteccionProducts[0]
  );
  const [transactions] = useState(mockProteccionTransactions);
  const [selectedMonth, setSelectedMonth] = useState(
    mockProteccionAvailableMonths[0]?.value || ''
  );

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: 'Protección',
      backHref: '/home',
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Dynamic transaction title based on selected product
  const transactionTitle = useMemo(() => {
    const maskedNumber = maskProteccionNumber(selectedProduct.productNumber);
    return `Consulta de Movimientos - ${selectedProduct.title} (${maskedNumber})`;
  }, [selectedProduct]);

  const handleProductSelect = (product: ProteccionProduct) => {
    setSelectedProduct(product);
    // TODO: Fetch transactions for selected product from API
    console.log('Selected product:', product.id);
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
      <Breadcrumbs items={['Inicio', 'Productos', 'Protección']} />

      {/* Section 1: Product Carousel */}
      <ProteccionCarousel
        title="Resumen de Pólizas y Seguros"
        products={mockProteccionProducts}
        selectedProductId={selectedProduct.id}
        onProductSelect={handleProductSelect}
      />

      {/* Section 2: Transaction History */}
      <TransactionHistoryCard
        title={transactionTitle}
        subtitle="Últimos movimientos registrados."
        transactions={transactions}
        onFilter={handleFilter}
      />

      {/* Section 3: Download Reports */}
      <DownloadReportsCard
        availableMonths={mockProteccionAvailableMonths}
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

- Cards maintain minimum width of `280px`
- Scroll snapping ensures cards don't get cut off
- Cards are slightly shorter than Obligaciones/Inversiones due to no balance field

### Tailwind Responsive Classes

```css
/* Card wrapper within carousel */
.proteccion-card-wrapper {
  /* Mobile: full width */
  @apply w-full;

  /* Tablet: 2 cards */
  @apply sm:w-[calc(50%-10px)];

  /* Desktop: 3 cards */
  @apply lg:w-[calc(33.333%-14px)];
}

/* Minimum width for readability */
.proteccion-card {
  @apply min-w-[280px];
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

- **Cards**:
  - `role="option"` (within listbox)
  - `aria-selected="true"` on selected card
  - `tabindex="0"` for keyboard navigation
  - `aria-label` with product summary including status

- **Keyboard Navigation**:
  - Arrow keys to navigate between cards
  - Enter/Space to select card
  - Tab to move to arrows

### Status Announcements

For screen readers, the status should be clearly communicated:

```typescript
const statusAnnouncement = {
  activo: 'Estado: Activo',
  inactivo: 'Estado: Inactivo - póliza suspendida',
  cancelado: 'Estado: Cancelado - póliza terminada',
}[product.status];
```

### Color Contrast

All text colors meet WCAG AA standards:
- Green status (#00A44C) on white/gray background
- Red status (#FF0000) on white/gray background
- Navy values (#194E8D) on white/gray background
- Gray labels (#636363) on white/gray background

---

## Integration with Existing Context

### Hide Balances (UIContext)

```typescript
import { useUIContext } from '@/src/contexts';
import { formatCurrency, maskCurrency } from '@/src/utils';

// In ProteccionProductCard
const { hideBalances } = useUIContext();

// Mask BOTH monetary values (there's no main balance)
<span className="text-[14px] font-medium text-[#194E8D]">
  {hideBalances ? maskCurrency() : formatCurrency(product.minimumPayment)}
</span>

<span className="text-[14px] font-medium text-[#194E8D]">
  {hideBalances ? maskCurrency() : formatCurrency(product.annualPayment)}
</span>
```

### Sidebar Active State

The sidebar should highlight "Protección" when on `/productos/proteccion`:

```typescript
// In Sidebar.tsx - handled by pathname check
const pathname = usePathname();
const isProteccionActive = pathname === '/productos/proteccion';
```

---

## Implementation Checklist

### Phase 1: Types and Utilities
- [ ] Create `src/types/proteccion.ts`
- [ ] Add `maskProteccionNumber` to `src/utils/formatCurrency.ts`
- [ ] Update `src/types/index.ts` exports
- [ ] Update `src/utils/index.ts` exports (if needed)

### Phase 2: Molecule - ProteccionProductCard
- [ ] Create `src/molecules/ProteccionProductCard.tsx`
- [ ] Implement selected/unselected visual states (NO balance field)
- [ ] Add divider and detail info section
- [ ] Integrate with `useUIContext` for hideBalances
- [ ] Add status color logic (Activo/Inactivo/Cancelado)
- [ ] Update `src/molecules/index.ts` exports

### Phase 3: Organism - ProteccionCarousel
- [ ] Create `src/organisms/ProteccionCarousel.tsx`
- [ ] Reuse `CarouselArrow` and `CarouselDots` from atoms
- [ ] Reuse carousel utilities from `src/utils/carousel.ts`
- [ ] Implement scroll behavior (snap, smooth)
- [ ] Implement navigation arrows logic
- [ ] Implement dot pagination
- [ ] Add responsive breakpoint handling
- [ ] Update `src/organisms/index.ts` exports

### Phase 4: Mock Data
- [ ] Create `src/mocks/proteccion.ts`
- [ ] Update `src/mocks/index.ts` exports

### Phase 5: Page Assembly
- [ ] Create `app/(authenticated)/productos/proteccion/page.tsx`
- [ ] Wire up carousel with mock data
- [ ] Reuse `TransactionHistoryCard` from 03-products
- [ ] Reuse `DownloadReportsCard` from 03-products
- [ ] Connect selection logic to transaction history title

### Phase 6: Polish
- [ ] Add responsive styles for all breakpoints
- [ ] Add hover/focus states
- [ ] Add loading state for carousel
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Verify hideBalances integration for both monetary values

---

## Testing Checklist

### Functional Testing
- [ ] Page loads at `/productos/proteccion`
- [ ] First product is selected by default (white bg, blue border)
- [ ] Unselected products have gray background (#E4E6EA)
- [ ] Clicking a card selects it
- [ ] Only one card selected at a time
- [ ] Transaction history title updates on selection with No****** format
- [ ] Left arrow scrolls carousel left
- [ ] Right arrow scrolls carousel right
- [ ] Dots indicate current position
- [ ] Clicking dot navigates to page
- [ ] Arrows hide/disable at scroll boundaries
- [ ] Date filter works correctly
- [ ] Month dropdown shows 12 months
- [ ] "Ocultar saldos" masks BOTH monetary values (minimumPayment, annualPayment)

### Visual Testing
- [ ] Selected card: White background, navy blue border (#194E8D)
- [ ] Unselected card: Gray background (#E4E6EA), gray border
- [ ] "Activo" status displays in green (#00A44C)
- [ ] "Inactivo" status displays in red (#FF0000)
- [ ] "Cancelado" status displays in red (#FF0000)
- [ ] Divider visible between status and additional info
- [ ] Monetary values in navy blue (#194E8D)
- [ ] Date values in black
- [ ] Detail labels in gray (#636363)
- [ ] Product number format: No******XX-X
- [ ] **NO main balance field displayed** (key difference)

### Responsive Testing
- [ ] Mobile: 1 card visible, swipe works
- [ ] Tablet: 2 cards visible, arrows work
- [ ] Desktop: 3 cards visible, arrows work
- [ ] Cards maintain minimum width (280px)
- [ ] Cards don't overflow container
- [ ] Gap between cards is consistent (20px)

### Accessibility Testing
- [ ] Keyboard navigation through carousel
- [ ] Arrow keys move between cards
- [ ] Enter/Space selects card
- [ ] Tab moves to navigation arrows
- [ ] Screen reader announces card content including status
- [ ] Focus states visible on all interactive elements
- [ ] Color contrast passes WCAG AA

### Integration Testing
- [ ] Page loads at `/productos/proteccion`
- [ ] Sidebar shows "Protección" as active
- [ ] Back button navigates to `/home`
- [ ] Breadcrumbs display correctly ("Inicio / Productos / Protección")
- [ ] Reused components (TransactionHistoryCard, DownloadReportsCard) work correctly

---

## Performance Considerations

### Carousel Optimization

1. **Reuse Existing Carousel Logic**:
   - Leverage carousel utilities from 04-ahorros
   - Same scroll behavior and performance optimizations

2. **Card Rendering**:
   - Cards are slightly shorter than Obligaciones/Inversiones (no balance field)
   - No images to lazy load
   - CSS transitions for smooth selection changes

3. **Hide Balances Performance**:
   - Only two monetary values per card need masking (fewer than Inversiones)
   - No complex calculations required

---

## API Integration (Future)

When connecting to the backend API:

| Endpoint | Purpose | When Called |
|----------|---------|-------------|
| `GET /balances?type=proteccion` | Fetch protection products | Page load |
| `GET /movements?productId={id}` | Fetch transactions | Product selection |
| `GET /reports/{productId}/{month}` | Download PDF | Month selection |

See `.claude/knowledge/api/README.md` for full API documentation.

---

## Related Features

- **Feature 03-products**: Provides `TransactionHistoryCard`, `DownloadReportsCard`, `Breadcrumbs`
- **Feature 04-ahorros**: Provides `CarouselArrow`, `CarouselDots`, carousel utilities
- **Feature 05-obligaciones**: Similar extended card pattern reference
- **Feature 06-inversiones**: Similar extended card pattern reference
- **Feature 02-home**: Uses shared authenticated layout

---

## Comparison with Other Product Cards

| Aspect | Ahorros | Obligaciones | Inversiones | Protección |
|--------|---------|--------------|-------------|------------|
| Card Component | `SavingsProductCard` | `ObligacionProductCard` | `InversionProductCard` | `ProteccionProductCard` |
| Has Balance | Yes | Yes | Yes | **No** |
| Balance Label | "Saldo Total" | "Saldo a la fecha" | "Monto del CDAT" | N/A |
| Status Values | activo/bloqueado | al_dia/en_mora | activo/vencido | activo/inactivo/cancelado |
| Detail Fields | 0 | 3 | 4 | 3 |
| Number Format | ***1234 | ***1234 or CR-***1234 | DTA-***123 | No******65-9 |
| Money Color | Navy #112E7F | Blue #004680 | Navy #112E7F | Navy #194E8D |
| Unselected BG | White | #F3F4F6 | #E4E6EA | #E4E6EA |

---

## Key Implementation Notes

### 1. No Balance Field

Unlike ALL other product cards (Ahorros, Obligaciones, Inversiones), the Protección card does NOT have a main balance field. The card shows:

- Title
- Product number (with No****** prefix)
- Status
- Divider
- Three detail fields (two monetary, one date)

### 2. Unique Product Number Format

- Uses "No" prefix: `No******65-9`
- Includes alphanumeric suffix: `65-9`, `12-3`, `78-4`
- Different from other products which use numeric-only or DTA-/CR- prefixed masked numbers

### 3. Two Monetary Values to Mask

When `hideBalances` is enabled, mask:
- Pago Mínimo (minimum payment)
- Pago Total Anual (annual payment)

Do NOT mask the date field (Fecha Límite de Pago).

### 4. Monetary Value Color

All monetary values in the detail section use Navy Blue (#194E8D), consistent with the section title color.

### 5. Section Title

The carousel section uses a unique title: "Resumen de Pólizas y Seguros" (not following the "Resumen de..." pattern exactly like other products).

---

## References

- [references.md](./references.md) - Design analysis and Figma links
- [Design System](/.claude/design-system.md) - Color palette, typography
- [Coding Standards](/.claude/coding-standards.md) - Code style guidelines
- [Feature 03-products](../03-products/spec.md) - Reusable components
- [Feature 04-ahorros](../04-ahorros/spec.md) - Carousel components and utilities
- [Feature 06-inversiones](../06-inversiones/spec.md) - Similar extended card pattern

---

**Feature Owner**: Development Team
**Design Reference**: [Figma - Productos Protección](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=353-318)
**Estimated Effort**: 1.5-2 days
**Dependencies**: Feature 03-products, Feature 04-ahorros
