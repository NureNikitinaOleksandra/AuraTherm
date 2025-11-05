// src/api/routes/zone.routes.ts
import { Router } from "express";
import * as zoneController from "../controllers/zone.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin, isAdminOrManager } from "../middlewares/role.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { createZoneSchema, updateZoneSchema } from "../dtos/zone.dto.js";

const router = Router();

router.use(protect);

// --- Маршрути для Менеджера (Manager) та Адміна (Admin) ---
router.get("/", isAdminOrManager, zoneController.getAll);
router.get("/:id", isAdminOrManager, zoneController.getById);

// --- Маршрути ТІЛЬКИ для Адміна (Admin) ---
router.post(
  "/",
  [isAdmin, validateBody(createZoneSchema)],
  zoneController.create
);
router.put(
  "/:id",
  [isAdmin, validateBody(updateZoneSchema)],
  zoneController.update
);
router.delete("/:id", isAdmin, zoneController.remove);

export default router;
