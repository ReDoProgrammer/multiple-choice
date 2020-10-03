const mongoose=require('mongoose');
const Schema = mongoose.Schema;
var random = require('mongoose-simple-random');

const questionSchema = new Schema({
  question:{type:String,default:''},
  option_a:{type:String,default:''},
  option_b:{type:String,default:''},
  option_c:{type:String,default:''},
  option_d:{type:String,default:''},
  answer:{type:String,default:''},
  description:{type:String,default:''},
  created_by:{
    type:Schema.Types.ObjectId,
    ref:'user'
  },
  censor:{
    type:Schema.Types.ObjectId,
    ref:'user'
  },
  is_actived:{type:Boolean,default:false},
  subject:{type:Schema.Types.ObjectId,ref:'subject'}
});

questionSchema.plugin(random);
module.exports = mongoose.model("question",questionSchema);
