// 'use client';

// import Link from 'next/link';
// import { useAppSelector } from '@/hooks/useAppSelector';
// import { CustomerLayout } from '@/components/layouts/CustomerLayout';

// export default function CategoriesPage() {
//   const categories = useAppSelector((s) => s.category.items);
//   const products = useAppSelector((s) => s.product.items);

//   return (
//     <CustomerLayout>
//       <div className="bg-primary py-12 text-primary-foreground">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           <h1 className="font-display text-5xl">ALL CATEGORIES</h1>
//         </div>
//       </div>
//       <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-12 sm:px-6 md:grid-cols-3 lg:grid-cols-4 lg:px-8">
//         {categories.map((c) => {
//           const count = products.filter((p) => p.categoryId === c.id).length;
//           return (
//             <Link
//               key={c.id}
//               href={`/category/${c.id}`}
//               className="group flex aspect-square flex-col items-center justify-center border border-border bg-gradient-to-br from-secondary to-muted transition-all hover:border-accent-brand hover:shadow-bold"
//             >
//               <span className="text-6xl">{c.icon}</span>
//               <h3 className="mt-3 font-display text-xl">{c.name}</h3>
//               <p className="mt-1 text-xs text-muted-foreground">{count} products</p>
//             </Link>
//           );
//         })}
//       </div>
//     </CustomerLayout>
//   );
// }
