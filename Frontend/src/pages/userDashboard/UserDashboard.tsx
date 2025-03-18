import { useEffect, useState } from "react";
import { FaSearch, FaSortAmountUp, FaSortAmountDown } from "react-icons/fa";
import inventoryService from "../../services/InventoryService";
import { useNavigate } from "react-router-dom";

interface Product {
  _id?: string;
  productName: string;
  category: string;
  sellPrice: number;
  images: string[];
  productDescription: string;
}

const UserDashboard = () => {
  const [products, setProducts] = useState<Product[]>();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);
  const productsPerPage = 12;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await inventoryService.getAllProducts();
      // console.log(products.data.data);
      const tempProducts = products.data.data;
      const productData = tempProducts?.map((product: Product) => ({
        _id: product._id,
        productName: product.productName,
        category: product.category,
        sellPrice: product.sellPrice,
        images: product.images,
      }));
      const getCategories = productData?.map(
        (product: Product) => product.category
      );
      const uniqueCategories = [...new Set(getCategories)];

      setCategories(uniqueCategories as string[]);
      setProducts(productData);
    };
    fetchProducts();
  }, []);

  const filteredProducts =
    products
      ?.filter((product) =>
        product.productName.toLowerCase().includes(search.toLowerCase())
      )
      .filter((product) => category === "All" || product.category === category)
      .sort((a, b) =>
        sort === "name"
          ? a.productName.localeCompare(b.productName)
          : a.sellPrice - b.sellPrice
      ) || [];

  // Pagination
  const totalPages = Math.ceil(filteredProducts?.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  const handleProductClick = (productId: string) => {
    console.log(productId);
    navigate(`/user/product/${productId}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center text-primary dark:text-white mb-6">
        🛍️ Product List
      </h1>
      {/* sticky top-30 left-50 right-50 */}

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6  bg-white dark:bg-gray-800 z-10">
        <div className="relative flex items-center w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-full pl-10 text-2xl p-2 rounded-lg border-2 border-gray-300"
          />
          <FaSearch className="absolute left-3 text-gray-500 dark:text-gray-400" />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="select select-bordered text-xl  rounded-lg border-2 border-gray-300"
        >
          <option value="All">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <button
          onClick={() => setSort(sort === "name" ? "price" : "name")}
          className="btn btn-outline flex items-center text-xl rounded-lg border-2 border-gray-300"
        >
          {sort === "name" ? (
            <FaSortAmountUp className="mr-2" />
          ) : (
            <FaSortAmountDown className="mr-2" />
          )}
          Sort by {sort === "name" ? "Price" : "Name"}
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
        {paginatedProducts.length === 0 ? (
          <p className="text-center col-span-3 text-gray-500 dark:text-gray-400">
            No products found
          </p>
        ) : (
          paginatedProducts.map((product) => (
            <div
              key={product._id}
              className="card shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary-light hover:shadow-amber-200"
              onClick={() => handleProductClick(product._id as string)}
            >
              <figure className="p-4">
                <img
                  src={product.images[0]}
                  alt={product.productName}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-lg font-semibold">
                  {product.productName}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {product.category}
                </p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  ${product.sellPrice}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-8 space-x-2 text-2xl dark:text-white">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="btn  btn-xl rounded-lg border-2 border-gray-300 dark:text-white"
        >
          Prev
        </button>
        <span className="text-lg font-semibold">
          {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="btn  btn-xl rounded-lg border-2 border-gray-300 dark:text-white"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
