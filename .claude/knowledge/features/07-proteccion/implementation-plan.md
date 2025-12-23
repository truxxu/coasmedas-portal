# Step-by-Step Implementation Plan: Protección Feature (07-proteccion)

**Feature**: 07-proteccion (Insurance/Protection Products Page)
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

**Components from previous features are ALREADY IMPLEMENTED**:

| Component | Location | Status |
|-----------|----------|--------|
| `CarouselArrow` | `src/atoms/CarouselArrow.tsx` | Ready to reuse |
| `CarouselDots` | `src/atoms/CarouselDots.tsx` | Ready to reuse |
| `SavingsProductCard` | `src/molecules/SavingsProductCard.tsx` | Reference |
| `ObligacionProductCard` | `src/molecules/ObligacionProductCard.tsx` | Reference |
| `InversionProductCard` | `src/molecules/InversionProductCard.tsx` | Reference |
| `ProductCarousel` | `src/organisms/ProductCarousel.tsx` | Reference |
| `ObligacionCarousel` | `src/organisms/ObligacionCarousel.tsx` | Reference |
| `InversionCarousel` | `src/organisms/InversionCarousel.tsx` | Reference |
| `TransactionHistoryCard` | `src/organisms/TransactionHistoryCard.tsx` | Ready to reuse |
| `DownloadReportsCard` | `src/organisms/DownloadReportsCard.tsx` | Ready to reuse |
| `Breadcrumbs` | `src/molecules/Breadcrumbs.tsx` | Ready to reuse |

**Existing Utilities**:
- `src/utils/carousel.ts` - `calculateTotalPages`, `getVisibleItems`
- `src/utils/formatCurrency.ts` - `formatCurrency`, `maskCurrency`, `maskNumber`
- `src/utils/dates.ts` - `generateMonthOptions`, `formatDate`

**Existing Patterns**:
- Inversiones page at `app/(authenticated)/productos/inversiones/page.tsx`
- WelcomeBar context for page title/back button
- Sidebar already includes "Protección" in productSubItems

### What Needs to Be Created

| Type | Component | Purpose |
|------|-----------|---------|
| Type | `proteccion.ts` | ProteccionProduct, ProteccionStatus types |
| Molecule | `ProteccionProductCard` | Insurance card for carousel |
| Organism | `ProteccionCarousel` | Carousel using ProteccionProductCard |
| Mock | `proteccion.ts` | Mock data for insurance products |
| Page | `proteccion/page.tsx` | Protección page |

---

## Key Differences from Other Product Cards

**IMPORTANT**: The Protección card is unique among all product cards:

| Aspect | Ahorros/Obligaciones/Inversiones | Protección |
|--------|----------------------------------|------------|
| Main Balance | Yes (Saldo Total / Monto) | **NO main balance** |
| Product Number Format | ***1234 or DTA-***1234 | **No******65-9** |
| Status Values | activo/bloqueado, al_dia/en_mora | **activo/inactivo/cancelado** |
| Primary Fields | Balance + details | **Pago Mínimo, Fecha Límite, Pago Total Anual** |
| Monetary Color | Blue #004680 or Navy #112E7F | **Navy #194E8D** |
| Detail Divider | Yes | **No** (all fields at same level) |
| Monetary Values to Mask | 1-3 | **2** (minimumPayment, annualPayment) |

---

## Phase 1: Types (10 minutes)

### Step 1.1: Create Protección Types

**File**: `src/types/proteccion.ts`

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
  title: string;                    // "Póliza de Vida", "Seguro de Accidentes"
  productNumber: string;            // "65-9" (will be masked as No******65-9)
  status: ProteccionStatus;
  minimumPayment: number;           // Pago Mínimo
  paymentDeadline: string;          // Fecha Límite de Pago (ISO date)
  annualPayment: number;            // Pago Total Anual
}

/**
 * Callback type for protection product selection
 */
