import { UserRole } from "@prisma/client";
export const checkRoles = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Помилка авторизації" });
        }
        const userRole = req.user.role;
        // Перевіряємо, чи входить роль користувача у список дозволених
        if (!allowedRoles.includes(userRole)) {
            return res
                .status(403)
                .json({ message: "Доступ заборонено (недостатньо прав)" });
        }
        next();
    };
};
// --- Створюємо зручні "ярлики" для наших роутерів ---
// Тільки Адмін
export const isAdmin = checkRoles([UserRole.ADMIN]);
// Адмін АБО Менеджер
export const isAdminOrManager = checkRoles([UserRole.ADMIN, UserRole.MANAGER]);
// Тільки Працівник (для його специфічних завдань)
export const isWorker = checkRoles([UserRole.WORKER]);
//# sourceMappingURL=role.middleware.js.map