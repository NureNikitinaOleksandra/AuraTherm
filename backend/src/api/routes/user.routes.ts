import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";
import { isSuperAdmin } from "../middlewares/superAdmin.middleware.js";

const router = Router();

// --- Роути для Супер-Адміна (з майстер-ключем) ---
router.get("/all-system", isSuperAdmin, userController.getAllForSuperAdmin);

// --- Роути для звичайних Адмінів (з JWT-токеном) ---
router.use(protect); // Спочатку перевіряємо токен
router.use(isAdmin); // Потім перевіряємо, що це Адмін

router.post("/", userController.create);
router.get("/", userController.getAll);
router.get("/:id", userController.getById);
router.put("/:id", userController.update);
router.delete("/:id", userController.remove);
router.put("/:id/reset-password", userController.resetPassword);

export default router;
