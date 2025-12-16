# Feature: Home (Dashboard Post-Login)

**Status**: Planning
**Priority**: Must Have
**Feature Number**: 02 (Post-login dashboard)
**Last Updated**: 2025-12-16

---

## Overview

The **Home** page is the main dashboard displayed to authenticated users after successful login. It serves as the central hub for accessing all portal features, viewing account summaries, and performing quick actions.

**Key Purpose**:
- Primary landing page after authentication
- Account balance overview at a glance
- Quick access to main portal features
- Recent transaction history
- Persistent navigation structure for all authenticated pages

**Important**: This feature includes the creation of shared layout components (Sidebar, TopBar, WelcomeBar, SessionFooter) that will be reused across ALL authenticated pages in the portal.

---

## UI Design

**Figma Design**: [Home Dashboard](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=3018-156)

**Design Assets**:
- Bre-B Logo (White): `./attachments/designs/Bre-b-logo-blanco.svg`
- Bre-B Logo (Color): `./attachments/designs/Bre-b-logo-color.svg`

See [references.md](./references.md) for all design resources and implementation guidance.

### Page Structure
1. **Sidebar** (Left, 268px) - Navigation menu (persistent)
2. **Top Bar** (Right top) - User avatar with dropdown (persistent)
3. **Welcome Bar** - "Bienvenido, {nombre}" + hide balances toggle (persistent)
4. **Content Area** - Home-specific content
5. **Session Footer** - Login info and IP (persistent)

---

## User Stories

### US-02.1: Dashboard Access
**As an** authenticated user
**I want** to see my dashboard after logging in
**So that** I can quickly access my account information and portal features

**Acceptance Criteria**:
- [ ] Page loads at `/home` route after successful login
- [ ] Requires authentication (redirect to `/login` if not authenticated)
- [ ] Displays user's first name in welcome message
- [ ] Shows account summary with balance information
- [ ] Responsive design (mobile, tablet, desktop)

### US-02.2: Account Balance View
**As an** authenticated user
**I want** to see my account balance on the dashboard
**So that** I can quickly check my financial status

**Acceptance Criteria**:
- [ ] Displays primary account card (Cuenta de Ahorros)
- [ ] Shows account number (masked: ****4428)
- [ ] Shows "Saldo disponible" (available balance)
- [ ] Shows "Saldo total" (total balance)
- [ ] Includes "Ver Bolsillos" and "Ver Movimientos" action links

### US-02.3: Hide Balances Toggle
**As an** authenticated user
**I want** to hide my balance information
**So that** I can protect my privacy when others might see my screen

**Acceptance Criteria**:
- [ ] Toggle button "Ocultar saldos" visible in welcome bar
- [ ] When active, all monetary amounts show as "****" or dots
- [ ] Preference persists during session (localStorage)
- [ ] Toggle state clearly indicated (icon change)

### US-02.4: Quick Access Navigation
**As an** authenticated user
**I want** to quickly access main portal features
**So that** I can perform common tasks efficiently

**Acceptance Criteria**:
- [ ] 6 quick access cards displayed in 2x3 grid
- [ ] Cards: Productos, Pagos, Transferencias, Bre-B, Otros Servicios, Tarjeta de Crédito
- [ ] Each card shows icon, title, and description
- [ ] Bre-B card has distinctive purple styling
- [ ] Cards are clickable and navigate to respective sections

### US-02.5: Recent Transactions View
**As an** authenticated user
**I want** to see my recent transactions
**So that** I can track my account activity

**Acceptance Criteria**:
- [ ] Section titled "Últimos Movimientos"
- [ ] Shows 5 most recent transactions
- [ ] Each transaction shows: name, date, amount
- [ ] Positive amounts in green with "+" prefix
- [ ] Negative amounts in red with "-" prefix
- [ ] Respects hide balances toggle

### US-02.6: Sidebar Navigation
**As an** authenticated user
**I want** to navigate between portal sections using the sidebar
**So that** I can access different features easily

