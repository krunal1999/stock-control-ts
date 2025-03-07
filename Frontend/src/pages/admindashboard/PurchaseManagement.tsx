import React, { useState } from "react";
import { HiPlusCircle, HiX } from "react-icons/hi";

interface Vendor {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

const PurchaseManagement: React.FC = () => {
  const [vendors] = useState<Vendor[]>([
    { id: 1, name: "Vendor A" },
    { id: 2, name: "Vendor B" },
  ]);

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Product A" },
    { id: 2, name: "Product B" },
  ]);

  const [categories] = useState<Category[]>([
    { id: 1, name: "Category A" },
    { id: 2, name: "Category B" },
  ]);

  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [totalQuantity, setTotalQuantity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (
      !selectedVendor ||
      (!selectedProduct && !newProductName) ||
      !totalQuantity ||
      !selectedCategory
    ) {
      setError("⚠️ Please fill all fields.");
      return;
    }

    if (newProductName) {
      const newProduct: Product = { id: Date.now(), name: newProductName };
      setProducts([...products, newProduct]);
      setSelectedProduct(newProduct.name);
    }

    alert("✅ Purchase saved successfully!");

    setSelectedVendor("");
    setSelectedProduct("");
    setNewProductName("");
    setTotalQuantity("");
    setSelectedCategory("");
    setError("");
  };

  return (
    <div className="max-w-2xl mx-auto bg-surface-light dark:bg-surface-dark shadow-lg p-6 rounded-xl border border-border-light dark:border-border-dark">
      <h2 className="text-2xl font-bold text-primary dark:text-primary-light text-center">
        🛒 Purchase Management
      </h2>

      <div className="grid grid-cols-1 gap-4 mt-6">
        <div>
          <label className="block text-md font-medium text-text-light dark:text-text-dark">
            Select Vendor
          </label>
          <select
            className="select rounded-lg w-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
          >
            <option value="">Choose a Vendor</option>
            {vendors.map((vendor) => (
              <option key={vendor.id} value={vendor.name}>
                {vendor.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-md font-medium text-text-light dark:text-text-dark">
            Select Product
          </label>
          <select
            className="select rounded-lg w-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">Choose a Product</option>
            {products.map((product) => (
              <option key={product.id} value={product.name}>
                {product.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Or Add New Product"
            className="input rounded-lg w-full mt-2 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-md font-medium text-text-light dark:text-text-dark">
            Total Quantity
          </label>
          <input
            type="number"
            placeholder="Enter Quantity"
            className="input rounded-lg w-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
            value={totalQuantity}
            onChange={(e) => setTotalQuantity(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-md font-medium text-text-light dark:text-text-dark">
            Select Category
          </label>
          <select
            className="select rounded-lg w-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Choose a Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <div className="flex justify-end gap-4 mt-6">
        <button
          className="btn btn-outline btn-lg bg-green-400 text-white flex items-center gap-2"
          onClick={handleSave}
        >
          <HiPlusCircle className="text-lg" /> Order
        </button>
        <button
          className="btn btn-outline btn-lg bg-red-600 text-white flex items-center gap-2"
          onClick={() => window.location.reload()}
        >
          <HiX className="text-lg" /> Cancel
        </button>
      </div>
    </div>
  );
};

export default PurchaseManagement;
