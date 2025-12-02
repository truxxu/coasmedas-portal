import { Link } from '@/src/atoms';

export function Footer() {
  return (
    <footer className="w-full px-6 py-8 bg-brand-navy">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6">
        <Link href="/atencion-usuario" className="text-sm text-white hover:opacity-80">
          Atención al Usuario
        </Link>
        <Link href="/instructivo" className="text-sm text-white hover:opacity-80">
          Descargar Instructivo
        </Link>
        <Link href="/preguntas-frecuentes" className="text-sm text-white hover:opacity-80">
          Preguntas Frecuentes
        </Link>
      </div>
    </footer>
  );
}
