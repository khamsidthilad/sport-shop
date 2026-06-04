// 'use client';

// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
// import { User, MapPin, Package, KeyRound, LogOut } from 'lucide-react';
// import { useAppDispatch } from '@/hooks/useAppDispatch';
// import { useAppSelector } from '@/hooks/useAppSelector';
// import { logoutCustomer } from '@/redux/slices/authSlice';
// import { CustomerLayout } from '@/components/layouts/CustomerLayout';
// import { formatCurrency } from '@/utils/formatCurrency';
// import { getCustomerOrderId, getDisplayName } from '@/types/auth.type';

// const Detail = ({ label, value }: { label: string; value: string }) => (
//   <div>
//     <dt className="text-xs uppercase tracking-widest text-muted-foreground">{label}</dt>
//     <dd className="font-semibold mt-0.5">{value}</dd>
//   </div>
// );

// export default function ProfilePage() {
//   const session = useAppSelector((s) => s.auth.customerSession);
//   const orders = useAppSelector((s) =>
//     session ? s.order.items.filter((o) => o.customerId === getCustomerOrderId(session)) : [],
//   );
//   const dispatch = useAppDispatch();
//   const router = useRouter();

//   useEffect(() => {
//     if (!session) router.push('/login');
//   }, [session, router]);

//   if (!session) return null;

//   const { customer, user } = session;

//   return (
//     <CustomerLayout>
//       <div className="max-w-5xl mx-auto px-4 py-12">
//         <h1 className="font-display text-4xl md:text-5xl mb-8">MY PROFILE</h1>
//         <div className="grid md:grid-cols-[260px_1fr] gap-8">
//           <aside className="border border-border p-4 h-fit">
//             <div className="flex items-center gap-3 pb-4 border-b border-border">
//               <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
//                 {user.name.charAt(0)}
//               </div>
//               <div>
//                 <div className="font-semibold">{getDisplayName(session)}</div>
//                 <div className="text-xs text-muted-foreground">@{user.username}</div>
//               </div>
//             </div>
//             <nav className="mt-4 space-y-1 text-sm">
//               <a href="#info" className="flex items-center gap-2 px-3 py-2 hover:bg-secondary">
//                 <User className="w-4 h-4" /> Information
//               </a>
//               <a href="#address" className="flex items-center gap-2 px-3 py-2 hover:bg-secondary">
//                 <MapPin className="w-4 h-4" /> Address
//               </a>
//               <a href="#orders" className="flex items-center gap-2 px-3 py-2 hover:bg-secondary">
//                 <Package className="w-4 h-4" /> Orders
//               </a>
//               <a href="#password" className="flex items-center gap-2 px-3 py-2 hover:bg-secondary">
//                 <KeyRound className="w-4 h-4" /> Password
//               </a>
//               <button
//                 type="button"
//                 onClick={() => {
//                   dispatch(logoutCustomer());
//                   router.push('/');
//                 }}
//                 className="w-full flex items-center gap-2 px-3 py-2 hover:bg-destructive hover:text-destructive-foreground"
//               >
//                 <LogOut className="w-4 h-4" /> Logout
//               </button>
//             </nav>
//           </aside>
//           <div className="space-y-8">
//             <section id="info" className="border border-border p-6">
//               <h2 className="font-display text-xl mb-4">PROFILE INFORMATION</h2>
//               <dl className="grid grid-cols-2 gap-3 text-sm">
//                 <Detail label="Full Name" value={customer.cus_name} />
//                 <Detail label="Username" value={user.username} />
//                 <Detail label="Email" value={customer.Email} />
//                 <Detail label="Telephone" value={customer.Tel} />
//               </dl>
//             </section>
//             <section id="address" className="border border-border p-6">
//               <h2 className="font-display text-xl mb-4">ADDRESS</h2>
//               <p className="text-sm">{customer.address}</p>
//               <p className="mt-2 text-xs text-muted-foreground">Status: {customer.cus_status}</p>
//             </section>
//             <section id="orders" className="border border-border p-6">
//               <h2 className="font-display text-xl mb-4">ORDER HISTORY ({orders.length})</h2>
//               {orders.length === 0 ? (
//                 <p className="text-sm text-muted-foreground">
//                   No orders yet.{' '}
//                   <Link href="/shop" className="text-accent-brand">
//                     Start shopping
//                   </Link>
//                   .
//                 </p>
//               ) : (
//                 <div className="space-y-3">
//                   {orders.map((o) => (
//                     <div key={o.id} className="flex justify-between items-center border border-border p-3">
//                       <div>
//                         <div className="font-semibold">{o.id}</div>
//                         <div className="text-xs text-muted-foreground">
//                           {new Date(o.createdAt).toLocaleDateString()} · {o.items.length} items
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="font-bold">{formatCurrency(o.total)}</div>
//                         <span className="text-xs px-2 py-0.5 bg-secondary">{o.status}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </section>
//             <section id="password" className="border border-border p-6">
//               <h2 className="font-display text-xl mb-4">CHANGE PASSWORD</h2>
//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   alert('Password updated (demo)');
//                 }}
//                 className="space-y-3 max-w-sm"
//               >
//                 <input type="password" placeholder="Current password" className="w-full px-3 py-2 border border-border bg-background" />
//                 <input type="password" placeholder="New password" className="w-full px-3 py-2 border border-border bg-background" />
//                 <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 font-bold uppercase text-sm tracking-wider hover:bg-accent-brand">
//                   Update
//                 </button>
//               </form>
//             </section>
//           </div>
//         </div>
//       </div>
//     </CustomerLayout>
//   );
// }
export default function ProfilePage() {
  return (
    <div>
      <h1>Profile</h1>
    </div>
  );
}
