import React from "react";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  isDanger?: boolean;
  hideCancel?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Підтвердити",
  isDanger = false,
  hideCancel = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex justify-end space-x-3">
        {/* Показуємо кнопку "Скасувати" тільки якщо hideCancel === false */}
        {!hideCancel && (
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Скасувати
          </button>
        )}
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-4 py-2 text-white rounded-lg transition-colors ${
            isDanger
              ? "bg-red-500 hover:bg-red-600"
              : "bg-primary hover:bg-primaryDark"
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
