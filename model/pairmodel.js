let mongoose = require('mongoose');

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
    tournaments:[
            {
                id: mongoose.Schema.Types.ObjectID,
                pago: {
                    type: Boolean,
                    default: false
                },
                level:mongoose.Schema.Types.ObjectID,
                group: String,
                group_position: Number,
            }
    ]
})

let Pair = mongoose.model('pairdb', pairSchema);

module.exports = Pair;