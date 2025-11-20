import type { Request, Response, NextFunction } from "express";
import * as auditService from "../services/audit.service.js";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storeId = req.user!.store_id;

    const logs = await auditService.getLogsByStore(storeId);

    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};
