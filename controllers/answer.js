const Question = require("../models/question");
const Answer = require("../models/answer");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWraper = require("express-async-handler");


const addNewAnswerToQuestion = asyncErrorWraper(async (req,res,next) => {

    const {question_id} = req.params;
    const user_id = req.user.id;
    const information = req.body;

    

    //Answerı Ekle

    const answer = await Answer.create({
        ...information,
        question : question_id,
        user : user_id
    });

    return res
    .status(200)
    .json({
        success : true,
        data : answer
    })

    //Questiona Answer ID Ekle

    //Pre Hook İle Modelde Gerçekleştiricez


})

const getAllAnswersByQuestion = asyncErrorWraper(async (req,res,next) => {
    const {question_id} = req.params;

    const question = await Question.findById(question_id).populate("answers");//Populate Answerın Bütün Bilgilerinin Getirilmesini Sağlar

    const answers = question.answers;

    return res
    .status(200)
    .json({
        success : true,
        count : answers.length,
        data : answers
    })
})

const getAnswerById = asyncErrorWraper(async (req,res,next) => {
    
    const {answer_id} = req.params;

    const answer = await Answer
    .findById(answer_id)
    .populate({
        path : "user",
        select : "name profileimg"
    })
    .populate({
        path : "question",
        select : "title"
    });


    return res
    .status(200)
    .json({
        success : true,
        data : answer
    })



})

const editAnswer = asyncErrorWraper(async (req,res,next) => {
    const {content} = req.body;

    const {answer_id} = req.params;

    let answer = await Answer.findById(answer_id);

    answer.content = content;

    await answer.save();

    return res
    .status(200)
    .json({
        success : true,
        data : answer
    })

    
})


const deleteAnswer = asyncErrorWraper(async (req,res,next) => {
    const {answer_id} = req.params;

    const {question_id} = req.params;

    await Answer.findByIdAndRemove(answer_id);

    const question = await Question.findById(question_id);

    question.answers.splice(question.answers.indexOf(answer_id),1);

    question.answerCount = question.answers.length;

    await question.save();

    return res
    .status(200)
    .json({
        success : true,
        message : "Answer Deleted"
    })
})

const likeAnswer = asyncErrorWraper(async (req,res,next) => {
    const {answer_id} = req.params;
    const userId = req.user.id;

    const answer = await Answer.findById(answer_id);

    if(answer.likes.includes(userId)){
        return next(new CustomError("You Already Liked This Answer",400));
    }

    answer.likes.push(userId);

    await answer.save();

    return res
    .status(200)
    .json({
        success : true,
        data : answer
    })

})

const unLikeAnswer = asyncErrorWraper(async (req,res,next) => {
    const {answer_id} = req.params;
    const userId = req.user.id;

    const answer = await Answer.findById(answer_id);

    if(!answer.likes.includes(userId)){
        return next(new CustomError("You Cant Unlike Answer Before U Like Them",400));
    }

    answer.likes.splice(answer.likes.indexOf(userId),1)

    await answer.save();

    return res
    .status(200)
    .json({
        success : true,
        data : answer
    })
})


module.exports = {
    addNewAnswerToQuestion,
    getAllAnswersByQuestion,
    editAnswer,
    deleteAnswer,
    likeAnswer,
    unLikeAnswer,
    getAnswerById
} 