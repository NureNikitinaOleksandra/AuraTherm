import type { Request, Response, NextFunction } from "express";
/**
 * Глобальний обробник помилок.
 * Він ловить усі помилки, які виникли у контролерах або сервісах.
 */
export declare const errorHandler: (err: unknown, req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=error.middleware.d.ts.map