# Step-by-Step Implementation Plan: Home Feature

**Feature**: 02-home (Dashboard Post-Login)
**Total Estimated Time**: 3.5 days (~28 hours)
**Created**: 2025-12-16
**Based on**: Figma Design (node-id=3018-156)

---

## Design Analysis Summary

Based on Figma design review (`node-id=3018-156`), the Home page consists of:

### Page Layout (Persistent for all authenticated pages)
1. **Sidebar** (Left, 268px) - Navy blue navigation menu
2. **Top Bar** (Right top) - User avatar with dropdown
3. **Welcome Bar** - Dynamic title + hide balances toggle
4. **Content Area** - Page-specific content
5. **Session Footer** - Login timestamps and IP

### Home-Specific Content
1. **Account Summary Card** - Primary account with balance
2. **Quick Access Grid** - 6 feature cards (2x3)
3. **Recent Transactions** - Last 5 movements

### Design Tokens
- **Sidebar Background**: `#1D4E8F` (Navy Blue)
- **Content Background**: `#F0F9FF` (Light Blue)
- **Card Background**: `#FFFFFF` (White)
- **Primary Text**: `#111827` (Black)
- **Secondary Text**: `#7D8290` (Gray)
- **Navy Headings**: `#194E8D`
- **Positive Amount**: `#006B00` (Green)
- **Negative Amount**: `#FF0000` (Red)
- **Bre-B Purple**: `#32005E`
- **Border**: `#E4E6EA`
- **Font**: Ubuntu (Bold, Medium, Regular)

---

## Prerequisites

### Before You Start
- [ ] Review Figma design via MCP (node-id=3018-156)
- [ ] Confirm development environment is running (`npm run dev`)
- [ ] Read [spec.md](./spec.md) for full feature requirements
- [ ] Read [references.md](./references.md) for design guidance
- [ ] Verify existing components in `src/atoms`, `src/molecules`, `src/organisms`

### Current State
- ✅ Next.js 16 project initialized
- ✅ Tailwind CSS v4 configured
- ✅ TypeScript configured
- ✅ Atomic Design directories created
- ✅ Basic atoms exist (Button, Logo, Link, Input, Label, etc.)
- ✅ Login page implemented
- ⏳ Need to create authenticated layout
- ⏳ Need to create Home page components

### Dependencies
- Feature 01-auth should be implemented (login functionality)
- Bre-B logo assets available in `attachments/designs/`

---

## Phase 1: Project Structure Setup (30 min)

### Step 1.1: Create Directory Structure

Create the following directories if they don't exist:

```bash
# Directories to create
src/contexts/
src/hooks/
src/types/
src/utils/
app/(authenticated)/
app/(authenticated)/home/
```

### Step 1.2: Copy Bre-B Logo Assets

Copy logo files to public directory:

**Source**: `.claude/knowledge/features/02-home/attachments/designs/`
**Destination**: `public/`

Files:
- `Bre-b-logo-blanco.svg` → `public/bre-b-logo-white.svg`
- `Bre-b-logo-color.svg` → `public/bre-b-logo-color.svg`

### Step 1.3: Update globals.css (if needed)

**File**: `app/globals.css`

Add any missing design tokens:

```css
:root {
  /* Existing tokens... */

  /* Add if missing */
  --brand-positive: #006B00;
  --brand-negative: #FF0000;
  --brand-breb-purple: #32005E;
  --brand-gray-secondary: #7D8290;
  --brand-footer-text: #B1B1B1;
}
```

---

## Phase 2: TypeScript Types & Utilities (1 hour)

### Step 2.1: Create User Types

**File**: `src/types/user.ts`

```typescript
export interface User {
  firstName: string;
  lastName: string;
  documentType: 'CC' | 'CE' | 'TI' | 'PA';
  documentNumber: string;
  email: string;
}

export interface Session {
  lastLogin: Date;
  currentLogin: Date;
  ipAddress: string;
}
```

### Step 2.2: Create Account Types

**File**: `src/types/account.ts`

```typescript
export type AccountType = 'AHORROS' | 'CORRIENTE' | 'CREDITO' | 'INVERSION';

export interface Account {
  accountNumber: string;
  accountType: AccountType;
  productCode: string;
  availableBalance: number;
  totalBalance: number;
  maskedNumber: string;
}
```

### Step 2.3: Create Transaction Types

**File**: `src/types/transaction.ts`

