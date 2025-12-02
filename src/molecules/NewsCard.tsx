import { Link, Card } from '@/src/atoms';

interface NewsCardProps {
  title: string;
  headline: string;
  description: string;
  link: string;
}

export function NewsCard({ title, headline, description, link }: NewsCardProps) {
  return (
    <Card variant="news" className="flex flex-col">
      <div className="bg-brand-navy px-6 py-12 text-center">
        <h3 className="text-3xl md:text-4xl font-bold text-white">
          {title}
        </h3>
      </div>

      <div className="p-6 flex flex-col gap-3">
        <h4 className="text-lg font-bold text-black">
          {headline}
        </h4>

        <p className="text-sm text-black leading-relaxed">
          {description}
        </p>

        <Link href={link} className="text-brand-navy font-bold underline">
          Leer más
        </Link>
      </div>
    </Card>
  );
}
