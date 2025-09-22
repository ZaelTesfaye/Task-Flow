var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from "../lib/prisma.js";
const addTask = (userId, description) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.task.create({
        data: {
            description,
            userId: userId,
        },
    });
});
const removeTask = (userId, taskId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.task.delete({
        where: {
            userId: userId,
            id: taskId,
        },
    });
});
const updateTaskStatus = (userId, taskId, status) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.task.update({
        where: {
            id: taskId,
        },
        data: {
            status,
        },
    });
});
const getTasks = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.task.findMany({
        where: {
            userId: userId,
        },
    });
});
const taskModel = {
    addTask,
    removeTask,
    updateTaskStatus,
    getTasks,
};
export default taskModel;
//# sourceMappingURL=task.model.js.map