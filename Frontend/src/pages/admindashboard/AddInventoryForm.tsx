import { FormInput } from "../../component/adminDashboard/FormInput";
import { useEffect, useState } from "react";
import { HiOutlinePhotograph } from "react-icons/hi";
import warehouseService from "../../services/WarehouseService";
import inventoryService from "../../services/InventoryService";
import purchaseservice from "../../services/PurchaseService";
import toast from "react-hot-toast";

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

interface PurchaseOrder {
  _id: string;
  orderId: string;
  purchaseID: string;
  vendorName: string;
  status: string;
  productRef?: string | null;
  category: string;
  productName: string;
  quantity: string;
  vendorRef: string;
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
  const [location, setLocation] = useState<Cells[]>([]);
  const [loading, setLoading] = useState(false);
  const [receivedOrders, setReceivedOrders] = useState<PurchaseOrder[]>([]);
  const [selectedPurchase, setSelectedPurchase] = useState("");

  useEffect(() => {
    const fetchAvailableCells = async () => {
      const response = await warehouseService.getAvailableCellbyLocation();
      setWarehouseCells(response.data.data);
      // console.log(response.data.data);

      const warehouseTypes = await warehouseService.getWarehouseTypes();
      setWarehouseTypes(warehouseTypes.data.data);
      // console.log(warehouseTypes.data.data);

      const response2 = await purchaseservice.getAllPurchaseOrder();
      // console.log(response2.data.data);

      const receivedOrders = response2.data.data.filter(
        (order: PurchaseOrder) => order.status === "Received"
      );

      setReceivedOrders(receivedOrders);
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
        if (selectedPurchase) {
          const selectedOrder = receivedOrders.find(
            (order) => order.orderId === selectedPurchase
          );
          console.log(selectedOrder);
          const updatePurchaseOrder =
            await purchaseservice.updatePurchaseOrderComplete(
              selectedOrder?._id || ""
            );

          console.log(updatePurchaseOrder);
          if (updatePurchaseOrder.status === 200) {
            toast.success("Purchase order updated successfully");
          }
        }

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
        toast.success("Product created successfully");
        window.location.reload();
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Failed to create product");
    }
  };

  useEffect(() => {
    if (selectedPurchase) {
      const selectedOrder = receivedOrders.find(
        (order) => order.orderId === selectedPurchase
      );
      // console.log(selectedOrder);

      if (
        selectedOrder?.category &&
        selectedOrder?.productName &&
        selectedOrder?.quantity &&
        selectedOrder?.vendorName &&
        selectedOrder?.vendorRef
      ) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          category: selectedOrder?.category,
          productName: selectedOrder?.productName,
          quantity: selectedOrder?.quantity,
          vendorDetails: selectedOrder?.vendorName,
          vendorId: selectedOrder?.vendorRef,
          stock: selectedOrder?.quantity,
        }));
      }
    }
  }, [selectedPurchase, receivedOrders]);

  return (
    <div className="flex flex-col md:flex-row flex-wrap gap-4 h-auto mb-4  bg-amber-100  dark:bg-gray-800">
      <div className="flex-8/12 max-w-6xl  mx-auto bg-surface-light dark:bg-surface-dark shadow-lg p-6 rounded-xl border border-border-light dark:border-border-dark">
        <div className="grid grid-cols-1 gap-4 mt-6">
          <label className="block text-md font-medium text-text-light dark:text-text-dark">
            Select Received Order
          </label>
          <select
            className="select rounded-lg w-full border border-border-light dark:border-border-dark bg-background-light text-black dark:bg-background-dark  dark:text-white"
            value={selectedPurchase}
            onChange={(e) => setSelectedPurchase(e.target.value)}
          >
            <option value="">Choose Purchase Order</option>
            {receivedOrders.map((order) => (
              <option key={order._id} value={order.orderId}>
                {order.orderId}
              </option>
            ))}
          </select>
        </div>

        <br />

        <h2 className="text-2xl font-bold text-primary dark:text-primary-light text-center">
          {selectedPurchase
            ? "📦 Add Inventory"
            : "📦 Select From Received Order"}
        </h2>
        {selectedPurchase && (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
          >
            <FormInput
              label="Product Name"
              name="productName"
              placeholder="Enter Product Name"
              handleChange={handleChange}
              value={formData.productName ? formData.productName : ""}
              disabled={true}
            />

            <FormInput
              label="Category"
              name="category"
              placeholder="Select Category"
              value={formData.category ? formData.category : ""}
              disabled={true}
            />

            <FormInput
              label="Vendor Details"
              name="vendorDetails"
              placeholder="Select Vendor"
              value={formData.vendorDetails ? formData.vendorDetails : ""}
              disabled={true}
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
              // handleChange={handleChange}
              value={formData.quantity ? formData.quantity : ""}
              disabled={true}
            />
            <FormInput
              label="Available Stock"
              name="stock"
              type="number"
              placeholder="Available Stock"
              value={formData.quantity ? formData.quantity : ""}
              disabled={true}
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
        )}
      </div>
    </div>
  );
};

export default AddInventoryForm;
