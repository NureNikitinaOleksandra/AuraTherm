import { z } from "zod";
export declare const createZoneSchema: z.ZodObject<{
    name: z.ZodString;
    min_temp: z.ZodNumber;
    max_temp: z.ZodNumber;
}, z.core.$strip>;
export type CreateZoneDto = z.infer<typeof createZoneSchema>;
export declare const updateZoneSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    min_temp: z.ZodOptional<z.ZodNumber>;
    max_temp: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type UpdateZoneDto = z.infer<typeof updateZoneSchema>;
//# sourceMappingURL=zone.dto.d.ts.map