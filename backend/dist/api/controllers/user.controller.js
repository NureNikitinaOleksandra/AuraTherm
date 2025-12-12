import * as userService from "../services/user.service.js";
import { updateUserSchema, resetPasswordSchema } from "../dtos/auth.dto.js";
import { z } from "zod";
// --- CREATE (Admin) ---
export const create = async (req, res, next) => {
    try {
        const data = req.body;
        // @ts-ignore
        const adminStoreId = req.user.store_id;
        const newUser = await userService.createUserByAdmin(data, adminStoreId, {
            id: req.user.id,
            email: req.user.email,
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        next(error);
    }
};
// --- READ ALL (Admin) ---
export const getAll = async (req, res, next) => {
    try {
        // @ts-ignore
        const adminStoreId = req.user.store_id;
        const users = await userService.getAllUsersByAdmin(adminStoreId);
        res.status(200).json(users);
    }
    catch (error) {
        next(error);
    }
};
// --- READ (Get by ID) ---
export const getById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        // @ts-ignore
        const storeId = req.user.store_id;
        const user = await userService.getUserById(userId, storeId);
        if (!user) {
            return res.status(404).json({ message: "Користувача не знайдено" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        next(error); // Передаємо помилку в errorHandler
    }
};
// --- UPDATE (Profile) ---
export const update = async (req, res, next) => {
    try {
        const userId = req.params.id;
        // @ts-ignore
        const storeId = req.user.store_id;
        const updatedUser = await userService.updateUser(userId, storeId, req.body, { id: req.user.id, email: req.user.email });
        res.status(200).json(updatedUser);
    }
    catch (error) {
        next(error);
    }
};
// --- DELETE ---
export const remove = async (req, res, next) => {
    try {
        const userId = req.params.id;
        // @ts-ignore
        const storeId = req.user.store_id;
        await userService.deleteUser(userId, storeId, {
            id: req.user.id,
            email: req.user.email,
        });
        res.status(204).send(); // 204 = No Content
    }
    catch (error) {
        next(error);
    }
};
// --- UPDATE (Password Reset) ---
export const resetPassword = async (req, res, next) => {
    try {
        const userId = req.params.id;
        // @ts-ignore
        const storeId = req.user.store_id;
        // Валідація Zod
        const data = resetPasswordSchema.parse(req.body);
        const result = await userService.resetPassword(userId, storeId, data, {
            id: req.user.id,
            email: req.user.email,
        });
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
export const getAllForSuperAdmin = async (req, res, next) => {
    try {
        const users = await userService.getAllUsersSuperAdmin();
        res.status(200).json(users);
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=user.controller.js.map