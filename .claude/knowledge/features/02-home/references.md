# References - Home (Dashboard Post-Login)

**Feature**: 02-home
**Last Updated**: 2025-12-16

---

## Design Resources

### UI/UX Design
- **Figma Design - Home Page**: [Home Dashboard](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=3018-156)
  - Last updated: 2025-12-16
  - Owner: Design Team
  - Node ID: `3018:156`

- **Figma Design - Avatar Dropdown Menu**: [User Menu](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=0-1)
  - Contains user profile dropdown options
  - Node ID: `0:1` (Canvas "Diseño Final")

### Design Assets (Local)
- **Bre-B Logo (White)**: `attachments/designs/Bre-b-logo-blanco.svg`
  - For use on dark/navy backgrounds
  - Format: SVG

- **Bre-B Logo (Color)**: `attachments/designs/Bre-b-logo-color.svg`
  - For use on light backgrounds
  - Format: SVG

---

## Page Structure Overview

### Layout Components (Persistent across all authenticated pages)

#### 1. Sidebar (Left - 268px width)
- **Background**: Navy blue (`#1D4E8F`)
- **Logo**: Coasmedas logo at top
- **Navigation Groups** (collapsible with chevron):
  - Inicio (Home icon) - Active state highlighted
  - Productos (expandable)
  - Pagos (expandable)
  - Transferencias (expandable)
  - Tarjeta de Crédito
  - Otros Servicios
  - Bre-B (with Bre-B logo)
- **Footer**: "Cerrar Sesión" (Logout) link
- **Dividers**: Horizontal lines separating sections

#### 2. Top Header Bar (Right section)
- **User Avatar**: Circle with initials (e.g., "CC" for Camilo Castellanos)
  - Background: Navy blue circle
  - Text: White initials
  - Click: Opens dropdown menu
- **Dropdown Menu Options**:
  - Mis Datos Personales (My Personal Data)
  - Cambiar Clave del Portal (Change Portal Password)
  - Ayuda (Help)
  - Cerrar Sesión (Logout)

