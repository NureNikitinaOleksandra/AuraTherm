import prisma from "../../config/db.js";
/**
 * Записує дію в журнал аудиту.
 * Ця функція викликається з інших сервісів.
 */
export const logAction = async (storeId, userEmail, userId, action, details) => {
    try {
        await prisma.auditLog.create({
            data: {
                store_id: storeId,
                user_email: userEmail,
                user_id: userId,
                action: action,
                details: details,
            },
        });
    }
    catch (error) {
        // ВАЖЛИВО: Помилка запису логу не повинна зупиняти основну операцію.
        // Тому ми просто виводимо її в консоль, а не кидаємо throw new Error.
        console.error("Failed to create audit log:", error);
    }
};
/**
 * Отримує історію дій для конкретного магазину (для Адміна).
 * Сортує від нових до старих.
 */
export const getLogsByStore = async (storeId) => {
    return prisma.auditLog.findMany({
        where: {
            store_id: storeId,
        },
        orderBy: {
            timestamp: "desc",
        },
        take: 100, // Обмежимо останніми 100 записами, щоб не вантажити систему
        include: {
            user: {
                select: { first_name: true, last_name: true },
            },
        },
    });
};
//# sourceMappingURL=audit.service.js.map