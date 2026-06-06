'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { setItems } from '@/redux/slices/productSlice';
import type { Product } from '@/types/product.type';
import ProductTable from '@/components/product/ProductTable';
import ProductForm from '@/components/product/ProductForm';

export default function ProductMgmt() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((s) => s.product.items);
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  const closeModal = () => {
    setOpen(false);
    setEditing(null);
  };

  const handleSave = (data: Product) => {
    dispatch(setItems(products.map((p) => (p.pro_id === data.pro_id ? data : p))));
    closeModal();
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">PRODUCTS</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="bg-accent-brand text-accent-foreground px-4 py-2 font-bold uppercase text-sm tracking-wider hover:opacity-90 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <ProductTable
        onEdit={(p) => {
          setEditing(p);
          setOpen(true);
        }}
      />

      {open && (
        <ProductForm
          key={editing?.pro_id ?? 'new'}
          product={editing}
          onSave={handleSave}
          onCreated={() => undefined}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
