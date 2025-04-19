import React, { useState, useEffect } from "react";
import DataTable from "../../component/adminDashboard/DataTable";
import Card from "../../component/adminDashboard/Card";
import CardContent from "../../component/adminDashboard/CardContent";
import orderService from "../../services/orderServices";

interface Order {
  _id?: string;
  customer: string;
  orderStatus: string;
  amount: string;
  status: string;
  userRef?: {
    fullName: string;
    email: string;
  };
  totalPaid: string;
}
interface CardData {
  title: string;
  value: string;
  color: string;
  border: string;
}

const OrderHistroy: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = JSON.parse(storedUser ?? "{}");
    fetchOrders(user._id);
  }, []);

  const fetchOrders = async (id: String) => {
    const response = await orderService.getAllOrdersByUserId(id);
    const tempData = response.data.data;
    const datalist = tempData;
    console.log(datalist);
    setOrders(datalist);
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Histroy</h1>
      <br />

      {loading ? "loading" : <DataTable data={orders} />}
    </div>
  );
};

export default OrderHistroy;
