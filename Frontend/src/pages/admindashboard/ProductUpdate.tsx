import React, { useEffect, useState } from "react";
// import { ProductData } from "../../assets/DummyProductList";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import inventoryService from "../../services/InventoryService";
import categoryService from "../../services/CategoryServices";
import toast from "react-hot-toast";

interface Product {
  _id?: string;
  productName: string;
  costPrice: string;
  sellPrice: string;
  discountPrice: string;
  stock: string;
  location: string;
  locationType: string;
  volume: string;
  weight: string;
  length: string;
  breadth: string;
  height: string;
  countryOfOrigin: string;
  category: string;
  images: string[];
  minQuantityAlert: string;
  lowStockAlert: string;
  vendorDetails: string;
  quantity: string;
  productDescription: string;
  vendorId: string;
  warehouseName: string;
  isActice: string;
}

interface Category {
  _id: string;
  categoryName: string;
}

const ProductUpdate: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [products, setProducts] = useState<Product[]>();
  const [filterMinQty, setFilterMinQty] = useState<string>("all");
  const [filterLowStock, setFilterLowStock] = useState<string>("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const fetchProducts = async () => {
    const response = await inventoryService.getAllProducts();
    // console.log(response.data.data);
    setProducts(response.data.data);

    const getCategories = async () => {
      const response = await categoryService.getAllCategories();
      // console.log(response.data.data);
      setCategories(response.data.data);
    };
    getCategories();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setCurrentProduct(product); // Set the product to be edited
    setIsModalOpen(true); // Open the modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal
    setCurrentProduct(null); // Clear the current product
  };

  const handleSave = async () => {
    console.log(currentProduct);
    try {
      await inventoryService.updateProduct(
        currentProduct?._id || "",
        currentProduct
      );
      toast.success("Product updated successfully!");
      setIsModalOpen(false);
      setCurrentProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product.");
    }
  };

  const handleDelete = async (id: string) => {
    console.log("Delete product with ID:", id);
    try {
      await inventoryService.deleteProduct(id);
      toast.success("Product deleted successfully!");

      fetchProducts();
    } catch (error) {
      console.error("Error delete product:", error);
      toast.error("Failed to delete product.");
    }
  };

  // const filteredProducts = (products || [])?.filter(
  //   (product) =>
  //     product.productName.toLowerCase().includes(searchQuery.toLowerCase()) &&
  //     (filterCategory ? product.category === filterCategory : true)
  // );

  const filteredProducts = (products || [])?.filter((product) => {
    // Name and category filter (existing)
    const matchesSearch = product.productName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory
      ? product.category === filterCategory
      : true;

    // Min Quantity Alert filter (new)
    let matchesMinQty = true;
    if (filterMinQty === "below") {
      matchesMinQty = Number(product.stock) < Number(product.minQuantityAlert);
    } else if (filterMinQty === "above") {
      matchesMinQty = Number(product.stock) >= Number(product.minQuantityAlert);
    }

    // Low Stock Alert filter (new)
    let matchesLowStock = true;
    if (filterLowStock === "below") {
      matchesLowStock = Number(product.stock) < Number(product.lowStockAlert);
    } else if (filterLowStock === "above") {
      matchesLowStock = Number(product.stock) >= Number(product.lowStockAlert);
    }

    return matchesSearch && matchesCategory && matchesMinQty && matchesLowStock;
  });

  const paginatedProducts = filteredProducts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 border rounded-xl bg-surface-light dark:bg-surface-dark shadow-lg">
      <h2 className="text-2xl font-bold text-primary dark:text-primary-light text-center">
        🛍️ Manage Products
      </h2>

      <div className="flex flex-col md:flex-row gap-4 mt-6">
        <input
          type="text"
          placeholder="🔍 Search Products"
          className="input w-full md:w-1/2 border border-border-light dark:border-border-dark rounded-lg shadow-sm h-16 text-2xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="select w-full md:w-1/3 border border-border-light dark:border-border-dark rounded-lg shadow-sm h-16 text-2xl"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories?.map((category) => (
            <option key={category._id} value={category.categoryName}>
              {category.categoryName}
            </option>
          ))}
        </select>
        {/* Min Quantity Alert Filter */}
        <select
          className="select w-full md:w-1/5 border border-border-light dark:border-border-dark rounded-lg shadow-sm h-16 text-xl"
          value={filterMinQty}
          onChange={(e) => setFilterMinQty(e.target.value)}
        >
          <option value="all">All Minimum Qty</option>
          <option value="below">Below Min Qty</option>
          <option value="above">Above Min Qty</option>
        </select>
        {/* Low Stock Alert Filter */}
        <select
          className="select w-full md:w-1/5 border border-border-light dark:border-border-dark rounded-lg shadow-sm h-16 text-xl"
          value={filterLowStock}
          onChange={(e) => setFilterLowStock(e.target.value)}
        >
          <option value="all">All Stock Levels</option>
          <option value="below">Below Low Stock</option>
          <option value="above">Above Low Stock</option>
        </select>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto mt-6 text-xl">
        <table className="table-auto w-full border border-border-light dark:border-border-dark rounded-lg shadow-sm">
          <thead className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
            <tr className="border-b border-border-light dark:border-border-dark">
              <th className="p-3">Image</th>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Min Qty Alert</th>
              <th className="p-3">Low Stock Alert</th>
              <th className="p-3">Sell Price</th>
              <th className="p-3">Location</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts && paginatedProducts?.length > 0 ? (
              paginatedProducts?.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-border-light dark:border-border-dark hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-center"
                >
                  <td className="p-3 ">
                    <div className="flex justify-center">
                      <img
                        src={product.images[0]}
                        alt={product.productName}
                        className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
                      />
                    </div>
                  </td>

                  {/* Product Name */}
                  <td className="p-3 font-semibold">{product.productName}</td>

                  {/* Category */}
                  <td className="p-3">{product.category}</td>

                  {/* Stock */}
                  <td className="p-3 font-semibold">{product.stock}</td>

                  <td>
                    <span
                      className={`p-3 font-semibold rounded-4xl ${
                        Number(product.minQuantityAlert) <=
                        Number(product.stock)
                          ? "bg-green-100 dark:bg-green-900"
                          : "bg-red-100 dark:bg-red-900"
                      }`}
                    >
                      {product.minQuantityAlert}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`p-3 font-semibold rounded-4xl ${
                        Number(product.lowStockAlert) <= Number(product.stock)
                          ? "bg-green-100 dark:bg-green-900"
                          : "bg-red-100 dark:bg-red-900"
                      }`}
                    >
                      {product.lowStockAlert}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="p-3">{product.warehouseName}</td>

                  <td className="p-3">{product.sellPrice}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        product.isActice === "Active"
                          ? "bg-green-100 text-green-600 dark:bg-green-600 dark:text-white"
                          : "bg-red-100 text-red-800 dark:bg-red-400 dark:text-black"
                      }`}
                    >
                      {product.isActice}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      className="btn btn-md bg-amber-300 flex items-center gap-1 dark:text-black"
                      onClick={() => handleEdit(product)}
                    >
                      <HiPencilAlt className="text-lg" /> Edit
                    </button>
                    <button
                      className="btn btn-md bg-red-600 flex items-center gap-1 text-black dark:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleDelete(product?._id || "")}
                    >
                      <HiTrash className="text-lg" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-6 text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-gray-600 dark:text-gray-400">
          Showing{" "}
          {Math.min(
            (currentPage - 1) * itemsPerPage + 1,
            filteredProducts.length
          )}{" "}
          - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{" "}
          {filteredProducts.length}
        </p>
        <div className="flex gap-3">
          <button
            className="btn btn-lg btn-outline bg-gray-200"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            ⬅️ Previous
          </button>
          <button
            className="btn btn-lg btn-outline bg-green-200"
            disabled={currentPage * itemsPerPage >= filteredProducts.length}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next ➡️
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && currentProduct && (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-center z-10 p-4 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Edit Product
              </h3>
              <button
                onClick={handleModalClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Product Name
                </label>
                <input
                  type="text"
                  className="input w-full border rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={currentProduct.productName}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      productName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cost Price
                </label>
                <input
                  type="text"
                  className="input w-full border rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={currentProduct.costPrice}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      costPrice: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sell Price
                </label>
                <input
                  type="text"
                  className="input w-full border rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={currentProduct.sellPrice}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      sellPrice: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Discount Price
                </label>
                <input
                  type="text"
                  className="input w-full border rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={currentProduct.discountPrice}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      discountPrice: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <select
                  className="select w-full border rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={currentProduct.category}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      category: e.target.value,
                    })
                  }
                >
                  <option value="">Select Category</option>
                  {categories?.map((category) => (
                    <option key={category._id} value={category.categoryName}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Min Quantity Alert
                </label>
                <input
                  type="text"
                  className="input w-full border rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={currentProduct.minQuantityAlert}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      minQuantityAlert: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Low Stock Alert
                </label>
                <input
                  type="text"
                  className="input w-full border rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={currentProduct.lowStockAlert}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      lowStockAlert: e.target.value,
                    })
                  }
                />
              </div>

              {/* Add Active or InActive dropbox */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  className="select w-full border rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={currentProduct.isActice}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      isActice: e.target.value,
                    })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Product Description
                </label>
                <textarea
                  className="textarea w-full border rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={currentProduct.productDescription}
                  rows={4}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      productDescription: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex justify-end gap-3 md:col-span-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600"
                  onClick={handleModalClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductUpdate;
