var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import userModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import { APIError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
const register = (name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    //check if email already exists
    const userExists = yield userModel.findByEmail(email);
    if (userExists) {
        throw new Error("User already exists");
    }
    const salt = yield bcrypt.genSalt(10);
    const hashedPassword = yield bcrypt.hash(password, salt);
    const user = yield userModel.createUser(name, email, hashedPassword);
    if (user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
        };
    }
    else {
        throw new Error("User registration failed");
    }
});
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Login attempt for email:", email, "password : ", password);
    // check if the user exists and password matches
    const user = yield userModel.findByEmail(email);
    if (!user) {
        throw new APIError("User not found", 404);
    }
    const isPasswordValid = yield bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new APIError("Invalid username / password", 401);
    }
    const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
    };
    const token = jwt.sign(userData, config.jwtSecret, {
        expiresIn: "7d",
    });
    return {
        user: userData,
        token,
    };
});
const authServices = {
    register,
    login,
};
export default authServices;
//# sourceMappingURL=auth.service.js.map