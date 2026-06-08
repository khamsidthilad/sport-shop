const API_MEDIA_PREFIX = '/api-media';

export function getApiOrigin(): string {
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3003/api')
    .trim()
    .replace(/^["']|["']$/g, '');
  return apiUrl.replace(/\/api\/?$/, '');
}

/** Coerce API image field (string, path, or object) into a storable path/filename */
export function normalizeProductImage(image: unknown): string | undefined {
  if (image == null) return undefined;

  if (typeof image === 'string') {
    const trimmed = image.trim();
    if (!trimmed || trimmed === '[object Object]') return undefined;
    return trimmed;
  }

  if (typeof image === 'object') {
    const record = image as Record<string, unknown>;
    for (const key of ['filename', 'path', 'url', 'pro_image', 'brand_logo', 'name']) {
      const value = record[key];
      if (typeof value === 'string' && value.trim()) {
        return value.trim();
      }
    }
  }

  return undefined;
}

function buildAssetPath(normalized: string, folder: 'products' | 'brands'): string {
  if (normalized.startsWith('/')) return normalized;
  if (normalized.startsWith('images/')) return `/${normalized}`;
  if (normalized.includes('/')) return `/${normalized}`;
  return `/images/${folder}/${normalized}`;
}

/**
 * Build a same-origin URL for static assets on the API server.
 * Uses /api-media rewrite so images load despite API CORP: same-origin headers.
 */
export function getProductImageUrl(
  image?: unknown,
  folder: 'products' | 'brands' = 'products',
): string | null {
  const normalized = normalizeProductImage(image);
  if (!normalized) return null;

  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    return normalized;
  }

  return `${API_MEDIA_PREFIX}${buildAssetPath(normalized, folder)}`;
}

export function getBrandImageUrl(image?: unknown): string | null {
  return getProductImageUrl(image, 'brands');
}

export function getPaymentImageUrl(image?: unknown): string | null {
  const normalized = normalizeProductImage(image);
  if (!normalized) return null;

  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    return normalized;
  }

  const path = normalized.startsWith('/') ? normalized : `/${normalized}`;
  return `${API_MEDIA_PREFIX}${path}`;
}

export { API_MEDIA_PREFIX };
