const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  name:{type:String,default:'',unique:true},
  meta:{type:String,default:'',unique:true},
  group:{
    type: Schema.Types.ObjectId,
    ref:  'group'
  }
});

module.exports = mongoose.model("subject",subjectSchema);
