'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { addItem, setItems } from '@/redux/slices/supplierSlice';
import { productService } from '@/services/product.api';
import { supplierService } from '@/services/supplier.api';
import type { Product } from '@/types/product.type';
import type {
  CreateSupplierInput,
  Supplier,
  UpdateSupplierInput,
} from '@/types/supplier.type';

function emptySupplierInput(): CreateSupplierInput {
  return { name: '', Tel: '', address: '', pro_id: null };
}

function SupplierModal({ supplier, products, onSave, onClose, submitting }: { supplier: Supplier | null; products: Product[]; onSave: (input: CreateSupplierInput | UpdateSupplierInput) => void; onClose: () => void; submitting: boolean }) {
  const [form, setForm] = useState<CreateSupplierInput>(() =>
    supplier
      ? {
        name: supplier.name ?? '',
        Tel: supplier.Tel ?? '',
        address: supplier.address ?? '',
        pro_name: supplier.pro_id,
      }
      : emptySupplierInput(),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-card p-6 max-h-[90vh] overflow-auto">
        <h2 className="mb-4 font-display text-2xl">{supplier ? 'EDIT' : 'ADD'} SUPPLIER</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const payload: CreateSupplierInput = {
              name: form.name.trim(),
              Tel: form.Tel?.trim() || undefined,
              address: form.address?.trim() || undefined,
              pro_id: form.pro_id ?? null,
            };

            if (supplier) {
              onSave({ sup_id: supplier.sup_id, ...payload });
            } else {
              onSave(payload);
            }
          }}
          className="space-y-3"
        >
          <label className="block">
            <span className="text-xs font-bold uppercase">Name</span>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full border border-border bg-background px-3 py-2"
              required
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase">Telephone</span>
            <input
              value={form.Tel ?? ''}
              onChange={(e) => setForm({ ...form, Tel: e.target.value })}
              className="mt-1 w-full border border-border bg-background px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase">Address</span>
            <input
              value={form.address ?? ''}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="mt-1 w-full border border-border bg-background px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase">Product</span>
            <select
              value={form.pro_id ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  pro_id: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="mt-1 w-full border border-border bg-background px-3 py-2"
            >
              <option value="">No product linked</option>
              {products.map((p) => (
                <option key={p.pro_id} value={p.pro_id}>
                  {p.pro_name ?? `Product #${p.pro_id}`}
                </option>
              ))}
            </select>
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} disabled={submitting} className="border border-border px-4 py-2">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary px-4 py-2 text-sm font-bold uppercase text-primary-foreground disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminSupplierPage() {
  const dispatch = useAppDispatch();
  const suppliers = useAppSelector((s) => s.supplier.items);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([supplierService.getAll(), productService.getAll()])
      .then(([supplierItems, productItems]) => {
        if (cancelled) return;
        dispatch(setItems(supplierItems));
        setProducts(productItems);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to load suppliers';
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

  const handleSave = async (input: CreateSupplierInput | UpdateSupplierInput) => {
    setSubmitting(true);
    try {
      if ('sup_id' in input) {
        const updated = await supplierService.update(input);
        dispatch(setItems(suppliers.map((s) => (s.sup_id === updated.sup_id ? updated : s))));
        toast.success('Supplier updated');
      } else {
        const created = await supplierService.create(input);
        dispatch(addItem(created));
        toast.success('Supplier created');
      }
      closeModal();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save supplier';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (supplier: Supplier) => {
    if (!confirm(`Delete "${supplier.name ?? 'this supplier'}"?`)) return;

    setDeletingId(supplier.sup_id);
    try {
      await supplierService.delete(supplier.sup_id);
      dispatch(setItems(suppliers.filter((s) => s.sup_id !== supplier.sup_id)));
      toast.success('Supplier deleted');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete supplier';
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">SUPPLIERS</h1>
          <p className="text-muted-foreground">
            {loading ? 'Loading…' : `${suppliers.length} total`}
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
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      {error && (
        <p className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="overflow-x-auto border border-border bg-card">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading suppliers…</div>
        ) : suppliers.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No suppliers found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-secondary text-xs uppercase">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Tel</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => {
                const isDeleting = deletingId === s.sup_id;

                return (
                  <tr key={s.sup_id} className="border-t border-border hover:bg-secondary/50">
                    <td className="p-3 font-mono text-xs">{s.sup_id}</td>
                    <td className="p-3 font-semibold">{s.name ?? '—'}</td>
                    <td className="p-3">{s.Tel ?? '—'}</td>
                    <td className="p-3">{s.address ?? '—'}</td>
                    <td className="p-3">{s.product?.pro_name ?? (s.pro_id ? `#${s.pro_id}` : '—')}</td>
                    <td className="p-3">
                      <div className="flex justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(s);
                            setOpen(true);
                          }}
                          disabled={isDeleting}
                          className="p-1.5 hover:bg-secondary disabled:opacity-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(s)}
                          disabled={isDeleting}
                          className="p-1.5 hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {open && (
        <SupplierModal
          key={editing?.sup_id ?? 'new'}
          supplier={editing}
          products={products}
          onSave={handleSave}
          onClose={closeModal}
          submitting={submitting}
        />
      )}
    </div>
  );
}
