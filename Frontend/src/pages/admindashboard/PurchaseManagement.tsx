import React, { useEffect, useReducer, useState } from "react";
import { HiPlusCircle, HiX } from "react-icons/hi";
import vendorservice from "../../services/VendorServices";
import purchaseservice from "../../services/PurchaseService";
import inventoryService from "../../services/InventoryService";
import categoryService from "../../services/CategoryServices";
// Interfaces
interface Vendor {
  _id: string;
  fullName: string;
}

interface Product1 {
  _id?: string;
  productName?: string;
  vendorDetails?: string;
  category?: string;
}

interface Category1 {
  _id: string;
  categoryName: string;
}

interface PurchaseState {
  selectedVendor: string;
  selectedProduct: string;
  totalQuantity: string;
  selectedCategory: string;
  newProductName: string;
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
        newProductName: "",
      };
    default:
      return state;
  }
};

const PurchaseManagement: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product1[]>([]);
  const [categories, setCategories] = useState<Category1[]>([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isNewProduct, setIsNewProduct] = useState(false);

  const [state, dispatch] = useReducer(purchaseReducer, {
    selectedVendor: "",
    selectedProduct: "",
    totalQuantity: "",
    selectedCategory: "",
    error: "",
    newProductName: "",
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

    const fetchProducts = async () => {
      const response = await inventoryService.getAllProducts();
      const productList = response.data.data.map((product: Product1) => ({
        _id: product._id,
        productName: product.productName,
        vendorDetails: product.vendorDetails,
        category: product.category,
      }));
      // console.log(productList);
      setProducts(productList);
    };

    const fetchCategories = async () => {
      const response = await categoryService.getAllCategories();
      const categoryList = response.data.data.map((category: Category1) => ({
        _id: category._id,
        categoryName: category.categoryName,
      }));
      // console.log(categoryList);
      setCategories(categoryList);
    };

    fetchProducts();
    fetchVendors();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (state.selectedProduct.length !== 0) {
      const getProduct = products?.find(
        (p) => p.productName === state.selectedProduct
      );
      console.log(getProduct);
      dispatch({
        type: "SET_FIELD",
        field: "selectedCategory",
        value: getProduct?.category,
      });
      dispatch({
        type: "SET_FIELD",
        field: "selectedVendor",
        value: getProduct?.vendorDetails,
      });

      setIsDisabled(false);
    } else {
      setIsNewProduct(true);
      setIsDisabled(true);
    }
  }, [state.selectedProduct, products, state.newProductName]);

  // Handle Save
  const handleSave = async () => {
    if (
      !state.totalQuantity ||
      !state.selectedCategory ||
      !state.selectedVendor ||
      (state.selectedProduct && state.newProductName)
    ) {
      dispatch({ type: "SET_ERROR", error: "⚠️ Please fill all fields." });
      return;
    }

    dispatch({ type: "SET_ERROR", error: "" });

    const vendor = vendors.find((v) => v.fullName === state.selectedVendor);
    const product = products.find(
      (p) => p.productName === state.selectedProduct
    );
    console.log(product);

    const purchaseData = {
      vendor: state.selectedVendor,
      product: state.selectedProduct
        ? state.selectedProduct
        : state.newProductName,
      quantity: state.totalQuantity,
      category: state.selectedCategory,
      vendorId: vendor?._id || "",
      productId: product?._id ? product?._id : null,
    };
    console.log(purchaseData);

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
        {/* Product Selection */}
        {isNewProduct ? (
          <select
            className="select rounded-lg w-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
            value={state.selectedProduct}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "selectedProduct",
                value: e.target.value,
              })
            }
          >
            <option value="">Choose Existing Product</option>
            {products.map((product) => (
              <option key={product._id} value={product.productName}>
                {product.productName}
              </option>
            ))}
          </select>
        ) : null}

        {/* Vendor Selection */}
        {isDisabled ? (
          <>
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

            <div className="relative">
              <label className="block text-md font-medium text-text-light dark:text-text-dark">
                Add New Product
              </label>
              <input
                list="productList"
                className="input rounded-lg w-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark relative z-10"
                value={state.newProductName}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "newProductName",
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
                  <option key={product._id} value={product.productName} />
                ))}
              </datalist>
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
                  <option key={category._id} value={category.categoryName}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : null}
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
