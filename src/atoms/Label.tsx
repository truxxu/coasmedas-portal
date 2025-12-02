import { LabelHTMLAttributes, ReactNode } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  required?: boolean;
}

export function Label({ children, required, className = '', ...props }: LabelProps) {
  return (
    <label
      className={`block font-medium text-[14.5px] text-brand-gray-high mb-1.5 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-red-600 ml-0.5">*</span>}
    </label>
  );
}
