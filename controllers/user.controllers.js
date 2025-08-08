const userServices = require('../services/user.services')
const asyncWrapper = require('../lib/asyncWrapper');

const addUser = asyncWrapper( async (req,res,next) => {
    const {name} = req.body;    
    await userServices.addUser(name);

    res.status(201).json ({
        status : true,
        message: "User Added successfully"
    });
});

module.exports = {
    addUser
}