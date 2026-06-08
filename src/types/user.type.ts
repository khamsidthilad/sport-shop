export type UserRole = 'admin' | 'staff' | 'customer';

export interface User {
  User_id: string;
  Full_Name: string;
  Date_of_birth?: string | null;
  Email: string;
  status: string;
  tel?: string | null;
  image?: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetUsersResponse {
  success: boolean;
  data: User[];
}

export interface GetUserResponse {
  success: boolean;
  data: User;
}

export interface CreateUserInput {
  Full_Name: string;
  Email: string;
  password: string;
  role: 'admin' | 'staff';
  tel?: string;
  status?: string;
}

export interface UpdateUserInput {
  User_id: string;
  Full_Name?: string;
  Email?: string;
  password?: string;
  role?: 'admin' | 'staff';
  tel?: string;
  status?: string;
}

export type UserMutationResponse = GetUserResponse;

export interface DeleteUserResponse {
  success: boolean;
  message?: string;
}

export function isStaffUser(user: User): boolean {
  return user.role === 'admin' || user.role === 'staff';
}
