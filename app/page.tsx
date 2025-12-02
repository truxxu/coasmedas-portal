import { Metadata } from 'next';
import {
  PrehomeHeader,
  PrehomeHero,
  PrehomeWelcome,
  PrehomeServices,
  PrehomeNews,
  PrehomeInfo,
  PrehomeApp,
  PrehomeFooter,
} from '@/src/organisms';

export const metadata: Metadata = {
  title: 'Coasmedas - Portal Transaccional',
  description: 'La plataforma digital para gestionar tus finanzas y alcanzar tus sueños con seguridad y confianza.',
};

export default function PrehomePage() {
  return (
    <main className="min-h-screen bg-white">
      <PrehomeHeader />
      <PrehomeHero />
      <PrehomeWelcome />
      <PrehomeServices />
      <PrehomeNews />
      <PrehomeInfo />
      <PrehomeApp />
      <PrehomeFooter />
    </main>
  );
}
