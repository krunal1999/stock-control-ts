import axios from "axios";
// import { ProductFormData } from "../types/index.d";

const apiUrl = import.meta.env.VITE_BACKEND_API_URL as string;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

class InventoryService {
  addNewProduct(data: FormData) {
    return axiosInstance.post("/admin/inventory/product", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        enctype: "multipart/form-data",
      },
    });
  }

  getAllProducts() {
    return axiosInstance.get("/admin/inventory/product");
  }
  getProductById(id: string) {
    return axiosInstance.get(`/admin/inventory/product/${id}`);
  }
  //   updateProduct(id: string, data: any) {
  //     return axiosInstance.put(`/admin/product/${id}`, data);
  //   }
}

const inventoryService = new InventoryService();
export default inventoryService;
