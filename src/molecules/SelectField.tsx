import { forwardRef, SelectHTMLAttributes } from 'react';
import { Label, Select, SelectOption, ErrorMessage } from '@/src/atoms';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  options: readonly SelectOption[];
  error?: string;
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, name, options, error, placeholder, required, className = '', ...props }, ref) => {
    return (
      <div className={`flex flex-col ${className}`}>
        <Label htmlFor={name} required={required}>
          {label}
        </Label>
        <Select
          id={name}
          name={name}
          options={options}
          placeholder={placeholder}
          error={error}
          ref={ref}
          {...props}
        />
        <ErrorMessage message={error} />
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';
