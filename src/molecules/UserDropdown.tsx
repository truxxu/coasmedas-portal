'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useUserContext } from '@/src/contexts';

interface DropdownOption {
  id: string;
  label: string;
  icon: string;
  href?: string;
  action?: 'logout';
}

const dropdownOptions: DropdownOption[] = [
  { id: 'datos', label: 'Mis Datos Personales', icon: '/icons/profile.svg', href: '/perfil/datos' },
  { id: 'clave', label: 'Cambiar Clave del Portal', icon: '/icons/key.svg', href: '/perfil/cambiar-clave' },
  { id: 'ayuda', label: 'Ayuda', icon: '/icons/help.svg', href: '/ayuda' },
  { id: 'logout', label: 'Cerrar Sesión', icon: '/icons/logout.svg', action: 'logout' },
];

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserDropdown({ isOpen, onClose }: UserDropdownProps) {
  const { user, logout } = useUserContext();

  if (!isOpen) return null;

  const handleOptionClick = (option: DropdownOption) => {
    if (option.action === 'logout') {
      logout();
      window.location.href = '/login';
    }
    onClose();
  };

  const fullName = user ? `${user.firstName} ${user.lastName}`.toUpperCase() : '';
  const email = user?.email || '';

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown */}
      <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-brand-border z-50">
        {/* User Header */}
        <div className="px-4 py-3 border-b border-brand-border">
          <p className="text-sm font-bold text-brand-text-black">{fullName}</p>
          <p className="text-sm text-brand-gray-high">{email}</p>
        </div>

        {/* Menu Options */}
        <ul className="py-2">
          {dropdownOptions.map((option) => (
            <li key={option.id}>
              {option.href ? (
                <Link
                  href={option.href}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-brand-text-black hover:bg-brand-light-blue"
                  onClick={onClose}
                >
                  <Image src={option.icon} alt="" width={20} height={20} />
                  {option.label}
                </Link>
              ) : (
                <button
                  onClick={() => handleOptionClick(option)}
                  className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-brand-text-black hover:bg-brand-light-blue"
                >
                  <Image src={option.icon} alt="" width={20} height={20} />
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