export type OnProteccionSelect = (product: ProteccionProduct) => void;
```

### Step 1.2: Update Types Index

**File**: `src/types/index.ts` - Add export:

```typescript
export * from './proteccion';
```

---

## Phase 2: Molecule - ProteccionProductCard (1-1.5 hours)

### Step 2.1: Create ProteccionProductCard

**File**: `src/molecules/ProteccionProductCard.tsx`

This is a UNIQUE card design with NO main balance field:
- Different product number format (No******65-9)
- Status with three values (activo/inactivo/cancelado)
- Three main fields without divider
- Two monetary values to mask

```typescript
'use client';

import { useUIContext } from '@/src/contexts';
import { ProteccionProduct } from '@/src/types';
import { formatCurrency, maskCurrency, formatDate } from '@/src/utils';

interface ProteccionProductCardProps {
  product: ProteccionProduct;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Mask product number with "No" prefix format
 * @example maskProteccionNumber("65-9") => "No******65-9"
 */
function maskProteccionNumber(number: string): string {
  return `No******${number}`;
}

export function ProteccionProductCard({
  product,
  isSelected = false,
  onClick,
  className = '',
}: ProteccionProductCardProps) {
  const { hideBalances } = useUIContext();

  const statusColor = {
    activo: 'text-[#00A44C]',
    inactivo: 'text-[#808284]',
    cancelado: 'text-red-600',
  }[product.status];

  const statusLabel = {
    activo: 'Activo',
    inactivo: 'Inactivo',
    cancelado: 'Cancelado',
  }[product.status];

  // Format product number with "No" prefix
  const displayProductNumber = maskProteccionNumber(product.productNumber);

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

      {/* Product Number - unique format */}
      <p className="text-[14px] text-black mb-2">
        Número de producto: {displayProductNumber}
      </p>

      {/* Status */}
      <p className={`text-[15px] mb-4 ${statusColor}`}>
        {statusLabel}
      </p>

      {/* Insurance Details Section - NO divider, all at same level */}
      <div className="space-y-2">
        {/* Pago Mínimo */}
        <div className="flex justify-between">
          <span className="text-[14px] text-[#636363]">Pago Mínimo:</span>
          <span className="text-[14px] font-medium text-[#194E8D]">
            {hideBalances ? maskCurrency() : formatCurrency(product.minimumPayment)}
          </span>
        </div>

        {/* Fecha Límite de Pago */}
        <div className="flex justify-between">
          <span className="text-[14px] text-[#636363]">Fecha Límite de Pago:</span>
          <span className="text-[14px] font-medium text-black">
            {formatDate(product.paymentDeadline)}
          </span>
        </div>

        {/* Pago Total Anual */}
        <div className="flex justify-between">
          <span className="text-[14px] text-[#636363]">Pago Total Anual:</span>
          <span className="text-[14px] font-medium text-[#194E8D]">
            {hideBalances ? maskCurrency() : formatCurrency(product.annualPayment)}
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
export { ProteccionProductCard } from './ProteccionProductCard';
```

---

## Phase 3: Organism - ProteccionCarousel (45 minutes - 1 hour)

### Step 3.1: Create ProteccionCarousel

**File**: `src/organisms/ProteccionCarousel.tsx`

This follows the same pattern as other carousel organisms but uses `ProteccionProductCard`.

```typescript
'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { CarouselArrow, CarouselDots } from '@/src/atoms';
import { ProteccionProductCard } from '@/src/molecules';
import { ProteccionProduct } from '@/src/types';
import { calculateTotalPages, getVisibleItems } from '@/src/utils';

interface ProteccionCarouselProps {
  title: string;
  products: ProteccionProduct[];
  selectedProductId?: string;
  onProductSelect: (product: ProteccionProduct) => void;
  className?: string;
}

export function ProteccionCarousel({
  title,
  products,
  selectedProductId,
  onProductSelect,
  className = '',
}: ProteccionCarouselProps) {
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
              <ProteccionProductCard
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
export { ProteccionCarousel } from './ProteccionCarousel';
```

---

## Phase 4: Mock Data (10 minutes)

### Step 4.1: Create Protección Mock Data

**File**: `src/mocks/proteccion.ts`

```typescript
import { ProteccionProduct } from '@/src/types/proteccion';
import { Transaction, MonthOption } from '@/src/types/products';
import { generateMonthOptions } from '@/src/utils/dates';

/**
 * Mock insurance/protection products for carousel
 */
export const mockProteccionProducts: ProteccionProduct[] = [
  {
    id: '1',
    title: 'Póliza de Vida',
    productNumber: '65-9',
    status: 'activo',
    minimumPayment: 85000,
    paymentDeadline: '2025-12-31',
    annualPayment: 1020000,
  },
  {
    id: '2',
    title: 'Seguro de Accidentes',
    productNumber: '12-3',
    status: 'activo',
    minimumPayment: 45000,
    paymentDeadline: '2025-12-15',
    annualPayment: 540000,
  },
  {
    id: '3',
    title: 'Seguro Exequial',
    productNumber: '78-4',
    status: 'inactivo',
    minimumPayment: 25000,
    paymentDeadline: '2025-11-30',
    annualPayment: 300000,
  },
  {
    id: '4',
    title: 'Póliza Hogar',
    productNumber: '99-1',
    status: 'cancelado',
    minimumPayment: 120000,
    paymentDeadline: '2025-10-15',
    annualPayment: 1440000,
  },
];

/**
 * Mock transactions for protection/insurance accounts
 */
export const mockProteccionTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-11-01',
    description: 'Pago prima mensual - Póliza de Vida',
    amount: 85000,
    type: 'debit',
  },
  {
    id: '2',
    date: '2024-10-01',
    description: 'Pago prima mensual - Póliza de Vida',
    amount: 85000,
    type: 'debit',
  },
  {
    id: '3',
    date: '2024-09-01',
    description: 'Pago prima mensual - Póliza de Vida',
    amount: 85000,
    type: 'debit',
  },
];

/**
 * Available months for report download
 */
export const mockProteccionAvailableMonths: MonthOption[] = generateMonthOptions(12);
```

### Step 4.2: Update Mocks Index

**File**: `src/mocks/index.ts` - Add export:

```typescript
export * from './proteccion';
```

---

## Phase 5: Page Assembly (30 minutes)

### Step 5.1: Create Protección Page

**File**: `app/(authenticated)/productos/proteccion/page.tsx`

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

/**
 * Mask product number with "No" prefix format
 */
function maskProteccionNumber(number: string): string {
  return `No******${number}`;
}

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

## Phase 6: Polish and Testing (30 minutes)

### Step 6.1: Verify All Index Exports

Check all index.ts files have the new exports:

- [ ] `src/types/index.ts` - proteccion export
- [ ] `src/molecules/index.ts` - ProteccionProductCard export
- [ ] `src/organisms/index.ts` - ProteccionCarousel export
- [ ] `src/mocks/index.ts` - proteccion export

### Step 6.2: Testing Checklist

**Functional Tests**:
- [ ] Page loads at `/productos/proteccion`
- [ ] First card is selected by default (white bg, blue border)
- [ ] Unselected cards have gray background (#E4E6EA)
- [ ] Clicking card changes selection
- [ ] Transaction title updates on selection
- [ ] Title uses "No******XX-X" format
- [ ] Arrow buttons scroll carousel
- [ ] Dots indicate current page
- [ ] Hide balances toggle masks the two monetary values (Pago Mínimo, Pago Total Anual)
- [ ] Sidebar shows "Protección" as active

**Visual Tests**:
- [ ] "Activo" status displays in green (#00A44C)
- [ ] "Inactivo" status displays in gray (#808284)
- [ ] "Cancelado" status displays in red
- [ ] NO main balance field visible (unlike other cards)
- [ ] NO divider between status and payment details
- [ ] Monetary values (Pago Mínimo, Pago Total Anual) in navy blue (#194E8D)
- [ ] Date (Fecha Límite de Pago) in black
- [ ] Detail labels in gray (#636363)
- [ ] Dates formatted correctly (e.g., "31 Dic 2025")

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
| `src/types/proteccion.ts` | 1 | High |
| `src/molecules/ProteccionProductCard.tsx` | 2 | High |
| `src/organisms/ProteccionCarousel.tsx` | 3 | High |
| `src/mocks/proteccion.ts` | 4 | High |
| `app/(authenticated)/productos/proteccion/page.tsx` | 5 | High |

### Files to Update

| File | Changes | Phase |
|------|---------|-------|
| `src/types/index.ts` | Add proteccion export | 1 |
| `src/molecules/index.ts` | Add ProteccionProductCard export | 2 |
| `src/organisms/index.ts` | Add ProteccionCarousel export | 3 |
| `src/mocks/index.ts` | Add proteccion export | 4 |

---

## Time Estimates

| Phase | Description | Time |
|-------|-------------|------|
| Phase 1 | Types | 10 min |
| Phase 2 | ProteccionProductCard | 1-1.5 hrs |
| Phase 3 | ProteccionCarousel | 45 min - 1 hr |
| Phase 4 | Mock Data | 10 min |
| Phase 5 | Page Assembly | 30 min |
| Phase 6 | Polish & Testing | 30 min |
| **Total** | | **~3-4.5 hrs (1-1.5 days)** |

---

## Dependencies Graph

```
Phase 1: Types (proteccion.ts)
    ↓
Phase 2: ProteccionProductCard (uses Types)
    ↓
Phase 3: ProteccionCarousel (uses ProteccionProductCard + existing atoms)
    ↓
Phase 4: Mock Data (uses Types)
    ↓
Phase 5: Page (uses everything above + existing components)
    ↓
Phase 6: Polish & Testing
```

---

## Key Differences from Other Product Implementations

| Aspect | Other Products | Protección |
|--------|----------------|------------|
| Main Balance | Yes (prominent) | **NO** |
| Card Structure | Balance → Status → Divider → Details | **Title → Number → Status → Details** |
| Product Number | `***1234` or `PREFIX-***1234` | **`No******XX-X`** |
| Status Count | 2 (binary) | **3** (activo/inactivo/cancelado) |
| Inactivo Color | N/A | **Gray #808284** |
| Monetary Color | Blue #004680 or Navy #112E7F | **Navy #194E8D** |
| Has Divider | Yes | **No** |
| Card Height | ~200-250px | **~180px** (no balance, simpler) |

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
- `formatDate()` - Date formatting
- `generateMonthOptions()` - Month dropdown options

### New Utility Function (in component)
- `maskProteccionNumber()` - Unique "No******XX-X" format

### Patterns Followed
- WelcomeBar context for page title
- UIContext for hideBalances
- Carousel scroll behavior
- Card selection state management

---

## Sidebar Navigation Note

Like Inversiones, there is **no sidebar update needed** because "Protección" is already included in the sidebar productSubItems array:

```typescript
const productSubItems = [
  { label: 'Aportes', href: '/productos/aportes' },
  { label: 'Ahorros', href: '/productos/ahorros' },
  { label: 'Obligaciones', href: '/productos/obligaciones' },
  { label: 'Inversiones', href: '/productos/inversiones' },
  { label: 'Protección', href: '/productos/proteccion' },  // Already exists!
  { label: 'Coaspocket', href: '/productos/coaspocket' },
];
```

---

## References

- **Feature Spec**: [spec.md](./spec.md)
- **Design References**: [references.md](./references.md)
- **Figma Design**: [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=366-5)
- **Design System**: `.claude/design-system.md`
- **Coding Standards**: `.claude/coding-standards.md`
- **Feature 06-inversiones**: `.claude/knowledge/features/06-inversiones/` (reference implementation)

---

**Last Updated**: 2025-12-22
**Status**: Ready for Implementation
