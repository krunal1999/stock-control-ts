import axios from "axios";
import { purchaseData, PurchaseOrder } from "../types/index.d";

const apiUrl = import.meta.env.VITE_BACKEND_API_URL as string;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

class PurchaseService {
  getAllPurchaseOrder() {
    return axiosInstance.get("/admin/purchase");
  }
  createPurchaaseOrder(data: purchaseData) {
    return axiosInstance.post("/admin/purchase", data);
  }
  updatePurchaseOrder(id: string) {
    return axiosInstance.put(`/admin/purchase/${id}`);
  }
  addPurchaseOrderToInventory(data: PurchaseOrder) {
    return axiosInstance.put(`/admin/inventory/product/add-to-inventory`, data);
  }
  updatePurchaseOrderComplete(id: string) {
    return axiosInstance.put(`/admin/purchase/complete/${id}`);
  }
}

const purchaseservice = new PurchaseService();
export default purchaseservice;
