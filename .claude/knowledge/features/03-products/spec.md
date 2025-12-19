# Feature: Products (03-products)

**Status**: Planning
**Priority**: Must Have
**Feature Number**: 03
**Last Updated**: 2025-12-18

---

## Overview

The **Products** feature provides authenticated users access to their financial products through a sidebar accordion menu. The initial implementation focuses on the **Aportes** (contributions) page, which displays product information, transaction history, and downloadable reports.

**Key Purpose**:
- Navigate to different product types via sidebar accordion
- View detailed product information (Aportes-specific)
- Filter and view transaction history
- Download monthly PDF reports/statements

---

## User Stories

### US-03.1: Products Navigation
**As an** authenticated user
**I want** to access different product pages from the sidebar
**So that** I can view details for each of my financial products

**Acceptance Criteria**:
- [ ] Clicking "Productos" in sidebar expands accordion menu
- [ ] Accordion shows: Aportes, Ahorros, Inversiones, Protección, Coaspocket
- [ ] Clicking a sub-item navigates to `/productos/{product-name}`
- [ ] Active product is visually highlighted
- [ ] Accordion state persists during session

### US-03.2: Aportes Product Information
**As an** authenticated user
**I want** to view my Aportes product details
**So that** I can see my balance, payment deadlines, and status

**Acceptance Criteria**:
- [ ] Page displays at `/productos/aportes`
- [ ] Shows plan name and product number (masked)
- [ ] Shows total balance (respects "Ocultar saldos" toggle)
- [ ] Shows payment deadline date
- [ ] Shows "Detalle Aportes" with vigentes, en mora, fecha cubrimiento
- [ ] Shows "Detalle Fondos" with vigentes, en mora, fecha cubrimiento
- [ ] "En mora" amounts display in red when > 0

### US-03.3: Transaction History Filtering
**As an** authenticated user
**I want** to filter transaction history by date range
**So that** I can find specific transactions

**Acceptance Criteria**:
- [ ] Date range filter with start and end date inputs
- [ ] Maximum range limited to 3 months
- [ ] "Aplicar" button triggers filter
- [ ] Helper text explains 3-month limit
- [ ] Shows transactions matching filter
- [ ] Shows empty state when no transactions found

### US-03.4: Download Monthly Reports
**As an** authenticated user
**I want** to download monthly statements
**So that** I can keep records of my account activity

**Acceptance Criteria**:
- [ ] Month dropdown shows available months
- [ ] Selecting month triggers PDF download
- [ ] Shows at least last 12 months
- [ ] Clear description of functionality

---

## Technical Approach

### Routes

| Path | Description |
|------|-------------|
| `/productos` | Index page (redirects to first product or shows overview) |
| `/productos/aportes` | Aportes product detail page |
| `/productos/ahorros` | Ahorros page (future) |
| `/productos/inversiones` | Inversiones page (future) |
| `/productos/proteccion` | Protección page (future) |
| `/productos/coaspocket` | Coaspocket page (future) |

### File Structure

```
app/(authenticated)/productos/
├── page.tsx                    # Index - redirect or overview
├── aportes/
│   └── page.tsx               # Aportes product page

src/
├── atoms/
│   ├── DateInput.tsx          # Date picker input with calendar icon
│   ├── BackButton.tsx         # Back navigation arrow
│   └── index.ts               # Update exports
├── molecules/
│   ├── ProductPageHeader.tsx  # Page header with back, title, breadcrumbs
│   ├── Breadcrumbs.tsx        # Breadcrumb navigation
│   ├── DateRangeFilter.tsx    # Start/end date filter with apply
│   ├── SidebarSubItem.tsx     # Sub-navigation item for accordion
│   └── index.ts               # Update exports
├── organisms/
│   ├── Sidebar.tsx            # Update with product sub-items
│   ├── TransactionHistoryCard.tsx  # Reusable transaction list
│   ├── DownloadReportsCard.tsx     # Reusable report download
│   ├── AportesInfoCard.tsx         # Aportes-specific info card
│   └── index.ts               # Update exports
├── types/
│   └── products.ts            # Product-related TypeScript types
└── utils/
    └── currency.ts            # Currency formatting utilities
```

