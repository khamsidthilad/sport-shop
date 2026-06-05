function getApiOrigin(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
  return apiUrl.replace(/\/api\/?$/, '');
}

export function getProductImageUrl(image?: string | null): string | null {
  if (!image?.trim()) return null;

  const trimmed = image.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  const origin = getApiOrigin();
  if (!origin) return trimmed;

  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${origin}${path}`;
}
