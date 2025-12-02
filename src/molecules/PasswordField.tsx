import { forwardRef, InputHTMLAttributes } from 'react';
import { Label, Input, ErrorMessage } from '@/src/atoms';

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  name: string;
  error?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, name, error, required, className = '', ...props }, ref) => {
    return (
      <div className={`flex flex-col ${className}`}>
        <Label htmlFor={name} required={required}>
          {label}
        </Label>
        <Input
          id={name}
          name={name}
          type="password"
          error={error}
          ref={ref}
          {...props}
        />
        <ErrorMessage message={error} />
      </div>
    );
  }
);

PasswordField.displayName = 'PasswordField';
