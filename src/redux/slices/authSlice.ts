import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { authService } from '@/services/auth.api';
import type {
  LoginCredentials,
  RegisterInput,
  CustomerAuthData,
} from '@/types/auth.type';
import { isStaffRole } from '@/types/user.type';

const CUSTOMER_STORAGE_KEY = 'auth_session';
const ADMIN_STORAGE_KEY = 'auth_admin';

export interface AdminSession {
  username: string;
  fullName: string;
  role: string;
  token: string;
}

interface AuthState {
  customerSession: CustomerAuthData | null;
  admin: AdminSession | null;
  error: string | null;
  loading: boolean;
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message ?? error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Request failed';
}

function persistCustomerSession(session: CustomerAuthData | null) {
  if (typeof window === 'undefined') return;
  if (session) {
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(CUSTOMER_STORAGE_KEY);
  }
}

function persistAdminSession(admin: AdminSession | null) {
  if (typeof window === 'undefined') return;
  if (admin) {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admin));
  } else {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  }
}

const initialState: AuthState = {
  customerSession: null,
  admin: null,
  error: null,
  loading: false,
};

export const loginCustomer = createAsyncThunk(
  'auth/loginCustomer',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      return await authService.loginCustomer(credentials);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const registerCustomer = createAsyncThunk(
  'auth/registerCustomer',
  async (input: RegisterInput, { rejectWithValue }) => {
    try {
      return await authService.registerCustomer(input);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      return await authService.loginAdmin(credentials);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutCustomer: (state) => {
      state.customerSession = null;
      state.error = null;
      persistCustomerSession(null);
    },
    setCustomerSession: (state, action: PayloadAction<CustomerAuthData | null>) => {
      state.customerSession = action.payload;
      persistCustomerSession(action.payload);
    },
    setAdmin: (state, action: PayloadAction<AdminSession | null>) => {
      state.admin = action.payload;
      persistAdminSession(action.payload);
    },
    logoutAdmin: (state) => {
      state.admin = null;
      persistAdminSession(null);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const customerAuthCases = (
      thunk: typeof loginCustomer | typeof registerCustomer,
    ) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.loading = false;
          state.customerSession = action.payload;
          persistCustomerSession(action.payload);
          if (state.admin && !isStaffRole(state.admin.role)) {
            state.admin = null;
            persistAdminSession(null);
          }
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error = (action.payload as string) ?? 'Request failed';
        });
    };

    customerAuthCases(loginCustomer);
    customerAuthCases(registerCustomer);

    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = {
          username: action.payload.user.username,
          fullName: `${action.payload.user.name} ${action.payload.user.sname}`,
          role: action.payload.user.role,
          token: action.payload.token,
        };
        persistAdminSession(state.admin);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Admin login failed';
      });
  },
});

export const {
  logoutCustomer,
  logoutAdmin,
  clearError,
} = authSlice.actions;

export const setCustomerSession = authSlice.actions.setCustomerSession;
export const setAdmin = authSlice.actions.setAdmin;

export default authSlice.reducer;
