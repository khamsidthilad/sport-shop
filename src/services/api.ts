import axios from 'axios';

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const admin = localStorage.getItem('auth_admin');
    if (admin) return (JSON.parse(admin) as { token?: string }).token ?? null;

    const customer = localStorage.getItem('auth_session');
    if (customer) return (JSON.parse(customer) as { token?: string }).token ?? null;
  } catch {
    return null;
  }
  return null;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? '',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});