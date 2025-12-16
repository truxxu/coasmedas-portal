'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarNavItem } from '@/src/molecules';
import { Divider } from '@/src/atoms';
import { useSidebar } from '@/src/hooks';
import { useUserContext } from '@/src/contexts';

// Icon components
function HomeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function ProductsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function PaymentsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}

function TransfersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}

function ServicesIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

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
  const { logout } = useUserContext();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <aside className="w-[268px] bg-brand-navy min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Image
          src="/logo.svg"
          alt="Coasmedas"
          width={200}
          height={40}
          priority
          className="brightness-0 invert"
        />
      </div>

      <Divider color="dark" className="mx-4" />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <SidebarNavItem
            key={item.id}
            label={item.label}
            href={item.href}
            icon={item.icon}
            isActive={pathname === item.href || pathname?.startsWith(item.href + '/')}
            expandable={item.expandable}
            isExpanded={sidebarExpanded[item.id]}
            onToggle={() => toggleSidebarItem(item.id)}
          />
        ))}

        {/* Bre-B with logo */}
        <Link
          href="/bre-b"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-white font-bold hover:bg-white/10 ${
            pathname === '/bre-b' ? 'bg-brand-primary' : ''
          }`}
        >
          <Image src="/bre-b-logo-white.svg" alt="Bre-B" width={38} height={11} />
        </Link>
      </nav>

      <Divider color="dark" className="mx-4" />

      {/* Logout */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-white font-bold hover:bg-white/10 rounded-lg w-full"
        >
          <LogoutIcon />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
