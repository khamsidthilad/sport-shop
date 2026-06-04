// 'use client';

// import Link from 'next/link';
// import { useAppSelector } from '@/hooks/useAppSelector';
// import { CustomerLayout } from '@/components/layouts/CustomerLayout';

// export default function BrandsPage() {
//   const brands = useAppSelector((s) => s.brand.items);
//   const products = useAppSelector((s) => s.product.items);

//   return (
//     <CustomerLayout>
//       <div className="bg-primary py-12 text-primary-foreground">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           <h1 className="font-display text-5xl">POPULAR BRANDS</h1>
//         </div>
//       </div>
//       <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
//         {brands.map((b) => {
//           const count = products.filter((p) => p.brandId === b.id).length;
//           return (
//             <Link
//               key={b.id}
//               href={`/shop?brand=${b.id}`}
//               className="border border-border p-6 transition-all hover:border-accent-brand hover:shadow-bold"
//             >
//               <div className="font-display text-3xl">{b.name}</div>
//               <p className="mt-1 text-sm text-accent-brand">{b.description}</p>
//               <p className="mt-2 text-xs text-muted-foreground">
//                 {b.country} · {count} products
//               </p>
//             </Link>
//           );
//         })}
//       </div>
//     </CustomerLayout>
//   );
// }
