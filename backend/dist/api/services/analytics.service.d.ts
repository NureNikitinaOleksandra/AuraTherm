export declare const getDashboardStats: (storeId: string) => Promise<{
    totalSensors: number;
    activeAlerts: number;
    status: string;
    recentActivity: {
        action: string;
        details: string;
        timestamp: Date;
        user_email: string;
    }[];
}>;
export declare const getSensorHistory: (sensorId: string, storeId: string, days?: number) => Promise<{
    timestamp: Date;
    temperature: number;
}[]>;
//# sourceMappingURL=analytics.service.d.ts.map