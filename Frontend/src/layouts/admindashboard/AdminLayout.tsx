import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "../../layouts/Navbar";
import ProtectedRoute from "../../layouts/ProtectedRoute";
import useAuth from "../../store/useAuth";
const AdminLayout: React.FC = () => {
  // const userRole = localStorage.getItem("userRole") || "";
  const { isLoggedIn, userRole } = useAuth();

  return (
    <>
      {isLoggedIn &&
      userRole &&
      (userRole === "admin" || userRole === "employee") ? (
        <>
          <Navbar />
          <div className="flex min-h-screen bg-gray-100 dark:bg-gray-800">
            <Sidebar />
            <main className="flex-1 p-6 bg-white shadow-md overflow-auto dark:bg-gray-800">
              <Outlet />
            </main>
          </div>
        </>
      ) : (
        <ProtectedRoute isAllowed={false} />
      )}
    </>
  );
};

export default AdminLayout;
