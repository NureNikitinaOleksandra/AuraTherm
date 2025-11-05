import type { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";
import { RegisterAdminSchema, LoginSchema } from "../dtos/auth.dto.js";

// Контролер для "Супер-Адміна"
export const registerAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = RegisterAdminSchema.parse(req.body);
    const result = await authService.registerSuperAdmin(data);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// Контролер для Входу
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = LoginSchema.parse(req.body);
    const token = await authService.login(data);
    res.status(200).json(token);
  } catch (error) {
    next(error);
  }
};
