import { lo } from '@/lib/lao';

export const PRODUCT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

export const PRODUCT_COLORS = [
  { name: lo.colors.black, hex: '#000000' },
  { name: lo.colors.white, hex: '#FFFFFF' },
  { name: lo.colors.red, hex: '#DC2626' },
  { name: lo.colors.blue, hex: '#2563EB' },
  { name: lo.colors.green, hex: '#16A34A' },
  { name: lo.colors.gray, hex: '#6B7280' },
] as const;

export type ProductSize = (typeof PRODUCT_SIZES)[number];
export type ProductColorName = (typeof PRODUCT_COLORS)[number]['name'];
