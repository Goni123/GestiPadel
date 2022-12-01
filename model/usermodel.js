let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    phone:{
        type:String,
    },
    nif:{
        type:String
    },
})

let User = mongoose.model('users', userSchema);

module.exports = User;