import type { Request, Response, NextFunction } from "express";
import { type ZodSchema } from "zod";
/**
 * Це "фабрика" middleware. Ви передаєте їй схему Zod,
 * а вона повертає middleware, який валідує 'req.body'.
 */
export declare const validateBody: (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=validate.middleware.d.ts.map