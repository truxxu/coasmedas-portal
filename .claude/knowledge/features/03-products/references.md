# References - Products Feature (03-products)

**Feature**: 03-products
**Last Updated**: 2025-12-18

---

## Design Resources

### UI/UX Design

- **Aportes Page**: [Figma - Productos Aportes](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=607-5)
  - Main products page for "Aportes" (contributions)
  - Shows page structure with 3 main content boxes

### Design Analysis (from Figma)

The Aportes page follows the authenticated layout template and contains:

#### Page Header
- Back arrow + "Aportes" title (Ubuntu Medium, 20px, black)
- Breadcrumb: "Inicio / Productos / Aportes"
- "Ocultar saldos" toggle on the right

#### Box 1: Product Information Card (Plan 2 Senior)
A white card with product details split into 3 columns:

**Left Column - General Info:**
- Title: "Plan 2 Senior" (Ubuntu Bold, 20px, navy #194E8D)
- Número de producto: `***5488`
- Saldo total aportes: `$ 890.058` (Ubuntu Bold, 18px, navy)
- Fecha límite de pago: `15 Nov 2025`

**Middle Column - Detalle Aportes:**
- Header: "Detalle Aportes" (link style, navy, 14px)
- Vigentes: `*$ 500.058` (medium, black)
- En mora: `$ 0` (bold, red #FF0000)
- Fecha cubrimiento: `31 Dic 2025`

**Right Column - Detalle Fondos:**
- Header: "Detalle Fondos" (link style, navy, 14px)
- Vigentes: `$ 390.000`
- En mora: `$ 0` (bold, red)
- Fecha cubrimiento: `31 Dic 2025`

#### Box 2: Transaction History (Reusable Component)
- Title: "Consulta de Movimientos - Cuenta de Ahorros (***4428)" (Ubuntu Bold, 19px, navy)
- Subtitle: "Últimos movimientos registrados." (gray #6A717F)
- **Filter section:**
  - Label: "Filtrar:" (gray)
  - Two date inputs: `dd/mm/2025` with calendar icons
  - "Aplicar" button (black text, rounded border)
  - Helper text: "El filtro de fecha solo permite un rango de los últimos 3 meses."
- Empty state: "No se encontraron movimientos en el período seleccionado."
- Divider line at bottom

#### Box 3: Download Reports (Reusable Component)
- Title: "Descargar extractos" (Ubuntu Bold, 19px, navy)
- Description: "Selecciona el mes que deseas consultar para descargar tu extracto en formato PDF."
- Month dropdown: "Diciembre de 2025" with chevron icon
- Border: `1px solid #B1B1B1`, rounded corners

---

## Color Palette (from design)

| Color | Hex | Usage |
|-------|-----|-------|
| Navy Blue | `#194E8D` | Titles, links, product names |
| Gray Text | `#6A717F` | Labels, descriptions, subtitles |
| Light Gray | `#9AA1AD` | Helper text |
| Red | `#FF0000` | "En mora" amounts |
| Black | `#000000` | Body text, values |
| Border Gray | `#E4E6EA` | Card borders, dividers |
| Input Border | `#B1B1B1` | Form input borders |
| Background | `#F0F9FF` | Light blue page background |
| White | `#FFFFFF` | Card backgrounds |

---

## Typography

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Page Title | Ubuntu | 20px | Medium | Black |
| Breadcrumb | Ubuntu | 15px | Regular/Medium | Black |
| Card Title | Ubuntu | 20px | Bold | Navy #194E8D |
| Section Title | Ubuntu | 19px | Bold | Navy #194E8D |
| Label | Ubuntu | 14px | Regular | Gray #6A717F |
| Value | Ubuntu | 14px | Medium | Black |
| Large Amount | Ubuntu | 18px | Bold | Navy #194E8D |
| Error/Mora | Ubuntu | 15px | Bold | Red |
| Button Text | Ubuntu | 14px | Medium | Black |
| Helper Text | Ubuntu | 12px | Regular | Light Gray #9AA1AD |

---

## Component Structure

### Sidebar Navigation - Products Accordion

The sidebar "Productos" item expands to show product links:

```
Productos (expandable)
├── Aportes
├── Ahorros
├── Inversiones
├── Protección
└── Coaspocket
```

Each sub-item links to `/productos/{product-name}`:
- `/productos/aportes`
- `/productos/ahorros`
- `/productos/inversiones`
- `/productos/proteccion`
- `/productos/coaspocket`

### Reusable Components

#### 1. TransactionHistoryCard (Box 2)
**Reused on**: Aportes, Ahorros, Inversiones, Coaspocket pages

**Props:**
```typescript
interface TransactionHistoryCardProps {
  title: string;           // "Consulta de Movimientos - Cuenta de Ahorros (***4428)"
  subtitle?: string;       // "Últimos movimientos registrados."
  transactions: Transaction[];
  onFilter?: (startDate: Date, endDate: Date) => void;
  maxRangeMonths?: number; // Default: 3
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
}
```

#### 2. DownloadReportsCard (Box 3)
**Reused on**: Aportes, Ahorros, Inversiones, Coaspocket pages

**Props:**
```typescript
interface DownloadReportsCardProps {
  title?: string;          // Default: "Descargar extractos"
  description?: string;    // Default: "Selecciona el mes que deseas consultar..."
  availableMonths: MonthOption[];
  onDownload: (month: MonthOption) => void;
  format?: 'PDF' | 'Excel'; // Default: PDF
}

interface MonthOption {
  value: string;  // "2025-12"
  label: string;  // "Diciembre de 2025"
}
```

#### 3. ProductInfoCard (Aportes-specific)
**Used on**: Aportes page only (other products may have different layouts)

**Props:**
```typescript
interface AportesInfoCardProps {
  planName: string;         // "Plan 2 Senior"
  productNumber: string;    // "***5488"
  totalBalance: number;     // 890058
  paymentDeadline: string;  // "15 Nov 2025"
  aportes: {
    vigentes: number;
    enMora: number;
    fechaCubrimiento: string;
  };
  fondos: {
    vigentes: number;
    enMora: number;
    fechaCubrimiento: string;
  };
}
```

---

## Page Layout Structure

### Aportes Page (`/productos/aportes`)

```tsx
// app/(authenticated)/productos/aportes/page.tsx

export default function AportesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <ProductPageHeader
        title="Aportes"
        breadcrumbs={['Inicio', 'Productos', 'Aportes']}
        backHref="/home"
      />

      {/* Box 1: Product Info */}
      <AportesInfoCard {...aportesData} />

      {/* Box 2: Transaction History (Reusable) */}
      <TransactionHistoryCard
        title="Consulta de Movimientos - Cuenta de Ahorros (***4428)"
        subtitle="Últimos movimientos registrados."
        transactions={transactions}
        onFilter={handleFilter}
      />

      {/* Box 3: Download Reports (Reusable) */}
      <DownloadReportsCard
        availableMonths={months}
        onDownload={handleDownload}
      />
    </div>
  );
}
```

---

## Atomic Design Components

### Atoms (New)
- `DateInput` - Date picker input with calendar icon
- `Badge` - For status indicators

### Molecules (New)
- `ProductPageHeader` - Back button + title + breadcrumb + hide balances toggle
- `DateRangeFilter` - Two date inputs + apply button + helper text
- `MonthSelector` - Dropdown for selecting months

### Organisms (New)
- `TransactionHistoryCard` - Complete transaction list with filter
- `DownloadReportsCard` - Month selector + download functionality
- `AportesInfoCard` - Aportes-specific product info card

---

## File Structure

```
app/(authenticated)/productos/
├── page.tsx                    # Products index/redirect
├── layout.tsx                  # Products layout (optional)
├── aportes/
│   └── page.tsx               # Aportes page
├── ahorros/
│   └── page.tsx               # Ahorros page (future)
├── inversiones/
│   └── page.tsx               # Inversiones page (future)
├── proteccion/
│   └── page.tsx               # Protección page (future)
└── coaspocket/
    └── page.tsx               # Coaspocket page (future)

src/
├── atoms/
│   ├── DateInput.tsx          # Date picker input
│   └── Badge.tsx              # Status badge
├── molecules/
│   ├── ProductPageHeader.tsx  # Page header with breadcrumbs
│   ├── DateRangeFilter.tsx    # Date range filter
│   └── MonthSelector.tsx      # Month dropdown
└── organisms/
    ├── TransactionHistoryCard.tsx  # Reusable transaction box
    ├── DownloadReportsCard.tsx     # Reusable reports box
    └── AportesInfoCard.tsx         # Aportes-specific info
```

---

## Sidebar Updates Required

The Sidebar component needs to be updated to:
1. Pass children to the "Productos" `SidebarNavItem`
2. Render sub-navigation links when expanded

```tsx
// Updated sidebar menuItems structure
const productSubItems = [
  { label: 'Aportes', href: '/productos/aportes' },
  { label: 'Ahorros', href: '/productos/ahorros' },
  { label: 'Inversiones', href: '/productos/inversiones' },
  { label: 'Protección', href: '/productos/proteccion' },
  { label: 'Coaspocket', href: '/productos/coaspocket' },
];
```

---

## Implementation Priority

### Phase 1: Foundation (Sidebar + Atoms)
1. Update Sidebar with Products accordion submenu
2. Create `DateInput` atom
3. Create `ProductPageHeader` molecule

### Phase 2: Reusable Components
1. Create `DateRangeFilter` molecule
2. Create `MonthSelector` molecule
3. Create `TransactionHistoryCard` organism
4. Create `DownloadReportsCard` organism

### Phase 3: Aportes Page
1. Create `AportesInfoCard` organism
2. Create Aportes page (`/productos/aportes`)
3. Wire up with mock data

### Phase 4: Polish
1. Add responsive styles
2. Add loading states
3. Add empty states

---

## Mock Data Examples

### Aportes Product Data
```typescript
const aportesData = {
  planName: 'Plan 2 Senior',
  productNumber: '***5488',
  totalBalance: 890058,
  paymentDeadline: '15 Nov 2025',
  aportes: {
    vigentes: 500058,
    enMora: 0,
    fechaCubrimiento: '31 Dic 2025',
  },
  fondos: {
    vigentes: 390000,
    enMora: 0,
    fechaCubrimiento: '31 Dic 2025',
  },
};
```

### Available Months for Reports
```typescript
const availableMonths = [
  { value: '2025-12', label: 'Diciembre de 2025' },
  { value: '2025-11', label: 'Noviembre de 2025' },
  { value: '2025-10', label: 'Octubre de 2025' },
  // ... last 12 months
];
```

---

## Related Features

- **Feature 02-home**: Uses shared authenticated layout
- **Feature 04-ahorros**: Will use TransactionHistoryCard and DownloadReportsCard
- **Feature 05-inversiones**: Will use TransactionHistoryCard and DownloadReportsCard

---

## Notes

- All text in Spanish (Colombia locale)
- Currency formatting: Colombian Peso with thousand separators (e.g., `$ 890.058`)
- Date format: `dd MMM yyyy` (e.g., "15 Nov 2025")
- The "Ocultar saldos" toggle is already implemented in TopBar, connected via UIContext
- Transaction history filter is limited to last 3 months (as per helper text)
- PDF download functionality will need backend API integration

---

**Last Reviewed**: 2025-12-18
**Status**: Ready for Implementation
