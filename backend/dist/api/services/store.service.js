import prisma from "../../config/db.js";
// Усі функції для Супер-Адміна
export const getAllStores = async () => {
    return prisma.store.findMany({
        include: {
            _count: {
                select: { users: true },
            },
        },
    });
};
export const getStoreById = async (id) => {
    return prisma.store.findUnique({
        where: { id: id },
        include: {
            users: {
                where: { role: "ADMIN" },
                select: { id: true, email: true, first_name: true },
            },
        },
    });
};
export const updateStore = async (id, data) => {
    return prisma.store.update({
        where: { id: id },
        data: data,
    });
};
export const deleteStore = async (id) => {
    const store = await prisma.store.findUnique({ where: { id } });
    if (!store)
        throw new Error("Store not found");
    return prisma.store.delete({
        where: { id: id },
    });
};
//# sourceMappingURL=store.service.js.map