**Acceptance Criteria**:
- [ ] Sidebar visible on left side (268px width)
- [ ] Coasmedas logo at top
- [ ] Menu items: Inicio, Productos, Pagos, Transferencias, Tarjeta de Crédito, Otros Servicios, Bre-B
- [ ] Expandable items show chevron that rotates on expand
- [ ] Active item highlighted
- [ ] "Cerrar Sesión" link at bottom

### US-02.7: User Avatar Dropdown
**As an** authenticated user
**I want** to access my profile options from the avatar
**So that** I can manage my account settings

**Acceptance Criteria**:
- [ ] Avatar displays user initials (e.g., "CC")
- [ ] Click opens dropdown menu
- [ ] Menu options: Mis Datos Personales, Cambiar Clave del Portal, Ayuda, Cerrar Sesión
- [ ] Each option navigates to respective page or performs action
- [ ] Dropdown closes when clicking outside

### US-02.8: Session Information Display
**As an** authenticated user
**I want** to see my session information
**So that** I can verify my login details and detect unauthorized access

**Acceptance Criteria**:
- [ ] Footer bar shows "Último ingreso" (last login date/time)
- [ ] Shows "Ingreso actual" (current login date/time)
- [ ] Shows "IP" address
- [ ] Information displayed in light gray text

---

## Technical Approach

### Routes
- **Path**: `/home`
- **File**: `app/(authenticated)/home/page.tsx`
- **Type**: Protected route (requires authentication)
- **Layout**: `app/(authenticated)/layout.tsx` (shared authenticated layout)

### Authentication Protection
```typescript
// Middleware or layout-level protection
// Redirect to /login if no valid session
```

### Components (Atomic Design)

#### Atoms (New)
- `Avatar` - User avatar with initials
- `Toggle` - Toggle switch component
- `Badge` - Status badge (for account status)
- `Divider` - Horizontal divider line
- `ChevronIcon` - Expandable indicator

#### Molecules (New)
- `SidebarNavItem` - Navigation menu item (expandable)
- `UserAvatar` - Avatar with initials generation
- `UserDropdown` - Dropdown menu for user options
- `QuickAccessCard` - Feature card with icon and description
- `TransactionItem` - Single transaction row
- `HideBalancesToggle` - Eye icon toggle for hiding balances

#### Organisms (New - Shared Layout)
- `Sidebar` - Complete left navigation sidebar
- `TopBar` - Top bar with user avatar
- `WelcomeBar` - Welcome message and hide balances toggle
- `SessionFooter` - Session info footer bar
- `AuthenticatedLayout` - Main layout wrapper

#### Organisms (New - Home Page Specific)
- `AccountSummaryCard` - Primary account display card
- `QuickAccessGrid` - 2x3 grid of quick access cards
- `RecentTransactions` - Recent transactions list

### Page Structure
```tsx
// app/(authenticated)/layout.tsx
export default function AuthenticatedLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <WelcomeBar />
        <main className="flex-1 bg-brand-light-blue p-8">
          {children}
        </main>
        <SessionFooter />
      </div>
    </div>
  );
}

// app/(authenticated)/home/page.tsx
export default function HomePage() {
  return (
    <>
      <AccountSummaryCard />
      <QuickAccessGrid />
      <RecentTransactions />
    </>
  );
}
```

### State Management

#### User Context
```typescript
interface UserContextType {
  user: {
    firstName: string;
    lastName: string;
    documentType: string;
    documentNumber: string;
  } | null;
  session: {
    lastLogin: Date;
    currentLogin: Date;
    ipAddress: string;
  } | null;
}
```

#### UI State Context
```typescript
interface UIContextType {
  hideBalances: boolean;
  setHideBalances: (value: boolean) => void;
  sidebarExpanded: Record<string, boolean>;
  toggleSidebarItem: (itemId: string) => void;
}
```

### Styling
- Use Tailwind CSS v4
- Follow theme variables from `app/globals.css` and `.claude/design-system.md`
- Sidebar: Navy blue background (`#1D4E8F`)
- Content area: Light blue background (`#F0F9FF`)
- Cards: White with rounded corners (16px radius)

---

## Dependencies

### Frontend
- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- TypeScript

### State Management
- React Context (for user and UI state)
- localStorage (for hide balances preference)

