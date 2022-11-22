let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true,
        unique:true
    },
    nif:{
        type:String,
        required:true,
        unique:true
    },
    photo:{
        type:String,
        required:true,
        unique:true
    }
})

let User = mongoose.model('userdb', userSchema);

module.exports = User;