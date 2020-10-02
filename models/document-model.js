const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
  name:{type:String,default:'',unique:true},
  link:{type:String,default:''},
  doctype:{
    type:Schema.Types.ObjectId,
    ref:'doc_type'
  },
  subject:{
    type:Schema.Types.ObjectId,
    ref:'subject'
  }
});

module.exports = mongoose.model("document",documentSchema);
