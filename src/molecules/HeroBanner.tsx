import { Button } from '@/src/atoms';

export function HeroBanner() {
  return (
    <section className="flex flex-col items-center justify-center px-6 py-16 md:py-20 text-center bg-brand-navy text-white">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 max-w-4xl">
        Tus metas, nuestro compromiso.
      </h1>

      <p className="text-lg md:text-xl mb-8 max-w-3xl">
        La plataforma digital para gestionar tus finanzas y alcanzar tus sueños con seguridad y confianza.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 flex-wrap justify-center w-full max-w-4xl">
        <Button variant="cta" size="lg" href="/cdt-digital" className="w-full sm:w-auto">
          Abre tu CDT Digital
        </Button>
        <Button variant="cta" size="lg" href="/solicitar-credito" className="w-full sm:w-auto">
          Solicita tu Crédito
        </Button>
        <Button variant="primary" size="lg" href="/productos" className="w-full sm:w-auto">
          Conoce nuestros productos
        </Button>
      </div>
    </section>
  );
}
