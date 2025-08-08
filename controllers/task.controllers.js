const taskServices = require('../services/task.services');
const asyncWrapper = require('../lib/asyncWrapper');

const addTask =  asyncWrapper( async (req,res,next) => {
    const {userId, description} = req.body;    ;
    await taskServices.addTask(userId,description);
    res.status(201).json ({
        status : true,
        message: "Task Added successfully"
    })
});

const removeTask = asyncWrapper( async  (req, res, next) => {
    const {userId, taskId} = req.body;    
    await taskServices.removeTask(userId, taskId);
    res.status(200).json ({
        status : true,
        message: "Task Removed successfully"
    })
});

const updateTaskStatus = asyncWrapper( async (req, res, next) => {
    const {userId, taskId, status } = req.body;    
    await taskServices.updateTaskStatus(userId, taskId, status);
    res.status(200).json ({
        status : true,
        message: "Task updated successfully"
    })
});

const getTasks = asyncWrapper( async  (req, res, next) => {
    const {userId} = req.body;    
    const tasks = await taskServices.getTasks(userId);
    res.status(200).json({
        status : true,
        tasks
    })
})

module.exports= {
    addTask,
    removeTask,
    updateTaskStatus,
    getTasks,
}

