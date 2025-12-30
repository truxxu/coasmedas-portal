'use client';

import { PaymentOptionCard } from '@/src/molecules';

interface PaymentOptionsGridProps {
  onOptionClick: (optionId: string) => void;
  className?: string;
}

const paymentOptions = [
  {
    id: 'pago-unificado',
    title: 'Pago Unificado',
    description:
      'Paga todos tus productos pendientes en una sola transacción y mantente al día fácilmente.',
    variant: 'featured' as const,
  },
  {
    id: 'aportes',
    title: 'Aportes',
    description: 'Paga tus aportes sociales y solidaridad.',
    variant: 'standard' as const,
  },
  {
    id: 'obligaciones',
    title: 'Obligaciones',
    description: 'Paga tus créditos, tarjetas y otros compromisos.',
    variant: 'standard' as const,
  },
  {
    id: 'proteccion',
    title: 'Protección',
    description: 'Paga tus seguros y pólizas para estar siempre cubierto.',
    variant: 'standard' as const,
  },
];

export function PaymentOptionsGrid({ onOptionClick, className = '' }: PaymentOptionsGridProps) {
  return (
    <div
      className={`
        grid grid-cols-1 md:grid-cols-2 gap-6
        ${className}
      `}
    >
      {paymentOptions.map((option) => (
        <PaymentOptionCard
          key={option.id}
          title={option.title}
          description={option.description}
          variant={option.variant}
          onClick={() => onOptionClick(option.id)}
        />
      ))}
    </div>
  );
}
