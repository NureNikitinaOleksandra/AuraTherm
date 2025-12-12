interface ReadingData {
    temperature: number;
    humidity?: number;
    dewPoint?: number;
}
export declare const processReading: (sensorId: string, data: ReadingData | number) => Promise<void>;
export {};
//# sourceMappingURL=reading.service.d.ts.map