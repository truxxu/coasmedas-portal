# Step-by-Step Implementation Plan: Inversiones Feature (06-inversiones)

**Feature**: 06-inversiones (Investments/CDATs Page)
**Total Estimated Time**: 1-1.5 days
**Created**: 2025-12-22

---

## Prerequisites

### Before You Start
- [x] Feature spec reviewed (spec.md)
- [x] Design references analyzed (references.md)
- [x] Figma design reviewed
- [ ] Development environment running (`npm run dev`)

### Current Project State

**Feature 04-ahorros and 05-obligaciones components are ALREADY IMPLEMENTED**:

| Component | Location | Status |
|-----------|----------|--------|
| `CarouselArrow` | `src/atoms/CarouselArrow.tsx` | Ready to reuse |
| `CarouselDots` | `src/atoms/CarouselDots.tsx` | Ready to reuse |
| `SavingsProductCard` | `src/molecules/SavingsProductCard.tsx` | Reference |
| `ObligacionProductCard` | `src/molecules/ObligacionProductCard.tsx` | Reference (closest pattern) |
| `ProductCarousel` | `src/organisms/ProductCarousel.tsx` | Reference |
| `ObligacionCarousel` | `src/organisms/ObligacionCarousel.tsx` | Reference (closest pattern) |
| `TransactionHistoryCard` | `src/organisms/TransactionHistoryCard.tsx` | Ready to reuse |
| `DownloadReportsCard` | `src/organisms/DownloadReportsCard.tsx` | Ready to reuse |
| `Breadcrumbs` | `src/molecules/Breadcrumbs.tsx` | Ready to reuse |

**Existing Utilities**:
- `src/utils/carousel.ts` - `calculateTotalPages`, `getVisibleItems`
- `src/utils/formatCurrency.ts` - `formatCurrency`, `maskCurrency`, `maskNumber`
- `src/utils/dates.ts` - `generateMonthOptions`, `formatDate`

**Existing Patterns**:
- Obligaciones page at `app/(authenticated)/productos/obligaciones/page.tsx` (closest reference)
- WelcomeBar context for page title/back button
- Sidebar already includes "Inversiones" in productSubItems

### What Needs to Be Created

| Type | Component | Purpose |
|------|-----------|---------|
| Type | `inversiones.ts` | InversionProduct, InversionStatus types |
| Molecule | `InversionProductCard` | Investment card for carousel |
| Organism | `InversionCarousel` | Carousel using InversionProductCard |
| Mock | `inversiones.ts` | Mock data for investments |
| Page | `inversiones/page.tsx` | Inversiones page |

---

## Phase 1: Types (10 minutes)

### Step 1.1: Create Inversiones Types

**File**: `src/types/inversiones.ts`

```typescript
/**
 * Status of an investment product (CDAT)
 */
export type InversionStatus = 'activo' | 'vencido';

/**
 * Investment/CDAT product information for carousel display
 */
export interface InversionProduct {
  id: string;
  title: string;
  productNumber: string;
  productPrefix?: string;           // e.g., "DTA-" for CDATs
  amount: number;                   // Monto del CDAT
  status: InversionStatus;
  interestRate: string;             // Tasa E.A. (e.g., "12.5% E.A")
  termDays: number;                 // Plazo in days (e.g., 180)
  creationDate: string;             // F. Creacion (ISO date)
  maturityDate: string;             // F. Vencimiento (ISO date)
}

/**
 * Callback type for investment product selection
 */
export type OnInversionSelect = (product: InversionProduct) => void;
```

### Step 1.2: Update Types Index

**File**: `src/types/index.ts` - Add export:

```typescript
export * from './inversiones';
```

---

## Phase 2: Molecule - InversionProductCard (1-1.5 hours)

### Step 2.1: Create InversionProductCard

**File**: `src/molecules/InversionProductCard.tsx`

