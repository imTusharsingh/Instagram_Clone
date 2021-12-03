const express=require('express');
const route= express.Router();
const jwt =require('jsonwebtoken');
const bcrypt= require('bcryptjs');


require('../db/connect');


const User = require("../models/userschema");
const Authenticate = require("../middleware/authenticate")



route.post("/register",async(req,res)=>{
    
    const {email,name,username,password} =req.body;

    if(!email || !name || !username || !password){
        return res.status(422).json({error:"please! fill all the data"})
    }

    try{
        const userexist=await User.findOne({email});
        const usernameexist=await User.findOne({username});
// ___________________________________________________________________________________________________________
        if(userexist){
            return res.status(423).json({error:"User areday exits"})
        }
        else if(usernameexist){
            return res.status(424).json({error:"UserName alreday exits"})
        }
        const user= new User({email,name,username,password});

        const registeruser=await user.save();

        if(registeruser){
            res.status(201).json({message:"Registered Succesfully"});
        }
        else{
            res.status(500).json({error: "Failed to Register"});
        }

    }
    catch(err){
        console.log(err);

    }

    

})

route.get('/signout',Authenticate,async(req,res)=>{
try{
   

    res.status(200).clearCookie('jwttoken').json({message: "please fill the details"});
    req.user.tokens=req.user.tokens.filter((elem)=>{
        return elem.token!=req.token;
    })
    req.user.save();
    
   


}catch(e){
    console.log(e)
}
    
})

route.post('/signin',async(req,res)=>{

 

    try{
        const {email,password}= req.body;
        if(!email || !password){
            return res.status(422).json({error: "please fill the details"})
        }
        // password= await bcrypt.hash(password,15)
        const checkdata = await User.findOne({email})
        
        
        
        if(!checkdata){
            return res.status(404).json({error:"User does not exists"})
        }
        else{
            const isSame=await bcrypt.compare(password,checkdata.password)

            const token =await checkdata.generateAuthToken();
           res.cookie("jwttoken",token,{
               maxAge:new Date(Date.now()+ 25892000000),
               path:'/'
            //    httpOnly:true
           })
          
            if(!isSame){
                return res.status(401).json({error:"Wrong Email or Password"})
            }
            else{
                // res.status(200).json({message:"Login Succesfullly"})
                // ======
                const {email,username,name,_id}=checkdata
               
                res.send({email,username,name,_id}).status(200)
                // console.log(username)
            }

        }
    }catch(err){
        console.log(err);
    }
})

module.exports = route;