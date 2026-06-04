// 'use client';

// import Link from 'next/link';
// import { useParams } from 'next/navigation';
// import { useAppSelector } from '@/hooks/useAppSelector';
// import { ProductCard } from '@/components/product/ProductCard';
// import { CustomerLayout } from '@/components/layouts/CustomerLayout';

// export default function CategoryPage() {
//   const { id } = useParams<{ id: string }>();
//   const category = useAppSelector((s) => s.category.items.find((c) => c.id === id));
//   const products = useAppSelector((s) => s.product.items.filter((p) => p.categoryId === id));

//   if (!category) {
//     return (
//       <CustomerLayout>
//         <div className="py-20 text-center">
//           <h1 className="font-display text-4xl">Category not found</h1>
//           <Link href="/shop" className="text-accent-brand underline mt-4 inline-block">Back to shop</Link>
//         </div>
//       </CustomerLayout>
//     );
//   }

//   return (
//     <CustomerLayout>
//       <section className="bg-primary text-primary-foreground py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6">
//           <span className="text-7xl">{category.icon}</span>
//           <div>
//             <p className="text-accent-brand text-xs uppercase tracking-widest font-bold">Category</p>
//             <h1 className="font-display text-5xl md:text-6xl mt-1">{category.name.toUpperCase()}</h1>
//             <p className="opacity-70 mt-2">{category.description} · {products.length} products</p>
//           </div>
//         </div>
//       </section>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         {products.length === 0 ? (
//           <div className="py-20 text-center text-muted-foreground">No products in this category yet.</div>
//         ) : (
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//             {products.map((p) => <ProductCard key={p.id} product={p} />)}
//           </div>
//         )}
//       </div>
//     </CustomerLayout>
//   );
// }

export default function CategoryPage() {
  return (
    <div>
      <h1>Category Page</h1>
    </div>
  );
}