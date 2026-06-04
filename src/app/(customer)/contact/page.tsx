// 'use client';

// import { Mail, Phone, MapPin } from 'lucide-react';
// import { toast } from 'sonner';
// import { CustomerLayout } from '@/components/layouts/CustomerLayout';

// export default function ContactPage() {
//   return (
//     <CustomerLayout>
//       <div className="mx-auto grid max-w-5xl gap-12 px-4 py-16 md:grid-cols-2">
//         <div>
//           <p className="text-xs font-bold uppercase tracking-widest text-accent-brand">Contact</p>
//           <h1 className="font-display mt-2 text-5xl">GET IN TOUCH</h1>
//           <p className="mt-4 text-muted-foreground">
//             Questions about gear, sizing, or orders? Our team is here for you.
//           </p>
//           <div className="mt-8 space-y-4 text-sm">
//             <div className="flex gap-3">
//               <Mail className="h-5 w-5 text-accent-brand" /> hello@sportshop.com
//             </div>
//             <div className="flex gap-3">
//               <Phone className="h-5 w-5 text-accent-brand" /> +66 2 123 4567
//             </div>
//             <div className="flex gap-3">
//               <MapPin className="h-5 w-5 text-accent-brand" /> 123 Sukhumvit Rd, Bangkok 10110
//             </div>
//           </div>
//         </div>
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             toast.success('Message sent');
//             (e.target as HTMLFormElement).reset();
//           }}
//           className="space-y-3 border border-border p-6"
//         >
//           <input
//             required
//             maxLength={100}
//             placeholder="Name"
//             className="w-full border border-border bg-background px-3 py-2"
//           />
//           <input
//             required
//             type="email"
//             maxLength={255}
//             placeholder="Email"
//             className="w-full border border-border bg-background px-3 py-2"
//           />
//           <textarea
//             required
//             maxLength={1000}
//             rows={5}
//             placeholder="Message"
//             className="w-full border border-border bg-background px-3 py-2"
//           />
//           <button
//             type="submit"
//             className="bg-primary px-6 py-2 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-accent-brand"
//           >
//             Send
//           </button>
//         </form>
//       </div>
//     </CustomerLayout>
//   );
// }

export default function ContactPage() {
  return (
    <div>
      <h1>Contact Page</h1>
    </div>
  );
}