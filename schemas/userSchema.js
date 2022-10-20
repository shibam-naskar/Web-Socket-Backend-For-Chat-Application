var mongoose=require('mongoose');
 
var UserSchema = new mongoose.Schema({
    Uid:String,
    name:String
});
 
module.exports = mongoose.model(
    'users', UserSchema, 'Users');