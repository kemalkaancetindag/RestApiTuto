const express = require("express");
const {checkAnswerExist} = require("../middlewares/database/databaseErrorHelpers");
const {getAccessToRoute,getAnswerOwnerAccess} = require("../middlewares/authorization/auth");
const {addNewAnswerToQuestion,getAllAnswersByQuestion,getAnswerById,editAnswer,deleteAnswer,likeAnswer,unLikeAnswer} = require("../controllers/answer");
const router = express.Router({mergeParams : true});


router.post("/",getAccessToRoute,addNewAnswerToQuestion);

router.get("/",getAllAnswersByQuestion);

router.get("/:answer_id",checkAnswerExist,getAnswerById);

router.put("/:answer_id/edit",[checkAnswerExist,getAccessToRoute,getAnswerOwnerAccess],editAnswer);

router.delete("/:answer_id/delete",[checkAnswerExist,getAccessToRoute,getAnswerOwnerAccess],deleteAnswer);

router.get("/:answer_id/like",[checkAnswerExist,getAccessToRoute],likeAnswer);

router.get("/:answer_id/unlike",[checkAnswerExist,getAccessToRoute],unLikeAnswer);



module.exports = router;