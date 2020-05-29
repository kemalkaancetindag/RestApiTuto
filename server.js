const express = require("express");
const dotenv = require("dotenv"); 
const connectDataBase = require("./helpers/database/connectdb");
const {customErrorHandler} = require("./middlewares/error/customerrorhandler");

const path = require("path");



//Routers
const routers = require("./routers/index")


//Enivronment Variables

dotenv.config({
    path : "./config/env/config.env"
});

//MongoDB Connection 

connectDataBase();


const app = express();

//Express Body MiddleWare
app.use(express.json());

const PORT = process.env.PORT;

//Routers Middleware

app.use("/api",routers);

//Error Handler

app.use(customErrorHandler);

//Static Files

app.use(express.static(path.join(__dirname,"public")));


app.listen(PORT,() => {
    console.log(`App Started On ${PORT} : ${process.env.NODE_ENV}`);
});