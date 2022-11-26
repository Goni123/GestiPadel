let mongoose = require('mongoose');

let useradminSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    }
})

let UserAdminSchema = mongoose.model('user_admins', useradminSchema);

module.exports = UserAdminSchema;