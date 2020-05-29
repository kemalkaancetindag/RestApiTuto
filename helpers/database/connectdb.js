const mongoose = require("mongoose");



const connectDataBase = () => {
    mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser : true,
        useFindAndModify : false,
        useCreateIndex : true,
        useUnifiedTopology : true
    })
    .then(()=>{
        console.log("DB Connection Check : OK")
    })
    .catch(err => {
        console.error(err)
    })
}

module.exports = connectDataBase;