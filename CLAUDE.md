# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Portal Transaccional Coasmedas** - A Next.js 16 portal application using App Router, TypeScript, Tailwind CSS v4, and Atomic Design component architecture. The project is in active development with authentication, home dashboard, and product features being implemented.

**Backend API**: This portal consumes the Coasmedas Banking API (REST). See API documentation in `.claude/knowledge/api/`

## Development Commands

### Running the Application
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Key Development Notes
- **Language**: Project uses Spanish (lang="es") for content
- **Node Version**: Requires Node.js >=18
- **Package Manager**: npm

## Architecture

### Next.js App Router (v16)
This project uses the **App Router** (not Pages Router):
- Routes are defined in `/app` directory using file-based routing
- `app/layout.tsx` provides root layout with metadata and fonts
- `app/page.tsx` maps to `/` route (Prehome landing page)
- **Route Groups**: `app/(authenticated)/` groups authenticated pages
- New public routes: create `app/[route-name]/page.tsx`
- New authenticated routes: create `app/(authenticated)/[route-name]/page.tsx`
- API routes: create in `app/api/[endpoint]/route.ts`

### Component Structure: Atomic Design Pattern
Components follow Atomic Design methodology in `/src`:

```
src/
├── atoms/       # Basic building blocks (Button, Input, Card, Toggle, etc.)
├── molecules/   # Simple combinations of atoms (NavBar, FormField, SidebarNavItem, etc.)
├── organisms/   # Complex sections (Sidebar, TopBar, LoginForm, etc.)
├── contexts/    # React contexts (UIContext, UserContext)
├── hooks/       # Custom hooks (useUI, useUser)
├── types/       # TypeScript type definitions
├── utils/       # Utility functions (formatCurrency, etc.)
└── mocks/       # Mock data for development
```

**Import Path**: Use `@/` alias for root imports:
```typescript
import { Button, Card } from "@/src/atoms";
import { SidebarNavItem } from "@/src/molecules";
import { Sidebar, TopBar } from "@/src/organisms";
import { useUIContext } from "@/src/contexts";
import { formatCurrency } from "@/src/utils";
import { Transaction } from "@/src/types";
```

### Styling with Tailwind CSS v4
- Global styles in `/app/globals.css`
- Uses new Tailwind v4 syntax: `@import "tailwindcss"`
- Brand colors defined as CSS variables (see Design System below)
- Custom brand classes: `bg-brand-navy`, `text-brand-primary`, etc.

### TypeScript Configuration
- **Path Alias**: `@/*` maps to root directory
- **Strict Mode**: Enabled
- **Target**: ES2017
- **JSX**: React 19 transform

### Current Project Structure
```
app/
├── layout.tsx                    # Root layout
├── page.tsx                      # Prehome (landing page)
├── login/page.tsx                # Login page
└── (authenticated)/              # Route group for authenticated pages
    ├── layout.tsx                # Authenticated layout (Sidebar, TopBar)
    ├── home/page.tsx             # Dashboard home
    └── productos/                # Products feature (in progress)
        ├── page.tsx              # Products index
        └── aportes/page.tsx      # Aportes product page
```

## Tech Stack
- **Next.js**: 16.0.3 (App Router)
- **React**: 19.2.0
- **TypeScript**: ^5
- **Tailwind CSS**: ^4
- **ESLint**: ^9 with Next.js configuration
- **react-hook-form**: Form handling
- **yup**: Schema validation

## Important Patterns

### Component Creation
- Follow Atomic Design hierarchy (atoms → molecules → organisms)
- Export all components from `index.ts` in each directory
- Use TypeScript interfaces for all props

### State Management
- **UIContext**: UI state (hideBalances, sidebarExpanded, mobileSidebarOpen)
- **UserContext**: User authentication state
- Access via hooks: `useUIContext()`, `useUserContext()`

### Currency & Number Formatting
```typescript
import { formatCurrency, maskCurrency } from '@/src/utils';

formatCurrency(890058)  // "$ 890.058"
maskCurrency()          // "$ ****"
```

### Hide Balances Pattern
```typescript
const { hideBalances } = useUIContext();
{hideBalances ? maskCurrency() : formatCurrency(amount)}
```

### Adding New Features
1. Create feature documentation in `.claude/knowledge/features/{feature-name}/`
2. Create types in `src/types/`
3. Create utility functions in `src/utils/`
4. Build atoms → molecules → organisms
5. Create page in `app/(authenticated)/`
6. Update index exports in each directory

---

## Additional Guidelines

@.claude/coding-standards.md
@.claude/workflows.md
@.claude/documentation-policy.md
@.claude/design-system.md

## Backend API Documentation

@.claude/knowledge/api/README.md

## Features

### Prehome Landing Page (Feature 00)
@.claude/knowledge/features/00-prehome/spec.md
@.claude/knowledge/features/00-prehome/references.md
@.claude/knowledge/features/00-prehome/implementation-plan.md

### Products - Aportes (Feature 03)
@.claude/knowledge/features/03-products/spec.md
@.claude/knowledge/features/03-products/references.md
@.claude/knowledge/features/03-products/implementation-plan.md

---

## Existing Components Reference

### Atoms (src/atoms/)
- `Button` - Primary, secondary, outline variants
- `Card` - default, bordered, news variants
- `Input` - Form text input with error state
- `Select` - Dropdown with options
- `Label` - Form labels
- `ErrorMessage` - Form error display
- `Toggle` - Switch toggle component
- `Avatar` - User avatar with initials
- `Divider` - Horizontal divider (light/dark)
- `ChevronIcon` - Directional chevron
- `Logo` - Coasmedas logo
- `Link` - Styled link component
- `SectionTitle` - Section headings

### Molecules (src/molecules/)
- `SidebarNavItem` - Sidebar navigation item (supports expandable with children)
- `HideBalancesToggle` - Toggle for hiding balances
- `TransactionItem` - Single transaction display
- `FormField` - Label + Input + Error combination
- `SelectField` - Label + Select + Error combination
- `UserAvatar` - Avatar with user name
- `UserDropdown` - User menu dropdown
- `QuickAccessCard` - Quick action cards

### Organisms (src/organisms/)
- `Sidebar` - Main navigation sidebar
- `TopBar` - Top header bar
- `WelcomeBar` - Welcome message bar
- `SessionFooter` - Session info footer
- `LoginForm` - Complete login form
- `AccountSummaryCard` - Account balance card
- `RecentTransactions` - Transaction list
- `QuickAccessGrid` - Grid of quick actions

### Contexts (src/contexts/)
- `UIContext` - hideBalances, sidebarExpanded, mobileSidebarOpen
- `UserContext` - User authentication state

### Types (src/types/)
- `User` - User information
- `Account` - Account data
- `Transaction` - Transaction data

### Utils (src/utils/)
- `formatCurrency(amount)` - Format as Colombian Peso
- `maskCurrency()` - Returns masked currency string
- `generateInitials(name)` - Get initials from name

---

- do not run the app by yourself, nor build it nor run automated tests. Also, do not make commits