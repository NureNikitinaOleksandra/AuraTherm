import { SUPER_ADMIN_API_KEY } from "../../config/env.js";
/**
 * Цей middleware перевіряє наявність 'x-api-key' у заголовках.
 * Він призначений ТІЛЬКИ для "Супер-Адміна" (мене).
 */
export const isSuperAdmin = (req, res, next) => {
    try {
        const apiKey = req.headers["x-api-key"];
        // Перевіряємо, чи є ключ
        if (!apiKey) {
            return res
                .status(401)
                .json({ message: "Access Denied. Missing API Key." });
        }
        // Перевіряємо, чи він правильний
        if (apiKey !== SUPER_ADMIN_API_KEY) {
            return res
                .status(403)
                .json({ message: "Access Forbidden. Invalid API Key." });
        }
        // Ключ правильний, пропускаємо
        next();
    }
    catch (error) {
        res.status(500).json({ message: "Super-Admin auth error" });
    }
};
//# sourceMappingURL=superAdmin.middleware.js.map