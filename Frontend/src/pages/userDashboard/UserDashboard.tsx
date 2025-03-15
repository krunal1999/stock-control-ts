import { useEffect, useState } from "react";
import { FaSearch, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import userServices from "../../services/UserServices";

// Mock Product Data (Replace with actual API data if needed)
const mockProducts = [
  {
    id: 1,
    name: "Laptop",
    category: "Electronics",
    price: 1000,
    imageUrl: "https://placehold.co/600x400",
  },
  {
    id: 2,
    name: "Phone",
    category: "Electronics",
    price: 800,
    imageUrl: "https://placehold.co/600x400",
  },
  {
    id: 3,
    name: "Shoes",
    category: "Fashion",
    price: 120,
    imageUrl: "https://placehold.co/600x400",
  },
  {
    id: 4,
    name: "Watch",
    category: "Fashion",
    price: 250,
    imageUrl: "https://placehold.co/600x400",
  },
  {
    id: 5,
    name: "TV",
    category: "Electronics",
    price: 1500,
    imageUrl: "https://placehold.co/600x400",
  },
  {
    id: 6,
    name: "Chair",
    category: "Furniture",
    price: 200,
    imageUrl: "https://placehold.co/600x400",
  },
  {
    id: 7,
    name: "Table",
    category: "Furniture",
    price: 350,
    imageUrl: "https://placehold.co/600x400",
  },
  {
    id: 8,
    name: "Bag",
    category: "Fashion",
    price: 75,
    imageUrl: "https://placehold.co/600x400",
  },
  {
    id: 9,
    name: "Headphones",
    category: "Electronics",
    price: 180,
    imageUrl: "https://placehold.co/600x400",
  },
  {
    id: 10,
    name: "Microwave",
    category: "Appliances",
    price: 400,
    imageUrl: "https://placehold.co/600x400",
  },
  {
    id: 11,
    name: "Blender",
    category: "Appliances",
    price: 100,
    imageUrl: "https://placehold.co/600x400",
  },
  {
    id: 12,
    name: "Jeans",
    category: "Fashion",
    price: 60,
    imageUrl: "https://placehold.co/600x400",
  },
];

const UserDashboard = () => {
  const [products] = useState(mockProducts); // Static data
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name"); // Default sort by name
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Apply Filtering, Sorting, and Search
  useEffect(() => {
    let updatedProducts = [...products];
    const getUserDetails = async () => {
      try {
        const userDetails = await userServices.getUserDetails();
        console.log(userDetails);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getUserDetails();

    // Search filter
    if (search.trim()) {
      updatedProducts = updatedProducts.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (category !== "All") {
      updatedProducts = updatedProducts.filter((p) => p.category === category);
    }

    // Sorting
    updatedProducts.sort((a, b) =>
      sort === "name" ? a.name.localeCompare(b.name) : a.price - b.price
    );

    setFilteredProducts(updatedProducts);
    setPage(1); // Reset pagination when filtering
  }, [search, sort, category, products]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / limit);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * limit,
    page * limit
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Product List</h1>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
        {/* Search */}
        <div className="flex items-center border rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 w-full outline-none"
          />
          <button className="bg-blue-500 text-white p-2">
            <FaSearch />
          </button>
        </div>

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Furniture">Furniture</option>
          <option value="Appliances">Appliances</option>
        </select>

        {/* Sorting */}
        <button
          onClick={() => setSort(sort === "name" ? "price" : "name")}
          className="flex items-center bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          {sort === "name" ? (
            <FaSortAmountUp className="mr-2" />
          ) : (
            <FaSortAmountDown className="mr-2" />
          )}
          Sort by {sort === "name" ? "Price" : "Name"}
        </button>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProducts.length === 0 ? (
          <p className="text-center col-span-3">No products found</p>
        ) : (
          paginatedProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 shadow-md bg-white"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
              <p className="text-gray-500">{product.category}</p>
              <p className="text-lg font-bold text-blue-600">
                ${product.price}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={`px-4 py-2 rounded-lg ${
            page === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
        >
          Prev
        </button>
        <span className="text-lg">
          {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className={`px-4 py-2 rounded-lg ${
            page >= totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
