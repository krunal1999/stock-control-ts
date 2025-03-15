import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_API_URL as string;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

class UserServices {
  getUserDetails() {
    return axiosInstance.get("/users/userdashboard/getuserdetails");
  }
}

const userServices = new UserServices();
export default userServices;
