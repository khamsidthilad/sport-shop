'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getPaymentImageUrl } from '@/utils/getProductImageUrl';
import { lo } from '@/lib/lao';

export function PaymentQrImage({
  src,
  alt = lo.order.paymentImage,
  size = 280,
  emptyLabel = lo.order.noReceipt,
  showQrFallback = true,
  className = 'mx-auto border border-border',
}: {
  src?: string | null;
  alt?: string;
  size?: number;
  emptyLabel?: string;
  showQrFallback?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const url = getPaymentImageUrl(src);

  if (!url || failed) {
    if (showQrFallback) {
      return (
        <div
          className={`flex items-center justify-center border border-border bg-secondary text-sm text-muted-foreground ${className}`}
          style={{ width: size, height: size }}
        >
          <Image src="/assets/QR.jpeg" alt={lo.order.qrPlaceholder} width={size} height={size} />
        </div>
      );
    }

    return (
      <div
        className={`flex items-center justify-center border border-border bg-secondary px-4 text-center text-sm text-muted-foreground ${className}`}
        style={{ width: size, height: size }}
      >
        {emptyLabel}
      </div>
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      width={size}
      height={size}
      unoptimized
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
