import type { Request, Response, NextFunction } from "express";
import * as zoneService from "../services/zone.service.js";
import { createZoneSchema, updateZoneSchema } from "../dtos/zone.dto.js";
import { z } from "zod";

// --- CREATE (Admin) ---
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storeId = req.user!.store_id;
    const zone = await zoneService.createZone(req.body, storeId, {
      id: req.user!.id,
      email: req.user!.email,
    });
    res.status(201).json(zone);
  } catch (error) {
    next(error);
  }
};

// --- READ ALL (Admin / Manager) ---
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storeId = req.user!.store_id;
    const zones = await zoneService.getAllZones(storeId);
    res.status(200).json(zones);
  } catch (error) {
    next(error);
  }
};

// --- READ ONE (Admin / Manager) ---
export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const zoneId = req.params.id!;
    const storeId = req.user!.store_id;
    const zone = await zoneService.getZoneById(zoneId, storeId);
    if (!zone) {
      return res.status(404).json({ message: "Зону не знайдено" });
    }
    res.status(200).json(zone);
  } catch (error) {
    next(error);
  }
};

// --- UPDATE (Admin) ---
export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const zoneId = req.params.id!;
    const user = req.user!; // Ми знаємо, що юзер є
    const data = updateZoneSchema.parse(req.body);

    // Передаємо user.email та user.id
    const updatedZone = await zoneService.updateZone(
      zoneId,
      user.store_id,
      data,
      { email: user.email, id: user.id } // <-- Новий аргумент
    );

    res.status(200).json(updatedZone);
  } catch (error) {
    next(error);
  }
};

// --- DELETE (Admin) ---
export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const zoneId = req.params.id!;
    const storeId = req.user!.store_id;
    await zoneService.deleteZone(zoneId, storeId, {
      id: req.user!.id,
      email: req.user!.email,
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
