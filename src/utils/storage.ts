export const storage = { get: (k: string) => typeof window !== 'undefined' ? localStorage.getItem(k) : null }
