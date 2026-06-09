import {
  formatStatusLabel,
  getPaymentDisplayLabel,
  getPaymentStatusTone,
  getShippingDisplayLabel,
  getShippingStatusTone,
  type Order,
} from '@/types/order.type';

const toneClasses = {
  pending: 'bg-amber-100 text-amber-900',
  submitted: 'bg-blue-100 text-blue-900',
  paid: 'bg-emerald-100 text-emerald-900',
  neutral: 'bg-secondary text-foreground',
  cancelled: 'bg-red-100 text-red-900',
} as const;

export function OrderStatusBadge({
  label,
  status,
  kind = 'neutral',
  order,
}: {
  label: string;
  status: string | null | undefined;
  kind?: 'payment' | 'shipping' | 'neutral';
  order?: Pick<Order, 'payment_image' | 'shipping_status'>;
}) {
  const tone =
    kind === 'payment'
      ? getPaymentStatusTone(status, order)
      : kind === 'shipping'
        ? getShippingStatusTone(status)
        : 'neutral';
  const display =
    kind === 'payment'
      ? getPaymentDisplayLabel(status, order)
      : kind === 'shipping'
        ? getShippingDisplayLabel(status)
        : formatStatusLabel(status ?? 'pending');

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs ${toneClasses[tone]}`}
      title={label}
    >
      <span className="uppercase tracking-wide opacity-70">{label}:</span>
      <span className="font-semibold">{display}</span>
    </span>
  );
}