#### 3. Welcome Bar (Below header, persistent)
- **Left**: "Bienvenido, **Camilo**" (Welcome message with user's first name in bold navy)
  - This text changes to section title when navigating to other sections
- **Right**: "Ocultar saldos" (Hide balances) toggle with eye icon

#### 4. Session Info Footer (Bottom bar)
- **Left**: "Último ingreso: 25 de Agosto 2026, 08:34 AM"
- **Center**: "Ingreso actual: 25 de Octubre 2026, 08:34 AM"
- **Right**: "IP: 1010001010.0201"
- **Background**: Light gray/white with top border
- **Font**: 12px, gray text (`#B1B1B1`)

---

## Home Page Specific Content

### Account Summary Card
- **Background**: White with rounded corners
- **Title**: "Cuenta de Ahorros" (navy blue, bold)
- **Subtitle**: "Ahorros ****4428" (gray)
- **Balance Display**:
  - "Saldo disponible" label (gray, small)
  - "$ 8.730.500" (navy blue, large, bold)
  - "Saldo total: **$ 9.150.000**" (gray + black bold)
- **Action Links**:
  - "Ver Bolsillos" (View Pockets) - with icon
  - "Ver Movimientos" (View Transactions) - with icon

### Quick Access Cards Grid (2 rows x 3 columns)

#### Row 1:
1. **Productos** (Products)
   - Icon: Grid/boxes icon
   - Description: "Consulta el detalle, movimientos y extractos de todos tus productos."
   - Background: White

2. **Pagos** (Payments)
   - Icon: Payment/receipt icon
   - Description: "Realiza pagos de tus productos, a otros asociados o servicios públicos."
   - Background: White

3. **Transferencias** (Transfers)
   - Icon: Transfer arrows icon
   - Description: "Mueve dinero entre tus cuentas, a otros bancos o prográmalas."
   - Background: White

#### Row 2:
1. **Bre-B** (Featured)
   - Icon: Bre-B logo (white version)
   - Description: "Pagos inmediatos con Llave o QR, gestión de llaves y más."
   - Background: Purple/violet gradient (`#32005E`)
   - Text: White

2. **Otros Servicios** (Other Services)
   - Icon: Settings/gear icon
   - Description: "Gestiona tus documentos, seguridad, productos y datos personales."
   - Background: White

3. **Tarjeta de Crédito** (Credit Card)
   - Icon: Credit card icon
   - Description: "Consulta saldo, paga tu tarjeta, realiza avances y más."
   - Background: White

### Recent Transactions Section
- **Title**: "Últimos Movimientos" (black, bold)
- **Transaction List Items**:
  - Each item has:
    - Transaction name (bold, black)
    - Date (gray, small): "05 Jun 2025"
    - Amount (right-aligned):
      - Negative: Red text with "-" prefix
      - Positive: Green text (`#006B00`) with "+" prefix
  - Divider line between items

- **Sample Transactions**:
  1. "Compra de tiquetes" - `- $ 1.250.000` (red)
  2. "Abono extraordinario" - `+ $ 1.250.000` (green)
  3. "Pago de obligación" - `- $ 1.250.000` (red)
  4. "Abono de salario" - `+ $ 1.250.000` (green)
  5. "Compra por internet" - `- $ 1.250.000` (red)

---

## Design Tokens

### Colors
- **Sidebar Background**: `#1D4E8F` (Navy Blue)
- **Content Background**: `#F0F9FF` (Light Blue)
- **Card Background**: `#FFFFFF` (White)
- **Primary Text**: `#111827` (Black)
- **Secondary Text**: `#7D8290` (Gray)
- **Navy Blue (Headings)**: `#194E8D`
- **Positive Amount**: `#006B00` (Green)
- **Negative Amount**: `#FF0000` (Red)
- **Bre-B Card Background**: `#32005E` (Purple)
- **Footer Text**: `#B1B1B1` (Light Gray)
- **Border/Divider**: `#E4E6EA`

### Typography
- **Font Family**: Ubuntu (Bold, Medium, Regular)
- **Page Title**: 20px, Medium + Bold (for name)
- **Card Title**: 19-20px, Bold, Navy
- **Card Description**: 14px, Regular, Gray
- **Balance Large**: 24px, Medium, Navy
- **Balance Label**: 14px, Regular, Gray
- **Transaction Name**: 16px, Bold, Black
- **Transaction Date**: 14px, Regular, Gray
- **Transaction Amount**: 16px, Medium
- **Footer Info**: 12px, Regular, Light Gray
- **Sidebar Menu**: 15-16px, Bold, White

### Spacing
- **Sidebar Width**: 268px
- **Content Padding**: 32px
- **Card Padding**: 20-24px
- **Card Border Radius**: 16px
- **Card Gap**: 24px
- **Section Gap**: 32px

---

## Component Hierarchy

### Shared/Layout Components (Organisms)
- `AuthenticatedLayout` - Main layout wrapper for all authenticated pages
  - `Sidebar` - Left navigation sidebar
    - `SidebarLogo` - Logo at top
    - `SidebarNav` - Navigation menu
    - `SidebarNavItem` - Individual menu item (expandable)
    - `SidebarFooter` - Logout link
  - `TopBar` - Top section with avatar
    - `UserAvatar` - User initials circle
    - `UserDropdown` - Dropdown menu on avatar click
  - `WelcomeBar` - Welcome message + hide balances toggle
    - `PageTitle` - Dynamic title (Welcome or section name)
    - `HideBalancesToggle` - Eye icon toggle
  - `SessionFooter` - Bottom session info bar

### Home Page Specific Components
- `HomePage` - Main page component
  - `AccountSummaryCard` - Primary account display
  - `QuickAccessGrid` - 2x3 grid of feature cards
    - `QuickAccessCard` - Individual feature card
    - `BrebCard` - Special styled Bre-B card
  - `RecentTransactions` - Transaction list section
    - `TransactionItem` - Individual transaction row

---

## Implementation Notes

### Sidebar Navigation
- Menu items are grouped and expandable
- Active state: Different background or indicator
- Chevron rotates on expand/collapse
- Store expanded state in local state or context

### User Avatar
- Generate initials from user's first and last name
- Example: "Camilo Castellanos" → "CC"
- Background: Navy blue circle
- Text: White, centered

### User Dropdown Menu
- Opens on avatar click
- Options:
  1. **Mis Datos Personales** - Navigate to personal data page
  2. **Cambiar Clave del Portal** - Navigate to password change page
  3. **Ayuda** - Navigate to help/support page
  4. **Cerrar Sesión** - Logout and redirect to login

### Hide Balances Toggle
- When active: Replace amounts with "****" or dots
- Store preference in localStorage or user settings
- Apply to all balance displays on the page

### Dynamic Page Title
- On Home: "Bienvenido, **{firstName}**"
- On other sections: Section title (e.g., "Productos", "Pagos")
- Bold styling for user name or key word

### Session Information
- Last login: From user session data
- Current login: Current timestamp
- IP Address: From session/request

### Bre-B Card Styling
- Unique purple gradient background
- White text and logo
- Use `Bre-b-logo-blanco.svg` for the icon

---

## Technical Resources

### Next.js Documentation
- **App Router Layouts**: https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates
- **Route Groups**: https://nextjs.org/docs/app/building-your-application/routing/route-groups

### State Management
- Consider React Context for:
  - User session data
  - Sidebar expanded state
  - Hide balances preference

### Protected Routes
- This page requires authentication
- Redirect to `/login` if not authenticated
- Consider middleware for auth protection

---

## Related Features

- [Feature 00-prehome](../00-prehome/spec.md) - Landing page (pre-login)
- [Feature 01-auth](../01-auth/spec.md) - Authentication (login/register)
- Future: Products, Payments, Transfers sections

---

## File Structure Suggestion

```
app/
├── (authenticated)/          # Route group for auth-required pages
│   ├── layout.tsx           # AuthenticatedLayout
│   ├── home/
│   │   └── page.tsx         # Home page
│   ├── productos/
│   ├── pagos/
│   └── transferencias/

src/
├── organisms/
│   ├── Sidebar.tsx
│   ├── TopBar.tsx
│   ├── WelcomeBar.tsx
│   ├── SessionFooter.tsx
│   ├── AccountSummaryCard.tsx
│   ├── QuickAccessGrid.tsx
│   └── RecentTransactions.tsx
├── molecules/
│   ├── SidebarNavItem.tsx
│   ├── UserAvatar.tsx
│   ├── UserDropdown.tsx
│   ├── QuickAccessCard.tsx
│   └── TransactionItem.tsx
├── atoms/
│   ├── Avatar.tsx
│   ├── Toggle.tsx
│   └── Badge.tsx
```

---

## Notes

- All text content is in Spanish
- Responsive design: Sidebar may collapse on mobile
- Use CSS variables from design system for consistency
- Icons: Consider using a library like Lucide React or custom SVGs
- The Bre-B feature is a key differentiator - give it visual prominence

---

**Last Reviewed**: 2025-12-16
**Status**: Ready for Implementation
