const User = require("../models/user");
const {sendJwtToClient} = require("../helpers/authorization/tokenHelpers");
const asyncErrorWraper = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");
const {validateUserInput,comparePassword} = require("../helpers/input/inputhelpers");
const sendEmail = require("../helpers/libraries/sendemail");



//Register

const register = asyncErrorWraper(async (req,res,next) => {
    //Handles Post Data
   

    //Async Await Kısaca Asenkron İşlem Yapıcaz Ve Cevabın Dönmesini Await İle Bekliyecez

    //try catch yerine async error wrapper kullanıyoruz express-async-handler

    const {name,email,password,role} = req.body;
   
        const user = await User.create({
            name,
            email,
            password,
            role
        });

        

        sendJwtToClient(user,res);   
    
})

//See User 

const getUser = (req,res,next) => {
    res.json({
        succes : true,
        data : {
            id : req.user.id,
            name : req.user.name
        }
    })
}

//Login Check

const login = asyncErrorWraper(async (req,res,next) => {
    
    const {email,password} = req.body;

   if(!validateUserInput(email,password)){
       return next(new CustomError("Please Check Your Input",400));
   }

   const user = await User.findOne({email}).select("+password");

   if(!comparePassword(password,user.password)){

        return next(new CustomError("Please Check Your Credientals",400));
   }
   
    
    
   sendJwtToClient(user,res);
});

//Logout Check

const logout = asyncErrorWraper(async (req,res,next) => {
    const {NODE_ENV} = process.env;

    return res
    .status(200)
    .cookie({
        httpOnly : true,
        expires : new Date(Date.now()),
        secure : NODE_ENV === "development" ? false : true
    })
    .json({
        succes : true,
        message : "Logout Successfull"
    })
})


//Profile Image Upload

const imageUpload = asyncErrorWraper(async (req,res,next) => {
    //Image Upload Sccess

    const user = await User.findByIdAndUpdate(req.user.id,{
        "profileimg" : req.savedProfileImage
    },{
        new : true,
        runValidators : true
    })

    res
    .status(200)
    .json({
        succes : true,
        message : "Upload Success",
        data : user
    })
})


//Forgot Password

const forgotPassword = asyncErrorWraper(async (req,res,next) => {
    const resetEmail = req.body.email;

    const user = await User.findOne({email : resetEmail});

    if(!user){
        return next(new CustomError("Email Couldnt Found",400));
    }

    const resetPasswordToken = user.getResetPasswordTokenFromUser();

    await user.save();

    const resetPasswordUrl = `http://localhost:4000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

    const emailTemplate = `
        <h3>RESET YOUR PASSWORD</h3>

        <p>This <a href = '${resetPasswordUrl}' target = '_blank'>link will expire in 1 hour</a></p>
    
    `;

        try{
            await sendEmail({
                from : process.env.SMTP_USER,
                to : resetEmail,
                subject : "Reset Your Password",
                html : emailTemplate
            });
            return res
            .status(200)
            .json({
            succes : true,
            message : "Token Sent To Your Email"
        })
    }
    catch (err){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return next(new CustomError("Email Could Not Be Send",500));
    }
    




    

})

// Reset Password

const resetPassword = asyncErrorWraper(async (req,res,next) => {

    const {resetPasswordToken} = req.query;

    const {password} = req.body;

    if(!resetPasswordToken){
        return next(new CustomError("Please Provide A Valid Token",400));
    }

    let user = await User.findOne({
        resetPasswordToken : resetPasswordToken,
        resetPasswordExpire : {$gt : Date.now()}
    })

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    if(!user){
        return next(new CustomError("Could not found user",404))
    }

    await user.save();

    return res
    .status(200)
    .json({
        succes : true,
        message : "Reset Password Proccess Succesful"
    })
})

const editUser = asyncErrorWraper(async (req,res,next) => {
    
    const editDetails = req.body;

    const user = await User.findByIdAndUpdate(req.user.id,editDetails,{
        new : true,
        runValidators : true
    });

    
    await user.save();

    return res
    .status(200)
    .json({
        succes : true,
        data : user
    })


})


module.exports = {
    register,
    login,
    logout,
    imageUpload,
    forgotPassword,
    resetPassword,
    editUser,
    getUser
}