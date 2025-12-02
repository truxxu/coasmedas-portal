import { Logo, Link, AppStoreButton, GooglePlayButton } from '@/src/atoms';
import { LoginForm } from './LoginForm';

export function LoginCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-[468px] px-8 py-12 md:px-10 md:py-14 flex flex-col gap-6">
      {/* Logo */}
      <div className="flex justify-center">
        <Logo width={200} height={67} />
      </div>

      {/* Header */}
      <div className="text-center flex flex-col gap-2">
        <h1 className="text-xl font-bold text-brand-text-black">
          Iniciar sesión
        </h1>
        <p className="text-sm text-brand-gray-high">
          Por favor ingresa tus credenciales para continuar.
        </p>
      </div>

      {/* Login Form */}
      <LoginForm />

      {/* Divider */}
      <hr className="border-t border-[#B1B1B1]" />

      {/* App Promotion */}
      <div className="text-center flex flex-col gap-4">
        <p className="text-sm text-[#004266] font-medium">
          Lleva a Coas en tu bolsillo
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <AppStoreButton />
          <GooglePlayButton />
        </div>
      </div>

      {/* Help Section */}
      <div className="text-center flex flex-col gap-2">
        <p className="text-xs text-gray-600">¿Necesitas ayuda?</p>
        <Link href="/help" className="text-sm text-brand-navy font-medium">
          Consulta nuestros canales de atención
        </Link>
      </div>
    </div>
  );
}
