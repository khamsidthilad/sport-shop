// 'use client';

// import { useState } from 'react';
// import { Plus, Pencil, Trash2 } from 'lucide-react';
// import { useAppDispatch } from '@/hooks/useAppDispatch';
// import { useAppSelector } from '@/hooks/useAppSelector';
// import { addCategory, updateCategory, deleteCategory } from '@/redux/slices/categorySlice';
// import type { Category } from '@/lib/types';
// import { toast } from 'sonner';

// function CategoryModal({
//   cat,
//   onSave,
//   onClose,
// }: {
//   cat: Category | null;
//   onSave: (c: Category) => void;
//   onClose: () => void;
// }) {
//   const [form, setForm] = useState<Category>(
//     cat ?? { id: '', name: '', slug: '', description: '', icon: '🏆' },
//   );

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//       <div className="bg-card max-w-md w-full p-6">
//         <h2 className="font-display text-2xl mb-4">{cat ? 'EDIT' : 'ADD'} CATEGORY</h2>
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             onSave(form);
//           }}
//           className="space-y-3"
//         >
//           <label className="block">
//             <span className="text-xs uppercase font-bold">Name</span>
//             <input
//               value={form.name}
//               onChange={(e) =>
//                 setForm({
//                   ...form,
//                   name: e.target.value,
//                   slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
//                 })
//               }
//               className="w-full mt-1 px-3 py-2 border border-border bg-background"
//               required
//             />
//           </label>
//           <label className="block">
//             <span className="text-xs uppercase font-bold">Icon (emoji)</span>
//             <input
//               value={form.icon}
//               onChange={(e) => setForm({ ...form, icon: e.target.value })}
//               className="w-full mt-1 px-3 py-2 border border-border bg-background"
//             />
//           </label>
//           <label className="block">
//             <span className="text-xs uppercase font-bold">Description</span>
//             <input
//               value={form.description}
//               onChange={(e) => setForm({ ...form, description: e.target.value })}
//               className="w-full mt-1 px-3 py-2 border border-border bg-background"
//             />
//           </label>
//           <div className="flex gap-2 justify-end">
//             <button type="button" onClick={onClose} className="px-4 py-2 border border-border">
//               Cancel
//             </button>
//             <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 font-bold uppercase text-sm">
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default function CategoryAdminPage() {
//   const dispatch = useAppDispatch();
//   const cats = useAppSelector((s) => s.category.items);
//   const [editing, setEditing] = useState<Category | null>(null);
//   const [open, setOpen] = useState(false);

//   const onSave = (c: Category) => {
//     if (editing) {
//       dispatch(updateCategory(c));
//       toast.success('Updated');
//     } else {
//       dispatch(addCategory({ ...c, id: `c${Date.now()}` }));
//       toast.success('Added');
//     }
//     setOpen(false);
//     setEditing(null);
//   };

//   return (
//     <div className="p-8 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="font-display text-3xl">CATEGORIES</h1>
//           <p className="text-muted-foreground">{cats.length} total</p>
//         </div>
//         <button
//           type="button"
//           onClick={() => {
//             setEditing(null);
//             setOpen(true);
//           }}
//           className="bg-accent-brand text-accent-foreground px-4 py-2 font-bold uppercase text-sm flex items-center gap-2"
//         >
//           <Plus className="w-4 h-4" /> Add
//         </button>
//       </div>
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {cats.map((c) => (
//           <div key={c.id} className="bg-card border border-border p-4">
//             <div className="text-4xl">{c.icon}</div>
//             <div className="font-semibold mt-2">{c.name}</div>
//             <div className="text-xs text-muted-foreground">{c.description}</div>
//             <div className="flex gap-1 mt-3">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setEditing(c);
//                   setOpen(true);
//                 }}
//                 className="flex-1 border border-border py-1 hover:bg-secondary text-xs flex items-center justify-center gap-1"
//               >
//                 <Pencil className="w-3 h-3" /> Edit
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   if (confirm('Delete?')) {
//                     dispatch(deleteCategory(c.id));
//                     toast.success('Deleted');
//                   }
//                 }}
//                 className="px-3 border border-border py-1 hover:bg-destructive hover:text-destructive-foreground"
//               >
//                 <Trash2 className="w-3 h-3" />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//       {open && (
//         <CategoryModal
//           cat={editing}
//           onSave={onSave}
//           onClose={() => {
//             setOpen(false);
//             setEditing(null);
//           }}
//         />
//       )}
//     </div>
//   );
// }
