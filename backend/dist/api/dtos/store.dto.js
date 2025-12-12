import { z } from "zod";
export const updateStoreSchema = z.object({
    name: z.string().min(1),
});
//# sourceMappingURL=store.dto.js.map