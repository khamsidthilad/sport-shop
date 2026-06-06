export interface Customer {
  cus_id: number;
  cus_name: string;
  Tel: string;
  address: string;
  cus_status: string;
  Email: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllCustomersResponse {
  success: boolean;
  data: Customer[];
}

export interface GetCustomerResponse {
  success: boolean;
  data: Customer;
}

export interface DeleteCustomerResponse {
  success: boolean;
  message?: string;
}
