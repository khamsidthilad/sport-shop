'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { importService } from '@/services/import.api';
import { productService } from '@/services/product.api';
import { supplierService } from '@/services/supplier.api';
import type { CreateImportInput, ImportRecord } from '@/types/import.type';
import { getImportPrice, getImportTotal } from '@/types/import.type';
import type { Product } from '@/types/product.type';
import type { Supplier } from '@/types/supplier.type';
import { formatCurrency } from '@/utils/formatCurrency';

function ImportModal({
  products,
  suppliers,
  onSave,
  onClose,
  submitting,
}: {
  products: Product[];
  suppliers: Supplier[];
  onSave: (input: CreateImportInput) => void;
  onClose: () => void;
  submitting: boolean;
}) {
  const [form, setForm] = useState<CreateImportInput>(() => {
    const firstProduct = products[0];
    return {
      pro_id: firstProduct?.pro_id ?? 0,
      sup_id: suppliers[0]?.sup_id ?? 0,
      quantity: 1,
      price: Number(firstProduct?.pro_price ?? 0),
    };
  });

  const handleProductChange = (pro_id: number) => {
    const product = products.find((p) => p.pro_id === pro_id);
    setForm((current) => ({
      ...current,
      pro_id,
      price: Number(product?.pro_price ?? current.price),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        className="w-full max-w-md space-y-3 bg-card p-6"
        onSubmit={(e) => {
          e.preventDefault();
          onSave(form);
        }}
      >
        <h2 className="mb-2 font-display text-2xl">IMPORT STOCK</h2>

        <label className="block">
          <span className="text-xs font-bold uppercase">Product</span>
          <select
            value={form.pro_id || ''}
            onChange={(e) => handleProductChange(Number(e.target.value))}
            required
            className="mt-1 w-full border border-border bg-background px-3 py-2"
          >
            <option value="" disabled>
              Select product
            </option>
            {products.map((p) => (
              <option key={p.pro_id} value={p.pro_id}>
                {p.pro_name ?? `Product #${p.pro_id}`}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase">Supplier</span>
          <select
            value={form.sup_id || ''}
            onChange={(e) => setForm({ ...form, sup_id: Number(e.target.value) })}
            required
            className="mt-1 w-full border border-border bg-background px-3 py-2"
          >
            <option value="" disabled>
              Select supplier
            </option>
            {suppliers.map((s) => (
              <option key={s.sup_id} value={s.sup_id}>
                {s.name ?? `Supplier #${s.sup_id}`}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase">Quantity</span>
          <input
            type="number"
            min={1}
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
            required
            className="mt-1 w-full border border-border bg-background px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase">Price</span>
          <input
            type="number"
            min={0}
            step="1"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            required
            className="mt-1 w-full border border-border bg-background px-3 py-2"
          />
        </label>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} disabled={submitting} className="border border-border px-4 py-2">
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !form.pro_id || !form.sup_id}
            className="bg-primary px-4 py-2 text-sm font-bold uppercase text-primary-foreground disabled:opacity-50"
          >
            {submitting ? 'Importing…' : 'Import'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ImportAdminPage() {
  const [records, setRecords] = useState<ImportRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([importService.getAll(), productService.getAll(), supplierService.getAll()])
      .then(([importItems, productItems, supplierItems]) => {
        if (cancelled) return;
        setRecords(importItems);
        setProducts(productItems);
        setSuppliers(supplierItems);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to load imports';
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
  }, []);

  const totalValue = useMemo(
    () => records.reduce((sum, record) => sum + getImportTotal(record), 0),
    [records],
  );

  const handleCreate = async (input: CreateImportInput) => {
    setSubmitting(true);
    try {
      const created = await importService.create(input);
      setRecords((current) => [created, ...current]);
      setProducts((current) =>
        current.map((product) =>
          product.pro_id === input.pro_id
            ? { ...product, pro_qty: Number(product.pro_qty) + input.quantity }
            : product,
        ),
      );
      toast.success('Stock imported');
      setOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to import stock';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (record: ImportRecord) => {
    if (!confirm(`Delete import #${record.Purchase_id}?`)) return;

    setDeletingId(record.Purchase_id);
    try {
      await importService.delete(record.Purchase_id);
      setRecords((current) => current.filter((item) => item.Purchase_id !== record.Purchase_id));
      if (record.pro_id && record.quantity) {
        setProducts((current) =>
          current.map((product) =>
            product.pro_id === record.pro_id
              ? {
                  ...product,
                  pro_qty: Math.max(0, Number(product.pro_qty) - Number(record.quantity)),
                }
              : product,
          ),
        );
      }
      toast.success('Import deleted');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete import';
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const canCreate = products.length > 0 && suppliers.length > 0;

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">IMPORTS</h1>
          <p className="text-muted-foreground">
            {loading ? 'Loading…' : `${records.length} records · Total value ${formatCurrency(totalValue)}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={loading || !canCreate}
          className="flex items-center gap-2 bg-accent-brand px-4 py-2 text-sm font-bold uppercase text-accent-foreground disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> Import Stock
        </button>
      </div>

      {error && (
        <p className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {!loading && !canCreate && (
        <p className="border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          Add at least one product and one supplier before importing stock.
        </p>
      )}

      <div className="overflow-x-auto border border-border bg-card">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading imports…</div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No import records found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-secondary text-xs uppercase">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Supplier</th>
                <th className="p-3 text-right">Qty</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => {
                const isDeleting = deletingId === record.Purchase_id;

                return (
                  <tr key={record.Purchase_id} className="border-t border-border hover:bg-secondary/50">
                    <td className="p-3 font-mono text-xs">{record.Purchase_id}</td>
                    <td className="p-3 font-semibold">
                      {record.product?.pro_name ?? (record.pro_id ? `#${record.pro_id}` : '—')}
                    </td>
                    <td className="p-3">
                      {record.supplier?.name ?? (record.sup_id ? `#${record.sup_id}` : '—')}
                    </td>
                    <td className="p-3 text-right">{record.quantity ?? 0}</td>
                    <td className="p-3 text-right">{formatCurrency(getImportPrice(record))}</td>
                    <td className="p-3 text-right font-bold">{formatCurrency(getImportTotal(record))}</td>
                    <td className="p-3 text-xs">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => void handleDelete(record)}
                        disabled={isDeleting}
                        className="p-1.5 hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {open && (
        <ImportModal
          products={products}
          suppliers={suppliers}
          onSave={handleCreate}
          onClose={() => setOpen(false)}
          submitting={submitting}
        />
      )}
    </div>
  );
}
