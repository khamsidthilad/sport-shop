// 'use client';

// import Link from 'next/link';
// import { useParams, useRouter } from 'next/navigation';
// import { useState } from 'react';
// import { Star, Truck, Shield, RotateCcw, Plus, Minus } from 'lucide-react';
// import { useAppDispatch } from '@/hooks/useAppDispatch';
// import { useAppSelector } from '@/hooks/useAppSelector';
// // import { addToCart } from '@/redux/slices/cartSlice';
// import { ProductCard } from '@/components/product/ProductCard';
// import { CustomerLayout } from '@/components/layouts/CustomerLayout';
// import { formatCurrency } from '@/utils/formatCurrency';
// import { toast } from 'sonner';

// export default function ProductDetailPage() {
//   const { id } = useParams<{ id: string }>();
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const product = useAppSelector((s) => s.product.items.find((p) => p.id === id));
//   const brand = useAppSelector((s) =>
//     product ? s.brand.items.find((b) => b.id === product.brandId) : undefined,
//   );
//   const category = useAppSelector((s) =>
//     product ? s.category.items.find((c) => c.id === product.categoryId) : undefined,
//   );
//   const related = useAppSelector((s) =>
//     product
//       ? s.product.items.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4)
//       : [],
//   );

//   const [size, setSize] = useState('');
//   const [color, setColor] = useState('');
//   const [qty, setQty] = useState(1);

//   if (!product) {
//     return (
//       <CustomerLayout>
//         <div className="py-20 text-center">
//           <h1 className="font-display text-4xl">Product not found</h1>
//           <Link href="/shop" className="mt-4 inline-block text-accent-brand underline">
//             Back to shop
//           </Link>
//         </div>
//       </CustomerLayout>
//     );
//   }

//   const handleAdd = (buyNow = false) => {
//     if (product.sizes.length > 1 && !size) {
//       toast.error('Please select a size');
//       return;
//     }
//     if (product.colors.length > 1 && !color) {
//       toast.error('Please select a color');
//       return;
//     }
//     dispatch(
//       addToCart({
//         productId: product.id,
//         quantity: qty,
//         size: size || product.sizes[0],
//         color: color || product.colors[0],
//       }),
//     );
//     toast.success('Added to cart');
//     if (buyNow) router.push('/cart');
//   };

//   const effectivePrice = product.discountPrice ?? product.price;

//   return (
//     <CustomerLayout>
//       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         <nav className="mb-6 text-sm text-muted-foreground">
//           <Link href="/" className="hover:text-accent-brand">
//             Home
//           </Link>{' '}
//           /{' '}
//           <Link href="/shop" className="hover:text-accent-brand">
//             Shop
//           </Link>{' '}
//           / {product.name}
//         </nav>
//         <div className="grid gap-12 lg:grid-cols-2">
//           <div>
//             <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary to-muted">
//               <div className="absolute inset-0 flex items-center justify-center font-display text-[16rem] opacity-20">
//                 {product.name.charAt(0)}
//               </div>
//               {product.discountPrice && (
//                 <span className="absolute left-4 top-4 bg-accent-brand px-3 py-1 font-bold text-accent-foreground">
//                   -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
//                 </span>
//               )}
//             </div>
//             <div className="mt-4 grid grid-cols-4 gap-2">
//               {[0, 1, 2, 3].map((i) => (
//                 <div
//                   key={i}
//                   className="flex aspect-square items-center justify-center border border-border bg-secondary font-display text-3xl opacity-30"
//                 >
//                   {product.name.charAt(0)}
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div>
//             <p className="text-xs font-bold uppercase tracking-widest text-accent-brand">
//               {brand?.name} · {category?.name}
//             </p>
//             <h1 className="font-display mt-2 text-4xl md:text-5xl">{product.name}</h1>
//             <div className="mt-3 flex items-center gap-2">
//               <div className="flex">
//                 {Array.from({ length: 5 }).map((_, i) => (
//                   <Star
//                     key={i}
//                     className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-accent-brand text-accent-brand' : 'text-muted'}`}
//                   />
//                 ))}
//               </div>
//               <span className="text-sm">
//                 {product.rating} ({product.reviews} reviews)
//               </span>
//             </div>
//             <div className="mt-6 flex items-end gap-3">
//               <span className="font-display text-4xl text-accent-brand">{formatCurrency(effectivePrice)}</span>
//               {product.discountPrice && (
//                 <span className="text-xl text-muted-foreground line-through">{formatCurrency(product.price)}</span>
//               )}
//             </div>
//             <p
//               className={`mt-3 text-sm font-semibold ${product.quantity > 0 ? 'text-green-600' : 'text-destructive'}`}
//             >
//               {product.quantity > 0 ? `In stock (${product.quantity} available)` : 'Out of stock'}
//             </p>
//             <p className="mt-6 text-muted-foreground">{product.description}</p>

