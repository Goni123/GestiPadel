let mongoose = require('mongoose');

let levelSchema = new mongoose.Schema({
    name:String,
})

let Level = mongoose.model('levels', levelSchema);

module.exports = {Level};