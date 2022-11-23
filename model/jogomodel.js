let mongoose = require('mongoose');

let gameSchema = new mongoose.Schema({
    pair1:{
        type: mongoose.Schema.Types.ObjectID,
        required:true
    },
    pair2:{
        type: mongoose.Schema.Types.ObjectID,
        required:false
    },
    phase:{
        type:String,
        required: true
    },
    level: mongoose.Schema.Types.ObjectId,
    group:{
        type:String,
        required: true
    },
    tournament: mongoose.Schema.Types.ObjectId,
    result: {
            pair1: {
                type:Number,
                min:0
            },
            pair2: {
                type:Number,
                min:0
            },
    },
    previous_game1: mongoose.Schema.Types.ObjectID,//Game where pair1 came from
    previous_game2: mongoose.Schema.Types.ObjectID,//Game where pair2 came from
    field: mongoose.Schema.Types.ObjectID, //what field the game will be held
    date_time:Date,   //date and time, where the game will be held
    photo: [String],  //path/url to the photos of the players of the game
    duration: Number, //how long the game will last
})

let Game = mongoose.model('gamedb', gameSchema);

module.exports = Game;