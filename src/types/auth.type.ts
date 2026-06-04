
/** API customer record */
export interface ApiCustomer {
  cus_id: number;
  cus_name: string;
  Tel: string;
  address: string;
  cus_status: string;
  Email: string;
  updatedAt: string;
  createdAt: string;
}

/** API user record (login / register) */
export interface AuthUser {
  id: string;
  name: string;
  sname: string;
  username: string;
  role: string;
}

/** Customer login / register session payload */
export interface CustomerAuthData {
  customer: ApiCustomer;
  user: AuthUser;
  token: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  sname: string;
  dateOfBirth: string;
  username: string;
  password: string;
  tel: string;
  address: string;
  email?: string;
}

/** Admin login API response shape */
export interface AdminLoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: AdminAuthUser;
}

export interface AdminAuthUser {
  id: string;
  name: string;
  sname: string;
  username: string;
  role: string;
  customerId: number | null;
}

/** Register API response shape */
export interface RegisterApiResponse {
  success: boolean;
  data: RegisterUserData;
}

export interface RegisterUserData {
  User_id: string;
  Full_Name: string;
  Date_of_birth: string;
  Email: string;
  status: string;
  tel: string;
  image: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}


// types to add in auth.type.ts
export interface AuthLoginResponse {
    success: boolean;
    message?: string;
    token: string;
    user: AdminAuthUser; // has customerId — works for customer login too
  }
  
  export interface CustomerApiResponse {
    success: boolean;
    data: ApiCustomer;
  }
  
  export function toCustomerAuthData(
    login: AuthLoginResponse,
    customer: ApiCustomer,
  ): CustomerAuthData {
    return {
      token: login.token,
      user: {
        id: login.user.id,
        name: login.user.name,
        sname: login.user.sname,
        username: login.user.username,
        role: login.user.role,
      },
      customer,
    };
  }