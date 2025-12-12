import * as auditService from "../services/audit.service.js";
export const getAll = async (req, res, next) => {
    try {
        const storeId = req.user.store_id;
        const logs = await auditService.getLogsByStore(storeId);
        res.status(200).json(logs);
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=audit.controller.js.map