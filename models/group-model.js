const mongoose=require('mongoose');
const Schema = mongoose.Schema;


const groupSchema = new Schema({
  name:{type:String,default:'',unique:true},
  meta:{type:String,default:'',unique:true},
  subjects:[{
      type:Schema.Types.ObjectId,
      ref:'subject'
    }
  ],
  created_by:{
    type:Schema.Types.ObjectId,
    ref:'user'
  },
  is_actived:{type:Boolean,default:false}
});

module.exports = mongoose.model("group",groupSchema);
