import * as sensorService from "../services/sensor.service.js";
// --- CREATE (Admin) ---
export const create = async (req, res, next) => {
    try {
        const storeId = req.user.store_id;
        const sensor = await sensorService.createSensor(req.body, storeId, {
            id: req.user.id,
            email: req.user.email,
        });
        res.status(201).json(sensor);
    }
    catch (error) {
        next(error);
    }
};
// --- READ ALL (Admin / Manager) ---
export const getAll = async (req, res, next) => {
    try {
        const storeId = req.user.store_id;
        const sensors = await sensorService.getAllSensors(storeId);
        res.status(200).json(sensors);
    }
    catch (error) {
        next(error);
    }
};
// --- READ ONE (Admin / Manager) ---
export const getById = async (req, res, next) => {
    try {
        const sensorId = req.params.id;
        const storeId = req.user.store_id;
        const sensor = await sensorService.getSensorById(sensorId, storeId);
        if (!sensor) {
            return res.status(404).json({ message: "Датчик не знайдено" });
        }
        res.status(200).json(sensor);
    }
    catch (error) {
        next(error);
    }
};
// --- UPDATE (Admin) ---
export const update = async (req, res, next) => {
    try {
        const sensorId = req.params.id;
        const storeId = req.user.store_id;
        const updatedSensor = await sensorService.updateSensor(sensorId, storeId, req.body, { id: req.user.id, email: req.user.email });
        res.status(200).json(updatedSensor);
    }
    catch (error) {
        next(error);
    }
};
// --- DELETE (Admin) ---
export const remove = async (req, res, next) => {
    try {
        const sensorId = req.params.id;
        const storeId = req.user.store_id;
        await sensorService.deleteSensor(sensorId, storeId, {
            id: req.user.id,
            email: req.user.email,
        });
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
// --- ASSIGN SENSOR (Admin) ---
export const assign = async (req, res, next) => {
    try {
        const sensorId = req.params.id;
        const adminStoreId = req.user.store_id;
        const { userId } = req.body;
        const assignment = await sensorService.assignSensor(sensorId, userId, adminStoreId, { id: req.user.id, email: req.user.email });
        res.status(201).json(assignment);
    }
    catch (error) {
        next(error);
    }
};
// --- READ ASSIGNED (Worker) ---
export const getAssigned = async (req, res, next) => {
    try {
        const workerId = req.user.id;
        const sensors = await sensorService.getAssignedSensors(workerId);
        res.status(200).json(sensors);
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=sensor.controller.js.map