### Future Integration
- API integration for account data (`/balances` endpoint)
- API integration for transactions (`/movements` endpoint)
- Real session data from JWT token

---

## Acceptance Criteria

### Functional
- [ ] Page renders at `/home` route
- [ ] Redirects to `/login` if not authenticated
- [ ] Sidebar navigation works correctly
- [ ] All menu items navigate to correct routes (or show placeholder)
- [ ] User avatar shows correct initials
- [ ] Dropdown menu opens/closes correctly
- [ ] Hide balances toggle works
- [ ] Quick access cards are clickable
- [ ] Page is fully responsive

### Technical
- [ ] Uses Atomic Design component structure
- [ ] Shared layout components work across routes
- [ ] TypeScript types for all props and state
- [ ] Follows coding standards (`.claude/coding-standards.md`)
- [ ] No accessibility warnings
- [ ] No console errors
- [ ] Passes ESLint validation

### Performance
- [ ] Lighthouse score: Performance > 85
- [ ] First Contentful Paint < 2s
- [ ] Layout shift minimal (CLS < 0.1)

### Content
- [ ] All text in Spanish
- [ ] Correct spelling and grammar
- [ ] User name displayed correctly
- [ ] Amounts formatted correctly (Colombian peso format)

---

## Implementation Plan

### Phase 1: Shared Layout Components (1 day)
**Deliverables**:
- Create authenticated layout structure
- Implement Sidebar component
- Implement TopBar with avatar
- Implement WelcomeBar
- Implement SessionFooter

**Files**:
- `app/(authenticated)/layout.tsx`
- `src/organisms/Sidebar.tsx`
- `src/organisms/TopBar.tsx`
- `src/organisms/WelcomeBar.tsx`
- `src/organisms/SessionFooter.tsx`
- `src/molecules/SidebarNavItem.tsx`
- `src/molecules/UserAvatar.tsx`
- `src/molecules/UserDropdown.tsx`
- `src/atoms/Avatar.tsx`
- `src/atoms/Toggle.tsx`
- `src/atoms/Divider.tsx`

### Phase 2: Context & State (0.5 day)
**Deliverables**:
- Create UserContext for user data
- Create UIContext for UI state
- Implement hide balances functionality
- Implement sidebar expand/collapse

**Files**:
- `src/contexts/UserContext.tsx`
- `src/contexts/UIContext.tsx`
- `src/hooks/useUser.ts`
- `src/hooks/useUI.ts`

### Phase 3: Home Page Components (1 day)
**Deliverables**:
- Implement AccountSummaryCard
- Implement QuickAccessGrid and QuickAccessCard
- Implement RecentTransactions and TransactionItem
- Assemble Home page

**Files**:
- `app/(authenticated)/home/page.tsx`
- `src/organisms/AccountSummaryCard.tsx`
- `src/organisms/QuickAccessGrid.tsx`
- `src/organisms/RecentTransactions.tsx`
- `src/molecules/QuickAccessCard.tsx`
- `src/molecules/TransactionItem.tsx`

### Phase 4: Styling & Polish (0.5 day)
**Deliverables**:
- Apply design system styling
- Implement responsive design
- Add Bre-B logo assets
- Fine-tune spacing and colors

**Files**:
- `public/bre-b-logo-white.svg`
- `public/bre-b-logo-color.svg`
- Update component styles

### Phase 5: Integration & Testing (0.5 day)
**Deliverables**:
- Mock data for development
- Navigation between pages
- Cross-browser testing
- Accessibility review

**Total Estimated Time**: 3.5 days

---

## Design Specifications

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| Sidebar Background | `#1D4E8F` | Sidebar bg |
| Content Background | `#F0F9FF` | Main content area |
| Card Background | `#FFFFFF` | Cards, modals |
| Primary Text | `#111827` | Main text |
| Secondary Text | `#7D8290` | Labels, hints |
| Navy Blue | `#194E8D` | Headings, accents |
| Positive Amount | `#006B00` | Positive values |
| Negative Amount | `#FF0000` | Negative values |
| Bre-B Purple | `#32005E` | Bre-B card |
| Footer Text | `#B1B1B1` | Session info |
| Border | `#E4E6EA` | Dividers |

