import { Request, Response } from "express";
import { ApiError, ApiSuccess } from "../utils/api-response";
import Warehouse from "../models/WarehouseModel";
import WarehouseCell from "../models/WarehouseCellModel";

export const createWarehouse = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { row, col, totalVolume, warehouseName } = req.body;

    // Create warehouse cells
    const warehouseCells = [];
    for (let row1 = 0; row1 < row; row1++) {
      for (let col1 = 0; col1 < col; col1++) {
        const cell = new WarehouseCell({
          row: row1,
          col: col1,
          totalVolume: totalVolume,
          usedVolume: 0,
          availableVolume: totalVolume,
          location: `${row1},${col1}`,
          isAvailable: true,
        });
        await cell.save();
        warehouseCells.push(cell._id);
      }
    }

    // Create warehouse document
    const warehouse = new Warehouse({
      rows: row,
      cols: col,
      cellVolume: totalVolume,
      cells: warehouseCells,
      warehouseName,
    });

    await warehouse.save();

    res
      .status(201)
      .json({ message: "Warehouse created successfully", warehouse });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(new ApiError("Failed to create warehouse", 500, error));
  }
};

export const getWarehouse = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const warehouse = await Warehouse.findOne().populate("cells");
    if (!warehouse) {
      return res.status(404).json({ message: "No warehouse found" });
    }
    res.status(200).json(new ApiSuccess(warehouse, 200));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError("Failed to fetch warehouse", 500, error));
  }
};

export const getAvailableCells = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const warehouse = await Warehouse.findOne().populate({
      path: "cells",
      match: { isAvailable: true },
    });

    if (!warehouse) {
      return res.status(404).json({ message: "No warehouse found" });
    }

    res.status(200).json(new ApiSuccess(warehouse.cells, 200));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(new ApiError("Failed to fetch available cells", 500, error));
  }
};

export const getAvailableCellbyLocation = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const warehouses = await Warehouse.find().populate({
      path: "cells",
      match: { isAvailable: true },
      select: "location",
    });

    if (!warehouses) {
      return res.status(404).json({ message: "No warehouse found" });
    }

    if (warehouses && warehouses.length > 0) {
      warehouses.forEach((warehouse) => {
        if (warehouse.cells && warehouse.cells.length > 10) {
          warehouse.cells = warehouse.cells.slice(0, 10); // Limit to 10 cells
        }
      });
      console.log("Warehouses found:", warehouses);
    } else {
      console.log("No warehouses found.");
    }

    res.status(200).json(new ApiSuccess(warehouses, 200));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(new ApiError("Failed to fetch available cells", 500, error));
  }
};

export const getWarehouseTypes = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const warehouseTypes = await Warehouse.find().select("warehouseName");
    res.status(200).json(new ApiSuccess(warehouseTypes, 200));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(new ApiError("Failed to fetch warehouse types", 500, error));
  }
};

interface StorageRequest {
  warehouseType: string;
  startingLocation: string;
  productVolume: number;
}

export const allocateStorage = async ({
  warehouseType,
  startingLocation,
  productVolume,
}: StorageRequest) => {
  try {
    const warehouse = await Warehouse.findOne({
      warehouseName: warehouseType,
    }).populate({
      path: "cells",
      match: {
        location: { $gte: startingLocation },
        isAvailable: true,
      },
    });

    if (!warehouse) {
      return "warehouse not found";
    }

    if (!warehouse.cells || warehouse.cells.length === 0) {
      return "No available cells found at specified location";
    }

    // Calculate number of cells needed
    const cellVolume = warehouse.cellVolume;
    const cellsNeeded = Math.ceil(productVolume / cellVolume);

    if (warehouse.cells.length < cellsNeeded) {
      return `Not enough available cells. Need ${cellsNeeded} cells but only ${warehouse.cells.length} available`;
    }

    // Allocate required cells
    const allocatedCells = warehouse.cells.slice(0, cellsNeeded);

    if (allocatedCells.length > 0) {
      let tempproductVolume = productVolume;
      const updatedCells = allocatedCells?.map((cell: any) => {
        if (tempproductVolume > 0) {
          const volumeToStore = Math.min(tempproductVolume, cell.totalVolume);

          cell.usedVolume = volumeToStore;
          cell.availableVolume = cell.totalVolume - volumeToStore;
          tempproductVolume -= volumeToStore;
          cell.isAvailable = false;
          return cell;
        }
      });

      return updatedCells;
    }
    return [];
  } catch (error) {
    console.log("Storage allocation failed:", error);
    return "Storage allocation failed";
  }
};

export const getWarehouseByType = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { warehouseName } = req.params;
    // console.log(warehouseName);

    let warehouse;

    if (!warehouseName) {
      warehouse = await Warehouse.findOne().populate("cells");
    }

    // warehouse = await Warehouse.findOne({
    //   warehouseName,
    // }).populate("cells");

    warehouse = await Warehouse.findOne({ warehouseName }).populate({
      path: "cells",
      populate: {
        path: "product",
        select: "productName",
      },
    });

    if (!warehouse) {
      return res
        .status(404)
        .json({ message: "No warehouse found for this type" });
    }

    res.status(200).json(new ApiSuccess(warehouse, 200));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError("Failed to fetch warehouse", 500, error));
  }
};
