import type { CreateSensorDto, UpdateSensorDto } from "../dtos/sensor.dto.js";
export declare const createSensor: (data: CreateSensorDto, storeId: string, actor: {
    id: string;
    email: string;
}) => Promise<{
    id: string;
    name: string;
    store_id: string;
    location: string | null;
    status: import("@prisma/client").$Enums.SensorStatus;
    zone_id: string;
    pos_x: number | null;
    pos_y: number | null;
}>;
export declare const getAllSensors: (storeId: string) => Promise<({
    zone: {
        id: string;
        name: string;
    };
} & {
    id: string;
    name: string;
    store_id: string;
    location: string | null;
    status: import("@prisma/client").$Enums.SensorStatus;
    zone_id: string;
    pos_x: number | null;
    pos_y: number | null;
})[]>;
export declare const getSensorById: (sensorId: string, storeId: string) => Promise<({
    zone: {
        id: string;
        name: string;
        store_id: string;
        min_temp: number;
        max_temp: number;
    };
    assignedTo: {
        user: {
            id: string;
            first_name: string;
            last_name: string;
        };
    }[];
} & {
    id: string;
    name: string;
    store_id: string;
    location: string | null;
    status: import("@prisma/client").$Enums.SensorStatus;
    zone_id: string;
    pos_x: number | null;
    pos_y: number | null;
}) | null>;
export declare const updateSensor: (sensorId: string, storeId: string, data: UpdateSensorDto, actor: {
    id: string;
    email: string;
}) => Promise<({
    zone: {
        id: string;
        name: string;
        store_id: string;
        min_temp: number;
        max_temp: number;
    };
    assignedTo: {
        user: {
            id: string;
            first_name: string;
            last_name: string;
        };
    }[];
} & {
    id: string;
    name: string;
    store_id: string;
    location: string | null;
    status: import("@prisma/client").$Enums.SensorStatus;
    zone_id: string;
    pos_x: number | null;
    pos_y: number | null;
}) | null>;
export declare const deleteSensor: (sensorId: string, storeId: string, actor: {
    id: string;
    email: string;
}) => Promise<{
    message: string;
}>;
export declare const assignSensor: (sensorId: string, workerId: string, adminStoreId: string, actor: {
    id: string;
    email: string;
}) => Promise<{
    user_id: string;
    sensor_id: string;
}>;
export declare const getAssignedSensors: (workerId: string) => Promise<({
    sensor: {
        zone: {
            id: string;
            name: string;
            store_id: string;
            min_temp: number;
            max_temp: number;
        };
    } & {
        id: string;
        name: string;
        store_id: string;
        location: string | null;
        status: import("@prisma/client").$Enums.SensorStatus;
        zone_id: string;
        pos_x: number | null;
        pos_y: number | null;
    };
} & {
    user_id: string;
    sensor_id: string;
})[]>;
//# sourceMappingURL=sensor.service.d.ts.map