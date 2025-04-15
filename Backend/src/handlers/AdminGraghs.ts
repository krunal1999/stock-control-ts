import Product from "../models/Product";
import { ApiError, ApiSuccess } from "../utils/api-response";
import { NextFunction, Request, Response } from "express";

export const getgrapghData1 = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const products = await Product.find();

    const labels = products.map((p) => p.productName);
    const quantities = products.map((p) => parseInt(p.quantity));

    // inventory monitoring. <Bar data={stockChartData} options={{ responsive: true }} />
    let firstGraphData = {
      labels: labels,
      datasets: [
        {
          label: "Stock Quantity",
          data: quantities,
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        },
      ],
    };

    // revenue insights.
    const profitData = products.map((product) => {
      const profit =
        parseFloat(product.sellPrice) - parseFloat(product.costPrice);
      return {
        label: product.productName,
        profit,
      };
    });

    const secondGraphData = {
      labels: profitData.map((data) => data.label),
      datasets: [
        {
          label: "Profit",
          data: profitData.map((data) => data.profit),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        },
      ],
    };

    const categoryCount = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    // <Pie data={categoryPieData} />
    const thirdGraphData = {
      labels: categoryCount.map((item) => item._id),
      datasets: [
        {
          label: "Product  Count",
          data: categoryCount.map((item) => item.count),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        },
      ],
    };

    const lowStockProducts = await Product.find().then((products) =>
      products.filter(
        (p) => parseInt(p.quantity) < parseInt(p.lowStockAlert || "0")
      )
    );
    const fourthGraphData = {
      labels: lowStockProducts.map((p) => p.productName),
      datasets: [
        {
          label: "Low Stock Products",
          data: lowStockProducts.map((p) => parseInt(p.quantity)),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        },
      ],
    };

    const data = {
      firstGraphData,
      secondGraphData,
      thirdGraphData,
      fourthGraphData,
    };

    res.status(200).json(new ApiSuccess(data, 200));
  } catch (error) {
    res.status(500).json(new ApiError("Failed to fetch products", 500, error));
  }
};
