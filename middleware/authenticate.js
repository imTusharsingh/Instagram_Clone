const jwt=require('jsonwebtoken');

const User =require('../models/userschema');


const Authenticate=async(req,res,next)=>{
try{
    
    const token =req.cookies.jwttoken;
    // const token=req.body.token;
    const verifytoken=jwt.verify(token,process.env.SECRET_KEY);
    const rootUser = await User.findOne({_id:verifytoken._id,"tokens.token":token});
    if(!rootUser){
        throw new Error("User not Found")
    }
    req.user=rootUser;
    req.token=token;
    req.username=rootUser.username;
    req.name=rootUser.name;
    req.following=rootUser.following;
    req.followedBy=rootUser.followedBy;

    
    
    next();
}catch(err){
   return res.status(401).send("Unauthorized:No token provided")
    
}


}

module.exports= Authenticate;
