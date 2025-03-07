import { FormInput } from "../../component/adminDashboard/FormInput";
import { useState } from "react";
import { HiOutlinePhotograph, HiOutlineCloudUpload } from "react-icons/hi";

interface ProductFormData {
  productName: string;
  costPrice: string;
  sellPrice: string;
  discountPrice: string;
  stock: string;
  location: string;
  size: string;
  weight: string;
  length: string;
  breadth: string;
  height: string;
  countryOfOrigin: string;
  category: string;
  images: File[];
  minQuantityAlert: string;
  lowStockAlert: string;
  vendorDetails: string;
  quantity: string;
  additionalDetails: string;
}

const AddInventoryForm: React.FC = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    productName: "",
    costPrice: "",
    sellPrice: "",
    discountPrice: "",
    stock: "",
    location: "",
    size: "",
    weight: "",
    length: "",
    breadth: "",
    height: "",
    countryOfOrigin: "",
    category: "",
    images: [],
    minQuantityAlert: "",
    lowStockAlert: "",
    vendorDetails: "",
    quantity: "",
    additionalDetails: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, images: Array.from(e.target.files) });
    }
  };

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [productDetails, setProductDetails] = useState({
    name: "Product Name",
    price: "£0.00",
    category: "Category",
    stock: "0",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
  };

  return (
    <div className="flex flex-col md:flex-row flex-wrap gap-4 h-auto mb-4  bg-amber-100 ">
      <div className="flex-8/12 max-w-6xl   bg-surface-light dark:bg-surface-dark shadow-lg p-6 rounded-xl border border-border-light dark:border-border-dark">
        <h2 className="text-2xl font-bold text-primary dark:text-primary-light text-center">
          📦 Add Inventory
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
        >
          <FormInput
            label="Product Name"
            name="productName"
            placeholder="Enter Product Name"
            handleChange={handleChange}
          />

          <FormInput
            label="Cost Price (£)"
            name="costPrice"
            type="number"
            placeholder="Enter Cost Price"
            handleChange={handleChange}
          />

          <FormInput
            label="Sell Price (£)"
            name="sellPrice"
            type="number"
            placeholder="Enter Sell Price"
            handleChange={handleChange}
          />

          <FormInput
            label="Discount Price (£)"
            name="discountPrice"
            type="number"
            placeholder="Enter Discount Price"
            handleChange={handleChange}
          />

          <FormInput
            label="Stock"
            name="stock"
            type="number"
            placeholder="Available Stock"
            handleChange={handleChange}
          />

          <FormInput
            label="Storage Location"
            name="location"
            placeholder="Enter Location"
            handleChange={handleChange}
          />

          <FormInput
            label="Size"
            name="size"
            placeholder="Enter Size"
            handleChange={handleChange}
          />

          <FormInput
            label="Weight (kg)"
            name="weight"
            placeholder="Enter Weight"
            handleChange={handleChange}
          />

          <FormInput
            label="Length (cm)"
            name="length"
            placeholder="Enter Length"
            handleChange={handleChange}
          />
          <FormInput
            label="Breadth (cm)"
            name="breadth"
            placeholder="Enter Breadth"
            handleChange={handleChange}
          />
          <FormInput
            label="Height (cm)"
            name="height"
            placeholder="Enter Height"
            handleChange={handleChange}
          />

          <FormInput
            label="Country of Origin"
            name="countryOfOrigin"
            placeholder="Enter Country of Origin"
            handleChange={handleChange}
          />

          <FormInput
            label="Category"
            name="category"
            placeholder="Select Category"
            isSelect={true}
            options={[
              "Electronics",
              "Fashion",
              "Home & Kitchen",
              "Sports",
              "Toys",
            ]}
            handleChange={handleChange}
          />

          <FormInput
            label="Vendor Details"
            name="vendorDetails"
            placeholder="Select Vendor"
            isSelect={true}
            options={["Vendor A", "Vendor B", "Vendor C"]}
            handleChange={handleChange}
          />

          <FormInput
            label="Min Quantity Alert"
            name="minQuantityAlert"
            type="number"
            placeholder="Enter Minimum Alert"
            handleChange={handleChange}
          />

          <FormInput
            label="Low Stock Alert"
            name="lowStockAlert"
            type="number"
            placeholder="Enter Low Stock Alert"
            handleChange={handleChange}
          />

          <FormInput
            label="Quantity"
            name="quantity"
            type="number"
            placeholder="Enter Quantity"
            handleChange={handleChange}
          />

          <div className="md:col-span-2">
            <label className="block text-md font-medium text-text-light dark:text-text-dark">
              Additional Details
            </label>
            <textarea
              name="additionalDetails"
              className="textarea rounded-2xl w-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
              placeholder="Enter additional details..."
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="md:col-span-2 flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <HiOutlinePhotograph className="text-primary dark:text-primary-light text-2xl" />
              <span className="text-md font-medium text-text-light dark:text-text-dark">
                Upload Images
              </span>
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="file-input file-input-bordered w-full rounded-2xl"
              onChange={handleFileChange}
            />
          </div>

          <button type="submit" className="btn btn-primary md:col-span-2">
            Submit
          </button>
        </form>
      </div>

      <div className="flex-3/12 max-w-4xl mx-auto h-screen ">
        <div className="flex-1 max-w-lg mx-auto h-auto bg-surface-light dark:bg-surface-dark shadow-lg p-6 rounded-xl border border-border-light dark:border-border-dark">
          <h2 className="text-xl font-semibold text-primary dark:text-primary-light text-center">
            🖼️ Product Preview
          </h2>

          <div className="flex flex-col items-center mt-4">
            {/* Image Preview */}
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Product Preview"
                className="w-60 h-60 object-cover rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-60 h-60 flex items-center justify-center bg-gray-300 text-gray-600 rounded-lg">
                No Image Selected
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-lg font-semibold text-text-light dark:text-text-dark">
                {productDetails.name || "Product Name"}
              </p>
              <p className="text-md text-text-light dark:text-text-dark">
                Price:{" "}
                <span className="font-semibold">
                  {productDetails.price || "£0.00"}
                </span>
              </p>
              <p className="text-md text-text-light dark:text-text-dark">
                Category:{" "}
                <span className="font-semibold">
                  {productDetails.category || "Category"}
                </span>
              </p>
              <p className="text-md text-text-light dark:text-text-dark">
                Stock:{" "}
                <span className="font-semibold">
                  {productDetails.stock || "0"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInventoryForm;
