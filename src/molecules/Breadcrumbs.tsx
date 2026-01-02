interface BreadcrumbsProps {
  items: string[];
  separator?: string;
  className?: string;
}

export function Breadcrumbs({ items, separator = '/', className = '' }: BreadcrumbsProps) {
  // For mobile: show first item, ellipsis (if needed), and last item
  const shouldTruncate = items.length > 2;

  return (
    <nav className={`text-[15px] text-black ${className}`} aria-label="Breadcrumb">
      {/* Mobile: truncated breadcrumbs */}
      <ol className="flex md:hidden items-center gap-2">
        {/* First item */}
        <li className="flex items-center gap-2">
          <span className="font-normal">{items[0]}</span>
          <span className="text-black" aria-hidden="true">{separator}</span>
        </li>

        {/* Ellipsis for middle items */}
        {shouldTruncate && (
          <li className="flex items-center gap-2">
            <span className="font-normal">...</span>
            <span className="text-black" aria-hidden="true">{separator}</span>
          </li>
        )}

        {/* Last item */}
        <li className="flex items-center gap-2">
          <span className="font-medium truncate max-w-[150px]">{items[items.length - 1]}</span>
        </li>
      </ol>

      {/* Desktop: full breadcrumbs */}
      <ol className="hidden md:flex items-center gap-2">
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