This follows the ObligacionProductCard pattern but with investment-specific fields:
- Different amount label ("Monto del CDAT")
- Investment details: Tasa E.A., Plazo, F. Creacion, F. Vencimiento
- Different status values (activo/vencido)
- Different unselected background color (#E4E6EA)
- Only 1 monetary value to mask (simpler than Obligaciones)

```typescript
'use client';

import { useUIContext } from '@/src/contexts';
import { InversionProduct } from '@/src/types';
import { formatCurrency, maskCurrency, maskNumber, formatDate } from '@/src/utils';

interface InversionProductCardProps {
  product: InversionProduct;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function InversionProductCard({
  product,
  isSelected = false,
  onClick,
  className = '',
}: InversionProductCardProps) {
  const { hideBalances } = useUIContext();

  const statusColor = {
    activo: 'text-[#00A44C]',
    vencido: 'text-red-600',
  }[product.status];

  const statusLabel = {
    activo: 'Activo',
    vencido: 'Vencido',
  }[product.status];

  // Format product number with prefix
  const displayProductNumber = product.productPrefix
    ? `${product.productPrefix}${maskNumber(product.productNumber)}`
    : maskNumber(product.productNumber);

  // Format term with "dias" suffix
  const displayTerm = `${product.termDays} dias`;

  return (
    <div
      role="option"
      aria-selected={isSelected}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`
        rounded-2xl p-5 cursor-pointer min-w-[280px]
        transition-all duration-200
        ${isSelected
          ? 'bg-white border-2 border-[#194E8D]'
          : 'bg-[#E4E6EA] border border-[#E4E6EA] hover:border-[#B1B1B1]'
        }
        ${className}
      `}
    >
      {/* Title */}
      <h3 className="text-[16px] font-medium text-black mb-1">
        {product.title}
      </h3>

      {/* Product Number */}
      <p className="text-[14px] text-black mb-3">
        Numero de producto: {displayProductNumber}
      </p>

      {/* Amount Section */}
      <p className="text-[15px] text-black">Monto del CDAT</p>
      <p className="text-[21px] font-bold text-[#004680]">
        {hideBalances ? maskCurrency() : formatCurrency(product.amount)}
      </p>

      {/* Status */}
      <p className={`text-[15px] ${statusColor}`}>
        {statusLabel}
      </p>

      {/* Divider */}
      <div className="border-t border-[#E4E6EA] my-3" />

      {/* Investment Details Section */}
      <div className="space-y-1">
        {/* Tasa E.A. */}
        <div className="flex justify-between">
          <span className="text-[14px] text-[#636363]">Tasa E.A.:</span>
          <span className="text-[14px] font-medium text-black">
            {product.interestRate}
          </span>
        </div>

        {/* Plazo */}
        <div className="flex justify-between">
          <span className="text-[14px] text-[#636363]">Plazo:</span>
          <span className="text-[14px] font-medium text-black">
            {displayTerm}
          </span>
        </div>

        {/* F. Creacion */}
        <div className="flex justify-between">
          <span className="text-[14px] text-[#636363]">F. Creacion:</span>
          <span className="text-[14px] font-medium text-black">
            {formatDate(product.creationDate)}
          </span>
        </div>

        {/* F. Vencimiento */}
        <div className="flex justify-between">
          <span className="text-[14px] text-[#636363]">F. Vencimiento:</span>
          <span className="text-[14px] font-medium text-black">
            {formatDate(product.maturityDate)}
          </span>
        </div>
      </div>
    </div>
  );
}
```

### Step 2.2: Update Molecules Index

**File**: `src/molecules/index.ts` - Add export:

```typescript
export { InversionProductCard } from './InversionProductCard';
```

---

## Phase 3: Organism - InversionCarousel (45 minutes - 1 hour)

### Step 3.1: Create InversionCarousel

**File**: `src/organisms/InversionCarousel.tsx`

This follows the same pattern as `ObligacionCarousel` but uses `InversionProductCard`.

```typescript
'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { CarouselArrow, CarouselDots } from '@/src/atoms';
import { InversionProductCard } from '@/src/molecules';
import { InversionProduct } from '@/src/types';
import { calculateTotalPages, getVisibleItems } from '@/src/utils';

interface InversionCarouselProps {
  title: string;
  products: InversionProduct[];
  selectedProductId?: string;
  onProductSelect: (product: InversionProduct) => void;
  className?: string;
}

export function InversionCarousel({
  title,
  products,
  selectedProductId,
  onProductSelect,
  className = '',
}: InversionCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const totalPages = calculateTotalPages(products.length, visibleItems);

  // Update visible items on resize
  useEffect(() => {
    const updateVisibleItems = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setVisibleItems(getVisibleItems(width));
      }
    };

    updateVisibleItems();
    window.addEventListener('resize', updateVisibleItems);
    return () => window.removeEventListener('resize', updateVisibleItems);
  }, []);

  // Update scroll state
  const updateScrollState = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate current page
    const cardWidth = clientWidth / visibleItems;
    const page = Math.round(scrollLeft / cardWidth);
    setCurrentPage(Math.min(page, totalPages - 1));
  }, [visibleItems, totalPages]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', updateScrollState);
    updateScrollState();

    return () => container.removeEventListener('scroll', updateScrollState);
  }, [updateScrollState]);

  // Scroll handlers
  const scrollToPage = (page: number) => {
    if (!containerRef.current) return;
    const cardWidth = containerRef.current.clientWidth / visibleItems;
    const gap = 20; // gap-5 = 20px
    containerRef.current.scrollTo({
      left: page * (cardWidth + gap),
      behavior: 'smooth',
    });
  };

  const scrollLeft = () => {
    if (currentPage > 0) {
      scrollToPage(currentPage - 1);
    }
  };

  const scrollRight = () => {
    if (currentPage < totalPages - 1) {
      scrollToPage(currentPage + 1);
    }
  };

  return (
    <div className={`bg-white rounded-2xl p-6 ${className}`}>
      {/* Title */}
      <h2 className="text-[20px] font-bold text-[#194E8D] mb-4">
        {title}
      </h2>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow - Hidden on mobile */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 hidden sm:block">
          <CarouselArrow
            direction="left"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          />
        </div>

        {/* Cards Container */}
        <div
          ref={containerRef}
          role="listbox"
          aria-label={title}
          className="
            flex gap-5 overflow-x-auto scroll-smooth
            snap-x snap-mandatory scrollbar-hide
            px-1 py-1
          "
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="
                flex-shrink-0 snap-start
                w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]
              "
            >
              <InversionProductCard
                product={product}
                isSelected={product.id === selectedProductId}
                onClick={() => onProductSelect(product)}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow - Hidden on mobile */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 hidden sm:block">
          <CarouselArrow
            direction="right"
            onClick={scrollRight}
            disabled={!canScrollRight}
          />
        </div>
      </div>

      {/* Dot Indicators */}
      <CarouselDots
        totalDots={totalPages}
        activeDot={currentPage}
        onDotClick={scrollToPage}
      />
    </div>
  );
}
```

### Step 3.2: Update Organisms Index

**File**: `src/organisms/index.ts` - Add export:

```typescript
export { InversionCarousel } from './InversionCarousel';
```

---

## Phase 4: Mock Data (10 minutes)

### Step 4.1: Create Inversiones Mock Data

**File**: `src/mocks/inversiones.ts`

```typescript
import { InversionProduct } from '@/src/types/inversiones';
import { Transaction, MonthOption } from '@/src/types/products';
import { generateMonthOptions } from '@/src/utils/dates';

/**
 * Mock CDAT investment products for carousel
 */
export const mockInversionProducts: InversionProduct[] = [
  {
    id: '1',
    title: 'CDTA Tradicional',
    productNumber: '123',
    productPrefix: 'DTA-',
    amount: 25000000,
    status: 'activo',
    interestRate: '12.5% E.A',
    termDays: 180,
    creationDate: '2025-08-15',
    maturityDate: '2026-02-11',
  },
  {
    id: '2',
    title: 'CDTA Plus',
    productNumber: '456',
    productPrefix: 'DTA-',
    amount: 50000000,
    status: 'activo',
    interestRate: '13.0% E.A',
    termDays: 360,
    creationDate: '2025-10-01',
    maturityDate: '2026-09-26',
  },
  {
    id: '3',
    title: 'CDTA Flexible',
    productNumber: '789',
    productPrefix: 'DTA-',
    amount: 15000000,
    status: 'vencido',
    interestRate: '11.0% E.A',
    termDays: 90,
    creationDate: '2025-06-01',
    maturityDate: '2025-08-30',
  },
];

/**
 * Mock transactions for investment accounts
 */
export const mockInversionesTransactions: Transaction[] = [
  {
    id: '1',
    date: '2025-08-15',
    description: 'Apertura CDAT',
    amount: 25000000,
    type: 'DEBITO',
  },
  {
    id: '2',
    date: '2025-11-15',
    description: 'Liquidacion intereses',
    amount: 937500,
    type: 'credit',
  },
];

/**
 * Available months for report download
 */
export const mockInversionesAvailableMonths: MonthOption[] = generateMonthOptions(12);
```

### Step 4.2: Update Mocks Index

**File**: `src/mocks/index.ts` - Add export:

```typescript
export * from './inversiones';
```

---

## Phase 5: Page Assembly (30 minutes)

### Step 5.1: Create Inversiones Page

**File**: `app/(authenticated)/productos/inversiones/page.tsx`

```typescript
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Breadcrumbs } from '@/src/molecules';
import {
  InversionCarousel,
  TransactionHistoryCard,
  DownloadReportsCard,
} from '@/src/organisms';
import { useWelcomeBar } from '@/src/contexts';
import { InversionProduct } from '@/src/types';
import {
  mockInversionProducts,
  mockInversionesTransactions,
  mockInversionesAvailableMonths,
} from '@/src/mocks';
import { maskNumber } from '@/src/utils';

export default function InversionesPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  // First product selected by default
  const [selectedProduct, setSelectedProduct] = useState<InversionProduct>(
    mockInversionProducts[0]
  );
  const [transactions] = useState(mockInversionesTransactions);
  const [selectedMonth, setSelectedMonth] = useState(
    mockInversionesAvailableMonths[0]?.value || ''
  );

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: 'Inversiones',
      backHref: '/home',
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Dynamic transaction title based on selected product
  // Note: Transaction title uses CDAT- prefix, not DTA-
  const transactionTitle = useMemo(() => {
    const maskedNumber = `CDAT-${maskNumber(selectedProduct.productNumber)}`;
    return `Consulta de Movimientos - ${selectedProduct.title} (${maskedNumber})`;
  }, [selectedProduct]);

  const handleProductSelect = (product: InversionProduct) => {
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
      <Breadcrumbs items={['Inicio', 'Productos', 'Inversiones']} />

      {/* Section 1: Product Carousel */}
      <InversionCarousel
        title="Resumen de Inversiones"
        products={mockInversionProducts}
        selectedProductId={selectedProduct.id}
        onProductSelect={handleProductSelect}
      />

      {/* Section 2: Transaction History */}
      <TransactionHistoryCard
        title={transactionTitle}
        subtitle="Ultimos movimientos registrados."
        transactions={transactions}
        onFilter={handleFilter}
      />

      {/* Section 3: Download Reports */}
      <DownloadReportsCard
        availableMonths={mockInversionesAvailableMonths}
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
        onDownload={handleDownload}
      />
    </div>
  );
}
```

---

## Phase 6: Polish and Testing (30 minutes)

### Step 6.1: Verify All Index Exports

Check all index.ts files have the new exports:

- [ ] `src/types/index.ts` - inversiones export
- [ ] `src/molecules/index.ts` - InversionProductCard export
- [ ] `src/organisms/index.ts` - InversionCarousel export
- [ ] `src/mocks/index.ts` - inversiones export

### Step 6.2: Testing Checklist

**Functional Tests**:
- [ ] Page loads at `/productos/inversiones`
- [ ] First card is selected by default (white bg, blue border)
- [ ] Unselected cards have gray background (#E4E6EA)
- [ ] Clicking card changes selection
- [ ] Transaction title updates on selection
- [ ] Title uses CDAT- prefix format (not DTA-)
- [ ] Arrow buttons scroll carousel
- [ ] Dots indicate current page
- [ ] Hide balances toggle masks the CDAT amount
- [ ] Sidebar shows "Inversiones" as active

**Visual Tests**:
- [ ] "Activo" status displays in green (#00A44C)
- [ ] "Vencido" status displays in red
- [ ] Divider visible between status and investment details
- [ ] Amount value in blue (#004680)
- [ ] Detail labels in gray (#636363)
- [ ] Detail values in black
- [ ] Interest rate displayed as-is (e.g., "12.5% E.A")
- [ ] Term displayed with "dias" suffix (e.g., "180 dias")
- [ ] Dates formatted correctly (e.g., "15 Ago 2025")

**Responsive Tests**:
- [ ] Mobile: 1 card visible, swipe works
- [ ] Tablet: 2 cards visible, arrows work
- [ ] Desktop: 3 cards visible, arrows work

**Accessibility Tests**:
- [ ] Keyboard navigation (Tab, Enter, Space)
- [ ] ARIA labels present on cards
- [ ] Focus states visible

---

## File Checklist Summary

### New Files to Create

| File | Phase | Priority |
|------|-------|----------|
| `src/types/inversiones.ts` | 1 | High |
| `src/molecules/InversionProductCard.tsx` | 2 | High |
| `src/organisms/InversionCarousel.tsx` | 3 | High |
| `src/mocks/inversiones.ts` | 4 | High |
| `app/(authenticated)/productos/inversiones/page.tsx` | 5 | High |

### Files to Update

| File | Changes | Phase |
|------|---------|-------|
| `src/types/index.ts` | Add inversiones export | 1 |
| `src/molecules/index.ts` | Add InversionProductCard export | 2 |
| `src/organisms/index.ts` | Add InversionCarousel export | 3 |
| `src/mocks/index.ts` | Add inversiones export | 4 |

---

## Time Estimates

| Phase | Description | Time |
|-------|-------------|------|
| Phase 1 | Types | 10 min |
| Phase 2 | InversionProductCard | 1-1.5 hrs |
| Phase 3 | InversionCarousel | 45 min - 1 hr |
| Phase 4 | Mock Data | 10 min |
| Phase 5 | Page Assembly | 30 min |
| Phase 6 | Polish & Testing | 30 min |
| **Total** | | **~3-4.5 hrs (1-1.5 days)** |

---

## Dependencies Graph

```
Phase 1: Types (inversiones.ts)
    |
Phase 2: InversionProductCard (uses Types)
    |
Phase 3: InversionCarousel (uses InversionProductCard + existing atoms)
    |
Phase 4: Mock Data (uses Types)
    |
Phase 5: Page (uses everything above + existing components)
    |
Phase 6: Polish & Testing
```

---

## Key Differences from Obligaciones Implementation

| Aspect | Obligaciones (05) | Inversiones (06) |
|--------|-------------------|------------------|
| Card Component | `ObligacionProductCard` | `InversionProductCard` |
| Carousel Component | `ObligacionCarousel` | `InversionCarousel` |
| Amount Label | "Saldo a la fecha" | "Monto del CDAT" |
| Amount Color | Navy #112E7F | Blue #004680 |
| Status Values | al_dia/en_mora | activo/vencido |
| Unselected BG | #F3F4F6 | #E4E6EA |
| Detail Fields | 3 (disbursed, next payment date/amount) | 4 (rate, term, creation/maturity dates) |
| Monetary Values | 3 to mask | 1 to mask (simpler) |
| Product Prefix | Optional "CR-" | "DTA-" |
| Transaction Prefix | Same as product | "CDAT-" (different!) |

---

## Code Reuse Strategy

### Components Reused Without Changes
- `CarouselArrow` - Navigation arrows
- `CarouselDots` - Pagination dots
- `TransactionHistoryCard` - Transaction list
- `DownloadReportsCard` - Report download
- `Breadcrumbs` - Navigation breadcrumbs

### Utilities Reused
- `calculateTotalPages()` - Carousel pagination
- `getVisibleItems()` - Responsive card count
- `formatCurrency()` - Currency formatting
- `maskCurrency()` - Balance masking
- `maskNumber()` - Product number masking
- `formatDate()` - Date formatting
- `generateMonthOptions()` - Month dropdown options

### Patterns Followed
- WelcomeBar context for page title
- UIContext for hideBalances
- Carousel scroll behavior
- Card selection state management

---

## Investment-Specific Implementation Details

### Detail Fields Display Order

```
Tasa E.A.:       12.5% E.A
Plazo:           180 dias
F. Creacion:     15 Ago 2025
F. Vencimiento:  11 Feb 2025
```

### Product Number vs Transaction Title Prefixes

**Important distinction:**
- **Card display**: Uses "DTA-" prefix -> `DTA-******123`
- **Transaction title**: Uses "CDAT-" prefix -> `CDAT-*****123`

```typescript
// In InversionProductCard (card display):
const displayProductNumber = `DTA-${maskNumber(product.productNumber)}`;

// In page (transaction title):
const maskedNumber = `CDAT-${maskNumber(selectedProduct.productNumber)}`;
```

### Term Days Formatting

```typescript
// Display with "dias" suffix
const displayTerm = `${product.termDays} dias`;
// Result: "180 dias"
```

### Interest Rate Display

Interest rate is stored as a string and displayed as-is from the backend:

```typescript
product.interestRate  // "12.5% E.A"
// No formatting needed, just display directly
```

---

## Sidebar Navigation Note

Unlike Obligaciones, there is **no sidebar update needed** because "Inversiones" is already included in the sidebar productSubItems array:

```typescript
const productSubItems = [
  { label: 'Aportes', href: '/productos/aportes' },
  { label: 'Ahorros', href: '/productos/ahorros' },
  { label: 'Obligaciones', href: '/productos/obligaciones' },
  { label: 'Inversiones', href: '/productos/inversiones' },  // Already exists!
  { label: 'Proteccion', href: '/productos/proteccion' },
  { label: 'Coaspocket', href: '/productos/coaspocket' },
];
```

---

## References

- **Feature Spec**: [spec.md](./spec.md)
- **Design References**: [references.md](./references.md)
- **Figma Design**: [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=353-3)
- **Design System**: `.claude/design-system.md`
- **Coding Standards**: `.claude/coding-standards.md`
- **Feature 05-obligaciones**: `.claude/knowledge/features/05-obligaciones/` (closest reference implementation)

---

**Last Updated**: 2025-12-22
**Status**: Ready for Implementation
