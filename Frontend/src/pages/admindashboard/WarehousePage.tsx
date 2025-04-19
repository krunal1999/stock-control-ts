import { useState, useEffect } from "react";
import warehouseService from "../../services/WarehouseService";
import toast from "react-hot-toast";
interface Warehouse {
  row: number;
  col: number;
  totalVolume: number;
  warehouseName: string;
  _id?: string;
}

const WarehousePage: React.FC = () => {
  const [formData, setFormData] = useState({
    row: 0,
    col: 0,
    totalVolume: 0,
    warehouseName: "",
  });

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch warehouses on page load
  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await warehouseService.getWarehouseTypes();
      setWarehouses(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log(formData);

    if (
      !formData.row ||
      !formData.col ||
      !formData.totalVolume ||
      !formData.warehouseName.trim()
    ) {
      toast.error("⚠️ All fields are required.");
      setLoading(false);
      return;
    }

    if (formData.row <= 0 || formData.col <= 0 || formData.totalVolume <= 0) {
      toast.error(
        "⚠️ Row, Column, and Total Volume must be greater than zero."
      );
      setLoading(false);
      return;
    }

    try {
      await warehouseService.createWarehouse(formData);
      toast.success("Warehouse Created Successfully!");
      setFormData({ row: 0, col: 0, totalVolume: 0, warehouseName: "" });
      fetchWarehouses();
    } catch (error) {
      console.error("Error creating warehouse:", error);
      toast.error("⚠️ Failed to create warehouse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Warehouses</h1>

      {/* Form to create a warehouse */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-md rounded-lg mb-8 dark:bg-gray-800 dark:text-white"
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="row"
            placeholder="Rows"
            value={formData.row}
            onChange={handleChange}
            className="p-3 border rounded-md w-full"
            required
          />
          <input
            type="number"
            name="col"
            placeholder="Columns"
            value={formData.col}
            onChange={handleChange}
            className="p-3 border rounded-md w-full"
            required
          />
          <input
            type="number"
            name="totalVolume"
            placeholder="Total Volume"
            value={formData.totalVolume}
            onChange={handleChange}
            className="p-3 border rounded-md w-full"
            required
          />
          <input
            type="text"
            name="warehouseName"
            placeholder="Warehouse Name"
            value={formData.warehouseName}
            onChange={handleChange}
            className="p-3 border rounded-md w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Warehouse"}
        </button>
      </form>

      {/* List of warehouses */}
      <h2 className="text-2xl font-semibold mb-4">All Warehouses</h2>
      {warehouses.length === 0 ? (
        <p className="text-gray-500">No warehouses found.</p>
      ) : (
        <ul className="bg-white p-4 rounded-lg shadow dark:bg-gray-800 dark:text-white">
          {warehouses &&
            warehouses?.map((warehouse) => (
              <li
                key={warehouse._id}
                className="border-b py-2 flex justify-between"
              >
                <span>
                  <strong>{warehouse.warehouseName}</strong>
                </span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default WarehousePage;
