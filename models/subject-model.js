const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  name:{type:String,default:'',unique:true},
  meta:{type:String,default:'',unique:true},
  group:{
    type: Schema.Types.ObjectId,
    ref:  'group'
  },
  question:[{
    type:Schema.Types.ObjectId,
    ref:'question'
  }],
  created_by:{
    type:Schema.Types.ObjectId,
    ref:'user'
  },
  is_actived:{type:Boolean,default:false}
});

module.exports = mongoose.model("subject",subjectSchema);
