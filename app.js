const dotenv = require("dotenv");
const express =require('express');
const mongoose =require('mongoose');
const app = express();
const cookieParser=require('cookie-parser')

dotenv.config({path:'./config.env'});

require('./db/connect')
const User= require('./models/userschema')
const Post=require('./models/postschema')






app.use(express.json());
app.use(cookieParser());
app.use(require('./routes/auth')); //link router file
app.use(express.json());
app.use(require('./routes/post'));
app.use(express.json());
app.use(require('./routes/follow'));

 

if ( process.env.NODE_ENV == "production"){

    app.use(express.static("client/build"));
    const path = require("path");
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })


}

const PORT = process.env.PORT || 5000;





app.listen(PORT,()=>{
    console.log(`server is running at port no. ${PORT}`);
})
