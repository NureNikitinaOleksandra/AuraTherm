import { z } from "zod";
/**
 * Це "фабрика" middleware. Ви передаєте їй схему Zod,
 * а вона повертає middleware, який валідує 'req.body'.
 */
export const validateBody = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Помилка валідації вхідних даних",
                    errors: error.flatten().fieldErrors,
                });
            }
            next(error);
        }
    };
};
// P.S. Пізніше можна створити
// validateParams(schema) для 'req.params'
// validateQuery(schema) для 'req.query'
//# sourceMappingURL=validate.middleware.js.map