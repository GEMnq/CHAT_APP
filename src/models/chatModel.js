const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var chatSchema = new Schema({
    sender_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },   
},  {timestamp:true},
);

module.exports = mongoose.model('Chat', chatSchema);