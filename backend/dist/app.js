import express from "express";
import { errorHandler } from "./api/middlewares/error.middleware.js";
import authRoutes from "./api/routes/auth.routes.js";
import userRoutes from "./api/routes/user.routes.js";
import storesRoutes from "./api/routes/store.routes.js";
import sensorRoutes from "./api/routes/sensor.routes.js";
import zoneRoutes from "./api/routes/zone.routes.js";
import auditRoutes from "./api/routes/audit.routes.js";
import analyticsRoutes from "./api/routes/analytics.routes.js";
import alertRoutes from "./api/routes/alert.routes.js";
const app = express();
app.use(express.json());
// Логер запитів
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
// --- Маршрути (Routes) ---
app.use("/api/stores", storesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/zones", zoneRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map