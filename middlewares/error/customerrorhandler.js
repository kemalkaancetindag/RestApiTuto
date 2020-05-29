const CustomError = require("../../helpers/error/CustomError");

const customErrorHandler = (err,req,res,next) => {

    let customError = err;
    

    if(customError.name === "SyntaxError"){
        customError = new CustomError("Un Expected Syntax",400);
    }
    if(customError.name === "ValidationError"){
        customError = new CustomError(customError.message,400);
    }
    if(customError.code == 11000){
        //Duplicate Key Error
        customError = new CustomError("Email Already Exist Try Different",400);
    }

    
    res
    .status(customError.status || 500)
    .json({
        success : false,
        message : customError.message 
    });
};

module.exports = {
    customErrorHandler
}
