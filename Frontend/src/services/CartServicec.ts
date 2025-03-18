import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_API_URL as string;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

class CartService {
  getCart() {
    return axiosInstance.get("/users/userdashboard/getcart");
  }
  addToCart(productId: string, quantity: number) {
    return axiosInstance.post("/users/userdashboard/addtocart", {
      productId,
      quantity,
    });
  }
  updateCart(productId: string, quantity: number) {
    return axiosInstance.put("/users/userdashboard/updatecart", {
      productId,
      quantity,
    });
  }
  deleteCart(productId: string) {
    return axiosInstance.delete(`/users/userdashboard/deletecart/${productId}`);
  }
  checkoutCart() {
    return axiosInstance.post("/users/userdashboard/checkout");
  }
  checkoutSuccess(sessionId: string) {
    return axiosInstance.get(
      `/users/userdashboard/checkout/success?session_id=${sessionId}`
    );
  }
}

const cartService = new CartService();
export default cartService;
