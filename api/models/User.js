const mangoose =  require('mongoose')

const UserSchema = new mangoose.Schema({
    username: {type:string , unique:true},
    password : String,
},{timestamp:true}) ;

export const UserModel = mangoose.model('User',UserSchema);