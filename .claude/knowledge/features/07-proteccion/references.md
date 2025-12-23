# References - Protección Feature (07-proteccion)

**Feature**: 07-proteccion
**Last Updated**: 2025-12-22

---

## Design Resources

### UI/UX Design

- **Protección Page**: [Figma - Productos Protección](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=353-318)
  - Main products page for "Protección" (Insurance/Protection policies)
  - Shows page structure with 3 main sections
  - Uses carousel with protection-specific card design

---

## Design Analysis (from Figma)

The Protección page follows the authenticated layout template and contains:

### Page Header

- Back arrow + "Protección" title (Ubuntu Medium, 20px, black)
- Breadcrumb: "Inicio / Productos / Protección"
- "Ocultar saldos" toggle on the right

### Section 1: Product Carousel (PROTECTION-SPECIFIC CARD DESIGN)

**Title**: "Resumen de Pólizas y Seguros" (Ubuntu Bold, 20px, navy #194E8D)

A horizontally scrollable carousel displaying insurance/protection product cards:

#### Carousel Behavior (Same as other products)

- First card is **selected by default** (blue border, white background)
- Unselected cards have gray background
- Navigation arrows on left and right sides
- Dot indicators below cards (• • •)
- Horizontal scroll with overflow hidden
- Gap between cards: ~20px

#### Product Cards - PROTECTION-SPECIFIC DESIGN

**Card 1: Seguro de Vida Grupo Deudores (SELECTED)**

- **Title**: "Seguro de Vida Grupo Deudores" (Ubuntu Medium, 16px, black)
- **Product Number**: "Número de producto: No**\*\***65-9" (Ubuntu Regular, 14px, black)
  - Note: Uses "No" prefix and alphanumeric format (different from other products)
- **Status**: "Activo" (Ubuntu Regular, 15px, green #00A44C)
- **Divider**: 1px solid #E4E6EA
- **Additional Info Section** (below divider):
  - Pago Mínimo: `$ 150.000` (label gray #636363, value blue #194E8D)
  - Fecha Límite de Pago: `30 Nov 2025` (label gray #636363, value black)
  - Pago Total Anual: `$ 1.800.000` (label gray #636363, value blue #194E8D)
- **Border**: 2px solid #194E8D (selected state)
- **Background**: White (selected)

**Card 2: Póliza Exequial Familiar (UNSELECTED)**

- **Title**: "Póliza Exequial Familiar"
- **Product Number**: "Número de producto: No**\*\***12-3"
- **Status**: "Activo" (green)
- **Divider**: 1px solid #B1B1B1
- **Additional Info Section**:
  - Pago Mínimo: `$ 55.000`
  - Fecha Límite de Pago: `25 Nov 2025`
  - Pago Total Anual: `$ 660.000`
- **Border**: 1px solid #E4E6EA (unselected)
- **Background**: #E4E6EA (gray, unselected)

### Section 2: Transaction History (EXISTING COMPONENT)

Reuses `TransactionHistoryCard` from feature 03-products.

- Title: "Consulta de Movimientos - Seguro de Vida Grupo Deudores (No**\*\***65-9)"
- Subtitle: "Últimos movimientos registrados."
- Date range filter with "Aplicar" button
- Helper text: "El filtro de fecha solo permite un rango de los últimos 3 meses."
- Empty state: "No se encontraron movimientos en el período seleccionado."

### Section 3: Download Reports (EXISTING COMPONENT)

Reuses `DownloadReportsCard` from feature 03-products.

- Title: "Descargar extractos"
- Description: "Selecciona el mes que deseas consultar para descargar tu extracto en formato PDF."
- Month dropdown: "Diciembre de 2025"

---

## Color Palette (from design)

| Color                  | Hex       | Usage                                                 |
| ---------------------- | --------- | ----------------------------------------------------- |
| Navy Blue              | `#194E8D` | Section titles, selected card border, monetary values |
| Active Green           | `#00A44C` | "Activo" status                                       |
| Inactive/Cancelled Red | `#FF0000` | "Inactivo" or "Cancelado" status (if applicable)      |
| Gray Text              | `#6A717F` | Labels, subtitles                                     |
| Detail Gray            | `#636363` | Detail labels (Pago Mínimo, etc.)                     |
| Light Gray             | `#9AA1AD` | Helper text                                           |
| Black                  | `#000000` | Body text, card titles, dates                         |
| Border Gray            | `#E4E6EA` | Unselected card borders, dividers                     |
| Border Gray Alt        | `#B1B1B1` | Divider in unselected cards                           |
| Card Background        | `#E4E6EA` | Unselected card background                            |
| Background             | `#F0F9FF` | Light blue page background                            |
| White                  | `#FFFFFF` | Selected card backgrounds                             |

---

## Typography

| Element              | Font   | Size | Weight  | Color         |
| -------------------- | ------ | ---- | ------- | ------------- |
| Page Title           | Ubuntu | 20px | Medium  | Black         |
| Section Title        | Ubuntu | 20px | Bold    | Navy #194E8D  |
| Card Title           | Ubuntu | 16px | Medium  | Black         |
| Product Number       | Ubuntu | 14px | Regular | Black         |
| Status (Activo)      | Ubuntu | 15px | Regular | Green #00A44C |
| Detail Label         | Ubuntu | 14px | Regular | Gray #636363  |
| Detail Value (money) | Ubuntu | 14px | Medium  | Navy #194E8D  |
| Detail Value (date)  | Ubuntu | 14px | Medium  | Black         |
| Transaction Title    | Ubuntu | 19px | Bold    | Navy #194E8D  |

---

## New Component: ProteccionProductCard

### Component Overview

A **new molecule** component for protection/insurance product cards. This card design is similar to `ObligacionProductCard` but with protection-specific fields and different product number formatting.

### Key Differences from Other Product Cards

| Feature        | SavingsProductCard | ObligacionProductCard | InversionProductCard | ProteccionProductCard     |
| -------------- | ------------------ | --------------------- | -------------------- | ------------------------- |
| Balance Label  | "Saldo Total"      | "Saldo a la fecha"    | "Monto del CDAT"     | N/A (no balance)          |
| Has Balance    | Yes                | Yes                   | Yes                  | No                        |
| Status Values  | activo/bloqueado   | al_dia/en_mora        | activo/vencido       | activo/inactivo/cancelado |
| Detail Fields  | None               | 3 fields              | 4 fields             | 3 fields                  |
| Product Prefix | None               | Optional (CR-)        | DTA-                 | No (uses "No" prefix)     |
| Number Format  | \*\*\*1234         | **_1234 or CR-_**1234 | DTA-\*\*\*123        | No**\*\***65-9            |
| Detail Field 1 | -                  | Valor desembolsado    | Tasa E.A.            | Pago Mínimo               |
| Detail Field 2 | -                  | Próximo pago          | Plazo                | Fecha Límite de Pago      |
| Detail Field 3 | -                  | Valor próximo pago    | F. Creación          | Pago Total Anual          |
| Detail Field 4 | -                  | -                     | F. Vencimiento       | -                         |
| Unselected BG  | White              | #F3F4F6               | #E4E6EA              | #E4E6EA                   |

### ProteccionProductCard Props

```typescript
interface ProteccionProductCardProps {
  product: ProteccionProduct;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

interface ProteccionProduct {
  id: string;
  title: string; // "Seguro de Vida Grupo Deudores"
  productNumber: string; // "65-9" (will be masked as No******65-9)
  status: ProteccionStatus; // 'activo' | 'inactivo' | 'cancelado'
  minimumPayment: number; // 150000 (Pago Mínimo)
  paymentDeadline: string; // "2025-11-30" ISO date (Fecha Límite de Pago)
  annualPayment: number; // 1800000 (Pago Total Anual)
}

type ProteccionStatus = "activo" | "inactivo" | "cancelado";
```

### Product Number Masking

The protection products use a unique masking format:

- Input: `"65-9"` or `"12-3"`
- Output: `"No******65-9"` or `"No******12-3"`
- Format: `No` prefix + 6 asterisks + original number

```typescript
// Utility function for protection product number masking
export function maskProteccionNumber(number: string): string {
  return `No******${number}`;
}
```

### Card Layout Structure

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

### Card Styling

```css
/* Base card */
.proteccion-card {
  background: #e4e6ea; /* Unselected - same as Inversiones */
  border-radius: 16px;
  border: 1px solid #e4e6ea;
  padding: 20px;
  min-width: 280px;
  cursor: pointer;
  transition: all 0.2s;
}

/* Selected state */
.proteccion-card--selected {
  background: white;
  border: 2px solid #194e8d;
}

/* Hover state (unselected) */
.proteccion-card:hover:not(.proteccion-card--selected) {
  border-color: #b1b1b1;
}

/* Internal divider */
.proteccion-card__divider {
  border-top: 1px solid #e4e6ea; /* or #B1B1B1 for unselected */
  margin: 12px 0;
}

/* Detail row */
.proteccion-card__detail {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.proteccion-card__detail-label {
  color: #636363;
  font-size: 14px;
}

.proteccion-card__detail-value--money {
  color: #194e8d; /* Navy blue for money */
  font-weight: 500;
  font-size: 14px;
}

.proteccion-card__detail-value--date {
  color: black;
  font-weight: 500;
  font-size: 14px;
}
```

---

## Component Hierarchy (Atomic Design)

### Atoms (Existing - Reuse)

- `CarouselArrow` - Navigation arrow button
- `CarouselDots` - Dot indicators for pagination

### Molecules (New)

- `ProteccionProductCard` - Insurance/protection card for carousel

### Organisms (New)

- `ProteccionCarousel` - Carousel using ProteccionProductCard

### Organisms (Existing - Reuse from previous features)

- `TransactionHistoryCard` - Transaction list with date filter
- `DownloadReportsCard` - Monthly report download

---

## File Structure

```
app/(authenticated)/productos/
├── proteccion/
│   └── page.tsx               # Protección page

src/
├── molecules/
│   ├── ProteccionProductCard.tsx  # NEW: Protection card for carousel
│   └── index.ts                    # Update exports
├── organisms/
│   ├── ProteccionCarousel.tsx      # NEW: Carousel for protection products
│   └── index.ts                    # Update exports
├── types/
│   └── proteccion.ts               # NEW: Protection-related types
└── mocks/
    └── proteccion.ts               # NEW: Mock data for Protección
```

---

## Page Layout Structure

### Protección Page (`/productos/proteccion`)

```tsx
// app/(authenticated)/productos/proteccion/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Breadcrumbs } from "@/src/molecules";
import {
  ProteccionCarousel,
  TransactionHistoryCard,
  DownloadReportsCard,
} from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { ProteccionProduct } from "@/src/types";
import {
  mockProteccionProducts,
  mockProteccionTransactions,
  mockProteccionAvailableMonths,
} from "@/src/mocks";
import { maskProteccionNumber } from "@/src/utils";

export default function ProteccionPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const [selectedProduct, setSelectedProduct] = useState<ProteccionProduct>(
    mockProteccionProducts[0]
  );
  // ... rest of the implementation
}
```

---

## Mock Data Examples

### Protection Products

```typescript
// src/mocks/proteccion.ts
import { ProteccionProduct } from "@/src/types/proteccion";

export const mockProteccionProducts: ProteccionProduct[] = [
  {
    id: "1",
    title: "Seguro de Vida Grupo Deudores",
    productNumber: "65-9",
    status: "activo",
    minimumPayment: 150000,
    paymentDeadline: "2025-11-30",
    annualPayment: 1800000,
  },
  {
    id: "2",
    title: "Póliza Exequial Familiar",
    productNumber: "12-3",
    status: "activo",
    minimumPayment: 55000,
    paymentDeadline: "2025-11-25",
    annualPayment: 660000,
  },
];
```

---

## TypeScript Types

### File: `src/types/proteccion.ts`

```typescript
/**
 * Status of a protection/insurance product
 */
export type ProteccionStatus = "activo" | "inactivo" | "cancelado";

/**
 * Protection/insurance product information for carousel display
 */
export interface ProteccionProduct {
  id: string;
  title: string;
  productNumber: string; // e.g., "65-9" (will be masked as No******65-9)
  status: ProteccionStatus;
  minimumPayment: number; // Pago Mínimo
  paymentDeadline: string; // Fecha Límite de Pago (ISO date)
  annualPayment: number; // Pago Total Anual
}

/**
 * Callback type for protection product selection
 */
export type OnProteccionSelect = (product: ProteccionProduct) => void;
```

---

## Utility Functions

### Product Number Masking for Protection

```typescript
// Add to src/utils/formatCurrency.ts or create new utility

/**
 * Mask protection product number with "No" prefix
 * @example maskProteccionNumber("65-9") => "No******65-9"
 */
export function maskProteccionNumber(number: string): string {
  return `No******${number}`;
}
```

---

## Integration with Existing Components

### Hide Balances

The `hideBalances` state from `UIContext` should mask monetary values in:

- `ProteccionProductCard` - Pago Mínimo, Pago Total Anual
- `TransactionHistoryCard` - Transaction amounts

```typescript
const { hideBalances } = useUIContext();
{
  hideBalances ? maskCurrency() : formatCurrency(minimumPayment);
}
{
  hideBalances ? maskCurrency() : formatCurrency(annualPayment);
}
```

### Transaction History Dynamic Title

Title updates based on selected product:

```typescript
const transactionTitle = useMemo(() => {
  const maskedNumber = maskProteccionNumber(selectedProduct.productNumber);
  return `Consulta de Movimientos - ${selectedProduct.title} (${maskedNumber})`;
}, [selectedProduct]);
```

---

## Sidebar Navigation

Protección is already included in the Products accordion in the sidebar at position 5:

```typescript
const productSubItems = [
  { label: "Aportes", href: "/productos/aportes" },
  { label: "Ahorros", href: "/productos/ahorros" },
  { label: "Obligaciones", href: "/productos/obligaciones" },
  { label: "Inversiones", href: "/productos/inversiones" },
  { label: "Protección", href: "/productos/proteccion" }, // Already exists
  { label: "Coaspocket", href: "/productos/coaspocket" },
];
```

---

## Implementation Priority

### Phase 1: Types and Utilities

1. Create `src/types/proteccion.ts`
2. Add `maskProteccionNumber` utility function
3. Update `src/types/index.ts`
4. Update `src/utils/index.ts`

### Phase 2: New Molecule

1. Create `ProteccionProductCard` molecule

### Phase 3: New Organism

1. Create `ProteccionCarousel` organism

### Phase 4: Mock Data

1. Create `src/mocks/proteccion.ts`
2. Update `src/mocks/index.ts`

### Phase 5: Protección Page

1. Create `app/(authenticated)/productos/proteccion/page.tsx`
2. Wire up with existing TransactionHistoryCard and DownloadReportsCard

### Phase 6: Polish

1. Test responsive behavior
2. Test hide balances integration (2 monetary values)
3. Verify accessibility

---

## Key Implementation Notes

### 1. No Balance Field

Unlike other product cards (Ahorros, Obligaciones, Inversiones), the Protección card does NOT have a main balance field. The card shows:

- Title
- Product number
- Status
- Divider
- Three detail fields (two monetary, one date)

### 2. Unique Product Number Format

- Uses "No" prefix: `No******65-9`
- Includes alphanumeric suffix: `65-9`, `12-3`
- Different from other products which use numeric-only masked numbers

### 3. Two Monetary Values to Mask

When `hideBalances` is enabled, mask:

- Pago Mínimo
- Pago Total Anual

### 4. Monetary Value Color

All monetary values in the detail section use Navy Blue (#194E8D), not the darker blue (#004680) used in Obligaciones.

---

## Related Features

- **Feature 03-products**: Provides `TransactionHistoryCard`, `DownloadReportsCard`
- **Feature 04-ahorros**: Provides `CarouselArrow`, `CarouselDots`, carousel utilities
- **Feature 05-obligaciones**: Similar extended card pattern reference
- **Feature 06-inversiones**: Similar extended card pattern reference

---

## Notes

- All text in Spanish (Colombia locale)
- Currency formatting: Colombian Peso with thousand separators (e.g., `$ 1.800.000`)
- Date format: `dd MMM yyyy` (e.g., "30 Nov 2025")
- The Protección card height is similar to Obligaciones due to similar content structure
- Status colors: Green for "Activo", potentially Red for "Inactivo"/"Cancelado"
- Section title is unique: "Resumen de Pólizas y Seguros" (not "Resumen de...")

---

**Last Reviewed**: 2025-12-22
**Status**: Ready for Implementation
