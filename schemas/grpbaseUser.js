var mongoose=require('mongoose');
 
var GrpBaseUssrSchema = new mongoose.Schema({
    Uid:String,
    part:Array
});
 
module.exports = mongoose.model(
    'grp-user', GrpBaseUssrSchema, 'grp-user');