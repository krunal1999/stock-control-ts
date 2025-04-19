import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_API_URL as string;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

class OrderService {
  getAllOrders() {
    return axiosInstance.get("/admin/orders");
  }
  getAllOrdersByUserId(id: String) {
    return axiosInstance.get(`/admin/orders/user/${id}`);
  }
  getAllDeliveryOrders() {
    return axiosInstance.get("/admin/orders/delivery");
  }
  updateOrderStatus(orderId: string) {
    return axiosInstance.put(`/admin/orders/${orderId}`);
  }
  updateOrderStatusByEmp(orderId: string) {
    return axiosInstance.put(`/admin/orders/emp/${orderId}`);
  }
}

const orderService = new OrderService();
export default orderService;
