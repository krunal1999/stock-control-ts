import React, { useState, useEffect } from "react";
import DataTable from "../../component/adminDashboard/DataTable";
import Card from "../../component/adminDashboard/Card";
import CardContent from "../../component/adminDashboard/CardContent";

interface Order {
  id: number;
  product: string;
  customer: string;
  status: string;
  amount: string;
}
interface CardData {
  title: string;
  value: string;
  color: string;
  border: string;
}

const OrderDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const orderCards: CardData[] = [
    {
      title: "Total Orders",
      value: "\u00A30",
      color: "bg-blue-200",
      border: "border-blue-500",
    },
    {
      title: "Pending Orders",
      value: "\u00A30",
      color: "bg-red-200",
      border: "border-red-500",
    },
    {
      title: "Pending Order Amount",
      value: "\u00A30",
      color: "bg-green-200",
      border: "border-green-500",
    },
    {
      title: "Net Profit",
      value: "\u00A30",
      color: "bg-teal-200",
      border: "border-teal-500",
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setOrders([
        {
          id: 1,
          product: "Laptop",
          customer: "Alice",
          status: "Pending",
          amount: "£1200",
        },
        {
          id: 2,
          product: "Phone",
          customer: "Bob",
          status: "Pending",
          amount: "£800",
        },
        {
          id: 3,
          product: "Tablet",
          customer: "Charlie",
          status: "Pending",
          amount: "£500",
        },
        {
          id: 4,
          product: "Monitor",
          customer: "David",
          status: "Pending",
          amount: "£300",
        },
      ]);
      setLoading(false);
    }, 100);
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

export default OrderDashboard;
