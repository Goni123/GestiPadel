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
    nif:{
        type:String,
        unique:true
    }
})

let User = mongoose.model('users', userSchema);

module.exports = User;