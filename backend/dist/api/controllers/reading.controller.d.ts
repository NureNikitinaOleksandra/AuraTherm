import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
export declare const readingSchema: z.ZodObject<{
    sensorId: z.ZodString;
    temperature: z.ZodNumber;
}, z.core.$strip>;
export declare const simulate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=reading.controller.d.ts.map