'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs } from '@/src/molecules';
import { FlowSelectionCard } from '@/src/organisms';
import { useWelcomeBar } from '@/src/contexts';

export default function ServiciosPublicosPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: 'Pagar Servicios Publicos',
      backHref: '/pagos/pagar-mis-productos',
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleSelectInscribir = () => {
    router.push('/pagos/servicios-publicos/inscribir');
  };

  const handleSelectPagar = () => {
    // Future feature - for now redirect to inscribir or show a message
    router.push('/pagos/servicios-publicos/pagar');
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={['Inicio', 'Pagos', 'Pagar servicios publicos']} />

      {/* Flow Selection Card */}
      <FlowSelectionCard
        onSelectInscribir={handleSelectInscribir}
        onSelectPagar={handleSelectPagar}
      />
    </div>
  );
}
