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
