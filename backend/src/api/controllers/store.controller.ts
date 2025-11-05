import type { Request, Response, NextFunction } from "express";
import * as storeService from "../services/store.service.js";
import { updateStoreSchema } from "../dtos/store.dto.js";

// --- READ (Get All) ---
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stores = await storeService.getAllStores();
    res.status(200).json(stores);
  } catch (error) {
    next(error);
  }
};

// --- READ (Get by ID) ---
export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const store = await storeService.getStoreById(req.params.id!);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    res.status(200).json(store);
  } catch (error) {
    next(error);
  }
};

// --- UPDATE ---
export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = updateStoreSchema.parse(req.body);
    const updatedStore = await storeService.updateStore(req.params.id!, data);
    res.status(200).json(updatedStore);
  } catch (error) {
    next(error);
  }
};

// --- DELETE ---
export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await storeService.deleteStore(req.params.id!);
    res.status(204).send(); // No Content
  } catch (error) {
    next(error);
  }
};
