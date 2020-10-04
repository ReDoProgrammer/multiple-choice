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
  is_actived:{type:Boolean,default:false},
  order:{type:Number,default: 0}
});

module.exports = mongoose.model("group",groupSchema);
