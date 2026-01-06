interface SuccessIconProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: 40,
  md: 60,
  lg: 80,
};

export function SuccessIcon({ size = "md", className = "" }: SuccessIconProps) {
  const dimension = sizeMap[size];

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Operacion exitosa"
      role="img"
      className={className}
    >
      {/* Circle border */}
      <circle
        cx="30"
        cy="30"
        r="28"
        stroke="#009900"
        strokeWidth="3"
        fill="none"
      />
      {/* Checkmark */}
      <path
        d="M18 30L26 38L42 22"
        stroke="#009900"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
