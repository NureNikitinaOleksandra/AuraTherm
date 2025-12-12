#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <LiquidCrystal_I2C.h> // Бібліотека екрану
#include <math.h> // Для логарифмів

// --- НАЛАШТУВАННЯ ---
const char* SSID = "Wokwi-GUEST";
const char* PASSWORD = "";
const char* MQTT_SERVER = "broker.hivemq.com";
const int MQTT_PORT = 1883;

// РЕАЛЬНІ ДАНІ З БД
const char* SENSOR_ID = "39dd1f85-5dce-4c7c-ae6a-20081f3c1c00";
const char* MQTT_TOPIC = "auratherm/669bfa03-620b-4e6f-883f-08b454632052/readings";

// ЛІМІТИ ЗОНИ (Для візуалізації на екрані)
const float MIN_TEMP = -22.0;
const float MAX_TEMP = -17.0;

// --- ОБЛАДНАННЯ ---
#define DHTPIN 15
#define DHTTYPE DHT22
#define PIN_RED 4
#define PIN_GREEN 2

DHT dht(DHTPIN, DHTTYPE);
// Адреса екрану 0x27, 16 стовпців, 2 рядки
LiquidCrystal_I2C lcd(0x27, 16, 2); 

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(SSID);

  WiFi.mode(WIFI_STA); // Режим клієнта
  WiFi.begin(SSID, PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void setup() {
  Serial.begin(115200);
  Serial.println("--------------------------------");
  Serial.println("SYSTEM STARTING...");
  
  // Ініціалізація обладнання
  dht.begin();
  lcd.init();
  lcd.backlight();
  pinMode(PIN_RED, OUTPUT);
  pinMode(PIN_GREEN, OUTPUT);

  // Стартова заставка
  lcd.setCursor(0, 0);
  lcd.print("AuraTherm IoT");
  lcd.setCursor(0, 1);
  lcd.print("Initializing...");
  
  setup_wifi();
  client.setServer(MQTT_SERVER, MQTT_PORT);
}

void reconnect() {
  // Цикл перепідключення до MQTT
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

// --- МАТЕМАТИЧНА ФУНКЦІЯ: РОЗРАХУНОК ТОЧКИ РОСИ ---
float calculateDewPoint(float temp, float humidity) {
  // Константи для формули Магнуса
  float a = 17.27;
  float b = 237.7;
  
  // Розрахунок "альфа"
  float alpha = ((a * temp) / (b + temp)) + log(humidity / 100.0);
  
  // Фінальна формула
  float dewPoint = (b * alpha) / (a - alpha);
  return dewPoint;
}

// Функція округлення до 1 знаку після коми
float round1(float value) {
  return (int)(value * 10 + 0.5) / 10.0;
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // 1. ЗЧИТУВАННЯ
  float t = dht.readTemperature();
  float h = dht.readHumidity();

  if (isnan(t) || isnan(h)) {
    Serial.println("Error reading sensor");
    lcd.setCursor(0, 0);
    lcd.print("Sensor Error!");
    return;
  }

  // 2. МАТЕМАТИКА: Рахуємо Точку Роси
  float dewPoint = calculateDewPoint(t, h);

  // Округляємо для красивого JSON
  t = round1(t);
  h = round1(h);
  dewPoint = round1(dewPoint);

  // 3. ВІЗУАЛІЗАЦІЯ (Локальна індикація)
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("T:"); lcd.print(t, 1); lcd.print("C H:"); lcd.print(h, 0); lcd.print("%");
  
  lcd.setCursor(0, 1);
  lcd.print("DP:"); lcd.print(dewPoint, 1); lcd.print("C");

  // 4. ПЕРЕВІРКА НА ТРИВОГУ (Червоний/Зелений)
  // Якщо температура ВИЩА за макс (-17) або НИЖЧА за мін (-22)
  if (t > MAX_TEMP || t < MIN_TEMP) {
     digitalWrite(PIN_RED, HIGH);
     digitalWrite(PIN_GREEN, LOW);
     lcd.print(" ALERT");
  } else {
     digitalWrite(PIN_RED, LOW);
     digitalWrite(PIN_GREEN, HIGH);
     lcd.print(" OK");
  }

  // 5. ФОРМУВАННЯ JSON 
  StaticJsonDocument<300> doc;
  doc["sensorId"] = SENSOR_ID;
  doc["temperature"] = t;
  doc["humidity"] = h;
  doc["dewPoint"] = dewPoint;  
  
  // Додамо Timestamp (кількість мілісекунд від старту, як простий час)
  doc["uptime"] = millis() / 1000; 

  char buffer[512];
  serializeJson(doc, buffer);

  Serial.print("Sending: ");
  Serial.println(buffer);
  client.publish(MQTT_TOPIC, buffer);

  delay(5000); // Частота повідомлень
}