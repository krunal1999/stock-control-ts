import Card from "../../component/adminDashboard/Card";
import CardContent from "../../component/adminDashboard/CardContent";

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
  ChartOptions,
} from "chart.js";

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

interface CardData {
  title: string;
  value: string;
  color: string;
  border: string;
}

const AdminDashboardPage: React.FC = () => {
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

  const summaryCards: CardData[] = [
    {
      title: "Pending Delivery Quantity",
      value: "0",
      color: "bg-orange-200",
      border: "border-orange-500",
    },
    {
      title: "Pending Delivery Orders",
      value: "0",
      color: "bg-yellow-200",
      border: "border-yellow-500",
    },
    {
      title: "Pending Bills",
      value: "0",
      color: "bg-red-200",
      border: "border-red-500",
    },
    {
      title: "Pending Amount",
      value: "\u00A30",
      color: "bg-orange-300",
      border: "border-orange-600",
    },
  ];

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Revenue",
        data: [10, 20, 30, 40, 50],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Sales Trend",
        data: [15, 25, 35, 45, 55],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const pieChartOptions: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const pieChartData = {
    labels: ["Product A", "Product B", "Product C"],
    datasets: [
      {
        data: [30, 50, 20],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

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

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {summaryCards.map((card, index) => (
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

      {/* Chart & Inventory Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="card p-6 bg-surface-light dark:bg-surface-dark shadow-lg rounded-xl border border-border-light dark:border-border-dark">
          <h2 className="text-lg font-semibold">📊 Overall Revenue</h2>
          <Bar data={chartData} />
        </div>

        <div className="card p-6 bg-surface-light dark:bg-surface-dark shadow-lg rounded-xl border border-border-light dark:border-border-dark">
          <h2 className="text-lg font-semibold">📦 Inventory Summary</h2>
          <div className="mt-4">
            <p>
              ✅ Quantity in Hand: <b>0</b>
            </p>
            <p>
              🔄 Quantity to be Received: <b>0</b>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="card p-6 bg-surface-light dark:bg-surface-dark shadow-lg rounded-xl border border-border-light dark:border-border-dark">
          <h2 className="text-lg font-semibold">📊 Sales Trend</h2>
          <Line data={lineChartData} />
        </div>

        <div className=" card p-6 bg-surface-light dark:bg-surface-dark shadow-lg rounded-xl border border-border-light dark:border-border-dark">
          {/* <h2 className="text-lg font-semibold">📊 Product Distribution</h2> */}
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
