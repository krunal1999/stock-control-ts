import axios from "axios";
import { RegisterFormData } from "types";

const apiUrl = import.meta.env.VITE_BACKEND_API_URL as string;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

class AuthenticationServices {
  registerUserByEmail(data: RegisterFormData) {
    return axiosInstance.post("/users/registerUser", data);
  }
}

const authenticationServices = new AuthenticationServices();
export default authenticationServices;
