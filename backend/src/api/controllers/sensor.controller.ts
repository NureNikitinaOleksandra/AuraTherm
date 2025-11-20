import type { Request, Response, NextFunction } from "express";
import * as sensorService from "../services/sensor.service.js";

// --- CREATE (Admin) ---
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storeId = req.user!.store_id;
    const sensor = await sensorService.createSensor(req.body, storeId);
    res.status(201).json(sensor);
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
    const sensors = await sensorService.getAllSensors(storeId);
    res.status(200).json(sensors);
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
    const sensorId = req.params.id!;
    const storeId = req.user!.store_id;
    const sensor = await sensorService.getSensorById(sensorId, storeId);
    if (!sensor) {
      return res.status(404).json({ message: "Датчик не знайдено" });
    }
    res.status(200).json(sensor);
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
    const sensorId = req.params.id!;
    const storeId = req.user!.store_id;
    const updatedSensor = await sensorService.updateSensor(
      sensorId,
      storeId,
      req.body
    );
    res.status(200).json(updatedSensor);
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
    const sensorId = req.params.id!;
    const storeId = req.user!.store_id;
    await sensorService.deleteSensor(sensorId, storeId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// --- ASSIGN SENSOR (Admin) ---
export const assign = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sensorId = req.params.id!;
    const adminStoreId = req.user!.store_id;
    const { userId } = req.body;

    const assignment = await sensorService.assignSensor(
      sensorId,
      userId,
      adminStoreId
    );
    res.status(201).json(assignment);
  } catch (error) {
    next(error);
  }
};

// --- READ ASSIGNED (Worker) ---
export const getAssigned = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const workerId = req.user!.id;
    const sensors = await sensorService.getAssignedSensors(workerId);
    res.status(200).json(sensors);
  } catch (error) {
    next(error);
  }
};