//             {product.sizes.length > 1 && (
//               <div className="mt-6">
//                 <p className="mb-2 text-xs font-bold uppercase tracking-widest">Size</p>
//                 <div className="flex flex-wrap gap-2">
//                   {product.sizes.map((s) => (
//                     <button
//                       key={s}
//                       type="button"
//                       onClick={() => setSize(s)}
//                       className={`min-w-[3rem] border px-4 py-2 text-sm font-semibold ${
//                         size === s
//                           ? 'border-primary bg-primary text-primary-foreground'
//                           : 'border-border hover:border-primary'
//                       }`}
//                     >
//                       {s}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//             {product.colors.length > 1 && (
//               <div className="mt-4">
//                 <p className="mb-2 text-xs font-bold uppercase tracking-widest">Color</p>
//                 <div className="flex flex-wrap gap-2">
//                   {product.colors.map((c) => (
//                     <button
//                       key={c}
//                       type="button"
//                       onClick={() => setColor(c)}
//                       className={`border px-4 py-2 text-sm ${
//                         color === c
//                           ? 'border-primary bg-primary text-primary-foreground'
//                           : 'border-border hover:border-primary'
//                       }`}
//                     >
//                       {c}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//             <div className="mt-6 flex items-center gap-3">
//               <p className="text-xs font-bold uppercase tracking-widest">Quantity</p>
//               <div className="flex border border-border">
//                 <button
//                   type="button"
//                   onClick={() => setQty(Math.max(1, qty - 1))}
//                   className="px-3 py-2 hover:bg-secondary"
//                 >
//                   <Minus className="h-3 w-3" />
//                 </button>
//                 <span className="border-x border-border px-4 py-2 font-semibold">{qty}</span>
//                 <button type="button" onClick={() => setQty(qty + 1)} className="px-3 py-2 hover:bg-secondary">
//                   <Plus className="h-3 w-3" />
//                 </button>
//               </div>
//             </div>
//             <div className="mt-6 flex flex-col gap-3 sm:flex-row">
//               <button
//                 type="button"
//                 onClick={() => handleAdd(false)}
//                 disabled={product.quantity === 0}
//                 className="flex-1 bg-primary py-4 font-bold uppercase tracking-wider text-primary-foreground hover:bg-accent-brand disabled:opacity-50"
//               >
//                 Add To Cart
//               </button>
//               <button
//                 type="button"
//                 onClick={() => handleAdd(true)}
//                 disabled={product.quantity === 0}
//                 className="flex-1 bg-accent-brand py-4 font-bold uppercase tracking-wider text-accent-foreground hover:opacity-90 disabled:opacity-50"
//               >
//                 Buy Now
//               </button>
//             </div>
//             <div className="mt-8 grid grid-cols-1 gap-4 border-t border-border pt-6 text-xs sm:grid-cols-3">
//               <div className="flex items-center gap-2">
//                 <Truck className="h-5 w-5 text-accent-brand" /> Free shipping over ฿5,000
//               </div>
//               <div className="flex items-center gap-2">
//                 <Shield className="h-5 w-5 text-accent-brand" /> 100% Authentic
//               </div>
//               <div className="flex items-center gap-2">
//                 <RotateCcw className="h-5 w-5 text-accent-brand" /> 30-day returns
//               </div>
//             </div>
//             <div className="mt-8">
//               <h3 className="font-display mb-3 text-xl">Specifications</h3>
//               <dl className="grid grid-cols-2 gap-2 text-sm">
//                 {Object.entries(product.specs).map(([k, v]) => (
//                   <div key={k} className="flex justify-between border-b border-border py-2">
//                     <dt className="text-muted-foreground">{k}</dt>
//                     <dd className="font-semibold">{v}</dd>
//                   </div>
//                 ))}
//               </dl>
//             </div>
//           </div>
//         </div>
//         {related.length > 0 && (
//           <div className="mt-16">
//             <h2 className="font-display mb-6 text-3xl">RELATED PRODUCTS</h2>
//             <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
//               {related.map((p) => (
//                 <ProductCard key={p.id} product={p} />
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </CustomerLayout>
//   );
// }
