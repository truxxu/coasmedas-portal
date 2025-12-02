import { forwardRef, InputHTMLAttributes } from 'react';
import { Label, Input, ErrorMessage } from '@/src/atoms';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, name, error, required, className = '', ...props }, ref) => {
    return (
      <div className={`flex flex-col ${className}`}>
        <Label htmlFor={name} required={required}>
          {label}
        </Label>
        <Input
          id={name}
          name={name}
          error={error}
          ref={ref}
          {...props}
        />
        <ErrorMessage message={error} />
      </div>
    );
  }
);

FormField.displayName = 'FormField';
