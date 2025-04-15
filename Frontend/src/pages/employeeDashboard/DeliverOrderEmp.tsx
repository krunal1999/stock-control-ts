import React, { useEffect, useState } from "react";
import orderService from "../../services/orderServices";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  productName: string;
  category: string;
  availableQuantity: number;
  sellPrice: number;
  locations: { location: string }[];
  quantity: number;
  stock: number;
  totalPrice: number;
}

interface Order {
  _id: string;
  userRef: {
    fullName: string;
    email: string;
  };
  products: {
    productId: Product;
    quantity: number;
    productName: string;
    totalPrice: number;
  }[];
  totalPaid: number;
  status: string;
  orderStatus: string;
  paymentId: string;
  paymentMethod: string;
  createdAt: string;
  quantity: number;
  productName: string;
  stock: number;
}

const DeliverOrderEmp: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    const response = await orderService.getAllDeliveryOrders();
    const tempOrders = response.data.data;
    const tempOrdersWithStock = tempOrders.filter((order: Order) => {
      return order.orderStatus === "Confirmed";
    });
    // console.log(tempOrdersWithStock);
    setOrders(tempOrdersWithStock);
  };

  console.log(selectedOrder);

  useEffect(() => {
    fetchOrders();
  }, [loading]);

  const handleSelectOrder = (orderId: string) => {
    const order = orders.find((order) => order._id === orderId) || null;
    setSelectedOrder(order);
  };

  const handleSendForDelivery = async (orderId: string) => {
    if (!selectedOrder) return;

    try {
      const response = await orderService.updateOrderStatusByEmp(orderId);
      console.log(response);
      if (response.status === 200) {
        toast.success("Order Has been Sent for Delivery");
        setSelectedOrder(null);
        setLoading((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Deliver Order
      </h1>

      {/* Order Selection Dropdown */}
      <select
        className="select  w-full text-xl h-16 p-4 border-2 border-gray-300 dark:bg-gray-800 dark:text-white mb-2"
        onChange={(e) => handleSelectOrder(e.target.value)}
      >
        <option value="">Select an Order</option>
        {orders.map((order) => (
          <option key={order._id} value={order._id}>
            {order._id}
          </option>
        ))}
      </select>

      {/* Order Details */}
      {selectedOrder && (
        <div className="border p-5 rounded-lg shadow-lg bg-white dark:bg-gray-900 mt-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Order Details
          </h2>

          <p className="text-xl text-gray-700 dark:text-gray-300">
            <strong>Customer:</strong> {selectedOrder.userRef.fullName} (
            {selectedOrder.userRef.email})
          </p>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            <strong>Payment Status:</strong> {selectedOrder.status}
          </p>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            <strong>Total Paid:</strong> £{selectedOrder.totalPaid}
          </p>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            <strong>Order Status:</strong> {selectedOrder.orderStatus}
          </p>

          <br />
          <hr />
          <h3 className="text-2xl font-semibold mt-5 text-gray-900 dark:text-white">
            Products
          </h3>

          <div className="overflow-x-auto mt-3">
            <table className="table table-zebra w-full border dark:border-gray-700 text-xl">
              <thead className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-xl">
                <tr>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Available Qty</th>
                  <th className="p-3">Ask Qty</th>
                  <th className="p-3">Location</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.products.map((product1, id) => (
                  <tr
                    key={id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <td className="p-3 text-gray-900 dark:text-white">
                      {product1.productName}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {product1.productId.category}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {product1.productId.stock}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {product1.quantity}
                    </td>

                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {product1.productId.locations[0].location}
                    </td>
                  </tr>
                ))}

                {/* <td className="p-3 text-gray-900 dark:text-white"></td>
                <td className="p-3 text-gray-700 dark:text-gray-300"></td>
                <td className="p-3 text-gray-700 dark:text-gray-300"></td>
                <td className="p-3 text-gray-700 dark:text-gray-300"></td>
                <td className="p-3 text-gray-700 dark:text-gray-300"></td>
                <td className="p-3 text-gray-700 dark:text-gray-300">
                  £ {selectedOrder.totalPaid}
                </td> */}
              </tbody>
            </table>
          </div>

          <button
            className="mt-6 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() => handleSendForDelivery(selectedOrder?._id)}
          >
            Collect and Send for Delivery
          </button>
        </div>
      )}
    </div>
  );
};

export default DeliverOrderEmp;
