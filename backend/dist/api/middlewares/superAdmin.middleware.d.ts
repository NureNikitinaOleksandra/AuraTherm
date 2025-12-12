import type { Request, Response, NextFunction } from "express";
/**
 * Цей middleware перевіряє наявність 'x-api-key' у заголовках.
 * Він призначений ТІЛЬКИ для "Супер-Адміна" (мене).
 */
export declare const isSuperAdmin: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=superAdmin.middleware.d.ts.map