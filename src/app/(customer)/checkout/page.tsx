// 'use client';
// import { useRouter } from 'next/navigation';

// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { useAppDispatch } from '@/hooks/useAppDispatch';
// import { useAppSelector } from '@/hooks/useAppSelector';
// import { clearCart } from '@/redux/slices/cartSlice';
// import { addOrder } from '@/redux/slices/orderSlice';
// import { CustomerLayout } from '@/components/layouts/CustomerLayout';
// import { formatCurrency } from '@/utils/formatCurrency';
// import { toast } from 'sonner';
// import { getCustomerOrderId, getDisplayName } from '@/types/auth.type';

// const schema = z.object({
//   fullName: z.string().trim().min(2, 'Required').max(100),
//   email: z.string().trim().email().max(255),
//   tel: z.string().trim().min(8, 'Required').max(20),
//   address: z.string().trim().min(5, 'Required').max(255),
//   city: z.string().trim().min(2).max(100),
//   postalCode: z.string().trim().min(4).max(10),
//   payment: z.enum(['COD', 'QR', 'BankTransfer']),
// });

// type FormData = z.infer<typeof schema>;

// export default function CheckoutPage() {
//   const dispatch = useAppDispatch();
//   const router = useRouter();
//   const cart = useAppSelector((s) => s.cart.items);
//   const products = useAppSelector((s) => s.product.items);
//   const session = useAppSelector((s) => s.auth.customerSession);

//   const enriched = cart.map((c) => ({ ...c, product: products.find((p) => p.id === c.productId)! })).filter((c) => c.product);
//   const subtotal = enriched.reduce((s, c) => s + (c.product.discountPrice ?? c.product.price) * c.quantity, 0);
//   const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 100;
//   const total = subtotal + shipping;

//   const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       payment: 'COD',
//       fullName: session ? getDisplayName(session) : '',
//       email: session?.customer.Email ?? '',
//       tel: session?.customer.Tel ?? '',
//       address: session?.customer.address ?? '',
//     },
//   });

//   const onSubmit = (data: FormData) => {
//     const orderId = `ORD-${Date.now().toString().slice(-6)}`;
//     dispatch(addOrder({
//       id: orderId,
//       customerId: session ? getCustomerOrderId(session) : 'guest',
//       customerName: data.fullName,
//       items: enriched.map((c) => ({ productId: c.productId, name: c.product.name, price: c.product.discountPrice ?? c.product.price, quantity: c.quantity })),
//       subtotal, shipping, total,
//       status: 'Pending',
//       paymentMethod: data.payment,
//       shippingAddress: `${data.address}, ${data.city} ${data.postalCode}`,
//       createdAt: new Date().toISOString(),
//     }));
//     dispatch(clearCart());
//     toast.success(`Order ${orderId} placed!`);
//     router.push('/profile');
//   };

//   if (cart.length === 0) {
//     return (
//       <CustomerLayout>
//         <div className="py-20 text-center">
//           <h1 className="font-display text-3xl">Your cart is empty</h1>
//         </div>
//       </CustomerLayout>
//     );
//   }

//   return (
//     <CustomerLayout>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <h1 className="font-display text-4xl md:text-5xl mb-8">CHECKOUT</h1>
//         <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-[1fr_360px] gap-8">
//           <div className="space-y-6">
//             <section className="border border-border p-6">
//               <h2 className="font-display text-xl mb-4">CUSTOMER INFORMATION</h2>
//               <div className="grid sm:grid-cols-2 gap-4">
//                 <Field label="Full Name" error={errors.fullName?.message} {...register('fullName')} />
//                 <Field label="Email" type="email" error={errors.email?.message} {...register('email')} />
//                 <Field label="Telephone" error={errors.tel?.message} {...register('tel')} />
//               </div>
//             </section>
//             <section className="border border-border p-6">
//               <h2 className="font-display text-xl mb-4">SHIPPING ADDRESS</h2>
//               <div className="grid gap-4">
//                 <Field label="Address" error={errors.address?.message} {...register('address')} />
//                 <div className="grid sm:grid-cols-2 gap-4">
//                   <Field label="City" error={errors.city?.message} {...register('city')} />
//                   <Field label="Postal Code" error={errors.postalCode?.message} {...register('postalCode')} />
//                 </div>
//               </div>
//             </section>
//             <section className="border border-border p-6">
//               <h2 className="font-display text-xl mb-4">PAYMENT METHOD</h2>
//               <div className="space-y-2">
//                 {[
//                   { v: 'COD', l: 'Cash on Delivery', d: 'Pay when you receive your order' },
//                   { v: 'QR', l: 'QR Payment', d: 'Scan QR code to pay instantly' },
//                   { v: 'BankTransfer', l: 'Bank Transfer', d: 'Transfer to our bank account' },
//                 ].map((p) => (
//                   <label key={p.v} className="flex items-start gap-3 p-3 border border-border cursor-pointer hover:border-primary">
//                     <input type="radio" value={p.v} {...register('payment')} className="mt-1 accent-[oklch(0.62_0.24_25)]" />
//                     <div>
//                       <div className="font-semibold">{p.l}</div>
//                       <div className="text-xs text-muted-foreground">{p.d}</div>
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             </section>
//           </div>
//           <aside className="border border-border p-6 h-fit sticky top-24">
//             <h2 className="font-display text-xl mb-4">ORDER SUMMARY</h2>
//             <div className="space-y-2 text-sm max-h-60 overflow-auto">
//               {enriched.map((c) => (
//                 <div key={`${c.productId}-${c.size}-${c.color}`} className="flex justify-between">
//                   <span className="truncate pr-2">{c.product.name} × {c.quantity}</span>
//                   <span className="shrink-0">{formatCurrency((c.product.discountPrice ?? c.product.price) * c.quantity)}</span>
//                 </div>
//               ))}
//             </div>
//             <div className="border-t border-border mt-4 pt-4 space-y-1 text-sm">
//               <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
//               <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span></div>
//             </div>
//             <div className="border-t border-border my-4 pt-4 flex justify-between font-display text-xl">
//               <span>Total</span><span className="text-accent-brand">{formatCurrency(total)}</span>
//             </div>
//             <button type="submit" className="w-full bg-primary text-primary-foreground py-3 font-bold uppercase tracking-wider hover:bg-accent-brand">
//               Place Order
//             </button>
//           </aside>
//         </form>
//       </div>
//     </CustomerLayout>
//   );
// }

// const Field = ({ label, error, ...rest }: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
//   <label className="block">
//     <span className="text-xs uppercase tracking-widest font-bold">{label}</span>
//     <input {...rest} className="w-full mt-1 px-3 py-2 border border-border bg-background" />
//     {error && <span className="text-xs text-destructive mt-1 block">{error}</span>}
//   </label>
// );

export default function CheckoutPage() {
  return (
    <div>
      <h1>Checkout Page</h1>
    </div>
  );
}