# Step-by-Step Implementation Plan: Products Feature (03-products)

**Feature**: 03-products (Aportes Page)
**Total Estimated Time**: 3-4 days
**Created**: 2025-12-18

---

## Prerequisites

### Before You Start
- [x] Feature spec reviewed (spec.md)
- [x] Design references analyzed (references.md)
- [x] Figma design reviewed
- [ ] Development environment running (`npm run dev`)

### Current Project State
- Authenticated layout exists at `app/(authenticated)/layout.tsx`
- Sidebar component exists with expandable items support
- UIContext provides `hideBalances` and `sidebarExpanded` state
- Existing utilities: `formatCurrency`, `maskCurrency` in `src/utils/`
- Existing types: `Transaction` in `src/types/transaction.ts`
- Components follow Atomic Design pattern with index exports

### Existing Components to Leverage
| Component | Location | Usage |
|-----------|----------|-------|
| `Card` | `src/atoms/Card.tsx` | Base card styling |
| `Button` | `src/atoms/Button.tsx` | Apply button |
| `Input` | `src/atoms/Input.tsx` | Form input patterns |
| `Select` | `src/atoms/Select.tsx` | Dropdown pattern |
| `Divider` | `src/atoms/Divider.tsx` | Section dividers |
| `ChevronIcon` | `src/atoms/ChevronIcon.tsx` | Expand/collapse |
| `SidebarNavItem` | `src/molecules/SidebarNavItem.tsx` | Already supports children |
| `HideBalancesToggle` | `src/molecules/HideBalancesToggle.tsx` | Balance toggle |
| `TransactionItem` | `src/molecules/TransactionItem.tsx` | Transaction display |
| `formatCurrency` | `src/utils/formatCurrency.ts` | Currency formatting |
| `Transaction` type | `src/types/transaction.ts` | Transaction interface |

---

## Phase 1: Foundation - Types, Utils, and Sidebar (Day 1 Morning)

### Step 1.1: Create Product Types
**File**: `src/types/products.ts`

```typescript
// Product types
export type ProductType = 'aportes' | 'ahorros' | 'inversiones' | 'proteccion' | 'coaspocket';

// Aportes-specific types
export interface AportesProduct {
  planName: string;
  productNumber: string;
  totalBalance: number;
  paymentDeadline: string;
  detalleAportes: ProductDetail;
  detalleFondos: ProductDetail;
}

export interface ProductDetail {
  vigentes: number;
  enMora: number;
  fechaCubrimiento: string;
}

// Month option for reports
export interface MonthOption {
  value: string;
  label: string;
}

// Date range filter
export interface DateRangeFilter {
  startDate: string;
  endDate: string;
}
```

**Update**: `src/types/index.ts` - Add export for products types

### Step 1.2: Create Date Utilities
**File**: `src/utils/dates.ts`

```typescript
/**
 * Format date for display (Spanish locale)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Generate month options for last N months
 */
export function generateMonthOptions(count: number = 12): MonthOption[] {
  // ... implementation
}

/**
 * Check if date range is within allowed months
 */
export function isValidDateRange(startDate: string, endDate: string, maxMonths: number = 3): boolean {
  // ... implementation
}

/**
 * Get date N months ago from today
 */
export function getDateMonthsAgo(months: number): string {
  // ... implementation
}
```

**Update**: `src/utils/index.ts` - Add export for dates

### Step 1.3: Add maskNumber to Currency Utils
**File**: `src/utils/formatCurrency.ts` - Add function

```typescript
/**
 * Mask account/product number
 */
export function maskNumber(number: string, visibleDigits = 4): string {
  if (number.length <= visibleDigits) return number;
  return `***${number.slice(-visibleDigits)}`;
}
```

### Step 1.4: Create SidebarSubItem Molecule
**File**: `src/molecules/SidebarSubItem.tsx`

Sub-navigation link for sidebar accordion menus.

```typescript
interface SidebarSubItemProps {
  label: string;
  href: string;
  isActive?: boolean;
}
```

**Styling**:
- Font: text-[15px] font-bold text-white
- Padding: px-4 py-2
- Left margin: ml-8 (indented from parent)
- Hover: hover:bg-white/10
- Active: bg-brand-primary rounded-lg

