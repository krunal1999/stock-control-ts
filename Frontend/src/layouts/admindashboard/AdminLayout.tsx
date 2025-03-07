import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "../../layouts/Navbar";
const AdminLayout: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-800">
        <Sidebar />
        <main className="flex-1 p-6 bg-white shadow-md overflow-auto dark:bg-gray-800">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