### Typography
| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Page Title | 20px | Medium/Bold | Black/Navy |
| Card Title | 19-20px | Bold | Navy |
| Card Description | 14px | Regular | Gray |
| Balance Large | 24px | Medium | Navy |
| Balance Label | 14px | Regular | Gray |
| Transaction Name | 16px | Bold | Black |
| Transaction Date | 14px | Regular | Gray |
| Transaction Amount | 16px | Medium | Green/Red |
| Footer Info | 12px | Regular | Light Gray |
| Sidebar Menu | 15-16px | Bold | White |

### Spacing
| Element | Value |
|---------|-------|
| Sidebar Width | 268px |
| Content Padding | 32px |
| Card Padding | 20-24px |
| Card Border Radius | 16px |
| Card Gap | 24px |
| Section Gap | 32px |

### Responsive Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
```

**Mobile Behavior**:
- Sidebar collapses to hamburger menu
- Cards stack vertically (1 column)
- Welcome bar wraps to 2 lines if needed

---

## Data Structures

### Account Data (Mock)
```typescript
interface Account {
  accountNumber: string;
  accountType: 'AHORROS' | 'CORRIENTE' | 'CREDITO';
  productCode: string;
  availableBalance: number;
  totalBalance: number;
  maskedNumber: string; // e.g., "****4428"
}

// Mock data
const mockAccount: Account = {
  accountNumber: '1234567890',
  accountType: 'AHORROS',
  productCode: '001',
  availableBalance: 8730500,
  totalBalance: 9150000,
  maskedNumber: '****4428',
};
```

### Transaction Data (Mock)
```typescript
interface Transaction {
  id: string;
  description: string;
  date: string;
  amount: number;
  type: 'DEBITO' | 'CREDITO';
}

// Mock data
const mockTransactions: Transaction[] = [
  { id: '1', description: 'Compra de tiquetes', date: '05 Jun 2025', amount: -1250000, type: 'DEBITO' },
  { id: '2', description: 'Abono extraordinario', date: '05 Jun 2025', amount: 1250000, type: 'CREDITO' },
  // ...
];
```

### User Data (Mock)
```typescript
interface User {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  email: string;
}

// Mock data
const mockUser: User = {
  firstName: 'Camilo',
  lastName: 'Castellanos',
  documentType: 'CC',
  documentNumber: '1234567890',
  email: 'camilo@example.com',
};
```

---

## Navigation Structure

### Sidebar Menu Items
```typescript
const menuItems = [
  { id: 'inicio', label: 'Inicio', icon: 'home', href: '/home', expandable: false },
  { id: 'productos', label: 'Productos', icon: 'grid', href: '/productos', expandable: true },
  { id: 'pagos', label: 'Pagos', icon: 'receipt', href: '/pagos', expandable: true },
  { id: 'transferencias', label: 'Transferencias', icon: 'transfer', href: '/transferencias', expandable: true },
  { id: 'tarjeta', label: 'Tarjeta de Crédito', icon: 'credit-card', href: '/tarjeta', expandable: false },
  { id: 'otros', label: 'Otros Servicios', icon: 'settings', href: '/otros-servicios', expandable: false },
  { id: 'breb', label: 'Bre-B', icon: 'breb', href: '/bre-b', expandable: false },
];
```

### User Dropdown Options
```typescript
const dropdownOptions = [
  { id: 'datos', label: 'Mis Datos Personales', href: '/perfil/datos' },
  { id: 'clave', label: 'Cambiar Clave del Portal', href: '/perfil/cambiar-clave' },
  { id: 'ayuda', label: 'Ayuda', href: '/ayuda' },
  { id: 'logout', label: 'Cerrar Sesión', action: 'logout' },
];
```

---

## Accessibility Requirements

- Semantic HTML5 elements
- Proper heading hierarchy (h1 for page title, h2 for sections)
- ARIA labels for interactive elements
- Keyboard navigation support
  - Tab through sidebar items
  - Enter to expand/collapse
  - Escape to close dropdown
- Focus indicators visible
- Color contrast WCAG AA compliant
- Screen reader announcements for balance toggle

---

## Security Considerations

- Protected route (requires valid JWT)
- Session validation on each request
- Sensitive data (balances) can be hidden
- Session timeout handling
- Secure logout (clear tokens, redirect)
- No sensitive data in URL parameters

---

## Testing Checklist

### Manual Testing
- [ ] Desktop (Chrome, Firefox, Safari, Edge)
- [ ] Mobile (iOS Safari, Android Chrome)
- [ ] Tablet (iPad, Android)
- [ ] Sidebar navigation
- [ ] Dropdown menu
- [ ] Hide balances toggle
- [ ] Quick access card clicks
- [ ] Responsive layout transitions
- [ ] Keyboard navigation

### Automated Testing
- [ ] ESLint passes
- [ ] TypeScript compilation successful
- [ ] Build succeeds (`npm run build`)
- [ ] No React warnings in console
- [ ] Component unit tests (future)

---

## Known Limitations / Future Enhancements

### Current Scope (MVP)
- Mock data only (no API integration)
- Single account display
- Static transaction list (5 items)
- Placeholder navigation (not all routes implemented)

### Future Enhancements (Out of Scope)
- Real API integration for balances and transactions
- Multiple accounts carousel
- Transaction filtering and search
- Push notifications
- Real-time balance updates
- Sidebar collapse/expand animation
- Mobile app deep linking

---

## Related Features

- **Feature 00-prehome**: Landing page (pre-login)
- **Feature 01-auth**: Authentication (login/register)
- **Future**: Productos, Pagos, Transferencias, Tarjeta de Crédito, Otros Servicios, Bre-B

---

## References

See [references.md](./references.md) for:
- Figma design links
- Design assets
- Technical resources

---

## File Structure

```
app/
├── (authenticated)/
│   ├── layout.tsx              # AuthenticatedLayout
│   ├── home/
│   │   └── page.tsx            # Home page
│   ├── productos/              # Future
│   ├── pagos/                  # Future
│   └── transferencias/         # Future

