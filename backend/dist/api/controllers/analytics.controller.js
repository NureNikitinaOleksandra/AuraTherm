import * as analyticsService from "../services/analytics.service.js";
import * as reportService from "../services/report.service.js";
// Дашборд
export const getDashboard = async (req, res, next) => {
    try {
        const storeId = req.user.store_id;
        const stats = await analyticsService.getDashboardStats(storeId);
        res.status(200).json(stats);
    }
    catch (error) {
        next(error);
    }
};
// Історія датчика (Графік)
export const getSensorHistory = async (req, res, next) => {
    try {
        const storeId = req.user.store_id;
        const sensorId = req.params.id;
        // Можна брати 'days' з query params (?days=7), за замовчуванням 1
        const days = req.query.days ? parseInt(req.query.days) : 1;
        const history = await analyticsService.getSensorHistory(sensorId, storeId, days);
        res.status(200).json(history);
    }
    catch (error) {
        next(error);
    }
};
// Перегляд звіту (JSON)
export const viewDailyReport = async (req, res, next) => {
    try {
        const storeId = req.user.store_id;
        const data = await reportService.getDailyReportData(storeId);
        // Віддаємо JSON для відображення таблиці на фронтенді
        res.status(200).json(data);
    }
    catch (error) {
        next(error);
    }
};
// Завантаження звіту (PDF)
export const downloadReport = async (req, res, next) => {
    try {
        const storeId = req.user.store_id;
        await reportService.generateDailyReportPdf(storeId, res);
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=analytics.controller.js.map