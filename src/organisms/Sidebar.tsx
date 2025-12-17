'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarNavItem } from '@/src/molecules';
import { Divider } from '@/src/atoms';
import { useSidebar } from '@/src/hooks';
import { useUserContext } from '@/src/contexts';

const menuItems = [
  { id: 'inicio', label: 'Inicio', icon: '/icons/home.svg', href: '/home', expandable: false },
  { id: 'productos', label: 'Productos', icon: '/icons/products.svg', href: '/productos', expandable: true },
  { id: 'pagos', label: 'Pagos', icon: '/icons/payments.svg', href: '/pagos', expandable: true },
  { id: 'transferencias', label: 'Transferencias', icon: '/icons/transfers.svg', href: '/transferencias', expandable: true },
  { id: 'tarjeta', label: 'Tarjeta de Crédito', icon: '/icons/card.svg', href: '/tarjeta', expandable: false },
  { id: 'otros', label: 'Otros Servicios', icon: '/icons/config.svg', href: '/otros-servicios', expandable: false },
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
          <Image src="/icons/Bre-b-logo-blanco.svg" alt="Bre-B" width={38} height={11} />
        </Link>
      </nav>

      <Divider color="dark" className="mx-4" />

      {/* Logout */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-white font-bold hover:bg-white/10 rounded-lg w-full"
        >
          <Image src="/icons/logout.svg" alt="" width={20} height={20} className="brightness-0 invert" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
