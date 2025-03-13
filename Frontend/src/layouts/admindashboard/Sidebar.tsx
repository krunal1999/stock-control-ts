import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiMenu, HiX, HiChevronDown } from "react-icons/hi";

interface SidebarItem {
  label: string;
  path?: string;
  menu?: string;
  children?: SidebarItem[];
}

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [selectedLink, setSelectedLink] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleLinkClick = (path: string, menu?: string) => {
    navigate(path);
    setSelectedLink(path);
    if (menu) {
      setOpenMenu(null);
    }
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const MenuItem: React.FC<{ item: SidebarItem }> = ({ item }) => {
    if (item.children) {
      return (
        <li>
          <button
            onClick={() => {
              if (openMenu === item.menu) {
                setOpenMenu(null);
              } else {
                setOpenMenu(item.menu || "");
              }
            }}
            className={`w-full flex justify-between items-center p-3 rounded-lg transition ${
              openMenu === item.menu
                ? "bg-primary text-white"
                : "bg-gray-300 dark:bg-background-dark text-text-light dark:text-text-dark hover:bg-primary hover:text-white"
            }`}
          >
            {item.label}
            <HiChevronDown
              className={`transform transition ${
                openMenu === item.menu ? "rotate-180" : ""
              }`}
            />
          </button>
          <ul
            className={`ml-4 mt-2 space-y-2 transition-all ${
              openMenu === item.menu ? "block" : "hidden"
            }`}
          >
            {item.children.map((child) => (
              <li key={child.path}>
                <button
                  onClick={() => handleLinkClick(child.path || "", item.menu)}
                  className={`block p-2 rounded-lg transition ${
                    selectedLink === child.path
                      ? "bg-primary text-white"
                      : "hover:bg-primary hover:text-white"
                  }`}
                >
                  {child.label}
                </button>
              </li>
            ))}
          </ul>
        </li>
      );
    } else {
      return (
        <li>
          <button
            onClick={() => handleLinkClick(item.path || "")}
            className={`block p-3 rounded-lg transition ${
              selectedLink === item.path
                ? "bg-primary text-white"
                : "hover:bg-primary hover:text-white"
            }`}
          >
            {item.label}
          </button>
        </li>
      );
    }
  };

  const sidebarItems: SidebarItem[] = [
    {
      label: "Dashboard",
      menu: "dashboard",
      children: [
        { label: "Dashboard", path: "/admin/" },
        { label: "Reports", path: "/admin/reports" },
        { label: "Data", path: "/admin/data" },
      ],
    },
    {
      label: "Purchase Management",
      menu: "purchase",
      children: [
        { label: "Vendor Management", path: "/admin/vendor" },
        { label: "Purchase Management", path: "/admin/purchase" },
        { label: "Received order", path: "/admin/receivedorder" },
      ],
    },
    {
      label: "Inventory Management",
      menu: "inventory",
      children: [
        { label: "Inventory", path: "/admin/inventory" },
        { label: "Add Product", path: "/admin/add-product" },
        { label: "Update Product", path: "/admin/update-product" },
        { label: "Category", path: "/admin/category" },
        // { label: "Warehouse", path: "/admin/warehouse" },
        { label: "Warehouse", path: "/admin/warehouse1" },
      ],
    },
    {
      label: "Order Management",
      menu: "order",
      children: [
        { label: "Orders Dashboard", path: "/admin/orders" },
        { label: "Received Orders", path: "/admin/userorders" },
      ],
    },
    {
      label: "Billing",
      menu: "billing",
      children: [
        { label: "Billing Dashboard", path: "/admin/billing" },
        { label: "Pay Bills", path: "/admin/paybills" },
      ],
    },
  ];

  return (
    <div className="flex">
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-primary p-2 rounded text-white"
      >
        {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
      </button>

      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-surface-light dark:bg-surface-dark shadow-lg p-4 transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40`}
      >
        <h2 className="text-2xl font-bold text-primary dark:text-primary-light mb-6 text-center">
          Admin Dashboard
        </h2>

        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <MenuItem key={item.label} item={item} />
          ))}
        </ul>
      </div>

      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
