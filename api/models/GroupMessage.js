const mongoose = require('mongoose');

const GroupMessageSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    file: String,
}, { timestamps: true });

const GroupMessageModel = mongoose.model('GroupMessage', GroupMessageSchema);

module.exports = GroupMessageModel;
