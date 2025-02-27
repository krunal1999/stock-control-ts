import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 bg-white shadow-md overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
