import { Router } from "express";
import * as storeController from "../controllers/store.controller.js";
import { isSuperAdmin } from "../middlewares/superAdmin.middleware.js"; // <-- ІМПОРТ

const router = Router();

router.use(isSuperAdmin);

router.get("/", storeController.getAll);
router.get("/:id", storeController.getById);
router.put("/:id", storeController.update);
router.delete("/:id", storeController.remove);

export default router;
