import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiCheckCircle } from "react-icons/hi";
import purchaseservice from "../../services/PurchaseService";
import toast from "react-hot-toast";

interface PurchaseOrder {
  _id: string;
  orderId: string;
  purchaseID: string;
  vendorName: string;
  status: string;
  productRef?: string | null;
}

const ReceivedOrders: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPurchase, setSelectedPurchase] = useState("");
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [receivedOrders, setReceivedOrders] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      const response = await purchaseservice.getAllPurchaseOrder();
      console.log(response.data.data);

      const purchaseOrders = response.data.data.filter(
        (order: PurchaseOrder) => order.status === "Pending"
      );
      const receivedOrders = response.data.data.filter(
        (order: PurchaseOrder) =>
          order.status === "Received" && order.productRef !== null
      );
      setPurchaseOrders(purchaseOrders);
      setReceivedOrders(receivedOrders);
    };
    fetchPurchaseOrders();
  }, [isLoading]);

  const handleOrderReceived = async (order: PurchaseOrder) => {
    setPurchaseOrders(purchaseOrders.filter((o) => o._id !== order._id));
    try {
      setIsLoading(true);
      const response = await purchaseservice.updatePurchaseOrder(order._id);
      if (response.status === 200) {
        toast.success("Order received successfully");
        setIsLoading(false);
      }
      console.log(response);
    } catch (error) {
      toast.error("Failed to receive order");
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleAddToInventory = async (orderId: string) => {
    console.log(orderId);
    const order = receivedOrders.find((o) => o.orderId === orderId);
    console.log(order);

    if (order?.productRef !== null && order) {
      try {
        setIsLoading(true);
        const response = await purchaseservice.addPurchaseOrderToInventory(
          order
        );
        if (response.status === 200) {
          setIsLoading(false);
          alert("Product added to inventory successfully");
        }
      } catch (error: any) {
        setIsLoading(false);
        alert("Failed to add product to inventory");
        // console.log(error?.response?.data?.error);
        alert(error?.response?.data?.error);
      }
    } else {
      navigate(`/admin/add-product/`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-surface-light dark:bg-surface-dark shadow-lg p-6 rounded-xl border border-border-light dark:border-border-dark">
      <h2 className="text-2xl font-bold text-primary dark:text-primary-light text-center">
        📦 Received Orders
      </h2>

      <div className="grid grid-cols-1 gap-4 mt-6">
        <label className="block text-md font-medium text-text-light dark:text-text-dark">
          Select Received Order
        </label>
        <select
          className="select rounded-lg w-full border border-border-light dark:border-border-dark bg-background-light text-black dark:bg-background-dark  dark:text-white"
          value={selectedPurchase}
          onChange={(e) => setSelectedPurchase(e.target.value)}
        >
          <option value="">Choose Purchase Order</option>
          {receivedOrders.map((order) => (
            <option key={order._id} value={order.orderId}>
              {order.orderId}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <button
          className="btn  btn-lg bg-green-400 text-black flex items-center gap-2 rounded-2xl  border border-gray-300 dark:border-gray-600 dark:bg-green-400 dark:text-white"
          disabled={!selectedPurchase}
          onClick={() => handleAddToInventory(selectedPurchase)}
        >
          Add to Inventory
        </button>
      </div>

      <div className="overflow-x-auto mt-6">
        <table className="table-auto w-full border border-border-light dark:border-border-dark rounded-lg shadow-sm">
          <thead className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
            <tr className="border-b border-border-light dark:border-border-dark">
              <th className="p-3 text-left">Purchase ID</th>
              <th className="p-3 text-left">Vendor Name</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.length > 0 ? (
              purchaseOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-border-light dark:border-border-dark hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <td className="p-3 font-semibold">{order.orderId}</td>

                  <td className="p-3">{order.vendorName}</td>

                  <td
                    className={`p-3 font-semibold ${
                      order.status === "Pending"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {order.status}
                  </td>

                  <td className="p-3 flex justify-center">
                    <button
                      className="btn btn-success btn-sm flex items-center gap-1"
                      onClick={() => handleOrderReceived(order)}
                    >
                      <HiCheckCircle className="text-lg" /> Order Received
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center p-6 text-gray-500">
                  No pending orders.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReceivedOrders;
