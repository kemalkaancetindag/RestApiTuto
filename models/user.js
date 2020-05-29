const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Question = require("./question");
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    name : {
        type : String,
        required : [true , "Please Provide A Name"]
    },
    email : {
        type : String,
        required : [true,"Please Provide A E-Mail"],
        unique : [true,"E-Mail Already Exist"],
        match : [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            "Please Provide A Valid E-mail"
        ]
    },
    role : {
        type : String,
        default : "user",
        enum : ["user","admin"]
    },
    password : {
        type : String,
        minlength : [6,"Please Provide A Password With Minlength 6"],
        required : [true,"Please Provide A Password"],
        select : false
    },
    createdAt : {
        type : Date,
        default : Date.now,       
    },
    title : {
        type : String,        
    },
    about : {
        type : String
    },
    place : {
        type : String
    },
    website : {
        type : String
    },
    profileimg :{
        type : String,
        default: "default.jpg"
    },
    blocked:{
        type : Boolean,
        default : false
    },
    resetPasswordToken : {
        type : String
    },
    resetPasswordExpire : {
        type : Date
    }


});

//User Schema Method

UserSchema.methods.generateJwtFromUser = function(){

    const {JWT_SECRET_KEY,JWT_EXPIRE} = process.env;



    const payload = {
        id : this._id,
        name : this.name
    };

    const token = jwt.sign(payload,JWT_SECRET_KEY,{
        expiresIn : JWT_EXPIRE
    });

    return token;

};

UserSchema.methods.getResetPasswordTokenFromUser = function(){
    const randomHexByte = crypto.randomBytes(15).toString("hex");

    const {RESET_PASSWORD_EXPIRE} = process.env;

    const resetPasswordToken = crypto.createHash("SHA256").update(randomHexByte).digest("hex");

    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);

    return resetPasswordToken;


}


//Kullanıcı Kaydeedilmeden Önce Yapılan İşlemler .pre() şeklinde
UserSchema.pre("save",function(next){
    //Tekrar Tekrar Çalıştırmak İstemediğimiz İçin password alanımızın değişip değişmediğini sorguluyoruz
    if(!this.isModified("password")){
       next();
    }
     //bcryptjs kütüphanesi ile passwordümüzü hashledik
     bcrypt.genSalt(10, (err, salt) => {
        if(err){
            next(err);
        } 
        bcrypt.hash(this.password, salt, (err, hash) => {
            if(err){
                next(err);
            }
            this.password = hash;
            next();
        });
    });
});

UserSchema.post("remove",async function(){
    await Question.deleteMany({
        user : this._id
    })
})

module.exports = mongoose.model("User",UserSchema);