'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addItem } from '@/redux/slices/productSlice';
import { productService } from '@/services/product.api';
import { categoryService } from '@/services/category.api';
import { brandService } from '@/services/brand.api';
import type { CreateProductInput, UpdateProductInput } from '@/types/createPro';
import type { Brand, Category, Product } from '@/types/product.type';
import { getProductImageUrl } from '@/utils/getProductImageUrl';
import { lo } from '@/lib/lao';

interface ProductFormProps {
  product: Product | null;
  onSave?: (data: Product) => void;
  onCreated?: () => void;
  onClose: () => void;
}

function emptyProduct(): Product {
  return {
    pro_id: 0,
    pro_name: '',
    pro_detail: '',
    pro_price: '0',
    pro_image: '',
    pro_qty: 0,
    createdAt: '',
    updatedAt: '',
  };
}

function toCreateInput(form: Product, imageFile: File): CreateProductInput {
  return {
    pro_name: form.pro_name ?? '',
    pro_detail: form.pro_detail ?? '',
    pro_price: form.pro_price ?? '0',
    pro_qty: form.pro_qty,
    cate_id: form.cate_id!,
    brand_id: form.brand_id!,
    pro_image: imageFile,
  };
}

function toUpdateInput(form: Product, imageFile: File | null): UpdateProductInput {
  return {
    pro_id: form.pro_id,
    pro_name: form.pro_name ?? '',
    pro_detail: form.pro_detail ?? '',
    pro_price: form.pro_price ?? '0',
    pro_qty: form.pro_qty,
    cate_id: form.cate_id!,
    brand_id: form.brand_id!,
    ...(imageFile ? { pro_image: imageFile } : {}),
  };
}

export default function ProductForm({ product, onSave, onCreated, onClose }: ProductFormProps) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<Product>(product ?? emptyProduct());
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.pro_image ? getProductImageUrl(product.pro_image) : null,
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all([categoryService.getAll(), brandService.getAll()])
      .then(([cats, brs]) => {
        if (cancelled) return;
        setCategories(cats);
        setBrands(brs);

        if (product) {
          setForm(product);
        } else {
          setForm((prev) => ({
            ...prev,
            cate_id: prev.cate_id ?? cats[0]?.cate_id,
            brand_id: prev.brand_id ?? brs[0]?.brand_id,
          }));
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : lo.toast.failedLoadOptions;
        toast.error(message);
      })
      .finally(() => {
        if (!cancelled) setOptionsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [product]);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (file: File | null) => {
    if (imagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      return;
    }

    setImagePreview(product?.pro_image ? getProductImageUrl(product.pro_image) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.cate_id || !form.brand_id) {
      toast.error(lo.product.selectBrandCategory);
      return;
    }

    const category = categories.find((c) => c.cate_id === form.cate_id);
    const brand = brands.find((b) => b.brand_id === form.brand_id);

    setSubmitting(true);
    try {
      if (product) {
        const updated = await productService.update(toUpdateInput(form, imageFile));
        onSave?.({ ...updated, category, brand });
        toast.success(lo.product.updated);
        onClose();
        return;
      }

      if (!imageFile) {
        toast.error(lo.product.selectImage);
        return;
      }

      const created = await productService.create(toCreateInput(form, imageFile));
      dispatch(addItem({ ...created, category, brand }));
      toast.success(lo.product.created);
      onCreated?.();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : lo.toast.failedSaveProduct;
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card max-w-lg w-full p-6 max-h-[90vh] overflow-auto">
        <h2 className="font-display text-2xl mb-4">{product ? lo.product.editProduct : lo.product.addProduct}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Inp label={lo.common.name} value={form.pro_name ?? ''} onChange={(v) => setForm({ ...form, pro_name: v })} required />
          <div className="grid grid-cols-2 gap-3">
            <Sel
              label={lo.product.brand}
              value={String(form.brand_id ?? '')}
              onChange={(v) => setForm({ ...form, brand_id: Number(v) })}
              options={brands.map((b) => ({ v: String(b.brand_id), l: b.name }))}
              required
              disabled={optionsLoading}
              placeholder={optionsLoading ? lo.product.loadingBrands : lo.product.selectBrand}
            />
            <Sel
              label={lo.product.category}
              value={String(form.cate_id ?? '')}
              onChange={(v) => setForm({ ...form, cate_id: Number(v) })}
              options={categories.map((c) => ({ v: String(c.cate_id), l: c.cate_name }))}
              required
              disabled={optionsLoading}
              placeholder={optionsLoading ? lo.product.loadingCategories : lo.product.selectCategory}
            />
            <Inp
              label={lo.common.price}
              type="number"
              value={form.pro_price ?? '0'}
              onChange={(v) => setForm({ ...form, pro_price: v })}
              required
            />
            <Inp
              label={lo.common.quantity}
              type="number"
              value={String(form.pro_qty)}
              onChange={(v) => setForm({ ...form, pro_qty: +v })}
              required
            />
          </div>
          <label className="block">
            <span className="text-xs uppercase font-bold tracking-widest">{lo.product.image}</span>
            <input
              type="file"
              accept="image/*"
              required={!product}
              onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
              className="w-full mt-1 px-3 py-2 border border-border bg-background file:mr-3 file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-xs file:font-bold file:uppercase"
            />
            {imagePreview && (
              <Image
                src={imagePreview}
                alt={lo.product.preview}
                width={96}
                height={96}
                unoptimized={imagePreview.startsWith('blob:')}
                className="mt-2 object-cover border border-border"
              />
            )}
          </label>
          <label className="block">
            <span className="text-xs uppercase font-bold">{lo.product.description}</span>
            <textarea
              value={form.pro_detail ?? ''}
              onChange={(e) => setForm({ ...form, pro_detail: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-border bg-background"
              rows={3}
            />
          </label>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={onClose} disabled={submitting} className="px-4 py-2 border border-border">
              {lo.common.cancel}
            </button>
            <button
              type="submit"
              disabled={submitting || optionsLoading}
              className="bg-primary text-primary-foreground px-4 py-2 font-bold uppercase text-sm disabled:opacity-50"
            >
              {submitting ? lo.common.saving : lo.common.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const Inp = ({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) => (
  <label className="block">
    <span className="text-xs uppercase font-bold tracking-widest">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full mt-1 px-3 py-2 border border-border bg-background"
    />
  </label>
);

const Sel = ({
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  placeholder = lo.common.select,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { v: string; l: string }[];
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}) => (
  <label className="block">
    <span className="text-xs uppercase font-bold tracking-widest">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      disabled={disabled}
      className="w-full mt-1 px-3 py-2 border border-border bg-background disabled:opacity-50"
    >
      {!value && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o.v} value={o.v}>
          {o.l}
        </option>
      ))}
    </select>
  </label>
);
