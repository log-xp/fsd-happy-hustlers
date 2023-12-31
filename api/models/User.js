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
    isAdmin: {type:Boolean, default: false},
    groups: [String],
    hasJoinedGroup: { type: Boolean, default: false },
    needsMentor: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;