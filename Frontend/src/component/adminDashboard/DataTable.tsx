import React, { useState } from "react";
import { HiEye } from "react-icons/hi";

interface Order {
  id: number;
  product: string;
  customer: string;
  status: string;
  amount: string;
}

interface DataTableProps {
  data: Order[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="overflow-x-auto bg-surface-light dark:bg-surface-dark shadow-lg p-6 rounded-xl border border-border-light dark:border-border-dark">
      <h2 className="text-3xl font-bold text-primary dark:text-primary-light text-center mb-4">
        📋 Orders Table
      </h2>

      <table className="table-auto w-full border border-border-light dark:border-border-dark rounded-lg shadow-sm text-2xl">
        <thead className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
          <tr className="border-b border-border-light dark:border-border-dark">
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Product</th>
            <th className="p-3 text-left">Customer</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border-light dark:border-border-dark hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                <td className="p-3 font-semibold">{order.id}</td>
                <td className="p-3">{order.product}</td>
                <td className="p-3">{order.customer}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xl font-semibold ${
                      order.status === "Pending"
                        ? "bg-yellow-500 text-black"
                        : order.status === "Completed"
                        ? "bg-green-500 text-white"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-3">{order.amount}</td>
                <td className="p-3 flex justify-center gap-2">
                  <button className="btn btn-md flex items-center gap-1">
                    <HiEye className="text-lg" /> View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-6 text-gray-500">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-between align-center mt-4 gap-4">
        <div className="text-xl font-semibold text-center ">
          Page {currentPage} of {totalPages}
        </div>

        <div className="flex justify-space mt-4 gap-4">
          <button
            className="btn btn-xl bg-amber-400 "
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <button
            className="btn btn-xl bg-green-400"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
