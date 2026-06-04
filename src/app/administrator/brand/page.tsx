// 'use client';

// import { useState } from 'react';
// import { Plus, Pencil, Trash2 } from 'lucide-react';
// import { useAppDispatch } from '@/hooks/useAppDispatch';
// import { useAppSelector } from '@/hooks/useAppSelector';
// import { addBrand, updateBrand, deleteBrand } from '@/redux/slices/brandSlice';
// import type { Brand } from '@/lib/types';
// import { toast } from 'sonner';

// function BrandForm({
//   brand,
//   onSave,
//   onClose,
// }: {
//   brand: Brand | null;
//   onSave: (b: Brand) => void;
//   onClose: () => void;
// }) {
//   const [form, setForm] = useState<Brand>(
//     brand ?? { id: '', name: '', description: '', country: '' },
//   );

//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         onSave(form);
//       }}
//       className="space-y-3"
//     >
//       <label className="block">
//         <span className="text-xs font-bold uppercase">Name</span>
//         <input
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//           className="mt-1 w-full border border-border bg-background px-3 py-2"
//           required
//         />
//       </label>
//       <label className="block">
//         <span className="text-xs font-bold uppercase">Tagline</span>
//         <input
//           value={form.description}
//           onChange={(e) => setForm({ ...form, description: e.target.value })}
//           className="mt-1 w-full border border-border bg-background px-3 py-2"
//         />
//       </label>
//       <label className="block">
//         <span className="text-xs font-bold uppercase">Country</span>
//         <input
//           value={form.country}
//           onChange={(e) => setForm({ ...form, country: e.target.value })}
//           className="mt-1 w-full border border-border bg-background px-3 py-2"
//         />
//       </label>
//       <div className="flex justify-end gap-2">
//         <button type="button" onClick={onClose} className="border border-border px-4 py-2">
//           Cancel
//         </button>
//         <button type="submit" className="bg-primary px-4 py-2 text-sm font-bold uppercase text-primary-foreground">
//           Save
//         </button>
//       </div>
//     </form>
//   );
// }

// export default function BrandAdminPage() {
//   const dispatch = useAppDispatch();
//   const brands = useAppSelector((s) => s.brand.items);
//   const [editing, setEditing] = useState<Brand | null>(null);
//   const [open, setOpen] = useState(false);

//   const onSave = (b: Brand) => {
//     if (editing) {
//       dispatch(updateBrand(b));
//       toast.success('Updated');
//     } else {
//       dispatch(addBrand({ ...b, id: `b${Date.now()}` }));
//       toast.success('Added');
//     }
//     setOpen(false);
//     setEditing(null);
//   };

//   return (
//     <div className="space-y-6 p-8">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="font-display text-3xl">BRANDS</h1>
//           <p className="text-muted-foreground">{brands.length} total</p>
//         </div>
//         <button
//           type="button"
//           onClick={() => {
//             setEditing(null);
//             setOpen(true);
//           }}
//           className="flex items-center gap-2 bg-accent-brand px-4 py-2 text-sm font-bold uppercase text-accent-foreground"
//         >
//           <Plus className="h-4 w-4" /> Add
//         </button>
//       </div>
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {brands.map((b) => (
//           <div key={b.id} className="border border-border bg-card p-5">
//             <div className="font-display text-2xl">{b.name}</div>
//             <div className="text-sm text-accent-brand">{b.description}</div>
//             <div className="mt-1 text-xs text-muted-foreground">{b.country}</div>
//             <div className="mt-3 flex gap-1">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setEditing(b);
//                   setOpen(true);
//                 }}
//                 className="flex flex-1 items-center justify-center gap-1 border border-border py-1 text-xs hover:bg-secondary"
//               >
//                 <Pencil className="h-3 w-3" /> Edit
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   if (confirm('Delete?')) {
//                     dispatch(deleteBrand(b.id));
//                     toast.success('Deleted');
//                   }
//                 }}
//                 className="border border-border px-3 py-1 hover:bg-destructive hover:text-destructive-foreground"
//               >
//                 <Trash2 className="h-3 w-3" />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//       {open && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//           <div className="w-full max-w-md bg-card p-6">
//             <h2 className="mb-4 font-display text-2xl">{editing ? 'EDIT' : 'ADD'} BRAND</h2>
//             <BrandForm
//               brand={editing}
//               onSave={onSave}
//               onClose={() => {
//                 setOpen(false);
//                 setEditing(null);
//               }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
export default function BrandAdminPage() {
  return (
    <div>
      <h1>Brand Admin Page</h1>
    </div>
  );
}