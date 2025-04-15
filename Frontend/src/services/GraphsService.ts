import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_API_URL as string;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

class GraphsService {
  getDashboard1() {
    return axiosInstance.get("/admin/graph/dashboard1");
  }
}

const graphsService = new GraphsService();
export default graphsService;
