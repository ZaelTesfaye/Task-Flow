var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import asyncWrapper from '../lib/asyncWrapper.js';
import authService from '../services/auth.service.js';
import config from '../config/config.js';
const register = asyncWrapper((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const user = yield authService.register(name, email, password);
    res.status(201).json({
        message: "User registered successfully",
        status: true,
        data: user
    });
}));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // check if the user exists
    const data = yield authService.login(email, password);
    res.cookie('auth', data.token, {
        httpOnly: true,
        secure: config.env === 'production' ? true : false,
        sameSite: 'strict',
        signed: true,
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days 
    }).status(200).json({
        message: "User logged in successfully",
        status: true,
        data: data.user,
        token: data.token
    });
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('auth', {
        path: '/'
    }).send();
});
const authControllers = {
    register,
    login,
    logout,
};
export default authControllers;
//# sourceMappingURL=auth.controller.js.map