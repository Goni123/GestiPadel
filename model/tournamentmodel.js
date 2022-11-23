let mongoose = require('mongoose');

let tournamentSchema = new mongoose.Schema({
    name:{
            type:String,
        },
    levels:
        [
            {
                id: mongoose.Schema.Types.ObjectId,
                groups:[
                    {
                        type:String,
                        maxLength:1,
                    }
                ]
            }
        ],
    schedule:[
        {
            day:Date,
            start_time:Number,
            end_time:Number,
        }
    ],
})

let Tournament = mongoose.model('tournamentdb', tournamentSchema);

module.exports = Tournament;