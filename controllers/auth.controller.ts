import asyncWrapper from '../lib/asyncWrapper.js';
import authService from '../services/auth.service.js';
import type {Request, Response}  from 'express'
import config from '../config/config.js';

const register = asyncWrapper(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const user = await authService.register(name , email, password);

    res.status(201).json({
        message: "User registered successfully",
        status: true,
        data: user
    })
});

const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    // check if the user exists
    const data = await authService.login(email, password);
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
}

const logout = async (req: Request, res: Response) => {
    res.clearCookie('auth', {
        path: '/'
    }).send();
}

const authControllers = {
    register,
    login,
    logout,
}

export default authControllers;

