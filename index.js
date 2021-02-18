const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
// const bodyParser = require("body-parser");

const userRouter = require("./route/userRoute");
const homeRouter = require("./route/homeRoute");
const courseRouter = require("./route/courseRoute");

require("dotenv").config();

const app = express();

// app middlewares
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(cookieParser());

// router middlewares
app.use(userRouter);
app.use(homeRouter);
app.use(courseRouter);

const options =  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
}

mongoose.connect(
    process.env.DATABASE_URL,
    options,
    
    (err) => {
        
        if(err) {
            console.log(err)
            return
        }
        app.listen(process.env.PORT || 8002, () => {
            console.log("app is running")
        })
        
    })