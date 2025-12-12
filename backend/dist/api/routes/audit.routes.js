import { Router } from "express";
import * as auditController from "../controllers/audit.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";
const router = Router();
// Тільки для Адміністратора
router.use(protect);
router.use(isAdmin);
router.get("/", auditController.getAll);
export default router;
//# sourceMappingURL=audit.routes.js.map