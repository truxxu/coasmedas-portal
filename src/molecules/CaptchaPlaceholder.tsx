interface CaptchaPlaceholderProps {
  className?: string;
}

export function CaptchaPlaceholder({ className = '' }: CaptchaPlaceholderProps) {
  return (
    <div
      className={`bg-brand-border rounded-[6px] px-6 py-8 text-center ${className}`}
    >
      <p className="text-brand-gray-high font-medium text-base">
        "Espacio para validación Captcha"
      </p>
    </div>
  );
}
