let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
    },
    phone:{
        type:String,
        unique:true
    },
    gender:{
        type:String,
        enum:['M','F','x'],
        required:true,
    },
    nif:{
        type:String,
        unique:true
    },
    photo:{
        type:String,
        required:true,
    },
})

let User = mongoose.model('users', userSchema);

module.exports = User;