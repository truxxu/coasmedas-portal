import { Metadata } from 'next';
import { LoginCard } from '@/src/organisms';

export const metadata: Metadata = {
  title: 'Iniciar Sesión - Coasmedas',
  description: 'Accede a tu cuenta de Coasmedas Portal para gestionar tus finanzas de forma segura.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-brand-navy flex items-center justify-center p-5">
      <LoginCard />
    </main>
  );
}
