import React, { useEffect, useState } from "react";
// import { ProductData } from "../../assets/DummyProductList";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import inventoryService from "../../services/InventoryService";
import categoryService from "../../services/CategoryServices";

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

  useEffect(() => {
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
    fetchProducts();
  }, []);

  const handleDelete = (id: string) => {
    setProducts(products?.filter((product) => product._id !== id));
  };

  const filteredProducts = (products || [])?.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterCategory ? product.category === filterCategory : true)
  );

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
              <th className="p-3">Location</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts && paginatedProducts?.length > 0 ? (
              paginatedProducts?.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-border-light dark:border-border-dark hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  {/* Image */}
                  <td className="p-3 text-center">
                    <img
                      src={product.images[0]}
                      alt={product.productName}
                      className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
                    />
                  </td>

                  {/* Product Name */}
                  <td className="p-3 font-semibold">{product.productName}</td>

                  {/* Category */}
                  <td className="p-3">{product.category}</td>

                  {/* Stock */}
                  <td className="p-3 font-semibold">{product.quantity}</td>

                  {/* Location */}
                  <td className="p-3">{product.warehouseName}</td>

                  {/* Actions */}
                  <td className="p-3 flex justify-center gap-3">
                    <button className="btn btn-md bg-amber-300 flex items-center gap-1 dark:text-black">
                      <HiPencilAlt className="text-lg" /> Edit
                    </button>
                    <button
                      className="btn btn-md bg-red-600 flex items-center gap-1 text-black dark:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleDelete(product?._id || "")}
                      disabled={true}
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
    </div>
  );
};

export default ProductUpdate;