---

## Component Specifications

### Atoms

#### DateInput
Date input field with calendar icon for date selection.

```typescript
interface DateInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;        // Default: "dd/mm/yyyy"
  min?: string;                // Minimum selectable date
  max?: string;                // Maximum selectable date (today)
  disabled?: boolean;
  error?: string;
  className?: string;
}
```

**Styling**:
- Height: `44px` (h-11)
- Border: `1px solid #B1B1B1`
- Border radius: `6px`
- Padding: `12px`
- Calendar icon on right side
- Focus: `2px solid #007FFF`

#### BackButton
Arrow button for back navigation.

```typescript
interface BackButtonProps {
  href?: string;               // Navigate to URL
  onClick?: () => void;        // Or handle click
  className?: string;
}
```

**Styling**:
- Left-pointing arrow icon
- Size: `24px`
- Color: black
- Hover: opacity change

---

### Molecules

#### ProductPageHeader
Consistent header for all product pages.

```typescript
interface ProductPageHeaderProps {
  title: string;               // "Aportes"
  backHref?: string;           // "/home" - where back arrow navigates
  breadcrumbs: string[];       // ["Inicio", "Productos", "Aportes"]
  showHideBalances?: boolean;  // Default: true
}
```

**Layout**:
```
[←] Aportes                                    [Ocultar saldos toggle]
Inicio / Productos / Aportes
```

**Styling**:
- Title: Ubuntu Medium, 20px, black
- Breadcrumbs: Ubuntu Regular, 15px, black (last item: Medium)
- Gap between back arrow and title: 12px
- Vertical gap to breadcrumbs: 8px

#### Breadcrumbs
Navigation breadcrumb trail.

```typescript
interface BreadcrumbsProps {
  items: string[];             // ["Inicio", "Productos", "Aportes"]
  separator?: string;          // Default: "/"
  className?: string;
}
```

**Styling**:
- Items separated by " / "
- All items except last: Regular weight, clickable (future)
- Last item: Medium weight, not clickable
- Font: Ubuntu, 15px, black

#### DateRangeFilter
Two date inputs with apply button.

```typescript
interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApply: () => void;
  maxRangeMonths?: number;     // Default: 3
  helperText?: string;         // Override default helper
  disabled?: boolean;
  className?: string;
}
```

**Layout**:
```
Filtrar: [dd/mm/2025 📅] [dd/mm/2025 📅] [Aplicar]
         El filtro de fecha solo permite un rango de los últimos 3 meses.
```

**Styling**:
- Label "Filtrar:": Gray #6A717F, 14px
- Date inputs: See DateInput atom
- Apply button: Black text, rounded border, 14px medium
- Helper text: Light gray #9AA1AD, 12px

#### SidebarSubItem
Sub-navigation link for sidebar accordion.

```typescript
interface SidebarSubItemProps {
  label: string;               // "Aportes"
  href: string;                // "/productos/aportes"
  isActive?: boolean;
}
```

**Styling**:
- Font: Ubuntu Bold, 15px, white
- Padding: `8px 16px`
- Left margin: `32px` (indented from parent)
- Hover: `bg-white/10`
- Active: `bg-brand-primary`

---

### Organisms

#### TransactionHistoryCard
Reusable card displaying transaction list with date filter.

```typescript
interface TransactionHistoryCardProps {
  title: string;               // "Consulta de Movimientos - Cuenta de Ahorros (***4428)"
  subtitle?: string;           // "Últimos movimientos registrados."
  transactions: Transaction[];
  onFilter: (startDate: string, endDate: string) => void;
  maxRangeMonths?: number;     // Default: 3
  loading?: boolean;
  className?: string;
}

interface Transaction {
  id: string;
  date: string;                // ISO date string
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  reference?: string;
}
```

