import express from "express";
import { errorHandler } from "./api/middlewares/error.middleware.js";
import authRoutes from "./api/routes/auth.routes.js";
import userRoutes from "./api/routes/user.routes.js";
import storesRoutes from "./api/routes/store.routes.js";

const app = express();

app.use(express.json());

// Логер запитів
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- Маршрути (Routes) ---
// 'storesRoutes' - для супер-адміна
app.use("/api/stores", storesRoutes);

// 'authRoutes' - для логіну та реєстрації
app.use("/api/auth", authRoutes);

// 'userRoutes' - для керування користувачами (будуть захищені)
app.use("/api/users", userRoutes);

app.use(errorHandler);

export default app;
