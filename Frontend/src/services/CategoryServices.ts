import axios from "axios";
// import { purchaseData } from "../types/index.d";

const apiUrl = import.meta.env.VITE_BACKEND_API_URL as string;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

class CategoryService {
  getAllCategories() {
    return axiosInstance.get("/admin/inventory/category");
  }
  createCategory(categoryName: string) {
    return axiosInstance.post("/admin/inventory/category", { categoryName });
  }
  deleteCategory(categoryId: string) {
    return axiosInstance.delete(`/admin/inventory/category/${categoryId}`);
  }
}

const categoryService = new CategoryService();
export default categoryService;
