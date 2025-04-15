function DashboardData() {
  const apiUrl = import.meta.env.VITE_BACKEND_API_URL as string;

  const downloadFileProductCsv = async (format: "csv") => {
    const endpoint =
      format === "csv" ? `${apiUrl}/admin/export/csv/products` : "";
    const filename = format === "csv" ? "products.csv" : "";

    const response = await fetch(endpoint);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const downloadFilePurchaseCsv = async (format: "csv") => {
    const endpoint =
      format === "csv" ? `${apiUrl}/admin/export/csv/purchase` : "";
    const filename = format === "csv" ? "purchase.csv" : "";

    const response = await fetch(endpoint);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const downloadFileCategpryCsv = async (format: "csv") => {
    const endpoint =
      format === "csv" ? `${apiUrl}/admin/export/csv/category` : "";
    const filename = format === "csv" ? "category.csv" : "";

    const response = await fetch(endpoint);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const downloadFileOrderCsv = async (format: "csv") => {
    const endpoint = format === "csv" ? `${apiUrl}/admin/export/csv/order` : "";
    const filename = format === "csv" ? "order.csv" : "";

    const response = await fetch(endpoint);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-8 mt-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Download All Products data in CSV format
        </p>
        <button
          onClick={() => downloadFileProductCsv("csv")}
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
        >
          Download
        </button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Download All Purchase data in CSV format
        </p>
        <button
          onClick={() => downloadFilePurchaseCsv("csv")}
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
        >
          Download
        </button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Download All Category data in CSV format
        </p>
        <button
          onClick={() => downloadFileCategpryCsv("csv")}
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
        >
          Download
        </button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Download All Order data in CSV format
        </p>
        <button
          onClick={() => downloadFileOrderCsv("csv")}
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
        >
          Download
        </button>
      </div>
    </div>
  );
}
export default DashboardData;
