const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  name:{type:String,default:'',unique:true},
  meta:{type:String,default:'',unique:true},
  subjects:[{
      type:Schema.Types.ObjectId,
      ref:'subject'
    }
  ]
});

module.exports = mongoose.model("group",groupSchema);
