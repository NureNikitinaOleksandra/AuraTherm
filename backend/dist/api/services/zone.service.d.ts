import type { CreateZoneDto, UpdateZoneDto } from "../dtos/zone.dto.js";
export declare const createZone: (data: CreateZoneDto, storeId: string, actor: {
    id: string;
    email: string;
}) => Promise<{
    id: string;
    name: string;
    store_id: string;
    min_temp: number;
    max_temp: number;
}>;
export declare const getAllZones: (storeId: string) => Promise<({
    _count: {
        sensors: number;
    };
} & {
    id: string;
    name: string;
    store_id: string;
    min_temp: number;
    max_temp: number;
})[]>;
export declare const getZoneById: (zoneId: string, storeId: string) => Promise<({
    sensors: {
        id: string;
        name: string;
        status: import("@prisma/client").$Enums.SensorStatus;
    }[];
} & {
    id: string;
    name: string;
    store_id: string;
    min_temp: number;
    max_temp: number;
}) | null>;
export declare const updateZone: (zoneId: string, storeId: string, data: UpdateZoneDto, actor: {
    email: string;
    id: string;
}) => Promise<({
    sensors: {
        id: string;
        name: string;
        status: import("@prisma/client").$Enums.SensorStatus;
    }[];
} & {
    id: string;
    name: string;
    store_id: string;
    min_temp: number;
    max_temp: number;
}) | null>;
export declare const deleteZone: (zoneId: string, storeId: string, actor: {
    id: string;
    email: string;
}) => Promise<{
    message: string;
}>;
//# sourceMappingURL=zone.service.d.ts.map