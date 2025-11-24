import { Router } from "express";
import * as alertController from "../controllers/alert.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protect);

// Отримати список тривог
router.get("/", alertController.getAll);

// Взяти тривогу в роботу
router.patch("/:id/acknowledge", alertController.acknowledge);

// Завершити тривогу (проблема вирішена)
router.patch("/:id/resolve", alertController.resolve);

export default router;
