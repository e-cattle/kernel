var mongoose =  require('mongoose');
var Schema  =  mongoose.Schema;

var AdviceSchema = new Schema();
module.exports= mongoose.model('Advice', AdviceSchema);