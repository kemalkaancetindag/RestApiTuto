const User = require("../../models/user");
const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../../helpers/error/CustomError");
const Answer = require("../../models/answer");
const Question = require("../../models/question");


const checkUserExist = asyncErrorWrapper(async (req,res,next) => {

    const {id} = req.params;

    const user = await User.findById(id);

    if(!user){
        return next(new CustomError("There Is No Such An User",400))
    }

    next();

});

const checkQuestionExist = asyncErrorWrapper(async (req,res,next) => {
    const question_id = req.params.id || req.params.question_id;

    const question = await Question.findById(question_id);

    if(!question){
        return next(new CustomError("There Is No Such Question"));
    }

    next();
})

const checkAnswerExist = asyncErrorWrapper(async (req,res,next) => {
    const answer_id = req.params.id || req.params.answer_id;

    const answer = await Answer.findById(answer_id);

    if(!answer){
        return next(new CustomError("There Is No Such Answer About This Question"));
    }

    next();
})


module.exports = {checkUserExist,checkQuestionExist,checkAnswerExist};