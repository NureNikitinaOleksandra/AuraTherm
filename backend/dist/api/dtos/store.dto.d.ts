import { z } from "zod";
export declare const updateStoreSchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
export type UpdateStoreDto = z.infer<typeof updateStoreSchema>;
//# sourceMappingURL=store.dto.d.ts.map