**Layout**:
```
┌─────────────────────────────────────────────────────────────────┐
│ Consulta de Movimientos - Cuenta de Ahorros (***4428)           │
│ Últimos movimientos registrados.                                │
│                                                                 │
│ Filtrar: [dd/mm/2025] [dd/mm/2025] [Aplicar]                   │
│          El filtro de fecha solo permite un rango de 3 meses.   │
│                                                                 │
│ ─────────────────────────────────────────────────────────────── │
│                                                                 │
│ [Transaction List or Empty State]                               │
│                                                                 │
│ ─────────────────────────────────────────────────────────────── │
└─────────────────────────────────────────────────────────────────┘
```

**Empty State**:
- Message: "No se encontraron movimientos en el período seleccionado."
- Font: Ubuntu Regular, 16px, gray #6A717F
- Centered in card

**Transaction Item** (when transactions exist):
- Date: 14px, gray
- Description: 14px, black
- Amount: 14px, medium, green (credit) or red (debit)

**Styling**:
- White background
- Border radius: 16px
- Padding: 24px
- Title: Ubuntu Bold, 19px, navy #194E8D
- Subtitle: Ubuntu Regular, 14px, gray #6A717F
- Divider: 1px solid #E4E6EA

#### DownloadReportsCard
Reusable card for downloading monthly statements.

```typescript
interface DownloadReportsCardProps {
  title?: string;              // Default: "Descargar extractos"
  description?: string;        // Default: "Selecciona el mes..."
  availableMonths: MonthOption[];
  selectedMonth?: string;
  onMonthChange: (month: string) => void;
  onDownload?: () => void;     // If separate download button needed
  loading?: boolean;
  className?: string;
}

interface MonthOption {
  value: string;               // "2025-12"
  label: string;               // "Diciembre de 2025"
}
```

**Layout**:
```
┌─────────────────────────────────────────────────────────────────┐
│ Descargar extractos                                             │
│                                                                 │
│ Selecciona el mes que deseas consultar para descargar tu        │
│ extracto en formato PDF.                                        │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────┐     │
│ │ Diciembre de 2025                                    ▼  │     │
│ └─────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

**Styling**:
- White background
- Border radius: 16px
- Padding: 24px
- Title: Ubuntu Bold, 19px, navy #194E8D
- Description: Ubuntu Regular, 14px, gray #6A717F
- Dropdown: Full width, border #B1B1B1, height 44px

#### AportesInfoCard
Product information card specific to Aportes.

```typescript
interface AportesInfoCardProps {
  planName: string;            // "Plan 2 Senior"
  productNumber: string;       // "***5488"
  totalBalance: number;        // 890058
  paymentDeadline: string;     // "15 Nov 2025"
  detalleAportes: {
    vigentes: number;
    enMora: number;
    fechaCubrimiento: string;
  };
  detalleFondos: {
    vigentes: number;
    enMora: number;
    fechaCubrimiento: string;
  };
  className?: string;
}
```

**Layout**:
```
┌─────────────────────────────────────────────────────────────────┐
│ Plan 2 Senior                                                   │
│ ─────────────────────────────────────────────────────────────── │
│                                                                 │
│ Número de producto:    ***5488    │ Detalle Aportes  │ Detalle Fondos │
│ Saldo total aportes:   $ 890.058  │ Vigentes: $500.058│ Vigentes: $390.000│
│ Fecha límite de pago:  15 Nov 2025│ En mora: $0       │ En mora: $0       │
│                                   │ Fecha cub: 31 Dic │ Fecha cub: 31 Dic │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Styling**:
- White background, border radius 16px, padding 24px
- Plan name: Ubuntu Bold, 20px, navy #194E8D
- Divider below plan name: 1px solid #E4E6EA
- Labels: Ubuntu Regular, 14px, gray #6A717F
- Values: Ubuntu Medium, 14px, black
- Total balance: Ubuntu Bold, 18px, navy #194E8D
- "En mora" when > 0: Ubuntu Bold, 15px, red #FF0000
- "Detalle Aportes/Fondos": Ubuntu Medium, 14px, navy (link style)

**Three-Column Grid**:
- Column 1: General info (40% width)
- Column 2: Detalle Aportes (30% width)
- Column 3: Detalle Fondos (30% width)
- Responsive: Stack on mobile

