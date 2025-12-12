import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { isSuperAdmin } from "../middlewares/superAdmin.middleware.js";
const router = Router();
// Маршрут для "Супер-Адміна"
router.post("/register-super-admin", isSuperAdmin, authController.registerAdmin);
// Маршрут для входу
router.post("/login", authController.login);
export default router;
//# sourceMappingURL=auth.routes.js.map