const mongoose=require('mongoose');

const signupSchema=new mongoose.Schema({
    firstName:{
        type: String,
        required:true,
    },
    lastName:{
        type: String,
        required:true,
    },
    age:{
        type: Number,
        required:true,
    },
    occupation:{
        type: String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    dob:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    }
});

const signup=mongoose.model("profile", signupSchema);
module.exports = signup;