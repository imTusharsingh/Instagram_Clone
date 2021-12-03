const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    // post:{
    //     type:String,

    // }
    posts: {
        post: {
            type: String
        },
        posttype: {
            type: String
        },
        public_id: {
            type: String
        }

    },
    caption: {
        type: String,
    },
    postedBy: {
        
        type:mongoose.Types.ObjectId,
        ref:'USERDATA'

    },
    likes: [{
        type: String
    }],
    comments: [{
        commentbyuser:String,
        commentedBy: {
            type:mongoose.Types.ObjectId,
            ref:'USERDATA'
        }
      

    }]
})

const Post = mongoose.model("POSTDATA", postSchema);

module.exports = Post;