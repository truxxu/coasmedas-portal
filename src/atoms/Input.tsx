import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', ...props }, ref) => {
    const baseStyles = 'h-11 px-3 rounded-[6px] text-base font-normal w-full transition-colors text-black';
    const defaultStyles = 'border border-brand-footer-text focus:border-2 focus:border-brand-primary focus:outline-none';
    const errorStyles = 'border-2 border-red-600';

    const classes = `${baseStyles} ${error ? errorStyles : defaultStyles} ${className}`;

    return (
      <input
        ref={ref}
        className={classes}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
