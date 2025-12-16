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
  const isFeatured = variant === 'featured';

  return (
    <Link
      href={href}
      className={`
        block p-6 rounded-[5px] transition-shadow hover:shadow-lg
        ${isFeatured
          ? 'bg-[#32005E] text-white'
          : 'bg-white text-brand-text-black border border-brand-border'
        }
      `}
    >
      <div className="mb-4">{icon}</div>
      <h3 className={`text-xl font-bold mb-2 ${isFeatured ? 'text-white' : 'text-brand-navy'}`}>
        {title}
      </h3>
      <p className={`text-sm ${isFeatured ? 'text-gray-200' : 'text-brand-gray-secondary'}`}>
        {description}
      </p>
    </Link>
  );
}
