'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { addItem, setItems } from '@/redux/slices/categorySlice';
import { categoryService } from '@/services/category.api';
import type { Category } from '@/types/category.type';

function CategoryModal({
  category,
  onSave,
  onClose,
  submitting,
}: {
  category: Category | null;
  onSave: (name: string) => void;
  onClose: () => void;
  submitting: boolean;
}) {
  const [name, setName] = useState(category?.cate_name ?? '');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card max-w-md w-full p-6">
        <h2 className="font-display text-2xl mb-4">{category ? 'EDIT' : 'ADD'} CATEGORY</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(name.trim());
          }}
          className="space-y-3"
        >
          <label className="block">
            <span className="text-xs uppercase font-bold">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-border bg-background"
              required
            />
          </label>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} disabled={submitting} className="px-4 py-2 border border-border">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary text-primary-foreground px-4 py-2 font-bold uppercase text-sm disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CategoryAdminPage() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((s) => s.category.items);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Category | null>(null);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    categoryService
      .getAll()
      .then((items) => {
        if (!cancelled) dispatch(setItems(items));
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to load categories';
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

  const handleSave = async (cate_name: string) => {
    if (!cate_name) {
      toast.error('Category name is required');
      return;
    }

    setSubmitting(true);
    try {
      if (editing) {
        const updated = await categoryService.update({ cate_id: editing.cate_id, cate_name });
        dispatch(setItems(categories.map((c) => (c.cate_id === updated.cate_id ? updated : c))));
        toast.success('Category updated');
      } else {
        const created = await categoryService.create({ cate_name });
        dispatch(addItem(created));
        toast.success('Category created');
      }
      closeModal();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save category';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Delete "${category.cate_name}"?`)) return;

    setDeletingId(category.cate_id);
    try {
      await categoryService.delete(category.cate_id);
      dispatch(setItems(categories.filter((c) => c.cate_id !== category.cate_id)));
      toast.success('Category deleted');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete category';
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">CATEGORIES</h1>
          <p className="text-muted-foreground">
            {loading ? 'Loading…' : `${categories.length} total`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="bg-accent-brand text-accent-foreground px-4 py-2 font-bold uppercase text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {error && (
        <p className="text-sm text-destructive border border-destructive/30 bg-destructive/5 px-4 py-3">
          {error}
        </p>
      )}

      {loading ? (
        <div className="bg-card border border-border p-12 text-center text-muted-foreground">
          Loading categories…
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-card border border-border p-12 text-center text-muted-foreground">
          No categories found.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((c) => {
            const isDeleting = deletingId === c.cate_id;

            return (
              <div key={c.cate_id} className="bg-card border border-border p-4">
                <div className="font-semibold">{c.cate_name}</div>
                <div className="text-xs text-muted-foreground mt-1">ID: {c.cate_id}</div>
                <div className="flex gap-1 mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(c);
                      setOpen(true);
                    }}
                    disabled={isDeleting}
                    className="flex-1 border border-border py-1 hover:bg-secondary text-xs flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(c)}
                    disabled={isDeleting}
                    className="px-3 border border-border py-1 hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {open && (
        <CategoryModal
          key={editing?.cate_id ?? 'new'}
          category={editing}
          onSave={handleSave}
          onClose={closeModal}
          submitting={submitting}
        />
      )}
    </div>
  );
}
