import type { Response } from "express";
export declare const getDailyReportData: (storeId: string) => Promise<{
    id: string;
    time: Date;
    sensorName: string;
    zoneId: string;
    status: import("@prisma/client").$Enums.AlertStatus;
    temp: string | number;
    hum: string | number | null;
    dp: string | number | null;
}[]>;
export declare const generateDailyReportPdf: (storeId: string, res: Response) => Promise<void>;
//# sourceMappingURL=report.service.d.ts.map