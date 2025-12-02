import { SectionTitle } from '@/src/atoms';
import { ServiceCard } from '@/src/molecules';

export function PrehomeServices() {
  const services = [
    {
      title: 'Ahorros',
      description: 'Planea tu futuro con nuestras opciones de ahorro flexibles y rentables.',
    },
    {
      title: 'Créditos',
      description: 'Impulso tus proyectos con créditos a tu medida y tasas preferenciales.',
    },
    {
      title: 'Inversiones',
      description: 'Haz crecer tu dinero con portafolios de inversión segura y diversificados.',
    },
    {
      title: 'Pagos y Transferencias',
      description: 'Realiza tus pagos y transferencias de forma rápida y segura.',
    },
  ];

  return (
    <section className="w-full px-6 py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
