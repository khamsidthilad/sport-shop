// 'use client';

// import { useState } from 'react';
// import { Printer, Eye } from 'lucide-react';
// import { useAppDispatch } from '@/hooks/useAppDispatch';
// import { useAppSelector } from '@/hooks/useAppSelector';
// import { updateStatus } from '@/redux/slices/orderSlice';
// import type { OrderStatus } from '@/lib/types';
// import { formatCurrency } from '@/utils/formatCurrency';
// import { toast } from 'sonner';

// const statuses: OrderStatus[] = [
//   'Pending',
//   'Confirmed',
//   'Processing',
//   'Shipping',
//   'Delivered',
//   'Cancelled',
// ];

// export default function OrderAdminPage() {
//   const dispatch = useAppDispatch();
//   const orders = useAppSelector((s) => s.order.items);
//   const [filter, setFilter] = useState<string>('');
//   const [view, setView] = useState<string | null>(null);
//   const filtered = filter ? orders.filter((o) => o.status === filter) : orders;
//   const detail = orders.find((o) => o.id === view);

//   return (
//     <div className="p-8 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="font-display text-3xl">ORDERS</h1>
//           <p className="text-muted-foreground">
//             {filtered.length} of {orders.length}
//           </p>
//         </div>
//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="px-3 py-2 border border-border bg-background"
//         >
//           <option value="">All statuses</option>
//           {statuses.map((s) => (
//             <option key={s} value={s}>
//               {s}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div className="bg-card border border-border overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-secondary text-xs uppercase">
//             <tr>
//               <th className="text-left p-3">Order ID</th>
//               <th className="text-left p-3">Customer</th>
//               <th className="text-left p-3">Date</th>
//               <th className="text-right p-3">Total</th>
//               <th className="text-left p-3">Payment</th>
//               <th className="text-left p-3">Status</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.map((o) => (
//               <tr key={o.id} className="border-t border-border">
//                 <td className="p-3 font-mono text-xs font-bold">{o.id}</td>
//                 <td className="p-3">{o.customerName}</td>
//                 <td className="p-3 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
//                 <td className="p-3 text-right font-bold">{formatCurrency(o.total)}</td>
//                 <td className="p-3">
//                   <span className="text-xs px-2 py-0.5 bg-secondary">{o.paymentMethod}</span>
//                 </td>
//                 <td className="p-3">
//                   <select
//                     value={o.status}
//                     onChange={(e) => {
//                       dispatch(updateStatus({ id: o.id, status: e.target.value as OrderStatus }));
//                       toast.success('Status updated');
//                     }}
//                     className="px-2 py-1 border border-border bg-background text-xs"
//                   >
//                     {statuses.map((s) => (
//                       <option key={s} value={s}>
//                         {s}
//                       </option>
//                     ))}
//                   </select>
//                 </td>
//                 <td className="p-3">
//                   <div className="flex gap-1 justify-center">
//                     <button type="button" onClick={() => setView(o.id)} className="p-1.5 hover:bg-secondary">
//                       <Eye className="w-4 h-4" />
//                     </button>
//                     <button type="button" onClick={() => window.print()} className="p-1.5 hover:bg-secondary">
//                       <Printer className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {detail && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//           <div className="bg-card max-w-2xl w-full p-6 max-h-[90vh] overflow-auto">
//             <div className="flex justify-between items-start mb-4">
//               <div>
//                 <h2 className="font-display text-2xl">INVOICE — {detail.id}</h2>
//                 <p className="text-xs text-muted-foreground">{new Date(detail.createdAt).toLocaleString()}</p>
//               </div>
//               <button type="button" onClick={() => setView(null)} className="text-2xl">
//                 ×
//               </button>
//             </div>
//             <div className="grid grid-cols-2 gap-4 text-sm">
//               <div>
//                 <div className="text-xs text-muted-foreground uppercase">Customer</div>
//                 {detail.customerName}
//               </div>
//               <div>
//                 <div className="text-xs text-muted-foreground uppercase">Payment</div>
//                 {detail.paymentMethod}
//               </div>
//               <div className="col-span-2">
//                 <div className="text-xs text-muted-foreground uppercase">Address</div>
//                 {detail.shippingAddress}
//               </div>
//             </div>
//             <table className="w-full text-sm mt-4 border-t border-border">
//               <thead>
//                 <tr className="text-left text-xs uppercase">
//                   <th className="py-2">Item</th>
//                   <th className="text-center">Qty</th>
//                   <th className="text-right">Price</th>
//                   <th className="text-right">Subtotal</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {detail.items.map((it) => (
//                   <tr key={it.productId} className="border-t border-border">
//                     <td className="py-2">{it.name}</td>
//                     <td className="text-center">{it.quantity}</td>
//                     <td className="text-right">{formatCurrency(it.price)}</td>
//                     <td className="text-right">{formatCurrency(it.price * it.quantity)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div className="border-t border-border mt-4 pt-4 space-y-1 text-sm text-right">
//               <div>Subtotal: {formatCurrency(detail.subtotal)}</div>
//               <div>Shipping: {formatCurrency(detail.shipping)}</div>
//               <div className="font-display text-xl">
//                 TOTAL: <span className="text-accent-brand">{formatCurrency(detail.total)}</span>
//               </div>
//             </div>
//             <div className="flex gap-2 justify-end mt-4">
//               <button
//                 type="button"
//                 onClick={() => window.print()}
//                 className="bg-primary text-primary-foreground px-4 py-2 font-bold uppercase text-sm flex items-center gap-2"
//               >
//                 <Printer className="w-4 h-4" /> Print Invoice
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
export default function OrderAdminPage() {
  return (
    <div>
      <h1>Order Admin Page</h1>
    </div>
  );
}