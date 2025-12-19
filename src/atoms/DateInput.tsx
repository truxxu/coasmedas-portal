import { forwardRef, InputHTMLAttributes } from 'react';

interface DateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ value, onChange, error, className = '', ...props }, ref) => {
    const baseStyles = 'h-11 px-3 rounded-[6px] text-base font-normal transition-colors bg-white';
    const defaultStyles = 'border border-[#B1B1B1] focus:border-2 focus:border-brand-primary focus:outline-none';
    const errorStyles = 'border-2 border-red-600';
    const textColorStyles = 'text-black placeholder:text-[#6A717F]';

    const classes = `${baseStyles} ${error ? errorStyles : defaultStyles} ${textColorStyles} ${className}`;

    return (
      <input
        ref={ref}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={classes}
        {...props}
      />
    );
  }
);

DateInput.displayName = 'DateInput';
