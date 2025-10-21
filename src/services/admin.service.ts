import * as adminModel from '../model/admin.model.js'

export const getAllUsers = async (page:number, limit: number) => {
    return adminModel.getAllUsers(page, limit);
}