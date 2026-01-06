interface ErrorIconProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: 40,
  md: 60,
  lg: 80,
};

export function ErrorIcon({ size = "md", className = "" }: ErrorIconProps) {
  const dimension = sizeMap[size];

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Operacion fallida"
      role="img"
      className={className}
    >
      {/* Circle border */}
      <circle
        cx="30"
        cy="30"
        r="28"
        stroke="#FF0D00"
        strokeWidth="3"
        fill="none"
      />
      {/* X mark */}
      <path
        d="M20 20L40 40M40 20L20 40"
        stroke="#FF0D00"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
