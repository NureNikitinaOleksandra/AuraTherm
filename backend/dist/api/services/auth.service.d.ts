import type { RegisterAdminDto, LoginDto } from "../dtos/auth.dto.js";
export declare const registerSuperAdmin: (data: RegisterAdminDto) => Promise<{
    store: {
        id: string;
        name: string;
        map_url: string | null;
    };
    admin: {
        email: string;
        patronymic: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        password_hash: string;
        first_name: string;
        last_name: string;
        store_id: string;
    };
}>;
export declare const login: (data: LoginDto) => Promise<{
    token: string;
}>;
//# sourceMappingURL=auth.service.d.ts.map