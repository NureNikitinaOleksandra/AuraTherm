import prisma from "../../config/db.js";
import bcrypt from "bcryptjs";
import type {
  CreateUserDto,
  UpdateUserDto,
  ResetPasswordDto,
} from "../dtos/auth.dto.js";

// Сервіс для Адміна, щоб створювати працівників У СВОЄМУ магазині
export const createUserByAdmin = async (
  data: CreateUserDto,
  adminStoreId: string
) => {
  const { email, password, firstName, lastName, patronymic, role } = data;

  // 2. Хешуємо пароль
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Створюємо користувача і прив'язуємо його до магазину Адміна
  const newUser = await prisma.user.create({
    data: {
      email: email,
      password_hash: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      patronymic: patronymic,
      role: role,
      store_id: adminStoreId,
    },
  });

  delete (newUser as any).password_hash;
  return newUser;
};

export const getAllUsersByAdmin = async (adminStoreId: string) => {
  const users = await prisma.user.findMany({
    where: {
      store_id: adminStoreId,
    },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      patronymic: true,
      role: true,
    },
  });
  return users;
};

export const getUserById = async (userId: string, storeId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      store_id: storeId,
    },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      patronymic: true,
      role: true,
    },
  });
  return user;
};

export const updateUser = async (
  userId: string,
  storeId: string,
  data: UpdateUserDto
) => {
  const { count } = await prisma.user.updateMany({
    where: {
      id: userId,
      store_id: storeId,
    },
    data: data,
  });

  if (count === 0) {
    throw new Error("Користувача не знайдено або у вас немає доступу");
  }

  return getUserById(userId, storeId);
};

export const deleteUser = async (userId: string, storeId: string) => {
  // Використовуємо deleteMany для того ж захисту
  const { count } = await prisma.user.deleteMany({
    where: {
      id: userId,
      store_id: storeId,
      // Додатковий захист: не даємо Адміну видалити самого себе
      NOT: {
        role: "ADMIN", // Або можна порівняти з ID з токену
      },
    },
  });

  if (count === 0) {
    throw new Error(
      "Користувача не знайдено, неможливо видалити (або це Адмін)"
    );
  }
  return { message: "Користувача видалено" };
};

export const resetPassword = async (
  userId: string,
  storeId: string,
  data: ResetPasswordDto
) => {
  const hashedPassword = await bcrypt.hash(data.newPassword, 10);

  const { count } = await prisma.user.updateMany({
    where: {
      id: userId,
      store_id: storeId,
    },
    data: {
      password_hash: hashedPassword,
    },
  });

  if (count === 0) {
    throw new Error("Користувача не знайдено або у вас немає доступу");
  }
  return { message: "Пароль успішно оновлено" };
};

export const getAllUsersSuperAdmin = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      store: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};
