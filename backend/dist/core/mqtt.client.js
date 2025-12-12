import mqtt from "mqtt";
import * as readingService from "../api/services/reading.service.js";
// Використовуємо публічний брокер HiveMQ
const BROKER_URL = "mqtt://broker.hivemq.com";
// Тема, яку ми слухаємо.
const TOPIC_NAME = "auratherm/+/readings";
// Значок '+' означає, що тут може бути будь-який ID магазину.
export const connectMQTT = () => {
    console.log(`📡 Connecting to MQTT Broker: ${BROKER_URL}...`);
    const client = mqtt.connect(BROKER_URL);
    client.on("connect", () => {
        console.log("✅ MQTT Connected!");
        client.subscribe(TOPIC_NAME, (err) => {
            if (err) {
                console.error("❌ MQTT Subscribe Error:", err);
            }
            else {
                console.log(`👂 Listening to topic: ${TOPIC_NAME}`);
            }
        });
    });
    client.on("message", async (topic, message) => {
        try {
            // Повідомлення приходить як Buffer (байти), перетворюємо в текст
            const messageStr = message.toString();
            console.log(`📨 MQTT Message received on [${topic}]: ${messageStr}`);
            // Парсимо JSON
            const data = JSON.parse(messageStr);
            // Валідація: sensorId і temperature обов'язкові
            if (!data.sensorId || data.temperature === undefined) {
                console.warn("⚠️ Invalid MQTT payload format. Ignored.");
                return;
            }
            // Передаємо повний об'єкт у сервіс
            await readingService.processReading(data.sensorId, {
                temperature: data.temperature,
                humidity: data.humidity, // Може бути undefined, це ок
                dewPoint: data.dewPoint, // Може бути undefined, це ок
            });
            console.log("✅ Reading processed via MQTT");
        }
        catch (error) {
            console.error("❌ Error processing MQTT message:", error);
        }
    });
    client.on("error", (err) => {
        console.error("❌ MQTT Connection Error:", err);
    });
};
//# sourceMappingURL=mqtt.client.js.map