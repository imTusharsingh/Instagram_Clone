const express = require('express');
const route = express.Router();
const jwt = require('jsonwebtoken');

require('../db/connect');

const User = require("../models/userschema");
const Authenticate = require("../middleware/authenticate");


route.put('/follow', Authenticate, async (req, res) => {
    try {

        const onlineuser = req.user._id;//onlinebanda
        let isalreadyFollowed = null;
        const username = req.body.username;//seenidbanda
        const username_id = req.body.usernameid;
        console.log(username)

        let userdata = await User.findById(onlineuser).populate("following","username");
        
        
        const isfollow = userdata.following;
       

        for (var i = 0; i < isfollow.length; i++) {
            if (isfollow[i].username == username) {
                isalreadyFollowed = true;
                break;
            }
            else {
                isalreadyFollowed = false;
            }
        }

        //  console.log(`isfollow:${isalreadyFollowed}`)

        if (isalreadyFollowed) {
            User.findByIdAndUpdate(onlineuser, {
                $pull: { following: username_id }
            }, { new: true }
            ).exec((err, result) => {
                if (err) {
                    return res.status(422).json({ error: err })

                }
                else {

                    res.json(result.following)
                    // console.log(`result:${result}`)

                }
            })

            User.findByIdAndUpdate(username_id,{
                $pull:{followedBy:onlineuser}
            },{new:true}).exec((err,result)=>{
                if (err) {
                    return res.status(422).json({ error: err })

                }
               
            })
        }
        else if (!isalreadyFollowed) {
            User.findByIdAndUpdate(onlineuser, {
                $push: { following: username_id }
            }, { new: true }
            ).exec((err, result) => {
                if (err) {
                    return res.status(422).json({ error: err })

                }
                else {
                    res.json(result.following)

                }
            })

            User.findByIdAndUpdate(username_id,{
                $push:{followedBy:onlineuser}
            },{new:true}).exec((err,result)=>{
                if (err) {
                    return res.status(422).json({ error: err })

                }
                
            })
        }

    } catch (err) {
        console.log(err);
    }
})

route.post('/suggestion',Authenticate,async(req,res)=>{
    try{
        let userdata = await User.findById(req.user._id).populate("following","username").populate("followedBy","username _id profileImage");
        const followedBy=userdata.followedBy;
        const following=userdata.following;
        let matched=false;
        let filteredarray=[];
        // // console.log(following.length,followedBy)
        for(let i=0;i<followedBy.length || filteredarray.length>5;i++){
            for(let j=0;j<following.length;j++){
                if(followedBy[i].username==following[j].username){
                    matched=true;
                    break;
                }
            }
            if(matched==false){
                let {username,_id,profileImage}=followedBy[i]
                let info="follows you"
                filteredarray.push({username,_id,profileImage,info});
            }
          
            matched=false;
       
        }

      
         

      

      
          
           const data=await User.aggregate([{$sample:{size:4-filteredarray.length}}])
           console.log(data);

           for(let j=0;j<data.length;j++){
           for(let i=0;i<following.length;i++){
              
                   if(following[i].username==data[j].username){
                    matched=true;
                    break;
                   }
                   
                   

               }
               if(matched==true && data[j].username!=req.username){
                let info="followed by you"
                   let {username,_id,profileImage}=data[j]
                   filteredarray.push({username,_id,profileImage,info})
               }
            else if(matched==false  && data[j].username!=req.username){
                let info="new user"
                let {username,_id,profileImage}=data[j]
                filteredarray.push({username,_id,profileImage,info});
            }
            matched=false;
       
        }
      
        

      
        console.log(filteredarray)
        res.send(filteredarray);
    }catch(e){
        console.log(e)
    }
})

module.exports = route;