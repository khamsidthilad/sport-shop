/** Format integer amounts with comma separators, e.g. 100000 → "100,000" */
export const formatNumber = (n: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);

/** Format price in Lao Kip, e.g. 100000 → "100,000 KIP" */
export const formatCurrency = (n: number) => `${formatNumber(n)} KIP`;
