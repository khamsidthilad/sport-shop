// 'use client';

// import { useState } from 'react';
// import { Plus, Pencil, Trash2, Search } from 'lucide-react';
// import { useAppDispatch } from '@/hooks/useAppDispatch';
// import { useAppSelector } from '@/hooks/useAppSelector';
// import { addProduct, updateProduct, deleteProduct } from '@/redux/slices/productSlice';
// import type { Product } from '@/lib/types';
// import { formatCurrency } from '@/utils/formatCurrency';
// import { toast } from 'sonner';

// export default function ProductMgmt() {
//   const dispatch = useAppDispatch();
//   const products = useAppSelector((s) => s.product.items);
//   const cats = useAppSelector((s) => s.category.items);
//   const brands = useAppSelector((s) => s.brand.items);
//   const [search, setSearch] = useState('');
//   const [page, setPage] = useState(1);
//   const [editing, setEditing] = useState<Product | null>(null);
//   const [open, setOpen] = useState(false);
//   const perPage = 10;

//   const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
//   const paged = filtered.slice((page - 1) * perPage, page * perPage);

//   const handleSave = (data: Product) => {
//     if (editing) { dispatch(updateProduct(data)); toast.success('Product updated'); }
//     else { dispatch(addProduct({ ...data, id: `p${Date.now()}` })); toast.success('Product added'); }
//     setOpen(false); setEditing(null);
//   };

//   return (
//     <div className="p-8 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="font-display text-3xl">PRODUCTS</h1>
//           <p className="text-muted-foreground">{filtered.length} total</p>
//         </div>
//         <button onClick={() => { setEditing(null); setOpen(true); }} className="bg-accent-brand text-accent-foreground px-4 py-2 font-bold uppercase text-sm tracking-wider hover:opacity-90 flex items-center gap-2">
//           <Plus className="w-4 h-4" /> Add Product
//         </button>
//       </div>
//       <div className="bg-card border border-border">
//         <div className="p-4 border-b border-border flex gap-2">
//           <div className="relative flex-1 max-w-sm">
//             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
//             <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search products..." className="w-full pl-9 pr-3 py-2 border border-border bg-background" />
//           </div>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-secondary text-xs uppercase tracking-wider">
//               <tr>
//                 <th className="text-left p-3">ID</th>
//                 <th className="text-left p-3">Product</th>
//                 <th className="text-left p-3">Brand</th>
//                 <th className="text-left p-3">Category</th>
//                 <th className="text-right p-3">Cost</th>
//                 <th className="text-right p-3">Price</th>
//                 <th className="text-right p-3">Stock</th>
//                 <th className="text-center p-3">Status</th>
//                 <th className="text-right p-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {paged.map((p) => (
//                 <tr key={p.id} className="border-t border-border hover:bg-secondary/50">
//                   <td className="p-3 font-mono text-xs">{p.id}</td>
//                   <td className="p-3 font-semibold">{p.name}</td>
//                   <td className="p-3">{brands.find((b) => b.id === p.brandId)?.name}</td>
//                   <td className="p-3">{cats.find((c) => c.id === p.categoryId)?.name}</td>
//                   <td className="p-3 text-right">{formatCurrency(p.costPrice)}</td>
//                   <td className="p-3 text-right font-bold">{formatCurrency(p.price)}</td>
//                   <td className="p-3 text-right">{p.quantity}</td>
//                   <td className="p-3 text-center">
//                     <span className={`px-2 py-0.5 text-xs ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-secondary'}`}>{p.status}</span>
//                   </td>
//                   <td className="p-3 text-right">
//                     <div className="inline-flex gap-1">
//                       <button onClick={() => { setEditing(p); setOpen(true); }} className="p-1.5 hover:bg-secondary"><Pencil className="w-4 h-4" /></button>
//                       <button onClick={() => { if (confirm('Delete product?')) { dispatch(deleteProduct(p.id)); toast.success('Deleted'); } }} className="p-1.5 hover:bg-destructive hover:text-destructive-foreground"><Trash2 className="w-4 h-4" /></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <div className="p-4 border-t border-border flex justify-center gap-1">
//           {Array.from({ length: Math.ceil(filtered.length / perPage) }).map((_, i) => (
//             <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 border ${page === i + 1 ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary'}`}>{i + 1}</button>
//           ))}
//         </div>
//       </div>
//       {open && <ProductModal product={editing} cats={cats} brands={brands} onSave={handleSave} onClose={() => { setOpen(false); setEditing(null); }} />}
//     </div>
//   );
// }

// function ProductModal({ product, cats, brands, onSave, onClose }: { product: Product | null; cats: any[]; brands: any[]; onSave: (p: Product) => void; onClose: () => void }) {
//   const [form, setForm] = useState<Product>(product ?? {
//     id: '', name: '', brandId: brands[0]?.id ?? '', categoryId: cats[0]?.id ?? '',
//     costPrice: 0, price: 0, quantity: 0, image: '', images: [], description: '',
//     specs: {}, sizes: ['One Size'], colors: ['Black'], rating: 5, reviews: 0, status: 'active',
//   });
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//       <div className="bg-card max-w-lg w-full p-6 max-h-[90vh] overflow-auto">
//         <h2 className="font-display text-2xl mb-4">{product ? 'EDIT' : 'ADD'} PRODUCT</h2>
//         <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-3">
//           <Inp label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
//           <div className="grid grid-cols-2 gap-3">
//             <Sel label="Brand" value={form.brandId} onChange={(v) => setForm({ ...form, brandId: v })} options={brands.map((b) => ({ v: b.id, l: b.name }))} />
//             <Sel label="Category" value={form.categoryId} onChange={(v) => setForm({ ...form, categoryId: v })} options={cats.map((c) => ({ v: c.id, l: c.name }))} />
//             <Inp label="Cost Price" type="number" value={String(form.costPrice)} onChange={(v) => setForm({ ...form, costPrice: +v })} />
//             <Inp label="Price" type="number" value={String(form.price)} onChange={(v) => setForm({ ...form, price: +v })} />
//             <Inp label="Quantity" type="number" value={String(form.quantity)} onChange={(v) => setForm({ ...form, quantity: +v })} />
//             <Sel label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v as Product['status'] })} options={[{ v: 'active', l: 'Active' }, { v: 'inactive', l: 'Inactive' }]} />
//           </div>
//           <Inp label="Image URL" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
//           <label className="block">
//             <span className="text-xs uppercase font-bold">Description</span>
//             <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full mt-1 px-3 py-2 border border-border bg-background" rows={3} />
//           </label>
//           <div className="flex gap-2 justify-end pt-2">
//             <button type="button" onClick={onClose} className="px-4 py-2 border border-border">Cancel</button>
//             <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 font-bold uppercase text-sm">Save</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// const Inp = ({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) => (
//   <label className="block">
//     <span className="text-xs uppercase font-bold tracking-widest">{label}</span>
//     <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border bg-background" />
//   </label>
// );
// const Sel = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { v: string; l: string }[] }) => (
//   <label className="block">
//     <span className="text-xs uppercase font-bold tracking-widest">{label}</span>
//     <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border bg-background">
//       {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
//     </select>
//   </label>
// );

export default function ProductPage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="font-display text-3xl">PRODUCT MANAGEMENT</h1>
      <p className="text-muted-foreground">This section is under construction. Please check back later.</p>
    </div>
  );
}