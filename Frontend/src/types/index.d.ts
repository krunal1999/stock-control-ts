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

export interface purchaseData {
  vendor: string;
  product: string;
  quantity: string;
  category: string;
  vendorId: string;
  productId: string | null;
}

export interface ProductFormData {
  productName: string;
  costPrice: string;
  sellPrice: string;
  discountPrice: string;
  stock: string;
  location: string;
  locationType: string;
  volume: string;
  weight: string;
  length: string;
  breadth: string;
  height: string;
  countryOfOrigin: string;
  category: string;
  images: File[];
  minQuantityAlert: string;
  lowStockAlert: string;
  vendorDetails: string;
  quantity: string;
  productDescription: string;
  vendorId: string;
}

export interface PurchaseOrder {
  _id: string;
  orderId: string;
  purchaseID: string;
  vendorName: string;
  status: string;
  productRef?: string | null;
}
