import { InfoCard } from '@/src/molecules';

export function PrehomeInfo() {
  return (
    <section className="w-full px-6 py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InfoCard
          title="Mantén tus datos actualizados"
          description="No olvides actualizar tus datos lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod."
          buttonText="Actualizar mis datos"
          buttonHref="/actualizar-datos"
        />

        <InfoCard
          title="Recomendaciones de Seguridad"
          description=""
        >
          <ul className="space-y-3 text-sm text-black">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Consectetuer adipiscing elit, sed diam nonummy erat.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Tincidunt ut laoreet dolore magna aliquam erat volutpat.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Ut wisi enim ad minim veniam, quis laoreet exerci tation.</span>
            </li>
          </ul>
        </InfoCard>
      </div>
    </section>
  );
}
