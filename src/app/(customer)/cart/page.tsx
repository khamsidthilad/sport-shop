// 'use client';

// import Link from 'next/link';
// import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
// import { useAppDispatch } from '@/hooks/useAppDispatch';
// import { useAppSelector } from '@/hooks/useAppSelector';
// import { removeFromCart, updateQuantity } from '@/redux/slices/cartSlice';
// import { CustomerLayout } from '@/components/layouts/CustomerLayout';
// import { formatCurrency } from '@/utils/formatCurrency';

// export default function CartPage() {
//   const dispatch = useAppDispatch();
//   const cart = useAppSelector((s) => s.cart.items);
//   const products = useAppSelector((s) => s.product.items);

//   const enriched = cart.map((c) => {
//     const p = products.find((x) => x.id === c.productId);
//     return { ...c, product: p };
//   }).filter((c) => c.product);

//   const subtotal = enriched.reduce((s, c) => s + (c.product!.discountPrice ?? c.product!.price) * c.quantity, 0);
//   const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 100;
//   const total = subtotal + shipping;

//   if (cart.length === 0) {
//     return (
//       <CustomerLayout>
//         <div className="max-w-3xl mx-auto px-4 py-20 text-center">
//           <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground" />
//           <h1 className="font-display text-4xl mt-6">YOUR CART IS EMPTY</h1>
//           <p className="text-muted-foreground mt-2">Add some gear and come back.</p>
//           <Link href="/shop" className="inline-block mt-6 bg-primary text-primary-foreground px-8 py-3 font-bold uppercase tracking-wider hover:bg-accent-brand">Shop Now</Link>
//         </div>
//       </CustomerLayout>
//     );
//   }

//   return (
//     <CustomerLayout>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <h1 className="font-display text-4xl md:text-5xl mb-8">YOUR CART</h1>
//         <div className="grid lg:grid-cols-[1fr_360px] gap-8">
//           <div className="space-y-4">
//             {enriched.map((c) => (
//               <div key={`${c.productId}-${c.size}-${c.color}`} className="flex gap-4 border border-border p-4">
//                 <div className="w-24 h-24 bg-secondary flex items-center justify-center text-4xl font-display opacity-30 shrink-0">
//                   {c.product!.name.charAt(0)}
//                 </div>
//                 <div className="flex-1">
//                   <Link href={`/product/${c.productId}`} className="font-semibold hover:text-accent-brand">{c.product!.name}</Link>
//                   <p className="text-xs text-muted-foreground mt-1">{c.size && `Size: ${c.size}`} {c.color && `· Color: ${c.color}`}</p>
//                   <p className="font-bold text-accent-brand mt-1">{formatCurrency(c.product!.discountPrice ?? c.product!.price)}</p>
//                 </div>
//                 <div className="flex flex-col items-end justify-between">
//                   <button onClick={() => dispatch(removeFromCart({ productId: c.productId, size: c.size, color: c.color }))} className="text-muted-foreground hover:text-destructive">
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                   <div className="flex border border-border">
//                     <button onClick={() => dispatch(updateQuantity({ productId: c.productId, quantity: c.quantity - 1, size: c.size, color: c.color }))} className="px-2 py-1 hover:bg-secondary"><Minus className="w-3 h-3" /></button>
//                     <span className="px-3 py-1 border-x border-border text-sm font-semibold">{c.quantity}</span>
//                     <button onClick={() => dispatch(updateQuantity({ productId: c.productId, quantity: c.quantity + 1, size: c.size, color: c.color }))} className="px-2 py-1 hover:bg-secondary"><Plus className="w-3 h-3" /></button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <aside className="border border-border p-6 h-fit sticky top-24">
//             <h2 className="font-display text-2xl mb-4">ORDER SUMMARY</h2>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
//               <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span></div>
//               {shipping > 0 && <p className="text-xs text-muted-foreground">Add {formatCurrency(5000 - subtotal)} more for free shipping</p>}
//             </div>
//             <div className="border-t border-border my-4 pt-4 flex justify-between font-display text-xl">
//               <span>Total</span><span className="text-accent-brand">{formatCurrency(total)}</span>
//             </div>
//             <Link href="/checkout" className="block text-center bg-primary text-primary-foreground py-3 font-bold uppercase tracking-wider hover:bg-accent-brand">
//               Checkout
//             </Link>
//           </aside>
//         </div>
//       </div>
//     </CustomerLayout>
//   );
// }
