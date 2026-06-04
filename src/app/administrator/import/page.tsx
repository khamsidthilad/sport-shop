// 'use client';

// import { useState } from 'react';
// import { Plus, Trash2 } from 'lucide-react';
// import { useAppDispatch } from '@/hooks/useAppDispatch';
// import { useAppSelector } from '@/hooks/useAppSelector';
// import { addImport, deleteImport } from '@/redux/slices/importSlice';
// import { updateProduct } from '@/redux/slices/productSlice';
// import { formatCurrency } from '@/utils/formatCurrency';
// import { toast } from 'sonner';

// export default function ImportAdminPage() {
//   const dispatch = useAppDispatch();
//   const records = useAppSelector((s) => s.import.items);
//   const products = useAppSelector((s) => s.product.items);
//   const [open, setOpen] = useState(false);
//   const totalValue = records.reduce((s, r) => s + r.total, 0);

//   return (
//     <div className="p-8 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="font-display text-3xl">IMPORTS</h1>
//           <p className="text-muted-foreground">
//             {records.length} records · Total value {formatCurrency(totalValue)}
//           </p>
//         </div>
//         <button
//           type="button"
//           onClick={() => setOpen(true)}
//           className="bg-accent-brand text-accent-foreground px-4 py-2 font-bold uppercase text-sm flex items-center gap-2"
//         >
//           <Plus className="w-4 h-4" /> Import Stock
//         </button>
//       </div>
//       <div className="bg-card border border-border overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-secondary text-xs uppercase">
//             <tr>
//               <th className="text-left p-3">ID</th>
//               <th className="text-left p-3">Product</th>
//               <th className="text-left p-3">Supplier</th>
//               <th className="text-right p-3">Qty</th>
//               <th className="text-right p-3">Cost</th>
//               <th className="text-right p-3">Total</th>
//               <th className="text-left p-3">Date</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {records.map((r) => (
//               <tr key={r.id} className="border-t border-border">
//                 <td className="p-3 font-mono text-xs">{r.id}</td>
//                 <td className="p-3 font-semibold">{r.productName}</td>
//                 <td className="p-3">{r.supplier}</td>
//                 <td className="p-3 text-right">{r.quantity}</td>
//                 <td className="p-3 text-right">{formatCurrency(r.costPrice)}</td>
//                 <td className="p-3 text-right font-bold">{formatCurrency(r.total)}</td>
//                 <td className="p-3 text-xs">{new Date(r.date).toLocaleDateString()}</td>
//                 <td className="p-3 text-center">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       if (confirm('Delete?')) {
//                         dispatch(deleteImport(r.id));
//                         toast.success('Deleted');
//                       }
//                     }}
//                     className="p-1.5 hover:bg-destructive hover:text-destructive-foreground"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {open && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//           <form
//             className="bg-card max-w-md w-full p-6 space-y-3"
//             onSubmit={(e) => {
//               e.preventDefault();
//               const f = new FormData(e.target as HTMLFormElement);
//               const productId = String(f.get('productId'));
//               const product = products.find((p) => p.id === productId);
//               if (!product) return;
//               const quantity = +String(f.get('quantity'));
//               const supplier = String(f.get('supplier'));
//               dispatch(
//                 addImport({
//                   id: `IMP-${Date.now().toString().slice(-6)}`,
//                   productId,
//                   productName: product.name,
//                   supplier,
//                   quantity,
//                   costPrice: product.costPrice,
//                   total: product.costPrice * quantity,
//                   date: new Date().toISOString(),
//                 }),
//               );
//               dispatch(updateProduct({ ...product, quantity: product.quantity + quantity }));
//               toast.success('Stock imported & updated');
//               setOpen(false);
//             }}
//           >
//             <h2 className="font-display text-2xl mb-2">IMPORT STOCK</h2>
//             <label className="block">
//               <span className="text-xs uppercase font-bold">Product</span>
//               <select name="productId" required className="w-full mt-1 px-3 py-2 border border-border bg-background">
//                 {products.map((p) => (
//                   <option key={p.id} value={p.id}>
//                     {p.name}
//                   </option>
//                 ))}
//               </select>
//             </label>
//             <label className="block">
//               <span className="text-xs uppercase font-bold">Supplier</span>
//               <input name="supplier" required className="w-full mt-1 px-3 py-2 border border-border bg-background" />
//             </label>
//             <label className="block">
//               <span className="text-xs uppercase font-bold">Quantity</span>
//               <input
//                 name="quantity"
//                 type="number"
//                 min={1}
//                 required
//                 className="w-full mt-1 px-3 py-2 border border-border bg-background"
//               />
//             </label>
//             <div className="flex gap-2 justify-end">
//               <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 border border-border">
//                 Cancel
//               </button>
//               <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 font-bold uppercase text-sm">
//                 Import
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }
