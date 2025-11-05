import prisma from "../../config/db.js";
import type { UpdateStoreDto } from "../dtos/store.dto.js";

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

export const getStoreById = async (id: string) => {
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

export const updateStore = async (id: string, data: UpdateStoreDto) => {
  return prisma.store.update({
    where: { id: id },
    data: data,
  });
};

export const deleteStore = async (id: string) => {
  const store = await prisma.store.findUnique({ where: { id } });
  if (!store) throw new Error("Store not found");

  return prisma.store.delete({
    where: { id: id },
  });
};
