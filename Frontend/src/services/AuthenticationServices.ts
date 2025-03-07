import axios from "axios";
import { LoginFormData, RegisterFormData } from "types";

const apiUrl = import.meta.env.VITE_BACKEND_API_URL as string;

console.log(import.meta.env.VITE_BACKEND_API_URL);

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

class AuthenticationServices {
  registerUserByEmail(data: RegisterFormData) {
    return axiosInstance.post("/users/registeruser", data);
  }

  loginUserByEmail(data: LoginFormData) {
    return axiosInstance.post("/users/loginuser", data);
  }
}

const authenticationServices = new AuthenticationServices();
export default authenticationServices;
