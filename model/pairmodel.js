let mongoose = require('mongoose');

let tournamentReferenceSchema= new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectID,
    pago: {
        type: Boolean,
        default: false
    },
    level:mongoose.Schema.Types.ObjectID,
    group: String,
    group_position: Number,
    unavailability:
        [
            {
                time:    Date,
                user: mongoose.Schema.Types.ObjectId,

            }
        ],
    has_ended: {
        type: Boolean,
        default:false
    }
})
let pairSchema = new mongoose.Schema({
    user1:{
        type: mongoose.Schema.Types.ObjectID,
        required:true
    },
    user2:{
        type: mongoose.Schema.Types.ObjectID,
        required:false
    },
    pair_formed:{
        type: Boolean,
        default: false
    },
    tournaments:[ tournamentReferenceSchema ]
})

let Pair = mongoose.model('pair', pairSchema);
let TourRefModel = mongoose.model('tournamentRef',tournamentReferenceSchema)
module.exports = {Pair,TourRefModel};