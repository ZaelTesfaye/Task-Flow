import type { NextFunction, Request, Response } from "express"
import type { GetAllUsers } from "../dtos/admin.dto.js"
import * as adminService from '../services/admin.service.js'
import httpStatus from "http-status"

export const viewAllUsers = async (req: Request<{}, {}, GetAllUsers>, res: Response) => {
    const {page, limit} = req.body;
    const result = await adminService.getAllUsers(page, limit);
    if (result) {
        res.status(httpStatus.OK).json(result);
    }
}

export const addUser = () => {

}

export const removeUser = () => {

}

export const updateUserStatus = () => {

}

export const blacklistToken = () => {

}