const Question = require("../models/question");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWraper = require("express-async-handler");


const askNewQuestion = asyncErrorWraper(async (req,res,next) => {
    const information = req.body;

    const question = await Question.create({
        ...information,
        user : req.user.id
    });

    res.status(200)
    .json({
        success : true,
        data : question
    });

})

const getAllQuestions = asyncErrorWraper(async (req,res,next) => {
    

    return res
    .status(200)
    .json(res.queryResults)
})

const getSingleQuestion = asyncErrorWraper(async (req,res,next) => {
    

    return res
    .status(200)
    .json(res.queryResults)
})

const editQuestion = asyncErrorWraper(async (req,res,next) => {
    const {id} = req.params;

    const {title,content} = req.body;


    let question = await Question.findById(id);

    question.title = title;
    question.content = content;

    question = await question.save();

    return res
    .status(200)
    .json({
        success : true,
        data : question
    })

   

})

const deleteQuestion = asyncErrorWraper(async (req,res,next) => {
    const {id} = req.params;

    await Question.findByIdAndDelete(id)

    res.status(200)
    .json({
        success : true,
        message : "Question Is Successfully Deleted"
    })
})

const likeQuestion = asyncErrorWraper(async (req,res,next) => {
    const {id} = req.params;

    const question = await Question.findById(id);

    //Giriş Yapan Kullanıcın Like Etme Durumu

    if(question.likes.includes(req.user.id)){
        return next(new CustomError("You Already Liked This Question",400));
    }

    question.likes.push(req.user.id);

    question.likeCount = question.likes.length;

    await question.save();

    return res.status(200)
    .json({
        success : true,
        data : question
    })
})

const unLikeQuestion = asyncErrorWraper(async (req,res,next) => {
    const {id} = req.params;

    const userId = req.user.id;

    const question = await Question.findById(id);

    if(!question.likes.includes(userId)){
        return next(new CustomError("You Already Unliked That Question",400));
    }

    const index = question.likes.indexOf(userId);

    question.likes.splice(index,1);

    question.likeCount = question.likes.length;

    await question.save();



})

module.exports = {askNewQuestion,getAllQuestions,getSingleQuestion,editQuestion,deleteQuestion,likeQuestion,unLikeQuestion};