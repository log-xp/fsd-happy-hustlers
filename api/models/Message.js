const mangoose = require('mongoose');
const MessageSchema = new mangoose.Schema({
    sender: {type:mangoose.Schema.Types.ObjectId,ref: 'User'},
    recipient : {type:mangoose.Schema.Types.ObjectId,ref:'User'},
    text: String,
    file: String,

},{timestamps:true});

const MessageModel = mangoose.model('Message',MessageSchema);

module.exports = MessageModel;