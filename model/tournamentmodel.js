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
    start_time:Date,
    end_time:Date,
    schedule:[
        {
            day:Date,
            start_time:Number,
            end_time:Number,
        }
    ],
    type: {
        type: String,
        enum: [
            'M','F','MF'
        ],
        maxLength:2,
    },
    hasGroup: Boolean
})

let Tournament = mongoose.model('tournamentdb', tournamentSchema);

module.exports = Tournament;