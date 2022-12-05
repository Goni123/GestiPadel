let mongoose = require('mongoose');

let fieldSchema = new mongoose.Schema({
    name: String,
    location:String,
})

let Field = mongoose.model('fielddb', fieldSchema);

module.exports = Field;