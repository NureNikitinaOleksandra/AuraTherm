import dotenv from "dotenv";
dotenv.config(); // Завантажує змінні з .env файлу
export const PORT = process.env.PORT || 3000;
export const DATABASE_URL = process.env.DATABASE_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const SUPER_ADMIN_API_KEY = process.env.SUPER_ADMIN_API_KEY;
if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined.");
    process.exit(1);
}
if (!SUPER_ADMIN_API_KEY) {
    console.error("FATAL ERROR: SUPER_ADMIN_API_KEY is not defined.");
    process.exit(1);
}
//# sourceMappingURL=env.js.map