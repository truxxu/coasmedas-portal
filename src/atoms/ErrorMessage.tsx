interface ErrorMessageProps {
  message?: string;
  className?: string;
}

export function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <p
      className={`text-red-600 text-xs mt-1 ${className}`}
      role="alert"
      aria-live="polite"
    >
      {message}
    </p>
  );
}
