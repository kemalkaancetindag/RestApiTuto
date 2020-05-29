const CustomError = require("../../helpers/error/CustomError");
const jwt = require("jsonwebtoken");
const {isTokenIncluded,getAccessTokenFromHeader} = require("../../helpers/authorization/tokenHelpers");
const asyncErrorWraper = require("express-async-handler");
const User = require("../../models/user");
const Answer = require("../../models/answer");
const Question = require("../../models/question");

const getAccessToRoute = (req,res,next) => {
    //Token
    const {JWT_SECRET_KEY} = process.env;

    if(!isTokenIncluded(req)){
        return next(new CustomError("You Are Not Athorized",401));
    }
    const accessToken = getAccessTokenFromHeader(req);

    jwt.verify(accessToken,JWT_SECRET_KEY,(err,decoded) => {
        if(err){
            return next(new CustomError("You Are Not Authorizde",401));
        }
        req.user = {
            id : decoded.id,
            name : decoded.name
        }
        
        next();
    })
    

}


const getAdminAccess = asyncErrorWraper(async (req,res,next) => {
    const {id} = req.user;

    const user = await User.findById(id);

    if(user.role !== "admin"){
        return next(new CustomError("That User Is Not Admin You Are Not Authorized",403));
    }
    next();



})

const getQuestionOwnerAccess = asyncErrorWraper(async (req,res,next) => {
    const userId = req.user.id;
    const questionId = req.params.id;

    const question = await Question.findById(questionId);

    if(question.user != userId){
        return next(new CustomError("This Question Belongs Another User",403));
    }

    next();

})

const getAnswerOwnerAccess = asyncErrorWraper(async (req,res,next) => {
    const userId = req.user.id;
    const answerId = req.params.answer_id;

    const answer = await Answer.findById(answerId);

    if(userId != answer.user){
        return next(new CustomError("You Are Not Owner Of That Question"),403);
    }

    next();
})

module.exports = {
    getAccessToRoute,
    getAdminAccess,
    getQuestionOwnerAccess,
    getAnswerOwnerAccess
}