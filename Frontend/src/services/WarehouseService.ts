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

class WarehouseService {
  getWarehouse() {
    return axiosInstance.get("/admin/warehouse/getwarehouse");
  }
  getAvailableCells() {
    return axiosInstance.get("/admin/warehouse/getavailablecells");
  }
  getAvailableCellbyLocation() {
    return axiosInstance.get("/admin/warehouse/getavailablecellbylocation");
  }
  getWarehouseTypes() {
    return axiosInstance.get("/admin/warehouse/getwarehousetypes");
  }
  getWarehouseByType(warehouseName: string) {
    return axiosInstance.get(
      `/admin/warehouse/getwarehousebytype/${warehouseName}`
    );
  }
}

const warehouseService = new WarehouseService();
export default warehouseService;
