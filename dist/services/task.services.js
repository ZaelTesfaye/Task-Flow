var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import taskModel from '../model/task.model.js';
const addTask = (userId, description) => __awaiter(void 0, void 0, void 0, function* () {
    return yield taskModel.addTask(userId, description);
});
const removeTask = (userId, taskId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield taskModel.removeTask(userId, taskId);
});
const updateTaskStatus = (userId, taskId, status) => __awaiter(void 0, void 0, void 0, function* () {
    return yield taskModel.updateTaskStatus(userId, taskId, status);
});
const getTasks = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield taskModel.getTasks(userId);
});
const taskServices = {
    addTask,
    removeTask,
    updateTaskStatus,
    getTasks,
};
export default taskServices;
//# sourceMappingURL=task.services.js.map