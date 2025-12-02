import { forwardRef, SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: readonly SelectOption[];
  error?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, error, placeholder, className = '', ...props }, ref) => {
    const baseStyles = 'h-11 px-3 rounded-[6px] text-base font-normal w-full transition-colors bg-white';
    const defaultStyles = 'border border-[#B1B1B1] focus:border-2 focus:border-brand-primary focus:outline-none';
    const errorStyles = 'border-2 border-red-600';

    // Add placeholder text color style - gray when empty, black when selected
    const textColorStyles = '[&:invalid]:text-brand-gray-high text-black';

    const classes = `${baseStyles} ${error ? errorStyles : defaultStyles} ${textColorStyles} ${className}`;

    return (
      <select
        ref={ref}
        className={classes}
        defaultValue=""
        required
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = 'Select';
