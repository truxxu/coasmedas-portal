interface DividerProps {
  className?: string;
  color?: 'light' | 'dark';
}

export function Divider({ className = '', color = 'light' }: DividerProps) {
  const colors = {
    light: 'border-brand-border',
    dark: 'border-gray-600',
  };

  return <hr className={`border-t ${colors[color]} ${className}`} />;
}