```typescript
export type TransactionType = 'DEBITO' | 'CREDITO';

export interface Transaction {
  id: string;
  description: string;
  date: string;
  amount: number;
  type: TransactionType;
}
```

### Step 2.4: Create Types Index

**File**: `src/types/index.ts`

```typescript
export * from './user';
export * from './account';
export * from './transaction';
```

### Step 2.5: Create Currency Formatter Utility

**File**: `src/utils/formatCurrency.ts`

```typescript
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function maskCurrency(): string {
  return '$ ****';
}
```

### Step 2.6: Create Initials Generator Utility

**File**: `src/utils/generateInitials.ts`

```typescript
export function generateInitials(firstName: string, lastName: string): string {
  const first = firstName?.charAt(0) || '';
  const last = lastName?.charAt(0) || '';
  return `${first}${last}`.toUpperCase();
}
```

### Step 2.7: Create Utils Index

**File**: `src/utils/index.ts`

```typescript
export * from './formatCurrency';
export * from './generateInitials';
```

---

## Phase 3: Context & State Management (2 hours)

### Step 3.1: Create User Context

**File**: `src/contexts/UserContext.tsx`

```typescript
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { User, Session } from '@/src/types';

interface UserContextType {
  user: User | null;
  session: Session | null;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock data for development
const mockUser: User = {
  firstName: 'Camilo',
  lastName: 'Castellanos',
  documentType: 'CC',
  documentNumber: '1234567890',
  email: 'camilo@example.com',
};

const mockSession: Session = {
  lastLogin: new Date('2026-08-25T08:34:00'),
  currentLogin: new Date('2026-10-25T08:34:00'),
  ipAddress: '1010001010.0201',
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUser);
  const [session, setSession] = useState<Session | null>(mockSession);

  const logout = () => {
    setUser(null);
    setSession(null);
    // TODO: Clear JWT, redirect to login
  };

  return (
    <UserContext.Provider value={{ user, session, setUser, setSession, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within UserProvider');
  }
  return context;
}
```

### Step 3.2: Create UI Context

**File**: `src/contexts/UIContext.tsx`

```typescript
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UIContextType {
  hideBalances: boolean;
  setHideBalances: (value: boolean) => void;
  toggleHideBalances: () => void;
  sidebarExpanded: Record<string, boolean>;
  toggleSidebarItem: (itemId: string) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [hideBalances, setHideBalances] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState<Record<string, boolean>>({});

  // Persist hideBalances preference
  useEffect(() => {
    const stored = localStorage.getItem('hideBalances');
    if (stored) setHideBalances(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('hideBalances', JSON.stringify(hideBalances));
  }, [hideBalances]);

  const toggleHideBalances = () => setHideBalances(!hideBalances);

  const toggleSidebarItem = (itemId: string) => {
    setSidebarExpanded(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <UIContext.Provider value={{
      hideBalances,
      setHideBalances,
      toggleHideBalances,
      sidebarExpanded,
      toggleSidebarItem,
    }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUIContext() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUIContext must be used within UIProvider');
  }
  return context;
}
```

### Step 3.3: Create Contexts Index

**File**: `src/contexts/index.ts`

```typescript
export { UserProvider, useUserContext } from './UserContext';
export { UIProvider, useUIContext } from './UIContext';
```

### Step 3.4: Create Custom Hooks

**File**: `src/hooks/useUser.ts`

```typescript
import { useUserContext } from '@/src/contexts';

export function useUser() {
  const { user } = useUserContext();
  return user;
}

export function useSession() {
  const { session } = useUserContext();
  return session;
}
```

**File**: `src/hooks/useUI.ts`

```typescript
import { useUIContext } from '@/src/contexts';

export function useHideBalances() {
  const { hideBalances, toggleHideBalances } = useUIContext();
  return { hideBalances, toggleHideBalances };
}

export function useSidebar() {
  const { sidebarExpanded, toggleSidebarItem } = useUIContext();
  return { sidebarExpanded, toggleSidebarItem };
}
```

**File**: `src/hooks/index.ts`

```typescript
export * from './useUser';
export * from './useUI';
```

---

## Phase 4: Atoms - New Components (2 hours)

### Step 4.1: Create Avatar Atom

**File**: `src/atoms/Avatar.tsx`

