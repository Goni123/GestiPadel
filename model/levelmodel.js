let mongoose = require('mongoose');

let levelSchema = new mongoose.Schema({
    name:String,
})

let Level = mongoose.model('level', levelSchema);

module.exports = {Level};