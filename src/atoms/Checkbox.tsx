import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  'aria-label'?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  id,
  'aria-label': ariaLabel,
}) => {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        w-4 h-4 rounded border-brand-footer-text
        text-brand-primary focus:ring-brand-primary focus:ring-2
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
      `}
    />
  );
};