```typescript
interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ initials, size = 'md', className = '' }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  return (
    <div
      className={`
        ${sizes[size]}
        rounded-full bg-brand-navy text-white
        flex items-center justify-center font-bold
        ${className}
      `}
    >
      {initials}
    </div>
  );
}
```

### Step 4.2: Create Toggle Atom

**File**: `src/atoms/Toggle.tsx`

```typescript
interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
  className?: string;
}

export function Toggle({ checked, onChange, label, className = '' }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex items-center gap-2 text-sm ${className}`}
    >
      {/* Eye icon - changes based on state */}
      <svg
        className="w-5 h-5 text-brand-gray-high"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {checked ? (
          // Eye slash icon
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        ) : (
          // Eye icon
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        )}
        {!checked && (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        )}
      </svg>
      {label && <span className="text-brand-text-black">{label}</span>}
    </button>
  );
}
```

### Step 4.3: Create Divider Atom

**File**: `src/atoms/Divider.tsx`

```typescript
interface DividerProps {
  className?: string;
  color?: 'light' | 'dark';
}

export function Divider({ className = '', color = 'light' }: DividerProps) {
  const colors = {
    light: 'border-brand-border',
    dark: 'border-gray-600',
  };

  return <hr className={`border-t ${colors[color]} ${className}`} />;
}
```

### Step 4.4: Create ChevronIcon Atom

**File**: `src/atoms/ChevronIcon.tsx`

```typescript
interface ChevronIconProps {
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export function ChevronIcon({ direction = 'down', className = '' }: ChevronIconProps) {
  const rotations = {
    up: 'rotate-180',
    down: 'rotate-0',
    left: 'rotate-90',
    right: '-rotate-90',
  };

  return (
    <svg
      className={`w-4 h-4 transition-transform ${rotations[direction]} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
```

### Step 4.5: Update Atoms Index

**File**: `src/atoms/index.ts`

Add new exports:

```typescript
// Existing exports...
export { Avatar } from './Avatar';
export { Toggle } from './Toggle';
export { Divider } from './Divider';
export { ChevronIcon } from './ChevronIcon';
```

---

## Phase 5: Molecules - Shared Components (3 hours)

### Step 5.1: Create SidebarNavItem

**File**: `src/molecules/SidebarNavItem.tsx`

```typescript
'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { ChevronIcon } from '@/src/atoms';

interface SidebarNavItemProps {
  label: string;
  href: string;
  icon: ReactNode;
  isActive?: boolean;
  expandable?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  children?: ReactNode;
}

export function SidebarNavItem({
  label,
  href,
  icon,
  isActive = false,
  expandable = false,
  isExpanded = false,
  onToggle,
  children,
}: SidebarNavItemProps) {
  const baseClasses = 'flex items-center gap-3 px-4 py-2 rounded-lg text-white font-bold text-[15px] transition-colors';
  const activeClasses = isActive ? 'bg-brand-primary' : 'hover:bg-white/10';

  if (expandable) {
    return (
      <div>
        <button
          onClick={onToggle}
          className={`${baseClasses} ${activeClasses} w-full justify-between`}
        >
          <span className="flex items-center gap-3">
            {icon}
            {label}
          </span>
          <ChevronIcon direction={isExpanded ? 'up' : 'down'} className="text-white" />
        </button>
        {isExpanded && children && (
          <div className="ml-8 mt-1 space-y-1">
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href={href} className={`${baseClasses} ${activeClasses}`}>
      {icon}
      {label}
    </Link>
  );
}
```

### Step 5.2: Create UserAvatar

**File**: `src/molecules/UserAvatar.tsx`

```typescript
'use client';

import { Avatar } from '@/src/atoms';
import { generateInitials } from '@/src/utils';
import { useUser } from '@/src/hooks';

interface UserAvatarProps {
  onClick?: () => void;
  className?: string;
}

export function UserAvatar({ onClick, className = '' }: UserAvatarProps) {
  const user = useUser();

  const initials = user
    ? generateInitials(user.firstName, user.lastName)
    : '??';

  return (
    <button onClick={onClick} className={`cursor-pointer ${className}`}>
      <Avatar initials={initials} size="md" />
    </button>
  );
}
```

### Step 5.3: Create UserDropdown

**File**: `src/molecules/UserDropdown.tsx`

```typescript
'use client';

import Link from 'next/link';
import { useUserContext } from '@/src/contexts';

interface DropdownOption {
  id: string;
  label: string;
  href?: string;
  action?: 'logout';
}

const dropdownOptions: DropdownOption[] = [
  { id: 'datos', label: 'Mis Datos Personales', href: '/perfil/datos' },
  { id: 'clave', label: 'Cambiar Clave del Portal', href: '/perfil/cambiar-clave' },
  { id: 'ayuda', label: 'Ayuda', href: '/ayuda' },
  { id: 'logout', label: 'Cerrar Sesión', action: 'logout' },
];

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserDropdown({ isOpen, onClose }: UserDropdownProps) {
  const { logout } = useUserContext();

  if (!isOpen) return null;

  const handleOptionClick = (option: DropdownOption) => {
    if (option.action === 'logout') {
      logout();
      // Redirect to login
      window.location.href = '/login';
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown */}
      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-brand-border z-50">
        <ul className="py-2">
          {dropdownOptions.map((option) => (
            <li key={option.id}>
              {option.href ? (
                <Link
                  href={option.href}
                  className="block px-4 py-2 text-sm text-brand-text-black hover:bg-brand-light-blue"
                  onClick={onClose}
                >
                  {option.label}
                </Link>
              ) : (
                <button
                  onClick={() => handleOptionClick(option)}
                  className="block w-full text-left px-4 py-2 text-sm text-brand-text-black hover:bg-brand-light-blue"
                >
                  {option.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
```

### Step 5.4: Create HideBalancesToggle

**File**: `src/molecules/HideBalancesToggle.tsx`

```typescript
'use client';

import { Toggle } from '@/src/atoms';
import { useHideBalances } from '@/src/hooks';

export function HideBalancesToggle() {
  const { hideBalances, toggleHideBalances } = useHideBalances();

  return (
    <Toggle
      checked={hideBalances}
      onChange={toggleHideBalances}
      label="Ocultar saldos"
    />
  );
}
```

### Step 5.5: Create QuickAccessCard

**File**: `src/molecules/QuickAccessCard.tsx`

```typescript
import Link from 'next/link';
import { ReactNode } from 'react';

interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  variant?: 'default' | 'featured';
}

export function QuickAccessCard({
  title,
  description,
  icon,
  href,
  variant = 'default',
}: QuickAccessCardProps) {
  const isFeautured = variant === 'featured';

  return (
    <Link
      href={href}
      className={`
        block p-6 rounded-2xl transition-shadow hover:shadow-lg
        ${isFeautured
          ? 'bg-[#32005E] text-white'
          : 'bg-white text-brand-text-black border border-brand-border'
        }
      `}
    >
      <div className="mb-4">{icon}</div>
      <h3 className={`text-xl font-bold mb-2 ${isFeautured ? 'text-white' : 'text-brand-navy'}`}>
        {title}
      </h3>
      <p className={`text-sm ${isFeautured ? 'text-gray-200' : 'text-brand-gray-secondary'}`}>
        {description}
      </p>
    </Link>
  );
}
```

### Step 5.6: Create TransactionItem

**File**: `src/molecules/TransactionItem.tsx`

```typescript
'use client';

import { formatCurrency, maskCurrency } from '@/src/utils';
import { useHideBalances } from '@/src/hooks';
import { Transaction } from '@/src/types';

interface TransactionItemProps {
  transaction: Transaction;
  showDivider?: boolean;
}

export function TransactionItem({ transaction, showDivider = true }: TransactionItemProps) {
  const { hideBalances } = useHideBalances();
  const isPositive = transaction.amount > 0;

  const displayAmount = hideBalances
    ? maskCurrency()
    : `${isPositive ? '+' : '-'} ${formatCurrency(Math.abs(transaction.amount))}`;

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <div>
          <p className="font-bold text-brand-text-black">{transaction.description}</p>
          <p className="text-sm text-brand-gray-secondary">{transaction.date}</p>
        </div>
        <p className={`font-medium ${isPositive ? 'text-[#006B00]' : 'text-red-600'}`}>
          {displayAmount}
        </p>
      </div>
      {showDivider && <hr className="border-brand-border" />}
    </div>
  );
}
```

### Step 5.7: Update Molecules Index

**File**: `src/molecules/index.ts`

Add new exports:

```typescript
// Existing exports...
export { SidebarNavItem } from './SidebarNavItem';
export { UserAvatar } from './UserAvatar';
export { UserDropdown } from './UserDropdown';
export { HideBalancesToggle } from './HideBalancesToggle';
export { QuickAccessCard } from './QuickAccessCard';
export { TransactionItem } from './TransactionItem';
```

---

## Phase 6: Organisms - Layout Components (4 hours)

### Step 6.1: Create Sidebar

**File**: `src/organisms/Sidebar.tsx`

```typescript
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarNavItem } from '@/src/molecules';
import { Divider } from '@/src/atoms';
import { useSidebar } from '@/src/hooks';

// Icons (simplified SVG components or use a library)
const HomeIcon = () => (/* SVG */);
const ProductsIcon = () => (/* SVG */);
const PaymentsIcon = () => (/* SVG */);
const TransfersIcon = () => (/* SVG */);
const CreditCardIcon = () => (/* SVG */);
const ServicesIcon = () => (/* SVG */);
const LogoutIcon = () => (/* SVG */);

const menuItems = [
  { id: 'inicio', label: 'Inicio', icon: <HomeIcon />, href: '/home', expandable: false },
  { id: 'productos', label: 'Productos', icon: <ProductsIcon />, href: '/productos', expandable: true },
  { id: 'pagos', label: 'Pagos', icon: <PaymentsIcon />, href: '/pagos', expandable: true },
  { id: 'transferencias', label: 'Transferencias', icon: <TransfersIcon />, href: '/transferencias', expandable: true },
  { id: 'tarjeta', label: 'Tarjeta de Crédito', icon: <CreditCardIcon />, href: '/tarjeta', expandable: false },
  { id: 'otros', label: 'Otros Servicios', icon: <ServicesIcon />, href: '/otros-servicios', expandable: false },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarExpanded, toggleSidebarItem } = useSidebar();

  return (
    <aside className="w-[268px] bg-brand-navy min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Image
          src="/logo-white.svg"
          alt="Coasmedas"
          width={200}
          height={40}
          priority
        />
      </div>

      <Divider color="dark" />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <SidebarNavItem
            key={item.id}
            label={item.label}
            href={item.href}
            icon={item.icon}
            isActive={pathname === item.href}
            expandable={item.expandable}
            isExpanded={sidebarExpanded[item.id]}
            onToggle={() => toggleSidebarItem(item.id)}
          />
        ))}

        {/* Bre-B with logo */}
        <Link
          href="/bre-b"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-white font-bold hover:bg-white/10"
        >
          <Image src="/bre-b-logo-white.svg" alt="Bre-B" width={38} height={11} />
        </Link>
      </nav>

      <Divider color="dark" />

      {/* Logout */}
      <div className="p-4">
        <button className="flex items-center gap-3 px-4 py-2 text-white font-bold hover:bg-white/10 rounded-lg w-full">
          <LogoutIcon />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
```

### Step 6.2: Create TopBar

**File**: `src/organisms/TopBar.tsx`

```typescript
'use client';

import { useState } from 'react';
import { UserAvatar, UserDropdown } from '@/src/molecules';

export function TopBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-brand-border px-6 flex items-center justify-end relative">
      <UserAvatar onClick={() => setIsDropdownOpen(!isDropdownOpen)} />
      <UserDropdown
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
      />
    </header>
  );
}
```

### Step 6.3: Create WelcomeBar

**File**: `src/organisms/WelcomeBar.tsx`

```typescript
'use client';

import { HideBalancesToggle } from '@/src/molecules';
import { useUser } from '@/src/hooks';

interface WelcomeBarProps {
  title?: string; // Override for section pages
}

export function WelcomeBar({ title }: WelcomeBarProps) {
  const user = useUser();

  const displayTitle = title || (
    <>
      Bienvenido, <span className="text-brand-navy font-bold">{user?.firstName}</span>
    </>
  );

  return (
    <div className="h-14 bg-white border-b border-brand-border px-8 flex items-center justify-between">
      <h1 className="text-xl font-medium text-brand-text-black">
        {displayTitle}
      </h1>
      <HideBalancesToggle />
    </div>
  );
}
```

### Step 6.4: Create SessionFooter

**File**: `src/organisms/SessionFooter.tsx`

```typescript
'use client';

import { useSession } from '@/src/hooks';

function formatDateTime(date: Date): string {
  return date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }) + ', ' + date.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function SessionFooter() {
  const session = useSession();

  if (!session) return null;

  return (
    <footer className="h-8 bg-white border-t border-brand-border px-8 flex items-center justify-center gap-8 text-xs text-[#B1B1B1]">
      <span>Último ingreso: {formatDateTime(session.lastLogin)}</span>
      <span>Ingreso actual: {formatDateTime(session.currentLogin)}</span>
      <span>IP: {session.ipAddress}</span>
    </footer>
  );
}
```

### Step 6.5: Update Organisms Index

**File**: `src/organisms/index.ts`

Add new exports:

```typescript
// Existing exports...
export { Sidebar } from './Sidebar';
export { TopBar } from './TopBar';
export { WelcomeBar } from './WelcomeBar';
export { SessionFooter } from './SessionFooter';
```

---

## Phase 7: Organisms - Home Page Components (3 hours)

### Step 7.1: Create AccountSummaryCard

**File**: `src/organisms/AccountSummaryCard.tsx`

```typescript
'use client';

import Link from 'next/link';
import { Account } from '@/src/types';
import { formatCurrency, maskCurrency } from '@/src/utils';
import { useHideBalances } from '@/src/hooks';

// Mock data
const mockAccount: Account = {
  accountNumber: '1234567890',
  accountType: 'AHORROS',
  productCode: '001',
  availableBalance: 8730500,
  totalBalance: 9150000,
  maskedNumber: '****4428',
};

export function AccountSummaryCard() {
  const { hideBalances } = useHideBalances();
  const account = mockAccount;

  const displayAvailable = hideBalances ? maskCurrency() : formatCurrency(account.availableBalance);
  const displayTotal = hideBalances ? maskCurrency() : formatCurrency(account.totalBalance);

  return (
    <div className="bg-white rounded-2xl p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-brand-navy">Cuenta de Ahorros</h2>
          <p className="text-sm text-brand-gray-secondary">Ahorros {account.maskedNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-brand-gray-secondary">Saldo disponible</p>
          <p className="text-2xl font-medium text-brand-navy">{displayAvailable}</p>
        </div>
      </div>

      <hr className="border-brand-border my-4" />

      <div className="flex justify-between items-center">
        <p className="text-sm text-brand-gray-secondary">
          Saldo total: <span className="font-bold text-brand-text-black">{displayTotal}</span>
        </p>
        <div className="flex gap-4">
          <Link href="/bolsillos" className="text-sm font-medium text-brand-text-black flex items-center gap-1">
            {/* Icon */}
            Ver Bolsillos
          </Link>
          <Link href="/movimientos" className="text-sm font-medium text-brand-text-black flex items-center gap-1">
            {/* Icon */}
            Ver Movimientos
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### Step 7.2: Create QuickAccessGrid

**File**: `src/organisms/QuickAccessGrid.tsx`

```typescript
import Image from 'next/image';
import { QuickAccessCard } from '@/src/molecules';

// Icons (simplified - use actual SVG components or icon library)
const ProductsIcon = () => <div className="w-8 h-8 bg-brand-navy rounded" />;
const PaymentsIcon = () => <div className="w-8 h-8 bg-brand-navy rounded" />;
const TransfersIcon = () => <div className="w-8 h-8 bg-brand-navy rounded" />;
const ServicesIcon = () => <div className="w-8 h-8 bg-brand-navy rounded" />;
const CreditCardIcon = () => <div className="w-8 h-8 bg-brand-navy rounded" />;

const quickAccessItems = [
  {
    id: 'productos',
    title: 'Productos',
    description: 'Consulta el detalle, movimientos y extractos de todos tus productos.',
    icon: <ProductsIcon />,
    href: '/productos',
    variant: 'default' as const,
  },
  {
    id: 'pagos',
    title: 'Pagos',
    description: 'Realiza pagos de tus productos, a otros asociados o servicios públicos.',
    icon: <PaymentsIcon />,
    href: '/pagos',
    variant: 'default' as const,
  },
  {
    id: 'transferencias',
    title: 'Transferencias',
    description: 'Mueve dinero entre tus cuentas, a otros bancos o prográmalas.',
    icon: <TransfersIcon />,
    href: '/transferencias',
    variant: 'default' as const,
  },
  {
    id: 'breb',
    title: 'Bre-B',
    description: 'Pagos inmediatos con Llave o QR, gestión de llaves y más.',
    icon: <Image src="/bre-b-logo-white.svg" alt="Bre-B" width={60} height={18} />,
    href: '/bre-b',
    variant: 'featured' as const,
  },
  {
    id: 'otros',
    title: 'Otros Servicios',
    description: 'Gestiona tus documentos, seguridad, productos y datos personales.',
    icon: <ServicesIcon />,
    href: '/otros-servicios',
    variant: 'default' as const,
  },
  {
    id: 'tarjeta',
    title: 'Tarjeta de Crédito',
    description: 'Consulta saldo, paga tu tarjeta, realiza avances y más.',
    icon: <CreditCardIcon />,
    href: '/tarjeta',
    variant: 'default' as const,
  },
];

export function QuickAccessGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {quickAccessItems.map((item) => (
        <QuickAccessCard
          key={item.id}
          title={item.title}
          description={item.description}
          icon={item.icon}
          href={item.href}
          variant={item.variant}
        />
      ))}
    </div>
  );
}
```

### Step 7.3: Create RecentTransactions

**File**: `src/organisms/RecentTransactions.tsx`

```typescript
import { TransactionItem } from '@/src/molecules';
import { Transaction } from '@/src/types';

// Mock data
const mockTransactions: Transaction[] = [
  { id: '1', description: 'Compra de tiquetes', date: '05 Jun 2025', amount: -1250000, type: 'DEBITO' },
  { id: '2', description: 'Abono extraordinario', date: '05 Jun 2025', amount: 1250000, type: 'CREDITO' },
  { id: '3', description: 'Pago de obligación', date: '05 Jun 2025', amount: -1250000, type: 'DEBITO' },
  { id: '4', description: 'Abono de salario', date: '05 Jun 2025', amount: 1250000, type: 'CREDITO' },
  { id: '5', description: 'Compra por internet', date: '05 Jun 2025', amount: -1250000, type: 'DEBITO' },
];

export function RecentTransactions() {
  return (
    <div className="bg-white rounded-2xl p-6">
      <h2 className="text-xl font-bold text-brand-text-black mb-4">Últimos Movimientos</h2>
      <div>
        {mockTransactions.map((transaction, index) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            showDivider={index < mockTransactions.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
```

### Step 7.4: Update Organisms Index

**File**: `src/organisms/index.ts`

Add new exports:

```typescript
// Existing exports...
export { AccountSummaryCard } from './AccountSummaryCard';
export { QuickAccessGrid } from './QuickAccessGrid';
export { RecentTransactions } from './RecentTransactions';
```

---

## Phase 8: Authenticated Layout & Home Page (2 hours)

### Step 8.1: Create Authenticated Layout

**File**: `app/(authenticated)/layout.tsx`

```typescript
import { UserProvider, UIProvider } from '@/src/contexts';
import { Sidebar, TopBar, WelcomeBar, SessionFooter } from '@/src/organisms';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <UIProvider>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <TopBar />
            <WelcomeBar />
            <main className="flex-1 bg-brand-light-blue p-8 overflow-auto">
              {children}
            </main>
            <SessionFooter />
          </div>
        </div>
      </UIProvider>
    </UserProvider>
  );
}
```

### Step 8.2: Create Home Page

**File**: `app/(authenticated)/home/page.tsx`

```typescript
import { AccountSummaryCard, QuickAccessGrid, RecentTransactions } from '@/src/organisms';

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

### Step 8.3: Add Redirect from Login (Optional)

After successful login, redirect to `/home`:

```typescript
// In login form submit handler
router.push('/home');
```

---

## Phase 9: Icons & Final Assets (1 hour)

### Step 9.1: Create Icon Components

Create SVG icon components for sidebar and cards. Options:
1. Create custom SVG components in `src/atoms/icons/`
2. Use an icon library like `lucide-react`
3. Use inline SVGs

**File**: `src/atoms/icons/index.tsx`

```typescript
export function HomeIcon({ className = '' }) {
  return (
    <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

// Add more icons: ProductsIcon, PaymentsIcon, TransfersIcon, etc.
```

### Step 9.2: Create White Logo Variant

If not already available, create a white version of the Coasmedas logo for the sidebar:
- `public/logo-white.svg`

---

## Phase 10: Responsive Design (2 hours)

### Step 10.1: Mobile Sidebar

Add hamburger menu for mobile:

```typescript
// In Sidebar.tsx - add mobile toggle
const [isMobileOpen, setIsMobileOpen] = useState(false);

// Use lg:w-[268px] w-0 for sidebar
// Add overlay and slide-in animation for mobile
```

### Step 10.2: Responsive Grid

The QuickAccessGrid already uses responsive classes:
- `grid-cols-1` on mobile
- `md:grid-cols-2` on tablet
- `lg:grid-cols-3` on desktop

### Step 10.3: Responsive Welcome Bar

Adjust for mobile:
- Stack title and toggle vertically on small screens
- Reduce padding

---

## Phase 11: Testing & Polish (2 hours)

### Step 11.1: Verify All Components

- [ ] Sidebar renders correctly
- [ ] Navigation items work
- [ ] Avatar dropdown opens/closes
- [ ] Hide balances toggle works
- [ ] Account card displays correctly
- [ ] Quick access cards link correctly
- [ ] Transactions display correctly
- [ ] Footer shows session info

### Step 11.2: Cross-Browser Testing

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Step 11.3: Responsive Testing

- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1280px)

### Step 11.4: Accessibility Check

- [ ] Keyboard navigation
- [ ] Screen reader testing
- [ ] Color contrast
- [ ] Focus indicators

### Step 11.5: Build Verification

```bash
npm run build
npm run lint
```

---

## Time Tracking Summary

| Phase | Estimated | Description |
|-------|-----------|-------------|
| Phase 1 | 0.5 hr | Project structure setup |
| Phase 2 | 1 hr | Types & utilities |
| Phase 3 | 2 hrs | Context & state management |
| Phase 4 | 2 hrs | Atoms - new components |
| Phase 5 | 3 hrs | Molecules - shared components |
| Phase 6 | 4 hrs | Organisms - layout components |
| Phase 7 | 3 hrs | Organisms - home page components |
| Phase 8 | 2 hrs | Layout & page assembly |
| Phase 9 | 1 hr | Icons & assets |
| Phase 10 | 2 hrs | Responsive design |
| Phase 11 | 2 hrs | Testing & polish |
| **Total** | **~22-24 hrs (3-3.5 days)** | |

---

## Component Checklist

### Types & Utils
- [ ] `src/types/user.ts`
- [ ] `src/types/account.ts`
- [ ] `src/types/transaction.ts`
- [ ] `src/utils/formatCurrency.ts`
- [ ] `src/utils/generateInitials.ts`

### Contexts & Hooks
- [ ] `src/contexts/UserContext.tsx`
- [ ] `src/contexts/UIContext.tsx`
- [ ] `src/hooks/useUser.ts`
- [ ] `src/hooks/useUI.ts`

### Atoms
- [ ] `Avatar.tsx`
- [ ] `Toggle.tsx`
- [ ] `Divider.tsx`
- [ ] `ChevronIcon.tsx`

### Molecules
- [ ] `SidebarNavItem.tsx`
- [ ] `UserAvatar.tsx`
- [ ] `UserDropdown.tsx`
- [ ] `HideBalancesToggle.tsx`
- [ ] `QuickAccessCard.tsx`
- [ ] `TransactionItem.tsx`

### Organisms (Layout)
- [ ] `Sidebar.tsx`
- [ ] `TopBar.tsx`
- [ ] `WelcomeBar.tsx`
- [ ] `SessionFooter.tsx`

### Organisms (Home)
- [ ] `AccountSummaryCard.tsx`
- [ ] `QuickAccessGrid.tsx`
- [ ] `RecentTransactions.tsx`

### Pages
- [ ] `app/(authenticated)/layout.tsx`
- [ ] `app/(authenticated)/home/page.tsx`

### Assets
- [ ] `public/bre-b-logo-white.svg`
- [ ] `public/bre-b-logo-color.svg`
- [ ] `public/logo-white.svg` (if needed)

---

## References

- **Feature Spec**: [spec.md](./spec.md)
- **Design Resources**: [references.md](./references.md)
- **Figma Design**: [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=3018-156)
- **Coding Standards**: `.claude/coding-standards.md`
- **Design System**: `.claude/design-system.md`

---

## Notes

1. **Mock Data**: All data is mocked for now. Future integration with API endpoints will replace mock data.

2. **Authentication**: Currently no real auth check. Add middleware or layout-level protection when auth is implemented.

3. **Icons**: Consider using `lucide-react` for consistent iconography instead of custom SVGs.

4. **Sidebar State**: Expand/collapse state is stored in React state. Consider persisting to localStorage.

5. **Responsive Sidebar**: Mobile implementation requires additional work (hamburger menu, overlay, slide animation).

---

**Last Updated**: 2025-12-16
**Status**: Ready for Implementation
