let mongoose = require('mongoose');

let tournamentSchema = new mongoose.Schema({
    name:{
            type:String,
        },
    levels:
        [
            {
                id: mongoose.Schema.Types.ObjectId,

                pair:[{
                    id: mongoose.Schema.Types.ObjectId,
                    group:String,
                    }],
            gender_type: {
                    type: String,
                    enum: ['M','F','MF'],
                    maxLength:2,
                },
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
    hasGroup: Boolean,
    status:Number,
})

let Tournament = mongoose.model('tournamentdb', tournamentSchema);

module.exports = Tournament;