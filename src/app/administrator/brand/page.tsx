'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { setItems, addItem } from '@/redux/slices/brandSlice';
import { brandService } from '@/services/brand.api';
import type { Brand, CreateBrandInput, UpdateBrandInput } from '@/types/brand.type';
import { getBrandImageUrl } from '@/utils/getProductImageUrl';
import { lo } from '@/lib/lao';

function emptyBrandInput(): CreateBrandInput {
  return { name: '', tagline: '', country: '' };
}

function BrandModal({
  brand,
  onSave,
  onClose,
  submitting,
}: {
  brand: Brand | null;
  onSave: (input: CreateBrandInput | UpdateBrandInput) => void;
  onClose: () => void;
  submitting: boolean;
}) {
  const [form, setForm] = useState<CreateBrandInput>(() =>
    brand
      ? {
          name: brand.name,
          tagline: brand.tagline,
          country: brand.country,
        }
      : emptyBrandInput(),
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    brand?.brand_logo ? getBrandImageUrl(brand.brand_logo) : null,
  );

  useEffect(() => {
    return () => {
      if (logoPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleLogoChange = (file: File | null) => {
    if (logoPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoFile(file);
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      return;
    }
    setLogoPreview(brand?.brand_logo ? getBrandImageUrl(brand.brand_logo) : null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-card p-6 max-h-[90vh] overflow-auto">
        <h2 className="mb-4 font-display text-2xl">{brand ? lo.admin.editBrand : lo.admin.addBrand}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const payload = {
              ...form,
              ...(logoFile ? { brand_logo: logoFile } : {}),
            };
            if (brand) {
              onSave({ brand_id: brand.brand_id, ...payload });
            } else {
              onSave(payload);
            }
          }}
          className="space-y-3"
        >
          <label className="block">
            <span className="text-xs font-bold uppercase">{lo.common.name}</span>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full border border-border bg-background px-3 py-2"
              required
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase">{lo.admin.tagline}</span>
            <input
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="mt-1 w-full border border-border bg-background px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase">{lo.admin.country}</span>
            <input
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="mt-1 w-full border border-border bg-background px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase">{lo.admin.logo}</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleLogoChange(e.target.files?.[0] ?? null)}
              className="mt-1 w-full border border-border bg-background px-3 py-2 file:mr-3 file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-xs file:font-bold file:uppercase"
            />
            {logoPreview && (
              <Image
                src={logoPreview}
                alt={lo.admin.logoPreview}
                width={64}
                height={64}
                unoptimized={logoPreview.startsWith('blob:')}
                className="mt-2 h-16 w-16 object-cover border border-border"
              />
            )}
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} disabled={submitting} className="border border-border px-4 py-2">
              {lo.common.cancel}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary px-4 py-2 text-sm font-bold uppercase text-primary-foreground disabled:opacity-50"
            >
              {submitting ? lo.common.saving : lo.common.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BrandAdminPage() {
  const dispatch = useAppDispatch();
  const brands = useAppSelector((s) => s.brand.items);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    brandService
      .getAll()
      .then((items) => {
        if (!cancelled) dispatch(setItems(items));
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : lo.toast.failedLoadBrands;
          setError(message);
          toast.error(message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  const closeModal = () => {
    setOpen(false);
    setEditing(null);
  };

  const handleSave = async (input: CreateBrandInput | UpdateBrandInput) => {
    setSubmitting(true);
    try {
      if ('brand_id' in input) {
        const updated = await brandService.update(input);
        dispatch(setItems(brands.map((b) => (b.brand_id === updated.brand_id ? updated : b))));
        toast.success(lo.admin.brandUpdated);
      } else {
        const created = await brandService.create(input);
        dispatch(addItem(created));
        toast.success(lo.admin.brandCreated);
      }
      closeModal();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : lo.toast.failedSaveBrand;
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (brand: Brand) => {
    if (!confirm(lo.admin.deleteConfirm(brand.name))) return;

    setDeletingId(brand.brand_id);
    try {
      await brandService.delete(brand.brand_id);
      dispatch(setItems(brands.filter((b) => b.brand_id !== brand.brand_id)));
      toast.success(lo.admin.brandDeleted);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : lo.toast.failedDeleteBrand;
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">{lo.admin.brands}</h1>
          <p className="text-muted-foreground">
            {loading ? lo.common.loading : lo.admin.total(brands.length)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="flex items-center gap-2 bg-accent-brand px-4 py-2 text-sm font-bold uppercase text-accent-foreground"
        >
          <Plus className="h-4 w-4" /> {lo.common.add}
        </button>
      </div>

      {error && (
        <p className="text-sm text-destructive border border-destructive/30 bg-destructive/5 px-4 py-3">
          {error}
        </p>
      )}

      {loading ? (
        <div className="bg-card border border-border p-12 text-center text-muted-foreground">
          {lo.admin.loadingBrands}
        </div>
      ) : brands.length === 0 ? (
        <div className="bg-card border border-border p-12 text-center text-muted-foreground">
          {lo.admin.noBrands}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {brands.map((b) => {
            const isDeleting = deletingId === b.brand_id;
            const logoUrl = getBrandImageUrl(b.brand_logo);

            return (
              <div key={b.brand_id} className="border border-border bg-card p-5">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={b.name}
                    width={48}
                    height={48}
                    className="mb-3 h-12 w-12 object-cover border border-border"
                  />
                ) : (
                  <div className="mb-3 flex h-12 w-12 items-center justify-center border border-border bg-secondary text-xs text-muted-foreground">
                    {lo.common.na}
                  </div>
                )}
                <div className="font-display text-2xl">{b.name}</div>
                <div className="text-sm text-accent-brand">{b.tagline}</div>
                <div className="mt-1 text-xs text-muted-foreground">{b.country}</div>
                <div className="mt-3 flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(b);
                      setOpen(true);
                    }}
                    disabled={isDeleting}
                    className="flex flex-1 items-center justify-center gap-1 border border-border py-1 text-xs hover:bg-secondary disabled:opacity-50"
                  >
                    <Pencil className="h-3 w-3" /> {lo.common.edit}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(b)}
                    disabled={isDeleting}
                    className="border border-border px-3 py-1 hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {open && (
        <BrandModal
          key={editing?.brand_id ?? 'new'}
          brand={editing}
          onSave={handleSave}
          onClose={closeModal}
          submitting={submitting}
        />
      )}
    </div>
  );
}
