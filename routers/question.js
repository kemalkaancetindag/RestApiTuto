const express = require("express");
const answer = require("./answer");
const {askNewQuestion,getAllQuestions,getSingleQuestion,editQuestion,deleteQuestion,likeQuestion,unLikeQuestion} = require("../controllers/questions");
const {getAccessToRoute,getQuestionOwnerAccess} = require("../middlewares/authorization/auth");
const {checkQuestionExist} = require("../middlewares/database/databaseErrorHelpers");
const Question = require("../models/question");
const questionQueryMiddleware = require("../middlewares/query/questionQueryMiddleware");
const answerQueryMiddleware = require("../middlewares/query/answerQueryMiddleware");
const router = express.Router();

router.post("/ask",getAccessToRoute,askNewQuestion);

router.get("/",questionQueryMiddleware(
    Question,
    {
        population : {
            path : "user",
            select : "name profileimg"
        }
    }
),getAllQuestions)

router.get("/:id/like",[getAccessToRoute,checkQuestionExist],likeQuestion);

router.get("/:id/unlike",[getAccessToRoute,checkQuestionExist],unLikeQuestion);

router.get("/:id",[checkQuestionExist,answerQueryMiddleware(Question,{
    population : [
        {
            path : "user",
            select : "name profileimg"
        },
        {
            path : "answers",
            select : "content"
        }
    ]
})],getSingleQuestion)

router.put("/:id/edit",[getAccessToRoute,checkQuestionExist,getQuestionOwnerAccess],editQuestion);

router.delete("/:id/delete",[getAccessToRoute,checkQuestionExist,getQuestionOwnerAccess],deleteQuestion);

router.use("/:question_id/answers",checkQuestionExist,answer);

module.exports = router;