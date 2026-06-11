'use client';

import { NumberFormatInput } from '@/components/ui/NumberFormatInput';
import type { NumberInputMode } from '@/utils/numberInput';

type FormNumberFieldProps = {
  label: string;
  error?: string;
  mode?: NumberInputMode;
  value: number | string;
  onValueChange: (value: number | string) => void;
  emptyZero?: boolean;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  maxLength?: number;
};

export function FormNumberField({
  label,
  error,
  mode = 'integer',
  value,
  onValueChange,
  emptyZero,
  required,
  className,
  inputClassName = 'mt-1 w-full border border-border bg-background px-3 py-2',
  maxLength,
}: FormNumberFieldProps) {
  return (
    <label className={className ?? 'block'}>
      <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
      <NumberFormatInput
        mode={mode}
        value={value}
        onValueChange={onValueChange}
        emptyZero={emptyZero}
        required={required}
        maxLength={maxLength}
        className={inputClassName}
      />
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
