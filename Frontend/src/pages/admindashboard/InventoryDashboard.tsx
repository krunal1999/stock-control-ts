import { useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from "chart.js";

import Card from "../../component/adminDashboard/Card";
import CardContent from "../../component/adminDashboard/CardContent";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

const InventoryDashboard = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  const inventoryChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Stock Levels",
        data: [100, 150, 200, 250, 300],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const lowStockData = {
    labels: ["Product A", "Product B", "Product C"],
    datasets: [
      {
        data: [5, 2, 8],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  interface CardData {
    title: string;
    value: string;
    color: string;
    border: string;
  }

  const revenueCards: CardData[] = [
    {
      title: "Total Investment",
      value: "\u00A30",
      color: "bg-blue-200",
      border: "border-blue-500",
    },
    {
      title: "Current Selling Profit",
      value: "\u00A30",
      color: "bg-red-200",
      border: "border-red-500",
    },
    {
      title: "Expected Profit",
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

  return (
    <div className="p-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {revenueCards.map((card, index) => (
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

      {activeTab === "Overview" && (
        <div className="grid grid-cols-3 gap-6 mt-6">
          <div className="p-6 border rounded-xl bg-white">
            <h2 className="text-lg font-semibold">Stock Levels</h2>
            <Bar data={inventoryChartData} />
          </div>
          <div className="p-6 border rounded-xl bg-white">
            <h2 className="text-lg font-semibold">Inventory Trends</h2>
            <Line data={inventoryChartData} />
          </div>
          <div className="p-6 border rounded-xl bg-white">
            <h2 className="text-lg font-semibold">Low Stock Alerts</h2>
            <Pie data={lowStockData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryDashboard;
