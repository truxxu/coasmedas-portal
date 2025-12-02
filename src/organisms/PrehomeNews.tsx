import { NewsCard } from '@/src/molecules';
import { SectionTitle } from '@/src/atoms';

export function PrehomeNews() {
  const news = [
    {
      title: 'Noticia 1',
      headline: 'Nuevas Noticias para ti',
      description: 'Conoce los beneficios que tenemos para ti este semestre.',
      link: '#',
    },
    {
      title: 'Noticia 1',
      headline: 'Nuevas Noticias para ti',
      description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh Lorem.',
      link: '#',
    },
    {
      title: 'Noticia 1',
      headline: 'Nuevas Noticias para ti',
      description: 'Conoce los beneficios que tenemos para ti este semestre.',
      link: '#',
    },
  ];

  return (
    <section className="w-full px-6 py-16 md:py-20 bg-brand-light-blue">
      <div className="max-w-7xl mx-auto">
        <SectionTitle className="text-center mb-12">
          Mantente Informado
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <NewsCard
              key={index}
              title={item.title}
              headline={item.headline}
              description={item.description}
              link={item.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
