export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  mobile: string;
  gender: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface Vendor {
  fullName: string;
  email: string;
  contactNumber: string;
  companyName: string;
  companyAddress: string;
  companyMobileNumber: string;
  brandName?: string;
  countryOfOrigin: string;
}
