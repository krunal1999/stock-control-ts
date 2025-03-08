import axios from "axios";
import { purchaseData } from "../types/index.d";

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
}

const purchaseservice = new PurchaseService();
export default purchaseservice;