**Update**: `src/molecules/index.ts` - Add export

### Step 1.5: Update Sidebar with Product Sub-Items
**File**: `src/organisms/Sidebar.tsx`

Add product sub-items to the Productos menu item:

```typescript
const productSubItems = [
  { label: 'Aportes', href: '/productos/aportes' },
  { label: 'Ahorros', href: '/productos/ahorros' },
  { label: 'Inversiones', href: '/productos/inversiones' },
  { label: 'Protección', href: '/productos/proteccion' },
  { label: 'Coaspocket', href: '/productos/coaspocket' },
];
```

Update the Productos `SidebarNavItem` to render children when expanded.

---

## Phase 2: Atoms - DateInput and BackButton (Day 1 Afternoon)

### Step 2.1: Create DateInput Atom
**File**: `src/atoms/DateInput.tsx`

Date input field with calendar icon styling.

```typescript
interface DateInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}
```

**Implementation Notes**:
- Use native `<input type="date">`
- Match existing Input atom styling (h-11, border-[#B1B1B1], rounded-[6px])
- Calendar icon appears automatically with type="date"
- Customize date picker appearance with CSS where possible

**Styling**:
```css
/* Height and padding */
h-11 px-3

/* Border - reuse from Input atom */
border border-[#B1B1B1] rounded-[6px]

/* Focus state */
focus:border-2 focus:border-brand-primary focus:outline-none

/* Error state */
border-2 border-red-600

/* Placeholder text color */
text-[#6A717F] when empty
```

**Update**: `src/atoms/index.ts` - Add export

### Step 2.2: Create BackButton Atom
**File**: `src/atoms/BackButton.tsx`

Left arrow button for back navigation.

```typescript
interface BackButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
}
```

**Implementation Notes**:
- Use Next.js `Link` when `href` provided
- Use `button` when `onClick` provided
- Arrow icon: Use SVG or Unicode arrow (←)
- Size: 24px

**Styling**:
```css
/* Size */
w-6 h-6

/* Color */
text-black

/* Hover */
hover:opacity-70 transition-opacity

/* Cursor */
cursor-pointer
```

**Update**: `src/atoms/index.ts` - Add export

---

## Phase 3: Molecules - Page Header and Filters (Day 2 Morning)

### Step 3.1: Create Breadcrumbs Molecule
**File**: `src/molecules/Breadcrumbs.tsx`

Navigation breadcrumb trail.

```typescript
interface BreadcrumbsProps {
  items: string[];
  separator?: string;
  className?: string;
}
```

**Styling**:
- Font: text-[15px] font-normal (regular weight)
- Last item: font-medium
- Separator: " / " with spacing
- Color: text-black

**Update**: `src/molecules/index.ts` - Add export

### Step 3.2: Create ProductPageHeader Molecule
**File**: `src/molecules/ProductPageHeader.tsx`

Consistent header for all product pages.

```typescript
interface ProductPageHeaderProps {
  title: string;
  backHref?: string;
  breadcrumbs: string[];
  showHideBalances?: boolean;
}
```

**Layout**:
```
[BackButton] Title                    [HideBalancesToggle]
Breadcrumbs
```

**Implementation Notes**:
- Use BackButton atom
- Use Breadcrumbs molecule
- Use existing HideBalancesToggle molecule
- Responsive: Stack on mobile if needed

**Update**: `src/molecules/index.ts` - Add export

### Step 3.3: Create DateRangeFilter Molecule
**File**: `src/molecules/DateRangeFilter.tsx`

Two date inputs with apply button.

```typescript
interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApply: () => void;
  maxRangeMonths?: number;
  helperText?: string;
  disabled?: boolean;
  className?: string;
}
```

**Layout**:
```
Filtrar: [DateInput] [DateInput] [Button: Aplicar]
         Helper text below
```

**Styling**:
- Label "Filtrar:": text-[14px] text-[#6A717F]
- Apply button: Use Button atom with outline variant
- Helper text: text-[12px] text-[#9AA1AD]
- Gap between elements: gap-3
- Responsive: Stack vertically on mobile

**Update**: `src/molecules/index.ts` - Add export

---

## Phase 4: Organisms - Cards (Day 2 Afternoon - Day 3 Morning)

### Step 4.1: Create AportesInfoCard Organism
**File**: `src/organisms/AportesInfoCard.tsx`

Product information card specific to Aportes.

```typescript
interface AportesInfoCardProps {
  planName: string;
  productNumber: string;
  totalBalance: number;
  paymentDeadline: string;
  detalleAportes: ProductDetail;
  detalleFondos: ProductDetail;
  className?: string;
}
```

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│ Plan 2 Senior                                               │
│ ───────────────────────────────────────────────────────────│
│ [Column 1]         │ [Column 2]        │ [Column 3]         │
│ Número: ***5488    │ Detalle Aportes   │ Detalle Fondos     │
│ Saldo: $ 890.058   │ Vigentes: $500k   │ Vigentes: $390k    │
│ Fecha: 15 Nov 2025 │ En mora: $0       │ En mora: $0        │
│                    │ Fecha: 31 Dic     │ Fecha: 31 Dic      │
└─────────────────────────────────────────────────────────────┘
```

**Implementation Notes**:
- Use Card atom as wrapper
- Integrate with UIContext for hideBalances
- Use formatCurrency from utils
- Use maskNumber for product number
- Use formatDate for dates
- Three-column grid on desktop, stack on mobile

**Styling**:
- Card: bg-white rounded-2xl p-6
- Title: text-[20px] font-bold text-brand-navy
- Divider: Use Divider atom
- Labels: text-[14px] text-[#6A717F]
- Values: text-[14px] font-medium text-black
- Total balance: text-[18px] font-bold text-brand-navy
- "En mora" when > 0: text-[15px] font-bold text-red-600
- Detail headers: text-[14px] font-medium text-brand-navy (underline on hover)

**Responsive**:
```css
/* Mobile */
grid-cols-1

/* Tablet */
md:grid-cols-2 (general info full width, details side by side)

/* Desktop */
lg:grid-cols-[40%_30%_30%]
```

**Update**: `src/organisms/index.ts` - Add export

### Step 4.2: Create TransactionHistoryCard Organism
**File**: `src/organisms/TransactionHistoryCard.tsx`

Reusable card displaying transaction list with date filter.

```typescript
interface TransactionHistoryCardProps {
  title: string;
  subtitle?: string;
  transactions: Transaction[];
  onFilter: (startDate: string, endDate: string) => void;
  maxRangeMonths?: number;
  loading?: boolean;
  className?: string;
}
```

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│ Title                                                       │
│ Subtitle                                                    │
│                                                             │
│ [DateRangeFilter]                                           │
│                                                             │
│ ───────────────────────────────────────────────────────────│
│                                                             │
│ [Transaction List or Empty State]                           │
│                                                             │
│ ───────────────────────────────────────────────────────────│
└─────────────────────────────────────────────────────────────┘
```

**Implementation Notes**:
- Use Card atom as wrapper
- Use DateRangeFilter molecule
- Use Divider atom
- Use existing TransactionItem molecule for list items
- Empty state when no transactions

**Styling**:
- Card: bg-white rounded-2xl p-6
- Title: text-[19px] font-bold text-brand-navy
- Subtitle: text-[14px] text-[#6A717F]
- Empty state: text-[16px] text-[#6A717F] text-center py-8

**Update**: `src/organisms/index.ts` - Add export

### Step 4.3: Create DownloadReportsCard Organism
**File**: `src/organisms/DownloadReportsCard.tsx`

Reusable card for downloading monthly statements.

```typescript
interface DownloadReportsCardProps {
  title?: string;
  description?: string;
  availableMonths: MonthOption[];
  selectedMonth?: string;
  onMonthChange: (month: string) => void;
  onDownload?: () => void;
  loading?: boolean;
  className?: string;
}
```

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│ Descargar extractos                                         │
│                                                             │
│ Selecciona el mes que deseas consultar para descargar tu    │
│ extracto en formato PDF.                                    │
│                                                             │
│ [Select dropdown: Diciembre de 2025 ▼]                      │
└─────────────────────────────────────────────────────────────┘
```

**Implementation Notes**:
- Use Card atom as wrapper
- Use Select atom for month dropdown
- Default title: "Descargar extractos"
- Default description: "Selecciona el mes que deseas consultar para descargar tu extracto en formato PDF."

**Styling**:
- Card: bg-white rounded-2xl p-6
- Title: text-[19px] font-bold text-brand-navy
- Description: text-[14px] text-[#6A717F] mb-4
- Select: Full width

**Update**: `src/organisms/index.ts` - Add export

---

## Phase 5: Mock Data (Day 3 Morning)

### Step 5.1: Create Aportes Mock Data
**File**: `src/mocks/aportes.ts`

```typescript
import { AportesProduct, MonthOption } from '@/src/types/products';
import { Transaction } from '@/src/types/transaction';
import { generateMonthOptions } from '@/src/utils/dates';

export const mockAportesData: AportesProduct = {
  planName: 'Plan 2 Senior',
  productNumber: '5488',
  totalBalance: 890058,
  paymentDeadline: '2025-11-15',
  detalleAportes: {
    vigentes: 500058,
    enMora: 0,
    fechaCubrimiento: '2025-12-31',
  },
  detalleFondos: {
    vigentes: 390000,
    enMora: 0,
    fechaCubrimiento: '2025-12-31',
  },
};

export const mockTransactions: Transaction[] = [];

export const mockAvailableMonths: MonthOption[] = generateMonthOptions(12);
```

### Step 5.2: Create Mocks Index
**File**: `src/mocks/index.ts`

```typescript
export * from './aportes';
```

---

## Phase 6: Pages (Day 3 Afternoon)

### Step 6.1: Create Products Index Page
**File**: `app/(authenticated)/productos/page.tsx`

Redirects to first product or shows product overview.

```typescript
import { redirect } from 'next/navigation';

export default function ProductosPage() {
  // Redirect to Aportes by default
  redirect('/productos/aportes');
}
```

### Step 6.2: Create Aportes Page
**File**: `app/(authenticated)/productos/aportes/page.tsx`

Main Aportes product page.

```typescript
'use client';

import { useState } from 'react';
import { ProductPageHeader } from '@/src/molecules';
import {
  AportesInfoCard,
  TransactionHistoryCard,
  DownloadReportsCard,
} from '@/src/organisms';
import { mockAportesData, mockTransactions, mockAvailableMonths } from '@/src/mocks';
import { maskNumber } from '@/src/utils';

export default function AportesPage() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [selectedMonth, setSelectedMonth] = useState(mockAvailableMonths[0]?.value);

  const handleFilter = (startDate: string, endDate: string) => {
    // TODO: Call API to filter transactions
    console.log('Filtering:', startDate, endDate);
  };

  const handleDownload = () => {
    // TODO: Trigger PDF download
    console.log('Downloading report for:', selectedMonth);
  };

  return (
    <div className="space-y-6">
      <ProductPageHeader
        title="Aportes"
        backHref="/home"
        breadcrumbs={['Inicio', 'Productos', 'Aportes']}
      />

      <AportesInfoCard {...mockAportesData} />

      <TransactionHistoryCard
        title={`Consulta de Movimientos - Cuenta de Ahorros (${maskNumber(mockAportesData.productNumber)})`}
        subtitle="Últimos movimientos registrados."
        transactions={transactions}
        onFilter={handleFilter}
      />

      <DownloadReportsCard
        availableMonths={mockAvailableMonths}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        onDownload={handleDownload}
      />
    </div>
  );
}
```

---

## Phase 7: Polish and Testing (Day 4)

### Step 7.1: Responsive Styles
Review and adjust all components for responsive behavior:

- [ ] ProductPageHeader - Stack title and toggle on mobile
- [ ] DateRangeFilter - Stack date inputs vertically on mobile
- [ ] AportesInfoCard - Three columns → single column on mobile
- [ ] TransactionHistoryCard - Full width on all screens
- [ ] DownloadReportsCard - Full width on all screens
- [ ] Sidebar sub-items - Proper indentation on mobile

### Step 7.2: Loading States
Add loading states to:

- [ ] TransactionHistoryCard - Skeleton loader for transaction list
- [ ] DownloadReportsCard - Loading spinner on download button

### Step 7.3: Empty States
Verify empty states:

- [ ] TransactionHistoryCard - "No se encontraron movimientos" message
- [ ] Transaction list when filtered returns nothing

### Step 7.4: Integration Testing
- [ ] Sidebar accordion expands/collapses Products menu
- [ ] Sub-items navigate correctly
- [ ] Active state shows on current page
- [ ] Back button navigates to home
- [ ] Breadcrumbs display correctly
- [ ] "Ocultar saldos" toggle masks all amounts
- [ ] Date range filter accepts valid dates
- [ ] Month dropdown shows correct options

### Step 7.5: Accessibility Check
- [ ] All form inputs have labels
- [ ] Focus states visible
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility

---

## File Checklist

### Types
- [ ] `src/types/products.ts` - New file
- [ ] `src/types/index.ts` - Update exports

### Utils
- [ ] `src/utils/dates.ts` - New file
- [ ] `src/utils/formatCurrency.ts` - Add maskNumber function
- [ ] `src/utils/index.ts` - Update exports

### Atoms
- [ ] `src/atoms/DateInput.tsx` - New file
- [ ] `src/atoms/BackButton.tsx` - New file
- [ ] `src/atoms/index.ts` - Update exports

### Molecules
- [ ] `src/molecules/SidebarSubItem.tsx` - New file
- [ ] `src/molecules/Breadcrumbs.tsx` - New file
- [ ] `src/molecules/ProductPageHeader.tsx` - New file
- [ ] `src/molecules/DateRangeFilter.tsx` - New file
- [ ] `src/molecules/index.ts` - Update exports

### Organisms
- [ ] `src/organisms/Sidebar.tsx` - Update with sub-items
- [ ] `src/organisms/AportesInfoCard.tsx` - New file
- [ ] `src/organisms/TransactionHistoryCard.tsx` - New file
- [ ] `src/organisms/DownloadReportsCard.tsx` - New file
- [ ] `src/organisms/index.ts` - Update exports

### Mocks
- [ ] `src/mocks/aportes.ts` - New file
- [ ] `src/mocks/index.ts` - New file

### Pages
- [ ] `app/(authenticated)/productos/page.tsx` - New file
- [ ] `app/(authenticated)/productos/aportes/page.tsx` - New file

---

## Time Estimates

| Phase | Description | Estimated Time |
|-------|-------------|----------------|
| Phase 1 | Foundation (Types, Utils, Sidebar) | 2-3 hours |
| Phase 2 | Atoms (DateInput, BackButton) | 1-2 hours |
| Phase 3 | Molecules (Header, Filters) | 2-3 hours |
| Phase 4 | Organisms (3 Cards) | 4-5 hours |
| Phase 5 | Mock Data | 30 minutes |
| Phase 6 | Pages | 1-2 hours |
| Phase 7 | Polish & Testing | 2-3 hours |
| **Total** | | **~14-18 hours (3-4 days)** |

---

## Dependencies Graph

```
Phase 1: Types & Utils
    ↓
Phase 2: Atoms (DateInput, BackButton)
    ↓
Phase 3: Molecules (uses Atoms)
    ↓
Phase 4: Organisms (uses Molecules)
    ↓
Phase 5: Mock Data (uses Types)
    ↓
Phase 6: Pages (uses everything)
    ↓
Phase 7: Polish
```

---

## Post-Implementation

### Update Index Exports
After creating new files, update all index.ts files:

1. `src/atoms/index.ts`
2. `src/molecules/index.ts`
3. `src/organisms/index.ts`
4. `src/types/index.ts`
5. `src/utils/index.ts`
6. `src/mocks/index.ts` (new)

### Future Product Pages
The following pages will reuse components from this feature:

| Page | Reuses |
|------|--------|
| `/productos/ahorros` | TransactionHistoryCard, DownloadReportsCard, ProductPageHeader |
| `/productos/inversiones` | TransactionHistoryCard, DownloadReportsCard, ProductPageHeader |
| `/productos/proteccion` | ProductPageHeader, custom info card |
| `/productos/coaspocket` | TransactionHistoryCard, DownloadReportsCard, ProductPageHeader |

---

## References

- **Feature Spec**: [spec.md](./spec.md)
- **Design References**: [references.md](./references.md)
- **Figma Design**: [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=607-5)
- **Design System**: `.claude/design-system.md`
- **Coding Standards**: `.claude/coding-standards.md`

---

**Last Updated**: 2025-12-18
**Status**: Ready for Implementation
