import type {
  LoginCredentials,
  RegisterInput,
  AuthLoginResponse,
  CustomerApiResponse,
  CustomerAuthData,
  AdminLoginResponse,
} from '@/types/auth.type';
import { toCustomerAuthData } from '@/types/auth.type';
import { api } from './api';

async function fetchCustomerSession(
  login: AuthLoginResponse,
): Promise<CustomerAuthData> {
  const { data } = await api.get<CustomerApiResponse>(
    `/customers/${login.user.customerId}`,
    { headers: { Authorization: `Bearer ${login.token}` } },
  );
  return toCustomerAuthData(login, data.data);
}

export const authService = {
  loginCustomer: async (credentials: LoginCredentials) => {
    const { data } = await api.post<AuthLoginResponse>('/auth/login', credentials);
    if (!data.success) throw new Error(data.message ?? 'Login failed');
    return fetchCustomerSession(data);
  },

  registerCustomer: async (input: RegisterInput) => {
    const { data } = await api.post<AuthLoginResponse>('/auth/register', input);
    if (!data.success) throw new Error(data.message ?? 'Registration failed');
    return fetchCustomerSession(data);
  },

  loginAdmin: async (credentials: LoginCredentials) => {
    const { data } = await api.post<AdminLoginResponse>('/auth/login', credentials);
    if (!data.success) throw new Error(data.message ?? 'Admin login failed');
    return data;
  },
};