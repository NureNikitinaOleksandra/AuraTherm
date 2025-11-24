import type { Request, Response, NextFunction } from "express";
import * as alertService from "../services/alert.service.js";

// GET /api/alerts?status=NEW
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storeId = req.user!.store_id;
    const status = req.query.status as any;

    const alerts = await alertService.getAllAlerts(storeId, status);
    res.status(200).json(alerts);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/alerts/:id/acknowledge
export const acknowledge = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const alertId = req.params.id!;
    const storeId = req.user!.store_id;
    const actor = { id: req.user!.id, email: req.user!.email };

    const result = await alertService.acknowledgeAlert(alertId, storeId, actor);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/alerts/:id/resolve
export const resolve = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const alertId = req.params.id!;
    const storeId = req.user!.store_id;
    const actor = { id: req.user!.id, email: req.user!.email };

    const result = await alertService.resolveAlert(alertId, storeId, actor);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
