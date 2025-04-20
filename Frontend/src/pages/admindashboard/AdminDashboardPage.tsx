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
import useAuth from "../../store/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import graphsService from "../../services/GraphsService";

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
      title: "Current Selling Profit",
      value: "\u00A30",
      color: "bg-red-400 dark:text-black",
      border: "border-red-500",
    },
    {
      title: "Expected Profit",
      value: "\u00A30",
      color: "bg-green-400 dark:text-black",
      border: "border-green-500",
    },

    {
      title: "Pending Delivery Orders",
      value: "0",
      color: "bg-yellow-400 dark:text-black",
      border: "border-yellow-500",
    },
    {
      title: "Pending Amount",
      value: "\u00A30",
      color: "bg-orange-400 dark:text-black",
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
    labels: ["Product A", "Product B", "Product C", "Product D"],
    datasets: [
      {
        data: [30, 50, 20, 10],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const { userRole } = useAuth();
  const Navigate = useNavigate();

  const [grapghData1, setGrapghData1] = useState<any>([]);

  useEffect(() => {
    if (userRole !== "admin") {
      Navigate("/admin/orderscompleted");
    }
  }, [userRole]);

  const fetchDashboardGraphs1 = async () => {
    try {
      const res = await graphsService.getDashboard1();
      console.log(res.data.data);
      setGrapghData1(res.data.data);
    } catch (error) {
      console.error("Error fetching dashboard graphs:", error);
    }
  };

  useEffect(() => {
    fetchDashboardGraphs1();
  }, []);

  return (
    <div className="p-6">
      {/* <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="card p-6 bg-surface-light dark:bg-surface-dark shadow-lg rounded-xl border border-border-light dark:border-border-dark">
          <h2 className="text-4xl font-semibold ">📦 Inventory Summary</h2>
          <br />
          <div className="mt-4 text-4xl space-y-8">
            <p>
              ✅ Quantity in Hand: <b>{grapghData1.totalStock}</b>
            </p>
            <p>
              🔄 Quantity to be Received: <b>{grapghData1.purchaseTotal}</b>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="card p-6 bg-surface-light dark:bg-surface-dark shadow-lg rounded-xl border border-border-light dark:border-border-dark mt-6">
          {grapghData1?.firstGraphData?.labels && (
            <Bar
              data={grapghData1?.firstGraphData}
              options={{ responsive: true }}
            />
          )}
        </div>

        <div className=" card p-6 bg-surface-light dark:bg-surface-dark shadow-lg rounded-xl border border-border-light dark:border-border-dark">
          {/* <h2 className="text-lg font-semibold">📊 Product Distribution</h2> */}
          {grapghData1?.thirdGraphData?.labels && (
            <Pie data={grapghData1?.thirdGraphData} options={pieChartOptions} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="card p-6 bg-surface-light dark:bg-surface-dark shadow-lg rounded-xl border border-border-light dark:border-border-dark mt-6">
          {grapghData1?.secondGraphData?.labels && (
            <Bar data={grapghData1?.secondGraphData} />
          )}
        </div>

        <div className=" card p-6 bg-surface-light dark:bg-surface-dark shadow-lg rounded-xl border border-border-light dark:border-border-dark">
          {/* <h2 className="text-lg font-semibold">📊 Product Distribution</h2> */}
          {grapghData1?.fourthGraphData?.labels && (
            <Bar data={grapghData1?.fourthGraphData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
