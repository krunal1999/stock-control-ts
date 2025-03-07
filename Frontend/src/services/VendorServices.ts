import axios from "axios";
import { Vendor } from "../types/index.d";

const apiUrl = import.meta.env.VITE_BACKEND_API_URL as string;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

class vendorService {
  getAllVendor() {
    return axiosInstance.get("/admin/purchase/vendor");
  }
  createVendor(data: Vendor) {
    return axiosInstance.post("/admin/purchase/vendor", data);
  }
  updateVendor(id: string, data: Vendor) {
    return axiosInstance.put(`/admin/purchase/vendor/${id}`, data);
  }
  deleteVendor(id: string) {
    return axiosInstance.delete(`/admin/purchase/vendor/${id}`);
  }
}

const vendorservice = new vendorService();
export default vendorservice;
