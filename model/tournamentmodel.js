let mongoose = require('mongoose');

let tournamentSchema = new mongoose.Schema({
/*    name:{
        type:String,
        required:true,
        unique:true
        },
    levels:
        [
            {
                id: mongoose.Schema.Types.ObjectId,
                groups:[
                    {
                        type:String,
                        maxLength:3,
                    }
                ]
            }
        ],
    schedule:[
        {
            day:Date,
            start_time:Date,
            end_time:Date,
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
*/
    nometorneio:{
        type:String
    },
    localizacao:{
        type:String
    },
    datainicio:{
        type:Date
    },
    datafim:{
        type:Date,
        required:true,
        
    },
    nparticipantes:{
        type: Number,
        required:true,
    },
    preco:{
        type: Number,
        required:true
    },
    niveltipo:[
        {
        type:String,
        required:true
        }
    ],
    fasegrupos:
        {
        type:String,
        required:true
        }
    ,
    img:{
        data: Buffer,
        contentType: String
    }
})

let Tournament = mongoose.model('tournaments', tournamentSchema);

module.exports = Tournament;
