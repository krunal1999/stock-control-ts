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
  stock: number;
}

interface Order {
  _id: string;
  userRef: {
    fullName: string;
    email: string;
  };
  products: { productId: Product; quantity: number }[];
  totalPaid: number;
  status: string;
  orderStatus: string;
  paymentId: string;
  paymentMethod: string;
  createdAt: string;
  stock: number;
  productName: string;
}

const DeliverOrder: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    const response = await orderService.getAllDeliveryOrders();
    const tempOrders = response.data.data;
    const tempOrdersWithStock = tempOrders.filter((order: Order) => {
      return order.orderStatus === "Pending";
    });
    // console.log(tempOrdersWithStock);
    setOrders(tempOrdersWithStock);
  };

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
      const response = await orderService.updateOrderStatus(orderId);
      console.log(response);
      if (response.status === 200) {
        toast.success("Order Has been Send");
        setSelectedOrder(null);
        setLoading((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // <div className="max-w-2xl mx-auto p-6">
    //   <h1 className="text-xl font-bold mb-4">Deliver Order</h1>

    //   {/* Order Selection Dropdown */}
    //   <select
    //     className="w-full p-2 border mb-4"
    //     onChange={(e) => handleSelectOrder(e.target.value)}
    //   >
    //     <option value="">Select an Order</option>
    //     {orders.map((order) => (
    //       <option key={order._id} value={order._id}>
    //         {order._id}
    //       </option>
    //     ))}
    //   </select>

    //   {/* Order Details */}
    //   {selectedOrder && (
    //     <div className="border p-4 rounded-lg shadow">
    //       <h2 className="text-lg font-semibold">Order Details</h2>
    //       <p>
    //         <strong>Customer:</strong> {selectedOrder.userRef.fullName} (
    //         {selectedOrder.userRef.email})
    //       </p>
    //       <p>
    //         <strong>Payment Status:</strong> {selectedOrder.status}
    //       </p>
    //       <p>
    //         <strong>Total Paid:</strong> £{selectedOrder.totalPaid}
    //       </p>
    //       <p>
    //         <strong>Order Status:</strong> {selectedOrder.orderStatus}
    //       </p>

    //       <h3 className="text-lg font-semibold mt-4">Products</h3>
    //       <table className="w-full border-collapse border">
    //         <thead>
    //           <tr className="bg-gray-200">
    //             <th className="border p-2">Product Name</th>
    //             <th className="border p-2">Category</th>
    //             <th className="border p-2">Available</th>
    //             <th className="border p-2">Selling Price</th>
    //             <th className="border p-2">Location</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {selectedOrder.products.map(({ productId }) => (
    //             <tr key={productId._id}>
    //               <td className="border p-2">{productId.productName}</td>
    //               <td className="border p-2">{productId.category}</td>
    //               <td className="border p-2">{productId.stock}</td>
    //               <td className="border p-2">£{productId.sellPrice}</td>
    //               <td className="border p-2">
    //                 {productId.locations[0].location}
    //               </td>
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>

    //       <button
    //         className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
    //         onClick={handleSendForDelivery}
    //       >
    //         Send for Delivery
    //       </button>
    //     </div>
    //   )}
    // </div>
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
                  <th className="p-3">Available</th>
                  <th className="p-3">Selling Price</th>
                  <th className="p-3">Location</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.products.map(({ productId }) => (
                  <tr
                    key={productId._id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <td className="p-3 text-gray-900 dark:text-white">
                      {productId.productName}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {productId.category}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {productId.stock}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      £{productId.sellPrice}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {productId.locations[0].location}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            className="mt-6 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() => handleSendForDelivery(selectedOrder?._id)}
          >
            Send for Delivery
          </button>
        </div>
      )}
    </div>
  );
};

export default DeliverOrder;
