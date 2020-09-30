const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  question:{type:String,default:''},
  option_a:{type:String,default:''},
  option_b:{type:String,default:''},
  option_c:{type:String,default:''},
  option_d:{type:String,default:''},
  descryption:{type:String,default:''},
  subject:{
    type: Schema.Types.ObjectId,
    ref:  'subject'
  }
});

module.export = mongoose.model("group",groupSchema);
