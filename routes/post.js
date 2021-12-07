const express = require('express');
const route = express.Router();
const jwt = require('jsonwebtoken');
const cloudinary=require('cloudinary')

cloudinary.config({ 
    cloud_name: 'instadata', 
    api_key: '229982477914413', 
    api_secret: '1FDST9BHin4-o2OqtsHEPUa1oYY'
    
  });

require('../db/connect');


const Post = require("../models/postschema");
const User = require("../models/userschema");
const Authenticate = require("../middleware/authenticate");
const { json } = require('express');

route.post("/deletepost",Authenticate,async(req,res)=>{
    try{
        const {public_id}=req.body;
       
        if(!public_id){
            return res.status(422).json({ error: "something went wrong" })
        }
        cloudinary.uploader.destroy(public_id,(err,result)=>{
            console.log(err,result);
        })
       

        Post.deleteOne({"posts.public_id":public_id},(err,result)=>{
            if(err){
                return res.status(422).json({ error: "something went wrong" })
            }
            res.status(201).json({ message: "post deleted" })
           
        })

    }catch(e){
        console.log(e)
    }
})

 route.post("/addpost", Authenticate, async (req, res) => {
     try {
         const { post,caption,posttype,public_id } = req.body;

         if (!post) {
             return res.status(422).json({ error: "please add the post" })
         }


         const addpost = new Post({ 'posts.post':post,'posts.posttype':posttype,"posts.public_id":public_id,caption,"postedBy":req.user._id,"profileImage":req.user.profileImage.image })
         const postadded = await addpost.save();

         if (postadded) {
             res.status(201).json({ message: "post added" })
         }
         else {
             return res.status(500).json({ error: "post failed" })
         }
     } catch (err) {
         console.log(err);
    }


 })




route.get('/mypost/:username', Authenticate, async (req, res) => {
    try {
        const onlineuser = req.username;
        const onlinename =req.name;
        const following =req.following;
        const followedBy=req.followedBy;
        
       

        const finduser= await User.findOne({username:req.params.username})
        const findpost = await Post.find({ "postedBy":finduser._id}).populate("postedBy","username profileImage").populate("comments.commentedBy","username profileImage")

       
        res.send({finduser,findpost})
       
       
    } catch (err) {
        console.log(err)
    }
})

 route.put('/checklikes', Authenticate, async (req, res) => {
     try {
         const onlineuser = req.username;
         let isalreadyLiked;
         const likedone =req.body.post_Id;
         let isLike=await Post.findOne({"_id":likedone});
         isLike = isLike.likes
         // console.log(isLike)

        
   for (var i = 0; i < isLike.length; i++) {
       if (isLike[i] ==onlineuser) {
         isalreadyLiked = true;
         break;
       }
       else{
           isalreadyLiked=false;
       }
     }
       
       
  

   if(isalreadyLiked){

       Post.findByIdAndUpdate(likedone, {
                
           $pull: { likes: onlineuser }
       }, {
           new: true
       }).exec((err, result) => {
           if (err) {
               return res.status(422).json({ error: err })
           }
           else {
               likedby=result.likes
               res.json(result)
                   
               // console.log(`unlike:${likedby}`)

           }
       })

   }
   else if(!isalreadyLiked){

       Post.findByIdAndUpdate(likedone, {
           $push: { likes: onlineuser }
       }, {
           new: true
       }).exec((err, result) => {
           if (err) {
               return res.status(422).json({ error: err })
           }
           else {
               likedby=result.likes
               res.json({result}); 
           }
       })

   }
       

     } catch (err) {
         console.log(err)
     }
 })


route.put('/comment',Authenticate,async(req,res)=>{
    try{
        // const onlineuser = req.username;
        let {commentbyuser,post_id}=req.body;
       const findComment=await Post.findByIdAndUpdate(post_id,{
            $push:{comments:{commentedBy:req.user._id,commentbyuser}}
        },{
            new:true
        })
        console.warn(findComment)
        res.send({findComment})
       
    }catch(err){
        console.log(err);
    }
})

route.get('/followedpost', Authenticate, async (req, res) => {
    const onlineuser_id = req.user._id;
    const onlineuser=req.username;
    const onlinename =req.name;
    let following =req.following;
    following.push(onlineuser_id)
  
    try {
        const followedpost=await Post.find({"postedBy":{$in:following}}).populate("postedBy","username profileImage").populate("comments.commentedBy","username profileImage")
        res.send({followedpost,onlineuser,onlinename});
        
    } catch (err) {
        console.log(err)
    }
})


route.get('/allpostroute', Authenticate, async (req, res) => {
    const onlineuser = req.username;
    const onlinename =req.name;
    const profileImage=req.user.profileImage.image
    try {
        const allpost = await Post.find().populate("postedBy","username profileImage.image").populate("comments.commentedBy","username profileImage");
        
        res.send({allpost,onlineuser,onlinename});
        
    } catch (err) {
        console.log(err)
    }
})

route.post('/editprofile', Authenticate, async (req, res)=>{
    const onlineuser=req.username;
    const image=req.body.secure_url;
    const public_id=req.body.public_id;
    try{
        const user=await User.findOneAndUpdate({username:onlineuser},{
            profileImage:{image,public_id}
        },{
            new:true
        }).exec((err,result)=>{
            if (err) {
                return res.status(422).json({ error: err })
            }
            else {
                res.status(201).json({messgae:"profile updated"});

            }
        })
         

    }catch(e){
        console.log(e)
    }
})

module.exports = route;