var mongoose=require('mongoose');
 
var PendingmessegeSchema = new mongoose.Schema({
    Uid:String,
    data:Object
});
 
module.exports = mongoose.model(
    'Msgusr', PendingmessegeSchema, 'msgusr');