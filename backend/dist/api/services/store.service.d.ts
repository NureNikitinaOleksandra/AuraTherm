import type { UpdateStoreDto } from "../dtos/store.dto.js";
export declare const getAllStores: () => Promise<({
    _count: {
        users: number;
    };
} & {
    id: string;
    name: string;
    map_url: string | null;
})[]>;
export declare const getStoreById: (id: string) => Promise<({
    users: {
        email: string;
        id: string;
        first_name: string;
    }[];
} & {
    id: string;
    name: string;
    map_url: string | null;
}) | null>;
export declare const updateStore: (id: string, data: UpdateStoreDto) => Promise<{
    id: string;
    name: string;
    map_url: string | null;
}>;
export declare const deleteStore: (id: string) => Promise<{
    id: string;
    name: string;
    map_url: string | null;
}>;
//# sourceMappingURL=store.service.d.ts.map