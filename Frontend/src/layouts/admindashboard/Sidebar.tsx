import { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="w-64 min-h-screen bg-base-200 p-4 shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-6">Admin Dashboard</h2>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => toggleMenu("dashboard")}
            className="w-full text-left p-2 bg-base-100 rounded-lg"
          >
            Dashboard
          </button>
          {openMenu === "dashboard" && (
            <ul className="ml-4 mt-2">
              <li>
                <Link
                  to="/dashboard/tab1"
                  className="block p-2 hover:bg-base-300 rounded"
                >
                  Reports
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/tab2"
                  className="block p-2 hover:bg-base-300 rounded"
                >
                  Data
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link to="/users" className="block p-2 hover:bg-base-300 rounded">
            User Management
          </Link>
        </li>
        <li>
          <Link to="/inventory" className="block p-2 hover:bg-base-300 rounded">
            Inventory Management
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
