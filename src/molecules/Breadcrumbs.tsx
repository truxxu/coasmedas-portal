interface BreadcrumbsProps {
  items: string[];
  separator?: string;
  className?: string;
}

export function Breadcrumbs({ items, separator = '/', className = '' }: BreadcrumbsProps) {
  return (
    <nav className={`text-[15px] text-black ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              <span className={isLast ? 'font-medium' : 'font-normal'}>
                {item}
              </span>
              {!isLast && (
                <span className="text-black" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
