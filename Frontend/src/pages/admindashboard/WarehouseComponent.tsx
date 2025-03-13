import React, { useEffect, useState } from "react";
import warehouseService from "../../services/WarehouseService";
interface WarehouseCell {
  _id: string;
  row: number;
  col: number;
  totalVolume: number;
  usedVolume: number;
  availableVolume: number;
  location: string;
  isAvailable: boolean;
  product?: {
    productName: string;
  };
}

interface Warehouse {
  _id: string;
  rows: number;
  cols: number;
  cells: WarehouseCell[];
  warehouseName: string;
}

interface WarehouseType {
  _id: string;
  warehouseName: string;
}

const WarehouseComponent: React.FC = () => {
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [warehouseTypes, setWarehouseTypes] = useState<WarehouseType[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");

  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const warehouseTypes = await warehouseService.getWarehouseTypes();
        setWarehouseTypes(warehouseTypes.data.data);
        // console.log(warehouseTypes.data.data);

        const warehouseByType = await warehouseService.getWarehouseByType(
          selectedWarehouse
            ? selectedWarehouse
            : warehouseTypes.data.data[0].warehouseName
        );
        console.log(warehouseByType.data.data.cells);
        setWarehouse(warehouseByType.data.data);
      } catch (error) {
        console.error("Error fetching warehouse:", error);
      }
    };

    fetchWarehouse();
  }, [selectedWarehouse]);

  const [searchLocation, setSearchLocation] = useState<string>("");
  const [searchProduct, setSearchProduct] = useState<string>("");

  const filteredCells = warehouse?.cells.filter((cell) => {
    const locationMatch = cell.location
      .toLowerCase()
      .includes(searchLocation.toLowerCase());
    const productMatch =
      cell.product?.productName
        ?.toLowerCase()
        .includes(searchProduct.toLowerCase()) || false;

    if (searchLocation && searchProduct) {
      return locationMatch && productMatch;
    } else if (searchLocation) {
      return locationMatch;
    } else if (searchProduct) {
      return productMatch;
    }
    return true;
  });
  // console.log(filteredCells);

  const handleLocationSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchLocation(e.target.value);
  };

  const handleProductSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchProduct(e.target.value);
  };

  return (
    <>
      <div className="flex justify-center items-center gap-4">
        <select
          className=" p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-4"
          onChange={(e) => setSelectedWarehouse(e.target.value)}
        >
          {warehouseTypes.map((type) => (
            <option value={type.warehouseName}>{type.warehouseName}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search by location"
          value={searchLocation}
          onChange={handleLocationSearch}
          className="w-1/2 p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-4"
        />
        <input
          type="text"
          placeholder="Search by product"
          value={searchProduct}
          onChange={handleProductSearch}
          className="w-1/2 p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-4"
        />
      </div>
      <div className="grid grid-cols-6 gap-8 max-w-8xl mx-auto dark:bg-gray-900 p-4 rounded-xl">
        {filteredCells?.map((cell) => (
          <div className="w-full max-w-md p-5 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              📍 Location: {cell.location}
            </h3>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Product: {cell.product ? cell.product.productName : "DefaultName"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Availability:</span>{" "}
              {cell.isAvailable ? (
                <span className="text-green-500 font-bold">✅ Available</span>
              ) : (
                <span className="text-red-500 font-bold"> USED</span>
              )}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Used Volume:</span>{" "}
              {cell.usedVolume} m³
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Available Volume:</span>{" "}
              {cell.availableVolume} m³
            </p>

            <div className="mt-3 bg-gray-300 dark:bg-gray-900 w-full h-5 rounded-lg overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{
                  width: `${
                    cell.usedVolume == cell.totalVolume
                      ? 100
                      : (cell.usedVolume / cell.totalVolume) * 100
                  }%`,
                }}
              ></div>
            </div>

            <p className="text-center text-sm font-medium text-gray-700 dark:text-gray-200 mt-1">
              Used:{" "}
              {cell.usedVolume == cell.totalVolume
                ? 100
                : ((cell.usedVolume / cell.totalVolume) * 100).toPrecision(2)}
              %
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default WarehouseComponent;
