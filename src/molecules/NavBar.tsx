'use client';

import { useState } from 'react';
import { Button, Logo } from '@/src/atoms';

export function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="relative flex items-center justify-between w-full px-6 py-4 md:px-8">
      <div className="flex items-center">
        <Logo width={200} height={67} />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4">
        <Button variant="secondary" href="/register">
          Vinculación Digital
        </Button>
        <Button variant="primary" href="/login">
          Iniciar Sesión
        </Button>
      </div>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden flex flex-col gap-1.5 w-8 h-8 justify-center items-center"
        aria-label="Toggle menu"
      >
        <span className={`w-6 h-0.5 bg-brand-navy transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`w-6 h-0.5 bg-brand-navy transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`} />
        <span className={`w-6 h-0.5 bg-brand-navy transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-brand-border shadow-lg md:hidden">
          <div className="flex flex-col gap-3 px-6 py-4">
            <Button
              variant="secondary"
              href="/register"
              className="w-full justify-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Vinculación Digital
            </Button>
            <Button
              variant="primary"
              href="/login"
              className="w-full justify-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
