const mongoose =  require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    fullName: String,
    userType: String,
    score: { type: Number, required: function() { return this.userType === 'Student'; } },
    favSubject: { type: String, required: function() { return this.userType === 'Student'; } },
    collegeGPA: { type: Number, required: function() { return this.userType === 'Guide'; } },
    expertise: { type: String, required: function() { return this.userType === 'Guide'; } },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    hasJoinedGroup: { type: Boolean, default: false }
}, { timestamps: true });

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;