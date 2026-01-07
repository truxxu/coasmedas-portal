import Link from 'next/link';
import { ReactNode } from 'react';

interface QuickAccessCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  titleImage?: ReactNode;
  href: string;
  variant?: 'default' | 'featured';
}

export function QuickAccessCard({
  title,
  description,
  icon,
  titleImage,
  href,
  variant = 'default',
}: QuickAccessCardProps) {
  const isFeatured = variant === 'featured';

  return (
    <Link
      href={href}
      className={`
        block p-6 rounded-[5px] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.1)] transition-shadow hover:shadow-lg
        ${isFeatured
          ? 'bg-brand-breb-purple text-white'
          : 'bg-white text-brand-text-black border border-brand-border'
        }
      `}
    >
      {isFeatured ? (
        // Featured variant: logo image as title, no icon
        <>
          {titleImage ? (
            <div className="mb-2">{titleImage}</div>
          ) : (
            <h3 className="text-xl font-bold mb-2 text-white">
              {title}
            </h3>
          )}
          <p className="text-sm text-gray-200">
            {description}
          </p>
        </>
      ) : (
        // Default variant: two-column layout with icon
        <div className="flex gap-4">
          <div className="flex-shrink-0 text-brand-primary">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-brand-navy">
              {title}
            </h3>
            <p className="text-sm text-brand-gray-secondary">
              {description}
            </p>
          </div>
        </div>
      )}
    </Link>
  );
}
