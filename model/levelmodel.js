let mongoose = require('mongoose');

let levelSchema = new mongoose.Schema({
    name:String,
})

let Level = mongoose.model('leveldb', levelSchema);

module.exports = {Level};