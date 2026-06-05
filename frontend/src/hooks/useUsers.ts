import { useState, useCallback } from "react";
import { userService } from "../services/userService";
import type { CreateUserData, UpdateUserData } from "../services/userService";
import type { User } from "../types/auth";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Для зберігання помилок Zod (під полями)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data);
      setError(null);
    } catch (err: any) {
      setError("Не вдалося завантажити список користувачів");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUser = async (data: CreateUserData): Promise<boolean> => {
    setFieldErrors({});
    setError(null);
    try {
      await userService.create(data);
      await fetchUsers(); // Оновлюємо список
      return true; // Успіх
    } catch (err: any) {
      // Якщо бекенд повернув Zod помилки (error.flatten().fieldErrors)
      if (err.response?.data?.errors) {
        const zodErrors = err.response.data.errors;
        const formattedErrors: Record<string, string> = {};
        for (const key in zodErrors) {
          formattedErrors[key] = zodErrors[key][0]; // Беремо перше повідомлення для кожного поля
        }
        setFieldErrors(formattedErrors);
      } else {
        setError(
          err.response?.data?.message || "Помилка при створенні користувача",
        );
      }
      return false; // Провал
    }
  };

  const editUser = async (
    id: string,
    data: UpdateUserData,
  ): Promise<boolean> => {
    setFieldErrors({});
    setError(null);
    try {
      await userService.update(id, data);
      await fetchUsers(); // Оновлюємо список
      return true;
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const zodErrors = err.response.data.errors;
        const formattedErrors: Record<string, string> = {};
        for (const key in zodErrors) {
          formattedErrors[key] = zodErrors[key][0];
        }
        setFieldErrors(formattedErrors);
      } else {
        setError(
          err.response?.data?.message || "Помилка при оновленні користувача",
        );
      }
      return false;
    }
  };

  const removeUser = async (id: string) => {
    try {
      await userService.delete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Помилка при видаленні");
      return false;
    }
  };

  return {
    users,
    isLoading,
    error,
    fieldErrors,
    fetchUsers,
    createUser,
    editUser,
    removeUser,
    setFieldErrors,
    setError,
  };
};
