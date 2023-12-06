const mangoose =  require('mongoose');

const UserSchema = new mangoose.Schema({
    username: {type:String , unique:true},
    password : String,
},{timestamp:true}) ;


const UserModel = mangoose.model('User',UserSchema);
module.exports = UserModel;