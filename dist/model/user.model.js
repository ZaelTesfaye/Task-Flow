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
const createUser = (name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.user.create({
        data: {
            name,
            email,
            password,
        },
    });
});
const findByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.user.findUnique({
        where: {
            email,
        },
    });
});
const userModel = {
    createUser,
    findByEmail,
};
export default userModel;
//# sourceMappingURL=user.model.js.map