import { ReactNode } from 'react';
import { Button } from '@/src/atoms';

interface InfoCardProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonHref?: string;
  children?: ReactNode;
}

export function InfoCard({ title, description, buttonText, buttonHref, children }: InfoCardProps) {
  return (
    <div className="bg-white p-8 rounded-lg">
      <h3 className="text-xl font-bold text-brand-navy mb-4">
        {title}
      </h3>

      <p className="text-sm text-black mb-6 leading-relaxed">
        {description}
      </p>

      {children}

      {buttonText && buttonHref && (
        <Button variant="cta" href={buttonHref} className="mt-4">
          {buttonText}
        </Button>
      )}
    </div>
  );
}
