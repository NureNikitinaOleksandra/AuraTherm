import type { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service.js";
import type { CreateUserDto } from "../dtos/auth.dto.js";
import { updateUserSchema, resetPasswordSchema } from "../dtos/auth.dto.js";

// Створення користувача Адміном
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: CreateUserDto = req.body;
    // @ts-ignore
    const adminStoreId = req.user.store_id;

    const newUser = await userService.createUserByAdmin(data, adminStoreId);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

// Отримання списку користувачів
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // @ts-ignore
    const adminStoreId = req.user.store_id;

    const users = await userService.getAllUsersByAdmin(adminStoreId);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id!;
    // @ts-ignore
    const storeId = req.user!.store_id;

    const user = await userService.getUserById(userId, storeId);

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error); // Передаємо помилку в errorHandler
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id!;
    // @ts-ignore
    const storeId = req.user!.store_id;

    // Валідація Zod
    const data = updateUserSchema.parse(req.body);

    const updatedUser = await userService.updateUser(userId, storeId, data);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id!;
    // @ts-ignore
    const storeId = req.user!.store_id;

    await userService.deleteUser(userId, storeId);
    res.status(204).send(); // 204 = No Content
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id!;
    // @ts-ignore
    const storeId = req.user!.store_id;

    // Валідація Zod
    const data = resetPasswordSchema.parse(req.body);

    const result = await userService.resetPassword(userId, storeId, data);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllForSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userService.getAllUsersSuperAdmin();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
