var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import taskServices from '../services/task.services.js';
import asyncWrapper from '../lib/asyncWrapper.js';
const addTask = asyncWrapper((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, description } = req.body;
    ;
    yield taskServices.addTask(userId, description);
    res.status(201).json({
        status: true,
        message: "Task Added successfully"
    });
}));
const removeTask = asyncWrapper((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, taskId } = req.body;
    yield taskServices.removeTask(userId, taskId);
    res.status(200).json({
        status: true,
        message: "Task Removed successfully"
    });
}));
const updateTaskStatus = asyncWrapper((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, taskId, status } = req.body;
    yield taskServices.updateTaskStatus(userId, taskId, status);
    res.status(200).json({
        status: true,
        message: "Task updated successfully"
    });
}));
const getTasks = asyncWrapper((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const tasks = yield taskServices.getTasks(userId);
    res.status(200).json({
        status: true,
        tasks
    });
}));
const userControllers = {
    addTask,
    removeTask,
    updateTaskStatus,
    getTasks,
};
export default userControllers;
//# sourceMappingURL=task.controllers.js.map