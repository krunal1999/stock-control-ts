import React, { useState } from "react";
import { ProductData } from "../../assets/DummyProductList";
import { HiPencilAlt, HiTrash } from "react-icons/hi";

interface Product {
  id: number;
  name: string;
  category: string;
  stock: number;
  location: string;
  image: string;
}

const ProductUpdate: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [products, setProducts] = useState<Product[]>(ProductData);

  const handleDelete = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterCategory ? product.category === filterCategory : true)
  );

  const paginatedProducts = filteredProducts.slice(
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
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Clothing">Clothing</option>
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
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border-light dark:border-border-dark hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  {/* Image */}
                  <td className="p-3 text-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
                    />
                  </td>

                  {/* Product Name */}
                  <td className="p-3 font-semibold">{product.name}</td>

                  {/* Category */}
                  <td className="p-3">{product.category}</td>

                  {/* Stock */}
                  <td className="p-3 font-semibold">{product.stock}</td>

                  {/* Location */}
                  <td className="p-3">{product.location}</td>

                  {/* Actions */}
                  <td className="p-3 flex justify-center gap-3">
                    <button className="btn btn-md bg-amber-300 flex items-center gap-1">
                      <HiPencilAlt className="text-lg" /> Edit
                    </button>
                    <button
                      className="btn btn-md bg-red-600 flex items-center gap-1 text-black"
                      onClick={() => handleDelete(product.id)}
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
