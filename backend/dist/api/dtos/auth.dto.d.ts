import { z } from "zod";
export declare const RegisterAdminSchema: z.ZodObject<{
    storeName: z.ZodString;
    adminEmail: z.ZodString;
    adminPassword: z.ZodString;
    adminFirstName: z.ZodString;
    adminLastName: z.ZodString;
}, z.core.$strip>;
export type RegisterAdminDto = z.infer<typeof RegisterAdminSchema>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type LoginDto = z.infer<typeof LoginSchema>;
export declare const CreateUserSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    patronymic: z.ZodOptional<z.ZodString>;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        MANAGER: "MANAGER";
        WORKER: "WORKER";
    }>;
}, z.core.$strip>;
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export declare const updateUserSchema: z.ZodObject<{
    email: z.ZodString;
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    patronymic: z.ZodOptional<z.ZodString>;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        MANAGER: "MANAGER";
        WORKER: "WORKER";
    }>;
}, z.core.$strip>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export declare const resetPasswordSchema: z.ZodObject<{
    newPassword: z.ZodString;
}, z.core.$strip>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
//# sourceMappingURL=auth.dto.d.ts.map