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
        enum:['M','F','x'],
        required:true,
    },
    age: Number,
    nif:{
        type:String,
        required:true,
        unique:true
    },
    photo:{
        type:String,
        required:true,
        unique:true
    },
    is_admin:{
            type:Boolean,
            default:false
        },

})

let User = mongoose.model('userdb', userSchema);

module.exports = User;