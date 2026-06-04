// 'use client';

// import { useState } from 'react';
// import { Search } from 'lucide-react';
// import { useAppSelector } from '@/hooks/useAppSelector';

// export default function CustomerAdminPage() {
//   const customers = useAppSelector((s) => s.customer.items);
//   const orders = useAppSelector((s) => s.order.items);
//   const [search, setSearch] = useState('');
//   const [selected, setSelected] = useState<string | null>(null);
//   const filtered = customers.filter((c) =>
//     `${c.fullName} ${c.surname} ${c.username}`.toLowerCase().includes(search.toLowerCase()),
//   );
//   const detail = customers.find((c) => c.id === selected);
//   const customerOrders = orders.filter((o) => o.customerId === selected);

//   return (
//     <div className="p-8 space-y-6">
//       <h1 className="font-display text-3xl">CUSTOMERS</h1>
//       <div className="grid lg:grid-cols-[1fr_360px] gap-6">
//         <div className="bg-card border border-border">
//           <div className="p-4 border-b border-border relative max-w-sm">
//             <Search className="w-4 h-4 absolute left-7 top-1/2 -translate-y-1/2 text-muted-foreground" />
//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search customers..."
//               className="w-full pl-9 pr-3 py-2 border border-border bg-background"
//             />
//           </div>
//           <table className="w-full text-sm">
//             <thead className="bg-secondary text-xs uppercase">
//               <tr>
//                 <th className="text-left p-3">Name</th>
//                 <th className="text-left p-3">Username</th>
//                 <th className="text-left p-3">Tel</th>
//                 <th className="p-3">Joined</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((c) => (
//                 <tr
//                   key={c.id}
//                   onClick={() => setSelected(c.id)}
//                   className={`border-t border-border cursor-pointer hover:bg-secondary/50 ${
//                     selected === c.id ? 'bg-secondary' : ''
//                   }`}
//                 >
//                   <td className="p-3 font-semibold">
//                     {c.fullName} {c.surname}
//                   </td>
//                   <td className="p-3">@{c.username}</td>
//                   <td className="p-3">{c.tel}</td>
//                   <td className="p-3 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <aside className="bg-card border border-border p-5 h-fit">
//           <h3 className="font-display text-xl mb-3">CUSTOMER DETAIL</h3>
//           {!detail ? (
//             <p className="text-sm text-muted-foreground">Select a customer to view details.</p>
//           ) : (
//             <div className="space-y-2 text-sm">
//               <div>
//                 <span className="text-muted-foreground">Name: </span>
//                 <span className="font-semibold">
//                   {detail.fullName} {detail.surname}
//                 </span>
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Username: </span>@{detail.username}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">DOB: </span>
//                 {detail.dateOfBirth}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Tel: </span>
//                 {detail.tel}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Address: </span>
//                 {detail.address}
//               </div>
//               <div className="pt-3 border-t border-border mt-3">
//                 <span className="font-semibold">Orders: {customerOrders.length}</span>
//               </div>
//             </div>
//           )}
//         </aside>
//       </div>
//     </div>
//   );
// }
export default function CustomerAdminPage() {
  return (
    <div>
      <h1>Customer Admin Page</h1>
    </div>
  );
}