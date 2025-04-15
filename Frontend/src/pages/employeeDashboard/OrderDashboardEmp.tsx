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

const OrderDashboardEmp: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const orderCards: CardData[] = [
    {
      title: "Confirmed Orders",
      value: orders
        .filter((order) => order.orderStatus == "Confirmed")
        .length.toString(),
      color: "bg-red-200 dark:text-black",
      border: "border-red-500",
    },
    {
      title: "Confirmed Order Amount",
      value:
        "\u00A3" +
        orders.reduce((acc, order) => acc + parseFloat(order.totalPaid), 0),
      color: "bg-green-200 dark:text-black",
      border: "border-green-500",
    },
  ];

  const fetchOrders = async () => {
    const response = await orderService.getAllOrders();
    const tempData = response.data.data;
    const datalist = tempData.filter(
      (order: Order) => order.orderStatus === "Confirmed"
    );
    console.log(datalist);
    setOrders(datalist);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Dashboard</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {orderCards.map((card, index) => (
          <Card
            key={index}
            className={`p-4 ${card.color} ${card.border} border rounded-xl`}
          >
            <CardContent>
              <p className="text-lg font-semibold">{card.title}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <br />

      {loading ? "loading" : <DataTable data={orders} />}
    </div>
  );
};

export default OrderDashboardEmp;
