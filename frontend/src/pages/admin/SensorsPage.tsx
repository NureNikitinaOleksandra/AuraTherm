import React, { useEffect, useState } from "react";
import { useSensors } from "../../hooks/useSensors";
import { useZones } from "../../hooks/useZones"; // Потрібно для списку зон
import { useUsers } from "../../hooks/useUsers";
import type { CreateSensorData } from "../../services/sensorService";
import type { Sensor } from "../../types/sensor";
import { Input } from "../../components/common/Input";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { DataTable } from "../../components/common/DataTable";
import type { Column } from "../../components/common/DataTable";
import { Plus, Trash2, Pencil, Settings2 } from "lucide-react";

export const SensorsPage = () => {
  const {
    sensors,
    isLoading,
    error,
    fieldErrors,
    fetchSensors,
    createSensor,
    editSensor,
    removeSensor,
    assignWorker,
    setFieldErrors,
    setError,
  } = useSensors();
  const { zones, fetchZones } = useZones(); // Беремо зони для випадаючого списку

  // Використовуємо useUsers для завантаження працівників
  const { users, fetchUsers } = useUsers();
  // Відфільтровуємо ТІЛЬКИ працівників (WORKER)
  const workers = users.filter((u) => u.role === "WORKER");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({
    isOpen: false,
    id: "",
    name: "",
  });
  const [editingSensorId, setEditingSensorId] = useState<string | null>(null);

  // Стани для відповідального працівника
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>("");
  const [originalWorkerId, setOriginalWorkerId] = useState<string>(""); // Щоб знати, чи змінився працівник при редагуванні

  const initialForm: CreateSensorData = {
    name: "",
    location: "",
    pos_x: null,
    pos_y: null,
    status: "ACTIVE",
    zone_id: "",
  };
  const [formData, setFormData] = useState<CreateSensorData>(initialForm);

  // Завантажуємо і датчики, і зони при відкритті сторінки
  useEffect(() => {
    fetchSensors();
    fetchZones();
    fetchUsers();
  }, [fetchSensors, fetchZones, fetchUsers]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingSensorId) {
      // 1. Оновлюємо базові дані
      const success = await editSensor(editingSensorId, formData);

      // 2. Якщо вибрали НОВОГО працівника, робимо запит на призначення
      if (
        success &&
        selectedWorkerId &&
        selectedWorkerId !== originalWorkerId
      ) {
        await assignWorker(editingSensorId, selectedWorkerId);
      }

      if (success) {
        await fetchSensors(); // Перезавантажуємо таблицю
        setIsModalOpen(false);
        setEditingSensorId(null);
      }
    } else {
      // 1. Створюємо датчик
      const newSensor = await createSensor(formData);

      // 2. Якщо створився успішно і вибрано працівника - призначаємо
      if (newSensor) {
        if (selectedWorkerId) {
          await assignWorker(newSensor.id, selectedWorkerId);
        }
        await fetchSensors(); // Перезавантажуємо таблицю
        setIsModalOpen(false);
        setFormData(initialForm);
      }
    }
  };

  const openCreateModal = () => {
    setEditingSensorId(null);
    // Якщо є хоча б одна зона, ставимо її за замовчуванням
    setFormData({
      ...initialForm,
      zone_id: zones.length > 0 ? zones[0].id : "",
    });
    setSelectedWorkerId("");
    setOriginalWorkerId("");
    setFieldErrors({});
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (sensor: Sensor) => {
    setEditingSensorId(sensor.id);
    setFormData({
      name: sensor.name,
      location: sensor.location || "",
      pos_x: sensor.pos_x || null,
      pos_y: sensor.pos_y || null,
      status: sensor.status,
      zone_id: sensor.zone_id,
    });

    // Шукаємо поточного відповідального (якщо він є)
    const currentWorkerId =
      sensor.assignedTo && sensor.assignedTo.length > 0
        ? sensor.assignedTo[0].user.id
        : "";

    setSelectedWorkerId(currentWorkerId);
    setOriginalWorkerId(currentWorkerId);

    setFieldErrors({});
    setError(null);
    setIsModalOpen(true);
  };

  const confirmDelete = (id: string, name: string) => {
    setDeleteData({ isOpen: true, id, name });
  };

  // КОЛОНКИ ДЛЯ ТАБЛИЦІ
  const sensorColumns: Column<Sensor>[] = [
    {
      header: "Назва датчика",
      render: (s) => (
        <div>
          <div className="font-medium text-gray-800">{s.name}</div>
          <div className="text-xs text-gray-500">
            ID: {s.id.split("-")[0]}...
          </div>
        </div>
      ),
    },
    {
      header: "Розташування",
      accessor: "location",
      render: (s) => <span className="text-gray-600">{s.location || "—"}</span>,
    },
    {
      header: "Зона",
      render: (s) => (
        <span className="text-gray-700 font-medium">
          {s.zone?.name || "Без зони"}
        </span>
      ),
    },
    {
      header: "Відповідальний",
      render: (s) => {
        const worker = s.assignedTo?.[0]?.user;
        return worker ? (
          <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-sm">
            {worker.last_name} {worker.first_name}
          </span>
        ) : (
          <span className="text-gray-400 text-sm">Не призначено</span>
        );
      },
    },
    {
      header: "Статус",
      render: (s) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            s.status === "ACTIVE"
              ? "bg-green-100 text-green-700"
              : s.status === "INACTIVE"
                ? "bg-red-100 text-red-700"
                : "bg-orange-100 text-orange-700"
          }`}
        >
          {s.status}
        </span>
      ),
    },
    {
      header: "Дії",
      align: "right",
      render: (s) => (
        <>
          <button
            onClick={() => openEditModal(s)}
            className="text-blue-500 hover:text-blue-700 p-2 mr-1"
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button
            onClick={() => confirmDelete(s.id, s.name)}
            className="text-red-500 hover:text-red-700 p-2"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Settings2 className="h-6 w-6 text-primary" />
          Управління датчиками
        </h1>
        <button
          onClick={openCreateModal}
          className="bg-primary hover:bg-primaryDark text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">Створити датчик</span>
        </button>
      </div>

      {error && !isModalOpen && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <DataTable
        columns={sensorColumns}
        data={sensors}
        keyExtractor={(s) => s.id}
        isLoading={isLoading}
      />

      <ConfirmDialog
        isOpen={deleteData.isOpen}
        onClose={() => setDeleteData({ ...deleteData, isOpen: false })}
        onConfirm={() => removeSensor(deleteData.id)}
        title="Видалення датчика"
        message={`Ви дійсно хочете видалити датчик "${deleteData.name}"? Уся історія його температурних показників залишиться в базі для аудиту, але сам пристрій буде відключено.`}
        confirmText="Видалити"
        isDanger={true}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSensorId ? "Редагування датчика" : "Новий датчик"}
      >
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleFormSubmit}>
          <Input
            label="Назва датчика"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={fieldErrors.name}
            placeholder="Наприклад: Датчик-M1"
          />
          <Input
            label="Фізичне розташування"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            error={fieldErrors.location}
            placeholder="Наприклад: 3-тя полиця зліва"
          />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
              label="Позиція X на карті (%)"
              type="number"
              min="0"
              max="100"
              value={formData.pos_x ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pos_x: e.target.value ? Number(e.target.value) : null,
                })
              }
              placeholder="0 - 100"
            />
            <Input
              label="Позиція Y на карті (%)"
              type="number"
              min="0"
              max="100"
              value={formData.pos_y ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pos_y: e.target.value ? Number(e.target.value) : null,
                })
              }
              placeholder="0 - 100"
            />
          </div>

          <div className="grid grid-cols-1 mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Відповідальний працівник
            </label>
            <select
              value={selectedWorkerId}
              onChange={(e) => setSelectedWorkerId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary outline-none bg-white"
            >
              <option value="">-- Не призначено --</option>
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.last_name} {w.first_name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Зона <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.zone_id}
                onChange={(e) =>
                  setFormData({ ...formData, zone_id: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary outline-none bg-white"
              >
                <option value="" disabled>
                  Оберіть зону...
                </option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
              {fieldErrors.zone_id && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.zone_id}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Статус
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary outline-none bg-white"
              >
                <option value="ACTIVE">Активний (ACTIVE)</option>
                <option value="OFFLINE">Вимкнений (OFFLINE)</option>
                <option value="MAINTENANCE">
                  Обслуговування (MAINTENANCE)
                </option>
              </select>
            </div>
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
                : editingSensorId
                  ? "Оновити"
                  : "Створити"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