---

## Sidebar Update Specification

The existing `Sidebar.tsx` needs to be updated to support accordion sub-items.

### Updated Menu Structure

```typescript
const productSubItems = [
  { label: 'Aportes', href: '/productos/aportes' },
  { label: 'Ahorros', href: '/productos/ahorros' },
  { label: 'Inversiones', href: '/productos/inversiones' },
  { label: 'Protección', href: '/productos/proteccion' },
  { label: 'Coaspocket', href: '/productos/coaspocket' },
];

// In Sidebar component, update Productos item:
<SidebarNavItem
  label="Productos"
  href="/productos"
  icon="/icons/products.svg"
  isActive={pathname?.startsWith('/productos')}
  expandable={true}
  isExpanded={sidebarExpanded['productos']}
  onToggle={() => toggleSidebarItem('productos')}
>
  {productSubItems.map((item) => (
    <SidebarSubItem
      key={item.href}
      label={item.label}
      href={item.href}
      isActive={pathname === item.href}
    />
  ))}
</SidebarNavItem>
```

### SidebarNavItem Update

The existing `SidebarNavItem` component already supports `children` prop but doesn't render them. Verify the component renders children when expanded.

---

## TypeScript Types

### File: `src/types/products.ts`

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

// Transaction types
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  reference?: string;
  balance?: number;
}

// Month option for reports
export interface MonthOption {
  value: string;  // "2025-12"
  label: string;  // "Diciembre de 2025"
}

// Filter state
export interface DateRangeFilter {
  startDate: string;
  endDate: string;
}
```

---

## Utility Functions

### File: `src/utils/currency.ts`

```typescript
/**
 * Format number as Colombian Peso currency
 * @example formatCurrency(890058) => "$ 890.058"
 */
export function formatCurrency(amount: number): string {
  return `$ ${amount.toLocaleString('es-CO')}`;
}

/**
 * Mask account/product number
 * @example maskNumber("123456789") => "***6789"
 */
export function maskNumber(number: string, visibleDigits = 4): string {
  if (number.length <= visibleDigits) return number;
  return `***${number.slice(-visibleDigits)}`;
}
```

### File: `src/utils/dates.ts`

```typescript
/**
 * Format date for display
 * @example formatDate("2025-11-15") => "15 Nov 2025"
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
  const months: MonthOption[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = date.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });
    // Capitalize first letter
    const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);
    months.push({ value, label: capitalizedLabel });
  }

  return months;
}

/**
 * Check if date range is within allowed months
 */
export function isValidDateRange(startDate: string, endDate: string, maxMonths: number = 3): boolean {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= maxMonths * 31; // Approximate
}
```

---

## Mock Data

### File: `src/mocks/aportes.ts`

```typescript
import { AportesProduct, Transaction, MonthOption } from '@/src/types/products';
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

export const mockTransactions: Transaction[] = [
  // Empty for initial implementation - shows empty state
];

export const mockAvailableMonths: MonthOption[] = generateMonthOptions(12);
```

---

## Page Implementation

### Aportes Page (`app/(authenticated)/productos/aportes/page.tsx`)

```typescript
'use client';

import { useState } from 'react';
import {
  ProductPageHeader,
  AportesInfoCard,
  TransactionHistoryCard,
  DownloadReportsCard,
} from '@/src/organisms';
import { mockAportesData, mockTransactions, mockAvailableMonths } from '@/src/mocks/aportes';
import { maskNumber } from '@/src/utils/currency';

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

## Responsive Design

### Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Single column, stacked cards |
| Tablet | 640-1023px | Two columns for info card |
| Desktop | ≥ 1024px | Three columns for info card |

### AportesInfoCard Responsive

- **Mobile**: Stack all sections vertically
- **Tablet**: General info full width, details side by side
- **Desktop**: Three columns as designed

### DateRangeFilter Responsive

- **Mobile**: Stack date inputs and button vertically
- **Desktop**: Inline as designed

---

## Accessibility Requirements

