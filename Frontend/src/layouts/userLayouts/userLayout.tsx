import { Outlet } from "react-router-dom";
import Navbar from "../../layouts/Navbar";
import ProtectedRoute from "../../layouts/ProtectedRoute";
import useAuth from "../../store/useAuth";
import Footer from "../../layouts/Footer";
import toast from "react-hot-toast";

const UserLayout: React.FC = () => {
  // const userRole = localStorage.getItem("userRole") || "";
  const { isLoggedIn, userRole } = useAuth();

  if (!isLoggedIn) {
    toast.error("Please log in to access this page.");
  }

  return (
    <>
      {isLoggedIn && userRole && userRole === "user" ? (
        <>
          <Navbar />
          <div className="flex min-h-screen bg-gray-100 dark:bg-gray-800">
            <main className="flex-1 p-6 bg-white shadow-md overflow-auto dark:bg-gray-800">
              <Outlet />
            </main>
          </div>
          <Footer />
        </>
      ) : (
        <ProtectedRoute isAllowed={false} />
      )}
    </>
  );
};

export default UserLayout;
