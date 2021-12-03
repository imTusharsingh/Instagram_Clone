const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    profileImage:{
        image: {
            type: String,
            default:"no image"
        },
        public_id: {
            type: String,
            default:''
        }
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    following:[{
        type:mongoose.Types.ObjectId,
        ref:'USERDATA'
    }],
    followedBy:[{
        type:mongoose.Types.ObjectId,
        ref:'USERDATA'
    }],
    tokens: [
        {
            token:
            {
                type: String,
                required: true
            }
        }
    ]

})

userSchema.pre("save", async function (next) {

    try {

        if (this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 15);
        }
        next();
    } catch (err) {
        console.log(err);
    }

});



userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token})
        await this.save();
        // console.log(token);
        return token;

       
    } catch (err) {
        console.log(err);
    }
}

const User = mongoose.model('USERDATA', userSchema);

module.exports = User;
