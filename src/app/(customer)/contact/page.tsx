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
import { lo } from '@/lib/lao';

const contactSchema = z.object({
  name: z.string().trim().min(1, lo.contact.nameRequired).max(100),
  email: z.string().trim().email(lo.contact.emailInvalid).max(255),
  message: z.string().trim().min(1, lo.contact.messageRequired).max(1000),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const defaultInfo: ContactInfo = {
  email: 'hello@sportshop.com',
  phone: '+66 2 123 4567',
  address: '123 Sukhumvit Rd, Bangkok 10110',
  shopName: lo.brand.sportShop,
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
          const message = err instanceof Error ? err.message : lo.toast.failedLoadContact;
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
      toast.success(lo.contact.sent);
      reset();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : lo.toast.failedSendMessage;
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="mx-auto grid max-w-5xl gap-12 px-4 py-16 md:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent-brand">{lo.contact.label}</p>
          <h1 className="font-display mt-2 text-5xl">{lo.contact.title}</h1>
          <p className="mt-4 text-muted-foreground">
            {lo.contact.body}
          </p>
          <div className="mt-8 space-y-4 text-sm">
            <div className="flex gap-3">
              <Mail className="h-5 w-5 shrink-0 text-accent-brand" />
              {loadingInfo ? (
                <span className="text-muted-foreground">{lo.common.loading}</span>
              ) : (
                <a href={`mailto:${info.email}`} className="hover:text-accent-brand">
                  {info.email}
                </a>
              )}
            </div>
            <div className="flex gap-3">
              <Phone className="h-5 w-5 shrink-0 text-accent-brand" />
              {loadingInfo ? (
                <span className="text-muted-foreground">{lo.common.loading}</span>
              ) : (
                <a href={`tel:${info.phone.replace(/\s/g, '')}`} className="hover:text-accent-brand">
                  {info.phone}
                </a>
              )}
            </div>
            <div className="flex gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-accent-brand" />
              {loadingInfo ? (
                <span className="text-muted-foreground">{lo.common.loading}</span>
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
              placeholder={lo.common.name}
              className="w-full border border-border bg-background px-3 py-2"
            />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div>
            <input
              {...register('email')}
              type="email"
              placeholder={lo.common.email}
              className="w-full border border-border bg-background px-3 py-2"
            />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div>
            <textarea
              {...register('message')}
              rows={5}
              placeholder={lo.contact.message}
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
            {submitting ? lo.common.sending : lo.common.send}
          </button>
        </form>
      </div>
    </CustomerLayout>
  );
}
