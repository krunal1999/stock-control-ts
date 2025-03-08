import React, { useEffect, useReducer, useState } from "react";
import { HiPlusCircle, HiX } from "react-icons/hi";
import vendorservice from "../../services/VendorServices";
import purchaseservice from "../../services/PurchaseService";
// Interfaces
interface Vendor {
  _id: string;
  fullName: string;
}

interface Product {
  _id: string;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface PurchaseState {
  selectedVendor: string;
  selectedProduct: string;
  totalQuantity: string;
  selectedCategory: string;
  error: string;
}

// Reducer Function for Managing State Efficiently
const purchaseReducer = (state: PurchaseState, action: any): PurchaseState => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "RESET":
      return {
        selectedVendor: "",
        selectedProduct: "",
        totalQuantity: "",
        selectedCategory: "",
        error: "",
      };
    default:
      return state;
  }
};

const PurchaseManagement: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [state, dispatch] = useReducer(purchaseReducer, {
    selectedVendor: "",
    selectedProduct: "",
    totalQuantity: "",
    selectedCategory: "",
    error: "",
  });

  // Fetch Data (Vendors, Products, Categories)
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await vendorservice.getAllVendor();
        const vendorList = response.data.data.map((vendor: Vendor) => ({
          _id: vendor._id,
          fullName: vendor.fullName,
        }));
        setVendors(vendorList);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();

    setProducts([
      { _id: "1", name: "Product A" },
      { _id: "2", name: "Product B" },
    ]);

    setCategories([
      { id: 1, name: "Category A" },
      { id: 2, name: "Category B" },
      { id: 3, name: "Category C" },
    ]);
  }, []);

  // Handle Save
  const handleSave = async () => {
    if (
      !state.selectedVendor ||
      !state.selectedProduct ||
      !state.totalQuantity ||
      !state.selectedCategory
    ) {
      dispatch({ type: "SET_ERROR", error: "⚠️ Please fill all fields." });
      return;
    }

    dispatch({ type: "SET_ERROR", error: "" });

    const vendor = vendors.find((v) => v.fullName === state.selectedVendor);
    const product = products.find((p) => p.name === state.selectedProduct);

    const purchaseData = {
      vendor: state.selectedVendor,
      product: state.selectedProduct,
      quantity: state.totalQuantity,
      category: state.selectedCategory,
      vendorId: vendor?._id || "",
      productId: product?._id ? product?._id : null,
    };

    try {
      const response = await purchaseservice.createPurchaaseOrder(purchaseData);
      console.log(response);
      if (response.status === 200) {
        dispatch({ type: "RESET" });
        alert("Purchase Order Created Successfully");
      }
    } catch (error) {
      console.error("Error creating purchase order:", error);
      alert("Error creating purchase order");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-surface-light dark:bg-surface-dark shadow-lg p-6 rounded-xl border border-border-light dark:border-border-dark">
      <h2 className="text-2xl font-bold text-primary dark:text-primary-light text-center">
        🛒 Purchase Management
      </h2>

      <div className="grid grid-cols-1 gap-4 mt-6">
        {/* Vendor Selection */}
        <div>
          <label className="block text-md font-medium text-text-light dark:text-text-dark">
            Select Vendor
          </label>
          <select
            className="select rounded-lg w-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
            value={state.selectedVendor}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "selectedVendor",
                value: e.target.value,
              })
            }
          >
            <option value="">Choose a Vendor</option>
            {vendors.map((vendor) => (
              <option key={vendor._id} value={vendor.fullName}>
                {vendor.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* Product Selection */}
        <div className="relative">
          <label className="block text-md font-medium text-text-light dark:text-text-dark">
            Select From Existing Products
          </label>
          <input
            type="text"
            className="input rounded-lg w-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
            value={state.selectedProduct}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "selectedProduct",
                value: e.target.value,
              })
            }
            onFocus={() => setShowDropdown(true)}
            placeholder="Choose or Enter a Product"
          />

          {showDropdown && (
            <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 shadow-md z-20 rounded-lg max-h-40 overflow-y-auto dark:bg-gray-800 dark:text-white ">
              {products.map((product) => (
                <li
                  key={product._id}
                  className="p-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-600"
                  onClick={() => {
                    dispatch({
                      type: "SET_FIELD",
                      field: "selectedProduct",
                      value: product.name,
                    });
                    setShowDropdown(false);
                  }}
                >
                  {product.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative">
          <label className="block text-md font-medium text-text-light dark:text-text-dark">
            Add New Product
          </label>
          <input
            list="productList"
            className="input rounded-lg w-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark relative z-10"
            value={state.selectedProduct}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "selectedProduct",
                value: e.target.value,
              })
            }
            placeholder="Choose or Enter a Product"
          />
          <datalist
            id="productList"
            className="absolute top-full left-0 w-full bg-white border border-gray-300 shadow-md z-20"
          >
            {products.map((product) => (
              <option key={product._id} value={product.name} />
            ))}
          </datalist>
        </div>

        {/* Quantity Input */}
        <div>
          <label className="block text-md font-medium text-text-light dark:text-text-dark">
            Total Quantity
          </label>
          <input
            type="number"
            placeholder="Enter Quantity"
            className="input rounded-lg w-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
            value={state.totalQuantity}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "totalQuantity",
                value: e.target.value,
              })
            }
          />
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-md font-medium text-text-light dark:text-text-dark">
            Select Category
          </label>
          <select
            className="select rounded-lg w-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
            value={state.selectedCategory}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "selectedCategory",
                value: e.target.value,
              })
            }
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

      {/* Error Message */}
      {state.error && (
        <p className="text-red-500 text-sm mt-2">{state.error}</p>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          className="btn btn-outline btn-lg bg-green-400 text-white flex items-center gap-2"
          onClick={handleSave}
        >
          <HiPlusCircle className="text-lg" /> Order
        </button>
        <button
          className="btn btn-outline btn-lg bg-red-600 text-white flex items-center gap-2"
          onClick={() => dispatch({ type: "RESET" })}
        >
          <HiX className="text-lg" /> Cancel
        </button>
      </div>
    </div>
  );
};

export default PurchaseManagement;
