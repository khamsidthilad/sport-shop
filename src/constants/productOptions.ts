export const PRODUCT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

export const PRODUCT_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#DC2626' },
  { name: 'Blue', hex: '#2563EB' },
  { name: 'Green', hex: '#16A34A' },
  { name: 'Gray', hex: '#6B7280' },
] as const;

export type ProductSize = (typeof PRODUCT_SIZES)[number];
export type ProductColorName = (typeof PRODUCT_COLORS)[number]['name'];
