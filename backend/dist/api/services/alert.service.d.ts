export declare const getAllAlerts: (storeId: string, status?: "NEW" | "ACKNOWLEDGED" | "RESOLVED") => Promise<({
    sensor: {
        zone: {
            name: string;
        };
        name: string;
    };
    resolvedByUser: {
        first_name: string;
        last_name: string;
    } | null;
} & {
    id: string;
    store_id: string;
    status: import("@prisma/client").$Enums.AlertStatus;
    sensor_id: string;
    created_at: Date;
    resolved_by_user_id: string | null;
})[]>;
export declare const acknowledgeAlert: (alertId: string, storeId: string, actor: {
    id: string;
    email: string;
}) => Promise<{
    id: string;
    store_id: string;
    status: import("@prisma/client").$Enums.AlertStatus;
    sensor_id: string;
    created_at: Date;
    resolved_by_user_id: string | null;
}>;
export declare const resolveAlert: (alertId: string, storeId: string, actor: {
    id: string;
    email: string;
}) => Promise<{
    id: string;
    store_id: string;
    status: import("@prisma/client").$Enums.AlertStatus;
    sensor_id: string;
    created_at: Date;
    resolved_by_user_id: string | null;
}>;
//# sourceMappingURL=alert.service.d.ts.map