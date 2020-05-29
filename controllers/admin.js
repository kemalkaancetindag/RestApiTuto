const User = require("../models/user");
const asyncErrorWraper = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");


const blockUser = asyncErrorWraper(async (req,res,next) => {
    
    const {id} = req.params;

    const user = await User.findById(id);

    user.blocked = !user.blocked;
    
    
    await user.save();

    return res
    .status(200)
    .json({
        success : true,
        data : user
    })



})


const deleteUser = asyncErrorWraper(async (req,res,next) => {
    const {id} = req.params;

    const user = await User.findById(id);

    await user.remove();

    return res
    .status(200)
    .json({
        success : true,
        message : "Delete Proccess Success"
    })
})

module.exports = {
    blockUser,
    deleteUser

}