import { Router } from "express";
import * as analyticsController from "../controllers/analytics.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdminOrManager } from "../middlewares/role.middleware.js";

const router = Router();

// Доступ мають Менеджери та Адміни
router.use(protect);
router.use(isAdminOrManager);

// Головний екран
router.get("/dashboard", analyticsController.getDashboard);

// Графік для конкретного датчика
router.get("/sensor/:id/history", analyticsController.getSensorHistory);

// Перегляд звіту (JSON) - Для малювання таблиці на сайті
router.get("/reports/daily/view", analyticsController.viewDailyReport);

// Завантаження звіту (PDF) - Для кнопки "Завантажити"
router.get("/reports/daily/download", analyticsController.downloadReport);

export default router;
