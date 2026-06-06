'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { addItem, setItems } from '@/redux/slices/userSlice';
import { userService } from '@/services/user.api';
import type { CreateUserInput, UpdateUserInput, User } from '@/types/user.type';
import { isStaffUser } from '@/types/user.type';

function emptyCreateInput(): CreateUserInput {
  return {
    Full_Name: '',
    Email: '',
    password: '',
    role: 'staff',
    tel: '',
  };
}

function UserModal({
  user,
  onSave,
  onClose,
  submitting,
}: {
  user: User | null;
  onSave: (input: CreateUserInput | UpdateUserInput) => void;
  onClose: () => void;
  submitting: boolean;
}) {
  const [form, setForm] = useState(() =>
    user
      ? {
          Full_Name: user.Full_Name,
          Email: user.Email,
          password: '',
          role: (user.role === 'admin' ? 'admin' : 'staff') as 'admin' | 'staff',
          tel: user.tel ?? '',
          status: user.status,
        }
      : emptyCreateInput(),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-card p-6 max-h-[90vh] overflow-auto">
        <h2 className="mb-4 font-display text-2xl">{user ? 'EDIT' : 'ADD'} USER</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (user) {
              onSave({
                User_id: user.User_id,
                Full_Name: form.Full_Name.trim(),
                Email: form.Email.trim(),
                role: form.role,
                tel: form.tel?.trim() || undefined,
                status: form.status,
                ...(form.password ? { password: form.password } : {}),
              });
              return;
            }

            if (!form.password) {
              toast.error('Password is required');
              return;
            }

            onSave({
              Full_Name: form.Full_Name.trim(),
              Email: form.Email.trim(),
              password: form.password,
              role: form.role,
              tel: form.tel?.trim() || undefined,
            });
          }}
          className="space-y-3"
        >
          <label className="block">
            <span className="text-xs font-bold uppercase">Full Name</span>
            <input
              value={form.Full_Name}
              onChange={(e) => setForm({ ...form, Full_Name: e.target.value })}
              className="mt-1 w-full border border-border bg-background px-3 py-2"
              required
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase">Email</span>
            <input
              type="email"
              value={form.Email}
              onChange={(e) => setForm({ ...form, Email: e.target.value })}
              className="mt-1 w-full border border-border bg-background px-3 py-2"
              required
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase">
              Password{user ? ' (leave blank to keep)' : ''}
            </span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 w-full border border-border bg-background px-3 py-2"
              required={!user}
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase">Telephone</span>
            <input
              value={form.tel ?? ''}
              onChange={(e) => setForm({ ...form, tel: e.target.value })}
              className="mt-1 w-full border border-border bg-background px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase">Role</span>
            <select
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as 'admin' | 'staff' })
              }
              className="mt-1 w-full border border-border bg-background px-3 py-2"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          {user && (
            <label className="block">
              <span className="text-xs font-bold uppercase">Status</span>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="mt-1 w-full border border-border bg-background px-3 py-2"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          )}
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

export default function UserAdminPage() {
  const dispatch = useAppDispatch();
  const allUsers = useAppSelector((s) => s.user.items);
  const users = allUsers.filter(isStaffUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    userService
      .getAll()
      .then((items) => {
        if (!cancelled) dispatch(setItems(items));
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to load users';
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

  const handleSave = async (input: CreateUserInput | UpdateUserInput) => {
    setSubmitting(true);
    try {
      if ('User_id' in input) {
        const updated = await userService.update(input);
        dispatch(
          setItems(allUsers.map((u) => (u.User_id === updated.User_id ? updated : u))),
        );
        toast.success('User updated');
      } else {
        const created = await userService.create(input);
        dispatch(addItem(created));
        toast.success('User created');
      }
      closeModal();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save user';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Delete "${user.Full_Name}"?`)) return;

    setDeletingId(user.User_id);
    try {
      await userService.delete(user.User_id);
      dispatch(setItems(allUsers.filter((u) => u.User_id !== user.User_id)));
      toast.success('User deleted');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete user';
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">USERS</h1>
          <p className="text-muted-foreground">
            {loading ? 'Loading…' : `${users.length} admin & staff`}
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
          <Plus className="h-4 w-4" /> Add User
        </button>
      </div>

      {error && (
        <p className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="overflow-x-auto border border-border bg-card">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading users…</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No users found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-secondary text-xs uppercase">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Full Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Tel</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isDeleting = deletingId === u.User_id;

                return (
                  <tr key={u.User_id} className="border-t border-border">
                    <td className="p-3 font-mono text-xs">{u.User_id}</td>
                    <td className="p-3 font-semibold">{u.Full_Name}</td>
                    <td className="p-3">{u.Email}</td>
                    <td className="p-3">{u.tel ?? '—'}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 text-xs ${
                          u.role === 'admin'
                            ? 'bg-accent-brand text-accent-foreground'
                            : 'bg-secondary'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">{u.status}</td>
                    <td className="p-3 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(u);
                            setOpen(true);
                          }}
                          disabled={isDeleting}
                          className="p-1.5 hover:bg-secondary disabled:opacity-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(u)}
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
        <UserModal
          key={editing?.User_id ?? 'new'}
          user={editing}
          onSave={handleSave}
          onClose={closeModal}
          submitting={submitting}
        />
      )}
    </div>
  );
}
