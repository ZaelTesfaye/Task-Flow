import * as adminModel from '../model/admin.model.js';

export const getAllUsers = (page:number, limit: number) => {
    return adminModel.getAllUsers(page, limit);
}

export const removeUser = (userId: string) => {
    return adminModel.deleteUser(userId);
}