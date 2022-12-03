let mongoose = require('mongoose');

/*let tournamentReferenceSchema= new mongoose.Schema({
    tid: mongoose.Schema.Types.ObjectID,
    pago: {
        type: Boolean,
        default: false
    },
    level:mongoose.Schema.Types.ObjectID,
    group: String,
    group_position: Number,
    unavailability:[Date],
    has_ended: {
        type: Boolean,
        default:false
    }
})*/
let pairSchema = new mongoose.Schema({
    users:[mongoose.Schema.Types.ObjectID],
    /*pair_formed:{
        type: Boolean,
        default: false
    },*/
    tournaments:[ {
        id: mongoose.Schema.Types.ObjectID,
        pago: {
            type: Boolean,
            default: false
        },
        level: mongoose.Schema.Types.ObjectID,
        group: String,
        group_position: Number,
        unavailability:[Date],
        has_ended: {
            type: Boolean,
            default:false
        }
    } ]
})

let Pair = mongoose.model('pairs', pairSchema);
//let TourRefModel = mongoose.model('tournamentRef',tournamentReferenceSchema)
module.exports = {Pair/*,TourRefModel*/};