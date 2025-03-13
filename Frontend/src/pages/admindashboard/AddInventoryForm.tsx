import { FormInput } from "../../component/adminDashboard/FormInput";
import { useEffect, useState } from "react";
import { HiOutlinePhotograph } from "react-icons/hi";
import warehouseService from "../../services/WarehouseService";
import categoryService from "../../services/CategoryServices";
import vendorService from "../../services/VendorServices";
import inventoryService from "../../services/InventoryService";

interface ProductFormData {
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
  images: File[];
  minQuantityAlert: string;
  lowStockAlert: string;
  vendorDetails: string;
  quantity: string;
  productDescription: string;
  vendorId: string;
}

interface Cells {
  _id: string;
  location: string;
}

interface WarehouseCell {
  cellVolume: number;
  cells: Cells[];
  cols: number;
  rows: number;
  warehouseName: string;
  _id: string;
}

interface WarehouseType {
  _id: string;
  warehouseName: string;
}

interface Category {
  _id: string;
  categoryName: string;
}

interface Vendor {
  _id: string;
  fullName: string;
}

const AddInventoryForm: React.FC = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    productName: "",
    costPrice: "",
    sellPrice: "",
    discountPrice: "",
    stock: "",
    location: "",
    locationType: "",
    volume: "",
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
    productDescription: "",
    vendorId: "",
  });

  const [warehouseTypes, setWarehouseTypes] = useState<WarehouseType[]>([]);
  const [warehouseCells, setWarehouseCells] = useState<WarehouseCell[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [location, setLocation] = useState<Cells[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAvailableCells = async () => {
      const response = await warehouseService.getAvailableCellbyLocation();
      setWarehouseCells(response.data.data);
      // console.log(response.data.data);

      const warehouseTypes = await warehouseService.getWarehouseTypes();
      setWarehouseTypes(warehouseTypes.data.data);
      // console.log(warehouseTypes.data.data);

      const categories = await categoryService.getAllCategories();
      setCategories(categories.data.data);
      // console.log(categories.data.data);

      const vendors = await vendorService.getAllVendor();
      const vendorData = vendors.data.data;
      const newVendorData = vendorData.map((vendor: Vendor) => ({
        _id: vendor._id,
        fullName: vendor.fullName,
      }));
      // console.log(newVendorData);

      setVendors(newVendorData);
    };
    fetchAvailableCells();
  }, [loading]);

  useEffect(() => {
    const length = parseFloat(formData.length) || 1;
    const breadth = parseFloat(formData.breadth) || 1;
    const height = parseFloat(formData.height) || 1;
    const calculatedVolume = length * breadth * height;

    setFormData((prevFormData) => ({
      ...prevFormData,
      volume: calculatedVolume.toString(),
    }));
  }, [formData.length, formData.breadth, formData.height]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const updatedData: Partial<ProductFormData> = {
      [e.target.name]: e.target.value,
    };

    if (e.target.name === "locationType") {
      const filteredCells = warehouseCells.find(
        (cell) => cell.warehouseName === e.target.value
      );
      setLocation(filteredCells ? filteredCells.cells : []);
    }

    if (e.target.name === "vendorDetails") {
      const filteredVendors = vendors.find(
        (vendor) => vendor.fullName === e.target.value
      );

      if (filteredVendors) {
        console.log(filteredVendors._id);
        updatedData.vendorId = filteredVendors._id;
      }
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      ...updatedData,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, images: Array.from(e.target.files) });
    }
  };

  const [selectedImage] = useState<string | null>(null);
  const [productDetails] = useState({
    name: "DEMO NAME",
    price: "£10.00",
    category: "Category",
    stock: "100",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images" && Array.isArray(value)) {
        value.forEach((file) => formDataToSend.append("images", file));
      } else {
        formDataToSend.append(key, value as string);
      }
    });

    try {
      setLoading(true);
      const response = await inventoryService.addNewProduct(formDataToSend);
      // console.log(response);
      if (response.status === 201) {
        setFormData({
          productName: "",
          costPrice: "",
          sellPrice: "",
          discountPrice: "",
          stock: "",
          location: "",
          locationType: "",
          volume: "",
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
          productDescription: "",
          vendorId: "",
        });
        setLoading(false);
        alert("Product created successfully");
        window.location.reload();
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert("Failed to create product");
    }
  };

  return (
    <div className="flex flex-col md:flex-row flex-wrap gap-4 h-auto mb-4  bg-amber-100  dark:bg-gray-800">
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
            options={categories.map((category) => category.categoryName)}
            handleChange={handleChange}
          />

          <FormInput
            label="Vendor Details"
            name="vendorDetails"
            placeholder="Select Vendor"
            isSelect={true}
            options={vendors.map((vendor) => vendor.fullName)}
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
            label="Volume (cm3)"
            name="volume"
            placeholder="Volume"
            type="number"
            // handleChange={handleChange}
            value={formData.volume}
            disabled={true}
          />

          <FormInput
            label="Storage Type"
            name="locationType"
            placeholder="select Location type"
            isSelect={true}
            options={warehouseTypes.map(
              (warehouseType) => warehouseType.warehouseName
            )}
            handleChange={handleChange}
          />

          <FormInput
            label="Storage Location"
            name="location"
            placeholder="Enter Location"
            isSelect={true}
            options={location.map((location) => location.location)}
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
          <FormInput
            label="Available Stock"
            name="stock"
            type="number"
            placeholder="Available Stock"
            handleChange={handleChange}
          />

          <div className="md:col-span-2">
            <label className="block text-md font-medium text-text-light dark:text-text-dark">
              Product Description
            </label>
            <textarea
              name="productDescription"
              className="textarea rounded-2xl w-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
              placeholder="Enter Product Description..."
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
