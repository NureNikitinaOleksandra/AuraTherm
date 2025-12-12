import PDFDocument from "pdfkit";
import prisma from "../../config/db.js";
import type { Response } from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Отримання даних
export const getDailyReportData = async (storeId: string) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const alerts = await prisma.alert.findMany({
    where: {
      store_id: storeId,
      created_at: { gte: yesterday },
    },
    include: {
      sensor: {
        include: {
          readings: {
            orderBy: { timestamp: "desc" },
            take: 1, // Беремо останній запис показників для цього датчика
          },
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  return alerts.map((alert) => {
    const reading = alert.sensor.readings[0];
    return {
      id: alert.id,
      time: alert.created_at,
      sensorName: alert.sensor.name,
      zoneId: alert.sensor.zone_id,
      status: alert.status,
      temp: reading ? reading.temperature : "N/A",
      hum: reading ? reading.humidity : "N/A",
      dp: reading ? reading.dew_point : "N/A",
    };
  });
};

// Генерація PDF
export const generateDailyReportPdf = async (
  storeId: string,
  res: Response
) => {
  const data = await getDailyReportData(storeId);

  const doc = new PDFDocument();

  const fontPath = path.join(
    __dirname,
    "../../assets/fonts/Roboto-Regular.ttf"
  );

  doc.registerFont("Roboto", fontPath);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename*=UTF-8''${encodeURIComponent("Щоденний_Звіт.pdf")}`
  );

  doc.pipe(res);

  // Заголовок
  doc
    .font("Roboto")
    .fontSize(20)
    .text("AuraTherm - Щоденний звіт інцидентів", { align: "center" });
  doc.moveDown();

  // Дата
  const dateStr = new Date().toLocaleDateString("uk-UA");
  doc.fontSize(12).text(`Дата формування: ${dateStr}`, { align: "right" });

  doc.moveTo(50, 100).lineTo(550, 100).stroke();
  doc.moveDown();

  if (data.length === 0) {
    doc.fontSize(14).text("За останні 24 години інцидентів не виявлено!", {
      align: "center",
    });
  } else {
    data.forEach((item, index) => {
      const time = new Date(item.time).toLocaleTimeString("uk-UA");

      // Переклад статусів
      let statusUkr = "НЕВІДОМО";
      if (item.status === "NEW") statusUkr = "НОВИЙ";
      if (item.status === "ACKNOWLEDGED") statusUkr = "В РОБОТІ";
      if (item.status === "RESOLVED") statusUkr = "ВИРІШЕНО";

      doc
        .fontSize(12)
        .text(`${index + 1}. [${time}] Датчик: ${item.sensorName}`);

      doc
        .fontSize(10)
        .font("Roboto")
        .fillColor("black")
        .text(
          `   Показники: T: ${item.temp}°C | H: ${item.hum}% | DP: ${item.dp}°C`
        );

      // Використовуємо сірий колір для деталей
      doc
        .fontSize(10)
        .fillColor("gray")
        .text(`Статус: ${statusUkr} | ID: ${item.id}`);
      doc.fillColor("black"); // Скидаємо колір назад на чорний
      doc.moveDown(0.5);
    });
  }

  // Футер
  doc.moveDown(2);
  doc.fontSize(10).text("Згенеровано автоматично системою AuraTherm", 50, 700, {
    align: "center",
    width: 500,
  });

  doc.end();
};
