import { Router } from "express";
import * as sensorController from "../controllers/sensor.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
  isAdmin,
  isAdminOrManager,
  isWorker,
} from "../middlewares/role.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import {
  createSensorSchema,
  updateSensorSchema,
  assignSensorSchema,
} from "../dtos/sensor.dto.js";

const router = Router();

router.use(protect);

// --- Маршрути для Працівника (WORKER) ---
router.get("/assigned", isWorker, sensorController.getAssigned);

// --- Маршрути для Менеджера (Manager) та Адміна (Admin) ---
router.get("/", isAdminOrManager, sensorController.getAll);
router.get("/:id", isAdminOrManager, sensorController.getById);

// --- Маршрути ТІЛЬКИ для Адміна (Admin) ---
router.post(
  "/",
  [isAdmin, validateBody(createSensorSchema)],
  sensorController.create
);
router.put(
  "/:id",
  [isAdmin, validateBody(updateSensorSchema)],
  sensorController.update
);
router.delete("/:id", isAdmin, sensorController.remove);
router.post(
  "/:id/assign",
  [isAdmin, validateBody(assignSensorSchema)],
  sensorController.assign
);

export default router;
