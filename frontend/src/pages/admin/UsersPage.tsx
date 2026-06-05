import React, { useEffect, useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import type { CreateUserData } from "../../services/userService";
import type { User } from "../../types/auth";
import { Input } from "../../components/common/Input";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { Plus, Trash2, Pencil } from "lucide-react";
import { DataTable } from "../../components/common/DataTable";
import type { Column } from "../../components/common/DataTable";

export const UsersPage = () => {
  const {
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
  } = useUsers();

  const userColumns: Column<User>[] = [
    {
      header: "ПІБ",
      render: (u) => (
        <span className="font-medium text-gray-800">
          {u.last_name} {u.first_name} {u.patronymic || ""}
        </span>
      ),
    },
    {
      header: "Email",
      accessor: "email",
      render: (u) => <span className="text-gray-600">{u.email}</span>,
    },
    {
      header: "Роль",
      render: (u) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            u.role === "ADMIN"
              ? "bg-purple-100 text-purple-700"
              : u.role === "MANAGER"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
          }`}
        >
          {u.role}
        </span>
      ),
    },
    {
      header: "Дії",
      align: "right",
      render: (u) => (
        <>
          <button
            onClick={() => openEditModal(u)}
            className="text-blue-500 hover:text-blue-700 p-2 mr-1"
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button
            onClick={() =>
              confirmDelete(u.id, u.role, `${u.first_name} ${u.last_name}`)
            }
            className="text-red-500 hover:text-red-700 p-2"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </>
      ),
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteData, setDeleteData] = useState<{
    isOpen: boolean;
    id: string;
    name: string;
  }>({ isOpen: false, id: "", name: "" });
  const [alertData, setAlertData] = useState({ isOpen: false, message: "" });

  // ID користувача, якого ми редагуємо. Якщо null — значить створюємо нового
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const initialForm: CreateUserData = {
    firstName: "",
    lastName: "",
    patronymic: "",
    email: "",
    password: "",
    role: "WORKER",
  };
  const [formData, setFormData] = useState<CreateUserData>(initialForm);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Універсальний обробник форми (і для створення, і для редагування)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let success;

    if (editingUserId) {
      // Якщо редагуємо, відкидаємо поле password, бо бекенд його не чекає
      const { password, ...updateData } = formData;
      success = await editUser(editingUserId, updateData);
    } else {
      success = await createUser(formData);
    }

    if (success) {
      setIsModalOpen(false);
      setFormData(initialForm);
      setEditingUserId(null);
    }
  };

  // Відкриття модалки для НОВОГО користувача
  const openCreateModal = () => {
    setEditingUserId(null);
    setFormData(initialForm);
    setFieldErrors({});
    setError(null);
    setIsModalOpen(true);
  };

  // Відкриття модалки для РЕДАГУВАННЯ
  const openEditModal = (user: User) => {
    setEditingUserId(user.id);
    setFormData({
      firstName: user.first_name, // Конвертуємо snake_case з БД у camelCase для нашої форми
      lastName: user.last_name,
      patronymic: user.patronymic || "",
      email: user.email,
      role: user.role,
      password: "", // При редагуванні пароль не показуємо
    });
    setFieldErrors({});
    setError(null);
    setIsModalOpen(true);
  };

  const confirmDelete = (id: string, role: string, fullName: string) => {
    if (role === "ADMIN") {
      setAlertData({
        isOpen: true,
        message:
          "Неможливо видалити адміністратора! Ця дія заборонена системою.",
      });
      return;
    }
    setDeleteData({ isOpen: true, id, name: fullName });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Управління персоналом
        </h1>
        <button
          onClick={openCreateModal}
          className="bg-primary hover:bg-primaryDark text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Додати працівника</span>
        </button>
      </div>

      {error && !isModalOpen && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-10 text-gray-500">Завантаження...</div>
      ) : (
        <DataTable
          columns={userColumns}
          data={users}
          isLoading={isLoading}
          keyExtractor={(u) => u.id}
        />
      )}

      {/* Модальне вікно підтвердження */}
      <ConfirmDialog
        isOpen={deleteData.isOpen}
        onClose={() => setDeleteData({ ...deleteData, isOpen: false })}
        onConfirm={() => removeUser(deleteData.id)}
        title="Видалення користувача"
        message={`Ви дійсно хочете видалити працівника ${deleteData.name}? Цю дію неможливо скасувати.`}
        confirmText="Видалити"
        isDanger={true}
      />

      {/* Модальне вікно (одне для створення та редагування) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUserId ? "Редагування користувача" : "Новий користувач"}
      >
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Ім'я"
              required
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              error={fieldErrors.firstName}
            />
            <Input
              label="Прізвище"
              required
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              error={fieldErrors.lastName}
            />
          </div>

          <Input
            label="По-батькові"
            value={formData.patronymic}
            onChange={(e) =>
              setFormData({ ...formData, patronymic: e.target.value })
            }
            error={fieldErrors.patronymic}
            placeholder="Необов'язково"
          />
          <Input
            label="Email"
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={fieldErrors.email}
          />

          {/* Показуємо поле пароля ТІЛЬКИ при створенні */}
          {!editingUserId && (
            <Input
              label="Пароль"
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={fieldErrors.password}
              placeholder="Мін. 6 символів, літери та цифри"
            />
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Роль <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value as any })
              }
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary outline-none bg-white"
            >
              <option value="WORKER">Працівник (WORKER)</option>
              <option value="MANAGER">Менеджер (MANAGER)</option>
              <option value="ADMIN">Адміністратор (ADMIN)</option>
            </select>
            {fieldErrors.role && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.role}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primaryDark text-white px-6 py-2 rounded-lg disabled:opacity-70"
            >
              {isLoading
                ? "Збереження..."
                : editingUserId
                  ? "Оновити"
                  : "Створити"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={alertData.isOpen}
        onClose={() => setAlertData({ ...alertData, isOpen: false })}
        onConfirm={() => setAlertData({ ...alertData, isOpen: false })}
        title="Дія заборонена"
        message={alertData.message}
        confirmText="Зрозуміло"
        hideCancel={true} // Ховаємо кнопку "Скасувати", бо це просто інформаційне вікно
      />
    </div>
  );
};