- All form inputs have associated labels
- Date inputs support keyboard navigation
- Focus states visible on all interactive elements
- Color contrast meets WCAG AA standards
- "En mora" status communicated beyond just color (use icon or text)
- Screen reader announces card titles as headings

---

## Integration with Existing Context

### Hide Balances

The `hideBalances` state from `UIContext` should mask monetary values:

```typescript
const { hideBalances } = useUIContext();

// In components:
{hideBalances ? '$ ••••••' : formatCurrency(amount)}
```

### Sidebar State

The `sidebarExpanded` state already exists in `UIContext`. Use it for the products accordion:

```typescript
const { sidebarExpanded, toggleSidebarItem } = useUIContext();

// Check if products expanded:
const isProductsExpanded = sidebarExpanded['productos'];
```

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Create `DateInput` atom
- [ ] Create `BackButton` atom
- [ ] Create `SidebarSubItem` molecule
- [ ] Update `Sidebar` with product sub-items
- [ ] Create `src/types/products.ts`
- [ ] Create `src/utils/currency.ts`
- [ ] Create `src/utils/dates.ts`

### Phase 2: Molecules
- [ ] Create `Breadcrumbs` molecule
- [ ] Create `ProductPageHeader` molecule
- [ ] Create `DateRangeFilter` molecule

### Phase 3: Organisms
- [ ] Create `AportesInfoCard` organism
- [ ] Create `TransactionHistoryCard` organism
- [ ] Create `DownloadReportsCard` organism

### Phase 4: Page Assembly
- [ ] Create `app/(authenticated)/productos/page.tsx` (index)
- [ ] Create `app/(authenticated)/productos/aportes/page.tsx`
- [ ] Create mock data files
- [ ] Wire up components with mock data

### Phase 5: Polish
- [ ] Add responsive styles
- [ ] Add loading states
- [ ] Add empty states
- [ ] Integrate hideBalances toggle
- [ ] Test accessibility
- [ ] Update atom/molecule/organism index exports

---

## Testing Checklist

### Manual Testing
- [ ] Sidebar accordion expands/collapses
- [ ] Sub-items navigate correctly
- [ ] Active state shows on current page
- [ ] Back button navigates to home
- [ ] Breadcrumbs display correctly
- [ ] Product info displays with correct formatting
- [ ] Currency values format correctly (Colombian peso)
- [ ] "Ocultar saldos" masks all amounts
- [ ] Date range filter accepts valid dates
- [ ] Date filter rejects ranges > 3 months
- [ ] Empty state shows when no transactions
- [ ] Month dropdown lists last 12 months
- [ ] Responsive layout on mobile/tablet/desktop

### Accessibility Testing
- [ ] Keyboard navigation through sidebar
- [ ] Screen reader announces page structure
- [ ] Focus states visible
- [ ] Color contrast passes WCAG AA

---

## Dependencies

### Existing Dependencies (already installed)
- React 19
- Next.js 16 (App Router)
- Tailwind CSS v4

### No New Dependencies Required
- Date inputs use native HTML5 `<input type="date">`
- No external date picker library needed

---

## API Integration (Future)

This spec uses mock data. Future API integration points:

| Endpoint | Purpose |
|----------|---------|
| `GET /balances` | Fetch product balances |
| `GET /movements` | Fetch transaction history |
| `GET /reports/{month}` | Download PDF report |

See `.claude/knowledge/api/README.md` for full API documentation.

---

## Related Features

- **Feature 02-home**: Shares authenticated layout, UIContext
- **Feature 04-ahorros**: Will reuse TransactionHistoryCard, DownloadReportsCard
- **Feature 05-inversiones**: Will reuse TransactionHistoryCard, DownloadReportsCard

---

## References

- [references.md](./references.md) - Design analysis and Figma links
- [Design System](.claude/design-system.md) - Color palette, typography
- [Coding Standards](.claude/coding-standards.md) - Code style guidelines

---

**Feature Owner**: Development Team
**Design Reference**: [Figma - Productos Aportes](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=607-5)
**Estimated Effort**: 3-4 days
**Dependencies**: Feature 02-home (authenticated layout)
