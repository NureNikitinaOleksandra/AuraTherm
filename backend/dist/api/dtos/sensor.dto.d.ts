import { z } from "zod";
export declare const createSensorSchema: z.ZodObject<{
    name: z.ZodString;
    location: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
        MAINTENANCE: "MAINTENANCE";
    }>>;
    zone_id: z.ZodString;
}, z.core.$strip>;
export type CreateSensorDto = z.infer<typeof createSensorSchema>;
export declare const updateSensorSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
        MAINTENANCE: "MAINTENANCE";
    }>>>;
    zone_id: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UpdateSensorDto = z.infer<typeof updateSensorSchema>;
export declare const assignSensorSchema: z.ZodObject<{
    userId: z.ZodString;
}, z.core.$strip>;
export type AssignSensorDto = z.infer<typeof assignSensorSchema>;
//# sourceMappingURL=sensor.dto.d.ts.map