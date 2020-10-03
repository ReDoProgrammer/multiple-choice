const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const configSchema = new Schema({
  key:{type:String,default:'',unique:true},
  value:{type:String,default:''},
  description:{type:String,default:''}
});

module.exports = mongoose.model('config',configSchema);
