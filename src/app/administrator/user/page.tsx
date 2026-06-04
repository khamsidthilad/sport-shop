// 'use client';

// import { useState } from 'react';
// import { Plus, Trash2 } from 'lucide-react';
// import { adminUsers as seed } from '@/lib/mokdata';
// import type { AdminUser } from '@/lib/types';
// import { toast } from 'sonner';

// export default function UserAdminPage() {
//   const [users, setUsers] = useState<AdminUser[]>(seed);
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="p-8 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="font-display text-3xl">USERS</h1>
//           <p className="text-muted-foreground">Admin & staff users</p>
//         </div>
//         <button
//           type="button"
//           onClick={() => setOpen(true)}
//           className="bg-accent-brand text-accent-foreground px-4 py-2 font-bold uppercase text-sm flex items-center gap-2"
//         >
//           <Plus className="w-4 h-4" /> Add User
//         </button>
//       </div>
//       <div className="bg-card border border-border">
//         <table className="w-full text-sm">
//           <thead className="bg-secondary text-xs uppercase">
//             <tr>
//               <th className="text-left p-3">Username</th>
//               <th className="text-left p-3">Full Name</th>
//               <th className="text-left p-3">Email</th>
//               <th className="text-left p-3">Role</th>
//               <th className="text-right p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((u) => (
//               <tr key={u.id} className="border-t border-border">
//                 <td className="p-3 font-semibold">@{u.username}</td>
//                 <td className="p-3">{u.fullName}</td>
//                 <td className="p-3">{u.email}</td>
//                 <td className="p-3">
//                   <span
//                     className={`px-2 py-0.5 text-xs ${
//                       u.role === 'admin' ? 'bg-accent-brand text-accent-foreground' : 'bg-secondary'
//                     }`}
//                   >
//                     {u.role}
//                   </span>
//                 </td>
//                 <td className="p-3 text-right">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       if (confirm('Delete?')) {
//                         setUsers(users.filter((x) => x.id !== u.id));
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
//               setUsers([
//                 ...users,
//                 {
//                   id: `a${Date.now()}`,
//                   username: String(f.get('username')),
//                   fullName: String(f.get('fullName')),
//                   email: String(f.get('email')),
//                   role: f.get('role') as 'admin' | 'staff',
//                   createdAt: new Date().toISOString(),
//                 },
//               ]);
//               toast.success('User added');
//               setOpen(false);
//             }}
//           >
//             <h2 className="font-display text-2xl mb-2">ADD USER</h2>
//             <input name="username" placeholder="Username" required className="w-full px-3 py-2 border border-border bg-background" />
//             <input name="fullName" placeholder="Full Name" required className="w-full px-3 py-2 border border-border bg-background" />
//             <input name="email" type="email" placeholder="Email" required className="w-full px-3 py-2 border border-border bg-background" />
//             <select name="role" className="w-full px-3 py-2 border border-border bg-background">
//               <option value="staff">Staff</option>
//               <option value="admin">Admin</option>
//             </select>
//             <div className="flex gap-2 justify-end">
//               <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 border border-border">
//                 Cancel
//               </button>
//               <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 font-bold uppercase text-sm">
//                 Save
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }
