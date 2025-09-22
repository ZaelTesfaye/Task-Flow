var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import userServices from "../services/user.services.js";
import asyncWrapper from "../lib/asyncWrapper.js";
const addUser = asyncWrapper((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    yield userServices.addUser(name, email, password);
    res.status(201).json({
        status: true,
        message: "User Added successfully",
    });
}));
export default {
    addUser,
};
//# sourceMappingURL=user.controllers.js.map