import { formatNumber } from '@/utils/formatCurrency';

export type NumberInputMode = 'integer' | 'decimal' | 'digits';

export function parseFormattedNumber(
  value: string,
  options?: { allowDecimal?: boolean },
): number {
  const cleaned = value.replace(/,/g, '');
  if (options?.allowDecimal) {
    const normalized = cleaned
      .replace(/[^\d.]/g, '')
      .replace(/^(\d*\.\d*).*$/, '$1');
    if (!normalized || normalized === '.') return 0;
    const n = Number(normalized);
    return Number.isFinite(n) ? n : 0;
  }

  const digits = cleaned.replace(/\D/g, '');
  if (!digits) return 0;
  const n = Number(digits);
  return Number.isFinite(n) ? n : 0;
}

export function parseDigitsOnly(value: string, maxLength?: number): string {
  const digits = value.replace(/\D/g, '');
  return maxLength ? digits.slice(0, maxLength) : digits;
}

export function formatNumberInputValue(
  value: number | string | null | undefined,
  options?: { allowDecimal?: boolean; emptyZero?: boolean },
): string {
  if (value === null || value === undefined || value === '') return '';

  if (options?.allowDecimal) {
    const raw = String(value).replace(/,/g, '');
    if (!raw || raw === '.') return options.emptyZero ? '' : '0';
    const [intPart, decPart] = raw.split('.');
    const intNum = Number(intPart || 0);
    const formattedInt = Number.isFinite(intNum) ? formatNumber(intNum) : '0';
    if (decPart !== undefined) return `${formattedInt}.${decPart}`;
    return formattedInt;
  }

  const n = typeof value === 'number' ? value : parseFormattedNumber(String(value));
  if (!Number.isFinite(n)) return '';
  if (options?.emptyZero && n === 0) return '';
  return formatNumber(n);
}

export function sanitizeNumberInput(raw: string, mode: NumberInputMode): string {
  if (mode === 'digits') return raw.replace(/\D/g, '');
  if (mode === 'decimal') {
    return raw
      .replace(/[^\d.,]/g, '')
      .replace(/,/g, '')
      .replace(/^(\d*\.\d*).*$/, '$1');
  }
  return raw.replace(/\D/g, '');
}
