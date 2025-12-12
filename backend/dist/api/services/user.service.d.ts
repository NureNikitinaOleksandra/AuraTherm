import type { CreateUserDto, UpdateUserDto, ResetPasswordDto } from "../dtos/auth.dto.js";
export declare const createUserByAdmin: (data: CreateUserDto, adminStoreId: string, actor: {
    id: string;
    email: string;
}) => Promise<{
    email: string;
    patronymic: string | null;
    role: import("@prisma/client").$Enums.UserRole;
    id: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    store_id: string;
}>;
export declare const getAllUsersByAdmin: (adminStoreId: string) => Promise<{
    email: string;
    patronymic: string | null;
    role: import("@prisma/client").$Enums.UserRole;
    id: string;
    first_name: string;
    last_name: string;
}[]>;
export declare const getUserById: (userId: string, storeId: string) => Promise<{
    email: string;
    patronymic: string | null;
    role: import("@prisma/client").$Enums.UserRole;
    id: string;
    first_name: string;
    last_name: string;
} | null>;
export declare const updateUser: (userId: string, storeId: string, data: UpdateUserDto, actor: {
    id: string;
    email: string;
}) => Promise<{
    email: string;
    patronymic: string | null;
    role: import("@prisma/client").$Enums.UserRole;
    id: string;
    first_name: string;
    last_name: string;
} | null>;
export declare const deleteUser: (userId: string, storeId: string, actor: {
    id: string;
    email: string;
}) => Promise<{
    message: string;
}>;
export declare const resetPassword: (userId: string, storeId: string, data: ResetPasswordDto, actor: {
    id: string;
    email: string;
}) => Promise<{
    message: string;
}>;
export declare const getAllUsersSuperAdmin: () => Promise<{
    email: string;
    role: import("@prisma/client").$Enums.UserRole;
    store: {
        id: string;
        name: string;
    };
    id: string;
}[]>;
//# sourceMappingURL=user.service.d.ts.map