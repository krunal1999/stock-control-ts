import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiCheckCircle } from "react-icons/hi";

interface PurchaseOrder {
  id: number;
  purchaseID: string;
  vendorName: string;
  status: string;
}

const ReceivedOrders: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPurchase, setSelectedPurchase] = useState("");
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    { id: 1, purchaseID: "PO-1001", vendorName: "Vendor A", status: "Pending" },
    { id: 2, purchaseID: "PO-1002", vendorName: "Vendor B", status: "Pending" },
    { id: 3, purchaseID: "PO-1003", vendorName: "Vendor C", status: "Pending" },
  ]);
  const [receivedOrders, setReceivedOrders] = useState<PurchaseOrder[]>([]);

  const handleOrderReceived = (order: PurchaseOrder) => {
    setPurchaseOrders(purchaseOrders.filter((o) => o.id !== order.id));
    setReceivedOrders([...receivedOrders, { ...order, status: "Received" }]);
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
          className="select rounded-lg w-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
          value={selectedPurchase}
          onChange={(e) => setSelectedPurchase(e.target.value)}
        >
          <option value="">Choose Purchase Order</option>
          {receivedOrders.map((order) => (
            <option key={order.id} value={order.purchaseID}>
              {order.purchaseID}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <button
          className="btn btn-outline btn-lg bg-green-400 text-white flex items-center gap-2 rounded-2xl"
          disabled={!selectedPurchase}
          onClick={() => navigate("/admin/add-product")}
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
                  key={order.id}
                  className="border-b border-border-light dark:border-border-dark hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <td className="p-3 font-semibold">{order.purchaseID}</td>

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
