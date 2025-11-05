import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";
import { isSuperAdmin } from "../middlewares/superAdmin.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import {
  CreateUserSchema,
  updateUserSchema,
  resetPasswordSchema,
} from "../dtos/auth.dto.js";

const router = Router();

// --- Роути для Супер-Адміна (з майстер-ключем) ---
router.get("/all-system", isSuperAdmin, userController.getAllForSuperAdmin);

// --- Роути для звичайних Адмінів (з JWT-токеном) ---
router.use(protect); // Спочатку перевіряємо токен
router.use(isAdmin); // Потім перевіряємо, що це Адмін

router.post("/", validateBody(CreateUserSchema), userController.create);
router.get("/", userController.getAll);
router.get("/:id", userController.getById);
router.put("/:id", validateBody(updateUserSchema), userController.update);
router.delete("/:id", userController.remove);
router.put(
  "/:id/reset-password",
  validateBody(resetPasswordSchema),
  userController.resetPassword
);

export default router;
