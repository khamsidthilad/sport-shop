'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { contactService } from '@/services/contact.api';
import type { ContactInfo } from '@/types/contact.type';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Enter a valid email').max(255),
  message: z.string().trim().min(1, 'Message is required').max(1000),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const defaultInfo: ContactInfo = {
  email: 'hello@sportshop.com',
  phone: '+66 2 123 4567',
  address: '123 Sukhumvit Rd, Bangkok 10110',
  shopName: 'Sport Shop',
};

export default function ContactPage() {
  const [info, setInfo] = useState<ContactInfo>(defaultInfo);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    let cancelled = false;

    contactService
      .getInfo()
      .then((data) => {
        if (!cancelled) setInfo(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to load contact info';
          toast.error(message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingInfo(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitting(true);
    try {
      await contactService.submit(data);
      toast.success('Message sent');
      reset();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send message';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="mx-auto grid max-w-5xl gap-12 px-4 py-16 md:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent-brand">Contact</p>
          <h1 className="font-display mt-2 text-5xl">GET IN TOUCH</h1>
          <p className="mt-4 text-muted-foreground">
            Questions about gear, sizing, or orders? Our team is here for you.
          </p>
          <div className="mt-8 space-y-4 text-sm">
            <div className="flex gap-3">
              <Mail className="h-5 w-5 shrink-0 text-accent-brand" />
              {loadingInfo ? (
                <span className="text-muted-foreground">Loading...</span>
              ) : (
                <a href={`mailto:${info.email}`} className="hover:text-accent-brand">
                  {info.email}
                </a>
              )}
            </div>
            <div className="flex gap-3">
              <Phone className="h-5 w-5 shrink-0 text-accent-brand" />
              {loadingInfo ? (
                <span className="text-muted-foreground">Loading...</span>
              ) : (
                <a href={`tel:${info.phone.replace(/\s/g, '')}`} className="hover:text-accent-brand">
                  {info.phone}
                </a>
              )}
            </div>
            <div className="flex gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-accent-brand" />
              {loadingInfo ? (
                <span className="text-muted-foreground">Loading...</span>
              ) : (
                <span>{info.address}</span>
              )}
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 border border-border p-6">
          <div>
            <input
              {...register('name')}
              placeholder="Name"
              className="w-full border border-border bg-background px-3 py-2"
            />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div>
            <input
              {...register('email')}
              type="email"
              placeholder="Email"
              className="w-full border border-border bg-background px-3 py-2"
            />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div>
            <textarea
              {...register('message')}
              rows={5}
              placeholder="Message"
              className="w-full border border-border bg-background px-3 py-2"
            />
            {errors.message && (
              <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary px-6 py-2 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-accent-brand disabled:opacity-60"
          >
            {submitting ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </CustomerLayout>
  );
}
