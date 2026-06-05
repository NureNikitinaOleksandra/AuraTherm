import type { ReactNode } from "react";

// Описуємо, як має виглядати конфігурація колонки
export interface Column<T> {
  header: string; // Назва колонки
  accessor?: keyof T; // Ключ об'єкта (напр. "email")
  render?: (item: T) => ReactNode; // Кастомний рендер (для кнопок або бейджів)
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string; // Як дістати унікальний ID для key={}
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  selectedRowId?: string | null;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading,
  onRowClick,
  selectedRowId,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="text-center py-10 text-gray-500">Завантаження...</div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Немає даних для відображення
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 text-gray-600 border-b border-gray-200">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`p-4 font-medium text-${col.align || "left"}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const id = keyExtractor(item);
            const isSelected = selectedRowId === id;

            return (
              <tr
                key={id}
                onClick={() => onRowClick && onRowClick(item)}
                className={`border-b border-gray-100 transition-colors ${
                  onRowClick
                    ? "cursor-pointer hover:bg-gray-50"
                    : "hover:bg-gray-50"
                } ${isSelected ? "bg-cyan-50 hover:bg-cyan-100" : ""}`}
              >
                {columns.map((col, idx) => (
                  <td key={idx} className={`p-4 text-${col.align || "left"}`}>
                    {/* Якщо є кастомний render - використовуємо його, інакше просто виводимо текст */}
                    {col.render
                      ? col.render(item)
                      : String(item[col.accessor as keyof T] || "")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
