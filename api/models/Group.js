const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name: String,
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, default: 'waiting' }
}, { timestamps: true });

const GroupModel = mongoose.model('Group', GroupSchema);

module.exports = GroupModel;