const mongoose = require("mongoose");
const asyncErrorWraper = require("express-async-handler");
const Question = require("./question");
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    content : {
        type : String,
        required : [true,"Please Provide A Content"],
        minlength : [10,"Please Provide A Content At Least Ten Characters"]
        
    },
    
    createdAt : {
        type : Date,
        default : Date.now
    },
    likes : [{
        type : mongoose.Schema.ObjectId,
        ref : "User"

        
    }],
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true,

    },
    question : {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : "Question"
    }

    

})

AnswerSchema.pre("save",async function(next){
    if(!this.isModified("user")){
         next();
     }

    
        const question = await Question.findById(this.question);

        
        question.answers.push(this._id);

        question.answerCount = question.answers.length;
    
        await question.save();
        next();

    
    
        return next(err);
    
   
})

module.exports = mongoose.model("Answer",AnswerSchema);