import { ReactNode } from 'react';
import { Card } from '@/src/atoms';

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export function ServiceCard({ title, description, icon }: ServiceCardProps) {
  return (
    <Card variant="bordered" className="p-8 hover:shadow-md transition-shadow">
      <div className="flex flex-col">
        {icon && (
          <div className="mb-4 text-brand-primary">
            {icon}
          </div>
        )}

        <h3 className="text-xl font-bold text-brand-text-black mb-3 text-center">
          {title}
        </h3>

        <p className="text-sm text-brand-gray-high leading-relaxed">
          {description}
        </p>
      </div>
    </Card>
  );
}
