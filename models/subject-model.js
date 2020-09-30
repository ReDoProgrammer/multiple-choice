const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  name:{type:String,default:''},
  meta:{type:String,default:''},
  group:{
    type: Schema.Types.ObjectId,
    ref:  'group'
  }
});

module.exports = mongoose.model("subject",subjectSchema);
