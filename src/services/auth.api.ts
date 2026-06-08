import type {
  LoginCredentials,
  RegisterInput,
  AuthLoginResponse,
  CustomerApiResponse,
  CustomerAuthData,
  AdminLoginResponse,
  UpdateProfileInput,
  UpdateProfileResponse,
} from '@/types/auth.type';
import { toCustomerAuthData } from '@/types/auth.type';
import { isStaffRole } from '@/types/user.type';
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
    if (!isStaffRole(data.user.role)) {
      throw new Error('Access denied. Admin or staff account required.');
    }
    return data;
  },

  updateProfile: async (input: UpdateProfileInput): Promise<void> => {
    const { data } = await api.put<UpdateProfileResponse>('/users/me', input);
    if (!data.success) throw new Error(data.message ?? 'Failed to update profile');
  },
};