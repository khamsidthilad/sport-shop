export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  shopName: string;
}

export interface ContactInfoResponse {
  success: boolean;
  data: ContactInfo;
  message?: string;
}

export interface SubmitContactInput {
  name: string;
  email: string;
  message: string;
}

export interface SubmitContactResponse {
  success: boolean;
  message?: string;
  data?: { id: number };
}
