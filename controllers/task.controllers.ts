import taskServices from '../services/task.services.js';
import asyncWrapper from '../lib/asyncWrapper.js';
import type {Request, Response, NextFunction}  from 'express'

const addTask =  asyncWrapper( async (req: Request,res: Response,next: NextFunction) => {
    const {userId, description} = req.body;    ;
    await taskServices.addTask(userId,description);
    res.status(201).json ({
        status : true,
        message: "Task Added successfully"
    })
});

const removeTask = asyncWrapper( async  (req: Request, res: Response, next: NextFunction) => {
    const {userId, taskId} = req.body;    
    await taskServices.removeTask(userId, taskId);
    res.status(200).json ({
        status : true,
        message: "Task Removed successfully"
    })
});

const updateTaskStatus = asyncWrapper( async (req: Request, res: Response, next: NextFunction) => {
    const {userId, taskId, status } = req.body;    
    await taskServices.updateTaskStatus(userId, taskId, status);
    res.status(200).json ({
        status : true,
        message: "Task updated successfully"
    })
});

const getTasks = asyncWrapper( async  (req: Request, res: Response, next: NextFunction) => {
    const {userId} = req.body;    
    const tasks = await taskServices.getTasks(userId);
    res.status(200).json({
        status : true,
        tasks
    })
});

const userControllers = {
    addTask,
    removeTask,
    updateTaskStatus,
    getTasks,
}


export default userControllers;
