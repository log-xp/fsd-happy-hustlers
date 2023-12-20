const mongoose =  require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, required: true },
    fullName: { type: String, required: true },
    favSubject: { type: String },
    examScore: { type: Number },
    areaOfExpertise: { type: String },
    collegeGPA: { type: Number },
}, { timestamps: true });

const UserModel = mongoose.model('User',UserSchema);
module.exports = UserModel;