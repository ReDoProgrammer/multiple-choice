const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  name:{type:String,default:'',unique:true},
  meta:{type:String,default:'',unique:true},
  user:{
      type:Schema.Types.ObjectId,
      ref:'user'
    }  
});

module.exports = mongoose.model("comment",commentSchema);
