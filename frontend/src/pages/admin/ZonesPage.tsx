import React, { useEffect, useState } from "react";
import { useZones } from "../../hooks/useZones";
import type { Zone } from "../../types/zone";
import { Input } from "../../components/common/Input";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import {
  Plus,
  Trash2,
  Pencil,
  ChevronRight,
  X,
  ThermometerSun,
} from "lucide-react";
import { DataTable } from "../../components/common/DataTable";
import type { Column } from "../../components/common/DataTable";

export const ZonesPage = () => {
  const {
    zones,
    isLoading,
    error,
    fieldErrors,
    fetchZones,
    createZone,
    editZone,
    removeZone,
    fetchZoneDetails,
    setFieldErrors,
    setError,
  } = useZones();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({
    isOpen: false,
    id: "",
    name: "",
  });
  const [alertData, setAlertData] = useState({
    isOpen: false,
    title: "",
    message: "",
  }); // Для попереджень (якщо є датчики)
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);

  // Стан для панелі "Деталі зони"
  const [selectedZoneDetail, setSelectedZoneDetail] = useState<Zone | null>(
    null,
  );
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  // Використовуємо рядки (string) у формі, щоб користувачу було зручно вводити мінуси "-" і коми
  const initialForm = { name: "", min_temp: "", max_temp: "" };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  // Завантажуємо деталі, коли клікаємо на рядок
  const handleRowClick = async (zone: Zone) => {
    setIsDetailsLoading(true);
    const details = await fetchZoneDetails(zone.id);
    setSelectedZoneDetail(details);
    setIsDetailsLoading(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Конвертуємо рядки у числа перед відправкою на бекенд
    const dataToSend = {
      name: formData.name,
      min_temp: parseFloat(formData.min_temp),
      max_temp: parseFloat(formData.max_temp),
    };

    let success;
    if (editingZoneId) {
      success = await editZone(editingZoneId, dataToSend);
    } else {
      success = await createZone(dataToSend);
    }

    if (success) {
      setIsModalOpen(false);
      setFormData(initialForm);
      setEditingZoneId(null);
      // Якщо ми відредагували зону, яку зараз переглядаємо справа — оновлюємо і її
      if (editingZoneId === selectedZoneDetail?.id) {
        handleRowClick(selectedZoneDetail);
      }
    }
  };

  const openCreateModal = () => {
    setEditingZoneId(null);
    setFormData(initialForm);
    setFieldErrors({});
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (zone: Zone) => {
    setEditingZoneId(zone.id);
    setFormData({
      name: zone.name,
      min_temp: zone.min_temp.toString(),
      max_temp: zone.max_temp.toString(),
    });
    setFieldErrors({});
    setError(null);
    setIsModalOpen(true);
  };

  // Розумна перевірка перед видаленням
  const confirmDelete = (zone: Zone) => {
    const sensorsCount = zone._count?.sensors || 0;

    if (sensorsCount > 0) {
      // Показуємо алерт, що видалити не можна
      setAlertData({
        isOpen: true,
        title: "Видалення неможливе",
        message: `Неможливо видалити зону "${zone.name}", оскільки до неї прив'язано датчиків: ${sensorsCount}. Спочатку відв'яжіть або видаліть їх.`,
      });
      return;
    }

    // Якщо датчиків 0, показуємо стандартне вікно підтвердження
    setDeleteData({ isOpen: true, id: zone.id, name: zone.name });
  };

  // КОНФІГУРАЦІЯ КОЛОНОК ДЛЯ DataTable
  const zoneColumns: Column<Zone>[] = [
    {
      header: "Назва зони",
      render: (z) => (
        <span className="font-medium text-gray-800 flex items-center">
          {z.name}
        </span>
      ),
    },
    {
      header: "Ліміти (°C)",
      render: (z) => (
        <span className="text-gray-600">
          <span className="text-blue-600">{z.min_temp}</span> ...{" "}
          <span className="text-red-600">{z.max_temp}</span>
        </span>
      ),
    },
    {
      header: "Датчики",
      align: "center",
      render: (z) => (
        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">
          {z._count?.sensors || 0}
        </span>
      ),
    },
    {
      header: "Дії",
      align: "right",
      render: (z) => (
        <div className="flex justify-end items-center">
          {/* stopPropagation() потрібен, щоб клік на кнопку НЕ викликав handleRowClick() таблиці */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(z);
            }}
            className="text-blue-500 hover:text-blue-700 p-2 mr-1"
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              confirmDelete(z);
            }}
            className="text-red-500 hover:text-red-700 p-2 mr-1"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          <ChevronRight
            className={`inline h-5 w-5 text-gray-400 transition-transform ${selectedZoneDetail?.id === z.id ? "text-primary" : ""}`}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* ЛІВА ЧАСТИНА: Таблиця */}
      <div
        className={`bg-white rounded-xl shadow-md p-6 transition-all duration-300 ${selectedZoneDetail ? "w-full md:w-2/3" : "w-full"}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Управління зонами
          </h1>
          <button
            onClick={openCreateModal}
            className="bg-primary hover:bg-primaryDark text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Створити зону</span>
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
            columns={zoneColumns}
            data={zones}
            keyExtractor={(z) => z.id}
            isLoading={isLoading}
            onRowClick={handleRowClick}
            selectedRowId={selectedZoneDetail?.id}
          />
        )}
      </div>

      {/* ПРАВА ЧАСТИНА: Панель деталей (Датчики) */}
      {selectedZoneDetail && (
        <div className="w-full md:w-1/3 bg-white rounded-xl shadow-md p-6 border-t-4 border-primary animate-in slide-in-from-right-4 duration-300">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {selectedZoneDetail.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Прив'язані датчики</p>
            </div>
            <button
              onClick={() => setSelectedZoneDetail(null)}
              className="text-gray-400 hover:text-gray-800 p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {isDetailsLoading ? (
            <div className="text-center py-10 text-gray-500">
              Завантаження датчиків...
            </div>
          ) : (
            <div className="space-y-3">
              {selectedZoneDetail.sensors &&
              selectedZoneDetail.sensors.length > 0 ? (
                selectedZoneDetail.sensors.map((sensor) => (
                  <div
                    key={sensor.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-full ${sensor.status === "ACTIVE" ? "bg-green-100" : "bg-red-100"}`}
                      >
                        <ThermometerSun
                          className={`h-4 w-4 ${sensor.status === "ACTIVE" ? "text-green-600" : "text-red-600"}`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">
                          {sensor.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {sensor.id.split("-")[0]}...
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-md ${sensor.status === "ACTIVE" ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"}`}
                    >
                      {sensor.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500 text-sm">
                    У цій зоні ще немає датчиків
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Модалки підтверджень та алертів */}
      <ConfirmDialog
        isOpen={deleteData.isOpen}
        onClose={() => setDeleteData({ ...deleteData, isOpen: false })}
        onConfirm={async () => {
          const success = await removeZone(deleteData.id);
          if (success && selectedZoneDetail?.id === deleteData.id) {
            setSelectedZoneDetail(null);
          }
        }}
        title="Видалення зони"
        message={`Ви дійсно хочете видалити зону "${deleteData.name}"?`}
        confirmText="Видалити"
        isDanger={true}
      />

      <ConfirmDialog
        isOpen={alertData.isOpen}
        onClose={() => setAlertData({ ...alertData, isOpen: false })}
        onConfirm={() => setAlertData({ ...alertData, isOpen: false })}
        title={alertData.title}
        message={alertData.message}
        confirmText="Зрозуміло"
        hideCancel={true}
      />

      {/* Модальне вікно (одне для створення та редагування) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingZoneId ? "Редагування зони" : "Нова зона"}
      >
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleFormSubmit}>
          <Input
            label="Назва зони"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={fieldErrors.name}
            placeholder="Наприклад: Морозильна камера №1"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Мінімальна темп. (°C)"
              type="number"
              step="0.1"
              required
              value={formData.min_temp}
              onChange={(e) =>
                setFormData({ ...formData, min_temp: e.target.value })
              }
              error={fieldErrors.min_temp}
              placeholder="-18"
            />
            <Input
              label="Максимальна темп. (°C)"
              type="number"
              step="0.1"
              required
              value={formData.max_temp}
              onChange={(e) =>
                setFormData({ ...formData, max_temp: e.target.value })
              }
              error={fieldErrors.max_temp}
              placeholder="-15"
            />
          </div>
          {fieldErrors.max_temp && !fieldErrors.min_temp && (
            <p className="text-red-500 text-xs mb-4">{fieldErrors.max_temp}</p>
          )}

          <div className="flex justify-end space-x-3 pt-4 mt-2 border-t">
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
                : editingZoneId
                  ? "Оновити"
                  : "Створити"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
