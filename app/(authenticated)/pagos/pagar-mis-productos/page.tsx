'use client';

import { useRouter } from 'next/navigation';
import { BackButton } from '@/src/atoms';
import { Breadcrumbs, HideBalancesToggle } from '@/src/molecules';
import { PaymentOptionsGrid } from '@/src/organisms';

export default function PagarMisProductosPage() {
  const router = useRouter();

  const breadcrumbs = ['Inicio', 'Pagos', 'Pagar mis productos'];

  const handleOptionClick = (optionId: string) => {
    // TODO: Navigate to payment flow when routes are defined
    console.log(`Payment option selected: ${optionId}`);
    // Example: router.push(`/pagos/pagar-mis-productos/${optionId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          {/* Back Button + Page Title */}
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className="text-xl font-medium text-gray-900">
              Pagar mis productos
            </h1>
          </div>

          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* Hide Balances Toggle */}
        <HideBalancesToggle />
      </div>

      {/* Main Content Section */}
      <div className="space-y-8">
        {/* Section Heading */}
        <div className="space-y-3">
          <h2 className="text-[21px] font-bold text-brand-navy">
            Pago mis productos
          </h2>
          <p className="text-[15px] text-gray-900">
            ¿Qué producto deseas pagar hoy?
          </p>
        </div>

        {/* Payment Options Grid */}
        <PaymentOptionsGrid onOptionClick={handleOptionClick} />
      </div>
    </div>
  );
}
