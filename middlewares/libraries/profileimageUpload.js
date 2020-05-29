const multer = require("multer");
const path = require("path");
const CustomError = require("../../helpers/error/CustomError");

//Storage , FileFilter

//Storage

const storage = multer.diskStorage({
    destination : function(req,file,cb){

        const rootDir = path.dirname(require.main.filename);

        cb(null,path.join(rootDir,"/public/uploads"));



    },

    filename : function(req,file,cb){
        //File - Mimetype - image/png-jpg-gif

        const extension = file.mimetype.split("/")[1];

        req.savedProfileImage = "image_" + req.user.id + "." + extension; //req.user.id getAccessToRoute Da oluşuyo

        cb(null,req.savedProfileImage);
    }
});

//File Filter

const fileFilter = (req,file,cb) => {
    let allowedMimeType = ["image/jpg","image/gif","image/jpeg","image/png"];

    if(!allowedMimeType.includes(file.mimetype)){
        return cb(new CustomError("Please Provide A Valid Image File",400),false);
    }
    return cb(null,true);
};

const profileImageUpload = multer({storage,fileFilter});


module.exports = profileImageUpload;