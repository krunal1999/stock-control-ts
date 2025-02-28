import React, { useState } from "react";

class Warehouse {
  rows: number;
  cols: number;
  cellVolume: number;
  grid: (Product | null)[][];

  constructor(rows: number, cols: number, cellVolume: number) {
    this.rows = rows;
    this.cols = cols;
    this.cellVolume = cellVolume;
    // Create a grid with each cell initially null.
    this.grid = Array.from({ length: rows }, () => Array(cols).fill(null));
  }

  // Finds the given number of empty cells in the grid.
  findEmptyLocations(count: number): { row: number; col: number }[] | null {
    let locations: { row: number; col: number }[] = [];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.grid[row][col] === null) {
          locations.push({ row, col });
          if (locations.length === count) {
            return locations;
          }
        }
      }
    }
    return locations.length === count ? locations : null;
  }

  // Store the product in as many cells as needed.
  storeProduct(product: Product): boolean {
    const requiredCells = Math.ceil(product.volume / this.cellVolume);
    const emptyLocations = this.findEmptyLocations(requiredCells);
    if (emptyLocations) {
      // Save all the locations in the product.
      product.locations = emptyLocations;
      emptyLocations.forEach(({ row, col }) => {
        this.grid[row][col] = product;
      });
      return true;
    }
    return false;
  }

  // Remove the product from all the cells it occupies.
  removeProduct(product: Product): boolean {
    if (product.locations && product.locations.length > 0) {
      product.locations.forEach(({ row, col }) => {
        if (this.grid[row][col] === product) {
          this.grid[row][col] = null;
        }
      });
      product.locations = [];
      return true;
    }
    return false;
  }
}

class Product {
  name: string;
  volume: number;
  // Each product now stores an array of locations.
  locations: { row: number; col: number }[];
  productId: number;

  constructor(name: string, volume: number, productId: number) {
    this.name = name;
    this.volume = volume;
    this.locations = [];
    this.productId = productId;
  }
}

function WarehouseComponent() {
  // For testing, adjust the grid dimensions as needed.
  const [warehouse] = useState(() => new Warehouse(3, 3, 1000));
  const [products, setProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState("");
  const [productVolume, setProductVolume] = useState("");
  const [storedProducts, setStoredProducts] = useState<Product[]>([]);
  const [nextProductId, setNextProductId] = useState(1);

  const handleAddProduct = () => {
    if (productName && productVolume) {
      const newProduct = new Product(
        productName,
        parseInt(productVolume, 10),
        nextProductId
      );
      setProducts([...products, newProduct]);
      setNextProductId(nextProductId + 1);
      setProductName("");
      setProductVolume("");
    }
  };

  const handleStoreProducts = () => {
    const stored: Product[] = [];
    products.forEach((product) => {
      if (warehouse.storeProduct(product)) {
        stored.push(product);
        console.log(
          `Stored ${product.name} at locations: ${JSON.stringify(
            product.locations
          )}`
        );
      } else {
        alert(`No space available for ${product.name}`);
      }
    });
    setStoredProducts([...storedProducts, ...stored]);
    setProducts([]);
  };

  const handleRemoveProduct = (productToRemove: Product) => {
    if (warehouse.removeProduct(productToRemove)) {
      setStoredProducts((prevStored) =>
        prevStored.filter(
          (storedProduct) =>
            storedProduct.productId !== productToRemove.productId
        )
      );
    } else {
      alert(`${productToRemove.name} not found in warehouse`);
    }
  };

  // Calculate overall warehouse statistics.
  const totalCells = warehouse.rows * warehouse.cols;
  const totalVolume = totalCells * warehouse.cellVolume;
  // Used volume is the sum of each product’s volume.
  const usedVolume = storedProducts.reduce((sum, p) => sum + p.volume, 0);
  const freeVolume = totalVolume - usedVolume;
  // Used cells is the sum of cells occupied by each product.
  const usedCells = storedProducts.reduce(
    (sum, p) => sum + p.locations.length,
    0
  );
  const freeCells = totalCells - usedCells;

  return (
    <div className="max-w-4xl mx-auto bg-surface-light dark:bg-surface-dark shadow-lg p-6 mb-6 rounded-xl border border-border-light dark:border-border-dark">
      {/* Warehouse Statistics */}
      <div className="mt-6 p-4 border border-border-light dark:border-border-dark rounded-lg">
        <h3 className="text-xl font-semibold text-text-light dark:text-text-dark">
          Warehouse Stats:
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Free Volume: {freeVolume}/{totalVolume}
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Used Volume: {usedVolume}/{totalVolume}
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Free Cells: {freeCells}/{totalCells}
        </p>
      </div>
      <br />
      <hr />

      {/* Header */}
      <h2 className="text-2xl font-bold text-primary dark:text-primary-light text-center mt-8">
        📦 Warehouse Management
      </h2>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <input
          type="text"
          placeholder="Product Name"
          className="input rounded-lg w-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Product Volume"
          className="input rounded-lg w-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
          value={productVolume}
          onChange={(e) =>
            setProductVolume(e.target.value === "" ? "" : e.target.value)
          }
        />
        <button className="btn btn-primary" onClick={handleAddProduct}>
          ➕ Add Product
        </button>
      </div>

      {/* Store Button */}
      <button
        className="btn btn-success w-full mt-4"
        onClick={handleStoreProducts}
        disabled={products.length === 0}
      >
        📥 Store Products
      </button>

      {/* Products to Store */}
      <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mt-6">
        📝 Products to Store:
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        {products.map((product) => (
          <div
            key={product.productId}
            className="bg-background-light dark:bg-background-dark p-4 rounded-lg shadow-md border border-border-light dark:border-border-dark"
          >
            <p className="text-lg font-semibold">{product.name}</p>
            <p className="text-gray-600 dark:text-gray-400">
              Volume: {product.volume}
            </p>
          </div>
        ))}
        {products.length === 0 && (
          <p className="text-gray-500 text-center col-span-2">
            No products to store.
          </p>
        )}
      </div>

      {/* Stored Products */}
      <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mt-6">
        📦 Stored Products:
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        {storedProducts.map((product) => (
          <div
            key={product.productId}
            className="bg-background-light dark:bg-background-dark p-4 rounded-lg shadow-md border border-border-light dark:border-border-dark flex flex-col justify-between items-start"
          >
            <div>
              <p className="text-lg font-semibold">{product.name}</p>
              <p className="text-gray-600 dark:text-gray-400">
                📍 Locations:{" "}
                {product.locations.map((loc, idx) => (
                  <span key={idx}>
                    {` [${idx + 1}: Row ${loc.row}, Col ${loc.col}]`}
                  </span>
                ))}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Volume Usage:
                {product.locations.map((loc, i) => {
                  // For each cell, if it's not the last cell, assume full usage.
                  // For the last cell, usage is the remainder.
                  const cellUsage =
                    i < product.locations.length - 1
                      ? warehouse.cellVolume
                      : product.volume -
                        warehouse.cellVolume * (product.locations.length - 1);
                  return (
                    <span key={i}>
                      {` Cell ${i + 1}: ${cellUsage}/${warehouse.cellVolume}`}
                      {i !== product.locations.length - 1 ? ", " : ""}
                    </span>
                  );
                })}
              </p>
            </div>
            <button
              className="btn btn-error btn-sm mt-2"
              onClick={() => handleRemoveProduct(product)}
            >
              ❌ Remove
            </button>
          </div>
        ))}
        {storedProducts.length === 0 && (
          <p className="text-gray-500 text-center col-span-2">
            No stored products.
          </p>
        )}
      </div>
    </div>
  );
}

export default WarehouseComponent;
