'use client';

import { useState } from 'react';
import {
  formatNumberInputValue,
  parseDigitsOnly,
  parseFormattedNumber,
  sanitizeNumberInput,
  type NumberInputMode,
} from '@/utils/numberInput';

type NumberFormatInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'type' | 'inputMode'
> & {
  mode?: NumberInputMode;
  value: number | string;
  onValueChange: (value: number | string) => void;
  emptyZero?: boolean;
};

function formatDisplayValue(
  value: number | string,
  mode: NumberInputMode,
  options: { allowDecimal: boolean; emptyZero: boolean },
): string {
  if (mode === 'digits') return String(value ?? '');
  return formatNumberInputValue(value, {
    allowDecimal: options.allowDecimal,
    emptyZero: options.emptyZero,
  });
}

export function NumberFormatInput({
  mode = 'integer',
  value,
  onValueChange,
  emptyZero = false,
  className,
  onBlur,
  onFocus,
  ...props
}: NumberFormatInputProps) {
  const allowDecimal = mode === 'decimal';
  const [isFocused, setIsFocused] = useState(false);
  const [draft, setDraft] = useState('');

  const display = isFocused
    ? draft
    : formatDisplayValue(value, mode, { allowDecimal, emptyZero });

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    setDraft(formatDisplayValue(value, mode, { allowDecimal, emptyZero: false }));
    onFocus?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    if (mode === 'digits') {
      const digits = parseDigitsOnly(raw, props.maxLength);
      setDraft(digits);
      onValueChange(digits);
      return;
    }

    const sanitized = sanitizeNumberInput(raw, mode);
    const parsed = parseFormattedNumber(sanitized, { allowDecimal });
    onValueChange(parsed);
    setDraft(
      sanitized === ''
        ? ''
        : formatNumberInputValue(sanitized, { allowDecimal, emptyZero: false }),
    );
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setDraft('');
    onBlur?.(e);
  };

  return (
    <input
      {...props}
      type="text"
      inputMode={mode === 'digits' ? 'numeric' : allowDecimal ? 'decimal' : 'numeric'}
      autoComplete="off"
      value={display}
      onFocus={handleFocus}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
    />
  );
}