src/
├── atoms/
│   ├── Avatar.tsx
│   ├── Toggle.tsx
│   ├── Divider.tsx
│   ├── Badge.tsx
│   └── index.ts
├── molecules/
│   ├── SidebarNavItem.tsx
│   ├── UserAvatar.tsx
│   ├── UserDropdown.tsx
│   ├── QuickAccessCard.tsx
│   ├── TransactionItem.tsx
│   ├── HideBalancesToggle.tsx
│   └── index.ts
├── organisms/
│   ├── Sidebar.tsx
│   ├── TopBar.tsx
│   ├── WelcomeBar.tsx
│   ├── SessionFooter.tsx
│   ├── AccountSummaryCard.tsx
│   ├── QuickAccessGrid.tsx
│   ├── RecentTransactions.tsx
│   └── index.ts
├── contexts/
│   ├── UserContext.tsx
│   └── UIContext.tsx
├── hooks/
│   ├── useUser.ts
│   └── useUI.ts
├── types/
│   ├── user.ts
│   ├── account.ts
│   └── transaction.ts
└── utils/
    ├── formatCurrency.ts
    └── generateInitials.ts

public/
├── bre-b-logo-white.svg
└── bre-b-logo-color.svg
```

---

## Implementation Notes

### Currency Formatting
```typescript
// src/utils/formatCurrency.ts
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
// Output: "$ 8.730.500"
```

### Initials Generation
```typescript
// src/utils/generateInitials.ts
export function generateInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}
// Output: "CC" for "Camilo Castellanos"
```

### Hide Balances
```typescript
// When hideBalances is true:
// "$ 8.730.500" → "$ ****"
// Use a mask component or conditional rendering
```

### Bre-B Card Special Styling
```tsx
// The Bre-B card has unique styling
<QuickAccessCard
  title="Bre-B"
  description="Pagos inmediatos con Llave o QR, gestión de llaves y más."
  icon={<BrebLogoWhite />}
  variant="featured" // Special purple styling
  href="/bre-b"
/>
```

---

**Feature Owner**: Development Team
**Design Reference**: Figma (see references.md)
**Estimated Effort**: 3.5 days
**Dependencies**: Feature 01-auth (authentication system)
