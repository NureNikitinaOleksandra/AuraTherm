/**
 * Записує дію в журнал аудиту.
 * Ця функція викликається з інших сервісів.
 */
export declare const logAction: (storeId: string, userEmail: string, userId: string | null, action: string, details: string) => Promise<void>;
/**
 * Отримує історію дій для конкретного магазину (для Адміна).
 * Сортує від нових до старих.
 */
export declare const getLogsByStore: (storeId: string) => Promise<({
    user: {
        first_name: string;
        last_name: string;
    } | null;
} & {
    id: string;
    store_id: string;
    action: string;
    details: string;
    timestamp: Date;
    user_email: string;
    user_id: string | null;
})[]>;
//# sourceMappingURL=audit.service.d.ts.map