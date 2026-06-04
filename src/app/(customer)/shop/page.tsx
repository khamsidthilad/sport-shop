// 'use client';

// import { useMemo, useState } from 'react';
// import { Search, SlidersHorizontal } from 'lucide-react';
// import { useAppSelector } from '@/hooks/useAppSelector';
// import { ProductCard } from '@/components/product/ProductCard';
// import { CustomerLayout } from '@/components/layouts/CustomerLayout';

// export default function ShopPage() {
//   const products = useAppSelector((s) => s.product.items);
//   const categories = useAppSelector((s) => s.category.items);
//   const brands = useAppSelector((s) => s.brand.items);

//   const [search, setSearch] = useState('');
//   const [catId, setCatId] = useState<string>('');
//   const [brandId, setBrandId] = useState<string>('');
//   const [maxPrice, setMaxPrice] = useState<number>(10000);
//   const [sort, setSort] = useState<string>('featured');
//   const [page, setPage] = useState(1);
//   const perPage = 12;

//   const filtered = useMemo(() => {
//     let list = products.filter((p) => {
//       if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
//       if (catId && p.categoryId !== catId) return false;
//       if (brandId && p.brandId !== brandId) return false;
//       const eff = p.discountPrice ?? p.price;
//       if (eff > maxPrice) return false;
//       return true;
//     });
//     switch (sort) {
//       case 'price-asc':
//         list = [...list].sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
//         break;
//       case 'price-desc':
//         list = [...list].sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
//         break;
//       case 'rating':
//         list = [...list].sort((a, b) => b.rating - a.rating);
//         break;
//       case 'name':
//         list = [...list].sort((a, b) => a.name.localeCompare(b.name));
//         break;
//     }
//     return list;
//   }, [products, search, catId, brandId, maxPrice, sort]);

//   const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
//   const paged = filtered.slice((page - 1) * perPage, page * perPage);

//   return (
//     <CustomerLayout>
//       <div className="bg-primary py-12 text-primary-foreground">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           <h1 className="font-display text-5xl md:text-6xl">SHOP ALL</h1>
//           <p className="mt-2 opacity-70">{filtered.length} products</p>
//         </div>
//       </div>
//       <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
//         <aside className="space-y-6">
//           <div>
//             <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
//               <Search className="h-4 w-4" /> Search
//             </label>
//             <input
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setPage(1);
//               }}
//               placeholder="Search products..."
//               className="w-full border border-border bg-background px-3 py-2"
//             />
//           </div>
//           <div>
//             <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
//               <SlidersHorizontal className="h-4 w-4" /> Category
//             </label>
//             <select
//               value={catId}
//               onChange={(e) => {
//                 setCatId(e.target.value);
//                 setPage(1);
//               }}
//               className="w-full border border-border bg-background px-3 py-2"
//             >
//               <option value="">All categories</option>
//               {categories.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="mb-2 block text-xs font-bold uppercase tracking-widest">Brand</label>
//             <select
//               value={brandId}
//               onChange={(e) => {
//                 setBrandId(e.target.value);
//                 setPage(1);
//               }}
//               className="w-full border border-border bg-background px-3 py-2"
//             >
//               <option value="">All brands</option>
//               {brands.map((b) => (
//                 <option key={b.id} value={b.id}>
//                   {b.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="mb-2 block text-xs font-bold uppercase tracking-widest">
//               Max Price: ฿{maxPrice.toLocaleString()}
//             </label>
//             <input
//               type="range"
//               min={500}
//               max={10000}
//               step={500}
//               value={maxPrice}
//               onChange={(e) => setMaxPrice(+e.target.value)}
//               className="w-full accent-[oklch(0.62_0.24_25)]"
//             />
//           </div>
//           <button
//             type="button"
//             onClick={() => {
//               setSearch('');
//               setCatId('');
//               setBrandId('');
//               setMaxPrice(10000);
//               setPage(1);
//             }}
//             className="w-full border border-border py-2 text-sm font-semibold uppercase hover:bg-secondary"
//           >
//             Reset Filters
//           </button>
//         </aside>
//         <div>
//           <div className="mb-4 flex items-center justify-between">
//             <span className="text-sm text-muted-foreground">
//               Showing {paged.length} of {filtered.length}
//             </span>
//             <select
//               value={sort}
//               onChange={(e) => setSort(e.target.value)}
//               className="border border-border bg-background px-3 py-2 text-sm"
//             >
//               <option value="featured">Featured</option>
//               <option value="price-asc">Price: Low to High</option>
//               <option value="price-desc">Price: High to Low</option>
//               <option value="rating">Top Rated</option>
//               <option value="name">Name A-Z</option>
//             </select>
//           </div>
//           {paged.length === 0 ? (
//             <div className="py-20 text-center text-muted-foreground">No products match your filters.</div>
//           ) : (
//             <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
//               {paged.map((p) => (
//                 <ProductCard key={p.id} product={p} />
//               ))}
//             </div>
//           )}
//           {totalPages > 1 && (
//             <div className="mt-8 flex justify-center gap-2">
//               {Array.from({ length: totalPages }).map((_, i) => (
//                 <button
//                   key={i}
//                   type="button"
//                   onClick={() => setPage(i + 1)}
//                   className={`h-10 w-10 border ${
//                     page === i + 1
//                       ? 'border-primary bg-primary text-primary-foreground'
//                       : 'border-border hover:bg-secondary'
//                   }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </CustomerLayout>
//   );
// }
